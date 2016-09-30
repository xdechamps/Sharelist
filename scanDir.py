import os
path = "D:\Music"
music = os.listdir(path)
mp3 = []
dir = []
for x in music:
    if ".mp3" in x:
        mp3.append(path+x)
    else:
        dir.append(path+x)

for root, dirs, files in os.walk("D:\Music", topdown=True):
    for name in files:
        if ".mp3" in os.path.join(root, name):
            print(os.path.join(root, name))