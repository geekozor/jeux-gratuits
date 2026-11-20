// Notifications push (OneSignal) : nouveaux jeux offerts, et rappel quand il reste moins de 24 h.
import { memeJeu } from './titres.mjs';

const APP_ID = '6d958804-4c16-40fc-97be-496a98418a29'; // pas secret (la clé, elle, est dans ONESIGNAL_API_KEY)
const SITE = 'https://geekozor.github.io/jeux-gratuits/';
const JOUR = 24 * 3600 * 1000;

// vus = { id: { titre, rappel } } gardé dans cache.notifies. Comparaison par titre : un même jeu
// change d'id quand il passe d'Epic à GamerPower, il ne doit pas être annoncé deux fois.
export function aNotifier(offerts, vus, maintenant = Date.now()) {
  const jeux = offerts.filter((g) => g.type === 'jeu');
  const anciens = Object.values(vus);
  const vuDe = (g) => anciens.find((v) => memeJeu(v.titre, g.titre));
  const bientotFini = (g) => g.fin && new Date(g.fin) > maintenant && new Date(g.fin) - maintenant < JOUR;
  const nouveaux = jeux.filter((g) => !vuDe(g));
  const finissants = jeux.filter((g) => vuDe(g) && !vuDe(g).rappel && bientotFini(g));
  // On ne garde que les jeux encore offerts (liste vide = sans doute une panne : on garde tout).
  const suite = jeux.length ? {} : { ...vus };
  for (const g of jeux) suite[g.id] = { titre: g.titre, rappel: Boolean(vuDe(g)?.rappel || bientotFini(g)) };
  return { nouveaux, finissants, vus: suite };
}

// Une notification par sorte, même si plusieurs jeux arrivent dans la même heure.
export function messages(nouveaux, finissants) {
  const un = (liste, fr, en) => {
    if (!liste.length) return [];
    const seul = liste.length === 1 ? liste[0] : null;
    const texte = seul ? `${seul.titre} (${seul.plateformesTexte})` : liste.map((g) => g.titre).join(', ');
    return [{ titre: { fr, en }, texte: { fr: texte, en: texte }, url: SITE + (seul ? '#' + encodeURIComponent(seul.id) : ''), image: seul?.image }];
  };
  return [
    ...un(nouveaux, nouveaux.length > 1 ? `🎁 ${nouveaux.length} nouveaux jeux gratuits` : '🎁 Nouveau jeu gratuit',
      nouveaux.length > 1 ? `🎁 ${nouveaux.length} new free games` : '🎁 New free game'),
    ...un(finissants, '⏰ Plus que quelques heures pour le récupérer', '⏰ Only a few hours left to grab it'),
  ];
}

// Choix du Roi : une notification quand un jeu entre dans public/choix-du-roi.json.
// choix = entrées trouvées dans les données ({ cle, id, titre, image, verdict }), cles = toutes les entrées du fichier,
// envoyes = clés déjà annoncées (cache.roiNotifies). Un jeu absent un moment (source en panne) n'est pas réannoncé.
export function messageRoi(choix, cles, envoyes) {
  const nouveaux = choix.filter((c) => !envoyes.includes(c.cle));
  const suite = cles.filter((k) => envoyes.includes(k) || choix.some((c) => c.cle === k));
  if (!nouveaux.length) return { message: null, envoyes: suite };
  const seul = nouveaux.length === 1 ? nouveaux[0] : null;
  const texte = seul ? `${seul.titre} : « ${seul.verdict} »`
    : nouveaux.slice(0, 5).map((c) => c.titre).join(', ') + (nouveaux.length > 5 ? '…' : '');
  return { envoyes: suite, message: {
    titre: seul ? { fr: '👑 Nouveau Choix du Roi', en: "👑 New King's Pick" }
      : { fr: `👑 ${nouveaux.length} nouveaux Choix du Roi`, en: `👑 ${nouveaux.length} new King's Picks` },
    texte: { fr: texte, en: texte }, url: SITE + (seul ? '#' + encodeURIComponent(seul.id) : ''),
    image: seul?.image && new URL(seul.image, SITE).href, // images des jeux libres : chemin relatif au site
  } };
}

export async function envoyer(cle, m) {
  const r = await fetch('https://api.onesignal.com/notifications?c=push', {
    method: 'POST',
    headers: { Authorization: `Key ${cle}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: APP_ID, target_channel: 'push', included_segments: ['Total Subscriptions'],
      headings: m.titre, contents: m.texte, url: m.url, chrome_web_image: m.image,
    }),
  });
  if (!r.ok) throw new Error(`OneSignal ${r.status} : ${await r.text()}`);
  return (await r.json()).id; // pour lire ensuite combien l'ont reçue et cliquée
}

// Tableau de bord : résultat d'une notification envoyée, lu avec la même clé que l'envoi.
export async function resultat(cle, id) {
  const r = await fetch(`https://api.onesignal.com/notifications/${encodeURIComponent(id)}?app_id=${APP_ID}`, { headers: { Authorization: `Key ${cle}` } });
  if (!r.ok) throw new Error(`OneSignal ${r.status}`);
  const j = await r.json();
  return { recues: j.successful ?? 0, clics: j.converted ?? 0 };
}

// Nombre d'abonnés aux alertes. OneSignal peut exiger la clé du compte plutôt que celle de l'app : alors null.
export async function nbAbonnes(cle) {
  const r = await fetch(`https://api.onesignal.com/apps/${APP_ID}`, { headers: { Authorization: `Key ${cle}` } });
  if (!r.ok) return null;
  const j = await r.json();
  return j.messageable_players ?? j.players ?? null;
}
