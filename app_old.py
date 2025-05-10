# OLD CODE, LEAVING FOR FUTURE REFERENCE

import os
import json
from flask import Flask, request, jsonify, send_from_directory, render_template, session, url_for, redirect, make_response
import app.database.database as database
from app.database.db import db, init_db
import app.database.models as models
import re
from app.files import Files
from app.env import get_var
import random
import secrets
from flask_discord import DiscordOAuth2Session
from cryptography.fernet import Fernet
import requests
import pycountry
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
PROJECT_DIR = os.path.dirname(BASE_DIR)  
PAGES_DIR = os.path.join(PROJECT_DIR, "pages")  
IMAGES_DIR = os.path.join(PROJECT_DIR, "images") 
TEMPLATES_DIR = os.path.join(PROJECT_DIR, "templates")

files = Files(app.static_folder)

def load_key():
    cursor = database.get_cursor()
    cursor.execute("SELECT Fernet FROM Credentials LIMIT 1")
    row = cursor.fetchone()
    cursor.close()
    return row[0] if row else None

def save_key():
    key = load_key()
    if key is None:
        key = Fernet.generate_key()
        cursor = database.get_cursor()
        cursor.execute("INSERT INTO Credentials (Fernet) VALUES (%s)", (key,))
        database.commit()
        cursor.close()
    return key

key = save_key()
fernet = Fernet(key)
app.jinja_env.globals['get_player_id'] = database.get_player_id

def get_guild_member(guild_id, user_id, bot_token):
    url = f"https://discord.com/api/v10/guilds/{guild_id}/members/{user_id}"
    headers = {
        "Authorization": f"Bot {bot_token}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("roles")
    else:
        return None
    
def get_random_img():
    files = [f for f in os.listdir("static/images/maps") if f.endswith((".jpg", ".png", ".jpeg", ".gif"))]
    return random.choice(files) if files else "space.jpg"

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

@app.route("/random-image")
def random_image():
    image_folder = "static/images/maps"
    images = [f for f in os.listdir(image_folder) if f.endswith(("jpg", "png", "webp"))]
    
    if not images:
        return jsonify({"error": "No images found"}), 404

    random_image = random.choice(images)
    return jsonify({"image_url": f"/static/images/maps/{random_image}"})

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

# @app.route("/load_latest", methods=["POST"])
# def load_latest():
#     victors = database.fetch_latest_victors(app)
#     return jsonify({"victors": victors})

@app.route("/load_map", methods=["POST"])
def load_map():
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

@app.errorhandler(404)
def page_not_found(error):
    return render_template("notfound.html", random_image=get_random_img()), 404

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

# if __name__ == "__main__":
#     init_db(app)
#     db.init_app(app)
#     with app.app_context():
#         db.create_all()
    
#     # env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
#     # env.filters['to_filename'] = to_filename
#     app.add_template_filter(to_filename, 'to_filename')
#     app.add_template_filter(format_date, 'format_date')
    
#     port = get_var("PORT")
#     if port is not None:
#         app.run(host="0.0.0.0", port=int(port))
