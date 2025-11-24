using backend.DataAdapters.DataAdaptersFactory;
using backend.UseCases.Equipement;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    [Route("api/equipements")]
    [ApiController]
    public class EquipementController : ControllerBase
    {
        private readonly IRepositoryFactory _repositoryFactory;

        public EquipementController(IRepositoryFactory repositoryFactory)
        {
            _repositoryFactory = repositoryFactory;
        }
        
        [HttpGet("categorie/{id}")]
        public async Task<IActionResult> GetByCategorie(int id)
        {
            var useCase = new GetEquipementsByCategorieUseCase(_repositoryFactory.EquipementRepository());
            var result = await useCase.ExecuteAsync(id);
            return Ok(result);
        }
        [HttpGet("logement/{logementId}")]
        public async Task<IActionResult> GetByLogement(int logementId)
        {
            var useCase = new GetEquipementsByLogementUseCase(_repositoryFactory.EquipementRepository());
            var result = await useCase.ExecuteAsync(logementId); 
            return Ok(result);
        }
    }

}