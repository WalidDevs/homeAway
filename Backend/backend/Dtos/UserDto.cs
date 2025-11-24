using backend.Entities;

namespace backend.Dtos;

public class UserDto
{
    public int Id_utilisateur { get; set; }
    public string Nom { get; set; }
    public string Prenom { get; set; }
    public string Num_phone { get; set; }
    public string Ville { get; set; }
    public string Sexe { get; set; }
    public string Email { get; set; }
    public string? Mot_de_passe { get; set; }
    
    public static UserDto ToDto(Utilisateur utilisateur)
    {
        return new UserDto
        {
            Id_utilisateur = utilisateur.Id_utilisateur,
            Nom = utilisateur.Nom,
            Prenom = utilisateur.Prenom,
            Email = utilisateur.Email,
            Num_phone = utilisateur.Num_phone,
            Ville = utilisateur.Ville,
            Sexe = utilisateur.Sexe,
            Mot_de_passe = utilisateur.Mot_de_passe
        };
    }
    public static List<UserDto> ToDtos(List<Utilisateur> utilisateurs)
    {
        return utilisateurs.Select(ToDto).ToList();
    }
}