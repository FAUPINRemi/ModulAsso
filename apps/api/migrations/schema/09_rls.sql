-- RLS activée sans FORCE : le propriétaire (migrations, vues de stats, fonctions SECURITY DEFINER)
-- n'y est pas soumis. Le rôle applicatif l'est toujours. Sans politique qui s'applique, aucune ligne.
-- Les politiques ne nomment aucun rôle : seul le rôle applicatif a des droits sur les tables.

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'membre', 'invitation', 'structure_module', 'equipe', 'sous_equipe',
    'lieu', 'evenement', 'groupe', 'invitation_groupe',
    'disponibilite', 'tache', 'echeance',
    'article', 'lot', 'mouvement_stock', 'materiel', 'pret_materiel',
    'vue_dashboard', 'widget_place', 'import_fichier', 'import_ligne', 'modele_import'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY isolation ON %I
         USING (structure_id = structure_courante())
         WITH CHECK (structure_id = structure_courante())', t);
  END LOOP;
END
$$;

-- Un utilisateur voit ses adhésions dans toutes ses structures, pour choisir laquelle ouvrir.
CREATE POLICY mes_adhesions ON membre FOR SELECT
  USING (utilisateur_id = utilisateur_courant());

ALTER TABLE structure ENABLE ROW LEVEL SECURITY;
CREATE POLICY lecture ON structure FOR SELECT
  USING (id = structure_courante()
         OR EXISTS (SELECT 1 FROM membre m WHERE m.structure_id = structure.id
                                             AND m.utilisateur_id = utilisateur_courant()));
CREATE POLICY creation ON structure FOR INSERT
  WITH CHECK (true);
CREATE POLICY modification ON structure FOR UPDATE
  USING (id = structure_courante())
  WITH CHECK (id = structure_courante());

ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
CREATE POLICY isolation ON notification
  USING (structure_id = structure_courante())
  WITH CHECK (structure_id = structure_courante());
CREATE POLICY destinataire_lecture ON notification FOR SELECT
  USING (utilisateur_id = utilisateur_courant());
CREATE POLICY destinataire_lu ON notification FOR UPDATE
  USING (utilisateur_id = utilisateur_courant())
  WITH CHECK (utilisateur_id = utilisateur_courant());

-- Journal en ajout seul.
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  EXECUTE format('REVOKE UPDATE, DELETE ON journal FROM %I', current_setting('modulasso.role_app'));
END
$$;
CREATE POLICY lecture ON journal FOR SELECT
  USING (structure_id = structure_courante());
CREATE POLICY ajout ON journal FOR INSERT
  WITH CHECK (structure_id = structure_courante()
              OR (structure_id IS NULL AND utilisateur_id = utilisateur_courant()));

-- Tables de liaison sans structure_id : les deux parents doivent appartenir à la structure courante.
-- La structure est comparée explicitement, car mes_adhesions rend visibles des membres d'autres structures.
DO $$
DECLARE
  l record;
BEGIN
  FOR l IN SELECT * FROM (VALUES
    ('equipe_membre',      'equipe',      'equipe_id',      'membre',      'membre_id'),
    ('sous_equipe_membre', 'sous_equipe', 'sous_equipe_id', 'membre',      'membre_id'),
    ('participation',      'evenement',   'evenement_id',   'membre',      'membre_id'),
    ('groupe_evenement',   'groupe',      'groupe_id',      'evenement',   'evenement_id'),
    ('groupe_equipe',      'groupe',      'groupe_id',      'equipe',      'equipe_id'),
    ('groupe_sous_equipe', 'groupe',      'groupe_id',      'sous_equipe', 'sous_equipe_id'),
    ('groupe_membre',      'groupe',      'groupe_id',      'membre',      'membre_id')
  ) AS v(liaison, parent_a, col_a, parent_b, col_b) LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', l.liaison);
    EXECUTE format(
      'CREATE POLICY isolation ON %1$I
         USING (EXISTS (SELECT 1 FROM %2$I p WHERE p.id = %1$I.%3$I AND p.structure_id = structure_courante())
            AND EXISTS (SELECT 1 FROM %4$I p WHERE p.id = %1$I.%5$I AND p.structure_id = structure_courante()))
         WITH CHECK (EXISTS (SELECT 1 FROM %2$I p WHERE p.id = %1$I.%3$I AND p.structure_id = structure_courante())
            AND EXISTS (SELECT 1 FROM %4$I p WHERE p.id = %1$I.%5$I AND p.structure_id = structure_courante()))',
      l.liaison, l.parent_a, l.col_a, l.parent_b, l.col_b);
  END LOOP;
END
$$;
