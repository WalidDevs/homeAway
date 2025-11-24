using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;

namespace backend.UseCases.Get;

public class GetTousLesUtilisateursUseCase
{
    private readonly IUtilisateurRepository _utilisateurRepository;

    public GetTousLesUtilisateursUseCase(IUtilisateurRepository utilisateurRepository)
    {
        _utilisateurRepository = utilisateurRepository;
    }

    public async Task<List<UserDto>> ExecuteAsync()
    {
        var utilisateurs = await _utilisateurRepository.GetAllAsync();
        return utilisateurs.Select(u => new UserDto
        {
            Id_utilisateur = u.Id_utilisateur,
            Nom = u.Nom,
            Prenom = u.Prenom,
            Email = u.Email,
            Num_phone = u.Num_phone,
            Ville = u.Ville,
            Sexe = u.Sexe
        }).ToList();
    }
}