# Plan de démarrage d'Alvéo

On repart de `develop`. Ce plan dit quoi faire, dans quel ordre, avec quelles branches et quels commits.
Carl commit et push. Claude prépare le code et propose les commandes.

## Où on en est

- `develop` ne contient que le README.
- `feature/infra` et `feature/bdd` existent mais ne sont pas fusionnées. On les garde comme **référence** (compose, SQL des 41 tables). On ne les fusionne pas. On reprend leurs fichiers un par un, après relecture.
- Étape 0 (cette étape) : branche `feature/init`, front `apps/web` utilisable en mode démo.

## Règles de commit

- Une branche par étape, ouverte depuis `develop`, relue par Rémi avant fusion.
- Un commit = une idée. Message court : `type(zone): ce qui change`.
  Types : `feat`, `fix`, `chore`, `docs`, `test`, `refactor`. Zones : `web`, `api`, `infra`, `bdd`, `docs`.
- Avant chaque push : `npm run lint && npm run typecheck && npm test && npm run build` dans `apps/web`.
- gitleaks bloque les secrets : `pip install pre-commit && pre-commit install`.

## Étape 0 : `feature/init` (maintenant)

```
git switch develop
git pull
git switch -c feature/init
```

Copie les fichiers livrés dans le dépôt, puis commit dans cet ordre.

**Commit 1** `chore: base du dépôt`
```
git add .gitignore .editorconfig .pre-commit-config.yaml .vscode CLAUDE.md docs packages/api-client/.gitkeep
```

**Commit 2** `feat(web): projet Next.js, charte Alvéo et coquille de l'application`
```
git add apps/web/package.json apps/web/package-lock.json apps/web/tsconfig.json apps/web/next.config.ts \
  apps/web/postcss.config.mjs apps/web/eslint.config.mjs apps/web/vitest.config.ts apps/web/vitest.setup.ts \
  apps/web/.env.example apps/web/.dockerignore apps/web/Dockerfile apps/web/README.md apps/web/public \
  apps/web/src/app/layout.tsx apps/web/src/app/globals.css apps/web/src/app/manifest.ts \
  apps/web/src/app/icon.svg apps/web/src/app/not-found.tsx apps/web/src/lib/cx.ts
```

**Commit 3** `feat(web): composants partagés (ui, formulaires, données, calendrier, widgets, mise en page)`
```
git add apps/web/src/components apps/web/src/hooks
```

**Commit 4** `feat(web): session démo, proxy bureau/mobile, connexion et socle`
```
git add apps/web/src/lib apps/web/src/proxy.ts apps/web/src/features/socle \
  "apps/web/src/app/(auth)" "apps/web/src/app/page.tsx" \
  "apps/web/src/app/(bureau)/layout.tsx" "apps/web/src/app/(mobile)/m/layout.tsx" \
  "apps/web/src/app/(bureau)/tableau-de-bord" "apps/web/src/app/(bureau)/benevoles" "apps/web/src/app/(bureau)/modules" \
  "apps/web/src/app/(mobile)/m/page.tsx" "apps/web/src/app/(mobile)/m/plus" \
  "apps/web/src/app/(mobile)/m/benevoles" "apps/web/src/app/(mobile)/m/modules"
```

**Commit 5** `feat(web): modules planning, échéances, stock et matériel (données d'exemple)`
```
git add apps/web/src/features apps/web/src/app
```

Ensuite : `git status` doit être vide, puis `git push -u origin feature/init` et une PR vers `develop`.

**Vérifier** : `npm run dev` dans `apps/web`, ouvrir http://localhost:3000, mode démo, essayer les deux rôles, la vue mobile (outils du navigateur, mode téléphone) et couper un module dans Modules.

## Étape 1 : `feature/infra`

But : `docker compose up` lance db, rabbitmq, api et web sur les bons réseaux, sans port ouvert sauf pour le dev.

Commits : 1) `chore(infra): compose.yml, réseaux et volumes` 2) `chore(infra): compose.dev.yml, mailpit et secrets de dev` 3) `chore(infra): rôles PostgreSQL et définition des files RabbitMQ`.

Reprendre depuis la référence :
```
git checkout origin/feature/infra -- infra
```
Puis relire chaque fichier contre le document d'architecture (sections 3, 8.3, 9, 11).

Prompt pour VS Code :
> Lis CLAUDE.md et docs/architecture.pdf. On est sur la branche feature/infra, partie de develop. Relis le dossier infra/ importé depuis feature/infra. Vérifie : réseau interne sans Internet, aucun port publié pour api, db et rabbitmq, secrets en fichiers montés sous /run/secrets, conteneurs non-root. Ajoute le service web (apps/web/Dockerfile). Corrige les écarts, ne commit pas, propose-moi les git add et les messages.

## Étape 2 : `feature/bdd`

But : migration SQL des 41 tables, contraintes, index, RLS et rôles.

Commits : 1) `feat(bdd): fonctions et comptes, catalogue` 2) `feat(bdd): structures, équipes, événements, groupes` 3) `feat(bdd): planning, échéances, notifications, stock, matériel` 4) `feat(bdd): tableau de bord, import, journal` 5) `feat(bdd): RLS et accès hors structure` 6) `test(bdd): isolation entre structures`.

Reprendre : `git checkout origin/feature/bdd -- apps/api/migrations`. Point ouvert à trancher avant : disponibilités par journée ou par créneau (table `disponibilite`). Le front est déjà fait **par journée**.

Prompt :
> Lis CLAUDE.md et docs/architecture.pdf (section 8). Relis apps/api/migrations/schema/*.sql contre les 41 tables : uuid, timestamptz, CHECK pour les listes, structure_id indexé. Écris les politiques RLS manquantes pour les tables de liaison sans structure_id (héritage par jointure). Ajoute un test PostgreSQL réel qui prouve qu'une structure ne lit rien d'une autre. Ne commit pas.

## Étape 3 : `feature/api-init`

But : squelette Symfony dans `apps/api` avec les dossiers de l'architecture (Controller, Service, Repository, Entity, Dto, Security, Attribute, EventListener...), `SET LOCAL app.structure_id` par requête, attribut `#[RequiresModule]`, route `/health`, OpenAPI exportée vers `packages/api-client`.

Commits : 1) squelette Symfony 2) listener de structure courante (RLS) 3) attribut de module + test 403 4) génération du client TypeScript.

## Étape 4 : `feature/socle`

But : vrai compte, vraie connexion, rôles, structures, invitations.
Côté API : `Auth`, `Utilisateur`, `Structure`, `Invitation` (contrôleur + service + repository + tests d'accès).
Côté web : remplacer `lib/session.ts` et `features/socle/actions.ts` par l'API ; passer `DEMO_MODE=false`.

Commits (un par ressource) : auth, utilisateur, structure et membres, invitation par e-mail (RabbitMQ + worker), puis `feat(web): connexion branchée sur l'API`.

## Étape 5 : `feature/premier-ecran`

Connexion puis tableau de bord de bout en bout : navigateur, web, api, base. C'est la preuve que toute la chaîne marche.

## Étape 6 et suivantes : un module par branche

Dans cet ordre : `feature/planning` (disponibilités, événements, groupes, tâches), `feature/echeances` (+ rappels de nuit et notifications), `feature/import`, `feature/pwa` (Serwist, hors ligne, push), `feature/stock`, `feature/materiel`.
Pour chacun : API (contrôleur, service, tests d'accès) puis remplacer le `mock.ts` du front par le client généré.

Prompt type :
> Lis CLAUDE.md. On fait le module <nom> sur la branche feature/<nom>. Le front existe déjà avec des données d'exemple dans features/<nom>/mock.ts. Écris d'abord l'API (Controller, Service, Repository, Dto, tests d'accès), régénère packages/api-client, puis remplace le mock par des server actions. Ne commit pas, propose les git add.

## Écarts avec le document d'architecture

- `middleware.ts` s'appelle `proxy.ts` dans Next 16 (même rôle).
- Pas encore de `sw.ts` ni de `packages/api-client` rempli : prévus aux étapes PWA et API.
- La CSP est une version de départ. Version stricte avec nonce : à faire à l'étape sécurité.
- Pas de `package.json` à la racine : les workspaces arriveront avec `packages/api-client`.
- Agenda en vue Semaine et Liste. La vue Mois viendra avec l'API.
