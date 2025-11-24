using backend.DataAdapters;

public class DeleteDemandeUseCase
{
    private readonly IDemandeRepository _demandeRepository;

    public DeleteDemandeUseCase(IDemandeRepository demandeRepository)
    {
        _demandeRepository = demandeRepository;
    }

    public async Task ExecuteAsync(int id)
    {
        var demande = await _demandeRepository.GetByIdAsync(id);
        if (demande == null)
        {
            throw new KeyNotFoundException("Demande non trouvée");
        }

        await _demandeRepository.DeleteAsync(id);
    }
}