using backend.Entities;

namespace backend.DataAdapters;

public interface IDemandeRepository
{
    Task CreateAsync(Demande demande);
    Task<List<Demande>> GetAllAsync();
    Task<Demande> GetByIdAsync(int id);
    Task UpdateAsync(Demande demande);
    Task DeleteAsync(int id);
}