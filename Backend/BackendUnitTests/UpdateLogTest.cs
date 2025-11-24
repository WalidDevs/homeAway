using backend.UseCases.Logement.Update;
using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;

using Moq;
using Xunit;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Linq;

namespace BackendUnitTests
{
    public class UpdateLogementUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldUpdateLogementCorrectly()
        {
            var logementId = 1;

            var logement = new Logement
            {
                Id_logement = logementId,
                Surface = 40,
                Type_log = "Studio",
                Statut_logement = "En attente",
                Description = "Ancien logement",
                Prix = 600,
                Ville = "Lyon",
                Date_dispo_debut = DateTime.Today,
                Date_dispo_fin = DateTime.Today.AddDays(15),
                Equipements = new List<Equipement>
                {
                    new Equipement { Id_equipement = 1, Nom_equipement = "WiFi" }
                }
            };

            var logementRepoMock = new Mock<ILogementRepository>();
            var equipementRepoMock = new Mock<IEquipementRepository>();

            logementRepoMock.Setup(repo => repo.GetByIdAsync(logementId)).ReturnsAsync(logement);
            logementRepoMock.Setup(repo => repo.UpdateAsync(It.IsAny<Logement>())).Returns(Task.CompletedTask);

            equipementRepoMock.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(new Equipement { Id_equipement = 2, Nom_equipement = "Climatisation" });

            var useCase = new UpdateLogementUseCase(logementRepoMock.Object, equipementRepoMock.Object);

            var justificatifStream = new MemoryStream(new byte[] { 1, 2, 3 });
            var imageStream = new MemoryStream(new byte[] { 4, 5, 6 });

            var updateDto = new UpdateLogementDto
            {
                Surface = 70,
                Type_log = "Appartement",
                Statut_logement = "Disponible",
                Description = "Nouveau logement moderne",
                Prix = 900,
                Ville = "Paris",
                Date_dispo_debut = DateTime.Today.AddDays(1),
                Date_dispo_fin = DateTime.Today.AddDays(30),
                Ids_equipements = new List<int> { 2 },
                Justificatif_domicile = new FormFile(justificatifStream, 0, justificatifStream.Length, "justif", "justif.pdf"),
                Image = new List<IFormFile>
                {
                    new FormFile(imageStream, 0, imageStream.Length, "image", "image.jpg")
                }
            };

            await useCase.ExecuteAsync(logementId, updateDto);

            logementRepoMock.Verify(r => r.UpdateAsync(It.Is<Logement>(l =>
                l.Surface == 70 &&
                l.Type_log == "Appartement" &&
                l.Statut_logement == "Disponible" &&
                l.Description == "Nouveau logement moderne" &&
                l.Prix == 900 &&
                l.Ville == "Paris" &&
                l.Date_dispo_debut == updateDto.Date_dispo_debut &&
                l.Date_dispo_fin == updateDto.Date_dispo_fin &&
                l.Justificatif_domicile.Length > 0 &&
                l.Image.Length > 0 &&
                l.Equipements.Count == 1 &&
                l.Equipements.First().Id_equipement == 2
            )), Times.Once);
        }
    }
}
