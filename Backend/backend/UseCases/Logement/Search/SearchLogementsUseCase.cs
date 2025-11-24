using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;

namespace backend.UseCases.Logement.Search;

public class SearchLogementsUseCase
{
    private readonly ILogementRepository _logementRepository;

    public SearchLogementsUseCase(ILogementRepository logementRepository)
    {
        _logementRepository = logementRepository;
    }

    public async Task<List<Entities.Logement>> ExecuteAsync(LogementFilterDto filters)
    {
        return await _logementRepository.SearchAsync(filters);
    }
}