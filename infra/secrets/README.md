# Secrets

Ce dossier ne contient que ce README. Chaque secret est un fichier à part, monté par Docker dans `/run/secrets/<nom>` du conteneur qui en a besoin.

| Fichier                 | Contenu                                             | Monté dans          |
| ----------------------- | --------------------------------------------------- | ------------------- |
| `db_superuser_password` | mot de passe du super-utilisateur `postgres`        | db                  |
| `db_owner_password`     | mot de passe de `modulasso_owner` (migrations)      | db, migrations      |
| `db_app_password`       | mot de passe de `modulasso_app` (soumis à la RLS)   | db, api, worker     |
| `db_stats_password`     | mot de passe de `modulasso_stats` (vues agrégées)   | db                  |
| `rabbitmq_password`     | mot de passe de l'utilisateur RabbitMQ `modulasso`  | rabbitmq, api, worker |
| `app_secret`            | `APP_SECRET` de Symfony                             | api, worker, migrations |

## Développement

```
infra/scripts/secrets-dev.sh
```

Génère des valeurs aléatoires ici, sans écraser un fichier existant.

## Production

Les fichiers sont recréés à la main depuis le gestionnaire de mots de passe, dans un dossier hors dépôt, puis :

```
MODULASSO_SECRETS=/chemin/vers/secrets docker compose -f infra/compose.yml up -d
```

Hors swarm, Docker monte ces fichiers tels quels (propriétaire et droits de l'hôte). Les conteneurs tournent en non-root (`postgres` uid 70, `rabbitmq` uid 100, api et web selon leur image) : un fichier en `600 root` leur est illisible. Donner à chaque fichier un groupe lu par les conteneurs concernés, en `440`.

Les mots de passe PostgreSQL ne sont lus qu'à la création du volume `db_data`. Pour en changer un ensuite : `ALTER ROLE ... PASSWORD` puis mise à jour du fichier.
