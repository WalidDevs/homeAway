namespace backend.Dtos;
public class LogementFilterDto
{
    public string? Ville { get; set; }
    public string? Type_log { get; set; }
    public int? PrixMin { get; set; }
    public int? PrixMax { get; set; }
    public int? SurfaceMin { get; set; }
    public int? SurfaceMax { get; set; }
    public DateTime? DateDebut { get; set; }
    public DateTime? DateFin { get; set; }
    public List<int>? IdsEquipements { get; set; }
    public string? MotCle { get; set; }
}