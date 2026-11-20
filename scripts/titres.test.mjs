import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nettoyerTitre, memeJeu, pasVraimentGratuit, etiquettesInterdites, francais, mediasItch } from './titres.mjs';
import { variantesNom } from '../public/noms.js';

test('mods GOG qui demandent le jeu payant', () => {
  assert.ok(pasVraimentGratuit('FOLON® Fallout London is a total conversion mod made by Team FOLON® for Fallout 4 GOTY and requires you to own the base game on either GOG or Steam'));
  assert.ok(pasVraimentGratuit('Developed by Merry Pencil Studios, awarded Best Overall in NVIDIA\'s 2025 RTX Remix Mod Contest'.replace('Mod Contest', 'Remix mod')));
  assert.ok(pasVraimentGratuit('<p>You need to own the original game to play.</p>'));
});

test('vrais jeux gratuits GOG', () => {
  assert.ok(!pasVraimentGratuit('No manual modding required, just install, survive, and adapt'));
  assert.ok(!pasVraimentGratuit('GAMMA integrates over 400 hand-picked mods into a single, finely balanced package'));
  assert.ok(!pasVraimentGratuit('A free platformer about exploring a strange world.'));
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

test('offres sous conditions (GamerPower)', () => {
  assert.ok(pasVraimentGratuit('Please note this Steam Key giveaway requires 10 ARP (Arena Reward Points) to claim a key.'));
  assert.ok(pasVraimentGratuit('Grab Sharknado VR (Rift S, Rift) for free via Meta.'));
  assert.ok(!pasVraimentGratuit('Score Knightica for free via Epic Games Store!'));
  assert.ok(!pasVraimentGratuit('Rift Apart is a free platformer with a rift in time.'));
});

test('jouable en français (langues Steam)', () => {
  assert.equal(francais('English<strong>*</strong>, French<strong>*</strong>, German<br><strong>*</strong>languages with full audio support'), 'vf');
  assert.equal(francais('English<strong>*</strong>, French, German<br><strong>*</strong>languages with full audio support'), 'st');
  assert.equal(francais('English, Spanish - Spain'), null);
  assert.equal(francais(undefined), null);
  // Voix « cochées » dans 100 langues (Best Plumber, Leaper…) : pas crédible, pas de badge.
  const tout = Array.from({ length: 100 }, (_, i) => (i === 1 ? 'French' : 'L' + i) + '<strong>*</strong>').join(', ');
  assert.equal(francais(tout + '<br><strong>*</strong>languages with full audio support'), null);
});

test('médias d\'une page itch.io', () => {
  const html = '<div class="video_embed"><iframe src="//www.youtube.com/embed/osJkXuMBsJ0"></iframe></div>'
    + '<img class="screenshot" src="https://img.itch.zone/avant.png">' // hors du bloc des captures : ignoré
    + '<div class="screenshot_list"><a href="https://img.itch.zone/a/original/1.png"><img class="screenshot" src="https://img.itch.zone/a/347x500/p.png"'
    + ' srcset="https://img.itch.zone/a/347x500/p.png 1x, https://img.itch.zone/a/794x1000/g.png 2x" data-screenshot_id="1"/></a>'
    + '<a href="https://img.itch.zone/b/original/2.png"><img class="screenshot" src="https://img.itch.zone/b/347x500/p.png"/></a></div>'; // sans srcset
  assert.deepEqual(mediasItch(html), { captures: ['https://img.itch.zone/a/794x1000/g.png', 'https://img.itch.zone/b/347x500/p.png'], youtube: 'osJkXuMBsJ0' });
  assert.deepEqual(mediasItch('<html>rien</html>'), { captures: [], youtube: undefined });
  // Attributs dans un autre ordre (class après srcset) : vu sur GitHub.
  assert.deepEqual(mediasItch('<div class="screenshot_list"><img srcset="https://img.itch.zone/a/1x.png 1x, https://img.itch.zone/a/g.png 2x" class="screenshot" src="https://img.itch.zone/a/p.png"/>').captures,
    ['https://img.itch.zone/a/g.png']);
});
