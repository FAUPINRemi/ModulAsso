CREATE TABLE article (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  nom          varchar(150) NOT NULL,
  unite        varchar(20) NOT NULL,
  seuil_alerte numeric(12,3) CHECK (seuil_alerte >= 0),
  cree_le      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id)
);

CREATE TABLE lot (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id    uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  article_id      uuid NOT NULL,
  quantite        numeric(12,3) NOT NULL CHECK (quantite >= 0),
  date_peremption date,
  cree_le         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id),
  FOREIGN KEY (structure_id, article_id) REFERENCES article (structure_id, id)
);
CREATE INDEX lot_article_id_idx ON lot (article_id);

CREATE TABLE mouvement_stock (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  lot_id       uuid NOT NULL,
  quantite     numeric(12,3) NOT NULL,
  motif        varchar(20) NOT NULL CHECK (motif IN ('entree', 'sortie', 'perte', 'inventaire')),
  membre_id    uuid,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (structure_id, lot_id) REFERENCES lot (structure_id, id),
  FOREIGN KEY (structure_id, membre_id) REFERENCES membre (structure_id, id) ON DELETE SET NULL (membre_id)
);
CREATE INDEX mouvement_stock_structure_id_idx ON mouvement_stock (structure_id);
CREATE INDEX mouvement_stock_lot_id_idx ON mouvement_stock (lot_id);

CREATE TABLE materiel (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  nom          varchar(150) NOT NULL,
  numero_serie varchar(100),
  etat         varchar(20) NOT NULL CHECK (etat IN ('bon', 'a_reparer', 'hors_service')),
  lieu_id      uuid,
  cree_le      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (structure_id, id),
  FOREIGN KEY (structure_id, lieu_id) REFERENCES lieu (structure_id, id) ON DELETE SET NULL (lieu_id)
);

CREATE TABLE pret_materiel (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  structure_id uuid NOT NULL REFERENCES structure ON DELETE CASCADE,
  materiel_id  uuid NOT NULL,
  membre_id    uuid,
  evenement_id uuid,
  du           timestamptz NOT NULL,
  au           timestamptz,
  rendu_le     timestamptz,
  CHECK (membre_id IS NOT NULL OR evenement_id IS NOT NULL),
  CHECK (au >= du),
  FOREIGN KEY (structure_id, materiel_id) REFERENCES materiel (structure_id, id) ON DELETE CASCADE,
  FOREIGN KEY (structure_id, membre_id) REFERENCES membre (structure_id, id),
  FOREIGN KEY (structure_id, evenement_id) REFERENCES evenement (structure_id, id)
);
CREATE INDEX pret_materiel_structure_id_idx ON pret_materiel (structure_id);
CREATE INDEX pret_materiel_materiel_id_idx ON pret_materiel (materiel_id);
