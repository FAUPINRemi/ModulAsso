-- Tables communes à toute la plateforme : sans structure_id, donc sans RLS.

CREATE TABLE utilisateur (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             varchar(255) NOT NULL,
  email_verifie_le  timestamptz,
  mot_de_passe_hash varchar(255),
  nom               varchar(100),
  prenom            varchar(100),
  telephone         text,
  photo_url         varchar(500),
  est_super_admin   boolean NOT NULL DEFAULT false,
  cree_le           timestamptz NOT NULL DEFAULT now(),
  maj_le            timestamptz NOT NULL DEFAULT now(),
  supprime_le       timestamptz
);
CREATE UNIQUE INDEX utilisateur_email_key ON utilisateur (lower(email));
CREATE TRIGGER utilisateur_maj_le BEFORE UPDATE ON utilisateur
  FOR EACH ROW EXECUTE FUNCTION maj_le_auto();

CREATE TABLE connexion_externe (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id          uuid NOT NULL REFERENCES utilisateur ON DELETE CASCADE,
  fournisseur             varchar(20) NOT NULL CHECK (fournisseur IN ('google', 'apple')),
  identifiant_fournisseur varchar(255) NOT NULL,
  cree_le                 timestamptz NOT NULL DEFAULT now(),
  UNIQUE (fournisseur, identifiant_fournisseur)
);
CREATE INDEX connexion_externe_utilisateur_id_idx ON connexion_externe (utilisateur_id);

CREATE TABLE abonnement_push (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilisateur_id uuid NOT NULL REFERENCES utilisateur ON DELETE CASCADE,
  endpoint       text NOT NULL UNIQUE,
  cle_p256dh     varchar(255) NOT NULL,
  cle_auth       varchar(255) NOT NULL,
  appareil       varchar(100),
  cree_le        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX abonnement_push_utilisateur_id_idx ON abonnement_push (utilisateur_id);

CREATE TABLE module (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        varchar(50) NOT NULL UNIQUE,
  nom         varchar(100) NOT NULL,
  description text,
  version     varchar(20) NOT NULL,
  est_socle   boolean NOT NULL DEFAULT false,
  disponible  boolean NOT NULL DEFAULT true,
  cree_le     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE module_dependance (
  module_id    uuid NOT NULL REFERENCES module ON DELETE CASCADE,
  depend_de_id uuid NOT NULL REFERENCES module ON DELETE CASCADE,
  PRIMARY KEY (module_id, depend_de_id),
  CHECK (depend_de_id <> module_id)
);
CREATE INDEX module_dependance_depend_de_id_idx ON module_dependance (depend_de_id);

CREATE TABLE widget (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   uuid NOT NULL REFERENCES module ON DELETE CASCADE,
  code        varchar(50) NOT NULL UNIQUE,
  nom         varchar(100) NOT NULL,
  largeur_min smallint NOT NULL DEFAULT 1 CHECK (largeur_min >= 1),
  hauteur_min smallint NOT NULL DEFAULT 1 CHECK (hauteur_min >= 1)
);
CREATE INDEX widget_module_id_idx ON widget (module_id);

CREATE TABLE role (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code    varchar(50) NOT NULL UNIQUE,
  libelle varchar(100) NOT NULL,
  cree_le timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE permission (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code      varchar(100) NOT NULL UNIQUE,
  libelle   varchar(150) NOT NULL,
  module_id uuid REFERENCES module ON DELETE CASCADE
);
CREATE INDEX permission_module_id_idx ON permission (module_id);

CREATE TABLE role_permission (
  role_id       uuid NOT NULL REFERENCES role ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permission ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);
CREATE INDEX role_permission_permission_id_idx ON role_permission (permission_id);
