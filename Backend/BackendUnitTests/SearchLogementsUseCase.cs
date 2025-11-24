
using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using backend.UseCases.Logement.Search;
using Moq;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Assert = Xunit.Assert;

namespace BackendUnitTests;

public class SearchLogementsUseCaseTests
{
    private readonly Mock<ILogementRepository> _mockRepo;
    private readonly SearchLogementsUseCase _useCase;

    public SearchLogementsUseCaseTests()
    {
        _mockRepo = new Mock<ILogementRepository>();
        _useCase = new SearchLogementsUseCase(_mockRepo.Object);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldReturnMatchingLogements()
    {
        var filters = new LogementFilterDto
        {
            Ville = "Paris",
            PrixMin = 500,
            PrixMax = 1500
        };

        var logementsAttendus = new List<Logement>
        {
            new Logement
            {
                Id_logement = 1,
                Ville = "Paris",
                Prix = 1200,
                Type_log = "Appartement",
                Description = "Logement proche centre",
                Surface = 40,
                Date_dispo_debut = DateTime.UtcNow,
                Date_dispo_fin = DateTime.UtcNow.AddDays(10)
            }
        };

        _mockRepo.Setup(r => r.SearchAsync(filters)).ReturnsAsync(logementsAttendus);
        var result = await _useCase.ExecuteAsync(filters);
        
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("Paris", result[0].Ville);
        _mockRepo.Verify(r => r.SearchAsync(filters), Times.Once);
    }
}
