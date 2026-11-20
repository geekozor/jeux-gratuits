// "Dwarven Realms Steam Key Giveaway" -> "Dwarven Realms" : GamerPower colle la boutique au nom du jeu.
const SUFFIXE = /\s*[-–(]?\s*\b(giveaway|steam key|steam|epic games( store)?|gog|indiegala|itch\.io|stove|rift|prime gaming|drm-free|pc|key)\)?\s*$/i;

import { cleNom } from '../public/noms.js';

// Le nom Steam désigne-t-il le même jeu ? Identique, ou avec un sous-titre ("Gloria Victis: Medieval MMORPG")
// ou "Remastered". Un autre mot collé ("ArcheAge Chronicles") = un autre jeu : refusé.
export function memeJeu(titre, nomSteam) {
  const a = cleNom(titre);
  return [nomSteam, nomSteam.split(/:| - /)[0], nomSteam.replace(/\s+remastered$/i, '')].some((n) => cleNom(n) === a);
}

// Description d'un « jeu gratuit » qui ne l'est pas vraiment : mod demandant le jeu payant d'origine (GOG),
// clé contre des points de récompense (« requires 10 ARP (Arena Reward Points) »), ou jeu réservé aux anciens
// casques Oculus Rift (« Sharknado VR (Rift S, Rift) »). "No manual modding required" (modpack autonome) ne compte pas.
const PAS_GRATUIT = /\breward points\b|\(rift\b|\brequires? (you to own|ownership|the (base|original|full) game|a (legal |legitimate )?copy)|\b(need|have) to own\b|\bmust own\b|\bownership of\b|\btotal conversion mod\b|\bremix mod\b|\bmod for\b/i;
export const pasVraimentGratuit = (description) => PAS_GRATUIT.test(description.replace(/<[^>]+>/g, ' '));

// Étiquettes itch.io qui excluent un jeu : contenu adulte, ou jeu de fan sur une licence d'autrui.
const ETIQUETTES_EXCLUES = new Set(['fangame', 'fan-game', 'nsfw', 'adult', 'adults-only', 'erotic', 'sexual-content',
  'hentai', 'nudity', 'porn', 'lewd', '18', '18-plus', 'mature', 'eroge']);
export const etiquettesInterdites = (etiquettes) => etiquettes.some((e) => ETIQUETTES_EXCLUES.has(e));

// Langues Steam ("English<strong>*</strong>, French<strong>*</strong>, German", * = voix) -> 'vf', 'st' ou null.
// Seul ce champ déclaré par le développeur compte, jamais le titre ni la description.
// Un jeu qui déclare des voix dans plus de VOIX_MAX langues (Best Plumber : 100+, Cherokee compris) a tout coché :
// déclaration pas crédible, donc pas de badge du tout.
const VOIX_MAX = 16; // les plus gros jeux doublés en ont une quinzaine
export function francais(langues) {
  const liste = (langues ?? '').split('<br>')[0]; // la légende « *languages with full audio support » vient après
  const m = liste.match(/\bFrench\b(<strong>\*<\/strong>)?/);
  if (!m) return null;
  if (!m[1]) return 'st';
  return (liste.match(/<strong>\*<\/strong>/g).length <= VOIX_MAX ? 'vf' : null);
}

// Page d'un jeu itch.io -> captures (bloc « screenshot_list ») et bande-annonce YouTube (bloc « video_embed »).
// Captures : la version « 2x » du srcset (794x1000), pas l'originale (souvent en 4K, trop lourde sur téléphone).
export function mediasItch(html) {
  const captures = [...(html.split('class="screenshot_list"')[1] ?? '').matchAll(/<img class="screenshot"[^>]*>/g)]
    .map(([img]) => img.match(/(https:\/\/img\.itch\.zone\/\S+) 2x/)?.[1] ?? img.match(/src="(https:\/\/img\.itch\.zone\/[^"]+)"/)?.[1])
    .filter(Boolean).slice(0, 8);
  const youtube = (html.split('class="video_embed"')[1] ?? '').match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/)?.[1];
  return { captures, youtube };
}

export function nettoyerTitre(titre) {
  let t = titre.trim();
  for (let avant = ''; avant !== t;) { avant = t; t = t.replace(SUFFIXE, '').trim(); }
  return t || titre.trim();
}
