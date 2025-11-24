using backend.Entities;

namespace backend.DataAdapters.DataAdaptersFactory;

public interface ICategorieRepository
{
    Task<List<Categorie>> GetAllAsync();
    Task<Categorie> GetByIdAsync(int id);
    Task AddAsync(Categorie categorie);

}
