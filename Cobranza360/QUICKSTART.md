# Quick Start Guide

## 1. Setup Database
```bash
mysql -u root -p < Database/init_script.sql
```

## 2. Run Python Risk Calculator
```bash
cd DataAnalysis
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MySQL credentials
python risk_calculator.py
```

## 3. Run ASP.NET Application
```bash
cd CobranzaWeb
# Edit appsettings.json with your MySQL credentials
dotnet restore
dotnet build
dotnet run
```

## 4. Access the Application
Open your browser and navigate to:
- http://localhost:5000

## Default MySQL Credentials
- Host: localhost
- Database: cobranza360
- User: root
- Password: (your MySQL root password)

## Troubleshooting
- Ensure MySQL is running
- Verify credentials in both .env and appsettings.json
- Check that ports 5000/5001 are available
