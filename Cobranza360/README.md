# 💼 CobranzaApp360

Un portal web moderno para agentes de cobranza que prioriza automáticamente a los deudores según su probabilidad de pago, calculada mediante algoritmos de análisis de riesgo en Python.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![.NET](https://img.shields.io/badge/.NET-6.0-purple.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)

## 🌟 Características

- **Análisis Inteligente de Riesgo**: Script Python que calcula automáticamente la prioridad de cada deudor
- **Interfaz Moderna**: Diseño oscuro con gradientes vibrantes y animaciones suaves
- **Búsqueda en Tiempo Real**: Filtra deudores instantáneamente por nombre, prioridad o estado
- **Actualización de Estado**: Cambia el estado de gestión de cada deudor con AJAX
- **Dashboard Estadístico**: Visualiza métricas clave de tu cartera de cobranza
- **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil

## 🏗️ Arquitectura del Proyecto

```
/Cobranza360
│
├── /CobranzaWeb (ASP.NET Core MVC)
│   ├── /Controllers
│   │   └── DebtorsController.cs
│   ├── /Models
│   │   └── Debtor.cs
│   ├── /Views
│   │   └── /Debtors
│   │       └── Index.cshtml
│   ├── /wwwroot
│   │   ├── /css
│   │   │   └── site.css
│   │   └── /js
│   │       └── site.js
│   ├── Program.cs
│   ├── appsettings.json
│   └── CobranzaWeb.csproj
│
├── /DataAnalysis (Python)
│   ├── risk_calculator.py
│   ├── requirements.txt
│   └── .env.example
│
└── /Database
    └── init_script.sql
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **MySQL 8.0+** - Base de datos
- **.NET 6.0 SDK** - Framework web
- **Python 3.8+** - Script de análisis
- **Visual Studio 2022** o **VS Code** (opcional)

### Paso 1: Configurar la Base de Datos

1. Inicia MySQL Server
2. Ejecuta el script de inicialización:

```bash
mysql -u root -p < Database/init_script.sql
```

Esto creará:
- Base de datos `cobranza360`
- Tabla `Deudores` con 12 registros de prueba

### Paso 2: Configurar el Script Python

1. Navega a la carpeta DataAnalysis:

```bash
cd DataAnalysis
```

2. Crea un entorno virtual (recomendado):

```bash
python -m venv venv
venv\Scripts\activate  # En Windows
# source venv/bin/activate  # En Linux/Mac
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

4. Copia y configura el archivo de entorno:

```bash
copy .env.example .env
```

5. Edita `.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_NAME=cobranza360
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_PORT=3306
```

### Paso 3: Ejecutar el Calculador de Riesgo

```bash
python risk_calculator.py
```

Verás una salida similar a:

```
============================================================
CobranzaApp360 - Risk Score Calculator
============================================================
✓ Connected to MySQL database: cobranza360

📊 Processing 12 debtors...

ID:  1 | Juan Pérez García      | Deuda: $ 15,000.00 | Días:  45 | Score: 45.50 | Prioridad: Media
ID:  2 | María López Rodríguez  | Deuda: $  8,500.50 | Días:  15 | Score: 22.10 | Prioridad: Baja
...

✓ Successfully updated 12 debtors
```

### Paso 4: Configurar la Aplicación ASP.NET

1. Navega a la carpeta CobranzaWeb:

```bash
cd CobranzaWeb
```

2. Edita `appsettings.json` con tu conexión MySQL:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=cobranza360;User=root;Password=tu_password_aqui;"
  }
}
```

3. Restaura los paquetes NuGet:

```bash
dotnet restore
```

4. Compila el proyecto:

```bash
dotnet build
```

### Paso 5: Ejecutar la Aplicación Web

```bash
dotnet run
```

La aplicación estará disponible en:
- **HTTP**: http://localhost:5000
- **HTTPS**: https://localhost:5001

## 📊 Algoritmo de Cálculo de Riesgo

El script Python calcula un puntaje de riesgo (0-100) basado en:

| Factor | Peso | Descripción |
|--------|------|-------------|
| **Monto de Deuda** | 30% | Deudas mayores = mayor prioridad |
| **Días de Retraso** | 50% | Más días atrasados = mayor prioridad |
| **Historial de Pago** | 20% | Basado en el estado actual |

### Clasificación de Prioridad

- **Alta** (🔴): Score ≥ 70 - Requiere atención inmediata
- **Media** (🟡): Score ≥ 40 y < 70 - Seguimiento regular
- **Baja** (🟢): Score < 40 - Monitoreo básico

## 🎨 Características de la Interfaz

### Dashboard Estadístico
- Total de deudores
- Deuda total acumulada
- Distribución por prioridad

### Tabla Interactiva
- **Búsqueda en tiempo real** por nombre
- **Filtros** por prioridad y estado
- **Actualización de estado** con AJAX
- **Badges de color** para visualización rápida
- **Animaciones suaves** al interactuar

### Diseño Moderno
- Tema oscuro con gradientes vibrantes
- Efectos de glassmorphismo
- Tipografía Inter de Google Fonts
- Totalmente responsivo

## 🔄 Flujo de Trabajo Típico

1. **Ejecutar el script Python** para calcular prioridades (diario o según necesidad)
2. **Abrir el portal web** para ver la lista ordenada
3. **Filtrar** por prioridad alta para enfocarse en casos urgentes
4. **Actualizar estados** conforme se contacta a los deudores
5. **Repetir** el proceso regularmente

## 🛠️ Tecnologías Utilizadas

### Backend
- **ASP.NET Core 6.0 MVC** - Framework web
- **Pomelo.EntityFrameworkCore.MySql** - ORM para MySQL
- **MySql.Data** - Conector MySQL

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript (Vanilla)** - Interactividad
- **Google Fonts (Inter)** - Tipografía

### Análisis de Datos
- **Python 3.8+** - Lenguaje de scripting
- **mysql-connector-python** - Conector MySQL
- **python-dotenv** - Gestión de configuración

### Base de Datos
- **MySQL 8.0** - Sistema de gestión de base de datos

## 📝 Personalización

### Modificar el Algoritmo de Riesgo

Edita `DataAnalysis/risk_calculator.py`, función `calculate_risk_score()`:

```python
def calculate_risk_score(monto_deuda, dias_retraso):
    # Ajusta los pesos según tus necesidades
    debt_score = min((monto_deuda / 50000) * 100, 100) * 0.30  # 30%
    overdue_score = min((dias_retraso / 180) * 100, 100) * 0.50  # 50%
    history_score = 20  # 20%
    
    return debt_score + overdue_score + history_score
```

### Cambiar Colores del Tema

Edita `CobranzaWeb/wwwroot/css/site.css`, sección `:root`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-purple: #667eea;
    /* Modifica según tu marca */
}
```

## 🐛 Solución de Problemas

### Error de Conexión a MySQL

```
Error: Unable to connect to MySQL server
```

**Solución**: Verifica que MySQL esté corriendo y las credenciales sean correctas.

### Error al Ejecutar el Script Python

```
ModuleNotFoundError: No module named 'mysql'
```

**Solución**: Instala las dependencias:
```bash
pip install -r requirements.txt
```

### La Aplicación ASP.NET No Inicia

```
Error: Unable to bind to https://localhost:5001
```

**Solución**: El puerto puede estar en uso. Cambia el puerto en `Properties/launchSettings.json`.

## 📈 Mejoras Futuras

- [ ] Autenticación de usuarios
- [ ] Historial de gestiones por deudor
- [ ] Exportación a Excel/PDF
- [ ] Gráficos de tendencias
- [ ] Notificaciones push
- [ ] API REST para integración con otros sistemas
- [ ] Machine Learning para predicción de pagos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado como proyecto demostrativo de integración ASP.NET + Python + MySQL.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**¡Disfruta usando CobranzaApp360!** 💼✨
