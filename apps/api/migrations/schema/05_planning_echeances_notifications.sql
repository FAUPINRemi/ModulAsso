CREATE TABLE disponibilite (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  membre_id    uuid NOT NULL,
  jour         date NOT NULL,
  statut       varchar(10) NOT NULL CHECK (statut IN ('dispo', 'peut_etre', 'non')),
  heure_debut  time,
  heure_fin    time,
  maj_le       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (membre_id, jour),
  CHECK ((heure_debut IS NULL) = (heure_fin IS NULL)),
  CHECK (heure_fin > heure_debut),
  FOREIGN KEY (structure_id, membre_id) REFERENCES membre (structure_id, id) ON DELETE CASCADE
);
CREATE INDEX disponibilite_structure_id_jour_idx ON disponibilite (structure_id, jour);
CREATE TRIGGER disponibilite_maj_le BEFORE UPDATE ON disponibilite
  FOR EACH ROW EXECUTE FUNCTION maj_le_auto();

CREATE TABLE tache (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  evenement_id uuid,
  titre        varchar(200) NOT NULL,
  description  text,
  echeance_le  timestamptz,
  membre_id    uuid,
  faite_le     timestamptz,
  cree_par     uuid NOT NULL,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (structure_id, evenement_id) REFERENCES evenement (structure_id, id) ON DELETE CASCADE,
  FOREIGN KEY (structure_id, membre_id) REFERENCES membre (structure_id, id) ON DELETE SET NULL (membre_id),
  FOREIGN KEY (structure_id, cree_par) REFERENCES membre (structure_id, id)
);
CREATE INDEX tache_structure_id_idx ON tache (structure_id);
CREATE INDEX tache_evenement_id_idx ON tache (evenement_id);
CREATE INDEX tache_membre_id_idx ON tache (membre_id);

CREATE TABLE echeance (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id         uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  titre                varchar(200) NOT NULL,
  type                 varchar(20) NOT NULL CHECK (type IN ('formation', 'controle', 'peremption', 'autre')),
  date_echeance        date NOT NULL,
  prevenir_jours_avant smallint NOT NULL DEFAULT 30 CHECK (prevenir_jours_avant >= 0),
  type_cible           varchar(30) CHECK (type_cible IN ('membre', 'materiel', 'lot')),
  cible_id             uuid,
  faite_le             timestamptz,
  cree_le              timestamptz NOT NULL DEFAULT now(),
  CHECK ((type_cible IS NULL) = (cible_id IS NULL))
);
CREATE INDEX echeance_structure_id_date_echeance_idx ON echeance (structure_id, date_echeance);
CREATE INDEX echeance_cible_idx ON echeance (type_cible, cible_id);

CREATE TABLE notification (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id   uuid REFERENCES structure ON DELETE CASCADE,
  utilisateur_id uuid NOT NULL REFERENCES utilisateur ON DELETE CASCADE,
  titre          varchar(150) NOT NULL,
  contenu        text NOT NULL,
  lien           varchar(500),
  canal          varchar(10) NOT NULL CHECK (canal IN ('app', 'push', 'email')),
  envoyee_le     timestamptz,
  lue_le         timestamptz,
  cree_le        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notification_structure_id_idx ON notification (structure_id);
CREATE INDEX notification_utilisateur_id_cree_le_idx ON notification (utilisateur_id, cree_le DESC);
