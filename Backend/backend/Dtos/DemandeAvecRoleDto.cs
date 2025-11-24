namespace backend.Dtos;
public class DemandeAvecRoleDto
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Motif { get; set; }
    public string Statut { get; set; }
    public List<string> RolesActuels { get; set; } = new();
}