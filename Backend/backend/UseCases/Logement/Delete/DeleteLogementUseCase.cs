using backend.DataAdapters;


namespace backend.UseCases.Delete
{
    public class DeleteLogementUseCase
    {
        private readonly ILogementRepository _logementRepository;

        public DeleteLogementUseCase(ILogementRepository logementRepository)
        {
            _logementRepository = logementRepository;
        }

        public async Task ExecuteAsync(int id)
        {
            var logement = await _logementRepository.GetByIdAsync(id);
            if (logement == null)
            {
                throw new KeyNotFoundException("Logement non trouvé.");
            }

            await _logementRepository.DeleteAsync(id);
        }
    }
}