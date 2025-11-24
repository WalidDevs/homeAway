using backend.Entities;

namespace backend.DataAdapters;

public interface IUtilisateurRepository
{
    Task<Utilisateur> GetByEmailAsync(string email);
    Task CreateAsync(Utilisateur utilisateur);
    Task<Utilisateur> GetByIdAsync(int Id_utilisateur);
    Task DeleteAsync(int Id_utilisateur);
    Task<List<Utilisateur>> GetAllAsync();
    Task AddAsync(Utilisateur utilisateur);
    Task UpdateAsync(Utilisateur utilisateur);
    Task UpdateAsyncDemandeUserRole (Utilisateur utilisateur);
    Task<Utilisateur?> GetByIdWithRolesAsync(int id);

}