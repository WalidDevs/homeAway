using backend.Entities;
namespace backend.Dtos;
public class ReservationEnCoursDto
{
    public int Id_reservation { get; set; }
    public int Id_logement { get; set; }
    public string Nom_locataire { get; set; }
    public string Email_locataire { get; set; }
    public string Date_debut { get; set; }
    public string Date_fin { get; set; }
    public string Statut { get; set; }
    public string LogementDescription { get; set; }
    public string LogementVille { get; set; }
    public byte [] images { get; set; }

    public static ReservationEnCoursDto FromModel(Reservation reservation)
    {
        return new ReservationEnCoursDto
        {
            Id_reservation = reservation.Id_reservation,
            Id_logement = reservation.Id_logement,
            Nom_locataire = reservation.utilisateur.Prenom + " " + reservation.utilisateur.Nom,
            Email_locataire = reservation.utilisateur.Email,
            Date_debut = reservation.Date_debut.ToShortDateString(),
            Date_fin = reservation.Date_fin.ToShortDateString(),
            Statut = reservation.Statut,
            LogementDescription = reservation.Logement.Description,
            LogementVille = reservation.Logement.Ville,
            images = reservation.Logement.Image
        };
    }

    public static List<ReservationEnCoursDto> FromModels(List<Reservation> reservations)
    {
        return reservations.Select(FromModel).ToList();
    }
}