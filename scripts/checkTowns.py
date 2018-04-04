#!/usr/local/bin/python3

from cgitb import enable 
enable()

from cgi import FieldStorage, escape
import pymysql as db

print('Content-Type: text/plain')
print()

form_data = FieldStorage()
town = form_data.getfirst('town')

try :
    connection = db.connect('lhcp1078.webapps.net', 'sa', 'f?E[Hcd;KH7r', 'xd26hahk_Locations')
    cursor = connection.cursor(db.cursors.DictCursor)

    cursor.execute("""SELECT *
                        FROM towns
                        WHERE townName LIKE (%s);""", (town))
    towns = cursor.fetchall()
    f = open('townNames.txt', 'w')
    for townName in towns :        
        f.write(townName)  # python will convert \n to os.linesep
    f.close()  
    print("success")
    connection.close()
    return (towns)
except db.Error :
    print("Error")
