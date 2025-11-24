using backend.Entities;

public interface IEquipementRepository
{
    Task<List<Equipement>> GetEquipementsByLogementIdAsync(int logementId);
    Task<List<Equipement>> GetEquipementsByIdsAsync(List<int> ids);

    Task<List<Equipement>> GetByCategorieIdAsync(int categorieId);
    Task<Equipement> GetByIdAsync(int idEquipement);
    Task AddAsync(Equipement equipement);

}