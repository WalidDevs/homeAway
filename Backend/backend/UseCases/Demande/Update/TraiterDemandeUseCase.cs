using backend.DataAdapters.DataAdaptersFactory;

namespace backend.UseCases.Update;

using backend.DataAdapters;
using System.Threading.Tasks;

public class TraiterDemandeUseCase
{
    private readonly IDemandeRepository _demandeRepository;
    private readonly IUtilisateurRepository _utilisateurRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IEmailService _emailService; 
    

    public TraiterDemandeUseCase(
        IDemandeRepository demandeRepository,
        IUtilisateurRepository utilisateurRepository,
        IRoleRepository roleRepository,
        IEmailService emailService)
    {
        _demandeRepository = demandeRepository;
        _utilisateurRepository = utilisateurRepository;
        _roleRepository = roleRepository;
        _emailService = emailService;
    }

    public async Task ExecuteAsync(int demandeId, string statut)
    {
        var demande = await _demandeRepository.GetByIdAsync(demandeId)
                      ?? throw new Exception("Demande introuvable");

        var utilisateur = await _utilisateurRepository.GetByIdWithRolesAsync(demande.Id_utilisateur)
                          ?? throw new Exception("Utilisateur introuvable");

        Console.WriteLine($"{demande.Id_utilisateur} - {statut}");
        if (statut.ToLower() == "acceptée")
        {
            var nouveauRole = await _roleRepository.GetByTypeAsync("Propriétaire")
                              ?? throw new Exception("Rôle Propriétaire introuvable");

            utilisateur.Roles.Clear(); 
            utilisateur.Roles.Add(nouveauRole);
            await _utilisateurRepository.UpdateAsyncDemandeUserRole(utilisateur);
        }
        demande.Statut_demande = statut;
        await _demandeRepository.UpdateAsync(demande);
        string subject = "Mise à jour de votre demande";
        string body = statut.ToLower() == "acceptée"
            ? "Félicitations ! Votre demande a été acceptée."
            : "Nous sommes désolés, votre demande a été refusée.";

        await _emailService.SendEmailAsync(utilisateur.Email, subject, body);
    }
}