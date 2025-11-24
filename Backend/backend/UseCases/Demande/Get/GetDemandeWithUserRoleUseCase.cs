using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;

namespace backend.UseCases.Read;

public class GetDemandeWithUserRoleUseCase
{
    private readonly IDemandeRepository _demandeRepository;
    private readonly IUtilisateurRepository _utilisateurRepository;

    public GetDemandeWithUserRoleUseCase(IDemandeRepository demandeRepository, IUtilisateurRepository utilisateurRepository)
    {
        _demandeRepository = demandeRepository;
        _utilisateurRepository = utilisateurRepository;
    }

    public async Task<DemandeAvecRoleDto> ExecuteAsync(int demandeId)
    {
        var demande = await _demandeRepository.GetByIdAsync(demandeId);
        if (demande == null)
            throw new Exception("Demande non trouvée");

        var utilisateur = await _utilisateurRepository.GetByIdWithRolesAsync(demande.Id_utilisateur);
        if (utilisateur == null)
            throw new Exception("Utilisateur non trouvé");

        var roles = utilisateur.Roles.Select(r => r.Type_role).ToList();

        return new DemandeAvecRoleDto
        {
            Id = demande.Id_demande,
            Email = demande.Email_demande,
            Motif = demande.Motif_demande,
            Statut = demande.Statut_demande,
            RolesActuels = roles
        };
    }
}