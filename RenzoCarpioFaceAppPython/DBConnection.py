import pyodbc

server = 'rccis700mldbserver.database.windows.net'
database = 'RCCIS700MLIllinoisInmates'
username = 'renzo'
password = 'basic123.'
driver= '{ODBC Driver 17 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
cursor.execute("SELECT TOP 10 lastname, firstname FROM [dbo].[illinoisdocinmates]")
row = cursor.fetchone()
while row:
    print (str(row[0]) + " " + str(row[1]))
    row = cursor.fetchone()

cursor = cnxn.cursor()
cursor.execute(
    "INSERT dbo.faceidinmate (faceid, inmateid) OUTPUT INSERTED.id VALUES ('" + server + "', '" + database + "')")
row = cursor.fetchone()
while row:
    print
    "Inserted Inmate ID : " + str(row[0])
    row = cursor.fetchone()
cnxn.commit()
cnxn.close()