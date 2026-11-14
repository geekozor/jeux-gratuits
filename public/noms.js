// Comparaison de noms de jeux, partagée par l'app (jeux suivis) et scripts/titres.mjs (Steam).

// Clé de comparaison : "EverQuest II™" et "Everquest 2" donnent la même.
export const cleNom = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/\biii\b/g, '3').replace(/\bii\b/g, '2')
  .normalize('NFD').replace(/[^a-z0-9]/g, '');

// Les noms courts sous lesquels on reconnaît ce jeu : "Alien: Isolation - The Collection" est aussi
// "Alien: Isolation" et "Alien" ; "Control Ultimate Edition" est aussi "Control".
export function variantesNom(titre) {
  const v = [titre, titre.replace(/\s+(remastered|goty|game of the year|definitive|complete|deluxe|ultimate|enhanced)( edition)?$/i, '')];
  for (const m of titre.matchAll(/\s*(:|\s[-–—]\s|\()/g)) v.push(titre.slice(0, m.index));
  return [...new Set(v.map(cleNom).filter(Boolean))];
}
