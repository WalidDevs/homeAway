using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;

namespace backend.UseCases.Get;

public class GetUtilisateurByIdUseCase
{
    private readonly IUtilisateurRepository _repository;

    public GetUtilisateurByIdUseCase(IRepositoryFactory repositoryFactory)
    {
        _repository = repositoryFactory.UtilisateurRepository();
    }

    public async Task<Utilisateur?> ExecuteAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }
}