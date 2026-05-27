/**
 * Mock Data for the MEF Data Catalogue Search Engine
 * Aligned with the Grist schema definitions in schema.py and DILA hierarchical tree.
 */

// 1. Ref_Entite (DILA Organisation Tree - 6 Levels)
export const MOCK_ENTITIES = [
  { id: 1, Nom: "Ministère de l'Économie, des Finances et de la Souveraineté industrielle et numérique", Sigle: "MEF", Parent: null, Niveau_Hierarchique: "mef", Actif: true, BALF: "contact@mef.gouv.fr", Chemin: "MEF" },
  
  // Directions (Level 2)
  { id: 10, Nom: "Direction Générale des Entreprises", Sigle: "DGE", Parent: 1, Niveau_Hierarchique: "direction", Actif: true, BALF: "secretariat.dge@finances.gouv.fr", Chemin: "MEF > DGE" },
  { id: 20, Nom: "Agence pour l'Informatique Financière de l'État", Sigle: "AIFE", Parent: 1, Niveau_Hierarchique: "direction", Actif: true, BALF: "aife@finances.gouv.fr", Chemin: "MEF > AIFE" },
  { id: 30, Nom: "Service du Numérique", Sigle: "SNUM", Parent: 1, Niveau_Hierarchique: "direction", Actif: true, BALF: "snum.sg@finances.gouv.fr", Chemin: "MEF > SNUM" },
  { id: 40, Nom: "Direction du Budget", Sigle: "DB", Parent: 1, Niveau_Hierarchique: "direction", Actif: true, BALF: "db.secretariat@finances.gouv.fr", Chemin: "MEF > DB" },
  { id: 50, Nom: "Direction Générale des Finances Publiques", Sigle: "DGFiP", Parent: 1, Niveau_Hierarchique: "direction", Actif: true, BALF: "dgfip@finances.gouv.fr", Chemin: "MEF > DGFiP" },

  // Sous-Directions / Services (Level 3-4)
  { id: 101, Nom: "Sous-direction de l'Innovation et de l'Économie Numérique", Sigle: "SDIEN", Parent: 10, Niveau_Hierarchique: "sous-direction", Actif: true, BALF: "sdien.dge@finances.gouv.fr", Chemin: "MEF > DGE > SDIEN" },
  { id: 201, Nom: "Département Chorus", Sigle: "CHORUS", Parent: 20, Niveau_Hierarchique: "service", Actif: true, BALF: "chorus.aife@finances.gouv.fr", Chemin: "MEF > AIFE > CHORUS" },
  { id: 301, Nom: "Sous-direction de l'Architecture et de l'Innovation Data", Sigle: "SDAID", Parent: 30, Niveau_Hierarchique: "sous-direction", Actif: true, BALF: "sdaid.snum@finances.gouv.fr", Chemin: "MEF > SNUM > SDAID" },
  { id: 401, Nom: "Sous-direction du Budget de l'État", Sigle: "SDBE", Parent: 40, Niveau_Hierarchique: "sous-direction", Actif: true, BALF: "sdbe.db@finances.gouv.fr", Chemin: "MEF > DB > SDBE" },
  { id: 501, Nom: "Service du Contrôle Fiscal", Sigle: "SCF", Parent: 50, Niveau_Hierarchique: "service", Actif: true, BALF: "scf.dgfip@finances.gouv.fr", Chemin: "MEF > DGFiP > SCF" },

  // Bureaux (Level 5 - Pilot Scope)
  { id: 1011, Nom: "Bureau des Véhicules et Mobilités", Sigle: "BVM", Parent: 101, Niveau_Hierarchique: "bureau", Actif: true, BALF: "bvm.dge@finances.gouv.fr", Chemin: "MEF > DGE > SDIEN > BVM" },
  { id: 2011, Nom: "Bureau de la Comptabilité et des Dépenses de l'État", Sigle: "BCDE", Parent: 201, Niveau_Hierarchique: "bureau", Actif: true, BALF: "bcde.aife@finances.gouv.fr", Chemin: "MEF > AIFE > CHORUS > BCDE" },
  { id: 3011, Nom: "Bureau de l'Innovation et de la Data (Bercy Hub)", Sigle: "BID", Parent: 301, Niveau_Hierarchique: "bureau", Actif: true, BALF: "data.snum@finances.gouv.fr", Chemin: "MEF > SNUM > SDAID > BID" },
  { id: 3012, Nom: "Bureau de la Gouvernance des Systèmes et de la Sécurité", Sigle: "BGS", Parent: 301, Niveau_Hierarchique: "bureau", Actif: true, BALF: "security.snum@finances.gouv.fr", Chemin: "MEF > SNUM > SDAID > BGS" },
  { id: 4011, Nom: "Bureau des Lois de Finances", Sigle: "BLF", Parent: 401, Niveau_Hierarchique: "bureau", Actif: true, BALF: "blf.db@finances.gouv.fr", Chemin: "MEF > DB > SDBE > BLF" },
  { id: 5011, Nom: "Bureau de la Fiscalité Particulière et Directe", Sigle: "BFPD", Parent: 501, Niveau_Hierarchique: "bureau", Actif: true, BALF: "bfpd.dgfip@finances.gouv.fr", Chemin: "MEF > DGFiP > SCF > BFPD" }
];

// 2. Ref_Utilisateur (User Directory with Semantic Roles)
export const MOCK_USERS = [
  { id: 1, Nom: "Moysan", Prenom: "Paul", Email: "paul.moysan@finances.gouv.fr", Direction: 3011, Role: "Administrateur", Actif: true },
  { id: 2, Nom: "Dupont", Prenom: "Jean", Email: "jean.dupont@finances.gouv.fr", Direction: 1011, Role: "Producteur", Actif: true },
  { id: 3, Nom: "Alami", Prenom: "Amina", Email: "amina.alami@finances.gouv.fr", Direction: 5011, Role: "Consommateur", Actif: true },
  { id: 4, Nom: "Bernard", Prenom: "Karim", Email: "karim.bernard@finances.gouv.fr", Direction: 3011, Role: "Referent_Data", Actif: true },
  { id: 5, Nom: "Simon", Prenom: "Sophie", Email: "sophie.simon@finances.gouv.fr", Direction: 1, Role: "Auditeur", Actif: true },
  { id: 6, Nom: "Inconnu", Prenom: "Visiteur", Email: "invite@externe.gouv.fr", Direction: null, Role: "Invite", Actif: true }
];

// 3. Catalogue (Dataset Registry Entries)
export const MOCK_CATALOGUE = [
  {
    id: 101,
    Titre: "LOCOMVAC — Livret de circulation des véhicules automobiles de l'État",
    Description: "Référentiel des métadonnées de circulation, affectation, historique d'entretien et puissance administrative des véhicules automobiles détenus ou loués par l'administration centrale et déconcentrée de l'État. Utilisé pour piloter la transition écologique de la flotte automobile ministérielle.",
    Mots_Cles: ["mobilité", "flotte automobile", "carbone", "transition écologique", "véhicules"],
    Organisation: "Direction Générale des Entreprises",
    Service: "Sous-direction de l'Innovation et de l'Économie Numérique",
    Systeme_d_Information: ["SI-LOCOMVAC", "SI-FLOTTE"],
    Contact_Service: "bvm.dge@finances.gouv.fr",
    Date_Publication: "2024-03-12",
    Date_MaJ: "2026-05-10",
    Frequence_MaJ: "mensuelle",
    Couverture_Geo: ["National", "Régional"],
    URL: "https://intra.dge.finances.gouv.fr/locomvac",
    Format_Donnees: ["CSV", "API JSON", "XLSX"],
    Licence: "Licence Restreinte Administrations - CRPA Art. L322-6",
    Bureau_Producteur: 1011, // BVM
    Contact_Personne: ["Jean Dupont"],
    Direction: "DGE",
    Commentaires: "Données hautement sollicitées par le Bureau de la Data pour le calcul de l'empreinte carbone ministérielle. Contient des informations d'immatriculation d'agents, exigeant un traitement RGPD strict.",
    Thematique: ["Transports & Infrastructures", "Environnement"],
    Donnees_ouvertes: false,
    URL_Open_Data: "",
    Volumetrie_en_Mo_: 142.5,
    Niveau_Sensibilite: "diffusion-contrainee",
    Contact: 2, // Jean Dupont
    Statut_Publication: "donnees-reglementees",
    Statut_Qualification: "qualifie",
    Domaine_Fonctionnel: "Économie & Entreprises",
    BUID: "b8f0417b-d24d-44a6-8051-fb1bf4825902",
    Timestamp: "2026-05-10T09:30:00Z",
    Commanditaire: "Secrétariat Général du MEF",
    Periode_de_couverture_Date_de_debut: "2018-01-01",
    Periode_de_couverture_Date_de_fin: "2026-12-31",
    Langue: "français",
    URL_de_telechargement: "https://intra.dge.finances.gouv.fr/locomvac/download/full.csv"
  },
  {
    id: 102,
    Titre: "Baromètre Numérique de l'Expérience des Agents (BNEA)",
    Description: "Enquête annuelle d'évaluation des compétences numériques des agents, de l'ergonomie de l'intranet, de la qualité des équipements informatiques mis à disposition et du niveau de support technique. Réalisé sous l'égide du Bureau de l'Innovation et de la Data.",
    Mots_Cles: ["agents", "compétences numériques", "ergonomie", "satisfaction", "outils informatiques"],
    Organisation: "Secrétariat Général - SNUM",
    Service: "Sous-direction de l'Architecture et de l'Innovation Data",
    Systeme_d_Information: ["SI-ENQUETES-BNEA"],
    Contact_Service: "data.snum@finances.gouv.fr",
    Date_Publication: "2025-01-15",
    Date_MaJ: "2026-02-28",
    Frequence_MaJ: "annuelle",
    Couverture_Geo: ["National"],
    URL: "https://snum.intranet.mef/bnea-dashboard",
    Format_Donnees: ["CSV", "SQLite"],
    Licence: "Licence Interne Ministérielle",
    Bureau_Producteur: 3011, // BID
    Contact_Personne: ["Karim Bernard"],
    Direction: "SNUM",
    Commentaires: "Données anonymisées mais conservation des données démographiques par direction/bureau (risque de réidentification si effectif faible). Permet d'alimenter le rapport social annuel.",
    Thematique: ["Statistiques publiques", "Ressources Humaines"],
    Donnees_ouvertes: false,
    URL_Open_Data: "",
    Volumetrie_en_Mo_: 12.8,
    Niveau_Sensibilite: "diffusion-restreinte",
    Contact: 4, // Karim Bernard
    Statut_Publication: "donnees-fermees",
    Statut_Qualification: "qualifie",
    Domaine_Fonctionnel: "Ressources Humaines",
    BUID: "9a01f5c6-e918-4e8c-8c10-53bc862fe41b",
    Timestamp: "2026-02-28T14:45:00Z",
    Commanditaire: "Chef du Service du Numérique",
    Periode_de_couverture_Date_de_debut: "2024-09-01",
    Periode_de_couverture_Date_de_fin: "2025-12-31",
    Langue: "français",
    URL_de_telechargement: "https://snum.intranet.mef/bnea/export/2025.csv"
  },
  {
    id: 103,
    Titre: "Chorus — Répertoire des Dépenses Publiques Budgétaires de l'État",
    Description: "Agrégation consolidée des flux de facturation, engagements juridiques, ordres de payer et paiements effectifs émis par l'ensemble des ministères de l'État français sur l'outil national Chorus. Cette table constitue le cœur financier de l'État.",
    Mots_Cles: ["dépenses", "budget de l'état", "comptabilité", "marchés publics", "finances publiques"],
    Organisation: "AIFE",
    Service: "Département Chorus",
    Systeme_d_Information: ["SI-CHORUS-CORE", "SI-CHORUS-BI"],
    Contact_Service: "bcde.aife@finances.gouv.fr",
    Date_Publication: "2021-05-10",
    Date_MaJ: "2026-05-26",
    Frequence_MaJ: "quotidienne",
    Couverture_Geo: ["National"],
    URL: "https://data.economie.gouv.fr/explore/dataset/chorus-depenses",
    Format_Donnees: ["CSV", "API REST", "Parquet"],
    Licence: "Licence Ouverte Etalab v2.0",
    Bureau_Producteur: 2011, // BCDE
    Contact_Personne: ["Bureau Chorus"],
    Direction: "AIFE",
    Commentaires: "Données publiées quotidiennement en open data sur la plateforme ministérielle après suppression automatique des informations protégées (secret défense, transactions d'investigation active).",
    Thematique: ["Finances publiques", "Budget", "Économie & Entreprises"],
    Donnees_ouvertes: true,
    URL_Open_Data: "https://data.economie.gouv.fr/explore/dataset/depenses-de-letat",
    Volumetrie_en_Mo_: 14250.0,
    Niveau_Sensibilite: "open-data",
    Contact: 4, // Karim Bernard (Referent central)
    Statut_Publication: "donnees-ouvertes",
    Statut_Qualification: "certifie",
    Domaine_Fonctionnel: "Budget & Finances",
    BUID: "d2d14871-3310-410a-b32c-f673891461ff",
    Timestamp: "2026-05-26T23:59:00Z",
    Commanditaire: "Secrétariat Général AIFE",
    Periode_de_couverture_Date_de_debut: "2020-01-01",
    Periode_de_couverture_Date_de_fin: "2026-05-26",
    Langue: "français",
    URL_de_telechargement: "https://data.economie.gouv.fr/explore/dataset/depenses-de-letat/download"
  },
  {
    id: 104,
    Titre: "Projet de Loi de Finances (PLF) — Trame de Préparation Budgétaire",
    Description: "Fiches d'arbitrage budgétaire, plafonds de dépenses ministériels, modélisations macroéconomiques et textes législatifs associés en cours de préparation pour la prochaine loi de finances de l'État. Strictement réservé aux processus internes.",
    Mots_Cles: ["plf", "loi de finances", "arbitrage", "budget", "secret budgétaire"],
    Organisation: "Direction du Budget",
    Service: "Sous-direction du Budget de l'État",
    Systeme_d_Information: ["SI-PREPA-PLF"],
    Contact_Service: "blf.db@finances.gouv.fr",
    Date_Publication: "2026-04-01",
    Date_MaJ: "2026-05-25",
    Frequence_MaJ: "quotidienne",
    Couverture_Geo: ["National"],
    URL: "https://budget.intranet.mef/plf-prep",
    Format_Donnees: ["Base de données Oracle", "XLSX secure"],
    Licence: "Strictement Restreint - Secrets d'État (Arbitrage en cours)",
    Bureau_Producteur: 4011, // BLF
    Contact_Personne: ["Secrétariat de la sous-direction SDBE"],
    Direction: "DB",
    Commentaires: "Données ultra-sensibles. Aucune diffusion externe autorisée avant la présentation officielle en Conseil des Ministres et le dépôt sur le bureau de l'Assemblée nationale en septembre.",
    Thematique: ["Budget", "Finances publiques"],
    Donnees_ouvertes: false,
    URL_Open_Data: "",
    Volumetrie_en_Mo_: 85.0,
    Niveau_Sensibilite: "confidentiel",
    Contact: 4, // Karim Bernard (Referent)
    Statut_Publication: "donnees-fermees",
    Statut_Qualification: "en-cours",
    Domaine_Fonctionnel: "Budget & Finances",
    BUID: "4f0d3674-c36b-4e8c-85a2-09f1bf24510b",
    Timestamp: "2026-05-25T18:30:00Z",
    Commanditaire: "Directeur du Budget",
    Periode_de_couverture_Date_de_debut: "2026-01-01",
    Periode_de_couverture_Date_de_fin: "2027-12-31",
    Langue: "français",
    URL_de_telechargement: ""
  },
  {
    id: 105,
    Titre: "Annuaire des Agents MEF — Registre des Profils et Rémunérations",
    Description: "Base de données nominative centrale comprenant l'identification civile (nom, prénom, NIR), le grade d'affectation administrative, les coordonnées de bureau, l'historique de carrière, les indices de rémunération et les cotisations sociales des agents du MEF.",
    Mots_Cles: ["agents", "ressources humaines", "rémunération", "grade", "carrière", "annuaire"],
    Organisation: "Secrétariat Général",
    Service: "Service des Ressources Humaines (SRH)",
    Systeme_d_Information: ["SI-RENE", "SI-PAYE"],
    Contact_Service: "rh.sg@finances.gouv.fr",
    Date_Publication: "2015-10-01",
    Date_MaJ: "2026-05-01",
    Frequence_MaJ: "quotidienne",
    Couverture_Geo: ["National", "Local"],
    URL: "https://rh.intranet.mef/rene-agents",
    Format_Donnees: ["Active Directory AD", "API REST Secure"],
    Licence: "Régime Spécial Données Personnelles - RGPD Art. 30",
    Bureau_Producteur: 3012, // BGS (rattaché sécurité)
    Contact_Personne: ["Bureau de la Gouvernance des Systèmes"],
    Direction: "SNUM",
    Commentaires: "Contient des données personnelles sensibles au sens du RGPD (données financières et NIR). Rattaché au registre des traitements n°2018-RH-MEF. Accès strictement limité aux départements RH habilités.",
    Thematique: ["Ressources Humaines"],
    Donnees_ouvertes: false,
    URL_Open_Data: "",
    Volumetrie_en_Mo_: 324.0,
    Niveau_Sensibilite: "donnees-personnelles-rgpd",
    Contact: 4, // Karim Bernard
    Statut_Publication: "donnees-fermees",
    Statut_Qualification: "certifie",
    Domaine_Fonctionnel: "Ressources Humaines",
    BUID: "9a1bf042-4f81-4475-ae8d-194b15ffbe42",
    Timestamp: "2026-05-01T08:00:00Z",
    Commanditaire: "Directeur des Ressources Humaines",
    Periode_de_couverture_Date_de_debut: "2015-01-01",
    Periode_de_couverture_Date_de_fin: "2026-12-31",
    Langue: "français",
    URL_de_telechargement: ""
  },
  {
    id: 106,
    Titre: "Statistiques Consolidated du Recouvrement des Impôts Fonciers",
    Description: "Statistiques agrégées par département et commune sur le taux de recouvrement des impôts fonciers (taxe foncière sur les propriétés bâties et non bâties). Conçu pour l'analyse économique de la rentabilité des territoires.",
    Mots_Cles: ["fiscalité", "foncier", "commune", "statistiques", "impôts"],
    Organisation: "DGFiP",
    Service: "Service du Contrôle Fiscal",
    Systeme_d_Information: ["SI-PATRIM", "SI-RECOUVR"],
    Contact_Service: "bfpd.dgfip@finances.gouv.fr",
    Date_Publication: "2023-09-10",
    Date_MaJ: "2026-04-12",
    Frequence_MaJ: "semestrielle",
    Couverture_Geo: ["National", "Régional", "Local"],
    URL: "https://data.economie.gouv.fr/explore/dataset/recouvrement-foncier",
    Format_Donnees: ["CSV", "JSON"],
    Licence: "Licence Ouverte Etalab v2.0",
    Bureau_Producteur: 5011, // BFPD
    Contact_Personne: ["Amina Alami"],
    Direction: "DGFiP",
    Commentaires: "Données purement statistiques, anonymisées à la source. Conforme au secret fiscal car les résultats de cellules contenant moins de 11 contribuables sont automatiquement regroupés pour éviter la réidentification.",
    Thematique: ["Statistiques publiques", "Finances publiques", "Fiscalité"],
    Donnees_ouvertes: true,
    URL_Open_Data: "https://data.economie.gouv.fr/explore/dataset/impots-fonciers-stats",
    Volumetrie_en_Mo_: 18.5,
    Niveau_Sensibilite: "open-data",
    Contact: 3, // Amina Alami
    Statut_Publication: "donnees-ouvertes",
    Statut_Qualification: "certifie",
    Domaine_Fonctionnel: "Fiscalité",
    BUID: "9a0ff321-4f11-4a11-be8d-712c19a8bc8f",
    Timestamp: "2026-04-12T10:00:00Z",
    Commanditaire: "Sous-directeur des Études Fiscales",
    Periode_de_couverture_Date_de_debut: "2022-01-01",
    Periode_de_couverture_Date_de_fin: "2025-12-31",
    Langue: "français",
    URL_de_telechargement: "https://data.economie.gouv.fr/explore/dataset/impots-fonciers-stats/download"
  },
  {
    id: 107,
    Titre: "Chorus Pro — Annuaire des Factures Électroniques Fournisseurs",
    Description: "Registre exhaustif des factures émises par les fournisseurs de la sphère publique (entreprises privées, artisans, PME) à destination de l'État, des collectivités locales et des hôpitaux publics via le portail réglementaire Chorus Pro.",
    Mots_Cles: ["facture électronique", "aife", "entreprises", "paiement", "marchés publics"],
    Organisation: "AIFE",
    Service: "Département Chorus",
    Systeme_d_Information: ["SI-CHORUS-PRO"],
    Contact_Service: "bcde.aife@finances.gouv.fr",
    Date_Publication: "2025-10-01",
    Date_MaJ: "2026-05-18",
    Frequence_MaJ: "mensuelle",
    Couverture_Geo: ["National"],
    URL: "https://intra.aife.finances.gouv.fr/chorus-pro-fact",
    Format_Donnees: ["API REST secure"],
    Licence: "Licence Interne Restreinte (Secret des Affaires)",
    Bureau_Producteur: 2011, // BCDE
    Contact_Personne: ["Équipe Chorus Pro"],
    Direction: "AIFE",
    Commentaires: "Données commerciales protégées par le secret des affaires. Seules les données agrégées et anonymisées sur les délais globaux de paiement (DGP) font l'objet d'une publication publique.",
    Thematique: ["Finances publiques", "Économie & Entreprises"],
    Donnees_ouvertes: false,
    URL_Open_Data: "",
    Volumetrie_en_Mo_: 1280.0,
    Niveau_Sensibilite: "diffusion-restreinte",
    Contact: 4, // Karim Bernard
    Statut_Publication: "donnees-reglementees",
    Statut_Qualification: "a-verifier-metier",
    Domaine_Fonctionnel: "Budget & Finances",
    BUID: "bcde1280-4a81-19a8-ae2d-98fb193ac8fd",
    Timestamp: "2026-05-18T11:00:00Z",
    Commanditaire: "Chef de projet Chorus Pro",
    Periode_de_couverture_Date_de_debut: "2023-01-01",
    Periode_de_couverture_Date_de_fin: "2026-12-31",
    Langue: "français",
    URL_de_telechargement: ""
  }
];

// 4. Dictionnaire (Variables mapping for key datasets)
export const MOCK_DICTIONARY = [
  // LOCOMVAC (101)
  { id: 1, jeu_de_donnees: 101, variable: "immatriculation", unite: "Texte (Format AA-123-AA)", type: "Identification", commentaire: "Numéro d'immatriculation au SIV (Système d'Immatriculation des Véhicules). Haché en diffusion élargie." },
  { id: 2, jeu_de_donnees: 101, variable: "puissance_fiscale", unite: "CV (Chevaux fiscaux - Numérique)", type: "Technique", commentaire: "Puissance administrative du véhicule, utilisée pour le calcul des taxes et frais d'assurance." },
  { id: 3, jeu_de_donnees: 101, variable: "taux_co2", unite: "g/km (Grammes de CO2 par kilomètre - Numérique)", type: "Environnement", commentaire: "Taux d'émission théorique certifié WLTP. Indispensable pour le pilotage de transition écologique." },
  { id: 4, jeu_de_donnees: 101, variable: "type_energie", unite: "Énumération (Diesel, Essence, Hybride, Électrique)", type: "Technique", commentaire: "Carburant ou type de motorisation principale." },
  { id: 5, jeu_de_donnees: 101, variable: "direction_affectataire", unite: "Référence (Sigle Direction DILA)", type: "Organisation", commentaire: "Direction du ministère qui utilise le véhicule (DGFiP, DGE, etc.)." },
  { id: 6, jeu_de_donnees: 101, variable: "nom_conducteur_principal", unite: "Texte (Nom, Prénom)", type: "Personnel", commentaire: "Identité de l'agent affectataire. Catégorisée comme donnée personnelle sensible RGPD." },

  // BNEA (102)
  { id: 10, jeu_de_donnees: 102, variable: "score_ergonomie_intranet", unite: "Note de 1 à 10 (Numérique)", type: "Statistique", commentaire: "Évaluation de la satisfaction globale des agents concernant l'intranet Alizé." },
  { id: 11, jeu_de_donnees: 102, variable: "equipement_type", unite: "Énumération (Ordinateur fixe, PC Portable, Tablette)", type: "Technique", commentaire: "Matériel informatique principal utilisé par l'agent au quotidien." },
  { id: 12, jeu_de_donnees: 102, variable: "direction_agent", unite: "Référence (Sigle Direction DILA)", type: "Organisation", commentaire: "Direction d'affectation déclarée de l'agent répondant." },

  // Chorus (103)
  { id: 20, jeu_de_donnees: 103, variable: "ej_id", unite: "Identifiant (Numérique unique)", type: "Identification", commentaire: "Numéro de l'Engagement Juridique dans Chorus." },
  { id: 21, jeu_de_donnees: 103, variable: "montant_engage_ht", unite: "Euro (€ - Décimal)", type: "Financier", commentaire: "Montant hors taxes engagé lors de la signature du contrat ou du marché public." },
  { id: 22, jeu_de_donnees: 103, variable: "siret_beneficiaire", unite: "Siret (14 chiffres - Texte)", type: "Identification", commentaire: "Numéro SIRET de l'entreprise ou organisme prestataire créancier de l'État." },
  { id: 23, jeu_de_donnees: 103, variable: "date_liquidation", unite: "Date (AAAA-MM-JJ)", type: "Calendrier", commentaire: "Date de validation comptable attestant du service fait." },

  // PLF (104)
  { id: 30, jeu_de_donnees: 104, variable: "plafond_dépenses_mef", unite: "Millions d'euros (M€ - Décimal)", type: "Financier", commentaire: "Plafond global de crédits de paiement alloué aux missions du MEF." },
  { id: 31, jeu_de_donnees: 104, variable: "arbitrage_statut", unite: "Énumération (En cours, Validé, Rejeté)", type: "Gouvernance", commentaire: "État de validation de la fiche d'arbitrage budgétaire par le Premier Ministre." },

  // Annuaire (105)
  { id: 40, jeu_de_donnees: 105, variable: "nir_agent", unite: "NIR (15 chiffres - Texte)", type: "Personnel", commentaire: "Numéro de sécurité sociale de l'agent. Donnée ultra-sensible." },
  { id: 41, jeu_de_donnees: 105, variable: "indice_brut", unite: "Indice majoré (Numérique)", type: "Financier", commentaire: "Indice de traitement de la fonction publique servant de base à la paye." }
];

// 5. Initial trace for Demande_Donnees
export const INITIAL_REQUESTS = [
  {
    id: 1,
    Titre: "Demande d'accès LOCOMVAC pour BNEA",
    Description: "Nous souhaiterions croiser les données de flotte automobile de LOCOMVAC avec les répondants de l'enquête BNEA habitant à plus de 20km de leur lieu de travail pour affiner notre baromètre écologique.",
    Demandeur: 4, // Karim Bernard (Referent)
    Producteur_Cible: 10, // DGE
    Dataset_Lie: 101, // LOCOMVAC
    Type_Demande: "rapport-croise",
    Statut: "en-traitement",
    Timestamp: "2026-05-12T10:00:00Z",
    Reponse_Producteur: "Demande reçue. Nous sommes en train d'examiner le risque de réidentification des agents en croisant les données géographiques BNEA avec les immatriculations LOCOMVAC. Une réponse formelle vous sera adressée après avis de notre DPD (Délégué à la Protection des Données).",
    Date_Reponse: "2026-05-14"
  },
  {
    id: 2,
    Titre: "Demande d'information Dépenses Chorus",
    Description: "Dans le cadre d'un rapport de la Cour des Comptes sur l'efficience énergétique, pouvez-vous confirmer si la nomenclature Chorus permet de filtrer uniquement les factures d'achat d'électricité verte des bâtiments ?",
    Demandeur: 5, // Sophie Simon (Auditeur)
    Producteur_Cible: 20, // AIFE
    Dataset_Lie: 103, // Chorus
    Type_Demande: "renseignement",
    Statut: "traitee",
    Timestamp: "2026-05-02T16:00:00Z",
    Reponse_Producteur: "Bonjour. Oui, la nomenclature d'achats Chorus intègre le code nature spécifique '606111' pour l'électricité. Pour isoler l'électricité verte, vous devez cependant vous référer aux attributs de marchés publics saisis en métadonnées ou analyser les factures dématérialisées de Chorus Pro. N'hésitez pas à solliciter un export ciblé.",
    Date_Reponse: "2026-05-05"
  }
];
