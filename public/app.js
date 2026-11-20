import { cleNom, variantesNom } from './noms.js';
import { euros, formatEuros, estConverti } from './prix.js';

// ---------- Traductions de l'interface ----------
const T = {
  fr: {
    recupere: "Je l'ai récupéré", heures: (h, m) => `Plus que ${h} h ${m} min`, videOnglet: (o) => `Rien dans « ${o} » en ce moment. La liste est mise à jour toutes les heures.`, videFiltres: (o, f) => `Rien dans « ${o} » pour ${f} en ce moment.`, effacer: 'Effacer les filtres', voirPlus: (n) => `Voir plus (${n} restants)`,
    suivre: 'Suivre ce jeu', mesSuivis: 'Mes jeux suivis', alerteJusqua: (x, d) => `${x}, que tu suis, est gratuit jusqu'au ${d} !`, alerteMaintenant: (x) => `${x}, que tu suis, est gratuit en ce moment !`, alerteBientot: (x, d) => `${x}, que tu suis, sera gratuit le ${d} !`, aucunSuivi: 'Aucun jeu suivi ici. Touche ★ sur un jeu pour être prévenu quand il devient gratuit.',
    creditImage: 'Image :',
    indes: 'Indés', demos: 'Démos', libres: 'Libres & rétro', bientot: 'Bientôt gratuit', enCeMoment: 'Gratuits en ce moment', gratuitDes: (d) => `Gratuit dès ${d}`, voirEpic: 'Voir sur Epic', essayer: 'Essayer la démo', nbJeux: (n) => `${n} jeux`, visites: (n) => `${n} visites`,
    videos: 'Vidéos', lire: 'Lire', sourcesMedias: 'Vidéos et captures :',
    fermer: 'Fermer', precedente: 'Capture précédente', suivante: 'Capture suivante', agrandir: 'Agrandir la capture', bandeAnnonce: 'Bande-annonce', commentRecuperer: 'Comment le récupérer', captures: "Captures d'écran", aPropos: 'À propos', enAnglais: '(en anglais)', configMin: 'Configuration minimale', developpeur: 'Développeur', editeur: 'Éditeur', sortie: 'Sortie', os: 'Système', processeur: 'Processeur', memoire: 'Mémoire', graphismes: 'Carte graphique', stockage: 'Stockage', chargement: 'Chargement…',
    dejaOfferts: 'Déjà offerts', totalOffert: (n, m, d) => `${n} ${n > 1 ? 'jeux offerts' : 'jeu offert'} depuis le ${d}${m ? `, pour ${m} au total` : ''}`, partager: 'Partager', lienCopie: 'Lien copié', partageTexte: (x) => `${x} est gratuit en ce moment !`,
    nouveau: 'Nouveau',
    genres: 'Tous les genres', genre: 'Genre', tri: 'Trier',
    triFin: 'Fin la plus proche', triRecent: 'Plus récents', triValeur: 'Plus grande valeur', triPopulaire: 'Populaires', triAZ: 'De A à Z',
    suisMoi: 'Tu aimes ces bons plans ? Suis Geekozor :', installer: 'Installer', alertesActiver: "Me prévenir", alertesActives: "Alertes activées", alertesIos: "Sur iPhone, les alertes marchent seulement avec l'appli installée : touche Partager (ou ••• puis Partager) puis « Sur l'écran d'accueil », puis ouvre l'appli depuis l'écran d'accueil.", alertesBloquees: "Les notifications sont bloquées pour ce site : autorise-les dans les réglages du navigateur.", jeux: 'Jeux offerts', dlc: 'Bonus & DLC', f2p: 'Free-to-play', retro: 'Rétro',
    recherche: 'Rechercher un jeu…', toutes: 'Toutes', recuperer: 'Récupérer', jouer: 'Jouer gratuitement',
    gratuit: 'Gratuit', vf: 'VF', vfTitre: 'Voix et textes en français', st: 'FR', stTitre: 'Textes en français (interface ou sous-titres), voix dans une autre langue', encore: (j, h) => `Encore ${j} j ${h} h`,
    nbOffres: (n) => `${n} offres en cours`, nbF2p: (n) => `${n} jeux free-to-play`,
    erreur: 'Impossible de charger la liste. Vérifie ta connexion.',
    sources: 'Données :', maj: 'Mis à jour le', navigateur: 'Navigateur', mobile: 'Mobile',
    retroTitre: 'Rétro légal 👑',
    retroTexte: 'Les vieux jeux, oui, le piratage, non. Ces classiques sont offerts officiellement par leurs éditeurs, à récupérer sur GOG ou Steam.',
    env: 'env.', videoTiktok: "Ma vidéo TikTok sur ce jeu", essais: "🎮 Gratuit ce week-end", essaisTexte: "À jouer gratuitement pendant quelques jours seulement : le jeu ne reste pas dans ta bibliothèque.", economies: (m, n) => `💰 Tu as économisé ${m} grâce au site (${n} ${n > 1 ? 'jeux récupérés' : 'jeu récupéré'})`, bientotVide: 'Les prochains jeux offerts arrivent bientôt, reviens jeudi 👑',
  },
  en: {
    recupere: 'I got it', heures: (h, m) => `Only ${h} h ${m} min left`, videOnglet: (o) => `Nothing in “${o}” right now. The list is updated every hour.`, videFiltres: (o, f) => `Nothing in “${o}” for ${f} right now.`, effacer: 'Clear filters', voirPlus: (n) => `Show more (${n} left)`,
    suivre: 'Follow this game', mesSuivis: 'My followed games', alerteJusqua: (x, d) => `${x}, which you follow, is free until ${d}!`, alerteMaintenant: (x) => `${x}, which you follow, is free right now!`, alerteBientot: (x, d) => `${x}, which you follow, will be free on ${d}!`, aucunSuivi: 'No followed game here. Tap ★ on a game to be told when it goes free.',
    creditImage: 'Image:',
    indes: 'Indie', demos: 'Demos', libres: 'Open source & retro', bientot: 'Free soon', enCeMoment: 'Free right now', gratuitDes: (d) => `Free from ${d}`, voirEpic: 'View on Epic', essayer: 'Try the demo', nbJeux: (n) => `${n} games`, visites: (n) => `${n} visits`,
    videos: 'Videos', lire: 'Play', sourcesMedias: 'Videos and screenshots:',
    fermer: 'Close', precedente: 'Previous screenshot', suivante: 'Next screenshot', agrandir: 'Enlarge screenshot', bandeAnnonce: 'Trailer', commentRecuperer: 'How to claim', captures: 'Screenshots', aPropos: 'About', enAnglais: '', configMin: 'Minimum requirements', developpeur: 'Developer', editeur: 'Publisher', sortie: 'Release', os: 'OS', processeur: 'Processor', memoire: 'Memory', graphismes: 'Graphics', stockage: 'Storage', chargement: 'Loading…',
    dejaOfferts: 'Previously free', totalOffert: (n, m, d) => `${n} ${n > 1 ? 'games' : 'game'} given away since ${d}${m ? `, worth ${m} in total` : ''}`, partager: 'Share', lienCopie: 'Link copied', partageTexte: (x) => `${x} is free right now!`,
    nouveau: 'New',
    genres: 'All genres', genre: 'Genre', tri: 'Sort',
    triFin: 'Ending soonest', triRecent: 'Newest', triValeur: 'Highest value', triPopulaire: 'Popular', triAZ: 'A to Z',
    suisMoi: 'Like these deals? Follow Geekozor:', installer: 'Install', alertesActiver: "Notify me", alertesActives: "Alerts on", alertesIos: "On iPhone, alerts only work with the app installed: tap Share (or ••• then Share), then “Add to Home Screen”, then open the app from your Home Screen.", alertesBloquees: "Notifications are blocked for this site: allow them in your browser settings.", jeux: 'Free games', dlc: 'Bonus & DLC', f2p: 'Free-to-play', retro: 'Retro',
    recherche: 'Search a game…', toutes: 'All', recuperer: 'Claim', jouer: 'Play for free',
    gratuit: 'Free', encore: (j, h) => `${j} d ${h} h left`,
    nbOffres: (n) => `${n} active offers`, nbF2p: (n) => `${n} free-to-play games`,
    erreur: 'Could not load the list. Check your connection.',
    sources: 'Data:', maj: 'Updated on', navigateur: 'Browser', mobile: 'Mobile',
    retroTitre: 'Legal retro 👑',
    retroTexte: 'Old games, yes; piracy, no. These classics are given away officially by their publishers, on GOG or Steam.',
    env: 'approx.', videoTiktok: "My TikTok video about this game", essais: "🎮 Free this weekend", essaisTexte: "Free to play for a few days only: the game does not stay in your library.", economies: (m, n) => `💰 You saved ${m} thanks to this site (${n} ${n > 1 ? 'games' : 'game'} claimed)`, bientotVide: 'The next free games are coming soon, come back on Thursday 👑',
  },
  it: {
    recupere: "L'ho riscattato", heures: (h, m) => `Solo più ${h} h ${m} min`, videOnglet: (o) => `Niente in «${o}» al momento. La lista si aggiorna ogni ora.`, videFiltres: (o, f) => `Niente in «${o}» per ${f} al momento.`, effacer: 'Cancella i filtri', voirPlus: (n) => `Mostra altri (${n} rimanenti)`,
    suivre: 'Segui questo gioco', mesSuivis: 'I miei giochi seguiti', alerteJusqua: (x, d) => `${x}, che segui, è gratis fino al ${d}!`, alerteMaintenant: (x) => `${x}, che segui, è gratis adesso!`, alerteBientot: (x, d) => `${x}, che segui, sarà gratis il ${d}!`, aucunSuivi: 'Nessun gioco seguito qui. Tocca ★ su un gioco per sapere quando diventa gratis.',
    creditImage: 'Immagine:',
    indes: 'Indie', demos: 'Demo', libres: 'Liberi e retrò', bientot: 'Presto gratis', enCeMoment: 'Gratis adesso', gratuitDes: (d) => `Gratis da ${d}`, voirEpic: 'Vedi su Epic', essayer: 'Prova la demo', nbJeux: (n) => `${n} giochi`, visites: (n) => `${n} visite`,
    videos: 'Video', lire: 'Riproduci', sourcesMedias: 'Video e screenshot:',
    fermer: 'Chiudi', precedente: 'Screenshot precedente', suivante: 'Screenshot successivo', agrandir: 'Ingrandisci lo screenshot', bandeAnnonce: 'Trailer', commentRecuperer: 'Come riscattarlo', captures: 'Screenshot', aPropos: 'Informazioni', enAnglais: '(in inglese)', configMin: 'Requisiti minimi', developpeur: 'Sviluppatore', editeur: 'Editore', sortie: 'Uscita', os: 'Sistema', processeur: 'Processore', memoire: 'Memoria', graphismes: 'Scheda video', stockage: 'Archiviazione', chargement: 'Caricamento…',
    dejaOfferts: 'Già regalati', totalOffert: (n, m, d) => `${n} ${n > 1 ? 'giochi regalati' : 'gioco regalato'} dal ${d}${m ? `, per un valore di ${m}` : ''}`, partager: 'Condividi', lienCopie: 'Link copiato', partageTexte: (x) => `${x} è gratis in questo momento!`,
    nouveau: 'Nuovo',
    genres: 'Tutti i generi', genre: 'Genere', tri: 'Ordina',
    triFin: 'In scadenza', triRecent: 'Più recenti', triValeur: 'Valore più alto', triPopulaire: 'Popolari', triAZ: 'Dalla A alla Z',
    suisMoi: 'Ti piacciono queste offerte? Segui Geekozor:', installer: 'Installa', alertesActiver: "Avvisami", alertesActives: "Avvisi attivi", alertesIos: "Su iPhone gli avvisi funzionano solo con l'app installata: tocca Condividi, poi « Aggiungi alla schermata Home », poi apri l'app dalla schermata Home.", alertesBloquees: "Le notifiche sono bloccate per questo sito: consentile nelle impostazioni del browser.", jeux: 'Giochi in regalo', dlc: 'Bonus e DLC', f2p: 'Free-to-play', retro: 'Retrò',
    recherche: 'Cerca un gioco…', toutes: 'Tutte', recuperer: 'Riscatta', jouer: 'Gioca gratis',
    gratuit: 'Gratis', encore: (j, h) => `Ancora ${j} g ${h} h`,
    nbOffres: (n) => `${n} offerte attive`, nbF2p: (n) => `${n} giochi free-to-play`,
    erreur: 'Impossibile caricare la lista. Controlla la connessione.',
    sources: 'Dati:', maj: 'Aggiornato il', navigateur: 'Browser', mobile: 'Mobile',
    retroTitre: 'Retrò legale 👑',
    retroTexte: 'I vecchi giochi sì, la pirateria no. Questi classici sono regalati ufficialmente dai loro editori, su GOG o Steam.',
    env: 'circa', videoTiktok: "Il mio video TikTok su questo gioco", essais: "🎮 Gratis questo weekend", essaisTexte: "Gratis da giocare solo per qualche giorno: il gioco non resta nella tua libreria.", economies: (m, n) => `💰 Hai risparmiato ${m} grazie al sito (${n} ${n > 1 ? 'giochi riscattati' : 'gioco riscattato'})`, bientotVide: 'I prossimi giochi in regalo arrivano presto, torna giovedì 👑',
  },
  de: {
    recupere: 'Hab ich schon', heures: (h, m) => `Nur noch ${h} Std. ${m} Min.`, videOnglet: (o) => `Gerade nichts in „${o}“. Die Liste wird stündlich aktualisiert.`, videFiltres: (o, f) => `Gerade nichts in „${o}“ für ${f}.`, effacer: 'Filter löschen', voirPlus: (n) => `Mehr anzeigen (noch ${n})`,
    suivre: 'Diesem Spiel folgen', mesSuivis: 'Meine gefolgten Spiele', alerteJusqua: (x, d) => `${x}, dem du folgst, ist gratis bis ${d}!`, alerteMaintenant: (x) => `${x}, dem du folgst, ist gerade gratis!`, alerteBientot: (x, d) => `${x}, dem du folgst, ist gratis ab ${d}!`, aucunSuivi: 'Hier folgst du keinem Spiel. Tippe auf ★, um zu erfahren, wann ein Spiel gratis wird.',
    creditImage: 'Bild:',
    indes: 'Indie', demos: 'Demos', libres: 'Open Source & Retro', bientot: 'Bald gratis', enCeMoment: 'Jetzt gratis', gratuitDes: (d) => `Gratis ab ${d}`, voirEpic: 'Bei Epic ansehen', essayer: 'Demo testen', nbJeux: (n) => `${n} Spiele`, visites: (n) => `${n} Besuche`,
    videos: 'Videos', lire: 'Abspielen', sourcesMedias: 'Videos und Screenshots:',
    fermer: 'Schließen', precedente: 'Vorheriger Screenshot', suivante: 'Nächster Screenshot', agrandir: 'Screenshot vergrößern', bandeAnnonce: 'Trailer', commentRecuperer: 'So holst du es dir', captures: 'Screenshots', aPropos: 'Über das Spiel', enAnglais: '(auf Englisch)', configMin: 'Mindestanforderungen', developpeur: 'Entwickler', editeur: 'Publisher', sortie: 'Erscheinung', os: 'System', processeur: 'Prozessor', memoire: 'Arbeitsspeicher', graphismes: 'Grafik', stockage: 'Speicher', chargement: 'Wird geladen…',
    dejaOfferts: 'Bereits verschenkt', totalOffert: (n, m, d) => `${n} ${n > 1 ? 'Spiele' : 'Spiel'} seit dem ${d} verschenkt${m ? `, im Wert von ${m}` : ''}`, partager: 'Teilen', lienCopie: 'Link kopiert', partageTexte: (x) => `${x} ist gerade gratis!`,
    nouveau: 'Neu',
    genres: 'Alle Genres', genre: 'Genre', tri: 'Sortieren',
    triFin: 'Endet bald', triRecent: 'Neueste', triValeur: 'Höchster Wert', triPopulaire: 'Beliebt', triAZ: 'A bis Z',
    suisMoi: 'Gefallen dir diese Angebote? Folge Geekozor:', installer: 'Installieren', alertesActiver: "Benachrichtigen", alertesActives: "Alarme an", alertesIos: "Auf dem iPhone gehen Alarme nur mit installierter App: Tippe auf Teilen, dann „Zum Home-Bildschirm“, und öffne die App vom Home-Bildschirm.", alertesBloquees: "Benachrichtigungen sind für diese Seite blockiert: Erlaube sie in den Browser-Einstellungen.", jeux: 'Gratis-Spiele', dlc: 'Boni & DLC', f2p: 'Free-to-play', retro: 'Retro',
    recherche: 'Spiel suchen…', toutes: 'Alle', recuperer: 'Holen', jouer: 'Kostenlos spielen',
    gratuit: 'Gratis', encore: (j, h) => `Noch ${j} T. ${h} Std.`,
    nbOffres: (n) => `${n} aktuelle Angebote`, nbF2p: (n) => `${n} Free-to-play-Spiele`,
    erreur: 'Liste konnte nicht geladen werden. Prüfe deine Verbindung.',
    sources: 'Daten:', maj: 'Aktualisiert am', navigateur: 'Browser', mobile: 'Mobil',
    retroTitre: 'Legales Retro 👑',
    retroTexte: 'Alte Spiele ja, Raubkopien nein. Diese Klassiker verschenken ihre Publisher offiziell, auf GOG oder Steam.',
    env: 'ca.', videoTiktok: "Mein TikTok-Video zu diesem Spiel", essais: "🎮 Gratis an diesem Wochenende", essaisTexte: "Nur ein paar Tage gratis spielbar: Das Spiel bleibt nicht in deiner Bibliothek.", economies: (m, n) => `💰 Du hast ${m} gespart dank dieser Seite (${n} ${n > 1 ? 'Spiele geholt' : 'Spiel geholt'})`, bientotVide: 'Die nächsten Gratis-Spiele kommen bald, schau am Donnerstag wieder vorbei 👑',
  },
  es: {
    recupere: 'Ya lo tengo', heures: (h, m) => `Solo quedan ${h} h ${m} min`, videOnglet: (o) => `Nada en «${o}» por ahora. La lista se actualiza cada hora.`, videFiltres: (o, f) => `Nada en «${o}» para ${f} por ahora.`, effacer: 'Borrar filtros', voirPlus: (n) => `Ver más (quedan ${n})`,
    suivre: 'Seguir este juego', mesSuivis: 'Mis juegos seguidos', alerteJusqua: (x, d) => `¡${x}, que sigues, está gratis hasta el ${d}!`, alerteMaintenant: (x) => `¡${x}, que sigues, está gratis ahora!`, alerteBientot: (x, d) => `¡${x}, que sigues, estará gratis el ${d}!`, aucunSuivi: 'Ningún juego seguido aquí. Toca ★ en un juego para saber cuándo sea gratis.',
    creditImage: 'Imagen:',
    indes: 'Indie', demos: 'Demos', libres: 'Libres y retro', bientot: 'Pronto gratis', enCeMoment: 'Gratis ahora', gratuitDes: (d) => `Gratis desde ${d}`, voirEpic: 'Ver en Epic', essayer: 'Probar la demo', nbJeux: (n) => `${n} juegos`, visites: (n) => `${n} visitas`,
    videos: 'Vídeos', lire: 'Reproducir', sourcesMedias: 'Vídeos y capturas:',
    fermer: 'Cerrar', precedente: 'Captura anterior', suivante: 'Captura siguiente', agrandir: 'Ampliar la captura', bandeAnnonce: 'Tráiler', commentRecuperer: 'Cómo conseguirlo', captures: 'Capturas', aPropos: 'Acerca de', enAnglais: '(en inglés)', configMin: 'Requisitos mínimos', developpeur: 'Desarrollador', editeur: 'Editor', sortie: 'Lanzamiento', os: 'Sistema', processeur: 'Procesador', memoire: 'Memoria', graphismes: 'Gráficos', stockage: 'Almacenamiento', chargement: 'Cargando…',
    dejaOfferts: 'Ya regalados', totalOffert: (n, m, d) => `${n} ${n > 1 ? 'juegos regalados' : 'juego regalado'} desde el ${d}${m ? `, por un valor de ${m}` : ''}`, partager: 'Compartir', lienCopie: 'Enlace copiado', partageTexte: (x) => `¡${x} está gratis ahora mismo!`,
    nouveau: 'Nuevo',
    genres: 'Todos los géneros', genre: 'Género', tri: 'Ordenar',
    triFin: 'Terminan antes', triRecent: 'Más recientes', triValeur: 'Mayor valor', triPopulaire: 'Populares', triAZ: 'De la A a la Z',
    suisMoi: '¿Te gustan estas ofertas? Sigue a Geekozor:', installer: 'Instalar', alertesActiver: "Avísame", alertesActives: "Alertas activadas", alertesIos: "En iPhone, las alertas solo funcionan con la app instalada: toca Compartir, luego «Añadir a pantalla de inicio» y abre la app desde la pantalla de inicio.", alertesBloquees: "Las notificaciones están bloqueadas para este sitio: permítelas en los ajustes del navegador.", jeux: 'Juegos regalados', dlc: 'Extras y DLC', f2p: 'Free-to-play', retro: 'Retro',
    recherche: 'Buscar un juego…', toutes: 'Todas', recuperer: 'Conseguir', jouer: 'Jugar gratis',
    gratuit: 'Gratis', encore: (j, h) => `Quedan ${j} d ${h} h`,
    nbOffres: (n) => `${n} ofertas activas`, nbF2p: (n) => `${n} juegos free-to-play`,
    erreur: 'No se pudo cargar la lista. Revisa tu conexión.',
    sources: 'Datos:', maj: 'Actualizado el', navigateur: 'Navegador', mobile: 'Móvil',
    retroTitre: 'Retro legal 👑',
    retroTexte: 'Juegos antiguos, sí; piratería, no. Estos clásicos los regalan oficialmente sus editores, en GOG o Steam.',
    env: 'aprox.', videoTiktok: "Mi vídeo de TikTok sobre este juego", essais: "🎮 Gratis este fin de semana", essaisTexte: "Gratis para jugar solo unos días: el juego no se queda en tu biblioteca.", economies: (m, n) => `💰 Has ahorrado ${m} gracias al sitio (${n} ${n > 1 ? 'juegos conseguidos' : 'juego conseguido'})`, bientotVide: 'Los próximos juegos regalados llegan pronto, vuelve el jueves 👑',
  },
};

// Mêmes codes que scripts/plateformes.mjs
const PLATEFORMES = ['pc', 'ps5', 'ps4', 'xboxseries', 'xboxone', 'switch2', 'switch', 'mobile', 'vr', 'navigateur'];
const NOMS = { pc: 'PC', ps5: 'PS5', ps4: 'PS4', xboxseries: 'Xbox Series', xboxone: 'Xbox One', switch2: 'Switch 2', switch: 'Switch', vr: 'VR' };
// Rétrocompatibilité : la PS5 lit les jeux PS4, la Xbox Series ceux de Xbox One, la Switch 2 ceux de Switch.
const AUSSI = { ps5: 'ps4', xboxseries: 'xboxone', switch2: 'switch' };

const memoire = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
// Jeux suivis : retenus par leur nom, sur ce téléphone seulement (un jeu free-to-play peut revenir offert sous un autre id).
// shortcut: pas de notification app fermée, à remplacer par le push par jeu (Cloudflare) après la mise en ligne.
const lireListe = (k) => { try { return JSON.parse(memoire.get(k)) || []; } catch { return []; } };
const suivis = new Set(lireListe('suivis').map(cleNom));
// Un DLC ne compte que sous son nom exact : « Destiny 2: Pack X » offert ne veut pas dire que Destiny 2 l'est.
const clesSuivi = (titre, type) => (type === 'dlc' ? [cleNom(titre)] : variantesNom(titre));
const estSuivi = (g) => clesSuivi(g.titre, g.type).some((k) => suivis.has(k));
// Offres déjà récupérées : grisées et rangées en bas de la liste.
const recuperes = new Set(lireListe('recuperes'));
const economies = (() => { try { return JSON.parse(memoire.get('economies')) || {}; } catch { return {}; } })(); // id -> valeur (« $9.99 », « €19.50 »)
function noterEconomies() {
  const tous = [...etat.donnees.offerts, ...(etat.donnees.historique ?? [])];
  for (const id of recuperes) if (!(id in economies)) { const g = tous.find((x) => x.id === id); if (g) economies[id] = g.valeur ?? null; }
  for (const id of Object.keys(economies)) if (!recuperes.has(id)) delete economies[id];
  memoire.set('economies', JSON.stringify(economies));
}
// Sans tout réafficher (la carte ne doit pas bouger sous le doigt) : texte mis à jour, ou ajouté en haut de la liste.
function majEconomies() {
  const el = document.querySelector('.economies'), txt = economiesTexte();
  if (el) { el.textContent = txt; el.hidden = !txt; } else if (txt && offresTemporaires()) $('#liste').insertAdjacentHTML('afterbegin', `<p class="economies">${esc(txt)}</p>`);
}
function economiesTexte() {
  const v = [...recuperes].map((id) => economies[id]).filter((x) => euros(x) > 0);
  if (!v.length) return '';
  const total = v.reduce((s, x) => s + euros(x), 0);
  return t('economies', (v.some(estConverti) ? t('env') + ' ' : '') + formatEuros(total, etat.langue, 0), v.length);
}
const langueAuto = (navigator.language || 'fr').slice(0, 2);
const etat = {
  onglet: 'jeux', plateformes: new Set(), genre: '', tri: '', recherche: '', donnees: null, suivisSeuls: false, limite: 0,
  langue: memoire.get('langue') || (T[langueAuto] ? langueAuto : 'en'),
};
const $ = (s) => document.querySelector(s);
const t = (k, ...a) => { const v = T[etat.langue][k]; return typeof v === 'function' ? v(...a) : v; };
const nomPlateforme = (p) => NOMS[p] || t(p);

// Les données viennent d'API externes : on échappe tout ce qu'on insère.
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
// Icônes dessinées, à la place de ★ ✕ ▶ 🔔 qui changent d'aspect d'un téléphone à l'autre.
const ICONES = {
  etoile: 'M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z',
  partager: 'M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6',
  coche: 'M5 12.5l4.5 4.5L19 7',
  croix: 'M6 6l12 12M18 6L6 18',
  lecture: 'M8 5v14l11-7z',
  cloche: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
};
const icone = (nom) => `<svg class="ic ic-${nom}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONES[nom]}"/></svg>`;
// Statistiques GoatCounter. count.js arrive parfois après app.js (lien partagé vers une fiche) : on attend qu'il soit chargé.
const stat = (o) => (window.goatcounter?.count ? goatcounter.count(o)
  : document.querySelector('script[data-goatcounter]')?.addEventListener('load', () => window.goatcounter?.count?.(o), { once: true }));
// Réseaux de Geekozor : en-tête, bas de page et fiche de chaque jeu.
const RESEAUX = [
  ['tiktok', 'TikTok', 'https://www.tiktok.com/@geekozor', 'M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'],
  ['instagram', 'Instagram', 'https://www.instagram.com/geekozorgaming/', 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z'],
  ['youtube', 'YouTube', 'https://www.youtube.com/@geekozorgaming', 'M9.5 7.5v9l7.5-4.5z'],
];
const reseauxHTML = RESEAUX.map(([id, nom, url, d]) =>
  `<a class="${id}" href="${url}" target="_blank" rel="noopener" aria-label="Geekozor ${nom}" title="${nom}" data-reseau="${id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg></a>`).join('');
document.querySelectorAll('.reseaux').forEach((el) => { el.innerHTML = reseauxHTML; });

// Adresses https, ou images hébergées avec l'app (jeux libres) ; tout le reste est neutralisé.
const lienSur = (u) => (/^https:\/\//.test(u) || /^images\/[\w./-]+$/.test(u) ? u : '#');

// Temps restant (ou date de début pour « Bientôt gratuit ») ; urgent = moins de 24 h.
function tempsDe(g) {
  if (g.debut && new Date(g.debut) > Date.now()) {
    return { texte: t('gratuitDes', new Date(g.debut).toLocaleString(etat.langue, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })) };
  }
  const ms = g.fin ? new Date(g.fin) - Date.now() : -1;
  if (ms < 0) return null;
  const urgent = ms < 86400000;
  const min = Math.ceil(ms / 60000);
  return { texte: urgent ? t('heures', Math.floor(min / 60), min % 60) : t('encore', Math.floor(min / 1440), Math.floor(min / 60) % 24), urgent };
}

// Onglets des offres temporaires (avec date de fin) ; les autres sont des listes de jeux gratuits permanents.
const offresTemporaires = () => etat.onglet === 'jeux' || etat.onglet === 'dlc';
const ONGLET_DU_TYPE = { jeu: 'jeux', bientot: 'jeux', dlc: 'dlc', inde: 'indes', demo: 'demos', libre: 'libres', retro: 'libres', essai: 'jeux' };
const LISTE_DE_L_ONGLET = { f2p: 'f2p', indes: 'indes', demos: 'demos', libres: 'libres' };

function elements() {
  const d = etat.donnees;
  if (!offresTemporaires()) return d[LISTE_DE_L_ONGLET[etat.onglet]] ?? [];
  const type = etat.onglet === 'jeux' ? 'jeu' : 'dlc';
  return d.offerts.filter((g) => g.type === type && (!g.fin || new Date(g.fin) > Date.now()));
}
const aVenir = () => (etat.donnees.bientot ?? []).filter((g) => new Date(g.debut) > Date.now());

const prix = (g) => euros(g.valeur) ?? 0;
const prixTexte = (g) => (estConverti(g.valeur) ? t('env') + ' ' : '') + formatEuros(prix(g), etat.langue);
const TRIS = {
  triFin: (a, b) => (a.fin ? new Date(a.fin) : Infinity) - (b.fin ? new Date(b.fin) : Infinity),
  triRecent: (a, b) => new Date(b.publie) - new Date(a.publie),
  triValeur: (a, b) => prix(b) - prix(a),
  triPopulaire: null, // ordre déjà fourni par FreeToGame
  triAZ: (a, b) => a.titre.localeCompare(b.titre, etat.langue),
};
const trisOnglet = () => (offresTemporaires() ? ['triFin', 'triRecent', 'triValeur', 'triAZ'] : ['triPopulaire', 'triAZ']);
const options = (valeurs, choisi, libelle) => valeurs.map((v) =>
  `<option value="${esc(v)}" ${v === choisi ? 'selected' : ''}>${esc(libelle(v))}</option>`).join('');

// Sur les cartes, le temps restant est une pastille posée sur l'image (avecTemps = false) ; la fiche le garde en badge.
function badgesDe(g, nbGenres, avecTemps = true) {
  const temps = avecTemps && tempsDe(g);
  return [
    temps && `<span class="badge fin">${temps.texte}</span>`,
    g.publie && Date.now() - new Date(g.publie) < 86400000 && `<span class="badge nouveau">${t('nouveau')}</span>`,
    etat.langue === 'fr' && g.fr && `<span class="badge fr" title="${t(g.fr + 'Titre')}">${t(g.fr)}</span>`, // langues Steam, utile surtout en français
    prix(g) > 0 && `<span class="badge prix"><s>${esc(prixTexte(g))}</s>${t('gratuit')}</span>`,
    ...(g.genres ?? []).slice(0, nbGenres).map((x) => `<span class="badge genre">${esc(x)}</span>`),
  ].filter(Boolean).join('');
}

function carte(g) {
  const badges = badgesDe(g, 3, false);
  const temps = tempsDe(g);
  const verdict = verdictDe(g);
  return `<article class="carte${recuperes.has(g.id) ? ' recupere' : ''}${verdict ? ' roi' : ''}" id="${esc(g.id)}">
    <a href="#${esc(g.id)}" class="ouvrir" tabindex="-1" aria-hidden="true">${g.image
      ? `<img src="${esc(lienSur(g.image))}" alt="" loading="lazy">`
      : `<div class="sans-image">${esc(g.titre)}</div>`}</a>
    ${temps ? `<span class="pastille${temps.urgent ? ' urgente' : ''}" data-id="${esc(g.id)}">${temps.texte}</span>` : ''}
    ${caseRecupere(g)}
    <div class="corps">
      <h2><a href="#${esc(g.id)}" class="ouvrir">${esc(g.titre)}</a></h2>
      <div class="meta">${esc(metaDe(g))}</div>
      ${badges && `<div class="badges">${badges}</div>`}
      ${verdict
        ? `<p class="desc verdict"><span class="badge roi">👑 Choix du Roi</span> « ${esc(verdict)} » <span class="signe">— Le Roi</span></p>`
        : `<p class="desc">${esc(descriptionDe(g))}</p>`}
      ${actionsDe(g)}
    </div>
  </article>`;
}

// Sur une carte : rond ✓ posé sur l'image (le texte reste lu par les lecteurs d'écran) ; dans la fiche : case + texte.
const caseRecupere = (g) => (g.type === 'jeu' || g.type === 'dlc'
  ? `<label class="case-recupere" title="${t('recupere')}"><input type="checkbox" data-id="${esc(g.id)}" ${recuperes.has(g.id) ? 'checked' : ''}><span class="rond">${icone('coche')}</span><span class="txt">${t('recupere')}</span></label>` : '');
const metaDe = (g) => (g.plateformesTexte || g.plateformes.map(nomPlateforme).join(', ')) + (g.editeur ? ' · ' + g.editeur : '');
// Choix du Roi : choix-du-roi.json, jeu repéré par son id ou son titre (sans tenir compte des majuscules).
let roi = new Map();
fetch('choix-du-roi.json', { cache: 'no-cache' }).then((r) => r.json())
  .then((l) => { roi = new Map(l.map((c) => [String(c.jeu).toLowerCase(), c.verdict])); afficher(); }).catch(() => {});
// Vidéos TikTok de Geekozor sur un jeu : tiktok.json (`jeu` = id ou titre exact, `video` = lien de la vidéo).
let tiktoks = new Map();
fetch('tiktok.json', { cache: 'no-cache' }).then((r) => r.json())
  .then((l) => { tiktoks = new Map(l.filter((v) => /^https:\/\/www\.tiktok\.com\/@[\w.]+\/video\/\d+$/.test(v.video)) // lien TikTok exact, rien d'autre
    .map((v) => [String(v.jeu).toLowerCase(), v.video])); if (etat.fiche) rendreFiche(); }).catch(() => {});
const tiktokDe = (g) => tiktoks.get(g.id.toLowerCase()) ?? tiktoks.get(g.titre.toLowerCase());
const verdictDe = (g) => roi.get(g.id.toLowerCase()) ?? roi.get(g.titre.toLowerCase());
const roiDabord = (a, b) => !verdictDe(a) - !verdictDe(b);
const descriptionDe = (g) => (etat.langue !== 'en' && g.trad?.[etat.langue]) || g.description;
const actionsDe = (g) => `<div class="actions">
    <a class="recuperer" data-id="${esc(g.id)}" data-titre="${esc(g.titre)}" href="${esc(lienSur(g.liens?.[etat.langue] ?? g.lien))}" target="_blank" rel="noopener">${t(
      { jeu: 'recuperer', dlc: 'recuperer', retro: 'recuperer', bientot: 'voirEpic', demo: 'essayer' }[g.type] ?? 'jouer')}</a>
    <button class="suivre" data-titre="${esc(g.titre)}" data-type="${esc(g.type)}" aria-pressed="${estSuivi(g)}" aria-label="${t('suivre')}" title="${t('suivre')}">${icone('etoile')}</button>
    <button class="partager" data-id="${esc(g.id)}" data-titre="${esc(g.titre)}" title="${t('partager')}">${icone('partager')}<span>${t('partager')}</span></button>
  </div>`;

// ---------- Fiche d'un jeu (…/#ftg57) ----------
async function ouvrirFiche(g) {
  etat.fiche = { g, d: null };
  stat({ path: `jeu/${g.id}`, title: g.titre });
  rendreFiche();
  $('#fiche').hidden = false;
  document.body.classList.add('fiche-ouverte');
  $('#fiche').scrollTop = 0;
  $('#fiche .fermer').focus();
  const d = await fetch(`data/jeux/${encodeURIComponent(g.id)}.json`).then((r) => r.json()).catch(() => ({}));
  if (etat.fiche?.g === g) { etat.fiche.d = d; rendreFiche(); }
}

function rendreFiche() {
  const { g, d } = etat.fiche;
  const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(g.titre + ' trailer')}`;
  const infos = [['developpeur', d?.developpeur], ['editeur', g.editeur], ['sortie', d?.sortie]].filter(([, v]) => v);
  const longueTraduite = etat.langue !== 'en' && d?.tradLongue?.[etat.langue];
  const config = Object.entries(d?.config ?? {}).filter(([, v]) => v && !/not defined/i.test(v));
  $('#fiche').innerHTML = `<div class="fiche-contenu">
    <button class="fermer">${icone('croix')} ${t('fermer')}</button>
    ${g.image ? `<img class="fiche-image${g.type === 'libre' ? ' logo' : ''}" src="${esc(lienSur(g.image))}" alt="">` : ''}
    <div class="corps">
      <h2 id="fiche-titre">${esc(g.titre)}</h2>
      <div class="meta">${esc(metaDe(g))}</div>
      <div class="badges">${badgesDe(g, Infinity)}</div>
      ${caseRecupere(g)}
      ${actionsDe(g)}
      ${tiktokDe(g) ? `<a class="bande-annonce video-tiktok" href="${esc(tiktokDe(g))}" target="_blank" rel="noopener">${icone('lecture')} ${t('videoTiktok')}</a>` : ''}
      <p>${esc(descriptionDe(g))}</p>
      ${!d ? `<p class="meta">${t('chargement')}</p>` : ''}
      ${d && !d.videos?.length ? `<a class="bande-annonce" href="${youtube}" target="_blank" rel="noopener">${icone('lecture')} ${t('bandeAnnonce')}</a>` : ''}
      ${d?.videos?.length ? `<h3>${t('videos')}</h3><div class="captures">${d.videos.map((v) =>
        `<button class="lire-video" ${v.youtube ? `data-youtube="${esc(v.youtube)}"` : `data-hls="${esc(lienSur(v.hls))}"`} aria-label="${t('lire')} : ${esc(v.nom)}">
          <img src="${esc(lienSur(v.miniature))}" alt="" loading="lazy"><span aria-hidden="true">${icone('lecture')}</span></button>`).join('')}</div>` : ''}
      ${d?.instructions ? `<h3>${t('commentRecuperer')}</h3><p class="texte">${esc((etat.langue !== 'en' && d.tradInstructions?.[etat.langue]) || d.instructions)}</p>` : ''}
      ${d?.captures?.length ? `<h3>${t('captures')}</h3><div class="captures">${d.captures.map((c) =>
        `<button class="agrandir" aria-label="${t('agrandir')}"><img src="${esc(lienSur(c))}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
      ${d?.source || d?.sourceVideo ? `<p class="meta">${t('sourcesMedias')} ${esc([d.source, d.sourceVideo].filter(Boolean).join(', '))}</p>` : ''}
      ${g.credit ? `<p class="meta">${t('creditImage')} <a href="${esc(lienSur(g.creditLien))}" target="_blank" rel="noopener">${esc(g.credit)}</a></p>` : ''}
      ${d?.descriptionLongue ? `<h3>${t('aPropos')} <span class="meta">${etat.langue === 'en' || longueTraduite ? '' : t('enAnglais')}</span></h3>
        <p class="texte">${esc(longueTraduite || d.descriptionLongue)}</p>` : ''}
      ${infos.length ? `<dl>${infos.map(([k, v]) => `<dt>${t(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
      ${config.length ? `<h3>${t('configMin')}</h3><dl>${config.map(([k, v]) =>
        `<dt>${t({ os: 'os', processor: 'processeur', memory: 'memoire', graphics: 'graphismes', storage: 'stockage' }[k] ?? 'os')}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
      <p class="suis-moi">${t('suisMoi')} <span class="reseaux">${reseauxHTML}</span></p>
    </div>
  </div>`;
}

// Vidéos Steam (format HLS) : Safari les lit seul, les autres navigateurs via hls.js, chargé au premier clic.
let hls;
const chargerHls = () => hls ??= new Promise((ok, ko) => {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
  // Empreinte du fichier : si le CDN est piraté et le fichier modifié, le navigateur refuse de l'exécuter.
  s.integrity = 'sha384-w6Gb3fXHb5e1LUYa/hYA5Q41bEDglN5ZPCG7Jvnoo8/X90oGnlPqBlBJCe38mEMm';
  s.crossOrigin = 'anonymous';
  s.onload = ok;
  s.onerror = ko;
  document.head.append(s);
});
document.addEventListener('click', async (e) => {
  const b = e.target.closest('.lire-video');
  if (!b) return;
  if (b.dataset.youtube) { // version sans cookies de YouTube, chargée seulement maintenant
    const f = Object.assign(document.createElement('iframe'), {
      className: 'video', title: b.getAttribute('aria-label'), allowFullscreen: true,
      src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.youtube)}?autoplay=1`,
    });
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    return b.replaceWith(f);
  }
  const v = Object.assign(document.createElement('video'), { controls: true, playsInline: true, className: 'video' });
  v.poster = b.querySelector('img').src;
  b.replaceWith(v);
  if (v.canPlayType('application/vnd.apple.mpegurl')) v.src = b.dataset.hls;
  else {
    try { await chargerHls(); } catch { hls = null; return; }
    const h = new Hls();
    h.loadSource(b.dataset.hls);
    h.attachMedia(v);
  }
  v.play().catch(() => {}); // si le navigateur bloque la lecture auto, les contrôles restent là
});

// Une seule vidéo à la fois : lancer une bande-annonce met les autres en pause.
document.addEventListener('play', (e) => document.querySelectorAll('video').forEach((v) => v !== e.target && v.pause()), true);

// Captures en grand : on glisse (téléphone), ou flèches du clavier / boutons ‹ ›, et ça reboucle à la fin.
const visionneuse = Object.assign(document.createElement('dialog'), { className: 'visionneuse' });
document.body.append(visionneuse);
const defiler = (sens) => {
  const d = visionneuse.querySelector('.defile');
  const n = d.children.length;
  d.scrollTo({ left: ((Math.round(d.scrollLeft / d.clientWidth) + sens + n) % n) * d.clientWidth, behavior: 'smooth' });
};
document.addEventListener('click', (e) => {
  const b = e.target.closest('.agrandir');
  if (b) {
    const imgs = [...b.parentElement.querySelectorAll('img')];
    visionneuse.innerHTML = `<div class="defile">${imgs.map((i) => `<img src="${esc(i.src)}" alt="">`).join('')}</div>
      <button class="prec" aria-label="${t('precedente')}">‹</button><button class="suiv" aria-label="${t('suivante')}">›</button>
      <button class="fermer">${icone('croix')} ${t('fermer')}</button>`;
    visionneuse.showModal();
    const d = visionneuse.querySelector('.defile');
    d.scrollLeft = imgs.indexOf(b.querySelector('img')) * d.clientWidth;
    return;
  }
  if (!visionneuse.open) return;
  if (e.target.closest('.prec')) defiler(-1);
  else if (e.target.closest('.suiv')) defiler(1);
  else if (e.target.closest('.fermer') || !e.target.closest('img')) visionneuse.close(); // clic à côté de l'image = fermer
});
visionneuse.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') defiler(-1);
  if (e.key === 'ArrowRight') defiler(1);
});

function fermerFiche() {
  if (!etat.fiche) return;
  const id = etat.fiche.g.id;
  etat.fiche = null;
  $('#fiche').hidden = true;
  document.body.classList.remove('fiche-ouverte');
  document.getElementById(id)?.scrollIntoView({ block: 'center' });
}

// L'adresse (…/#gp1234) dit quelle fiche est ouverte : clic sur un jeu, lien partagé, bouton retour.
function suivreAdresse() {
  const id = decodeURIComponent(location.hash.slice(1));
  const d = etat.donnees;
  const g = id && ['offerts', 'bientot', 'essais', 'f2p', 'indes', 'demos', 'libres'].map((l) => d[l]?.find((x) => x.id === id)).find(Boolean);
  if (!g) return fermerFiche(); // pas de fiche, jeu expiré ou lien inconnu : la liste
  const onglet = ONGLET_DU_TYPE[g.type] ?? 'f2p';
  if (onglet !== etat.onglet) { // arrivée par un lien partagé : la liste derrière montre le jeu, sans filtre
    etat.onglet = onglet;
    etat.plateformes.clear();
    etat.genre = '';
    etat.recherche = $('#recherche').value = '';
    document.querySelectorAll('[data-onglet]').forEach((x) => x.setAttribute('aria-selected', x.dataset.onglet === onglet));
    afficher();
  }
  document.querySelectorAll('.carte.cible').forEach((c) => c.classList.remove('cible'));
  document.getElementById(id)?.classList.add('cible');
  ouvrirFiche(g);
}
addEventListener('hashchange', suivreAdresse);

let ficheDepuisListe = false; // ouverte en cliquant dans l'app (sinon : arrivée par un lien partagé)
document.addEventListener('click', (e) => {
  if (e.target.closest('.ouvrir')) ficheDepuisListe = true;
  if (!e.target.closest('#fiche .fermer')) return;
  if (ficheDepuisListe) return history.back(); // revient à la liste, comme le bouton retour
  history.replaceState(null, '', location.pathname + location.search);
  fermerFiche();
});
addEventListener('keydown', (e) => { if (e.key === 'Escape' && etat.fiche && !visionneuse.open) $('#fiche .fermer').click(); });

function afficher() {
  if (!etat.donnees) return;
  const actif = document.querySelector('.onglets [aria-selected="true"]'); // garde l'onglet choisi visible dans la barre
  actif.parentElement.scrollLeft = actif.offsetLeft - (actif.parentElement.clientWidth - actif.offsetWidth) / 2;
  const tous = elements();
  // Toutes les plateformes, même vides ; « Navigateur » seulement pour les jeux permanents.
  const filtres = PLATEFORMES.filter((p) => p !== 'navigateur' || !offresTemporaires());
  etat.plateformes.forEach((p) => filtres.includes(p) || etat.plateformes.delete(p));
  $('#plateformes').innerHTML = [null, ...filtres].map((p) =>
    `<button data-plateforme="${p ?? ''}" aria-pressed="${p ? etat.plateformes.has(p) : !etat.plateformes.size}">${p ? nomPlateforme(p) : t('toutes')}</button>`
  ).join('');

  const genres = [...new Set(tous.flatMap((g) => g.genres ?? []))].sort();
  if (!genres.includes(etat.genre)) etat.genre = '';
  $('#genre').hidden = !genres.length;
  $('#genre').setAttribute('aria-label', t('genre'));
  $('#genre').innerHTML = options(['', ...genres], etat.genre, (v) => v || t('genres'));

  if (!trisOnglet().includes(etat.tri)) etat.tri = trisOnglet()[0];
  $('#tri').setAttribute('aria-label', t('tri'));
  $('#tri').innerHTML = options(trisOnglet(), etat.tri, t);

  const q = etat.recherche.toLowerCase();
  const garde = (g) =>
    (!etat.plateformes.size || [...etat.plateformes].some((p) => g.plateformes.includes(p) || g.plateformes.includes(AUSSI[p]))) &&
    (!etat.genre || g.genres?.includes(etat.genre)) &&
    (!q || g.titre.toLowerCase().includes(q)) &&
    (!etat.suivisSeuls || estSuivi(g));
  const liste = tous.filter(garde);
  if (TRIS[etat.tri]) liste.sort(TRIS[etat.tri]);
  liste.sort((a, b) => recuperes.has(a.id) - recuperes.has(b.id)); // tri stable : l'ordre choisi reste dans chaque groupe
  liste.sort(roiDabord);
  liste.sort((a, b) => (a.type === 'retro') - (b.type === 'retro')); // Rétro légal après les jeux libres

  // Par paquets de 40 (plus de 500 free-to-play) ; on repart de 40 dès que l'onglet ou un filtre change.
  const reglages = JSON.stringify([etat.onglet, [...etat.plateformes], etat.genre, etat.tri, q, etat.suivisSeuls]);
  if (reglages !== etat.reglages) { etat.reglages = reglages; etat.limite = PAQUET; }
  const cible = liste.findIndex((g) => g.id === decodeURIComponent(location.hash.slice(1))); // lien partagé vers un jeu plus bas
  if (cible >= etat.limite) etat.limite = Math.ceil((cible + 1) / PAQUET) * PAQUET;

  // Pas de total « X € de jeux offerts » : même sans les lots, les prix gonflés d'IndieGala (29,99 $ le petit jeu) en font plus de la moitié.
  $('#resume').textContent = t(offresTemporaires() ? 'nbOffres' : etat.onglet === 'f2p' ? 'nbF2p' : 'nbJeux', liste.length);

  $('#suivis').setAttribute('aria-pressed', etat.suivisSeuls);
  $('#suivis').innerHTML = `${icone('etoile')} ${esc(t('mesSuivis'))}`;
  afficherBandeau();

  const bientot = etat.onglet === 'jeux' ? aVenir().filter(garde).sort(roiDabord) : [];
  const essais = etat.onglet === 'jeux' ? (etat.donnees.essais ?? []).filter(garde).sort(roiDabord) : [];
  // Ce qui est gratuit maintenant d'abord, « Bientôt gratuit » ensuite.
  const eco = offresTemporaires() && economiesTexte();
  $('#liste').innerHTML = (eco ? `<p class="economies">${esc(eco)}</p>` : '')
    + (bientot.length || (etat.onglet === 'jeux' && !aVenir().length) ? `<h2 class="section">${t('enCeMoment')}</h2>` : '')
    + (liste.slice(0, etat.limite).map((g, i, l) => (g.type === 'retro' && l[i - 1]?.type !== 'retro' ? enteteRetro() : '') + carte(g)).join('') || messageVide())
    + (liste.length > etat.limite ? `<button class="voir-plus">${t('voirPlus', liste.length - etat.limite)}</button>` : '')
    + (bientot.length ? `<h2 class="section">${t('bientot')}</h2>${bientot.map(carte).join('')}`
      // Rien d'annoncé chez Epic : on le dit plutôt que de cacher la section (pas quand ce sont les filtres qui la vident).
      : etat.onglet === 'jeux' && !aVenir().length ? `<h2 class="section">${t('bientot')}</h2><p class="vide">${esc(t('bientotVide'))}</p>` : '')
    + (essais.length ? `<h2 class="section">${t('essais')}</h2><p class="intro-section">${t('essaisTexte')}</p>${essais.map(carte).join('')}` : '')
    + (etat.onglet === 'jeux' && liste.length <= etat.limite ? historiqueHTML(garde) : '');
}


const enteteRetro = () => `<h2 class="section">${t('retroTitre')}</h2><p class="intro-section">${t('retroTexte')}</p>`;

// Fin de l'onglet Jeux offerts : les jeux déjà offerts (dates, valeur), avec les mêmes filtres que la liste.
function historiqueHTML(garde) {
  const d = etat.donnees;
  const h = (d.historique ?? []).filter(garde);
  if (!h.length) return '';
  const date = (s) => new Date(s).toLocaleDateString(etat.langue, { day: 'numeric', month: 'short' });
  const depuis = new Date(d.historiqueDepuis).toLocaleDateString(etat.langue, { day: 'numeric', month: 'long', year: 'numeric' });
  return `<h2 class="section">${t('dejaOfferts')}</h2>
    <p class="historique-total">${esc(t('totalOffert', d.historiqueNb, d.historiqueTotal ? formatEuros(d.historiqueTotal, etat.langue, 0) : '', depuis))}</p>
    <ul class="historique">${h.map((g) => `<li><span class="dates">${date(g.debut)} – ${date(g.fin)}</span>
      <span class="titre">${esc(g.titre)}<small>${esc(g.plateformesTexte)}</small></span>${prix(g) > 0 ? `<s>${esc(prixTexte(g))}</s>` : ''}</li>`).join('')}</ul>`;
}

const PAQUET = 40;

// Liste vide : dire pourquoi, et proposer d'effacer les filtres s'il y en a.
function messageVide() {
  const filtres = [...etat.plateformes].map(nomPlateforme);
  if (etat.genre) filtres.push(etat.genre);
  if (etat.recherche) filtres.push(`« ${etat.recherche} »`);
  const effacer = `<button class="effacer">${t('effacer')}</button>`;
  if (etat.suivisSeuls && !filtres.length) return `<div class="vide"><p>${t('aucunSuivi')}</p>${effacer}</div>`;
  if (etat.suivisSeuls) filtres.push('★');
  if (!filtres.length) return `<p class="vide">${esc(t('videOnglet', t(etat.onglet)))}</p>`;
  return `<div class="vide"><p>${esc(t('videFiltres', t(etat.onglet), filtres.join(' · ')))}</p>${effacer}</div>`;
}

// Bandeau à l'ouverture : les jeux suivis qui sont offerts en ce moment ou bientôt (les free-to-play le sont toujours).
function afficherBandeau() {
  const date = (x) => new Date(x).toLocaleDateString(etat.langue, { day: 'numeric', month: 'long' });
  const alertes = [...etat.donnees.offerts.filter((g) => !g.fin || new Date(g.fin) > Date.now()), ...aVenir()]
    .filter((g) => estSuivi(g) && !recuperes.has(g.id))
    .map((g) => `<a href="#${esc(g.id)}" class="ouvrir">${icone('cloche')} ${esc(
      g.debut && new Date(g.debut) > Date.now() ? t('alerteBientot', g.titre, date(g.debut))
        : g.fin ? t('alerteJusqua', g.titre, date(g.fin)) : t('alerteMaintenant', g.titre))}</a>`);
  $('#bandeau').innerHTML = alertes.join('');
  $('#bandeau').hidden = !alertes.length;
}

// Compteur public GoatCounter : reste caché tant que « Allow using the visitor counter » n'est pas coché dans GoatCounter.
fetch('https://geekozor.goatcounter.com/counter/TOTAL.json').then((r) => (r.ok ? r.json() : null)).then((j) => {
  const n = parseInt(String(j?.count ?? '').replace(/\D/g, ''), 10);
  if (n) { etat.visites = n; $('#visites').textContent = t('visites', n.toLocaleString(etat.langue)); }
}).catch(() => {});

function traduirePage() {
  document.documentElement.lang = etat.langue;
  $('#langue').value = etat.langue;
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
  document.querySelectorAll('[data-t-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.tPlaceholder);
    el.setAttribute('aria-label', el.placeholder);
  });
  if (etat.visites) $('#visites').textContent = t('visites', etat.visites.toLocaleString(etat.langue));
  if (etat.donnees) {
    $('#maj').textContent = `${t('maj')} ${new Date(etat.donnees.maj).toLocaleString(etat.langue, { dateStyle: 'long', timeStyle: 'short' })}`;
  }
  afficher();
}

document.querySelector('.onglets').addEventListener('click', (e) => {
  const b = e.target.closest('[data-onglet]');
  if (!b) return;
  document.querySelectorAll('[data-onglet]').forEach((x) => x.setAttribute('aria-selected', x === b));
  etat.onglet = b.dataset.onglet;
  stat({ path: `onglet/${etat.onglet}`, title: b.textContent.trim() });
  afficher();
  scrollTo({ top: 0 });
});
$('#plateformes').addEventListener('click', (e) => {
  const b = e.target.closest('[data-plateforme]');
  if (!b) return;
  const p = b.dataset.plateforme;
  if (!p) etat.plateformes.clear();
  else if (!etat.plateformes.delete(p)) etat.plateformes.add(p); // clic = cocher / décocher
  afficher();
});
// Clic vers la boutique (Steam, Epic…) : ce qui comptera pour les liens affiliés
document.addEventListener('click', (e) => {
  const a = e.target.closest('a.recuperer');
  if (a) stat({ path: `clic/${a.dataset.id}`, title: `${a.dataset.titre} → ${new URL(a.href).hostname}`, event: true });
});
// Clic vers un réseau de Geekozor
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-reseau]');
  if (a) stat({ path: `reseau/${a.dataset.reseau}`, title: `Réseau ${a.title}`, event: true });
});
// Partage : menu natif du téléphone, sinon copie du lien
document.addEventListener('click', async (e) => { // liste et fiche
  const b = e.target.closest('.partager');
  if (!b) return;
  stat({ path: `partage/${b.dataset.id}`, title: b.dataset.titre, event: true });
  const texte = t('partageTexte', b.dataset.titre);
  const url = `${location.origin}${location.pathname}#${b.dataset.id}`; // mène directement au jeu
  if (navigator.share) return navigator.share({ title: document.title, text: texte, url }).catch(() => {});
  try {
    await navigator.clipboard.writeText(`${texte} ${url}`);
    b.querySelector('span').textContent = t('lienCopie');
    b.classList.add('copie'); // sur une carte, le texte caché apparaît le temps de confirmer
  } catch {}
});
document.addEventListener('click', (e) => { // ★ sur une carte ou dans la fiche
  const b = e.target.closest('.suivre');
  if (!b) return;
  const cles = clesSuivi(b.dataset.titre, b.dataset.type);
  if (cles.some((k) => suivis.has(k))) cles.forEach((k) => suivis.delete(k)); // ne plus suivre, sous tous ses noms
  else suivis.add(cleNom(b.dataset.titre));
  memoire.set('suivis', JSON.stringify([...suivis]));
  document.querySelectorAll('.suivre').forEach((x) => x.setAttribute('aria-pressed', clesSuivi(x.dataset.titre, x.dataset.type).some((k) => suivis.has(k))));
  afficherBandeau(); // pas afficher() : la carte ne doit pas disparaître sous le doigt avec le filtre actif
});
document.addEventListener('change', (e) => { // « Je l'ai récupéré », sur la carte ou dans la fiche
  const c = e.target.closest('.case-recupere input');
  if (!c) return;
  if (c.checked) recuperes.add(c.dataset.id); else recuperes.delete(c.dataset.id);
  memoire.set('recuperes', JSON.stringify([...recuperes]));
  noterEconomies();
  majEconomies();
  document.querySelectorAll(`.case-recupere input[data-id="${CSS.escape(c.dataset.id)}"]`).forEach((x) => { x.checked = c.checked; });
  document.getElementById(c.dataset.id)?.classList.toggle('recupere', c.checked);
  afficherBandeau(); // la carte reste en place ; elle descendra au prochain affichage
});
$('#liste').addEventListener('click', (e) => {
  if (e.target.closest('.voir-plus')) { etat.limite += PAQUET; afficher(); }
  if (e.target.closest('.effacer')) {
    etat.plateformes.clear();
    etat.genre = '';
    etat.recherche = $('#recherche').value = '';
    etat.suivisSeuls = false;
    afficher();
  }
});
$('#suivis').addEventListener('click', () => { etat.suivisSeuls = !etat.suivisSeuls; afficher(); });
$('#genre').addEventListener('change', (e) => { etat.genre = e.target.value; afficher(); });
$('#tri').addEventListener('change', (e) => { etat.tri = e.target.value; afficher(); });
$('#recherche').addEventListener('input', (e) => { etat.recherche = e.target.value; afficher(); });
$('#langue').addEventListener('change', (e) => { etat.langue = e.target.value; memoire.set('langue', etat.langue); traduirePage(); });

// Bouton "Installer" (Android / Chrome / Edge)
let invite;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); invite = e; $('#installer').hidden = false; });
// iPhone / iPad : pas d'invite d'installation ; c'est le bouton des alertes qui explique le geste (moins de boutons sur téléphone).
const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
$('#installer').addEventListener('click', () => { invite.prompt(); $('#installer').hidden = true; });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

// Notifications push (OneSignal) : nouveaux jeux offerts et rappel < 24 h, envoyés par scripts/notifications.mjs.
// iPhone : uniquement depuis l'appli installée (règle d'Apple), sinon on explique comment l'installer.
const boutonAlertes = $('#alertes');
// Téléphone : la cloche rejoint les icônes des réseaux, sous le titre (en haut à droite, elle écrasait le sous-titre).
const petitEcran = matchMedia('(max-width: 500px)');
const placerAlertes = () => (petitEcran.matches ? $('.sous-titre .reseaux') : $('.titre')).append(boutonAlertes);
placerAlertes(); petitEcran.addEventListener('change', placerAlertes);
const majAlertes = (actif) => {
  const texte = boutonAlertes.querySelector('[data-t]'); // retraduit par traduirePage
  texte.dataset.t = actif ? 'alertesActives' : 'alertesActiver';
  texte.textContent = t(texte.dataset.t);
  boutonAlertes.setAttribute('aria-pressed', actif);
};
if (ios && !navigator.standalone) {
  majAlertes(false); boutonAlertes.hidden = false;
  boutonAlertes.addEventListener('click', () => alert(t('alertesIos')));
} else {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async (OneSignal) => {
    // Service worker à part dans /push/ pour ne pas toucher au hors-ligne de sw.js. Hors de github.io (aperçu local), init échoue : pas de bouton.
    await OneSignal.init({ appId: '6d958804-4c16-40fc-97be-496a98418a29', serviceWorkerPath: 'jeux-gratuits/push/OneSignalSDKWorker.js', serviceWorkerParam: { scope: '/jeux-gratuits/push/' } });
    if (!OneSignal.Notifications.isPushSupported()) return;
    const abonnement = OneSignal.User.PushSubscription;
    majAlertes(abonnement.optedIn); boutonAlertes.hidden = false;
    abonnement.addEventListener('change', (e) => majAlertes(e.current.optedIn));
    boutonAlertes.addEventListener('click', () => {
      if (abonnement.optedIn) return abonnement.optOut();
      if (Notification.permission === 'denied') return alert(t('alertesBloquees'));
      stat({ path: 'alertes/activer', event: true });
      abonnement.optIn();
    });
  });
  document.head.append(Object.assign(document.createElement('script'), { src: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js', defer: true }));
}

traduirePage();
fetch('data/jeux.json', { cache: 'no-cache' })
  .then((r) => r.json())
  .then((d) => { etat.donnees = d; noterEconomies(); traduirePage(); suivreAdresse(); })
  .catch(() => { $('#liste').innerHTML = `<p class="vide">${t('erreur')}</p>`; });

// Compte à rebours des cartes, mis à jour chaque minute sans tout réafficher.
setInterval(() => {
  if (!etat.donnees || document.hidden) return;
  const tous = [...etat.donnees.offerts, ...(etat.donnees.bientot ?? [])];
  document.querySelectorAll('.pastille[data-id]').forEach((el) => {
    const temps = tempsDe(tous.find((g) => g.id === el.dataset.id) ?? {});
    if (temps) { el.textContent = temps.texte; el.classList.toggle('urgente', Boolean(temps.urgent)); }
  });
}, 60000);
