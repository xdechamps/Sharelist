import sqlite3
conn = sqlite3.connect('/home/eons/PycharmProjects/Sharelist/Linux64/test.db')
c = conn.cursor()

# Create table
#c.execute('''CREATE TABLE testlibrary
#             (artist text, song text, id real, path text)''')

# Insert a row of data
c.execute("INSERT INTO testlibrary VALUES ('Edouard Priem','Louvain-La-Neuve', 000001, '/home/Music/LLN.mp3')")

# Save (commit) the changes
conn.commit()

# We can also close the connection if we are done with it.
# Just be sure any changes have been committed or they will be lost.
conn.close()