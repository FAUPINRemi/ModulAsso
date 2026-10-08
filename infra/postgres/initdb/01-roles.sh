#!/bin/sh
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres \
  --set base="$DB_NAME" \
  --set owner="$DB_OWNER_USER" \
  --set app="$DB_APP_USER" \
  --set stats="$DB_STATS_USER" \
  --set owner_pw="$(cat /run/secrets/db_owner_password)" \
  --set app_pw="$(cat /run/secrets/db_app_password)" \
  --set stats_pw="$(cat /run/secrets/db_stats_password)" <<'SQL'
CREATE ROLE :"owner" LOGIN PASSWORD :'owner_pw';
CREATE ROLE :"app" LOGIN PASSWORD :'app_pw';
CREATE ROLE :"stats" LOGIN PASSWORD :'stats_pw';

CREATE DATABASE :"base" OWNER :"owner";
-- Lu par les migrations, qui ne connaissent pas les noms des rôles.
ALTER DATABASE :"base" SET modulasso.role_app = :'app';

\connect :"base"

REVOKE ALL ON DATABASE :"base" FROM PUBLIC;
GRANT CONNECT ON DATABASE :"base" TO :"app", :"stats";

ALTER SCHEMA public OWNER TO :"owner";
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO :"app", :"stats";

-- Les vues agrégées du rôle stats sont accordées une à une dans les migrations.
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner" IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"app";
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner" IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO :"app";
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner" IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner" IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO :"app";
SQL
