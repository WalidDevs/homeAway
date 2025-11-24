using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;
using backend.UseCases.Reservation;
using Moq;
using Xunit;
using Assert = NUnit.Framework.Assert;

public class AnnulerReservationTests
{
    private readonly Mock<IReservationRepository> _mockRepo;
    private readonly Mock<IRepositoryFactory> _mockFactory;
    private readonly Mock<IEmailService> _mockEmailService;
    private readonly AnnulerReservationUseCase _useCase;

    public AnnulerReservationTests()
    {
        _mockRepo = new Mock<IReservationRepository>();
        _mockFactory = new Mock<IRepositoryFactory>();
        _mockEmailService = new Mock<IEmailService>();

        _mockFactory.Setup(f => f.ReservationRepository()).Returns(_mockRepo.Object);

        _useCase = new AnnulerReservationUseCase(_mockFactory.Object, _mockEmailService.Object);
    }

    [Fact]
    public async Task Annuler_ShouldWork_IfMoreThan7DaysBefore()
    {
        var utilisateur = new Utilisateur
        {
            Id_utilisateur = 10,
            Email = "locataire@example.com"
        };

        var reservation = new Reservation
        {
            Id_reservation = 1,
            Id_utilisateur = 5,
            Date_debut = DateTime.UtcNow.AddDays(10),
            Statut = "En attente",
            utilisateur = utilisateur
        };

        _mockRepo.Setup(r => r.GetByIdPropAsync(1)).ReturnsAsync(reservation);

        await _useCase.ExecuteAsync(1, 5);

        Assert.AreEqual("Annulée", reservation.Statut);
        _mockRepo.Verify(r => r.UpdateAsync(reservation), Times.Once);
        
    }
}
