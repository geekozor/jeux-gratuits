// Texte de plateforme ("PC, Playstation 5, Xbox One") -> codes des filtres de l'app.
// Les codes doivent rester alignés avec PLATEFORMES dans public/app.js.
const REGLES = [
  ['pc', /\bpc\b|steam|epic|gog|itch\.io|drm-free|ubisoft|origin|battle\.net|windows|linux|macos/i],
  ['ps5', /playstation 5|\bps5\b/i],
  ['ps4', /playstation 4|\bps4\b/i],
  ['xboxseries', /xbox series/i],
  ['xboxone', /xbox one/i],
  ['switch2', /switch 2/i],
  ['switch', /switch(?! 2)|nintendo(?! switch 2)/i],
  ['mobile', /android|\bios\b|iphone/i],
  ['vr', /\bvr\b|oculus|meta quest/i],
];

export const plateformes = (texte) => REGLES.filter(([, re]) => re.test(texte)).map(([code]) => code);
