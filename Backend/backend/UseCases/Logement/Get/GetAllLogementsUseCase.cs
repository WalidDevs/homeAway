    using backend.DataAdapters;
    using backend.Dtos;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    namespace backend.UseCases.Get
    {
        public class GetAllLogementsUseCase
        {
            private readonly ILogementRepository _logementRepository;

            public GetAllLogementsUseCase(ILogementRepository logementRepository)
            {
                _logementRepository = logementRepository;
            }

            public async Task<List<LogementDto>> ExecuteAsync(int proprietaireId)
            {
                var logements = await _logementRepository.GetAllByProprietaireAsync(proprietaireId);

                return logements.Select(logement => LogementDto.ToDto(logement)).ToList();
            }
        }
    }