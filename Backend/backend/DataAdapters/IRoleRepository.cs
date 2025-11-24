using backend.Entities;

namespace backend.DataAdapters.DataAdaptersFactory;

public interface IRoleRepository
{
    Task<Role> GetByTypeAsync(string typeRole);
    Task AddAsync(Role role);
}