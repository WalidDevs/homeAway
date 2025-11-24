using backend.DataAdapters.DataAdaptersFactory;
using UniversiteEFDataProvider.Repositories;
using backend.DataAdapters;
using BackendEFDataProvider.Data;

namespace BackendEFDataProvider.RepositoryFactories;

public class RepositoryFactory(LocationDbContext context) : IRepositoryFactory
{
    private IUtilisateurRepository? _utilisateur;
    private IRoleRepository? _roleRepository;
    private IDemandeRepository? _demandeRepository;
    private ILogementRepository? _logementRepository;
    private IEquipementRepository? _equipementRepository;
    private ICategorieRepository? _categorieRepository;
    private IReservationRepository? _reservationRepository;

    public IUtilisateurRepository UtilisateurRepository()
    {
        return _utilisateur ??= new UtilisateurRepository(context ?? throw new InvalidOperationException());
    }

    public IRoleRepository RoleRepository()
    {
        return _roleRepository ??= new RoleRepository(context ?? throw new InvalidOperationException());
    }
    public IDemandeRepository DemandeRepository()
    {
        return _demandeRepository ??= new DemandeRepository(context ?? throw new InvalidOperationException());
    }
    public ILogementRepository LogementRepository()
    {
        return _logementRepository ??= new LogementRepository(context ?? throw new InvalidOperationException());
    }
    public IEquipementRepository EquipementRepository()
    {
        return _equipementRepository ??= new EquipementRepository(context ?? throw new InvalidOperationException());
    }
    public ICategorieRepository CategorieRepository()
    {
        return _categorieRepository ??= new CategorieRepository(context ?? throw new InvalidOperationException());
    }

    public IReservationRepository ReservationRepository()
    {
        return _reservationRepository ??= new ReservationRepository(context ?? throw new InvalidOperationException());
    }
    public async Task EnsureDeletedAsync()
    {
        await context.Database.EnsureDeletedAsync();
    }

    public async Task EnsureCreatedAsync()
    {
        await context.Database.EnsureCreatedAsync();
    }
}