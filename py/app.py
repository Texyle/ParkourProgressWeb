import os
from mysql.connector import Error
from flask import Flask, request, jsonify, send_from_directory
import pycountry
from datetime import datetime
from database import connection

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
PROJECT_DIR = os.path.dirname(BASE_DIR)  
PAGES_DIR = os.path.join(PROJECT_DIR, "pages")  
IMAGES_DIR = os.path.join(PROJECT_DIR, "images") 

app = Flask(__name__, static_url_path="", static_folder=PROJECT_DIR)

def check_player_exists(name):
    try:
        cursor = connection.get_cursor()
        
        query = "SELECT 1 FROM Player WHERE Name = %s LIMIT 1"
        cursor.execute(query, (name,))
        player = cursor.fetchone()
        
        cursor.close()
        
        return player
    except Error:
        app.logger.error(e.msg)

def load_player_info(name):
    try:
        cursor = connection.get_cursor(dictionary=True)

        query = """
        SELECT Player.DiscordID, Player.CountryCode, Player.Name AS Nick
        FROM Player 
        WHERE Player.Name = %s
        """

        cursor.execute(query, (name,))
        info = cursor.fetchone()
        cursor.close()

        if info is None:
            return None
        
        id = info.get("CountryCode")
        if id == "idk":
            info['CountryCode'] == "Unknown"
        cc = pycountry.countries.get(alpha_2=id)
        info['CountryCode'] = cc.name 

        return info
    except Error as e:
        app.logger.log(e.msg)

def get_maps_in_prog(name):
    try:
        cursor = connection.get_cursor(dictionary=True)

        query = """
        SELECT Map.Name AS MapName, Section.Name AS SectionName
        FROM SectionPlayer
        JOIN Player
        ON Player.ID = SectionPlayer.PlayerID
        JOIN Section
        ON Section.ID = SectionPlayer.SectionID
        JOIN Map
        ON Map.ID = Section.MapID
        WHERE Player.Name = %s
        """

        cursor.execute(query, (name,))
        prog = cursor.fetchall()
        cursor.close()

        if prog is None:
            return None
        
        return prog
    except Error as e:
        app.logger.log(e.msg)
    
def get_victor_maps(*args):
    try:
        cursor = connection.get_cursor(dictionary=True)
        name = args[0]
        gamemode = args[1]

        query = """
        SELECT Map.Name AS MapName, Player.Name AS PlayerName, Victor.Date AS Date, Victor.Fails AS Fails, Map.FailsMessage AS FailsMessage
        FROM Victor
        JOIN Map
        ON Map.ID = Victor.MapID
        JOIN Player
        ON Player.ID = Victor.PlayerID
        JOIN Gamemode
        ON Gamemode.ID = Map.GamemodeID
        WHERE Player.Name = %s
        AND Gamemode.Name = %s
        ORDER BY Date ASC
        """

        cursor.execute(query, (name, gamemode))
        victor = cursor.fetchall()
        cursor.close()

        if victor is None:
            return None
        
        for entry in victor:
            date_obj = entry['Date']
            formatted_date = date_obj.strftime('%b %d, %Y')  
            entry['Date'] = formatted_date  
        
        return victor
    
    except Error as e:
        app.logger.log(e.msg)
        
def load_latest_victors():
    try:
        cursor = connection.get_cursor()
        
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

        victors_list = [
            {"player_name": row[0], "map_name": row[1], "date": row[2].isoformat()} 
            for row in victors
        ]

        return victors_list
    
    except Error as e:
        app.logger.log(e.msg)

@app.route("/check_player", methods=["POST"])
def check_player():
    data = request.json
    name = data.get("name") 

    if not name:
        return jsonify({"exists": False, "error": "No name provided"}), 400

    exists = check_player_exists(name)
    return jsonify({"exists": exists})

@app.route("/load_victories", methods=["POST"])
def load_victories():
    data = request.json
    name = data.get("name")
    gamemode = data.get("gamemode")

    if not name and not gamemode:
        return jsonify({"victories": None, "error": "No gamemode provided"}), 400
    
    victories = get_victor_maps(name, gamemode)

    if victories is None:
        return jsonify({"victories": None}), 404
    
    return jsonify(victories), 200

@app.route("/load_progress", methods=["POST"])
def load_progress():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"prog": None}), 400
    
    prog = get_maps_in_prog(name)

    if prog is None:
        return jsonify({"prog": None}), 404
    
    return jsonify(prog), 200

@app.route("/load_player_info", methods=["POST"])
def load_py():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"info": None, "error": "No name provided"}), 400

    info = load_player_info(name)
    
    if info is None:
        return jsonify({"info": None, "error": "Player not found"}), 404

    return jsonify(info), 200 

@app.route("/load_latest", methods=["POST"])
def load_latest():

    victors = load_latest_victors()
    return jsonify({"victors": victors})

@app.route("/")
def home():
    return send_from_directory(PAGES_DIR, "index.html")

@app.route("/images/<path:filename>")
def images(filename):
    return send_from_directory(IMAGES_DIR, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=20000, debug=True)
