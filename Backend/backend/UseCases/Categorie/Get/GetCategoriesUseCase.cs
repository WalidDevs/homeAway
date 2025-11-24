using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;

namespace backend.UseCases.Categorie;

public class GetCategoriesUseCase
{
    private readonly ICategorieRepository _categorieRepository;

    public GetCategoriesUseCase(ICategorieRepository categorieRepository)
    {
        _categorieRepository = categorieRepository;
    }

    public async Task<List<CategorieDto>> ExecuteAsync()
    {
        var categories = await _categorieRepository.GetAllAsync();
        return categories.Select(c => new CategorieDto
        {
            Id_categorie = c.Id_categorie,
            Nom_categorie = c.Nom_categorie
        }).ToList();
    }
}