using Moq;
using backend.DataAdapters;
using backend.Entities;
using backend.Dtos;
using backend.UseCases.Create;
using Xunit;
using Assert = Xunit.Assert;
namespace BackendUnitTests
{
    public class DemandeUseCaseTests
    {
        private readonly Mock<IDemandeRepository> _mockDemandeRepo;
        private readonly Mock<IUtilisateurRepository> _mockUtilisateurRepo;
        private readonly CreateDemandeUseCase _createUseCase;
        private readonly GetDemandeByIdUseCase _getByIdUseCase;
        private readonly DeleteDemandeUseCase _deleteUseCase;

        public DemandeUseCaseTests()
        {
            _mockDemandeRepo = new Mock<IDemandeRepository>();
            _mockUtilisateurRepo = new Mock<IUtilisateurRepository>();

            _createUseCase = new CreateDemandeUseCase(_mockDemandeRepo.Object, _mockUtilisateurRepo.Object);
            _getByIdUseCase = new GetDemandeByIdUseCase(_mockDemandeRepo.Object);
            _deleteUseCase = new DeleteDemandeUseCase(_mockDemandeRepo.Object);
        }
        
        [Fact]
        public async Task CreateDemande_ShouldCreateDemande_WhenUserExists()
        {
            var utilisateur = new Utilisateur { Id_utilisateur = 1 };
            var demandeDto = new DemandeDto
            {
                Id_utilisateur = 1,
                Email_demande = "test@example.com",
                Motif_demande = "Besoin d'assistance"
            };

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(demandeDto.Id_utilisateur))
                .ReturnsAsync(utilisateur);

            _mockDemandeRepo.Setup(repo => repo.CreateAsync(It.IsAny<Demande>()))
                .Returns(Task.CompletedTask);

            await _createUseCase.ExecuteAsync(demandeDto);

            _mockDemandeRepo.Verify(repo => repo.CreateAsync(It.IsAny<Demande>()), Times.Once);
        }
        
        [Fact]
        public async Task CreateDemande_ShouldThrowException_WhenUserNotFound()
        {
            var demandeDto = new DemandeDto { Id_utilisateur = 1 };

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(demandeDto.Id_utilisateur))
                .ReturnsAsync((Utilisateur)null);

            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _createUseCase.ExecuteAsync(demandeDto));
            Assert.Equal("Utilisateur non trouvé", exception.Message);
        }
        
        [Fact]
        public async Task GetDemandeById_ShouldReturnDemande_WhenDemandeExists()
        {
            var demande = new Demande
            {
                Id_demande = 1,
                Email_demande = "test@example.com",
                Motif_demande = "Demande de support",
                Statut_demande = "En attente",
                Id_utilisateur = 1
            };

            _mockDemandeRepo.Setup(repo => repo.GetByIdAsync(demande.Id_demande))
                .ReturnsAsync(demande);

            var result = await _getByIdUseCase.ExecuteAsync(demande.Id_demande);

            Assert.NotNull(result);
            Assert.Equal(demande.Email_demande, result.Email_demande);
        }
        
        [Fact]
        public async Task GetDemandeById_ShouldThrowException_WhenDemandeNotFound()
        {
            int id = 1;

            _mockDemandeRepo.Setup(repo => repo.GetByIdAsync(id))
                .ReturnsAsync((Demande)null);

            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _getByIdUseCase.ExecuteAsync(id));
            Assert.Equal("Demande non trouvée", exception.Message);
        }
        
        [Fact]
        public async Task DeleteDemande_ShouldDeleteDemande_WhenDemandeExists()
        {
            int id = 1;
            var demande = new Demande { Id_demande = id };

            _mockDemandeRepo.Setup(repo => repo.GetByIdAsync(id))
                .ReturnsAsync(demande);

            _mockDemandeRepo.Setup(repo => repo.DeleteAsync(id))
                .Returns(Task.CompletedTask);

            await _deleteUseCase.ExecuteAsync(id);

            _mockDemandeRepo.Verify(repo => repo.DeleteAsync(id), Times.Once);
        }
        
        [Fact]
        public async Task DeleteDemande_ShouldThrowException_WhenDemandeNotFound()
        {
            int id = 1;

            _mockDemandeRepo.Setup(repo => repo.GetByIdAsync(id))
                .ReturnsAsync((Demande)null);

            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _deleteUseCase.ExecuteAsync(id));
            Assert.Equal("Demande non trouvée", exception.Message);
        }
    }
}
