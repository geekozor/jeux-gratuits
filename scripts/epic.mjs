// Lecture des offres du flux Epic freeGamesPromotions (promotionalOffers / upcomingPromotionalOffers).
// Un jeu peut avoir plusieurs offres (Bread and Fred, 20/11/2026 : gratuit le 26/11 puis -40 % en décembre),
// dans un ordre qui change d'un appel à l'autre : on cherche l'offre gratuite, jamais « la première ».
// discountPercentage 0 = prix final nul (Epic l'écrit ainsi pour ses jeux offerts).
const toutes = (groupes) => (groupes ?? []).flatMap((g) => g.promotionalOffers ?? []);

export const offreGratuite = (groupes) => toutes(groupes).find((o) => o.discountSetting?.discountPercentage === 0);

// Offre en cours : la gratuite s'il y en a une, sinon n'importe laquelle (simple promo).
export const offreActuelle = (groupes) => offreGratuite(groupes) ?? toutes(groupes)[0];
