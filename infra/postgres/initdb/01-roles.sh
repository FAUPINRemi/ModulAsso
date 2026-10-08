#!/bin/sh
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres \
  --set owner_pw="$(cat /run/secrets/db_owner_password)" \
  --set app_pw="$(cat /run/secrets/db_app_password)" \
  --set stats_pw="$(cat /run/secrets/db_stats_password)" <<'SQL'
CREATE ROLE modulasso_owner LOGIN PASSWORD :'owner_pw';
CREATE ROLE modulasso_app LOGIN PASSWORD :'app_pw';
CREATE ROLE modulasso_stats LOGIN PASSWORD :'stats_pw';

CREATE DATABASE modulasso OWNER modulasso_owner;

\connect modulasso

REVOKE ALL ON DATABASE modulasso FROM PUBLIC;
GRANT CONNECT ON DATABASE modulasso TO modulasso_app, modulasso_stats;

ALTER SCHEMA public OWNER TO modulasso_owner;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO modulasso_app, modulasso_stats;

-- Les vues agrégées de modulasso_stats sont accordées une à une dans les migrations.
ALTER DEFAULT PRIVILEGES FOR ROLE modulasso_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO modulasso_app;
ALTER DEFAULT PRIVILEGES FOR ROLE modulasso_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO modulasso_app;
ALTER DEFAULT PRIVILEGES FOR ROLE modulasso_owner IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE modulasso_owner IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO modulasso_app;
SQL
