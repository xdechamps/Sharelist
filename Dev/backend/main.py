import tkinter as tk
from tkinter import filedialog
import os
from tinytag import TinyTag
import sqlite3
import time

root = tk.Tk()
root.withdraw()
file_path = filedialog.askdirectory()
db = "sharelist.db"
print(db)

start_time = time.time()

conn = sqlite3.connect(db)
c = conn.cursor()

# Create table
c.execute('''CREATE TABLE IF NOT EXISTS library (artist TEXT, song TEXT, path TEXT)''')
c.execute('''CREATE TABLE IF NOT EXISTS playlist (id real, vote real, position real)''')


for root, dirs, files in os.walk(file_path, topdown=True):
    for name in files:
        if ".mp3" in os.path.join(root, name):
            try:
                tag = TinyTag.get(os.path.join(root, name))
                c.execute('''INSERT INTO library(artist, song, path)
                            VALUES(?,?,?)''', (tag.artist, tag.title, os.path.join(root, name)))
            except Exception:
                print("Error with ", os.path.join(root, name))  # TODO Error with mp3 parser regarding 1 song duration

# delete duplicate
c.execute('''DELETE FROM library WHERE rowid NOT IN (SELECT min(rowid) FROM library GROUP BY path)''')

for row in c.execute('''SELECT * FROM library ORDER BY artist'''):
        print(row)

conn.commit()
conn.close()


print("\n--- %s seconds ---" % (time.time() - start_time))
