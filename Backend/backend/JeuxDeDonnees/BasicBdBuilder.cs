using backend.UseCases.Create;
using backend.Dtos;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Entities;
using backend.UseCases.Categorie;
using backend.UseCases.Equipement;
using backend.UseCases.Role;
using Microsoft.AspNetCore.Http;

namespace backend.JeuxDeDonnees;

public class BasicBdBuilder : BdBuilder
{
    public BasicBdBuilder(IRepositoryFactory repositoryFactory)
        : base(repositoryFactory)
    {
    }

    protected override async Task RegenererBdAsync()
    {
        await repositoryFactory.EnsureDeletedAsync();
        await repositoryFactory.EnsureCreatedAsync();
    }

    protected override async Task BuildRolesAsync()
    {
        var roles = new[] { "Locataire", "Propriétaire", "Administrateur" };

        foreach (var typeRole in roles)
        {
            await new CreateRoleUseCase(repositoryFactory.RoleRepository())
                .ExecuteAsync(typeRole);
        }
    }

    protected override async Task BuildCategoriesAsync()
    {
        var categories = new[]
        {
            "Cuisine", "Multimédia", "Confort", "Salle de bain", "Sécurité", "Jardin"
        };

        foreach (var nom in categories)
        {
            await new CreateCategorieUseCase(repositoryFactory.CategorieRepository())
                .ExecuteAsync(new CategorieDto { Nom_categorie = nom });
        }
    }

    protected override async Task BuildEquipementsAsync()
    {
        var equipements = new[]
        {
            new { Nom = "Four", CategorieId = 1 },
            new { Nom = "Plaques de cuisson", CategorieId = 1 },
            new { Nom = "Réfrigérateur", CategorieId = 1 },
            new { Nom = "Lave-vaisselle", CategorieId = 1 },
            new { Nom = "Micro-ondes", CategorieId = 1 },

            new { Nom = "Télévision", CategorieId = 2 },
            new { Nom = "Enceinte Bluetooth", CategorieId = 2 },
            new { Nom = "Console de jeux", CategorieId = 2 },
            new { Nom = "Lecteur DVD", CategorieId = 2 },
            new { Nom = "Projecteur", CategorieId = 2 },

            new { Nom = "Climatiseur", CategorieId = 3 },
            new { Nom = "Chauffage central", CategorieId = 3 },
            new { Nom = "Canapé-lit", CategorieId = 3 },
            new { Nom = "Lit king size", CategorieId = 3 },
            new { Nom = "Double vitrage", CategorieId = 3 },

            new { Nom = "Douche à l'italienne", CategorieId = 4 },
            new { Nom = "Baignoire", CategorieId = 4 },
            new { Nom = "Sèche-serviette", CategorieId = 4 },
            new { Nom = "Lave-linge", CategorieId = 4 },
            new { Nom = "Toilettes suspendues", CategorieId = 4 },

            new { Nom = "Alarme", CategorieId = 5 },
            new { Nom = "Caméra de surveillance", CategorieId = 5 },
            new { Nom = "Porte blindée", CategorieId = 5 },
            new { Nom = "Détecteur de fumée", CategorieId = 5 },
            new { Nom = "Interphone vidéo", CategorieId = 5 },

            new { Nom = "Barbecue", CategorieId = 6 },
            new { Nom = "Table de jardin", CategorieId = 6 },
            new { Nom = "Balançoire", CategorieId = 6 },
            new { Nom = "Hamac", CategorieId = 6 },
            new { Nom = "Tonnelle", CategorieId = 6 },
        };

        foreach (var eq in equipements)
        {
            await new CreateEquipementUseCase(
                repositoryFactory.EquipementRepository(),
                repositoryFactory.CategorieRepository()
            ).ExecuteAsync(new EquipementDto
            {
                Nom_equipement = eq.Nom,
                Id_categorie = eq.CategorieId
            });
        }
    }

    protected override async Task BuildUsersAsync()
    {
        var utilisateurs = new[]
        {
            new { Nom = "Martin", Prenom = "Alice", Email = "alice.martin@test.com" },
            new { Nom = "Durand", Prenom = "Jean", Email = "jean.durand@test.com"},
            new { Nom = "Bernard", Prenom = "Sophie", Email = "sophie.bernard@test.com" },
            new { Nom = "Robert", Prenom = "Paul", Email = "paul.robert@test.com" },
            new { Nom = "Petit", Prenom = "Chloé", Email = "chloe.petit@test.com" },
            new { Nom = "Moreau", Prenom = "Lucas", Email = "lucas.moreau@test.com"},
            new { Nom = "Fournier", Prenom = "Emma", Email = "emma.fournier@test.com" },
            new { Nom = "Girard", Prenom = "Nathan", Email = "nathan.girard@test.com" },
        };

        foreach (var u in utilisateurs)
        {
            var dto = new UserDto
            {
                Nom = u.Nom,
                Prenom = u.Prenom,
                Email = u.Email,
                Ville = "Amiens",
                Sexe = "Homme",
                Num_phone = "0600000000",
                Mot_de_passe = "Test1234",
            };

            await new CreateUtilisateurUseCase(
                repositoryFactory.UtilisateurRepository(),
                repositoryFactory.RoleRepository()
            ).ExecuteAsync(dto);
        }
    }

       private IFormFile GetFormFileFromPath(string filePath, string contentType)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"Fichier introuvable : {filePath}");

        var fileStream = File.OpenRead(filePath);
        return new FormFile(fileStream, 0, fileStream.Length, "file", Path.GetFileName(filePath))
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };
    }



    protected override async Task BuildLogementsAsync()
{
    var justificatifPath = @"C:\Users\hp\Desktop\AirBNB_Project\2024_M1_PRO-05_GR10\Backend\backend\JeuxDeDonnees\TestFiles\justificatif_dom.pdf";
    var imagePath = @"C:\Users\hp\Desktop\AirBNB_Project\2024_M1_PRO-05_GR10\Backend\backend\JeuxDeDonnees\TestFiles\image.jpg";

    if (!File.Exists(justificatifPath))
        throw new FileNotFoundException($"Fichier introuvable : {justificatifPath}");
    if (!File.Exists(imagePath))
        throw new FileNotFoundException($"Fichier introuvable : {imagePath}");

    var justificatif = GetFormFileFromPath(justificatifPath, "application/pdf");
    var image = GetFormFileFromPath(imagePath, "image/png");

    var logements = new[]
    {
        new { Surface = 45, Type = "Studio", Description = "Studio cosy proche du centre", Prix = 320, Utilisateur = 3, Equipements = new List<int> { 1, 2 } },
        new { Surface = 70, Type = "Appartement", Description = "Appartement lumineux avec balcon", Prix = 450, Utilisateur = 3, Equipements = new List<int> { 1, 3 } },
        new { Surface = 110, Type = "Maison", Description = "Maison familiale avec jardin", Prix = 650, Utilisateur = 3, Equipements = new List<int> { 2, 3 } },
        new { Surface = 160, Type = "Villa", Description = "Villa moderne avec piscine", Prix = 850, Utilisateur = 4, Equipements = new List<int> { 1, 2, 3 } },
        new { Surface = 52, Type = "Studio", Description = "Studio calme pour étudiants", Prix = 300, Utilisateur = 4, Equipements = new List<int> { 1 } },
        new { Surface = 78, Type = "Appartement", Description = "Appartement 2 chambres tout équipé", Prix = 470, Utilisateur = 4, Equipements = new List<int> { 2 } },
        new { Surface = 125, Type = "Maison", Description = "Grande maison avec garage", Prix = 600, Utilisateur = 4, Equipements = new List<int> { 3 } },
        new { Surface = 175, Type = "Villa", Description = "Villa de luxe bord de lac", Prix = 950, Utilisateur = 3, Equipements = new List<int> { 1, 3 } },
        new { Surface = 58, Type = "Appartement", Description = "Appartement rénové centre-ville", Prix = 420, Utilisateur = 3, Equipements = new List<int> { 2, 3 } },
    };

    foreach (var l in logements)
    {
        var dto = new LogementDto
        {
            Surface = l.Surface,
            Type_log = l.Type,
            Description = l.Description,
            Ville = "Amiens",
            Prix = l.Prix,
            Justificatif_domicile = justificatif,
            Image = new List<IFormFile> { image },
            Date_dispo_debut = DateTime.Now,
            Date_dispo_fin = DateTime.Now.AddDays(30),
            Id_utilisateur = l.Utilisateur,
            Ids_equipements = l.Equipements
        };

        await new CreateLogementUseCase(
            repositoryFactory.LogementRepository(),
            repositoryFactory.UtilisateurRepository(),
            repositoryFactory.EquipementRepository()
        ).ExecuteAsync(dto);

        Console.WriteLine($"Logement {l.Description} ajouté.");
    }
}


    protected override async Task BuildReservationsAsync()
    {
        var reservations = new[]
        {
            new ReservationDto { Id_logement = 1, Id_utilisateur = 5, Date_debut = DateTime.Now, Date_fin = DateTime.Now.AddDays(3), Type_reservation = "Instantanée", Statut = "Confirmée", Nbr_personnes = 2, Montant_total = 180 },
            new ReservationDto { Id_logement = 2, Id_utilisateur = 6, Date_debut = DateTime.Now.AddDays(1), Date_fin = DateTime.Now.AddDays(5), Type_reservation = "Instantanée", Statut = "En attente", Nbr_personnes = 3, Montant_total = 400 },
            new ReservationDto { Id_logement = 3, Id_utilisateur = 7, Date_debut = DateTime.Now.AddDays(2), Date_fin = DateTime.Now.AddDays(6), Type_reservation = "Instantanée", Statut = "Confirmée", Nbr_personnes = 1, Montant_total = 350 },
            new ReservationDto { Id_logement = 4, Id_utilisateur = 8, Date_debut = DateTime.Now.AddDays(3), Date_fin = DateTime.Now.AddDays(7), Type_reservation = "Instantanée", Statut = "Refusée", Nbr_personnes = 2, Montant_total = 300 },
            new ReservationDto { Id_logement = 5, Id_utilisateur = 5, Date_debut = DateTime.Now.AddDays(4), Date_fin = DateTime.Now.AddDays(10), Type_reservation = "Instantanée", Statut = "Confirmée", Nbr_personnes = 4, Montant_total = 800 },
        };

        foreach (var r in reservations)
        {
            await new CreateReservationUseCase(repositoryFactory).ExecuteAsync(r);
        }
    }

    protected override async Task BuildDemandesAsync()
    {
        var demandes = new[]
        {
            new DemandeDto { Id_utilisateur = 5, Email_demande = "chloe.petit@test.com", Motif_demande = "Devenir propriétaire" },
            new DemandeDto { Id_utilisateur = 6, Email_demande = "lucas.moreau@test.com", Motif_demande = "Proposer un logement" },
            new DemandeDto { Id_utilisateur = 7, Email_demande = "emma.fournier@test.com", Motif_demande = "Changer rôle utilisateur" },
            new DemandeDto { Id_utilisateur = 8, Email_demande = "nathan.girard@test.com", Motif_demande = "Ajout équipement" },
            new DemandeDto { Id_utilisateur = 5, Email_demande = "chloe.petit@test.com", Motif_demande = "Demande d’assistance" },
        };

        foreach (var d in demandes)
        {
            await new CreateDemandeUseCase(
                repositoryFactory.DemandeRepository(),
                repositoryFactory.UtilisateurRepository()
            ).ExecuteAsync(d);
        }
    }
    protected override async Task BuildRolesForUtilisateursAsync()
    {
        var roleRepo = repositoryFactory.RoleRepository();
        var userRepo = repositoryFactory.UtilisateurRepository();

        var roles = new Dictionary<int, string>
        {
            { 1, "Administrateur" },
            { 2, "Administrateur" },
            { 3, "Propriétaire" },
            { 4, "Propriétaire" },
            { 5, "Locataire" },
            { 6, "Locataire" },
            { 7, "Locataire" },
            { 8, "Locataire" },
        };

        foreach (var (userId, roleName) in roles)
        {
            var user = await userRepo.GetByIdAsync(userId);
            var role = await roleRepo.GetByTypeAsync(roleName); // ✅ bon nom de méthode

            if (user != null && role != null)
            {
                user.Roles = new List<Role> { role };
                await userRepo.UpdateAsync(user);
                Console.WriteLine($"Rôle '{roleName}' assigné à l'utilisateur {user.Prenom} {user.Nom}");
            }
            else
            {
                Console.WriteLine($"⚠️ Utilisateur ou rôle non trouvé pour l'ID {userId}");
            }
        }
    }

}
