import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aNotifier, messages, messageRoi } from './notifications.mjs';

const maintenant = Date.parse('2026-11-19T12:00:00Z');
const jeu = (id, titre, fin) => ({ id, titre, type: 'jeu', fin, plateformesTexte: 'PC, Epic Games Store' });

test('nouveau jeu, puis rappel une seule fois', () => {
  const offerts = [jeu('epic1', 'Mark of the Deep', '2026-11-26T16:00:00Z'), { ...jeu('gp9', 'Un DLC'), type: 'dlc' }];
  let r = aNotifier(offerts, {}, maintenant);
  assert.deepEqual(r.nouveaux.map((g) => g.id), ['epic1']); // le DLC ne compte pas
  // Le même jeu repris par GamerPower sous un autre id : pas de nouvelle annonce.
  r = aNotifier([jeu('gp1', 'Mark of the Deep', '2026-11-26T16:00:00Z')], r.vus, maintenant);
  assert.equal(r.nouveaux.length, 0);
  const veille = Date.parse('2026-11-25T20:00:00Z');
  r = aNotifier([jeu('gp1', 'Mark of the Deep', '2026-11-26T16:00:00Z')], r.vus, veille);
  assert.deepEqual(r.finissants.map((g) => g.id), ['gp1']);
  r = aNotifier([jeu('gp1', 'Mark of the Deep', '2026-11-26T16:00:00Z')], r.vus, veille + 3600e3);
  assert.equal(r.finissants.length, 0);
});

test('un nouveau jeu qui finit déjà dans moins de 24 h : une annonce, pas de rappel ensuite', () => {
  let r = aNotifier([jeu('a', 'Jeu A', '2026-11-20T08:00:00Z')], { x: { titre: 'Autre', rappel: false } }, maintenant);
  assert.equal(r.nouveaux.length, 1);
  r = aNotifier([jeu('a', 'Jeu A', '2026-11-20T08:00:00Z')], r.vus, maintenant + 3600e3);
  assert.equal(r.finissants.length, 0);
});

test('liste vide (panne) : on garde la mémoire', () => {
  const vus = { a: { titre: 'Jeu A', rappel: false } };
  assert.deepEqual(aNotifier([], vus, maintenant).vus, vus);
});

test('messages groupés', () => {
  const m = messages([jeu('a', 'Jeu A'), jeu('b', 'Jeu B')], [jeu('c', 'Jeu C')]);
  assert.equal(m.length, 2);
  assert.equal(m[0].titre.fr, '🎁 2 nouveaux jeux gratuits');
  assert.equal(m[0].texte.fr, 'Jeu A, Jeu B');
  assert.equal(m[1].url, 'https://geekozor.github.io/jeux-gratuits/#c');
  assert.equal(messages([], []).length, 0);
});

test('Choix du Roi : annoncé une fois, pas réannoncé après une absence', () => {
  const c = (cle, titre) => ({ cle, id: cle, titre, image: 'images/libres/x.jpg', verdict: 'Top' });
  let r = messageRoi([c('a', 'A')], ['a'], []);
  assert.equal(r.message.texte.fr, 'A : « Top »');
  assert.equal(r.message.image, 'https://geekozor.github.io/jeux-gratuits/images/libres/x.jpg');
  assert.equal(messageRoi([c('a', 'A')], ['a'], r.envoyes).message, null);
  r = messageRoi([], ['a'], r.envoyes); // jeu absent des données un moment
  assert.deepEqual(r.envoyes, ['a']);
  assert.equal(messageRoi([c('a', 'A')], ['a'], r.envoyes).message, null);
  r = messageRoi([c('a', 'A'), c('b', 'B'), c('d', 'D')], ['a', 'b', 'd'], ['a']);
  assert.equal(r.message.titre.fr, '👑 2 nouveaux Choix du Roi');
  assert.equal(r.message.texte.fr, 'B, D');
  assert.deepEqual(messageRoi([], [], ['a']).envoyes, []); // retiré du fichier : oublié
});
