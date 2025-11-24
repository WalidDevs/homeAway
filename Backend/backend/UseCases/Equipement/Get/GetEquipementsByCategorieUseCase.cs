using backend.DataAdapters;
using backend.Dtos;
namespace backend.UseCases.Equipement;

public class GetEquipementsByCategorieUseCase
{
    private readonly IEquipementRepository _equipementRepository;
    public GetEquipementsByCategorieUseCase(IEquipementRepository equipementRepository)
    {
        _equipementRepository = equipementRepository;
    }

    public async Task<List<EquipementDto>> ExecuteAsync(int idCategorie)
    {
        var equipements = await _equipementRepository.GetByCategorieIdAsync(idCategorie);
        return equipements.Select(e => new EquipementDto
        {
            Id_equipement = e.Id_equipement,
            Nom_equipement = e.Nom_equipement,
            Id_categorie = e.Id_categorie
        }).ToList();
    }
}