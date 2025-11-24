using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class Demande
{
    [Key]
    public int Id_demande { get; set; }
    public string Email_demande { get; set; }
    public string Motif_demande { get; set; }
    public string Statut_demande { get; set; }
    public int Id_utilisateur { get; set; }
    public  Utilisateur Utilisateur { get; set; }
}
