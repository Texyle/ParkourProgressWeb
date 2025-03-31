import os
from mysql.connector import Error
from flask import Flask, request, jsonify, send_from_directory, render_template, session, url_for, redirect
from datetime import datetime
import py.database as database
import traceback
import re
from py.files import Files
from jinja2 import Environment, FileSystemLoader
import random
import uuid, secrets
from flask_discord import DiscordOAuth2Session, requires_authorization, Unauthorized
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
PROJECT_DIR = os.path.dirname(BASE_DIR)  
PAGES_DIR = os.path.join(PROJECT_DIR, "pages")  
IMAGES_DIR = os.path.join(PROJECT_DIR, "images") 
TEMPLATES_DIR = os.path.join(PROJECT_DIR, "templates")

app = Flask(__name__)
app.secret_key = secrets.token_hex(64)
app.config["DISCORD_CLIENT_ID"] = "1218283716200366131"
app.config["DISCORD_CLIENT_SECRET"] = "s1E5Lxws6wyyrsajRZznwhAar0AnYBDn"
app.config["DISCORD_REDIRECT_URI"] = "http://127.0.0.1:20000/callback"
app.config["DISCORD_BOT_TOKEN"] = "MTIxODI4MzcxNjIwMDM2NjEzMQ.GdjgrS.OqmS8ixXmtmmbi8OKbfzGKhdmmLYOxGWvz6nUs"
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
files = Files(app.static_folder)
discord = DiscordOAuth2Session(app)

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

@app.route("/login")
def login():
    return discord.create_session()

@app.route('/callback')
def callback():
    discord.callback()
    user = discord.fetch_user()
    print(user)
    guilds = discord.fetch_guilds()

    target_guild_id = 913838786947977256  
    staff_role_ids = ["921147495374024714", "913840524627177573", "1222953168208658518", "916739439177371688", "1244782886595465256"]

    for guild in guilds:
        if guild.id == target_guild_id:
            roles = get_guild_member(guild.id, user.id, app.config.get("DISCORD_BOT_TOKEN"))
            for role in roles:
                if any(role in staff_role_ids for role in roles):
                    token = str(uuid.uuid4())
                    session["token"] = token
                    session["ip"] = request.remote_addr
                    return redirect(url_for('dashboard', token=token))
                else:
                    return redirect(url_for('home', success='False'))

    return redirect(url_for('home', success='False'))

@app.route('/dashboard/<token>')
def dashboard(token):
    user_ip = session.get("ip")
    current_ip = request.remote_addr

    if session.get("token") == token and user_ip == current_ip:
        return render_template('dashboard.html', token=token)
    else:
        return "Prístup zamietnutý: neplatný token alebo IP adresa.", 403
    
@app.route('/invalidate-token', methods=['POST'])
def invalidate_token():
    data = request.get_json()
    token = data.get("token")
    if session.get("token") == token:
        session.pop("token", None)
        session.pop("ip", None)
    return jsonify({"message": "Token deaktivovaný"})

@app.route("/")
def home():
    success = request.args.get("success")
    return render_template("index.html", success=success)

@app.route("/staff")
def staff():
    return render_template("staff.html")

@app.route("/leaderboard")
def leaderboard():
    return render_template("leaderboard.html")

@app.route("/leaderboard/players")
def leaderboard1():
    return render_template("playerslb.html")

@app.route("/leaderboard/country")
def leaderboard2():
    return render_template("countrylb.html")

@app.route("/maps")
def maps():
    maps = database.fetch_map_list(app)

    return render_template("maps.html", maps=maps, flags=files.flags, map_images=files.map_images)

@app.route("/profile/player")
def profile():
    player_names = database.fetch_player_names(app)
    return render_template("profile.html", player_names = player_names, player_data = None)

@app.route('/profile/player/<int:player_id>')
def profile_with_player(player_id):
    player_names = database.fetch_player_names(app)
    
    player_data = database.fetch_player_info(app, player_id)
    maps = database.fetch_completed_maps(app, player_id)
    progress = database.fetch_maps_in_progress(app, player_id)
    
    if player_data != None:
        return render_template("profile.html", 
                               player_names = player_names, 
                               player_data = player_data, 
                               maps = maps,
                               progress = progress,
                               map_images=files.map_images,
                               flags=files.flags)
    else:
        return render_template("notfound.html")
    

@app.route("/profile/country")
def profile2():
    return render_template("countryprofile.html")

@app.route('/map/<int:map_id>')
def map(map_id):
    map = database.fetch_map(app, map_id)
    victors = database.fetch_victors(app, map_id)
    if map != None:
        return render_template('map.html', map = map, victors = victors)
    else:
        return render_template("notfound.html")

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

@app.errorhandler(404)
def page_not_found(error):
    return render_template("notfound.html"), 404

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

def to_filename(map_name):
    # to be used in jinja as a filter
    return re.sub(r'[^a-z0-9]', '', map_name.lower())

if __name__ == "__main__":
    # env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
    # env.filters['to_filename'] = to_filename
    app.add_template_filter(to_filename, 'to_filename')
    
    app.run(host="0.0.0.0", port=20000, debug=True)
