

using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;
using BackendEFDataProvider.Data;
using Microsoft.EntityFrameworkCore;


namespace UniversiteEFDataProvider.Repositories;

public class CategorieRepository : ICategorieRepository
{
    private readonly LocationDbContext _context;

    public CategorieRepository(LocationDbContext context)
    {
        _context = context;
    }
    public async Task<List<Categorie>> GetAllAsync()
    {
        return await _context.Categories
            .Include(c => c.Equipements)
            .ToListAsync();
    }
    public async Task<Categorie> GetByIdAsync(int id)
    {
        return await _context.Categories.Include(c => c.Equipements)
            .FirstOrDefaultAsync(c => c.Id_categorie == id);
    }
    public async Task AddAsync(Categorie categorie)
    {
        await _context.Categories.AddAsync(categorie);
        await _context.SaveChangesAsync();
    }

}
