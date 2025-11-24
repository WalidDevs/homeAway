using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace backend.Dtos
{
    public class UpdateLogementDto
    {
        public int Surface { get; set; }
        public string Type_log { get; set; }
        public string? Statut_logement { get; set; }
        public string Description { get; set; }
        public int Prix { get; set; }
        public string Ville { get; set; }
        public IFormFile? Justificatif_domicile { get; set; }
        public List<IFormFile>? Image { get; set; }
        public DateTime Date_dispo_debut { get; set; }
        public DateTime Date_dispo_fin { get; set; }
        public List<int>? Ids_equipements { get; set; }
    }
}