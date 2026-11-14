import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plateformes } from './plateformes.mjs';

test('GamerPower', () => {
  assert.deepEqual(plateformes('PC, Playstation 5, Xbox Series X|S, Playstation 4, Xbox One, Android, iOS'),
    ['pc', 'ps5', 'ps4', 'xboxseries', 'xboxone', 'mobile']);
  assert.deepEqual(plateformes('PC, Steam'), ['pc']);
  assert.deepEqual(plateformes('VR'), ['vr']);
});

test('consoles', () => {
  assert.deepEqual(plateformes('PlayStation 5, Xbox Series S/X, Nintendo Switch'), ['ps5', 'xboxseries', 'switch']);
  assert.deepEqual(plateformes('Nintendo Switch 2'), ['switch2']);
  assert.deepEqual(plateformes('Nintendo Switch, Nintendo Switch 2'), ['switch2', 'switch']);
});

test('pas de faux positif', () => {
  assert.deepEqual(plateformes('Bios Quest'), []);
});
