using backend.DataAdapters;
using backend.Dtos;

public class GetDemandeByIdUseCase
{
    private readonly IDemandeRepository _demandeRepository;

    public GetDemandeByIdUseCase(IDemandeRepository demandeRepository)
    {
        _demandeRepository = demandeRepository;
    }

    public async Task<DemandeDto> ExecuteAsync(int id)
    {
        var demande = await _demandeRepository.GetByIdAsync(id);
        if (demande == null)
        {
            throw new KeyNotFoundException("Demande non trouvée");
        }
        return DemandeDto.ToDto(demande);
    }
}