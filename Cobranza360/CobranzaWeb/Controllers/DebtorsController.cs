using Microsoft.AspNetCore.Mvc;
using CobranzaWeb.Models;
using MySql.Data.MySqlClient;
using System.Data;

namespace CobranzaWeb.Controllers
{
    public class DebtorsController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<DebtorsController> _logger;

        public DebtorsController(IConfiguration configuration, ILogger<DebtorsController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Display the main debtors list, ordered by priority
        /// </summary>
        public IActionResult Index()
        {
            var debtors = new List<Debtor>();

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection") 
                    ?? throw new InvalidOperationException("Connection string not found");

                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    // Query to get debtors ordered by priority (Alta -> Media -> Baja)
                    string query = @"
                        SELECT 
                            Id, 
                            Nombre, 
                            MontoDeuda, 
                            DiasRetraso, 
                            PrioridadCalculada, 
                            EstadoGestion,
                            FechaRegistro
                        FROM Deudores
                        ORDER BY 
                            FIELD(PrioridadCalculada, 'Alta', 'Media', 'Baja', 'Pendiente'),
                            DiasRetraso DESC,
                            MontoDeuda DESC";

                    using (var command = new MySqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            debtors.Add(new Debtor
                            {
                                Id = reader.GetInt32("Id"),
                                Nombre = reader.GetString("Nombre"),
                                MontoDeuda = reader.GetDecimal("MontoDeuda"),
                                DiasRetraso = reader.GetInt32("DiasRetraso"),
                                PrioridadCalculada = reader.IsDBNull("PrioridadCalculada") 
                                    ? "Pendiente" 
                                    : reader.GetString("PrioridadCalculada"),
                                EstadoGestion = reader.IsDBNull("EstadoGestion") 
                                    ? "Sin Contactar" 
                                    : reader.GetString("EstadoGestion"),
                                FechaRegistro = reader.IsDBNull("FechaRegistro") 
                                    ? null 
                                    : reader.GetDateTime("FechaRegistro")
                            });
                        }
                    }
                }

                _logger.LogInformation($"Successfully loaded {debtors.Count} debtors");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading debtors from database");
                ViewBag.ErrorMessage = "Error al cargar los datos. Por favor, verifica la conexión a la base de datos.";
            }

            return View(debtors);
        }

        /// <summary>
        /// Update debtor status via AJAX
        /// </summary>
        [HttpPost]
        public IActionResult UpdateStatus(int id, string status)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection")
                    ?? throw new InvalidOperationException("Connection string not found");

                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "UPDATE Deudores SET EstadoGestion = @status WHERE Id = @id";

                    using (var command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@status", status);
                        command.Parameters.AddWithValue("@id", id);

                        int rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            _logger.LogInformation($"Updated status for debtor {id} to {status}");
                            return Json(new { success = true, message = "Estado actualizado correctamente" });
                        }
                    }
                }

                return Json(new { success = false, message = "No se encontró el deudor" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating status for debtor {id}");
                return Json(new { success = false, message = "Error al actualizar el estado" });
            }
        }

        /// <summary>
        /// Get statistics for the dashboard
        /// </summary>
        [HttpGet]
        public IActionResult GetStatistics()
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection")
                    ?? throw new InvalidOperationException("Connection string not found");

                using (var connection = new MySqlConnection(connectionString))
                {
                    connection.Open();

                    string query = @"
                        SELECT 
                            COUNT(*) as TotalDeudores,
                            SUM(MontoDeuda) as DeudaTotal,
                            SUM(CASE WHEN PrioridadCalculada = 'Alta' THEN 1 ELSE 0 END) as PrioridadAlta,
                            SUM(CASE WHEN PrioridadCalculada = 'Media' THEN 1 ELSE 0 END) as PrioridadMedia,
                            SUM(CASE WHEN PrioridadCalculada = 'Baja' THEN 1 ELSE 0 END) as PrioridadBaja
                        FROM Deudores";

                    using (var command = new MySqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return Json(new
                            {
                                totalDeudores = reader.GetInt32("TotalDeudores"),
                                deudaTotal = reader.GetDecimal("DeudaTotal"),
                                prioridadAlta = reader.GetInt32("PrioridadAlta"),
                                prioridadMedia = reader.GetInt32("PrioridadMedia"),
                                prioridadBaja = reader.GetInt32("PrioridadBaja")
                            });
                        }
                    }
                }

                return Json(new { success = false });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting statistics");
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
