using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.Entities;

public class Logement
{
    [Key]
    public int Id_logement { get; set; }
    public int Surface { get; set; }
    public string Type_log { get; set; }
    public string Statut_logement { get; set; }
    public string Description { get; set; }
    public int Prix { get; set; }
    public string Ville { get; set; }
    public byte[] Justificatif_domicile { get; set; }
    public byte[] Image { get; set; }
    public DateTime Date_dispo_debut { get; set; }  
    public DateTime Date_dispo_fin { get; set; }
    public int Id_utilisateur { get; set; }
    public Utilisateur Utilisateur { get; set; }
    public List<Reservation> Reservations { get; set; } = new List<Reservation>();
    public List<Equipement> Equipements { get; set; } = new List<Equipement>();
}