export const fetchLogementById = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5191/api/logements/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Impossible de charger le logement.");
    }

    const data = await res.json();
    console.log("Données du logement avec équipements:", data);
    return data;
};
