using backend.DataAdapters;
using backend.Entities;

public class DeleteUtilisateurUseCase
{
    private readonly IUtilisateurRepository _utilisateurRepository;

    public DeleteUtilisateurUseCase(IUtilisateurRepository utilisateurRepository)
    {
        _utilisateurRepository = utilisateurRepository;
    }

    public async Task ExecuteAsync(int id)
    {
        var utilisateur = await _utilisateurRepository.GetByIdAsync(id);
        if (utilisateur == null)
        {
            throw new KeyNotFoundException("Utilisateur non trouvé.");
        }

        await _utilisateurRepository.DeleteAsync(id);
    }
}