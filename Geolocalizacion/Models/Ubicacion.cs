using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Geolocalizacion.Models
{
    public class Ubicacion
    {
        [Key]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longuitud { get; set; }
        public int Temperatura { get; set; }
        public int Humedad { get; set; }
        public bool Estado { get; set; }
        public DateTime FechaRegistro { get; set; }
        public DateTime FechaActualizacion { get; set; }
    }
}
