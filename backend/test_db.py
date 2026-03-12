import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='MansiMysql@2005',
        database='queueless_db'
    )
    print("✅ Connection successful!")
    connection.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")