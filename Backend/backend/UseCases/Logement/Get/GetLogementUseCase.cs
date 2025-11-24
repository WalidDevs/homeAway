using backend.DataAdapters;
using backend.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.UseCases.Get
{
    public class GetLogementUseCase
    {
        private readonly ILogementRepository _logementRepository;

        public GetLogementUseCase(ILogementRepository logementRepository)
        {
            _logementRepository = logementRepository;
        }

        public async Task<LogementDto> ExecuteAsync(int id)
        {
            var logement = await _logementRepository.GetByIdAsync(id);
            if (logement == null)
            {
                throw new KeyNotFoundException("Logement non trouvé.");
            }
            return LogementDto.ToDto(logement);
        }
    }
}