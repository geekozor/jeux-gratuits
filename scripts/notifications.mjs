// Notifications push (OneSignal) : nouveaux jeux offerts, et rappel quand il reste moins de 24 h.
import { memeJeu } from './titres.mjs';

const APP_ID = '6d958804-4c16-40fc-97be-496a98418a29'; // pas secret (la clé, elle, est dans ONESIGNAL_API_KEY)
const SITE = 'https://geekozor.github.io/jeux-gratuits/';
const JOUR = 24 * 3600 * 1000;

// vus = { id: { titre, rappel } } gardé dans cache.notifies. Comparaison par titre : un même jeu
// change d'id quand il passe d'Epic à GamerPower, il ne doit pas être annoncé deux fois.
export function aNotifier(offerts, vus, maintenant = Date.now()) {
  const jeux = offerts.filter((g) => g.type === 'jeu');
  const anciens = Object.values(vus);
  const vuDe = (g) => anciens.find((v) => memeJeu(v.titre, g.titre));
  const bientotFini = (g) => g.fin && new Date(g.fin) > maintenant && new Date(g.fin) - maintenant < JOUR;
  const nouveaux = jeux.filter((g) => !vuDe(g));
  const finissants = jeux.filter((g) => vuDe(g) && !vuDe(g).rappel && bientotFini(g));
  // On ne garde que les jeux encore offerts (liste vide = sans doute une panne : on garde tout).
  const suite = jeux.length ? {} : { ...vus };
  for (const g of jeux) suite[g.id] = { titre: g.titre, rappel: Boolean(vuDe(g)?.rappel || bientotFini(g)) };
  return { nouveaux, finissants, vus: suite };
}

// Une notification par sorte, même si plusieurs jeux arrivent dans la même heure.
export function messages(nouveaux, finissants) {
  const un = (liste, fr, en) => {
    if (!liste.length) return [];
    const seul = liste.length === 1 ? liste[0] : null;
    const texte = seul ? `${seul.titre} (${seul.plateformesTexte})` : liste.map((g) => g.titre).join(', ');
    return [{ titre: { fr, en }, texte: { fr: texte, en: texte }, url: SITE + (seul ? '#' + encodeURIComponent(seul.id) : ''), image: seul?.image }];
  };
  return [
    ...un(nouveaux, nouveaux.length > 1 ? `🎁 ${nouveaux.length} nouveaux jeux gratuits` : '🎁 Nouveau jeu gratuit',
      nouveaux.length > 1 ? `🎁 ${nouveaux.length} new free games` : '🎁 New free game'),
    ...un(finissants, '⏰ Plus que quelques heures pour le récupérer', '⏰ Only a few hours left to grab it'),
  ];
}

export async function envoyer(cle, m) {
  const r = await fetch('https://api.onesignal.com/notifications?c=push', {
    method: 'POST',
    headers: { Authorization: `Key ${cle}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: APP_ID, target_channel: 'push', included_segments: ['Total Subscriptions'],
      headings: m.titre, contents: m.texte, url: m.url, chrome_web_image: m.image,
    }),
  });
  if (!r.ok) throw new Error(`OneSignal ${r.status} : ${await r.text()}`);
}
