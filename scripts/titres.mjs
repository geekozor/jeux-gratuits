// "Dwarven Realms Steam Key Giveaway" -> "Dwarven Realms" : GamerPower colle la boutique au nom du jeu.
const SUFFIXE = /\s*[-–(]?\s*\b(giveaway|steam key|steam|epic games( store)?|gog|indiegala|itch\.io|stove|rift|prime gaming|drm-free|pc|key)\)?\s*$/i;

import { cleNom } from '../public/noms.js';

// Le nom Steam désigne-t-il le même jeu ? Identique, ou avec un sous-titre ("Gloria Victis: Medieval MMORPG")
// ou "Remastered". Un autre mot collé ("ArcheAge Chronicles") = un autre jeu : refusé.
export function memeJeu(titre, nomSteam) {
  const a = cleNom(titre);
  return [nomSteam, nomSteam.split(/:| - /)[0], nomSteam.replace(/\s+remastered$/i, '')].some((n) => cleNom(n) === a);
}

// Description GOG d'un « jeu gratuit » qui est en fait un mod demandant le jeu payant d'origine.
// "No manual modding required" (modpack autonome) ne doit pas compter.
const MOD = /\brequires? (you to own|ownership|the (base|original|full) game|a (legal |legitimate )?copy)|\b(need|have) to own\b|\bmust own\b|\bownership of\b|\btotal conversion mod\b|\bremix mod\b|\bmod for\b/i;
export const estUnMod = (description) => MOD.test(description.replace(/<[^>]+>/g, ' '));

// Étiquettes itch.io qui excluent un jeu : contenu adulte, ou jeu de fan sur une licence d'autrui.
const ETIQUETTES_EXCLUES = new Set(['fangame', 'fan-game', 'nsfw', 'adult', 'adults-only', 'erotic', 'sexual-content',
  'hentai', 'nudity', 'porn', 'lewd', '18', '18-plus', 'mature', 'eroge']);
export const etiquettesInterdites = (etiquettes) => etiquettes.some((e) => ETIQUETTES_EXCLUES.has(e));

export function nettoyerTitre(titre) {
  let t = titre.trim();
  for (let avant = ''; avant !== t;) { avant = t; t = t.replace(SUFFIXE, '').trim(); }
  return t || titre.trim();
}
