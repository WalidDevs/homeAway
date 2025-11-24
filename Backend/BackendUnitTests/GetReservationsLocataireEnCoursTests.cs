using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.Entities;
using backend.UseCases.Reservation;
using backend.UseCases.Reservation.Get;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace BackendUnitTests;

public class GetReservationsLocataireEnCoursTests
{
    private readonly Mock<IRepositoryFactory> _mockFactory;
    private readonly Mock<IReservationRepository> _mockReservationRepo;
    private readonly GetReservationsLocataireEnCoursUseCase _useCase;

    public GetReservationsLocataireEnCoursTests()
    {
        _mockFactory = new Mock<IRepositoryFactory>();
        _mockReservationRepo = new Mock<IReservationRepository>();
        _mockFactory.Setup(f => f.ReservationRepository()).Returns(_mockReservationRepo.Object);
        _useCase = new GetReservationsLocataireEnCoursUseCase(_mockFactory.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ReturnsReservationsWithStatutsEnAttenteOrConfirmee()
    {
        int locataireId = 5;
        var reservations = new List<Reservation>
        {
            new Reservation
            {
                Id_reservation = 1,
                Date_debut = DateTime.Now.AddDays(10),
                Date_fin = DateTime.Now.AddDays(15),
                Statut = "En attente",
                utilisateur = new Utilisateur { Nom = "Doe", Prenom = "John", Email = "john@exemple.com" },
                Logement = new Logement { Description = "Appart cosy", Ville = "Lyon" }
            },
            new Reservation
            {
                Id_reservation = 2,
                Date_debut = DateTime.Now.AddDays(20),
                Date_fin = DateTime.Now.AddDays(25),
                Statut = "Confirmée",
                utilisateur = new Utilisateur { Nom = "Doe", Prenom = "John", Email = "john@exemple.com" },
                Logement = new Logement { Description = "Studio Paris", Ville = "Paris" }
            }
        };
        _mockReservationRepo.Setup(r => r.GetByLocataireIdWithStatutAsync(locataireId, It.IsAny<List<string>>()))
            .ReturnsAsync(reservations);
        var result = await _useCase.ExecuteAsync(locataireId);
        Assert.Equal(2, result.Count);
        Assert.All(result, dto => Assert.Contains(dto.Statut, new[] { "En attente", "Confirmée" }));
    }
}
