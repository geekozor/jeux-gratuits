# Les jeux gratuits de Geekozor

Application web installable (PWA) qui liste les jeux vidéo gratuits du moment, en 5 langues (FR, EN, IT, DE, ES).

| Onglet | Source | Clé nécessaire |
|---|---|---|
| Jeux offerts, Bonus & DLC (PC, consoles, mobile, VR) | [GamerPower](https://www.gamerpower.com/api-read) | non |
| Free-to-play PC / navigateur | [FreeToGame](https://www.freetogame.com/api-doc) | non |
| Free-to-play consoles | liste faite à la main : `data/f2p-consoles.json` | aucune |
| Descriptions traduites | API Claude (Anthropic) | `ANTHROPIC_API_KEY` |
| Jeux offerts : heure de fin exacte + « Bientôt gratuit » | Epic Games Store (adresse publique non documentée) | non |
| Free-to-play (complément) et Démos | catalogue GOG (non documenté) | non |
| Indés | [itch.io](https://itch.io), flux RSS officiel des jeux gratuits les mieux notés (filtre « adulte ») | non |
| Libres & rétro | liste à la main `data/jeux-libres.json` + lien vers [Abandonware France](https://www.abandonware-france.org) | non |
| Fiches : vidéos et captures | boutique Steam, sinon boutique Xbox (API publiques non documentées) | non |
| Fiches : bandes-annonces des gros jeux hors Steam/Xbox | liste à la main `data/bandes-annonces.json` (YouTube) | non |

Les trois sources de données autorisent l'usage commercial à condition d'afficher un lien vers elles (fait dans le pied de page : ne pas l'enlever).

## Comment ça marche

- `scripts/update.mjs` récupère les jeux, ajoute les traductions, écrit `public/data/jeux.json`. Sans clé, l'étape concernée est sautée.
- `data/cache.json` garde les descriptions et traductions déjà obtenues : seuls les nouveaux jeux coûtent des requêtes.
- `public/` contient l'app (une seule page, sans framework).
- `.github/workflows/maj.yml` relance le script **toutes les heures** sur GitHub et republie le site sur GitHub Pages.

## Tester sur ton PC

```
npm install
npm run maj
npm run dev
```

## Mettre en ligne (une seule fois)

1. Créer un compte sur github.com, puis un dépôt public `jeux-gratuits` et y envoyer ce dossier.
2. **Settings → Pages → Source : GitHub Actions**.
3. **Settings → Secrets and variables → Actions → New repository secret** :
   - `ANTHROPIC_API_KEY` : clé obtenue sur platform.claude.com
4. Onglet **Actions** → « Mise à jour et publication » → **Run workflow**.

L'app est ensuite en ligne sur `https://<ton-pseudo>.github.io/jeux-gratuits/`.

## Coûts

- Hébergement, mise à jour, GamerPower, FreeToGame : 0 €.
- Traductions Claude (modèle Opus 5.5) : la première exécution traduit tout le catalogue (environ 600 descriptions, de l'ordre de quelques euros), ensuite seulement les nouveaux jeux (quelques centimes par mois). Plafond : 300 descriptions par exécution (`MAX_TRAD_PAR_EXECUTION`).

Note : GitHub peut mettre en pause les tâches planifiées d'un dépôt public sans activité depuis 60 jours. Un e-mail prévient avant ; un clic suffit pour réactiver.

## Garde-fous

- **Masquer un jeu** : ajouter son nom dans `data/exclusions.json` (il disparaît au passage suivant, toutes catégories).
- **itch.io** : itch.io retire déjà de ses flux les jeux qu'il classe « adultes ». En plus, le script écarte les jeux qui se déclarent « 18+ » et ceux étiquetés `fangame`, `nsfw`, `adult`, etc. sur leur page.
- **GOG** : les « jeux gratuits » qui sont des mods demandant un jeu payant (ex. Fallout: London) sont détectés via leur description et écartés.
- **Alerte e-mail** : si une source (Epic, GOG, itch.io, catégories FreeToGame) casse ou ne renvoie plus rien, l'automatisation GitHub se met en échec **après** avoir publié le reste ; GitHub t'envoie alors un e-mail. Penser à vérifier que ces e-mails sont activés (GitHub → Settings → Notifications → Actions).
- **Images des jeux libres** : hébergées dans `public/images/libres/` (Wikimedia Commons, licences libres) ; l'auteur et la licence sont affichés dans chaque fiche.
