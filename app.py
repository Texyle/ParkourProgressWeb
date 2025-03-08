import os
from mysql.connector import Error
from flask import Flask, request, jsonify, send_from_directory, render_template
from datetime import datetime
import py.database as database
import traceback

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
PROJECT_DIR = os.path.dirname(BASE_DIR)  
PAGES_DIR = os.path.join(PROJECT_DIR, "pages")  
IMAGES_DIR = os.path.join(PROJECT_DIR, "images") 

app = Flask(__name__)

@app.route("/home", "/")
def home():
    return render_template("index.html")\

@app.route("/staff")
def staff():
    return render_template("staff.html")

@app.route("/maps")
def maps():
    return render_template("maps.html")

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route('/map/<int:map_id>')
def map(map_id):
    map = database.fetch_map(app, map_id)
    victors = database.fetch_victors(app, map_id)
    if map != None:
        return render_template('map.html', map = map, victors = victors)
    else:
        # return error page
        pass

@app.route("/load_victories", methods=["POST"])
def load_victories():
    data = request.json
    name = data.get("name")
    gamemode = data.get("gamemode")

    if not name and not gamemode:
        return jsonify({"victories": None, "error": "No gamemode provided"}), 400
    
    victories = database.fetch_victor_maps(app, name, gamemode)

    if victories is None:
        return jsonify({"victories": None}), 404
    
    return jsonify(victories), 200

@app.route("/load_progress", methods=["POST"])
def load_progress():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"prog": None}), 400
    
    prog = database.fetch_maps_in_prog(app, name)

    if prog is None:
        return jsonify({"prog": None}), 404
    
    return jsonify(prog), 200

@app.route("/load_player_info", methods=["POST"])
def load_py():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"info": None, "error": "No name provided"}), 400

    info = database.fetch_player_info(app, name)
    
    if info is None:
        return jsonify({"info": None, "error": "Player not found"}), 404

    return jsonify(info), 200 

@app.route("/load_latest", methods=["POST"])
def load_latest():
    victors = database.fetch_latest_victors(app)
    return jsonify({"victors": victors})

@app.route("/load_map", methods=["POST"])
def load_map():
    data = request.json
    name = data.get("id")

    return database.fetch_map(app, id)

@app.route("/load_players", methods=["POST"])
def load_players():
    return jsonify(database.fetch_all_players(app)), 200

@app.route("/load_all_maps", methods=["POST"])
def load_maps():
    return jsonify(database.fetch_all_maps(app)), 200

@app.route("/images/<path:filename>")
def images(filename):
    return send_from_directory(IMAGES_DIR, filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=20000, debug=True)
