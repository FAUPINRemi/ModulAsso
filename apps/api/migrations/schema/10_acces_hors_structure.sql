-- Droit d'exécution réservé au rôle applicatif par les droits par défaut (infra/postgres/initdb).
-- Lectures nécessaires avant de connaître la structure courante. SECURITY DEFINER : elles
-- s'exécutent comme le propriétaire, hors RLS, et ne renvoient que le strict nécessaire.

CREATE FUNCTION invitation_par_jeton(p_token_hash char(64))
  RETURNS TABLE (id uuid, structure_id uuid, role_id uuid, email varchar, expire_le timestamptz)
  LANGUAGE sql STABLE SECURITY DEFINER
  SET search_path = public, pg_temp
  AS $$
    SELECT i.id, i.structure_id, i.role_id, i.email, i.expire_le
      FROM invitation i
     WHERE i.token_hash = p_token_hash
  $$;

CREATE FUNCTION invitation_groupe_par_jeton(p_token_hash char(64))
  RETURNS TABLE (id uuid, structure_id uuid, groupe_id uuid, expire_le timestamptz)
  LANGUAGE sql STABLE SECURITY DEFINER
  SET search_path = public, pg_temp
  AS $$
    SELECT i.id, i.structure_id, i.groupe_id, i.expire_le
      FROM invitation_groupe i
     WHERE i.token_hash = p_token_hash
  $$;

-- Le worker parcourt les structures une par une (rappels d'échéance, purges),
-- en posant SET LOCAL app.structure_id pour chacune.
CREATE FUNCTION toutes_les_structures()
  RETURNS SETOF uuid
  LANGUAGE sql STABLE SECURITY DEFINER
  SET search_path = public, pg_temp
  AS $$ SELECT id FROM structure ORDER BY id $$;
