using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;
using backend.UseCases.Update;
using Moq;
using Xunit;
using Assert = Xunit.Assert;

namespace BackendUnitTests
{
    public class TraiterDemandeTests
    {
        private readonly Mock<IDemandeRepository> _mockDemandeRepo;
        private readonly Mock<IUtilisateurRepository> _mockUtilisateurRepo;
        private readonly Mock<IRoleRepository> _mockRoleRepo;
        private readonly TraiterDemandeUseCase _useCase;
        private readonly Mock<IEmailService> _mockEmailService;


        public TraiterDemandeTests()
        {
            _mockDemandeRepo = new Mock<IDemandeRepository>();
            _mockUtilisateurRepo = new Mock<IUtilisateurRepository>();
            _mockRoleRepo = new Mock<IRoleRepository>();
            _mockEmailService = new Mock<IEmailService>();


            _useCase = new TraiterDemandeUseCase(
                _mockDemandeRepo.Object,
                _mockUtilisateurRepo.Object,
                _mockRoleRepo.Object,
                _mockEmailService.Object
            );
        }

        [Fact]
        public async Task ExecuteAsync_ShouldValidateDemandeAndChangeRole_WhenStatusIsValidee()
        {
            var demandeId = 1;
            var userId = 2;

            var demande = new Demande
            {
                Id_demande = demandeId,
                Id_utilisateur = userId,
                Statut_demande = "En attente"
            };

            var utilisateur = new Utilisateur
            {
                Id_utilisateur = userId,
                Roles = new List<Role>()
            };

            var roleProprietaire = new Role
            {
                Id_role = 2,
                Type_role = "Propriétaire"
            };

            _mockDemandeRepo.Setup(r => r.GetByIdAsync(demandeId))
                .ReturnsAsync(demande);

            _mockUtilisateurRepo.Setup(r => r.GetByIdWithRolesAsync(userId))
                .ReturnsAsync(utilisateur);

            _mockRoleRepo.Setup(r => r.GetByTypeAsync("Propriétaire"))
                .ReturnsAsync(roleProprietaire);

            _mockUtilisateurRepo.Setup(r => r.UpdateAsyncDemandeUserRole(It.IsAny<Utilisateur>()))
                .Returns(Task.CompletedTask);

            _mockDemandeRepo.Setup(r => r.UpdateAsync(It.IsAny<Demande>()))
                .Returns(Task.CompletedTask);
            await _useCase.ExecuteAsync(demandeId, "Acceptée");
            
            Assert.Contains(utilisateur.Roles, r => r.Id_role == 2 && r.Type_role == "Propriétaire");
            Assert.Equal("Acceptée", demande.Statut_demande);

            _mockUtilisateurRepo.Verify(r => r.UpdateAsyncDemandeUserRole(utilisateur), Times.Once);
            _mockDemandeRepo.Verify(r => r.UpdateAsync(demande), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldRefuseDemandeWithoutChangingRole_WhenStatusIsRefusee()
        {
            var demandeId = 1;
            var userId = 2;

            var demande = new Demande
            {
                Id_demande = demandeId,
                Id_utilisateur = userId,
                Statut_demande = "En attente"
            };

            var utilisateur = new Utilisateur
            {
                Id_utilisateur = userId,
                Roles = new List<Role> { new Role { Id_role = 1, Type_role = "Locataire" } }
            };

            _mockDemandeRepo.Setup(r => r.GetByIdAsync(demandeId))
                .ReturnsAsync(demande);

            _mockUtilisateurRepo.Setup(r => r.GetByIdWithRolesAsync(userId))
                .ReturnsAsync(utilisateur);

            _mockDemandeRepo.Setup(r => r.UpdateAsync(It.IsAny<Demande>()))
                .Returns(Task.CompletedTask);

            await _useCase.ExecuteAsync(demandeId, "Refusée");
            Assert.Equal("Refusée", demande.Statut_demande);
            Assert.Single(utilisateur.Roles); 

            _mockUtilisateurRepo.Verify(r => r.UpdateAsync(It.IsAny<Utilisateur>()), Times.Never);
            _mockDemandeRepo.Verify(r => r.UpdateAsync(demande), Times.Once);
        }
    }
}