import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nettoyerTitre, memeJeu, estUnMod, etiquettesInterdites } from './titres.mjs';
import { variantesNom } from '../public/noms.js';

test('mods GOG qui demandent le jeu payant', () => {
  assert.ok(estUnMod('FOLON® Fallout London is a total conversion mod made by Team FOLON® for Fallout 4 GOTY and requires you to own the base game on either GOG or Steam'));
  assert.ok(estUnMod('Developed by Merry Pencil Studios, awarded Best Overall in NVIDIA\'s 2025 RTX Remix Mod Contest'.replace('Mod Contest', 'Remix mod')));
  assert.ok(estUnMod('<p>You need to own the original game to play.</p>'));
});

test('vrais jeux gratuits GOG', () => {
  assert.ok(!estUnMod('No manual modding required, just install, survive, and adapt'));
  assert.ok(!estUnMod('GAMMA integrates over 400 hand-picked mods into a single, finely balanced package'));
  assert.ok(!estUnMod('A free platformer about exploring a strange world.'));
});

test('étiquettes itch.io', () => {
  assert.ok(etiquettesInterdites(['fangame', 'hololive', 'pixel-art']));
  assert.ok(etiquettesInterdites(['visual-novel', 'nsfw']));
  assert.ok(!etiquettesInterdites(['horror', 'romance', 'yandere', 'renpy']));
});

test('même jeu sur Steam', () => {
  assert.ok(memeJeu('Apex Legends', 'Apex Legends™'));
  assert.ok(memeJeu('Crossout', 'Crossout Remastered'));
  assert.ok(memeJeu('Gloria Victis', 'Gloria Victis: Medieval MMORPG'));
  assert.ok(memeJeu('Everquest 2', 'EverQuest II'));
  assert.ok(memeJeu('Blade and Soul', 'Blade & Soul'));
});

test('pas le même jeu', () => {
  assert.ok(!memeJeu('ArcheAge', 'ArcheAge Chronicles'));
  assert.ok(!memeJeu('Blade and Soul', 'Blade & Soul NEO'));
  assert.ok(!memeJeu('Gloria Victis', 'Siege Survival: Gloria Victis'));
  assert.ok(!memeJeu('Dota 2', 'Dota Underlords'));
});

test('retire la boutique et "Giveaway"', () => {
  assert.equal(nettoyerTitre('My Darkest Witch IndieGala Giveaway'), 'My Darkest Witch');
  assert.equal(nettoyerTitre('Dwarven Realms Steam Key Giveaway'), 'Dwarven Realms');
  assert.equal(nettoyerTitre('Knightica (Epic Games) Giveaway'), 'Knightica');
  assert.equal(nettoyerTitre('GigaBash STOVE Giveaway'), 'GigaBash');
  assert.equal(nettoyerTitre('Sharknado VR Rift Giveaway'), 'Sharknado VR');
});

test('ne touche pas au reste du nom', () => {
  assert.equal(nettoyerTitre('The Witcher 3: Wild Hunt Remastered - Scarlet Crest Armor'), 'The Witcher 3: Wild Hunt Remastered - Scarlet Crest Armor');
  assert.equal(nettoyerTitre('Steamworld Dig'), 'Steamworld Dig');
  assert.equal(nettoyerTitre('Keystone'), 'Keystone');
});

test('jeux suivis reconnus sous un nom plus long', () => {
  assert.ok(variantesNom('Alien: Isolation - The Collection').includes(variantesNom('Alien: Isolation')[0]));
  assert.ok(variantesNom('Control Ultimate Edition').includes(variantesNom('Control')[0]));
  assert.ok(variantesNom('EverQuest II™').includes(variantesNom('Everquest 2')[0]));
  assert.ok(!variantesNom('ArcheAge Chronicles').includes(variantesNom('ArcheAge')[0]));
});
