using backend.DataAdapters;
using backend.Entities;
using BackendEFDataProvider.Data;
using Microsoft.EntityFrameworkCore;

namespace UniversiteEFDataProvider.Repositories;

public class ReservationRepository : IReservationRepository
{
    private readonly LocationDbContext _context;

    public ReservationRepository(LocationDbContext context)
    {
        _context = context;
    }
    public async Task<Reservation> GetByIdAsync(int id)
    {
        return await _context.Reservations.FindAsync(id);
    }
    public async Task<List<Reservation>> GetAllAsync()
    {
        return await _context.Reservations.ToListAsync();
    }
    public async Task<List<Reservation>> GetByUtilisateurIdAsync(int utilisateurId)
    {
        return await _context.Reservations
            .Where(r => r.Id_utilisateur == utilisateurId)
            .ToListAsync();
    }
    public async Task CreateAsync(Reservation reservation)
    {
        await _context.Reservations.AddAsync(reservation);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var reservation = await GetByIdAsync(id);
        if (reservation != null)
        {
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
        }
    }
    
    public async Task UpdateAsync(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
        await _context.SaveChangesAsync();
    }
    public async Task<List<Reservation>> GetReservationsEnAttenteByProprietaireIdAsync(int proprietaireId)
    {
        return await _context.Reservations
            .Include(r => r.Logement)
            .Include(r => r.utilisateur)
            .Where(r => r.Statut == "En attente" && r.Logement.Id_utilisateur == proprietaireId)
            .ToListAsync();
    }
    
    public async Task<List<Reservation>> GetByLocataireIdWithStatutAsync(int locataireId, List<string> statuts)
    {
        return await _context.Reservations
            .Include(r => r.Logement)
            .Include(r => r.utilisateur)
            .Where(r => r.Id_utilisateur == locataireId && statuts.Contains(r.Statut))
            .ToListAsync();
    }

    public async Task<Reservation> GetByIdPropAsync(int id)
    {
        return await _context.Reservations.Include(r=>r.utilisateur)
            .Where(r=>r.Id_reservation == id)
            .FirstOrDefaultAsync();

    }



}