export interface Equipement {
    id_equipement: number;
    nom_equipement: string;
    id_categorie: number;
}
export interface Categorie {
    id_categorie: number;
    nom_categorie: string;
}
export interface Logement {
    id: number;
    surface: number;
    type_log: string;
    statut_logement: string;
    description: string;
    prix: number;
    ville: string;
    justificatif_domicile: File;
    images: string | null;
    date_dispo_debut: string;
    date_dispo_fin: string;
    id_utilisateur: number;
    ids_equipements: number[];
    id_categorie: number;
    equipements: Equipement[];
    imageBytes: number[] | null;
}
