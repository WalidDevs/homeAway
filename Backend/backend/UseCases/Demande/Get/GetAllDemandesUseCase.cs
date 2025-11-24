using backend.DataAdapters;
using backend.Dtos;

public class GetAllDemandesUseCase
{
    private readonly IDemandeRepository _demandeRepository;

    public GetAllDemandesUseCase(IDemandeRepository demandeRepository)
    {
        _demandeRepository = demandeRepository;
    }

    public async Task<List<DemandeDto>> ExecuteAsync()
    {
        var demandes = await _demandeRepository.GetAllAsync();
        return DemandeDto.ToDtos(demandes);
    }
}