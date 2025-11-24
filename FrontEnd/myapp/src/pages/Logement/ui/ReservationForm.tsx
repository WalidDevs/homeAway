import { useState } from "react";
import { useCreateReservation } from "../hooks/useCreateReservation";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
type Props = {
    logementId: number;
    prix: number;
};
export const ReservationForm = ({ logementId, prix }: Props) => {
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [nbrPersonnes, setNbrPersonnes] = useState(1);
    const [typeReservation, setTypeReservation] = useState("avec validation");
    const navigate = useNavigate();
    const { mutate: createReservation, isPending } = useCreateReservation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId");
        if (!userId) {
            toast.error("Vous devez être connecté pour réserver.");
            navigate("/login");
            return;
        }

        const nbJours =
            (new Date(dateFin).getTime() - new Date(dateDebut).getTime()) / (1000 * 60 * 60 * 24);

        const total = nbJours * prix;

        createReservation(
            {
                date_debut: dateDebut,
                date_fin: dateFin,
                type_reservation: typeReservation,
                statut: "En attente",
                nbr_personnes: nbrPersonnes,
                montant_total: total,
                id_logement: logementId,
                id_utilisateur: parseInt(userId),
            },
            {
                onSuccess: () => {
                    toast.success("Réservation enregistrée");
                    //setTimeout(() => navigate("/"), 2000);
                },
                onError: (err: any) => {
                    toast.error("Erreur lors de la réservation : " + err.message);
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 text-sm">
            <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full border p-2 rounded"
                required
            />
            <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full border p-2 rounded"
                required
            />
            <input
                type="number"
                value={nbrPersonnes}
                onChange={(e) => setNbrPersonnes(Number(e.target.value))}
                min={1}
                className="w-full border p-2 rounded"
                placeholder="Nombre de personnes"
                required
            />

            <div className="flex items-center gap-2">
                <input
                    type="radio"
                    name="type"
                    id="validation"
                    readOnly
                    checked
                    onChange={() => setTypeReservation("avec validation")}
                />
                <label htmlFor="validation">Avec validation du propriétaire</label>
            </div>

            <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded mt-2"
                disabled={isPending}
            >
                {isPending ? "Réservation en cours..." : "Réserver"}
            </button>
        </form>
    );
};