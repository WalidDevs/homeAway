using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using BackendEFDataProvider.Data;
using Microsoft.EntityFrameworkCore;

namespace UniversiteEFDataProvider.Repositories;

public class LogementRepository : ILogementRepository
{
    private readonly LocationDbContext _context;
    public LogementRepository(LocationDbContext context)
    {
        _context = context;
    }
    public async Task CreateAsync(Logement logement)
    {
        await _context.Logements.AddAsync(logement);
        await _context.SaveChangesAsync();
    }
    public async Task<Logement?> GetByIdAsync(int id)
    {
        return await _context.Logements
            .Include(l => l.Utilisateur)      
            .Include(l => l.Equipements)       
            .FirstOrDefaultAsync(l => l.Id_logement == id);
    }
    public async Task DeleteAsync(int id)
    {
        var logement = await _context.Logements.FindAsync(id);
        if (logement != null)
        {
            _context.Logements.Remove(logement);
            await _context.SaveChangesAsync();
        }
        else
        {
            throw new KeyNotFoundException("Logement non trouvé.");
        }
    }
    public async Task<List<Logement>> GetAllByProprietaireAsync(int proprietaireId)
    {
        return await _context.Logements
            .Where(l => l.Id_utilisateur == proprietaireId)
            .Include(l => l.Equipements)
            .ToListAsync();
    }
    public async Task<List<Logement>> SearchAsync(LogementFilterDto filters)
    {
        var query = _context.Logements.Where(l => l.Statut_logement == "Accepté")
            .AsQueryable();
        if (!string.IsNullOrEmpty(filters.Ville))
            query = query.Where(l => l.Ville.Contains(filters.Ville));

        if (!string.IsNullOrEmpty(filters.Type_log))
            query = query.Where(l => l.Type_log == filters.Type_log);

        if (filters.PrixMin.HasValue)
            query = query.Where(l => l.Prix >= filters.PrixMin);

        if (filters.PrixMax.HasValue)
            query = query.Where(l => l.Prix <= filters.PrixMax);

        if (filters.SurfaceMin.HasValue)
            query = query.Where(l => l.Surface >= filters.SurfaceMin);

        if (filters.SurfaceMax.HasValue)
            query = query.Where(l => l.Surface <= filters.SurfaceMax);

        if (filters.DateDebut.HasValue)
            query = query.Where(l => l.Date_dispo_debut <= filters.DateDebut);

        if (filters.DateFin.HasValue)
            query = query.Where(l => l.Date_dispo_fin >= filters.DateFin);

        if (filters.IdsEquipements != null && filters.IdsEquipements.Any())
        {
            query = query.Where(l => l.Equipements.Any(e => filters.IdsEquipements.Contains(e.Id_equipement)));
        }
        
        if (!string.IsNullOrEmpty(filters.MotCle))
        {
            query = query.Where(l => l.Description.ToLower().Contains(filters.MotCle.ToLower()));
        }
        

        return await query.ToListAsync();
    }
public async Task<List<Logement>> GetLogementsEnAttenteAsync()
    {
        return await _context.Logements
            .Where(l => l.Statut_logement == "En attente")
            .Include(l => l.Utilisateur)
            .ToListAsync();
    }
   
    public async Task UpdateAsync(Logement logement)
    {
        _context.Logements.Update(logement);
        await _context.SaveChangesAsync();
    }


}    