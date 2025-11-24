using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.UseCases.Create;
using backend.UseCases.Get;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers;

[Route("api/utilisateurs")]
[ApiController]
public class UtilisateurController : ControllerBase
{
    private readonly IRepositoryFactory _repositoryFactory;

    public UtilisateurController(IRepositoryFactory repositoryFactory)
    {
        _repositoryFactory = repositoryFactory;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        try
        {
            var createUtilisateurUseCase = new CreateUtilisateurUseCase(
                _repositoryFactory.UtilisateurRepository(),
                _repositoryFactory.RoleRepository()
            );

            await createUtilisateurUseCase.ExecuteAsync(userDto);
            return Ok(new { message = "Utilisateur créé avec succès !" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    [Authorize(Roles = "Administrateur")]
    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetAllUser()
    {
        try
        {
            var getTousLesUtilisateursUseCase = new GetTousLesUtilisateursUseCase(_repositoryFactory.UtilisateurRepository());
            var utilisateurs = await getTousLesUtilisateursUseCase.ExecuteAsync();

            return Ok(utilisateurs);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = "Administrateur, Locataire, Propriétaire")]
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        try
        {
            var getUtilisateurByIdUseCase = new GetUtilisateurByIdUseCase(_repositoryFactory);
            var utilisateur = await getUtilisateurByIdUseCase.ExecuteAsync(id);

            if (utilisateur == null)
            {
                return NotFound(new { error = "Utilisateur non trouvé" });
            }

            return Ok(UserDto.ToDto(utilisateur));
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = "Administrateur")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        try
        {
            var deleteUtilisateurUseCase = new DeleteUtilisateurUseCase(_repositoryFactory.UtilisateurRepository());

            await deleteUtilisateurUseCase.ExecuteAsync(id);
            return Ok(new { message = "Utilisateur supprimé avec succès !" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "Utilisateur non trouvé" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize(Roles = "Administrateur, Locataire, Propriétaire")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UserDto userDto)
    {
        try
        {
            var utilisateurRepository = _repositoryFactory.UtilisateurRepository();

            var utilisateur = await utilisateurRepository.GetByIdAsync(id);
            if (utilisateur == null)
            {
                return NotFound(new { error = "Utilisateur non trouvé" });
            }

            utilisateur.Nom = userDto.Nom ?? utilisateur.Nom;
            utilisateur.Prenom = userDto.Prenom ?? utilisateur.Prenom;
            utilisateur.Email = userDto.Email ?? utilisateur.Email;
            utilisateur.Num_phone = userDto.Num_phone ?? utilisateur.Num_phone;
            utilisateur.Ville = userDto.Ville ?? utilisateur.Ville;
            utilisateur.Sexe = userDto.Sexe ?? utilisateur.Sexe;

            if (!string.IsNullOrWhiteSpace(userDto.Mot_de_passe))
            {
                utilisateur.Mot_de_passe = BCrypt.Net.BCrypt.HashPassword(userDto.Mot_de_passe);
            }

            await utilisateurRepository.UpdateAsync(utilisateur);
            return Ok(new { message = "Utilisateur mis à jour avec succès !" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

