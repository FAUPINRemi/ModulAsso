CREATE TABLE journal (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  structure_id   uuid REFERENCES structure ON DELETE CASCADE,
  utilisateur_id uuid REFERENCES utilisateur ON DELETE SET NULL,
  type_cible     varchar(50) NOT NULL,
  cible_id       uuid,
  action         varchar(50) NOT NULL,
  details        jsonb,
  cree_le        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX journal_structure_id_cible_idx ON journal (structure_id, type_cible, cible_id);
CREATE INDEX journal_structure_id_cree_le_idx ON journal (structure_id, cree_le);
