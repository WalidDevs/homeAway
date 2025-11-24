using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;
using BackendEFDataProvider.Data;
using Microsoft.EntityFrameworkCore;

namespace UniversiteEFDataProvider.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly LocationDbContext _context;
    public RoleRepository(LocationDbContext context)
    {
        _context = context;
    }
    public async Task<Role> GetByTypeAsync(string typeRole)
    {
        return await _context.Roles.FirstOrDefaultAsync(r => r.Type_role == typeRole);
    }

    public async Task AddAsync(Role role)
    {
        await _context.Roles.AddAsync(role);
        await _context.SaveChangesAsync();
    }
}