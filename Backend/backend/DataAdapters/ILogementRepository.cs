using backend.Dtos;
using backend.Entities;

namespace backend.DataAdapters;

public interface ILogementRepository
{
    Task CreateAsync(Logement logement);
    
    Task<Logement> GetByIdAsync(int id);
    
    Task DeleteAsync(int id);
    Task<List<Logement>> GetAllByProprietaireAsync(int proprietaireId);

    Task<List<Logement>> GetLogementsEnAttenteAsync();
    Task UpdateAsync(Logement logement);

    Task<List<Logement>> SearchAsync(LogementFilterDto filters);

}