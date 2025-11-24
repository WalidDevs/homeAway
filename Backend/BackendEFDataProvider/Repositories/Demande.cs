using backend.DataAdapters;
using backend.Entities;
using BackendEFDataProvider.Data;
using Microsoft.EntityFrameworkCore;

namespace UniversiteEFDataProvider.Repositories;

public class DemandeRepository : IDemandeRepository
{
    private readonly LocationDbContext _context;
    public DemandeRepository(LocationDbContext context)
    {
        _context = context;
    }
    public async Task CreateAsync(Demande demande)
    {
        await _context.Demandes.AddAsync(demande);
        await _context.SaveChangesAsync();
    }
    public async Task<List<Demande>> GetAllAsync()
    {
        return await _context.Demandes.Include(d => d.Utilisateur).ToListAsync();
    }
    public async Task<Demande> GetByIdAsync(int id)
    {
        return await _context.Demandes.Include(d => d.Utilisateur).FirstOrDefaultAsync(d => d.Id_demande == id);
    }
    public async Task UpdateAsync(Demande demande)
    {
        _context.Demandes.Update(demande);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(int id)
    {
        var demande = await GetByIdAsync(id);
        if (demande != null)
        {
            _context.Demandes.Remove(demande);
            await _context.SaveChangesAsync();
        }
    }
}