import os
from tinytag import TinyTag
path = "D:\Music"   #TODO interactive path with default?
db = "sharelist.db"

import sqlite3
conn = sqlite3.connect(db)
c = conn.cursor()

# Create table
c.execute('''CREATE TABLE if not exists library (artist text, song text, path text)''')

for root, dirs, files in os.walk(path, topdown=True):
    for name in files:
        if ".mp3" in os.path.join(root, name):
            try:
                tag = TinyTag.get(os.path.join(root, name))
                c.execute('''INSERT INTO library(artist, song, path)
                            VALUES(?,?,?)''', (tag.artist,tag.title,os.path.join(root, name)))
            except Exception:
                print("Error with ", os.path.join(root, name))  # TODO Error with mp3 parser regarding 1 song duration

# delete duplicate
c.execute('''DELETE FROM library WHERE rowid NOT IN (SELECT min(rowid) FROM library GROUP BY path)''')

conn.commit()
conn.close()