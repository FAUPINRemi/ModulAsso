-- Une clé étrangère ignore la RLS : les clés composites (structure_id, x_id) empêchent
-- une ligne de pointer vers une ligne d'une autre structure.
-- Les UNIQUE (structure_id, id) servent de cible à ces clés et d'index sur structure_id.

CREATE TABLE structure (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom                  varchar(150) NOT NULL,
  type                 varchar(30) NOT NULL
                       CHECK (type IN ('association', 'club', 'collectif', 'entreprise', 'autre')),
  identifiant_officiel varchar(50),
  cree_le              timestamptz NOT NULL DEFAULT now(),
  maj_le               timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER structure_maj_le BEFORE UPDATE ON structure
  FOR EACH ROW EXECUTE FUNCTION maj_le_auto();

CREATE TABLE membre (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id   uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  utilisateur_id uuid NOT NULL REFERENCES utilisateur,
  role_id        uuid NOT NULL REFERENCES role,
  statut         varchar(20) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'parti')),
  rejoint_le     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id),
  UNIQUE (utilisateur_id, structure_id)
);
CREATE INDEX membre_role_id_idx ON membre (role_id);

CREATE TABLE invitation (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  role_id      uuid NOT NULL REFERENCES role,
  email        varchar(255),
  token_hash   char(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  expire_le    timestamptz NOT NULL,
  cree_par     uuid NOT NULL,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (structure_id, cree_par) REFERENCES membre (structure_id, id)
);
CREATE INDEX invitation_structure_id_idx ON invitation (structure_id);

CREATE TABLE structure_module (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  module_id    uuid NOT NULL REFERENCES module,
  actif        boolean NOT NULL DEFAULT true,
  active_le    timestamptz NOT NULL DEFAULT now(),
  desactive_le timestamptz,
  active_par   uuid,
  reglages     jsonb NOT NULL DEFAULT '{}',
  UNIQUE (structure_id, module_id),
  FOREIGN KEY (structure_id, active_par) REFERENCES membre (structure_id, id) ON DELETE SET NULL (active_par)
);
CREATE INDEX structure_module_module_id_idx ON structure_module (module_id);

CREATE TABLE equipe (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  nom          varchar(100) NOT NULL,
  est_defaut   boolean NOT NULL DEFAULT false,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id)
);
CREATE UNIQUE INDEX equipe_une_par_defaut ON equipe (structure_id) WHERE est_defaut;

CREATE TABLE equipe_membre (
  equipe_id uuid NOT NULL REFERENCES equipe ON DELETE CASCADE,
  membre_id uuid NOT NULL REFERENCES membre ON DELETE CASCADE,
  PRIMARY KEY (equipe_id, membre_id)
);
CREATE INDEX equipe_membre_membre_id_idx ON equipe_membre (membre_id);

CREATE TABLE sous_equipe (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  equipe_id    uuid NOT NULL,
  nom          varchar(100) NOT NULL,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id),
  FOREIGN KEY (structure_id, equipe_id) REFERENCES equipe (structure_id, id) ON DELETE CASCADE
);
CREATE INDEX sous_equipe_equipe_id_idx ON sous_equipe (equipe_id);

CREATE TABLE sous_equipe_membre (
  sous_equipe_id uuid NOT NULL REFERENCES sous_equipe ON DELETE CASCADE,
  membre_id      uuid NOT NULL REFERENCES membre ON DELETE CASCADE,
  PRIMARY KEY (sous_equipe_id, membre_id)
);
CREATE INDEX sous_equipe_membre_membre_id_idx ON sous_equipe_membre (membre_id);
