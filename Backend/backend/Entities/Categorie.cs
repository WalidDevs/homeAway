using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class Categorie
{
     [Key] 
     public int Id_categorie { get; set; }
     public string Nom_categorie { get; set; }
     public  List<Equipement> Equipements { get; set; } = new List<Equipement>();
}
          