# ModulAsso

Application web modulaire et gratuite pour les associations : disponibilités des bénévoles, événements, groupes, échéances, stock et matériel. Pensée pour le téléphone (PWA) et les petits budgets.

Projet annuel ESGI M2 2026-2027, Carl Heintz et Rémi Faupin.

## Stack

- Front public : Next.js (bureau et PWA mobile), `apps/web`
- Front admin : Next.js, accessible uniquement par VPN, `apps/admin`
- API : Symfony REST, `apps/api` (le worker utilise la même image)
- Base : PostgreSQL unique avec `structure_id` sur chaque table et sécurité par ligne (RLS)
- Files : RabbitMQ pour les envois, Messenger sur PostgreSQL pour les tâches internes
- Déploiement : Docker derrière Traefik

## Structure du dépôt

```
apps/
  web/          front public
  admin/        console super admin
  api/          API Symfony et worker
packages/
  api-client/   client TypeScript généré depuis l'OpenAPI
infra/
  compose.yml
  compose.dev.yml
  traefik/ rabbitmq/ postgres/ backup/ monitoring/ secrets/
docs/           architecture, modèle de données, maquettes
```

## Documentation

- `docs/architecture.md` : référence technique
- `docs/modele-donnees.md` : les 41 tables
- Maquettes : canvas Claude Design

## Lancer en développement

```
docker compose -f infra/compose.yml -f infra/compose.dev.yml up
```

Les secrets de développement vont dans `.env.local` (ignoré par Git). Voir `.env.example` dans chaque app pour les noms des variables. Aucun secret ne doit être commité : gitleaks bloque les commits fautifs.

## Conventions

- Branches par fonctionnalité depuis `develop`, relecture obligatoire avant fusion
- Un fichier, une responsabilité : un contrôleur et un service par ressource, un composant par dossier
- Chaque service a ses tests, chaque contrôleur au moins un test d'accès (droit, module actif, isolation entre structures)
- Tables, colonnes et routes en français

## Par où commencer

1. `infra/` minimal : db, api, web, rabbitmq, réseaux et secrets de dev
2. Migration SQL des 41 tables, contraintes, index, RLS, rôles PostgreSQL
3. Socle : comptes, connexion, rôles, structures, invitations
4. Premier écran de bout en bout : connexion puis tableau de bord
5. Modules un par un : planning, échéances, notifications, import, stock, matériel