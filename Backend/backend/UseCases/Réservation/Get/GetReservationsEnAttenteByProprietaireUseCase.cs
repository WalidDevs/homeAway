using backend.DataAdapters.DataAdaptersFactory;

namespace backend.UseCases.Reservation.Get;

public class GetReservationsEnAttenteByProprietaireUseCase
{
    private readonly IRepositoryFactory _repositoryFactory;

    public GetReservationsEnAttenteByProprietaireUseCase(IRepositoryFactory repository)
    {
        _repositoryFactory = repository;
    }

    public async Task<List<Entities.Reservation>> ExecuteAsync(int proprietaireId)
    {
        return await _repositoryFactory.ReservationRepository().GetReservationsEnAttenteByProprietaireIdAsync(proprietaireId);
    }
}