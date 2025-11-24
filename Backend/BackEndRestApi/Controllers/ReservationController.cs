using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.Entities;
using backend.Exceptions;
using backend.UseCases.Create;
using backend.UseCases.Reservation;
using backend.UseCases.Reservation.Get;
using backend.UseCases.Réservation.Update;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers;

[Route("api/reservations")]
[ApiController]
public class ReservationController : ControllerBase
{
    private readonly IRepositoryFactory _repositoryFactory;
    private readonly IEmailService _emailService;


    public ReservationController(IRepositoryFactory repositoryFactory, IEmailService emailService)
    {
        _repositoryFactory = repositoryFactory;
        _emailService = emailService;
    }

    [Authorize(Roles = "Locataire")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ReservationDto dto)
    {
        try
        {
            var useCase = new CreateReservationUseCase(_repositoryFactory);
            await useCase.ExecuteAsync(dto);
            return Ok(new { message = "Réservation enregistrée avec succès." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    [Authorize(Roles = "Propriétaire")]
    [HttpGet("proprietaire/{proprietaireId}/reservations-en-attente")]
    public async Task<IActionResult> GetReservationsEnAttenteParProprietaire(int proprietaireId) 
    {
        GetReservationsEnAttenteByProprietaireUseCase useCase = new GetReservationsEnAttenteByProprietaireUseCase(_repositoryFactory);
        var reservations = await useCase.ExecuteAsync(proprietaireId);

        var dtos = ReservationEnAttenteDto.FromModels(reservations);

        return Ok(dtos);
    }
    
    [Authorize(Roles = "Propriétaire")]
    [HttpPut("traiter/{id}/")]
    public async Task<IActionResult> TraiterReservation(int id, [FromBody] string statut) 
    {
        
        var useCase = new TraiterReservationUseCase(_repositoryFactory.ReservationRepository(),
                                                    _emailService,
                                                    _repositoryFactory.UtilisateurRepository());
        
        try
        {
            await useCase.ExecuteAsync(id, statut);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return BadRequest("Statut invalide. "); 
        }
        return Ok(new { message = "Réservation mise à jour." });
    }
    
    [Authorize(Roles = "Locataire")]
    [HttpPut("annuler/{id}")]
    public async Task<IActionResult> AnnulerReservation(int id)  
    {
        AnnulerReservationUseCase _useCase=new AnnulerReservationUseCase(_repositoryFactory, _emailService);
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User ID not found in token.");
        }
        int userId = int.Parse(userIdClaim.Value);
        Console.WriteLine(userId);
        try
        {
            await _useCase.ExecuteAsync(id, userId);

        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(" impossible d'annuler , vous avez dépasser le deadline d'annulation  ");
        }
        return NoContent();
    }
    
    [Authorize(Roles = "Locataire")]
    [HttpGet("locataire/reservations-en-cours")]
    public async Task<IActionResult> GetReservationsEnCours()
    {
        GetReservationsLocataireEnCoursUseCase _useCase=new GetReservationsLocataireEnCoursUseCase(_repositoryFactory); 
        
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User ID not found in token.");
        }
        int userId = int.Parse(userIdClaim.Value);
        var result = await _useCase.ExecuteAsync(userId);
        return Ok(result);
    }
    
}