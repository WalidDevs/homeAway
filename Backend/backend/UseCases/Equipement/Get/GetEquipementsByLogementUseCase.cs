using backend.DataAdapters;
using backend.Dtos;
namespace backend.UseCases.Equipement
{
    public class GetEquipementsByLogementUseCase
    {
        private readonly IEquipementRepository _equipementRepository;

        public GetEquipementsByLogementUseCase(IEquipementRepository equipementRepository)
        {
            _equipementRepository = equipementRepository;
        }

        public async Task<List<EquipementDto>> ExecuteAsync(int logementId)
        {
            var equipementsObject = await _equipementRepository.GetEquipementsByLogementIdAsync(logementId);
            var equipements = equipementsObject as List<Entities.Equipement>;

            if (equipements == null)
            {
                throw new InvalidCastException("Le résultat de la méthode GetEquipementsByLogementIdAsync n'est pas une liste d'équipements valide.");
            }
            return equipements.Select(e => new EquipementDto
            {
                Id_equipement = e.Id_equipement,
                Nom_equipement = e.Nom_equipement,
                Id_categorie = e.Id_categorie
            }).ToList();
        }
    }
}