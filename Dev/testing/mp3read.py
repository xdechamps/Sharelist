from tinytag import TinyTag
tag = TinyTag.get('//home/eons/Music/Dandy Animals/Another Messiah.mp3')
#print('This track %s is by %s.' % tag.title tag.artist)
print("This track is \"{title}\" by \"{artist}\"".format(title=tag.title,artist=tag.artist))
print('It is %f seconds long.' % tag.duration)