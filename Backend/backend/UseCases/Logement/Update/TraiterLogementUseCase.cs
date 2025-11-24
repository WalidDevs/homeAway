using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;

namespace backend.UseCases.Logement.Update;

public class TraiterLogementUseCase
{
    private readonly ILogementRepository _logementRepository;
    

    public TraiterLogementUseCase(ILogementRepository logementRepository)
    {
        _logementRepository = logementRepository;
    }

    public async Task ExecuteAsync(int logementId, string statut)
    {
        var logement = await _logementRepository.GetByIdAsync(logementId)
                       ?? throw new Exception("Logement non trouvé");

        logement.Statut_logement = statut;
        await _logementRepository.UpdateAsync(logement);
    }
}
