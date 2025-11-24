using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using backend.DataAdapters.DataAdaptersFactory;

namespace backend.UseCases.Create;

public class CreateDemandeUseCase
{
    private readonly IDemandeRepository _demandeRepository;
    private readonly IUtilisateurRepository _utilisateurRepository;

    public CreateDemandeUseCase(IDemandeRepository demandeRepository, IUtilisateurRepository utilisateurRepository)
    {
        _demandeRepository = demandeRepository;
        _utilisateurRepository = utilisateurRepository;
    }

    public async Task ExecuteAsync(DemandeDto demandeDto)
    {
        var utilisateur = await _utilisateurRepository.GetByIdAsync(demandeDto.Id_utilisateur);
        if (utilisateur == null)
        {
            throw new InvalidOperationException("Utilisateur non trouvé");
        }

        var demande = new Demande
        {
            Email_demande = demandeDto.Email_demande,
            Motif_demande = demandeDto.Motif_demande,
            Statut_demande = "En attente",
            Id_utilisateur = utilisateur.Id_utilisateur,
            Utilisateur = utilisateur
        };

        await _demandeRepository.CreateAsync(demande);
    }
}