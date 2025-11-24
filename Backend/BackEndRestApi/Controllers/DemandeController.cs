using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.Entities;
using backend.UseCases.Create;
using backend.UseCases.Read;
using backend.UseCases.Update;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers;

[Route("api/demandes")]
[ApiController]
public class DemandeController : ControllerBase
{
    private readonly IRepositoryFactory _repositoryFactory;
    private readonly IEmailService _emailService;

    public DemandeController(IRepositoryFactory repositoryFactory, IEmailService emailService)
    {
        _repositoryFactory = repositoryFactory;
        _emailService = emailService;
        
    }
    [Authorize(Roles = "Locataire")]
    [HttpPost]
    public async Task<IActionResult> CreateDemande([FromBody] DemandeDto demandeDto)
    {
        try
        {
            var createDemandeUseCase = new CreateDemandeUseCase(
                _repositoryFactory.DemandeRepository(),
                _repositoryFactory.UtilisateurRepository()
            );

            await createDemandeUseCase.ExecuteAsync(demandeDto);
            return Ok(new { message = "Demande créée avec succès !" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    [Authorize(Roles = "Administrateur")]
    [HttpGet]
    public async Task<ActionResult<List<DemandeDto>>> GetAllDemandes()
    {
        var useCase = new GetAllDemandesUseCase(_repositoryFactory.DemandeRepository());
        var result = await useCase.ExecuteAsync();
        return Ok(result);
    }
    [Authorize(Roles = "Administrateur")]
    [HttpGet("{id}")]
    public async Task<ActionResult<DemandeDto>> GetDemandeById(int id)
    {
        try
        {
            var useCase = new GetDemandeByIdUseCase(_repositoryFactory.DemandeRepository());
            var result = await useCase.ExecuteAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
    [Authorize(Roles = "Administrateur")]
    [HttpGet("avec-role/{id}")]
    public async Task<ActionResult<DemandeAvecRoleDto>> GetDemandeAvecRole(int id)
    {
        var useCase = new GetDemandeWithUserRoleUseCase(
            _repositoryFactory.DemandeRepository(),
            _repositoryFactory.UtilisateurRepository()
        );

        try
        {
            var result = await useCase.ExecuteAsync(id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }
    [Authorize(Roles = "Administrateur")]
    [HttpPut("{id}/traiter")]
    public async Task<IActionResult> TraiterDemande(int id, [FromBody] string statut)
    {
        try
        {
            var useCase = new TraiterDemandeUseCase(
                _repositoryFactory.DemandeRepository(),
                _repositoryFactory.UtilisateurRepository(),
                _repositoryFactory.RoleRepository(),
                _emailService
            );

            await useCase.ExecuteAsync(id, statut);
            return Ok(new { message = "Demande traitée avec succès." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    [Authorize(Roles = "Administrateur")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDemande(int id)
    {
        try
        {
            var useCase = new DeleteDemandeUseCase(_repositoryFactory.DemandeRepository());
            await useCase.ExecuteAsync(id);
            return Ok(new { message = "Demande supprimée avec succès !" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}