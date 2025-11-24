using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendEFDataProvider.Data;

public class LocationDbContext : DbContext
{
    public LocationDbContext(DbContextOptions<LocationDbContext> options) : base(options) {}

    public DbSet<Utilisateur> Utilisateurs { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Demande> Demandes { get; set; }
    public DbSet<Logement> Logements { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Equipement> Equipements { get; set; }
    public DbSet<Categorie> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relation Utilisateur <-> Rôles (Many-to-Many)
        modelBuilder.Entity<Utilisateur>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Utilisateurs)
            .UsingEntity<Dictionary<string, object>>(
                "UtilisateurRole",
                j => j.HasOne<Role>().WithMany().HasForeignKey("Id_role"),
                j => j.HasOne<Utilisateur>().WithMany().HasForeignKey("Id_utilisateur"),
                j =>
                {
                    j.HasKey("Id_utilisateur", "Id_role");
                    j.ToTable("UtilisateurRole");
                }
            );

        //Relation Utilisateur <-> Demandes 
        modelBuilder.Entity<Utilisateur>()
            .HasMany(u => u.Demandes)
            .WithOne(d => d.Utilisateur)
            .HasForeignKey(d => d.Id_utilisateur)
            .OnDelete(DeleteBehavior.Cascade);

        //Relation Utilisateur <-> Logements 
        modelBuilder.Entity<Utilisateur>()
            .HasMany(u => u.Logements)
            .WithOne(l => l.Utilisateur)
            .HasForeignKey(l => l.Id_utilisateur)
            .OnDelete(DeleteBehavior.Cascade);

        //Relation Utilisateur <-> Réservations
        modelBuilder.Entity<Utilisateur>()
            .HasMany(u => u.Reservations)
            .WithOne(r => r.utilisateur)
            .HasForeignKey(r => r.Id_utilisateur)
            .OnDelete(DeleteBehavior.Cascade);

        //Relation Logement <-> Réservations
        modelBuilder.Entity<Logement>()
            .HasMany(l => l.Reservations)
            .WithOne(r => r.Logement)
            .HasForeignKey(r => r.Id_logement)
            .OnDelete(DeleteBehavior.Cascade);

        //Relation Logement <-> Équipements
        modelBuilder.Entity<Logement>()
            .HasMany(l => l.Equipements)
            .WithMany(e => e.Logements)
            .UsingEntity<Dictionary<string, object>>(
                "LogementEquipement",
                j => j.HasOne<Equipement>().WithMany().HasForeignKey("Id_equipement"),
                j => j.HasOne<Logement>().WithMany().HasForeignKey("Id_logement"),
                j =>
                {
                    j.HasKey("Id_logement", "Id_equipement");
                    j.ToTable("LogementEquipement");
                }
            );

        //Relation Équipement <-> Catégorie
        modelBuilder.Entity<Categorie>()
            .HasMany(c => c.Equipements)
            .WithOne(e => e.Categorie)
            .HasForeignKey(e => e.Id_categorie)
            .OnDelete(DeleteBehavior.Cascade);
        
    }
    
}
