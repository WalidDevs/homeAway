using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.Entities;

namespace backend.UseCases.Categorie;

public class CreateCategorieUseCase
{
    private readonly ICategorieRepository _categorieRepository;

    public CreateCategorieUseCase(ICategorieRepository categorieRepository)
    {
        _categorieRepository = categorieRepository;
    }

    public async Task ExecuteAsync(CategorieDto dto)
    {
        var categorie = new Entities.Categorie
        {
            Nom_categorie = dto.Nom_categorie
        };

        await _categorieRepository.AddAsync(categorie);
    }
}