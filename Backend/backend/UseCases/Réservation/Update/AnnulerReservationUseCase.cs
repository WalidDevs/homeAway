using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;

namespace backend.UseCases.Reservation;

public class AnnulerReservationUseCase {
    private readonly IRepositoryFactory _factory;
    private readonly IEmailService _emailService; 


    public AnnulerReservationUseCase(IRepositoryFactory factory, IEmailService emailService)
    {
        _emailService = emailService;
        _factory = factory;
    }

    public async Task ExecuteAsync(int reservationId, int locataireId)
    {
        var reservationRepo = _factory.ReservationRepository();
        var reservation = await reservationRepo.GetByIdPropAsync(reservationId);

        if (reservation == null)
            throw new KeyNotFoundException("Réservation introuvable.");

        if (reservation.Id_utilisateur != locataireId)
            throw new UnauthorizedAccessException("Cette réservation n'appartient pas à ce locataire.");

        var joursAvantDebut = (reservation.Date_debut - DateTime.UtcNow).TotalDays;

        if (joursAvantDebut < 7)
            throw new InvalidOperationException("L'annulation est possible uniquement 7 jours avant la date de début.");
        
        reservation.Statut = "Annulée";
        Console.WriteLine("ana hna");
        Console.WriteLine(reservation.utilisateur);
        await reservationRepo.UpdateAsync(reservation);
        
        
        string subject = "Mise à jour de votre demande";
        string body = " un locataire a annuler une réservation votre logement";
            

        await _emailService.SendEmailAsync(reservation.utilisateur.Email, subject, body);
    }
}