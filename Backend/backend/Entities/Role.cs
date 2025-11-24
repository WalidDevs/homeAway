using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class Role 
{
    [Key]
    public int Id_role { get; set; }
    public string Type_role { get; set; }
    public  List<Utilisateur> Utilisateurs { get; set; } = new List<Utilisateur>();
}
