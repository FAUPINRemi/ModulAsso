-- Contexte posé par l'API à chaque transaction avec SET LOCAL.
-- current_setting renvoie '' (et non NULL) une fois la variable déjà posée dans la session.
CREATE FUNCTION structure_courante() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('app.structure_id', true), '')::uuid $$;

CREATE FUNCTION utilisateur_courant() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('app.utilisateur_id', true), '')::uuid $$;

CREATE FUNCTION maj_le_auto() RETURNS trigger
  LANGUAGE plpgsql
  AS $$
BEGIN
  NEW.maj_le := now();
  RETURN NEW;
END
$$;
