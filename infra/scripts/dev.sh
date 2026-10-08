#!/bin/sh
# Environnement de développement uniquement. La prod se lance à la main (voir infra/secrets/README.md).
set -eu

racine="$(cd "$(dirname "$0")/../.." && pwd)"
compose="docker compose -f $racine/infra/compose.yml -f $racine/infra/compose.dev.yml"

if [ -n "${MODULASSO_SECRETS:-}" ]; then
  echo "MODULASSO_SECRETS est défini : ce script ne sert qu'en dev, arrêt." >&2
  exit 1
fi

charger_env() {
  [ -f "$racine/infra/.env" ] || cp "$racine/infra/.env.example" "$racine/infra/.env"
  set -a
  . "$racine/infra/.env"
  set +a
}

schema_present() {
  [ "$($compose exec -T db psql -U "$DB_SUPERUSER" -d "$DB_NAME" -Atc "SELECT to_regclass('public.structure') IS NOT NULL")" = "t" ]
}

appliquer_schema() {
  cat "$racine"/apps/api/migrations/schema/*.sql \
    | $compose exec -T db psql -q -U "$DB_OWNER_USER" -d "$DB_NAME" --single-transaction -v ON_ERROR_STOP=1
  echo "schéma appliqué"
}

demarrer() {
  charger_env
  "$racine/infra/scripts/secrets-dev.sh"
  $compose up -d --wait db rabbitmq mailpit
  if schema_present; then echo "schéma déjà en place"; else appliquer_schema; fi
}

reinitialiser() {
  printf "Supprimer la base et les files de dev (volumes db_data et rabbitmq_data) ? Taper 'oui' : "
  read -r reponse
  [ "$reponse" = "oui" ] || { echo "annulé"; exit 1; }
  $compose down -v
  demarrer
}

case "${1:-demarrer}" in
  demarrer)      demarrer ;;
  reinitialiser) reinitialiser ;;
  arreter)       $compose down ;;
  *) echo "usage : $0 [demarrer|reinitialiser|arreter]" >&2; exit 1 ;;
esac
