using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;

namespace backend.UseCases.Reservation;

public class GetReservationsLocataireEnCoursUseCase
{
    private readonly IRepositoryFactory _factory;

    public GetReservationsLocataireEnCoursUseCase(IRepositoryFactory factory)
    {
        _factory = factory;
    }

    public async Task<List<ReservationEnCoursDto>> ExecuteAsync(int locataireId)
    {
        var repo = _factory.ReservationRepository();
        var statuts = new List<string> { "En attente", "Acceptée" };

        var reservations = await repo.GetByLocataireIdWithStatutAsync(locataireId, statuts);

        return ReservationEnCoursDto.FromModels(reservations);
    }
}