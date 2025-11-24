using Moq;
using backend.DataAdapters;
using backend.Entities;
using backend.Dtos;
using backend.UseCases.Create;
using Xunit;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using Assert = Xunit.Assert;

namespace BackendUnitTests
{
    public class LogementTests
    {
        private readonly Mock<ILogementRepository> _mockLogementRepo;
        private readonly Mock<IUtilisateurRepository> _mockUtilisateurRepo;
        private readonly Mock<IEquipementRepository> _mockEquipementRepo;
        private readonly CreateLogementUseCase _createLogementUseCase;

        public LogementTests()
        {
            _mockLogementRepo = new Mock<ILogementRepository>();
            _mockUtilisateurRepo = new Mock<IUtilisateurRepository>();
            _mockEquipementRepo = new Mock<IEquipementRepository>();
            _createLogementUseCase = new CreateLogementUseCase(_mockLogementRepo.Object, _mockUtilisateurRepo.Object, _mockEquipementRepo.Object);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldCreateLogement_WhenDataIsValid()
        {
            var fileContent = "FichierTest";
            var justificatifMock = new Mock<IFormFile>();
            var justificatifStream = new MemoryStream(Encoding.UTF8.GetBytes(fileContent));
            justificatifMock.Setup(f => f.OpenReadStream()).Returns(justificatifStream);
            justificatifMock.Setup(f => f.FileName).Returns("justificatif.pdf");
            justificatifMock.Setup(f => f.Length).Returns(justificatifStream.Length);
            justificatifMock.Setup(f => f.ContentType).Returns("application/pdf");

            var imageMock = new Mock<IFormFile>();
            var imageStream = new MemoryStream(Encoding.UTF8.GetBytes(fileContent));
            imageMock.Setup(f => f.OpenReadStream()).Returns(imageStream);
            imageMock.Setup(f => f.FileName).Returns("image.jpg");
            imageMock.Setup(f => f.Length).Returns(imageStream.Length);
            imageMock.Setup(f => f.ContentType).Returns("image/jpeg");

            var logementDto = new LogementDto
            {
                Surface = 100,
                Type_log = "Maison",
                Statut_logement = "En cours",
                Description = "Belle maison avec jardin",
                Prix = 1500,
                Ville = "Paris",
                Justificatif_domicile = justificatifMock.Object,
                Image = new List<IFormFile> { imageMock.Object },
                Date_dispo_debut = DateTime.Now,
                Date_dispo_fin = DateTime.Now.AddDays(5),
                Id_utilisateur = 1,
                Ids_equipements = new List<int> { 1, 2 }
            };

            var utilisateur = new Utilisateur
            {
                Id_utilisateur = 1,
                Nom = "Dupont",
                Prenom = "Jean"
            };

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(utilisateur.Id_utilisateur))
                .ReturnsAsync(utilisateur);
            _mockLogementRepo.Setup(repo => repo.CreateAsync(It.IsAny<Logement>()))
                .Returns(Task.CompletedTask);
            await _createLogementUseCase.ExecuteAsync(logementDto);
            _mockLogementRepo.Verify(repo => repo.CreateAsync(It.IsAny<Logement>()), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldThrowException_WhenUserNotFound()
        {
            var fileContent = "FichierTest";
            var justificatifMock = new Mock<IFormFile>();
            var justificatifStream = new MemoryStream(Encoding.UTF8.GetBytes(fileContent));
            justificatifMock.Setup(f => f.OpenReadStream()).Returns(justificatifStream);

            var imageMock = new Mock<IFormFile>();
            var imageStream = new MemoryStream(Encoding.UTF8.GetBytes(fileContent));
            imageMock.Setup(f => f.OpenReadStream()).Returns(imageStream);

            var logementDto = new LogementDto
            {
                Surface = 80,
                Type_log = "Appartement",
                Statut_logement = "Disponible",
                Description = "Appartement en centre-ville",
                Prix = 1200,
                Ville = "Lille",
                Justificatif_domicile = justificatifMock.Object,
                Image = new List<IFormFile> { imageMock.Object },
                Date_dispo_debut = DateTime.Now,
                Date_dispo_fin = DateTime.Now.AddDays(10),
                Id_utilisateur = 99,
                Ids_equipements = new List<int> { 1 }
            };

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(99))
                .ReturnsAsync((Utilisateur)null);

            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                _createLogementUseCase.ExecuteAsync(logementDto));

            Assert.Equal("Utilisateur non trouvé.", exception.Message);
        }
    }
}