// Récupère les jeux gratuits, ajoute les traductions, écrit public/data/jeux.json.
//
// Sources (usage commercial autorisé avec lien vers la source, affiché dans l'app) :
//   GamerPower  https://www.gamerpower.com/api-read   jeux offerts + DLC, toutes plateformes
//   FreeToGame  https://www.freetogame.com/api-doc    free-to-play PC / navigateur
// Traductions : API Claude                            (ANTHROPIC_API_KEY)
//
// Sans clé, l'étape correspondante est simplement sautée.
// data/cache.json garde descriptions et traductions d'une exécution à l'autre : seuls les
// nouveaux jeux coûtent des requêtes.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { plateformes as tags } from './plateformes.mjs';
import { nettoyerTitre, memeJeu, pasVraimentGratuit, etiquettesInterdites, francais } from './titres.mjs';
import { euros, estUnLot } from '../public/prix.js';
import { offreGratuite, offreActuelle } from './epic.mjs';
import { aNotifier, messages, envoyer } from './notifications.mjs';

const OUT = new URL('../public/data/jeux.json', import.meta.url);
const DETAILS = new URL('../public/data/jeux/', import.meta.url); // un petit fichier par jeu, chargé à l'ouverture de sa fiche
const MAX_DETAILS_PAR_EXECUTION = 150; // fiches FreeToGame récupérées par passage (le cache garde les autres)
const CACHE = new URL('../data/cache.json', import.meta.url);
const { ANTHROPIC_API_KEY, ONESIGNAL_API_KEY } = process.env;
const LANGUES = ['fr']; // choix du propriétaire : les autres langues gardent l'anglais
const MAX_TRAD_PAR_EXECUTION = 300; // plafond de coût par exécution

const cache = await readFile(CACHE, 'utf8').then(JSON.parse).catch(() => ({}));
cache.ftg ??= {};
const details = new Map(); // id du jeu -> infos de sa fiche
cache.trad ??= {};

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'jeux-gratuits-geekozor/1.0' } });
  if (!res.ok) throw new Error(`${url.replace(/key=[^&]+/, 'key=***')} -> HTTP ${res.status}`);
  return res.json();
}
// Pour les sources secondaires : une panne ne doit pas bloquer toute la mise à jour.
// Une source entière qui casse = alerte ; un seul jeu qui échoue (fiche, page) = simplement réessayé plus tard.
const SOURCES = new Set(['Epic', 'GOG', 'itch.io', 'Nintendo', 'Steam (démos)']);
const alertes = [];
async function facultatif(nom, f) {
  try { await f(); } catch (e) {
    console.warn(`${nom} sauté : ${e.message}`);
    if (SOURCES.has(nom) || nom.startsWith('Catégorie')) alertes.push(`${nom} : ${e.message}`);
  }
}
const cle = (titre) => titre.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
const entites = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 16);


// ---------- 1. Jeux offerts (GamerPower) ----------
// shortcut: GamerPower et la liste FreeToGame restent bloquantes (sans elles l'app serait vide) ;
// en cas de panne le site garde sa version précédente. À revoir si ces pannes deviennent fréquentes.
const sousConditions = new Set(); // id écartés : à oublier, pas à ranger dans l'historique
const offerts = (await getJson('https://www.gamerpower.com/api/giveaways'))
  // Jeu « offert » contre des points ou pour un vieux casque : écarté (Dwarven Realms, Sharknado VR).
  .filter((g) => g.status === 'Active' && !(g.type === 'Game' && pasVraimentGratuit(g.description) && sousConditions.add('gp' + g.id)))
  .map((g) => ({
    id: 'gp' + g.id,
    titre: nettoyerTitre(g.title),
    type: g.type === 'Game' ? 'jeu' : 'dlc',
    valeur: g.worth === 'N/A' ? null : g.worth,
    image: g.image || g.thumbnail,
    description: g.description,
    lien: g.open_giveaway_url,
    plateformes: tags(g.platforms),
    plateformesTexte: g.platforms,
    // GamerPower ne donne que la date (23:59) ; Epic arrête toujours ses jeux offerts à 16:00 UTC.
    fin: g.end_date === 'N/A' ? null
      : /epic/i.test(g.platforms) ? g.end_date.slice(0, 10) + 'T16:00:00Z'
      : g.end_date.replace(' ', 'T'),
    publie: g.published_date.replace(' ', 'T'),
    _instructions: g.instructions,
  }));
for (const g of offerts) { details.set(g.id, { instructions: g._instructions }); delete g._instructions; }

// Jeux offerts que GamerPower rate (souvent des jeux Steam gratuits avant de devenir payants) : data/offerts-manuels.json.
// Une fois la date de fin passée, le jeu sort de la liste (et passe dans l'historique) même s'il reste dans le fichier.
for (const m of JSON.parse(await readFile(new URL('../data/offerts-manuels.json', import.meta.url), 'utf8')).jeux) {
  // fin: null = date de fin non annoncée : le jeu reste jusqu'à ce qu'on le retire du fichier.
  if ((m.fin && new Date(m.fin) <= Date.now()) || offerts.some((g) => memeJeu(g.titre, m.titre))) continue;
  const { instructions, ...g } = m;
  const id = 'main' + cle(m.titre);
  offerts.push({ id, type: 'jeu', valeur: null, ...g });
  details.set(id, { instructions });
}

// ---------- 1 bis. Epic en direct : heure de fin exacte + jeux gratuits de la semaine prochaine ----------
// Adresse publique non documentée, utilisée par la page « Jeux gratuits » d'Epic.
const bientot = [];
await facultatif('Epic', async () => {
  const jeux = (await getJson('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=FR'))
    .data.Catalog.searchStore.elements;
  let offertsEpic = 0;
  for (const e of jeux) {
    const actuelle = offreActuelle(e.promotions?.promotionalOffers);
    const prochaine = offreGratuite(e.promotions?.upcomingPromotionalOffers); // voir scripts/epic.mjs
    const valeur = e.price?.totalPrice?.fmtPrice?.originalPrice ?? null;
    const slug = e.catalogNs?.mappings?.[0]?.pageSlug ?? e.productSlug;
    const image = e.keyImages?.find((k) => k.type === 'OfferImageWide') ?? e.keyImages?.[0];
    const fiche = {
      id: 'epic' + e.id, titre: e.title, description: e.description, valeur,
      image: image?.url, lien: `https://store.epicgames.com/p/${slug}`,
      plateformes: ['pc'], plateformesTexte: 'PC, Epic Games Store',
    };
    if (actuelle && e.price?.totalPrice?.discountPrice === 0) { // offert en ce moment : on prend son heure de fin réelle
      offertsEpic++;
      const deja = offerts.filter((g) => /epic/i.test(g.plateformesTexte) && memeJeu(g.titre, e.title));
      for (const g of deja) {
        g.fin = actuelle.endDate;
        if (euros(valeur)) g.valeur = valeur; // vrai prix Epic en euros (country=FR), pas le prix en dollars de GamerPower
      }
      // GamerPower met parfois des heures à lister le jeu du jeudi (Mark of the Deep, 19/11/2026) : en attendant, on le prend chez Epic.
      if (!deja.length && euros(valeur) !== 0) offerts.push({ ...fiche, type: 'jeu', publie: actuelle.startDate, fin: actuelle.endDate });
    }
    // discountPercentage 0 = prix final nul (sinon c'est une simple promo) ; prix d'origine « 0 » = déjà free-to-play (Firestone).
    if (prochaine?.discountSetting?.discountPercentage === 0 && euros(valeur) !== 0) {
      bientot.push({ ...fiche, type: 'bientot', debut: prochaine.startDate, fin: prochaine.endDate });
    }
  }
  // Epic offre toujours au moins un jeu : si on n'en lit aucun, c'est que le flux a changé de forme -> e-mail d'alerte.
  if (!offertsEpic) throw new Error('aucun jeu offert lu dans le flux : son format a peut-être changé');
});
// Seulement ce qu'Epic annonce maintenant : un jeu retiré de son flux avant le jour J n'est pas offert
// (Alien: Isolation, annoncé pour le 19/11/2026, retiré le 16, jamais donné).

// ---------- 2. Free-to-play PC (FreeToGame) ----------
// FreeToGame ne donne qu'un genre principal (Fortnite = Shooter) : on complète avec ses catégories.
// Seulement les catégories qui sont des genres (pas les thèmes comme fantasy, sci-fi, 3d, pvp…).
const CATEGORIES = {
  'battle-royale': 'Battle Royale', shooter: 'Shooter', mmorpg: 'MMORPG', moba: 'MOBA', strategy: 'Strategy',
  'action-rpg': 'Action RPG', fighting: 'Fighting', racing: 'Racing', sports: 'Sports', card: 'Card Game',
  survival: 'Survival', horror: 'Horror', 'open-world': 'Open World', sandbox: 'Sandbox',
  'tower-defense': 'Tower Defense', social: 'Social',
};
const categoriesDe = new Map(); // id du jeu -> genres de ses catégories
await Promise.all(Object.entries(CATEGORIES).map(([cat, nom]) => facultatif(`Catégorie ${cat}`, async () => {
  for (const g of await getJson(`https://www.freetogame.com/api/games?category=${cat}`)) {
    categoriesDe.set(g.id, [...(categoriesDe.get(g.id) ?? []), nom]);
  }
})));
const f2p = (await getJson('https://www.freetogame.com/api/games?sort-by=popularity')).map((g) => {
  const genre = { ARPG: 'Action RPG', MMOARPG: 'Action RPG', Card: 'Card Game', 'Action Game': 'Action' }[g.genre.trim()] ?? g.genre.trim();
  return {
    id: 'ftg' + g.id,
    titre: g.title,
    image: g.thumbnail,
    description: g.short_description,
    lien: g.game_url,
    // genre principal d'abord : c'est lui que les cartes affichent en premier
    genres: [...new Set([genre, ...(categoriesDe.get(g.id) ?? []).sort()])],
    plateformes: /browser/i.test(g.platform) ? ['navigateur'] : ['pc'],
    editeur: g.publisher,
  };
});

// Fiches détaillées FreeToGame : quelques-unes par passage, gardées en cache.
const manquantes = f2p.map((g) => g.id.slice(3)).filter((id) => !cache.ftg[id]).slice(0, MAX_DETAILS_PAR_EXECUTION);
for (let i = 0; i < manquantes.length; i += 5) {
  await Promise.all(manquantes.slice(i, i + 5).map((id) => facultatif(`Fiche FreeToGame ${id}`, async () => {
    const d = await getJson(`https://www.freetogame.com/api/game?id=${id}`);
    cache.ftg[id] = {
      descriptionLongue: d.description,
      captures: (d.screenshots ?? []).map((x) => x.image),
      config: d.minimum_system_requirements,
      sortie: d.release_date,
      developpeur: d.developer,
    };
  })));
}
for (const g of f2p) if (cache.ftg[g.id.slice(3)]) details.set(g.id, cache.ftg[g.id.slice(3)]);

// ---------- 2 bis. GOG : jeux gratuits (vont en Free-to-play) et démos ----------
// Catalogue public non documenté du site GOG. Certains « gratuits » sont des mods qui demandent le jeu
// payant d'origine (ex. Fallout: London) : seule leur description le dit, d'où la lecture de leur fiche (cache).
const demos = [];
cache.gogMod ??= {};
await facultatif('GOG', async () => {
  const deja = new Set(f2p.map((g) => cle(g.titre)));
  for (let page = 1; page <= 6; page++) {
    const r = await getJson(`https://catalog.gog.com/v1/catalog?limit=100&page=${page}&price=between:0,0&productType=in:game&order=desc:trending`);
    for (const p of r.products) {
      if (/^test\b/i.test(p.title) || /\bredkit\b/i.test(p.title)) continue; // pages de test, outils
      const demo = /\bdemo\b/i.test(p.title);
      if (!demo && deja.has(cle(p.title))) continue; // déjà là via FreeToGame
      const g = {
        id: 'gog' + p.id, type: demo ? 'demo' : undefined, titre: p.title,
        image: p.coverHorizontal, lien: p.storeLink,
        genres: (p.genres ?? []).map((x) => x.name).slice(0, 4),
        plateformes: p.operatingSystems?.includes('windows') || p.operatingSystems?.includes('linux') ? ['pc'] : [],
        plateformesTexte: 'PC, GOG', editeur: p.publishers?.[0],
      };
      details.set(g.id, {
        captures: (p.screenshots ?? []).slice(0, 8).map((c) => c.replace('{formatter}', 'ggvgl')),
        developpeur: p.developers?.[0], sortie: p.releaseDate?.replaceAll('.', '-'),
      });
      if (!demo && !(p.id in cache.gogMod)) {
        await facultatif(`Fiche GOG ${p.title}`, async () => {
          cache.gogMod[p.id] = pasVraimentGratuit((await getJson(`https://api.gog.com/v2/games/${p.id}?locale=en-US`)).description ?? '');
        });
      }
      if (!demo && cache.gogMod[p.id] !== false) continue; // mod, ou pas encore vérifié : on attend
      (demo ? demos : f2p).push(g);
    }
    if (page >= r.pages) break;
  }
});

// ---------- 2 bis bis. Démos Switch / Switch 2 (recherche de la boutique Nintendo Europe) ----------
// Moteur de recherche public du site nintendo.com, non documenté, sans clé. Les 150 démos les plus téléchargées.
await facultatif('Nintendo', async () => {
  const fq = encodeURIComponent('type:GAME AND demo_availability:true AND system_type:nintendoswitch* AND downloads_rank_i:[* TO *] AND -eshop_removed_b:true');
  const r = await getJson(`https://searching.nintendo-europe.com/en/select?q=*&fq=${fq}&sort=downloads_rank_i%20asc&rows=150&wt=json`);
  const parCle = new Map();
  for (const d of r.response.docs) {
    const plateforme = d.system_type.some((s) => s.startsWith('nintendoswitch2')) ? 'switch2' : 'switch';
    const deja = parCle.get(cle(d.title)); // même jeu en version Switch et Switch 2
    if (deja) { deja.plateformes = [...new Set([...deja.plateformes, plateforme])]; continue; }
    const g = {
      id: 'nin' + d.fs_id, type: 'demo', titre: d.title,
      image: d.image_url_h16x9_s ?? d.image_url_h2x1_s ?? d.image_url,
      lien: 'https://www.nintendo.com' + d.url, description: d.excerpt ?? '',
      genres: (d.pretty_game_categories_txt ?? []).slice(0, 3), plateformes: [plateforme],
      plateformesTexte: plateforme === 'switch2' ? 'Switch 2, eShop' : 'Switch, eShop', editeur: d.publisher,
    };
    details.set(g.id, { sortie: d.dates_released_dts?.[0]?.slice(0, 10), descriptionLongue: d.product_catalog_description_s });
    parCle.set(cle(d.title), g);
    demos.push(g);
  }
  // Même recherche dans chaque langue : Nintendo fournit déjà le texte traduit et la page du bon pays.
  const nin = demos.filter((g) => g.id.startsWith('nin'));
  for (const [langue, pays] of [['fr', 'fr'], ['de', 'de'], ['it', 'it'], ['es', 'es']]) {
    await facultatif(`Nintendo (${langue})`, async () => {
      const ids = encodeURIComponent(`fs_id:(${nin.map((g) => g.id.slice(3)).join(' OR ')})`);
      const docs = (await getJson(`https://searching.nintendo-europe.com/${pays}/select?q=*&fq=${ids}&rows=${nin.length}&wt=json&fl=fs_id,url,excerpt,product_catalog_description_s`)).response.docs;
      for (const d of docs) {
        const g = nin.find((x) => x.id === 'nin' + d.fs_id);
        if (!g) continue;
        (g.liens ??= {})[langue] = 'https://www.nintendo.com' + d.url;
        if (d.excerpt) (g.trad ??= {})[langue] = d.excerpt;
        const f = details.get(g.id);
        if (f && d.product_catalog_description_s) (f.tradLongue ??= {})[langue] = d.product_catalog_description_s;
      }
    });
  }
});

// ---------- 2 bis ter. Démos Steam (page de recherche de la boutique, filtre « Démos ») ----------
// Non documenté, sans clé. La recherche donne nom, petite image et lien ; la fiche (appdetails) donne
// grande image, description et vidéos : lue une fois par démo, 40 par passage (Steam limite le débit).
cache.steamDemo ??= {};
await facultatif('Steam (démos)', async () => {
  const deja = new Set(demos.map((g) => cle(g.titre)));
  let fiches = 0; // shortcut: 60 fiches par passage, la liste complète est lue en 2 passages (Steam limite le débit)
  for (let start = 0; start < 100; start += 50) {
    const { results_html: html } = await getJson(`https://store.steampowered.com/search/results/?query=&start=${start}&count=50&category1=10&infinite=1&cc=us&l=english`);
    for (const [, lien, id, bloc] of html.matchAll(/<a href="(https:\/\/store\.steampowered\.com\/app\/\d+\/[^"?]*)[^"]*"\s+data-ds-appid="(\d+)"([\s\S]*?)<\/a>/g)) {
      const titre = entites(bloc.match(/<span class="title">([^<]+)/)?.[1] ?? '').trim();
      if (!titre || deja.has(cle(titre))) continue;
      deja.add(cle(titre));
      // regle2 : fiche relue avec la règle VF du 20/11/2026 (voix déclarées en trop de langues = pas fiable).
      const c = cache.steamDemo[id];
      if ((!c || !('fr' in c) || (c.fr === 'vf' && !c.regle2)) && fiches++ < 60) {
        await facultatif(`Fiche démo Steam ${titre}`, async () => {
          const d = (await getJson(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=english`))[id]?.data;
          if (!d) throw new Error('fiche vide');
          cache.steamDemo[id] = {
            adulte: (d.content_descriptors?.ids ?? []).some((x) => x === 3 || x === 4), // contenu sexuel, nudité
            langueOk: /English|French/.test(d.supported_languages ?? ''), // sinon injouable pour nos lecteurs
            fr: francais(d.supported_languages), regle2: true,
            image: d.header_image, description: entites(d.short_description ?? ''),
            genres: (d.genres ?? []).map((x) => x.description).slice(0, 3), developpeur: d.developers?.[0],
            videos: (d.movies ?? []).filter((m) => m.hls_h264).slice(0, 3).map((m) => ({ nom: m.name, hls: m.hls_h264, miniature: m.thumbnail })),
            captures: (d.screenshots ?? []).slice(0, 8).map((c) => c.path_full),
          };
        });
      }
      const f = cache.steamDemo[id];
      if (f?.adulte || f?.langueOk === false) continue;
      const g = {
        id: 'sdemo' + id, type: 'demo', titre, lien,
        image: f?.image ?? bloc.match(/<img src="([^"]+)"/)?.[1], description: f?.description ?? '',
        genres: f?.genres ?? [], plateformes: ['pc'], plateformesTexte: 'PC, Steam',
      };
      if (f?.fr) g.fr = f.fr;
      if (f) details.set(g.id, { videos: f.videos, captures: f.captures, developpeur: f.developpeur, source: f.videos.length ? 'Steam' : undefined });
      demos.push(g);
    }
  }
});

// Démos GOG, Nintendo et Steam en alternance (chacune déjà classée par popularité) plutôt que l'une après l'autre.
{
  const groupes = Object.values(Object.groupBy(demos, (g) => g.id.match(/^[a-z]+/)[0]));
  const melange = [];
  for (let i = 0; groupes.some((x) => i < x.length); i++) for (const x of groupes) if (i < x.length) melange.push(x[i]);
  demos.splice(0, demos.length, ...melange);
}

// ---------- 2 ter. itch.io : jeux indés gratuits les mieux notés (flux RSS officiel) ----------
// itch.io masque déjà de ses flux les jeux qu'il classe « adultes ». En plus : mots-clés (jeux qui se
// déclarent 18+) et étiquettes de la page du jeu (fangame, nsfw…), lues une fois puis gardées en cache.
cache.itchEtiquettes ??= {};
const ADULTE = /(^|\W)18\+|\b(nsfw|adults?|hentai|porn|sexy?|sexual|erotic|nud(e|ity)|lewd|fetish)\b/i;
const indes = [];
let indesOk = false;
await facultatif('itch.io', async () => {
  const texte = (x, balise) => x.match(new RegExp(`<${balise}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${balise}>`))?.[1]?.trim() ?? '';
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`https://itch.io/games/top-rated/free.xml?page=${page}`, { headers: { 'User-Agent': 'jeux-gratuits-geekozor/1.0' } });
    if (!res.ok && indes.length) { console.warn(`itch.io page ${page} -> HTTP ${res.status} : liste partielle`); break; }
    if (!res.ok) throw new Error(`itch.io -> HTTP ${res.status}`);
    for (const item of (await res.text()).split('<item>').slice(1)) {
      const titreComplet = entites(texte(item, 'title'));
      const description = entites(texte(item, 'description').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
      if (ADULTE.test(titreComplet) || ADULTE.test(description)) continue;
      const etiquettes = [...titreComplet.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
      const plateformesItch = texte(item, 'platforms');
      indes.push({
        id: 'itch' + cle(texte(item, 'link')).slice(-40), type: 'inde', titre: entites(texte(item, 'plainTitle')).replace(/[​-‍﻿]/g, ''), // caractères invisibles
        image: texte(item, 'imageurl'), lien: texte(item, 'link'), description,
        genres: etiquettes.filter((e) => !/^(free|windows|macos|linux|android|ios|html5?|web)$/i.test(e)).slice(0, 2),
        plateformes: [
          ...(/windows|osx|linux/.test(plateformesItch) ? ['pc'] : []),
          ...(/android/.test(plateformesItch) ? ['mobile'] : []),
          ...(/html/.test(plateformesItch) ? ['navigateur'] : []),
        ],
        plateformesTexte: 'itch.io',
      });
    }
  }
  for (const g of indes) {
    if (g.lien in cache.itchEtiquettes) continue;
    await facultatif(`Page itch.io ${g.titre}`, async () => {
      const res = await fetch(g.lien, { headers: { 'User-Agent': 'jeux-gratuits-geekozor/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      cache.itchEtiquettes[g.lien] = [...(await res.text()).matchAll(/href="https:\/\/itch\.io\/games\/tag-([a-z0-9-]+)"/g)].map((m) => m[1]);
    });
  }
  // Jeu non vérifié (page injoignable) : écarté jusqu'au prochain passage.
  indes.splice(0, indes.length, ...indes.filter((g) => cache.itchEtiquettes[g.lien] && !etiquettesInterdites(cache.itchEtiquettes[g.lien])));
  indesOk = indes.length > 0;
});
// itch.io (Cloudflare) répond parfois HTTP 429 : on garde la dernière liste valide plutôt qu'un onglet vide.
// L'alerte e-mail part quand même (facultatif), pour savoir que la liste n'est plus fraîche.
cache.indes ??= [];
if (indesOk) cache.indes = indes;
else indes.splice(0, indes.length, ...cache.indes);

// ---------- 2 quater. Jeux libres (open source) : liste faite à la main, data/jeux-libres.json ----------
const libres = JSON.parse(await readFile(new URL('../data/jeux-libres.json', import.meta.url), 'utf8'))
  .map((g) => ({ ...g, id: 'libre' + cle(g.titre), type: 'libre' }));

// ---------- 3. Free-to-play consoles : liste faite à la main, data/f2p-consoles.json ----------
// Aucune source libre et fiable ne donne les consoles des free-to-play (FreeToGame = PC seulement) ; ça bouge peu.
const consoles = JSON.parse(await readFile(new URL('../data/f2p-consoles.json', import.meta.url), 'utf8')).jeux;
const f2pParCle = new Map(f2p.map((g) => [cle(g.titre), g]));
for (const c of consoles) {
  const existant = f2pParCle.get(cle(c.titre));
  if (existant) existant.plateformes = [...new Set([...existant.plateformes, ...c.plateformes])];
  else if (c.description && c.lien) {
    const { captures, ...jeu } = c; // captures : seulement dans la fiche, pas dans jeux.json
    f2p.push({ ...jeu, id: 'console' + cle(c.titre) });
    if (captures) details.set('console' + cle(c.titre), { captures });
  }
  else alertes.push(`f2p-consoles.json : « ${c.titre} » n'existe plus dans FreeToGame, ajouter description et lien`);
}

// ---------- 3 bis. Vidéos et captures (boutique Steam) ----------
// API non documentée mais publique et sans clé ; Steam limite à ~200 requêtes / 5 min,
// d'où le plafond par passage et le cache (null = jeu absent de Steam, on ne recherche plus).
cache.steam ??= {};
const MAX_STEAM_PAR_EXECUTION = 60; // 2 requêtes par jeu
let steamFaits = 0;
// Nom à chercher sur Steam / Xbox : « Pikmin 4 – Nintendo Switch 2 Edition + Dandori Academy » -> « Pikmin 4 ».
const nomRecherche = (g) => (g.id.startsWith('nin')
  ? g.titre.replace(/[™®]/g, '').replace(/\s*[–-]?\s*(nintendo switch( 2)?|complete|definitive|deluxe|ultimate) edition.*$/i, '').trim()
  : g.titre.replace(/\s*\(mobile\)$/i, '')); // offres mobiles d'Epic : « Lonesome Village (Mobile) »
const demosNintendo = demos.filter((g) => g.id.startsWith('nin'));
// Les jeux libres d'abord : peu nombreux, et sans image tant que Steam ne leur en a pas donné.
for (const g of [...libres, ...bientot, ...offerts.filter((o) => o.type === 'jeu'), ...f2p, ...demosNintendo]) {
  const nom = nomRecherche(g);
  const k = cle(nom);
  // Fiches lues avant le badge français (sans « fr ») : relues peu à peu, dans le même plafond.
  // regle2 : fiche relue avec la règle VF du 20/11/2026 et le prix en euros (60 par passage, les offres d'abord).
  if (!(k in cache.steam) || (cache.steam[k] && !cache.steam[k].regle2)) {
    if (steamFaits++ >= MAX_STEAM_PAR_EXECUTION) continue;
    await facultatif(`Steam ${nom}`, async () => {
      const r = await getJson(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(nom)}&cc=FR&l=english`);
      const app = r.items?.find((i) => memeJeu(nom, i.name)); // dans le doute, rien plutôt qu'un mauvais jeu
      if (!app) { cache.steam[k] = null; return; }
      const d = (await getJson(`https://store.steampowered.com/api/appdetails?appids=${app.id}&cc=fr&l=english`))[app.id]?.data;
      if (d?.type !== 'game') { cache.steam[k] = null; return; } // un DLC ou un pack du même nom
      const p = d.price_overview;
      cache.steam[k] = {
        image: d.header_image, fr: francais(d.supported_languages), regle2: true,
        // Prix normal (avant promo) de la boutique Steam France, au format d'Epic : « €19.99 ».
        prix: p?.currency === 'EUR' ? '€' + (p.initial / 100).toFixed(2) : null,
        videos: (d?.movies ?? []).filter((m) => m.hls_h264).slice(0, 3).map((m) => ({ nom: m.name, hls: m.hls_h264, miniature: m.thumbnail })),
        captures: (d?.screenshots ?? []).slice(0, 8).map((c) => c.path_full),
      };
    });
  }
  const s = cache.steam[k];
  if (!s) continue;
  g.image ??= s.image;
  if (s.fr) g.fr = s.fr; // badge « VF » / « FR »
  // Offre sur Steam : le vrai prix en euros de Steam plutôt que le prix en dollars de GamerPower.
  if (g.type === 'jeu' && s.prix && /steam/i.test(g.plateformesTexte ?? '')) g.valeur = s.prix;
  const d = details.get(g.id) ?? {};
  details.set(g.id, { ...d, videos: s.videos, captures: s.captures.length ? s.captures : d.captures });
}

// ---------- 3 ter. Jeux absents de Steam : boutique Xbox (Fortnite, Valorant, Roblox…) ----------
// Catalogue Microsoft Store : non documenté mais public, sans clé. Seul le CDN cdn.trailers.xboxservices.com
// accepte qu'un autre site lise ses vidéos (l'autre, cdn-dynmedia, répond 403).
cache.xbox ??= {};
const MAX_XBOX_PAR_EXECUTION = 60;
let xboxFaits = 0;
const XBOX = 'https://displaycatalog.mp.microsoft.com/v7.0';
for (const g of [...offerts.filter((o) => o.type === 'jeu'), ...f2p, ...demosNintendo]) {
  const nom = nomRecherche(g);
  const k = cle(nom);
  if (cache.steam[k] !== null) continue; // sur Steam, ou pas encore cherché sur Steam
  if (!(k in cache.xbox)) {
    if (xboxFaits++ >= MAX_XBOX_PAR_EXECUTION) continue;
    await facultatif(`Xbox ${nom}`, async () => {
      const r = await getJson(`${XBOX}/productFamilies/autosuggest?market=FR&languages=fr-fr&productFamilyNames=Games&query=${encodeURIComponent(nom)}`);
      const p = r.Results?.flatMap((x) => x.Products).find((x) => x.Type === 'Game' && memeJeu(nom, x.Title));
      if (!p) { cache.xbox[k] = null; return; }
      const L = (await getJson(`${XBOX}/products?bigIds=${p.ProductId}&market=FR&languages=fr-fr`)).Products?.[0]?.LocalizedProperties?.[0];
      cache.xbox[k] = {
        videos: (L?.CMSVideos ?? []).filter((v) => /^https:\/\/cdn\.trailers\.xboxservices\.com\//.test(v.HLS)).slice(0, 3)
          .map((v) => ({ nom: v.PreviewImage?.Caption ?? g.titre, hls: v.HLS, miniature: `https:${v.PreviewImage?.Uri}?w=640` })),
        image: (L?.Images ?? []).filter((i) => /^(SuperHeroArt|TitledHeroArt)$/.test(i.ImagePurpose)).map((i) => `https:${i.Uri}?w=640`)[0],
        captures: (L?.Images ?? []).filter((i) => i.ImagePurpose === 'Screenshot').slice(0, 8).map((i) => `https:${i.Uri}?w=1280`),
      };
    });
  }
  const x = cache.xbox[k];
  if (!x) continue;
  g.image ??= x.image; // jeux de la liste consoles sans image
  const d = details.get(g.id) ?? {};
  details.set(g.id, { ...d, videos: x.videos, captures: x.captures.length ? x.captures : d.captures, source: 'Xbox' });
}
for (const g of [...offerts, ...bientot, ...f2p, ...indes, ...demos, ...libres]) {
  const d = details.get(g.id);
  if (d?.videos?.length && !d.source) d.source = 'Steam';
}

// ---------- 3 quater. Liste faite à la main : bandes-annonces YouTube (data/bandes-annonces.json) ----------
// YouTube permet d'intégrer une vidéo connue sans clé ; on vérifie seulement qu'elle existe toujours.
const bandesAnnonces = JSON.parse(await readFile(new URL('../data/bandes-annonces.json', import.meta.url), 'utf8'));
for (const g of f2p) {
  const id = bandesAnnonces[g.titre];
  const d = details.get(g.id) ?? {};
  if (!id || d.videos?.length) continue;
  await facultatif(`YouTube ${g.titre}`, async () => {
    const o = await getJson(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}`);
    details.set(g.id, { ...d, videos: [{ nom: o.title, youtube: id, miniature: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }], sourceVideo: 'YouTube' });
  });
}

// ---------- 4. Traductions (Claude) ----------
if (ANTHROPIC_API_KEY) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();
  const aTraduire = [...new Map([...offerts, ...bientot, ...f2p, ...indes, ...demos, ...libres]
    .filter((g) => g.description && !g.trad && !cache.trad[hash(g.description)])
    .map((g) => [hash(g.description), g.description])).entries()]
    .slice(0, MAX_TRAD_PAR_EXECUTION);

  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', ...LANGUES],
          properties: Object.fromEntries(['id', ...LANGUES].map((l) => [l, { type: 'string' }])),
        },
      },
    },
  };

  for (let i = 0; i < aTraduire.length; i += 25) {
    const lot = aTraduire.slice(i, i + 25).map(([id, texte]) => ({ id, texte }));
    try {
      const res = await client.beta.messages.create({
        model: 'claude-opus-5-5',
        max_tokens: 16000,
        output_config: { effort: 'low', format: { type: 'json_schema', schema } },
        // Si Claude refuse un lot, l'API le relance automatiquement sur un modèle de secours.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system: 'Tu traduis des descriptions courtes de jeux vidéo pour une app grand public. '
          + 'Pour chaque texte anglais, donne une traduction naturelle en français (fr). '
          + 'Garde les noms de jeux, de boutiques et de plateformes tels quels. '
          + 'Renvoie le même id.',
        messages: [{ role: 'user', content: JSON.stringify(lot) }],
      });
      if (res.stop_reason !== 'end_turn') { console.warn(`Lot ${i / 25 + 1} ignoré : ${res.stop_reason}`); continue; }
      const texte = res.content.find((b) => b.type === 'text')?.text;
      for (const t of JSON.parse(texte).items) {
        if (lot.some((l) => l.id === t.id)) cache.trad[t.id] = Object.fromEntries(LANGUES.map((l) => [l, t[l]]));
      }
    } catch (e) {
      console.warn(`Lot ${i / 25 + 1} en échec, réessayé à la prochaine exécution : ${e.message}`);
    }
  }
} else {
  console.warn('ANTHROPIC_API_KEY absente : descriptions laissées en anglais.');
}

for (const g of [...offerts, ...bientot, ...f2p, ...indes, ...demos, ...libres]) {
  const t = g.description && cache.trad[hash(g.description)];
  if (t) g.trad = t;
}
// Descriptions longues : traduites à la main dans une conversation (pas par l'API), rangées dans le même cache.
for (const d of details.values()) {
  const t = d.descriptionLongue && !d.tradLongue && cache.trad[hash(d.descriptionLongue)];
  if (t) d.tradLongue = t;
  const ti = d.instructions && cache.trad[hash(d.instructions)];
  if (ti) d.tradInstructions = ti;
}

// ---------- Historique des jeux offerts ----------
// Les sources ne donnent que les offres en cours : on note chaque jeu offert pendant l'offre (cache.offresVues),
// et quand il disparaît de GamerPower il passe dans cache.historique (le cache est commité par le workflow).
cache.offresVues ??= {};
for (const id of sousConditions) delete cache.offresVues[id];
cache.historique ??= [];
cache.historiqueDepuis ??= new Date().toISOString();
const offertsJeux = offerts.filter((g) => g.type === 'jeu');
for (const g of offertsJeux) {
  cache.offresVues[g.id] = {
    id: g.id, titre: g.titre, valeur: g.valeur, plateformes: g.plateformes, plateformesTexte: g.plateformesTexte,
    debut: cache.offresVues[g.id]?.debut ?? g.publie, fin: g.fin,
  };
}
// Liste vide = sans doute un raté de GamerPower : on ne vide pas tout dans l'historique.
if (offertsJeux.length) {
  const actifs = new Set(offertsJeux.map((g) => g.id));
  for (const [id, g] of Object.entries(cache.offresVues)) {
    if (actifs.has(id)) continue;
    // Même jeu toujours offert sous un autre id (pris chez Epic, puis listé par GamerPower) : pas une fin d'offre.
    if (offertsJeux.some((o) => memeJeu(o.titre, g.titre))) { delete cache.offresVues[id]; continue; }
    // Retiré avant sa date de fin (ou sans date) : on note le moment où il a disparu.
    cache.historique.unshift({ ...g, fin: g.fin && new Date(g.fin) < Date.now() ? g.fin : new Date().toISOString() });
    delete cache.offresVues[id];
  }
}

// ---------- Exclusions faites à la main (data/exclusions.json) ----------
const exclus = new Set(JSON.parse(await readFile(new URL('../data/exclusions.json', import.meta.url), 'utf8')).titres.map(cle));
for (const liste of [offerts, bientot, f2p, indes, demos, libres]) {
  liste.splice(0, liste.length, ...liste.filter((g) => !exclus.has(cle(g.titre))));
}

// ---------- Notifications push (OneSignal), seulement avec la clé (pas depuis le PC) ----------
// Premier passage : on retient les jeux déjà là sans rien envoyer (sinon 30 notifications d'un coup).
// shortcut: si le 2e envoi échoue, le 1er repart au passage suivant ; à revoir si OneSignal tombe souvent.
if (ONESIGNAL_API_KEY) {
  const { nouveaux, finissants, vus } = aNotifier(offerts, cache.notifies ?? {});
  try {
    if (cache.notifies) for (const m of messages(nouveaux, finissants)) await envoyer(ONESIGNAL_API_KEY, m);
    cache.notifies = vus;
  } catch (e) { alertes.push(`OneSignal : ${e.message}`); }
}

// ---------- Santé des sources : si l'une casse ou ne renvoie plus rien, l'automatisation GitHub échoue
// (après la publication) et GitHub prévient par e-mail. ----------
const vides = Object.entries({
  'GOG': !demos.some((g) => g.id.startsWith('gog')), 'Nintendo': !demos.some((g) => g.id.startsWith('nin')),
  'Steam (démos)': !demos.some((g) => g.id.startsWith('sdemo')), 'itch.io': !indes.length,
})
  .filter(([, vide]) => vide).map(([nom]) => `${nom} : aucun résultat`);
alertes.push(...vides);
const ALERTES = new URL('../data/alertes.txt', import.meta.url);
await (alertes.length ? writeFile(ALERTES, alertes.join('\n') + '\n') : rm(ALERTES, { force: true }));
if (alertes.length) console.warn('ALERTES :\n' + alertes.join('\n'));

// ---------- Écriture ----------
await mkdir(new URL('.', OUT), { recursive: true });
await mkdir(new URL('.', CACHE), { recursive: true });
const historique = cache.historique.filter((g) => !exclus.has(cle(g.titre)));
await writeFile(OUT, JSON.stringify({
  maj: new Date().toISOString(), offerts, bientot, f2p, indes, demos, libres,
  // shortcut: seuls les 200 derniers vont dans l'app (poids du fichier) ; le total compte tout l'historique.
  historique: historique.slice(0, 200), historiqueNb: historique.length,
  // Total en euros, sans les lots (« Free itch.io Games Bundle » : 116 jeux pour 384 $).
  historiqueTotal: Math.round(historique.reduce((s, g) => s + (estUnLot(g) ? 0 : euros(g.valeur) ?? 0), 0)), historiqueDepuis: cache.historiqueDepuis,
}));
await writeFile(CACHE, JSON.stringify(cache));
await rm(DETAILS, { recursive: true, force: true });
await mkdir(DETAILS, { recursive: true });
// Les id viennent en partie des sources : un id du genre « ../x » écrirait hors du dossier, donc on l'écarte.
await Promise.all([...details].filter(([id]) => /^[\w-]+$/.test(id)).map(([id, d]) => writeFile(new URL(`${id}.json`, DETAILS), JSON.stringify(d))));
console.log(`${offerts.length} offerts, ${bientot.length} bientôt, ${f2p.length} free-to-play, ${indes.length} indés, ${demos.length} démos, ${libres.length} libres, `
  + `${details.size} fiches, ${Object.keys(cache.trad).length} traductions en cache`);
