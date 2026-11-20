import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offreGratuite, offreActuelle } from './epic.mjs';

const gratuit = { startDate: '2026-11-26T16:00:00.000Z', discountSetting: { discountPercentage: 0 } };
const promo40 = { startDate: '2026-12-10T16:00:00.000Z', discountSetting: { discountPercentage: 40 } };

test('offre gratuite trouvée quel que soit l\'ordre (Bread and Fred, 20/11/2026)', () => {
  assert.equal(offreGratuite([{ promotionalOffers: [gratuit, promo40] }]), gratuit);
  assert.equal(offreGratuite([{ promotionalOffers: [promo40, gratuit] }]), gratuit);
  assert.equal(offreGratuite([{ promotionalOffers: [promo40] }, { promotionalOffers: [gratuit] }]), gratuit);
});

test('pas d\'offre gratuite : rien (une simple promo n\'est pas « bientôt gratuit »)', () => {
  assert.equal(offreGratuite([{ promotionalOffers: [promo40] }]), undefined);
  assert.equal(offreGratuite(undefined), undefined);
  assert.equal(offreGratuite([]), undefined);
});

test('offre en cours : la gratuite d\'abord, sinon la promo', () => {
  assert.equal(offreActuelle([{ promotionalOffers: [promo40, gratuit] }]), gratuit);
  assert.equal(offreActuelle([{ promotionalOffers: [promo40] }]), promo40);
  assert.equal(offreActuelle([]), undefined);
});
