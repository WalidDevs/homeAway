
using backend.DataAdapters.DataAdaptersFactory;
using backend.UseCases.Categorie;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers;

[Route("api/categories")]
[ApiController]
public class CategorieController : ControllerBase
{
    private readonly IRepositoryFactory _repositoryFactory;

    public CategorieController(IRepositoryFactory repositoryFactory)
    {
        _repositoryFactory = repositoryFactory;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var useCase = new GetCategoriesUseCase(_repositoryFactory.CategorieRepository());
        var result = await useCase.ExecuteAsync();
        return Ok(result);
    }
}
