using backend.DataAdapters.DataAdaptersFactory;

namespace backend.JeuxDeDonnees;

public abstract class BdBuilder
{
    protected readonly IRepositoryFactory repositoryFactory;

    protected BdBuilder(IRepositoryFactory repositoryFactory)
    {
        this.repositoryFactory = repositoryFactory;
    }

    public async Task BuildBdAsync()
    {
        Console.WriteLine("Suppression et recréation de la BD");
        await RegenererBdAsync();

        Console.WriteLine("Ajout des rôles");
        await BuildRolesAsync();

        Console.WriteLine("Ajout des utilisateurs");
        await BuildUsersAsync();

        Console.WriteLine("Ajout des catégories");
        await BuildCategoriesAsync();

        Console.WriteLine("Ajout des équipements");
        await BuildEquipementsAsync();

        Console.WriteLine("Ajout des logements");
        await BuildLogementsAsync();

        Console.WriteLine("Ajout des réservations");
        await BuildReservationsAsync();

        Console.WriteLine("Ajout des demandes");
        await BuildDemandesAsync();
        
        Console.WriteLine("Ajout des Roles");
        await BuildRolesForUtilisateursAsync();
    }

    protected abstract Task RegenererBdAsync();
    protected abstract Task BuildRolesAsync();
    protected abstract Task BuildUsersAsync();
    protected abstract Task BuildCategoriesAsync();
    protected abstract Task BuildEquipementsAsync();
    protected abstract Task BuildLogementsAsync();
    protected abstract Task BuildReservationsAsync();
    protected abstract Task BuildDemandesAsync();
    protected abstract Task BuildRolesForUtilisateursAsync();
}