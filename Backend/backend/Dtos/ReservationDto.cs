using backend.Entities;

namespace backend.Dtos;

public class ReservationDto
{
    public int Id_reservation { get; set; }
    public DateTime Date_debut { get; set; }
    public DateTime Date_fin { get; set; }
    public string Type_reservation { get; set; }
    public string Statut { get; set; }
    public int Nbr_personnes { get; set; }
    public int Montant_total { get; set; }
    public int Id_logement { get; set; }
    public int Id_utilisateur { get; set; }

    public static ReservationDto ToDto(Reservation reservation)
    {
        return new ReservationDto
        {
            Id_reservation = reservation.Id_reservation,
            Date_debut = reservation.Date_debut,
            Date_fin = reservation.Date_fin,
            Type_reservation = reservation.Type_reservation,
            Statut = reservation.Statut,
            Nbr_personnes = reservation.Nbr_personnes,
            Montant_total = reservation.Montant_total,
            Id_logement = reservation.Id_logement,
            Id_utilisateur = reservation.Id_utilisateur
        };
    }

    public static List<ReservationDto> ToDtos(List<Reservation> reservations)
    {
        return reservations.Select(ToDto).ToList();
    }
}