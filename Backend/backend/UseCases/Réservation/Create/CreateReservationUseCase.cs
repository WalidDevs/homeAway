using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.Entities;
namespace backend.UseCases.Create;

public class CreateReservationUseCase
{
    private readonly IRepositoryFactory _repositoryFactory;

    public CreateReservationUseCase(IRepositoryFactory repositoryFactory)
    {
        _repositoryFactory = repositoryFactory;
    }

    public async Task ExecuteAsync(ReservationDto dto)
    {
        var logement = await _repositoryFactory.LogementRepository().GetByIdAsync(dto.Id_logement);
        if (logement == null)
            throw new KeyNotFoundException("Logement non trouvé.");
        if (dto.Date_debut < logement.Date_dispo_debut || dto.Date_fin > logement.Date_dispo_fin)
        {
            throw new InvalidOperationException(
                "Les dates de réservation doivent être comprises dans la période de disponibilité du logement.");
        }
        var reservation = new Entities.Reservation
        {
            Date_debut = dto.Date_debut,
            Date_fin = dto.Date_fin,
            Type_reservation = dto.Type_reservation,
            Statut = dto.Statut,
            Nbr_personnes = dto.Nbr_personnes,
            Montant_total = dto.Montant_total,
            Id_logement = dto.Id_logement,
            Id_utilisateur = dto.Id_utilisateur
        };

        await _repositoryFactory.ReservationRepository().CreateAsync(reservation);
    }
}