using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class Reservation
{
    [Key]
    public int Id_reservation { get; set; }
    public DateTime Date_debut { get; set; }
    public DateTime Date_fin { get; set; }
    public string Type_reservation { get; set; }
    public string Statut { get; set; }
    public int Nbr_personnes { get; set; }
    public int Montant_total { get; set; }
    public int Id_logement { get; set; }
    public Logement Logement { get; set; }
    public int Id_utilisateur { get; set; }
    public Utilisateur utilisateur { get; set; }
}
