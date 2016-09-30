import sqlite3
conn = sqlite3.connect("example.db")
c = conn.cursor()


for row in c.execute('SELECT * FROM library ORDER BY artist'):
        print(row)

conn.close()