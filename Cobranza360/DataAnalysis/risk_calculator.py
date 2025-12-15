"""
CobranzaApp360 - Risk Calculator
Connects to MySQL, calculates risk scores for debtors, and updates priority levels.

Algorithm:
- Debt Amount (30%): Higher debt = higher priority
- Days Overdue (50%): More days overdue = higher priority  
- Payment History (20%): Based on current status

Priority Levels:
- Alta: Score >= 70
- Media: Score >= 40 and < 70
- Baja: Score < 40
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'cobranza360'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'port': int(os.getenv('DB_PORT', '3306'))
}

def calculate_risk_score(monto_deuda, dias_retraso):
    """
    Calculate risk score based on debt amount and days overdue.
    
    Args:
        monto_deuda (float): Debt amount
        dias_retraso (int): Days overdue
    
    Returns:
        float: Risk score (0-100)
    """
    # Convert to float to handle Decimal types from MySQL
    monto_deuda = float(monto_deuda)
    dias_retraso = int(dias_retraso)
    
    # Normalize debt amount (assuming max debt of 50000)
    debt_score = min((monto_deuda / 50000) * 100, 100) * 0.30
    
    # Normalize days overdue (assuming max 180 days)
    overdue_score = min((dias_retraso / 180) * 100, 100) * 0.50
    
    # Payment history score (simplified - can be enhanced)
    # For now, we give a base score of 20% based on overdue status
    if dias_retraso == 0:
        history_score = 0
    elif dias_retraso <= 30:
        history_score = 10
    elif dias_retraso <= 60:
        history_score = 15
    else:
        history_score = 20
    
    total_score = debt_score + overdue_score + history_score
    return round(total_score, 2)

def get_priority_level(score):
    """
    Determine priority level based on risk score.
    
    Args:
        score (float): Risk score
    
    Returns:
        str: Priority level (Alta, Media, Baja)
    """
    if score >= 70:
        return 'Alta'
    elif score >= 40:
        return 'Media'
    else:
        return 'Baja'

def connect_to_database():
    """
    Establish connection to MySQL database.
    
    Returns:
        connection: MySQL connection object or None
    """
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print(f"✓ Connected to MySQL database: {DB_CONFIG['database']}")
            return connection
    except Error as e:
        print(f"✗ Error connecting to MySQL: {e}")
        return None

def update_risk_scores(connection):
    """
    Read debtors, calculate risk scores, and update priority levels.
    
    Args:
        connection: MySQL connection object
    """
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Fetch all debtors
        cursor.execute("SELECT Id, Nombre, MontoDeuda, DiasRetraso FROM Deudores")
        deudores = cursor.fetchall()
        
        print(f"\n📊 Processing {len(deudores)} debtors...\n")
        
        updated_count = 0
        
        for deudor in deudores:
            # Calculate risk score
            score = calculate_risk_score(deudor['MontoDeuda'], deudor['DiasRetraso'])
            priority = get_priority_level(score)
            
            # Update database
            update_query = """
                UPDATE Deudores 
                SET PrioridadCalculada = %s 
                WHERE Id = %s
            """
            cursor.execute(update_query, (priority, deudor['Id']))
            
            # Log the update
            print(f"ID: {deudor['Id']:2d} | {deudor['Nombre']:25s} | "
                  f"Deuda: ${deudor['MontoDeuda']:10,.2f} | "
                  f"Días: {deudor['DiasRetraso']:3d} | "
                  f"Score: {score:5.2f} | "
                  f"Prioridad: {priority}")
            
            updated_count += 1
        
        # Commit changes
        connection.commit()
        
        print(f"\n✓ Successfully updated {updated_count} debtors")
        
        # Show summary statistics
        cursor.execute("""
            SELECT 
                PrioridadCalculada,
                COUNT(*) as Cantidad,
                SUM(MontoDeuda) as DeudaTotal
            FROM Deudores
            GROUP BY PrioridadCalculada
            ORDER BY FIELD(PrioridadCalculada, 'Alta', 'Media', 'Baja')
        """)
        
        summary = cursor.fetchall()
        
        print("\n" + "="*60)
        print("RESUMEN POR PRIORIDAD")
        print("="*60)
        
        for row in summary:
            print(f"{row['PrioridadCalculada']:10s} | "
                  f"Cantidad: {row['Cantidad']:2d} | "
                  f"Deuda Total: ${row['DeudaTotal']:,.2f}")
        
        print("="*60)
        
    except Error as e:
        print(f"✗ Error updating risk scores: {e}")
        connection.rollback()
    finally:
        cursor.close()

def main():
    """Main execution function."""
    print("="*60)
    print("CobranzaApp360 - Risk Score Calculator")
    print("="*60)
    print(f"Execution Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    # Connect to database
    connection = connect_to_database()
    
    if connection:
        try:
            # Update risk scores
            update_risk_scores(connection)
        finally:
            # Close connection
            if connection.is_connected():
                connection.close()
                print("\n✓ Database connection closed")
    else:
        print("\n✗ Failed to connect to database. Please check your configuration.")
        print(f"   Host: {DB_CONFIG['host']}")
        print(f"   Database: {DB_CONFIG['database']}")
        print(f"   User: {DB_CONFIG['user']}")

if __name__ == "__main__":
    main()
