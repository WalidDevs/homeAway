using backend.DataAdapters;
using backend.Exceptions;

namespace backend.UseCases.Réservation.Update;

public class TraiterReservationUseCase
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IEmailService _emailService; 
    private readonly IUtilisateurRepository _utilisateurRepository;

    public TraiterReservationUseCase(IReservationRepository reservationRepository, IEmailService emailService, IUtilisateurRepository utilisateurRepository)
    {
        _emailService = emailService;
        _reservationRepository = reservationRepository;
        _utilisateurRepository = utilisateurRepository;
    }

    public async Task ExecuteAsync(int reservationId, string statut)
    {
        if (reservationId <= 0)
        {
            throw new ArgumentException("ID de réservation invalide");
        }

        if (string.IsNullOrWhiteSpace(statut))
        {
            throw new ArgumentException("Le statut est requis");
        }

        var reservation = await _reservationRepository.GetByIdAsync(reservationId)
                          ?? throw new Exception("Réservation non trouvée");

        statut = statut.ToLower();

        if (statut != "acceptée" && statut != "refusée")
        {
            throw new ReservationException("Statut invalide");
        }

        reservation.Statut = statut;
        await _reservationRepository.UpdateAsync(reservation);

        var locataire = await _utilisateurRepository.GetByIdAsync(reservation.Id_utilisateur)
                        ?? throw new Exception("Utilisateur (locataire) non trouvé");

        string email = locataire.Email;

        string subject = "Mise à jour de votre demande";
        string body = statut == "acceptée"
            ? "Félicitations ! Votre demande a été acceptée."
            : "Nous sommes désolés, votre demande a été refusée.";

        await _emailService.SendEmailAsync(email, subject, body);
    }
}