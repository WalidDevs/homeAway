using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class Utilisateur 
{
    [Key]
    public int Id_utilisateur { get; set; }
    public string Nom { get; set; }
    public string Prenom { get; set; }
    public string Num_phone { get; set; }
    public string Ville { get; set; }
    public string Sexe { get; set; }
    public string Email { get; set; }
    [Required]
    public string Mot_de_passe { get; set; }
    public List<Demande> Demandes { get; set; } = new List<Demande>();
    public List<Logement> Logements { get; set; } = new List<Logement>();
    public List<Role> Roles { get; set; } = new List<Role>(); 
    public List<Reservation> Reservations { get; set; } = new List<Reservation>();
}
