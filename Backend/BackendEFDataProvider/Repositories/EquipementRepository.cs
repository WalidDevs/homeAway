using backend.DataAdapters;
using backend.Entities;
using BackendEFDataProvider.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


public class EquipementRepository : IEquipementRepository
{
    private readonly LocationDbContext _context;
    public EquipementRepository(LocationDbContext context)
    {
        _context = context;
    }
    public async Task<List<Equipement>> GetEquipementsByLogementIdAsync(int logementId)
    {
        var equipements = await _context.Equipements
            .Where(e => e.Logements.Any(l => l.Id_logement == logementId)) 
            .Include(e => e.Categorie) 
            .ToListAsync(); 

        return equipements;  
    }
    public async Task<List<Equipement>> GetEquipementsByIdsAsync(List<int> ids)
    {
        return await _context.Equipements
            .Include(e => e.Categorie) 
            .Where(e => ids.Contains(e.Id_equipement))
            .ToListAsync();
    }
    public async Task<List<Equipement>> GetByCategorieIdAsync(int idCategorie)
    {
        return await _context.Equipements
            .Where(e => e.Id_categorie == idCategorie)
            .ToListAsync();
    }
    public async Task<Equipement> GetByIdAsync(int id)
    {
        var equipement = await _context.Equipements
            .Include(e => e.Categorie)  
            .FirstOrDefaultAsync(e => e.Id_equipement == id);

        if (equipement == null)
        {
            throw new KeyNotFoundException($"Equipement avec l'ID {id} non trouvé.");
        }

        return equipement;  
    }
    public async Task AddAsync(Equipement equipement)
    {
        await _context.Equipements.AddAsync(equipement);
        await _context.SaveChangesAsync();
    }

}
