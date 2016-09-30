import sqlite3
conn = sqlite3.connect('/home/eons/PycharmProjects/Sharelist/web/test.db')
c = conn.cursor()

for row in c.execute('SELECT * FROM testlibrary ORDER BY artist'):
        print(row)