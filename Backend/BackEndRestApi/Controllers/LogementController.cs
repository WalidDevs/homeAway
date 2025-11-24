   using backend.DataAdapters.DataAdaptersFactory;
   using backend.Dtos;
   using backend.UseCases.Create;
   using backend.UseCases.Delete;
   using backend.UseCases.Get;

   using backend.UseCases.Logement.Update;
   using backend.UseCases.Logement.Search;
    
   using Microsoft.AspNetCore.Authorization;
   using Microsoft.AspNetCore.Mvc;

   namespace WebApplication1.Controllers;

    [Route("api/logements")]
    [ApiController]
    public class LogementController : ControllerBase
    {
        private readonly IRepositoryFactory _repositoryFactory;

        public LogementController(IRepositoryFactory repositoryFactory)
        {
            _repositoryFactory = repositoryFactory;
        }
        [Authorize(Roles = "Propriétaire")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateLogement([FromForm] LogementDto logementDto)
        {
            try
            {
                var createLogementUseCase = new CreateLogementUseCase(
                    _repositoryFactory.LogementRepository(),
                    _repositoryFactory.UtilisateurRepository(),
                    _repositoryFactory.EquipementRepository()
                );

                await createLogementUseCase.ExecuteAsync(logementDto);
                return Ok(new { message = "Logement ajouté avec succès !" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
      //  [Authorize(Roles = "Propriétaire")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLogement(int id)
        {
            try
            {
                var getLogementUseCase = new GetLogementUseCase(_repositoryFactory.LogementRepository());
                var logement = await getLogementUseCase.ExecuteAsync(id);
                return Ok(logement);
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

        [Authorize(Roles = "Propriétaire")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogement(int id)
        {
            try
            {
                var deleteLogementUseCase = new DeleteLogementUseCase(_repositoryFactory.LogementRepository());
                await deleteLogementUseCase.ExecuteAsync(id);
                return Ok(new { message = "Logement supprimé avec succès !" });
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
        [Authorize(Roles = "Propriétaire")]
        [HttpGet("proprietaire/{proprietaireId}")]
        public async Task<IActionResult> GetLogementsByProprietaire(int proprietaireId)
        {
            var logements = await _repositoryFactory.LogementRepository().GetAllByProprietaireAsync(proprietaireId);
            var logementDtos = logements.Select(LogementDto.ToDto).ToList();
            return Ok(logementDtos);
        }
        

        [HttpPost("search")]
        public async Task<IActionResult> SearchLogements([FromBody] LogementFilterDto filters)
        {
            try
            {
                var searchUseCase = new SearchLogementsUseCase(_repositoryFactory.LogementRepository());
                Console.WriteLine("ana hna");
                var logements = await searchUseCase.ExecuteAsync(filters);
                return Ok(logements);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Administrateur")]
        [HttpGet("en-attente")]
        public async Task<IActionResult> GetLogementsEnAttente()
        {
            var logements = await _repositoryFactory.LogementRepository().GetLogementsEnAttenteAsync();
            var dtos = logements.Select(LogementDemandeDto.ToDto).ToList(); 
            return Ok(dtos);
        }
        
        [Authorize(Roles = "Administrateur")]
        [HttpPut("{id}/traiter")]
        public async Task<IActionResult> TraiterLogement(int id, [FromBody] string statut)
        {
            var useCase = new TraiterLogementUseCase(_repositoryFactory.LogementRepository());
            await useCase.ExecuteAsync(id, statut);
            return Ok(new { message = "Statut mis à jour." }); 
        }
        [Authorize(Roles = "Propriétaire")]
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateLogement(int id, [FromForm] UpdateLogementDto updateDto)
        {
            try
            {
                var updateLogementUseCase = new UpdateLogementUseCase(
                    _repositoryFactory.LogementRepository(),
                    _repositoryFactory.EquipementRepository()
                );

                await updateLogementUseCase.ExecuteAsync(id, updateDto);

                return Ok(new { message = "Logement mis à jour avec succès !" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    