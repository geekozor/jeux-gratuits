import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offresSteam } from './steam.mjs';

const ligne = (appid, titre, remise) => `<a href="https://store.steampowered.com/app/${appid}/X/?snr=1" data-ds-appid="${appid}" class="search_result_row">`
  + `<span class="title">${titre}</span><div class="discount_block search_discount_block" data-price-final="0" data-discount="${remise}"></div></a>`;

test('jeux Steam à -100 %', () => {
  const html = ligne('10', 'Jeu offert', '100') + ligne('20', 'Jeu soldé', '75')
    + '<a href="https://store.steampowered.com/app/30/" data-ds-bundleid="5"><span class="title">Pack</span></a>';
  assert.deepEqual(offresSteam(html), [{ appid: '10', titre: 'Jeu offert' }]);
  assert.deepEqual(offresSteam(undefined), []);
});
