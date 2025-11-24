using backend.DataAdapters;
using backend.Entities;
using BackendEFDataProvider.Data;
using Microsoft.EntityFrameworkCore;

namespace UniversiteEFDataProvider.Repositories;

public class UtilisateurRepository : IUtilisateurRepository
{
    private readonly LocationDbContext _context;

    public UtilisateurRepository(LocationDbContext context)
    {
        _context = context;
    }

    public async Task<Utilisateur> GetByEmailAsync(string email)
    {
        return await _context.Utilisateurs
            .Include(u => u.Roles) 
            .FirstOrDefaultAsync(u => u.Email == email);
    }
    
    public async Task<List<Utilisateur>> GetAllAsync()
    {
        return await _context.Utilisateurs.ToListAsync(); 
    }

    public async Task CreateAsync(Utilisateur utilisateur)
    {
        await _context.Utilisateurs.AddAsync(utilisateur);
        await _context.SaveChangesAsync();
    }
    
    public async Task<Utilisateur> GetByIdAsync(int Id_utilisateur)
    {
        return await _context.Utilisateurs.FindAsync(Id_utilisateur);
    }

    public async Task DeleteAsync(int Id_utilisateur)
    {
        var utilisateur = await GetByIdAsync(Id_utilisateur);
        if (utilisateur != null)
        {
            _context.Utilisateurs.Remove(utilisateur);
            await _context.SaveChangesAsync();
        }
    }
    
    public async Task AddAsync(Utilisateur utilisateur)
    {
        await _context.Utilisateurs.AddAsync(utilisateur);
        await _context.SaveChangesAsync();
    }
    
    public async Task UpdateAsync(Utilisateur utilisateur)
    {
        _context.Utilisateurs.Update(utilisateur);
        await _context.SaveChangesAsync();
    }
    
    public async Task UpdateAsyncDemandeUserRole(Utilisateur utilisateur)
    {
        var existingUser = await _context.Utilisateurs
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id_utilisateur == utilisateur.Id_utilisateur);

        var role = _context.Roles.First(u => u.Id_role == 2);

        if (existingUser == null)
            throw new Exception("Utilisateur non trouvé");
        
        if(role==null)
            throw new Exception("role non trouvé");
        
        existingUser.Roles.Add(role);

        _context.Utilisateurs.Update(existingUser);
        await _context.SaveChangesAsync();
    }
    
    public async Task<Utilisateur?> GetByIdWithRolesAsync(int id)
    {
        return await _context.Utilisateurs
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id_utilisateur == id);
    }

}