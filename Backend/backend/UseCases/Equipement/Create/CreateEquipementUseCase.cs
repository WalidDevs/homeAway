using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.Entities;
namespace backend.UseCases.Equipement;
public class CreateEquipementUseCase
{
    private readonly IEquipementRepository _equipementRepository;
    private readonly ICategorieRepository _categorieRepository;

    public CreateEquipementUseCase(
        IEquipementRepository equipementRepository,
        ICategorieRepository categorieRepository)
    {
        _equipementRepository = equipementRepository;
        _categorieRepository = categorieRepository;
    }

    public async Task ExecuteAsync(EquipementDto dto)
    {
        var categorie = await _categorieRepository.GetByIdAsync(dto.Id_categorie);

        if (categorie == null)
            throw new Exception("Catégorie introuvable");

        var equipement = new Entities.Equipement
        {
            Nom_equipement = dto.Nom_equipement,
            Id_categorie = dto.Id_categorie,
            Categorie = categorie
        };

        await _equipementRepository.AddAsync(equipement);
    }
}