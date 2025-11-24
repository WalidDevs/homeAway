using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using Microsoft.AspNetCore.Http;


namespace backend.UseCases.Create;

public class CreateLogementUseCase
{
    private readonly ILogementRepository _logementRepository;
    private readonly IUtilisateurRepository _utilisateurRepository;
    private readonly IEquipementRepository _equipementRepository;

    public CreateLogementUseCase(
        ILogementRepository logementRepository,
        IUtilisateurRepository utilisateurRepository,
        IEquipementRepository equipementRepository)
    {
        _logementRepository = logementRepository;
        _utilisateurRepository = utilisateurRepository;
        _equipementRepository = equipementRepository;
    }

    public async Task ExecuteAsync(LogementDto dto)
    {
        var utilisateur = await _utilisateurRepository.GetByIdAsync(dto.Id_utilisateur);
        if (utilisateur == null)
            throw new KeyNotFoundException("Utilisateur non trouvé.");

        byte[] justificatifBytes = await ConvertToByteArrayAsync(dto.Justificatif_domicile);

        byte[] imageBytes = null;
        if (dto.Image != null && dto.Image.Count > 0)
        {
            var file = dto.Image.First();
            Console.WriteLine("Image reçue depuis le frontend : " + file.FileName);
            imageBytes = await ConvertToByteArrayAsync(file);
        }
        else
        {
            Console.WriteLine(" Aucune image reçue dans dto.Image");
        }


        var logement = new Entities.Logement

        {
            Surface = dto.Surface,
            Type_log = dto.Type_log,
            Statut_logement = "En attente",
            Description = dto.Description,
            Prix = dto.Prix,
            Ville = dto.Ville,
            Justificatif_domicile = justificatifBytes,
            Image = imageBytes,
            Date_dispo_debut = dto.Date_dispo_debut,
            Date_dispo_fin = dto.Date_dispo_fin,
            Id_utilisateur = dto.Id_utilisateur,
            Utilisateur = utilisateur
        };

        if (dto.Ids_equipements != null && dto.Ids_equipements.Any())
        {
            var equipements = await _equipementRepository.GetEquipementsByIdsAsync(dto.Ids_equipements);
            logement.Equipements = equipements;
        }

        await _logementRepository.CreateAsync(logement);
    }

    private async Task<byte[]> ConvertToByteArrayAsync(IFormFile file)
    {
        if (file == null) return null;
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        return memoryStream.ToArray();
    }
}
