import mysql.connector
from mysql.connector import Error

connection = None

def get_cursor(*args, **kwargs):
    global connection
    
    if connection == None:
        connection = mysql.connector.connect(
            host="193.124.204.44", 
            database="progressbot",
            user="user",
            password="I2F0HN3Ffe")
    
    return connection.cursor(*args, **kwargs)
