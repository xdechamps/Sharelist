import os
path = "/home/eons/Music/"
music = os.listdir(path)
mp3 = []
dir = []
for x in music:
    if ".mp3" in x:
        mp3.append(path+x)
    else:
        dir.append(path+x)

