# Les jeux gratuits de Geekozor — mémo pour Claude

Ce fichier est lu automatiquement au début de chaque conversation ouverte dans ce dossier. Mis à jour le 14/11/2026.

## Le propriétaire
- Débutant complet (« j'y connais rien ») : Claude fait tout de A à Z et explique simplement, en français.
- Les comptes, les clés et les paiements restent les siens : il les crée et les saisit lui-même.
- Les clés ne sont jamais collées dans le chat. Elles vont dans `.env` (ignoré par git) ou dans les secrets GitHub.
- On ne contourne pas les conditions d'utilisation des API.
- Il aime qu'on lui propose des idées d'amélioration, puis il choisit lesquelles faire.

## Le projet
- Appli web installable (PWA, sans store) qui liste les jeux gratuits sur toutes les plateformes, en 5 langues (fr, en, it, de, es).
- But : gagner de l'argent plus tard avec des pubs (AdSense) et des liens affiliés.
- Code sans framework :
  - `public/` contient le site : `app.js` (module), `noms.js`, `style.css`, `sw.js`, `index.html`.
  - `scripts/update.mjs` construit `public/data/jeux.json` et les fiches `public/data/jeux/<id>.json`.
- Mise à jour toutes les heures par GitHub Actions (`.github/workflows/maj.yml`), qui publie sur GitHub Pages. Le PC du propriétaire peut rester éteint.
- Si une source tombe en panne, `data/alertes.txt` fait échouer le workflow et GitHub envoie un e-mail.

### Onglets et sources
| Onglet | Source |
|---|---|
| Jeux offerts, Bientôt gratuit | GamerPower et Epic (`freeGamesPromotions`, heure de fin exacte) |
| Bonus & DLC | GamerPower |
| Free-to-play | FreeToGame (PC), jeux gratuits GOG, consoles depuis `data/f2p-consoles.json` |
| Indés | flux RSS itch.io, filtré (adultes, fangames) grâce aux étiquettes des pages |
| Démos | GOG, Nintendo Europe (150 démos Switch / Switch 2 les plus téléchargées) et Steam (100 démos, fiche lue 60 par passage, cache `steamDemo`, sans anglais ni français = écartée), présentées en alternance. Nintendo donne lui-même textes et liens en fr/de/it/es (`g.trad`, `g.liens`), donc pas de traduction Claude pour eux. Vidéos et captures des démos Nintendo : cherchées sur Steam puis Xbox (`nomRecherche` enlève « Nintendo Switch 2 Edition »…) ; 94 / 146 en ont, les jeux Nintendo maison n'en ont pas (lien de recherche YouTube) |
| Libres & rétro | `data/jeux-libres.json` et un lien vers Abandonware France |

### Fiches de jeu
- Vidéos et captures : Steam d'abord, sinon la boutique Xbox, sinon `data/bandes-annonces.json` (YouTube) pour la vidéo et le champ `captures` de `f2p-consoles.json` pour les captures.
- Les images des jeux libres viennent de Wikimedia, avec leur crédit.

### Listes faites à la main dans `data/`
- `f2p-consoles.json` : 43 jeux, vérifiés le 14/11/2026. Sert aussi aux free-to-play PC / navigateur absents de FreeToGame (ex. OGame, ajouté le 15/11/2026). Pour un jeu absent de Steam et de la boutique Xbox, on met à la main `image` et `captures` (liste d'adresses, qui vont seulement dans la fiche) : images officielles de l'éditeur, appelées directement chez lui (si l'éditeur les change, elles disparaissent).
  - OGame : images de `secure-asset-delivery.gameforge.com` (page https://gameforge.com/en-US/play/ogame). L'autre serveur d'images de cette page, `rgw-txx01.gfsrv.net`, ne répond pas depuis l'extérieur.
- `bandes-annonces.json` (ex. OGame : « OGame Cinematic Trailer », chaîne officielle)
- `jeux-libres.json`
- `exclusions.json` : jeux à masquer.

### Décisions déjà prises
- Pas de notes de jeux.
- Mise à jour toutes les heures.
- RAWG retiré : le propriétaire ne voulait pas demander de clé. Il est remplacé par la liste consoles.
- Wikidata a été testé et rejeté : incomplet, et il liste des jeux fermés.
- Sources rejetées :
  - Reddit : API payante.
  - Boutique PlayStation et API Epic : pas d'accès public.
  - IGDB : partenariat obligatoire pour un usage commercial.
  - Prime Gaming et Game Pass : ce sont des abonnements.

### Traductions
- Choix du propriétaire (15/11/2026) : français seulement. L'italien, l'allemand et l'espagnol affichent l'anglais (`LANGUES = ['fr']` dans update.mjs).
- Les 756 descriptions courtes présentes le 15/11/2026 ont été traduites à la main par Claude dans la conversation, sans API, et rangées dans `cache.trad` (clé = hash de la description).
- Les nouveaux jeux arrivent en anglais. Claude (`claude-opus-5-5`) les traduit tout seul seulement si `ANTHROPIC_API_KEY` est présente. Sinon, on peut refaire une traduction à la main de temps en temps dans une conversation.
- Descriptions longues (15/11/2026) : les 416 de FreeToGame traduites à la main par Claude, dans `cache.trad` (clé = hash du texte), copiées dans la fiche en `tradLongue`. Nintendo donne les siennes en fr/de/it/es. Les nouvelles fiches FreeToGame arrivent en anglais (l'API ne traduit que les courtes).
- Instructions « Comment le récupérer » (15/11/2026) : les 60 textes différents traduits à la main par Claude, dans `cache.trad` (clé = hash du texte), copiés dans la fiche en `tradInstructions`. Les nouvelles arrivent en anglais (l'API ne les traduit pas) : à refaire à la main de temps en temps.

## Déjà fait
- Filtres multiples : plateformes, genre, tri, recherche.
- Fiche de jeu à l'adresse `#<id>` : un lien partagé l'ouvre directement, le bouton retour la ferme.
- Bouton Partager et compteur d'économies.
- Badges « Nouveau » et « Plus que N h ».
- Messages clairs quand une liste est vide, et affichage par paquets de 40.
- Jeux suivis ★, étape 1 : mémorisés sur le téléphone (localStorage `suivis`), avec un bandeau à l'ouverture et un filtre « Mes jeux suivis ».
- Case « Je l'ai récupéré » (localStorage `recuperes`).

## Tests et aperçu local
```
node --test scripts/titres.test.mjs scripts/plateformes.test.mjs
npm run maj
python -m http.server 8765 --directory public
```
- `npm run maj` lit `.env`.
- Le serveur Python donne l'aperçu sur http://localhost:8765.

## Prochaine étape : la mise en ligne
1. Fait le 14/11/2026 : compte `geekozor`, dépôt public https://github.com/geekozor/jeux-gratuits (branche main, poussé). Site prévu : https://geekozor.github.io/jeux-gratuits/
2. Fait le 14/11/2026 : Pages activé, site en ligne et premier workflow réussi. Secret `ANTHROPIC_API_KEY` reporté : pas encore de crédits API, le site tourne sans traductions en attendant.
3. Fait : `og:image` et `og:url` en adresses github.io complètes (à changer si nom de domaine).
4. Vérifier que les e-mails d'échec GitHub Actions sont activés.
5. Le chemin des traductions Claude n'a jamais tourné avec une vraie clé : à tester.

## Pour plus tard (déjà acceptés ou notés)
- **Notifications par jeu (étape 2 des jeux suivis)**, après la mise en ligne :
  - Un Cloudflare Worker avec un stockage KV et des notifications web-push, environ 250 lignes. Le propriétaire crée le compte Cloudflare.
  - On ne stocke ni nom ni e-mail ; une mention est à ajouter à la page de confidentialité.
  - Choisi plutôt que OneSignal, parce qu'il faut des préférences par utilisateur.
  - Sur iPhone, les notifications ne marchent que si l'app est installée sur l'écran d'accueil.
- **Onglet « Bons plans »** : les promos de CheapShark, avec les liens affiliés du propriétaire. Pas les alertes e-mail de CheapShark.
- **Monétisation** : pages légales, bandeau cookies, nom de domaine (AdSense refuse github.io), AdSense, emplacement de pub dans la fiche, liens affiliés.
- **Pour attirer du monde** : chaîne Telegram ou Discord qui publie toute seule les nouveaux jeux offerts ; statistiques sans cookies (GoatCounter : fait, compte `geekozor`. `stat()` dans app.js compte les pages `onglet/<onglet>` et `jeu/<id>`, et les événements `clic/<id>` (bouton vers la boutique, titre « Jeu → domaine ») et `partage/<id>`).
- **Référencement** : filtres dans l'adresse (`#f2p/ps5/...`) et une page par jeu.
- **Petites choses** :
  - Filtres par boutique Steam, Epic ou GOG.
  - Regrouper les genres rares (RPG, MMO…).

## À surveiller dans la liste consoles
- Non confirmés : Sky sur PS5 ; Pokémon UNITE, Fall Guys et Disney Speedstorm encore actifs ?
- Pokémon UNITE n'a pas d'image.
- Filtres PS5 / Xbox Series / Switch 2 : ils montrent aussi les jeux PS4 / Xbox One / Switch (rétrocompatibilité, table `AUSSI` dans app.js). Code `switch2` = version Switch 2 native (Fortnite, Apex ; Apex a quitté la Switch 1 en août 2026).
- Revoir la liste tous les 2 ou 3 mois : fermetures, nouvelles consoles.
