using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CobranzaWeb.Models
{
    /// <summary>
    /// Represents a debtor in the collection system
    /// </summary>
    [Table("Deudores")]
    public class Debtor
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El monto de deuda es requerido")]
        [Column(TypeName = "decimal(10,2)")]
        [Display(Name = "Monto de Deuda")]
        [DataType(DataType.Currency)]
        public decimal MontoDeuda { get; set; }

        [Required]
        [Display(Name = "Días de Retraso")]
        public int DiasRetraso { get; set; }

        [StringLength(20)]
        [Display(Name = "Prioridad")]
        public string PrioridadCalculada { get; set; } = "Pendiente";

        [StringLength(20)]
        [Display(Name = "Estado de Gestión")]
        public string EstadoGestion { get; set; } = "Sin Contactar";

        [Display(Name = "Fecha de Registro")]
        public DateTime? FechaRegistro { get; set; }

        /// <summary>
        /// Gets the CSS class for the priority badge
        /// </summary>
        [NotMapped]
        public string PriorityBadgeClass
        {
            get
            {
                return PrioridadCalculada switch
                {
                    "Alta" => "badge-high",
                    "Media" => "badge-medium",
                    "Baja" => "badge-low",
                    _ => "badge-pending"
                };
            }
        }

        /// <summary>
        /// Gets the CSS class for the status badge
        /// </summary>
        [NotMapped]
        public string StatusBadgeClass
        {
            get
            {
                return EstadoGestion switch
                {
                    "Contactado" => "status-contacted",
                    "En Proceso" => "status-inprogress",
                    "Pagado" => "status-paid",
                    _ => "status-pending"
                };
            }
        }
    }
}
