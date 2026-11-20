// Prix des jeux, partagés par l'app et scripts/update.mjs : tout est affiché en euros.

// shortcut: taux fixe 1 $ = 0,86 € (relevé à la main fin 2026), à mettre à jour s'il bouge de plus de 5 %.
export const TAUX_USD_EUR = 0.86;

// "$29.99" (GamerPower), "€19.50" (Epic), "0" (Epic, jeu déjà gratuit) -> montant en euros ; null si inconnu.
export function euros(valeur) {
  if (valeur == null || valeur === '') return null;
  const n = parseFloat(String(valeur).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(n)) return null;
  return String(valeur).includes('$') ? Math.round(n * TAUX_USD_EUR * 100) / 100 : n;
}

// Prix en dollars converti au taux fixe (pas le vrai prix en euros de la boutique) : affiché avec « env. ».
export const estConverti = (valeur) => String(valeur ?? '').includes('$');

// 19.5 -> "19,50 €" en français.
export const formatEuros = (n, langue = 'fr', decimales = 2) => new Intl.NumberFormat(langue,
  { style: 'currency', currency: 'EUR', minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(n);

// Un lot de plusieurs jeux (« Free itch.io Games Bundle », 116 jeux pour 384 $) ne compte pas dans les totaux.
export const estUnLot = (g) => /\bbundle\b/i.test(g.titre);
