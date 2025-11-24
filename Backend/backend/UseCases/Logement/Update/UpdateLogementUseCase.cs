using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.UseCases.Logement.Update
{
    public class UpdateLogementUseCase
    {
        private readonly ILogementRepository _logementRepository;
        private readonly IEquipementRepository _equipementRepository;

        public UpdateLogementUseCase(
            ILogementRepository logementRepository,
            IEquipementRepository equipementRepository)
        {
            _logementRepository = logementRepository;
            _equipementRepository = equipementRepository;
        }

        public async Task ExecuteAsync(int logementId, UpdateLogementDto dto)
        {
            var logement = await _logementRepository.GetByIdAsync(logementId);
            if (logement == null)
                throw new System.Exception("Logement non trouvé.");
            logement.Surface = dto.Surface;
            logement.Type_log = dto.Type_log;
            logement.Statut_logement = dto.Statut_logement ?? logement.Statut_logement;
            logement.Description = dto.Description;
            logement.Prix = dto.Prix;
            logement.Ville = dto.Ville;
            logement.Date_dispo_debut = dto.Date_dispo_debut;
            logement.Date_dispo_fin = dto.Date_dispo_fin;
            
            if (dto.Justificatif_domicile != null)
            {
                using var ms = new MemoryStream();
                await dto.Justificatif_domicile.CopyToAsync(ms);
                logement.Justificatif_domicile = ms.ToArray();
            }

            if (dto.Image != null && dto.Image.Count > 0)
            {
                using var ms = new MemoryStream();
                await dto.Image[0].CopyToAsync(ms);
                logement.Image = ms.ToArray();
            }
            if (dto.Ids_equipements != null)
            {
                var existants = logement.Equipements.ToList();
                var nouveaux = dto.Ids_equipements;

                foreach (var e in existants.Where(e => !nouveaux.Contains(e.Id_equipement)).ToList())
                    logement.Equipements.Remove(e);

                foreach (var id in nouveaux.Where(id => existants.All(e => e.Id_equipement != id)))
                {
                    var equip = await _equipementRepository.GetByIdAsync(id);
                    if (equip != null)
                        logement.Equipements.Add(equip);
                }
            }
            await _logementRepository.UpdateAsync(logement);
        }
    }
}
