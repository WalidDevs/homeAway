using backend.DataAdapters;
using backend.Dtos;
using backend.Entities;
using System.Text.RegularExpressions;
using backend.DataAdapters.DataAdaptersFactory;

namespace backend.UseCases.Create;

public class CreateUtilisateurUseCase
{
    private readonly IUtilisateurRepository _utilisateurRepository;
    private readonly IRoleRepository _roleRepository;

    public CreateUtilisateurUseCase(IUtilisateurRepository utilisateurRepository, IRoleRepository roleRepository)
    {
        _utilisateurRepository = utilisateurRepository;
        _roleRepository = roleRepository;
    }

    public async Task ExecuteAsync(UserDto userDto)
    {
        var existingUser = await _utilisateurRepository.GetByEmailAsync(userDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Cet email est déjà utilisé !");
        }
        if (!Regex.IsMatch(userDto.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            throw new Exception("Email invalide.");
        if (userDto.Mot_de_passe.Length < 6)
            throw new Exception("Le mot de passe doit contenir au moins 6 caractères.");
        if (userDto.Num_phone.Length < 8)
            throw new Exception("Numéro de téléphone invalide.");
        var role = await _roleRepository.GetByTypeAsync("Locataire");
        if (role == null)
        {
            role = new Entities.Role { Type_role = "Locataire" };
            await _roleRepository.AddAsync(role);
        }
        var utilisateur = new Utilisateur
        {
            Nom = userDto.Nom,
            Prenom = userDto.Prenom,
            Num_phone = userDto.Num_phone,
            Ville = userDto.Ville,
            Sexe = userDto.Sexe,
            Email = userDto.Email,
            Mot_de_passe = BCrypt.Net.BCrypt.HashPassword(userDto.Mot_de_passe), 
            Roles = new List<Entities.Role> { role } 
        };

        await _utilisateurRepository.CreateAsync(utilisateur);
    }
}