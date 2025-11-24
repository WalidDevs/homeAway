using backend.Entities;

namespace backend.Dtos;

public class LogementDemandeDto
{
    public int Id_logement { get; set; }
    public int Surface { get; set; }
    public string Type_log { get; set; }
    public string Statut_logement { get; set; }
    public string Description { get; set; }
    public int Prix { get; set; }
    public string Ville { get; set; }
    public string EmailUtilisateur { get; set; }
    public List<string> Equipements { get; set; } = new();
    public string? ImageBase64 { get; set; } 
    public static LogementDemandeDto ToDto(Logement logement)
    {
        return new LogementDemandeDto
        {
            Id_logement = logement.Id_logement,
            Surface = logement.Surface,
            Type_log = logement.Type_log,
            Statut_logement = logement.Statut_logement,
            Description = logement.Description,
            Prix = logement.Prix,
            Ville = logement.Ville,
            EmailUtilisateur = logement.Utilisateur?.Email ?? "N/A",
            Equipements = logement.Equipements?
                .Select(e => e.Nom_equipement)
                .ToList() ?? new List<string>(),
            ImageBase64 = logement.Image != null
                ? Convert.ToBase64String(logement.Image)
                : null
        };
    }
}
