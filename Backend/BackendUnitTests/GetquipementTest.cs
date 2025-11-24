using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using backend.UseCases.Equipement;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace BackendUnitTests
{
    public class GetEquipementsByLogementUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ReturnsListOfEquipementDto_WhenLogementHasEquipements()
        {
            int logementId = 1;

            var equipements = new List<Equipement>
            {
                new Equipement { Id_equipement = 1, Nom_equipement = "WiFi", Id_categorie = 10 },
                new Equipement { Id_equipement = 2, Nom_equipement = "Télévision", Id_categorie = 10 }
            };

            var equipementRepoMock = new Mock<IEquipementRepository>();
            equipementRepoMock
                .Setup(repo => repo.GetEquipementsByLogementIdAsync(logementId))
                .ReturnsAsync(equipements);

            var useCase = new GetEquipementsByLogementUseCase(equipementRepoMock.Object);

            var result = await useCase.ExecuteAsync(logementId);
            Xunit.Assert.NotNull(result);
            Xunit.Assert.Equal(2, result.Count);
            Xunit.Assert.Contains(result, e => e.Nom_equipement == "WiFi" && e.Id_categorie == 10);
            Xunit.Assert.Contains(result, e => e.Nom_equipement == "Télévision" && e.Id_categorie == 10);

            equipementRepoMock.Verify(repo => repo.GetEquipementsByLogementIdAsync(logementId), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ThrowsException_WhenResultIsNotAList()
        {
            var equipementRepoMock = new Mock<IEquipementRepository>();
            equipementRepoMock
                .Setup(repo => repo.GetEquipementsByLogementIdAsync(It.IsAny<int>()))
                .ReturnsAsync(null as List<Equipement>); 

            var useCase = new GetEquipementsByLogementUseCase(equipementRepoMock.Object);

            await Xunit.Assert.ThrowsAsync<System.InvalidCastException>(() =>
                useCase.ExecuteAsync(1));
        }
    }
}
