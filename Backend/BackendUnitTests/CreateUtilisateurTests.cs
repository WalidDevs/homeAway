using Moq;
using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;
using backend.Dtos;
using backend.UseCases.Create;
using backend.UseCases.Update;
using Xunit;
using Assert = Xunit.Assert;
namespace BackendUnitTests
{
    public class CreateUtilisateurTests
    {
        private readonly Mock<IUtilisateurRepository> _mockUtilisateurRepo;
        private readonly Mock<IRoleRepository> _mockRoleRepo;
        private readonly CreateUtilisateurUseCase _createUseCase;
        private readonly UpdateUtilisateurUseCase _updateUseCase;
        private readonly DeleteUtilisateurUseCase _deleteUseCase;

        public CreateUtilisateurTests()
        {
            _mockUtilisateurRepo = new Mock<IUtilisateurRepository>();
            _mockRoleRepo = new Mock<IRoleRepository>();
            _createUseCase = new CreateUtilisateurUseCase(_mockUtilisateurRepo.Object, _mockRoleRepo.Object);
            _updateUseCase = new UpdateUtilisateurUseCase(_mockUtilisateurRepo.Object);
            _deleteUseCase = new DeleteUtilisateurUseCase(_mockUtilisateurRepo.Object);
        }
        
        [Fact]
        public async Task ExecuteAsync_ShouldCreateUtilisateur_WhenDataIsValid()
        {
            var userDto = new UserDto
            {
                Nom = "Doe",
                Prenom = "John",
                Email = "johndoe@example.com",
                Mot_de_passe = "Password123!",
                Ville = "Paris",
                Sexe = "Homme",
                Num_phone = "0601020304"
            };

            _mockUtilisateurRepo.Setup(repo => repo.GetByEmailAsync(userDto.Email))
                .ReturnsAsync((Utilisateur)null);

            _mockUtilisateurRepo.Setup(repo => repo.CreateAsync(It.IsAny<Utilisateur>()))
                .Returns(Task.CompletedTask);

            await _createUseCase.ExecuteAsync(userDto);

            _mockUtilisateurRepo.Verify(repo => repo.CreateAsync(It.IsAny<Utilisateur>()), Times.Once);
        }
        
        [Fact]
        public async Task ExecuteAsync_ShouldThrowException_WhenEmailAlreadyExists()
        {
            var userDto = new UserDto
            {
                Email = "johndoe@example.com"
            };

            var existingUser = new Utilisateur { Email = "johndoe@example.com" };

            _mockUtilisateurRepo.Setup(repo => repo.GetByEmailAsync(userDto.Email))
                .ReturnsAsync(existingUser);

            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _createUseCase.ExecuteAsync(userDto));
            Assert.Equal("Cet email est déjà utilisé !", exception.Message);
        }
        
        [Fact]
        public async Task ExecuteAsync_ShouldUpdateUtilisateur_WhenDataIsValid()
        {
            var userId = 1;
            var userDto = new UserDto
            {
                Nom = "UpdatedDoe",
                Prenom = "UpdatedJohn",
                Email = "updatedjohn@example.com",
                Mot_de_passe = "NewPassword123!",
                Ville = "Lyon",
                Sexe = "Homme",
                Num_phone = "0701020304"
            };

            var existingUser = new Utilisateur
            {
                Id_utilisateur = userId,
                Nom = "Doe",
                Prenom = "John",
                Email = "johndoe@example.com"
            };

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _mockUtilisateurRepo.Setup(repo => repo.UpdateAsync(It.IsAny<Utilisateur>()))
                .Returns(Task.CompletedTask);

            await _updateUseCase.ExecuteAsync(userId, userDto);

            _mockUtilisateurRepo.Verify(repo => repo.UpdateAsync(It.IsAny<Utilisateur>()), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldThrowException_WhenUserNotFound()
        {
            var userId = 1;
            var userDto = new UserDto { Email = "john@example.com" };

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync((Utilisateur)null);

            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _updateUseCase.ExecuteAsync(userId, userDto));
            Assert.Equal("Utilisateur non trouvé.", exception.Message);
        }
        
        [Fact]
        public async Task ExecuteAsync_ShouldDeleteUtilisateur_WhenUserExists()
        {
            var userId = 1;
            var existingUser = new Utilisateur { Id_utilisateur = userId };

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync(existingUser);

            _mockUtilisateurRepo.Setup(repo => repo.DeleteAsync(userId))
                .Returns(Task.CompletedTask);

            await _deleteUseCase.ExecuteAsync(userId);

            _mockUtilisateurRepo.Verify(repo => repo.DeleteAsync(userId), Times.Once);
        }
        
        [Fact]
        public async Task ExecuteAsync_ShouldThrowException_WhenUserNotFoundForDeletion()
        {
            var userId = 1;

            _mockUtilisateurRepo.Setup(repo => repo.GetByIdAsync(userId))
                .ReturnsAsync((Utilisateur)null);

            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => _deleteUseCase.ExecuteAsync(userId));
            Assert.Equal("Utilisateur non trouvé.", exception.Message);
        }
    }
}
