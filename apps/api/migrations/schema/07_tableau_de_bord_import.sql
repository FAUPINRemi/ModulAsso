CREATE TABLE vue_dashboard (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  membre_id    uuid NOT NULL,
  appareil     varchar(10) NOT NULL CHECK (appareil IN ('pc', 'mobile')),
  UNIQUE (structure_id, id),
  UNIQUE (membre_id, appareil),
  FOREIGN KEY (structure_id, membre_id) REFERENCES membre (structure_id, id) ON DELETE CASCADE
);

CREATE TABLE widget_place (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id     uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  vue_dashboard_id uuid NOT NULL,
  widget_id        uuid NOT NULL REFERENCES widget ON DELETE CASCADE,
  x                smallint NOT NULL CHECK (x >= 0),
  y                smallint NOT NULL CHECK (y >= 0),
  largeur          smallint NOT NULL CHECK (largeur >= 1),
  hauteur          smallint NOT NULL CHECK (hauteur >= 1),
  reglages         jsonb NOT NULL DEFAULT '{}',
  FOREIGN KEY (structure_id, vue_dashboard_id) REFERENCES vue_dashboard (structure_id, id) ON DELETE CASCADE
);
CREATE INDEX widget_place_structure_id_idx ON widget_place (structure_id);
CREATE INDEX widget_place_vue_dashboard_id_idx ON widget_place (vue_dashboard_id);
CREATE INDEX widget_place_widget_id_idx ON widget_place (widget_id);

CREATE TABLE import_fichier (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id            uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  membre_id               uuid NOT NULL,
  source                  varchar(20) NOT NULL CHECK (source IN ('excel', 'csv', 'google_sheets')),
  type_cible              varchar(30) NOT NULL
                          CHECK (type_cible IN ('membres', 'stock', 'materiel', 'echeances', 'disponibilites')),
  nom_original            varchar(255) NOT NULL,
  chemin_temporaire       varchar(500),
  correspondance_colonnes jsonb NOT NULL DEFAULT '{}',
  statut                  varchar(20) NOT NULL DEFAULT 'televerse'
                          CHECK (statut IN ('televerse', 'apercu', 'valide', 'termine', 'annule', 'echec')),
  lignes_total            integer NOT NULL DEFAULT 0 CHECK (lignes_total >= 0),
  lignes_ok               integer NOT NULL DEFAULT 0 CHECK (lignes_ok >= 0),
  lignes_erreur           integer NOT NULL DEFAULT 0 CHECK (lignes_erreur >= 0),
  cree_le                 timestamptz NOT NULL DEFAULT now(),
  valide_le               timestamptz,
  termine_le              timestamptz,
  UNIQUE (structure_id, id),
  FOREIGN KEY (structure_id, membre_id) REFERENCES membre (structure_id, id)
);

CREATE TABLE import_ligne (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id   uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  import_id      uuid NOT NULL,
  numero_ligne   integer NOT NULL CHECK (numero_ligne >= 1),
  donnees        jsonb,
  statut         varchar(10) NOT NULL CHECK (statut IN ('ok', 'erreur', 'ignoree')),
  message_erreur text,
  cible_id       uuid,
  UNIQUE (import_id, numero_ligne),
  FOREIGN KEY (structure_id, import_id) REFERENCES import_fichier (structure_id, id) ON DELETE CASCADE
);
CREATE INDEX import_ligne_structure_id_idx ON import_ligne (structure_id);

CREATE TABLE modele_import (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id            uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  type_cible              varchar(30) NOT NULL
                          CHECK (type_cible IN ('membres', 'stock', 'materiel', 'echeances', 'disponibilites')),
  nom                     varchar(100) NOT NULL,
  correspondance_colonnes jsonb NOT NULL DEFAULT '{}',
  cree_le                 timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX modele_import_structure_id_idx ON modele_import (structure_id);
