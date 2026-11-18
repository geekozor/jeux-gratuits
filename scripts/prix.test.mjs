import { test } from 'node:test';
import assert from 'node:assert/strict';
import { euros, formatEuros, estUnLot, TAUX_USD_EUR } from '../public/prix.js';

test('conversion en euros', () => {
  assert.equal(euros('€19.50'), 19.5);
  assert.equal(euros('$10.00'), 10 * TAUX_USD_EUR);
  assert.equal(euros('0'), 0); // Epic : jeu déjà free-to-play
  assert.equal(euros(null), null);
  assert.equal(euros('N/A'), null);
});

test('format français', () => {
  // Intl met une espace insécable fine avant €
  assert.equal(formatEuros(19.5).replace(/\s/g, ' '), '19,50 €');
  assert.equal(formatEuros(1234, 'fr', 0).replace(/\s/g, ' '), '1 234 €');
});

test('lots exclus des totaux', () => {
  const offres = [{ titre: 'Free itch.io Games Bundle', valeur: '$384.00' }, { titre: 'Knightica', valeur: '$14.99' }];
  const total = offres.reduce((s, g) => s + (estUnLot(g) ? 0 : euros(g.valeur) ?? 0), 0);
  assert.equal(total, euros('$14.99'));
});
