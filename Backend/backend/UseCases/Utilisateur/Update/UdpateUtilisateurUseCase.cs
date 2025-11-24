using backend.DataAdapters;
using backend.Dtos;

public class UpdateUtilisateurUseCase
{
    private readonly IUtilisateurRepository _utilisateurRepository;

    public UpdateUtilisateurUseCase(IUtilisateurRepository utilisateurRepository)
    {
        _utilisateurRepository = utilisateurRepository;
    }

    public async Task ExecuteAsync(int id, UserDto userDto)
    {
        var utilisateur = await _utilisateurRepository.GetByIdAsync(id);
        if (utilisateur == null)
        {
            throw new KeyNotFoundException("Utilisateur non trouvé.");
        }
        utilisateur.Nom = userDto.Nom ?? utilisateur.Nom;
        utilisateur.Prenom = userDto.Prenom ?? utilisateur.Prenom;
        utilisateur.Email = userDto.Email ?? utilisateur.Email;
        utilisateur.Num_phone = userDto.Num_phone ?? utilisateur.Num_phone;
        utilisateur.Ville = userDto.Ville ?? utilisateur.Ville;
        utilisateur.Sexe = userDto.Sexe ?? utilisateur.Sexe;

        if (!string.IsNullOrWhiteSpace(userDto.Mot_de_passe))
        {
            utilisateur.Mot_de_passe = BCrypt.Net.BCrypt.HashPassword(userDto.Mot_de_passe);
        }

        await _utilisateurRepository.UpdateAsync(utilisateur);
    }
}