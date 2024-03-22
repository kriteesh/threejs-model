#sort files according to their date modified in ascending order and then name them in alphabetic order
#ask user for the name of the folder, folder and script folder belong to same directory
#write in strongly typed python code
import os
import shutil
import time

#ask user for the name of the folder
folder_name = input("Enter the name of the folder: ")
#check if the folder exists
if os.path.exists(folder_name):
    #get the list of files in the folder
    files = os.listdir(folder_name)
    #sort the files according to their date modified in ascending order
    files.sort(key = lambda x: os.path.getmtime(os.path.join(folder_name, x)))
    #name the files in alphabetic order
    for index, file in enumerate(files):
        #get the file extension
        file_extension = os.path.splitext(file)[1]
        #get the file name
        file_name = os.path.splitext(file)[0]
        #name the file
        os.rename(os.path.join(folder_name, file), os.path.join(folder_name, str(index+1) + file_extension))



        

