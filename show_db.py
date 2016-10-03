import sqlite3
conn = sqlite3.connect("example.db")
c = conn.cursor()

c.execute('''DELETE FROM library WHERE rowid NOT IN (SELECT min(rowid) FROM library GROUP BY path)''')

for row in c.execute('''SELECT * FROM library WHERE artist = 'Linkin Park' ORDER BY song'''):
        print(row)

conn.close()