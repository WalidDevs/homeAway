namespace backend.DataAdapters.DataAdaptersFactory;

public interface IRepositoryFactory
{
    IUtilisateurRepository UtilisateurRepository();
    IRoleRepository RoleRepository();
    IDemandeRepository DemandeRepository();
    ILogementRepository LogementRepository();
    IEquipementRepository EquipementRepository();
    ICategorieRepository CategorieRepository();
    
    IReservationRepository ReservationRepository();
    
    Task EnsureDeletedAsync();
    Task EnsureCreatedAsync();
}


