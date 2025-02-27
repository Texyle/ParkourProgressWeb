import os
import mysql.connector
from flask import Flask, request, jsonify, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
PROJECT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))  

app = Flask(__name__, static_url_path="", static_folder=PROJECT_DIR)

def check_player_exists(name):
    conn = mysql.connector.connect(
        host="193.124.204.44", 
        database="progressbot",
        user="user",
        password="I2F0HN3Ffe")

    cursor = conn.cursor()
    
    query = "SELECT 1 FROM Player WHERE Name = %s LIMIT 1"
    cursor.execute(query, (name,))
    player = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return player

def load_player_info(name):
    conn = mysql.connector.connect(
        host="193.124.204.44", 
        database="progressbot",
        user="user",
        password="I2F0HN3Ffe")

    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT Player.DiscordID, Player.CountryCode, Player.VisualFlag 
    FROM Player 
    WHERE Player.Name = %s
    """

    cursor.execute(query, (name,))
    info = cursor.fetchone()
    cursor.close()
    conn.close()

    if info is None:
        return None 

    return info

def load_latest_victors():

    conn = mysql.connector.connect(
        host="193.124.204.44", 
        database="progressbot",
        user="user",
        password="I2F0HN3Ffe")

    cursor = conn.cursor()
    
    query = """
    SELECT Player.Name AS PlayerName, Map.Name AS MapName, Victor.Date AS Date FROM Victor
    JOIN Player
    ON Player.ID = Victor.PlayerID
    JOIN Map
    ON Map.ID = Victor.MapID
    ORDER BY Date DESC
    LIMIT 5
    """
    cursor.execute(query)
    victors = cursor.fetchmany(5)
    
    cursor.close()
    conn.close()

    victors_list = [
        {"player_name": row[0], "map_name": row[1], "date": row[2].isoformat()} 
        for row in victors
    ]

    return victors_list

def get_tables():
    conn = mysql.connector.connect(
        host="193.124.204.44", 
        database="progressbot",
        user="user",
        password="I2F0HN3Ffe")

    cursor = conn.cursor()

    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return [table[0] for table in tables]  

@app.route("/check_player", methods=["POST"])
def check_player():
    data = request.json
    name = data.get("name") 

    if not name:
        return jsonify({"exists": False, "error": "No name provided"}), 400

    exists = check_player_exists(name)
    return jsonify({"exists": exists})

@app.route("/load_player_info", methods=["POST"])
def load_py():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"info": None, "error": "No name provided"}), 400

    info = load_player_info(name)
    return jsonify({"info": info})

@app.route("/load_latest", methods=["POST"])
def load_latest():

    victors = load_latest_victors()
    return jsonify({"victors": victors})

@app.route("/")
def home():
    return send_from_directory(PROJECT_DIR, "index.html")

@app.route("/images/<path:filename>")
def images(filename):
    return send_from_directory(os.path.join(PROJECT_DIR, "images"), filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

