using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class Equipement
{ 
    [Key]
    public int Id_equipement { get; set; }
    public string Nom_equipement { get; set; }
    public int Id_categorie { get; set; }
    public  Categorie Categorie { get; set; }
    public List<Logement> Logements { get; set; } = new List<Logement>() ;
}
