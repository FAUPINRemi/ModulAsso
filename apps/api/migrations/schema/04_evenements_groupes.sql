CREATE TABLE lieu (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  nom          varchar(150) NOT NULL,
  adresse      varchar(255),
  capacite     integer CHECK (capacite > 0),
  UNIQUE (structure_id, id)
);

CREATE TABLE evenement (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  titre        varchar(150) NOT NULL,
  description  text,
  debut        timestamptz NOT NULL,
  fin          timestamptz NOT NULL,
  lieu_id      uuid,
  cree_par     uuid NOT NULL,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id),
  CHECK (fin > debut),
  FOREIGN KEY (structure_id, lieu_id) REFERENCES lieu (structure_id, id) ON DELETE SET NULL (lieu_id),
  FOREIGN KEY (structure_id, cree_par) REFERENCES membre (structure_id, id)
);
CREATE INDEX evenement_structure_id_debut_idx ON evenement (structure_id, debut);

CREATE TABLE participation (
  evenement_id uuid NOT NULL REFERENCES evenement ON DELETE CASCADE,
  membre_id    uuid NOT NULL REFERENCES membre ON DELETE CASCADE,
  statut       varchar(10) NOT NULL CHECK (statut IN ('inscrit', 'desiste', 'present', 'absent')),
  maj_le       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (evenement_id, membre_id)
);
CREATE INDEX participation_membre_id_idx ON participation (membre_id);
CREATE TRIGGER participation_maj_le BEFORE UPDATE ON participation
  FOR EACH ROW EXECUTE FUNCTION maj_le_auto();

CREATE TABLE groupe (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  nom          varchar(100) NOT NULL,
  description  text,
  cree_par     uuid NOT NULL,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id),
  FOREIGN KEY (structure_id, cree_par) REFERENCES membre (structure_id, id)
);

CREATE TABLE groupe_evenement (
  groupe_id    uuid NOT NULL REFERENCES groupe ON DELETE CASCADE,
  evenement_id uuid NOT NULL REFERENCES evenement ON DELETE CASCADE,
  PRIMARY KEY (groupe_id, evenement_id)
);
CREATE INDEX groupe_evenement_evenement_id_idx ON groupe_evenement (evenement_id);

CREATE TABLE groupe_equipe (
  groupe_id uuid NOT NULL REFERENCES groupe ON DELETE CASCADE,
  equipe_id uuid NOT NULL REFERENCES equipe ON DELETE CASCADE,
  PRIMARY KEY (groupe_id, equipe_id)
);
CREATE INDEX groupe_equipe_equipe_id_idx ON groupe_equipe (equipe_id);

CREATE TABLE groupe_sous_equipe (
  groupe_id      uuid NOT NULL REFERENCES groupe ON DELETE CASCADE,
  sous_equipe_id uuid NOT NULL REFERENCES sous_equipe ON DELETE CASCADE,
  PRIMARY KEY (groupe_id, sous_equipe_id)
);
CREATE INDEX groupe_sous_equipe_sous_equipe_id_idx ON groupe_sous_equipe (sous_equipe_id);

CREATE TABLE groupe_membre (
  groupe_id uuid NOT NULL REFERENCES groupe ON DELETE CASCADE,
  membre_id uuid NOT NULL REFERENCES membre ON DELETE CASCADE,
  PRIMARY KEY (groupe_id, membre_id)
);
CREATE INDEX groupe_membre_membre_id_idx ON groupe_membre (membre_id);

CREATE TABLE invitation_groupe (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  groupe_id    uuid NOT NULL,
  token_hash   char(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  expire_le    timestamptz NOT NULL,
  cree_par     uuid NOT NULL,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (structure_id, groupe_id) REFERENCES groupe (structure_id, id) ON DELETE CASCADE,
  FOREIGN KEY (structure_id, cree_par) REFERENCES membre (structure_id, id)
);
CREATE INDEX invitation_groupe_structure_id_idx ON invitation_groupe (structure_id);
