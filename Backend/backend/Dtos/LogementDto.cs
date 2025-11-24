using backend.Entities;
using Microsoft.AspNetCore.Http;
public class LogementDto
{
    public int Id { get; set; }
    public int Surface { get; set; }
    public string Type_log { get; set; }
    public string? Statut_logement { get; set; }
    
    public List<string> Equipements { get; set; } = new();
    public string Description { get; set; }
    public int Prix { get; set; }
    public string Ville { get; set; }
    public IFormFile Justificatif_domicile { get; set; }
    public List<IFormFile> Image { get; set; }
    public DateTime Date_dispo_debut { get; set; }
    public DateTime Date_dispo_fin { get; set; }
    public int Id_utilisateur { get; set; }
    public List<int> Ids_equipements { get; set; }
    public byte[]? ImageBytes { get; set; }

    public static LogementDto ToDto(Logement logement)
    {
        return new LogementDto
        {
            Id = logement.Id_logement,
            Surface = logement.Surface,
            Type_log = logement.Type_log,
            Statut_logement = logement.Statut_logement,
            Description = logement.Description,
            Prix = logement.Prix,
            Ville = logement.Ville,
            Date_dispo_debut = logement.Date_dispo_debut,
            Date_dispo_fin = logement.Date_dispo_fin,
            Id_utilisateur = logement.Id_utilisateur,
            Equipements = logement.Equipements?.Select(e => e.Nom_equipement).ToList(),
            Ids_equipements = logement.Equipements?.ConvertAll(e => e.Id_equipement) ?? new List<int>(),
            ImageBytes = logement.Image
        };
    }
}