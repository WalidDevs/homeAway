using backend.Entities;
namespace backend.Dtos;
public class DemandeDto
{
    public int Id_demande { get; set; }
    public string Email_demande { get; set; }
    public string Motif_demande { get; set; }
    public string Statut_demande { get; set; }
    public int Id_utilisateur { get; set; }
    
    public static DemandeDto ToDto(Demande demande)
    {
        return new DemandeDto
        {
            Id_demande = demande.Id_demande,
            Email_demande = demande.Email_demande,
            Motif_demande = demande.Motif_demande,
            Statut_demande = demande.Statut_demande,
            Id_utilisateur = demande.Id_utilisateur
        };
    }
    public static List<DemandeDto> ToDtos(List<Demande> demandes)
    {
        return demandes.Select(ToDto).ToList();
    }
}