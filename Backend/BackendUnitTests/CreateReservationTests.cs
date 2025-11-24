using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.Entities;
using backend.UseCases.Create;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace BackendUnitTests;

public class CreateReservationTests
{
    private readonly Mock<IRepositoryFactory> _mockFactory;
    private readonly Mock<IReservationRepository> _mockReservationRepo;
    private readonly Mock<ILogementRepository> _mockLogementRepo;
    private readonly CreateReservationUseCase _useCase;

    public CreateReservationTests()
    {
        _mockFactory = new Mock<IRepositoryFactory>();
        _mockReservationRepo = new Mock<IReservationRepository>();
        _mockLogementRepo = new Mock<ILogementRepository>();

        _mockFactory.Setup(f => f.ReservationRepository()).Returns(_mockReservationRepo.Object);
        _mockFactory.Setup(f => f.LogementRepository()).Returns(_mockLogementRepo.Object);

        _useCase = new CreateReservationUseCase(_mockFactory.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldCreateReservation_WhenDatesAreValid()
    {
        var dto = new ReservationDto
        {
            Date_debut = new DateTime(2025, 5, 1),
            Date_fin = new DateTime(2025, 5, 5),
            Type_reservation = "Instantanée",
            Statut = "En attente",
            Nbr_personnes = 2,
            Montant_total = 400,
            Id_logement = 1,
            Id_utilisateur = 10
        };

        var logement = new Logement
        {
            Id_logement = 1,
            Date_dispo_debut = new DateTime(2025, 4, 30),
            Date_dispo_fin = new DateTime(2025, 6, 1)
        };

        _mockLogementRepo.Setup(r => r.GetByIdAsync(dto.Id_logement))
            .ReturnsAsync(logement);

        _mockReservationRepo.Setup(r => r.CreateAsync(It.IsAny<Reservation>()))
            .Returns(Task.CompletedTask);
        await _useCase.ExecuteAsync(dto);

        _mockReservationRepo.Verify(r => r.CreateAsync(It.IsAny<Reservation>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrow_KeyNotFound_WhenLogementNotFound()
    {
        var dto = new ReservationDto
        {
            Id_logement = 99
        };

        _mockLogementRepo.Setup(r => r.GetByIdAsync(dto.Id_logement))
            .ReturnsAsync((Logement)null);

        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(async () =>
            await _useCase.ExecuteAsync(dto));

        Assert.Equal("Logement non trouvé.", ex.Message);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrow_InvalidOperation_WhenDatesAreOutsideRange()
    {
        var dto = new ReservationDto
        {
            Date_debut = new DateTime(2025, 7, 1),
            Date_fin = new DateTime(2025, 7, 10),
            Id_logement = 1
        };

        var logement = new Logement
        {
            Id_logement = 1,
            Date_dispo_debut = new DateTime(2025, 5, 1),
            Date_dispo_fin = new DateTime(2025, 6, 30)
        };

        _mockLogementRepo.Setup(r => r.GetByIdAsync(dto.Id_logement))
            .ReturnsAsync(logement);
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await _useCase.ExecuteAsync(dto));

        Assert.Equal("Les dates de réservation doivent être comprises dans la période de disponibilité du logement.", ex.Message);
    }
}
