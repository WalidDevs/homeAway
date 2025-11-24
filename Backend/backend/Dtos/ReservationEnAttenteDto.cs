using backend.Entities;

namespace backend.Dtos;

public class ReservationEnAttenteDto
{
    public int Id_reservation { get; set; }
    public string Nom_locataire { get; set; }
    public string Email_locataire { get; set; }
    public string Date_debut { get; set; }
    public string Date_fin { get; set; }
    public string Statut { get; set; }

    public string LogementDescription { get; set; }
    public string LogementVille { get; set; }
    public byte [] images { get; set; }

    public static ReservationEnAttenteDto FromModel(Reservation reservation)
    {
        return new ReservationEnAttenteDto
        {
            Id_reservation = reservation.Id_reservation,
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

    public static List<ReservationEnAttenteDto> FromModels(List<Reservation> reservations)
    {
        return reservations.Select(FromModel).ToList();
    }
}