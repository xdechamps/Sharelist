# import os, tkinter
# class Actions:
#
#     def openfile(self): #open the file
#         directory = tkinter.fileDialog.askdirectory(initialdir='.')
#         print(directory)
#
#
#     def body(self):
#         Label (text='Please select a directory').pack(side=TOP,padx=10,pady=10)
# ======== Select a directory:

import tkinter, tkFileDialog as filedialog

root = tkinter.Tk()
dirname = tkinter.fileDialog.askdirectory(parent=root,initialdir="/",title='Please select a directory')
if len(dirname ) > 0:
    print("You chose %s" % dirname)