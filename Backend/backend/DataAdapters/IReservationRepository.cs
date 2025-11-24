using backend.Entities;

public interface IReservationRepository
{
    Task<Reservation> GetByIdAsync(int id);
    Task<List<Reservation>> GetAllAsync();
    Task<List<Reservation>> GetByUtilisateurIdAsync(int utilisateurId);
    Task CreateAsync(Reservation reservation);
    Task DeleteAsync(int id);
    Task UpdateAsync(Reservation reservation); 
    Task<List<Reservation>> GetReservationsEnAttenteByProprietaireIdAsync(int proprietaireId);
    Task<List<Reservation>> GetByLocataireIdWithStatutAsync(int locataireId, List<string> statuts);
    Task<Reservation> GetByIdPropAsync(int id);

    
    
}