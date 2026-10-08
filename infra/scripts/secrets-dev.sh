#!/bin/sh
set -eu

dossier="$(dirname "$0")/../secrets"
chmod 700 "$dossier"

for nom in db_superuser_password db_owner_password db_app_password db_stats_password rabbitmq_password app_secret; do
  fichier="$dossier/$nom"
  [ -e "$fichier" ] && continue
  head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n' > "$fichier"
  chmod 644 "$fichier"
  echo "créé : $nom"
done
