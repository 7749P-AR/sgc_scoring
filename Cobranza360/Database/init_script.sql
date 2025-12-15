-- CobranzaApp360 Database Initialization Script
-- Creates database, table, and sample data for testing

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cobranza360;
USE cobranza360;

-- Drop table if exists (for clean reinstall)
DROP TABLE IF EXISTS Deudores;

-- Create Deudores table
CREATE TABLE Deudores (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    MontoDeuda DECIMAL(10,2) NOT NULL,
    DiasRetraso INT NOT NULL DEFAULT 0,
    PrioridadCalculada VARCHAR(20) DEFAULT 'Pendiente',
    EstadoGestion VARCHAR(20) DEFAULT 'Sin Contactar',
    FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prioridad (PrioridadCalculada),
    INDEX idx_estado (EstadoGestion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data for testing
INSERT INTO Deudores (Nombre, MontoDeuda, DiasRetraso, EstadoGestion) VALUES
('Juan Pérez García', 15000.00, 45, 'Sin Contactar'),
('María López Rodríguez', 8500.50, 15, 'Sin Contactar'),
('Carlos Mendoza Silva', 25000.00, 90, 'Sin Contactar'),
('Ana Torres Vega', 3500.00, 5, 'Sin Contactar'),
('Roberto Sánchez Cruz', 12000.00, 60, 'Sin Contactar'),
('Laura Martínez Díaz', 18500.75, 30, 'Sin Contactar'),
('Pedro Ramírez Flores', 5000.00, 120, 'Sin Contactar'),
('Sofia Hernández Ruiz', 22000.00, 10, 'Sin Contactar'),
('Diego Castro Morales', 9500.00, 75, 'Sin Contactar'),
('Carmen Vargas Ortiz', 30000.00, 150, 'Sin Contactar'),
('Luis Fernández Ramos', 4500.00, 3, 'Sin Contactar'),
('Patricia Gómez Luna', 16000.00, 50, 'Sin Contactar');

-- Verify data insertion
SELECT 
    COUNT(*) as TotalDeudores,
    SUM(MontoDeuda) as DeudaTotal,
    AVG(DiasRetraso) as PromedioRetraso
FROM Deudores;

-- Show all debtors
SELECT * FROM Deudores ORDER BY Id;
