using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using backend.UseCases.Get;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace BackendUnitTests
{
    public class ConsulterLogementUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ReturnsLogementDto_WhenLogementExists()
        {
            int logementId = 1;

            var logement = new Logement
            {
                Id_logement = logementId,
                Surface = 45,
                Type_log = "Studio",
                Statut_logement = "Disponible",
                Description = "Petit studio sympa",
                Prix = 600,
                Ville = "Paris",
                Date_dispo_debut = DateTime.Today,
                Date_dispo_fin = DateTime.Today.AddDays(30),
                Id_utilisateur = 100,
                Equipements = new List<Equipement>
                {
                    new Equipement { Id_equipement = 1, Nom_equipement = "WiFi" }
                },
                Image = new byte[] { 1, 2, 3 }
            };

            var logementRepoMock = new Mock<ILogementRepository>();
            logementRepoMock.Setup(r => r.GetByIdAsync(logementId)).ReturnsAsync(logement);

            var useCase = new GetLogementUseCase(logementRepoMock.Object);
            
            var result = await useCase.ExecuteAsync(logementId);
            
            Xunit.Assert.NotNull(result);
            Xunit.Assert.Equal(logementId, result.Id);
            Xunit.Assert.Equal("Studio", result.Type_log);
            Xunit.Assert.Equal("Paris", result.Ville);
            Xunit.Assert.Single(result.Equipements);
        }

        [Fact]
        public async Task ExecuteAsync_ThrowsKeyNotFoundException_WhenLogementNotFound()
        {
            var logementRepoMock = new Mock<ILogementRepository>();
            logementRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Logement)null);

            var useCase = new GetLogementUseCase(logementRepoMock.Object);

            await Xunit.Assert.ThrowsAsync<KeyNotFoundException>(() => useCase.ExecuteAsync(999));
        }
    }
}
