import os
import json
from flask import Flask, request, jsonify, send_from_directory, render_template, session, url_for, redirect, make_response, g
import py.database.database as database
import re
from py.files import Files
import random
import secrets
from flask_discord import DiscordOAuth2Session
from cryptography.fernet import Fernet
import requests
import pycountry

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
PROJECT_DIR = os.path.dirname(BASE_DIR)  
PAGES_DIR = os.path.join(PROJECT_DIR, "pages")  
IMAGES_DIR = os.path.join(PROJECT_DIR, "images") 
TEMPLATES_DIR = os.path.join(PROJECT_DIR, "templates")

app = Flask(__name__)
app.secret_key = secrets.token_hex(64)
app.config["DISCORD_CLIENT_ID"] = "1218283716200366131"
app.config["DISCORD_CLIENT_SECRET"] = "CP2SZuHf-f4ZVgagFBi_pvXqvymImVD-"
app.config["DISCORD_BOT_TOKEN"] = "MTIxODI4MzcxNjIwMDM2NjEzMQ.GdjgrS.OqmS8ixXmtmmbi8OKbfzGKhdmmLYOxGWvz6nUs"
app.config["PREFERRED_URL_SCHEME"] = "http"
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "true"
files = Files(app.static_folder)    

# @app.route("/login")
# def login():
#     app.config['DISCORD_REDIRECT_URI'] = request.host_url.rstrip("/") + "/callback"
#     print(app.config['DISCORD_REDIRECT_URI'], flush=True)
#     global discord
#     discord = DiscordOAuth2Session(app)
#     return discord.create_session()

@app.route("/login")
def login():
    scheme = request.scheme
    host = request.host
    port = request.environ.get('SERVER_PORT')

    if port:
        host_with_port = f"{host}:{port}" if ':' not in host else host
    else:
        host_with_port = host

    redirect_uri = f"{scheme}://{host_with_port}/callback"
    app.config['DISCORD_REDIRECT_URI'] = redirect_uri

    global discord
    discord = DiscordOAuth2Session(app)
    return discord.create_session()

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

@app.route("/createcookie")
def createcookie():
    ip = request.remote_addr
    discordname = session.get("discordname")
    discordid = session.get("discordid")
    data = json.dumps({"ip": ip, "discordname": discordname, "discordid": discordid})
    encrypted = fernet.encrypt(data.encode()).decode()

    try:
        resp = make_response(redirect(url_for('dashboard')))
        resp.set_cookie("login", encrypted, secure=True, httponly=True, samesite="Strict")
        return resp
    except Exception as e:
        print(f"Error while creating cookie: {e}")
        return "Error", 500

@app.route("/checkcookie")
def checkcookie():
    bs64 = request.cookies.get("login")
    if bs64 is None:
        return None
    
    try:
        decrypted = fernet.decrypt(bs64.encode())
        cookie = json.loads(decrypted)
        if cookie.get("ip") == request.remote_addr:
            return cookie
    except Exception as e:
        print(f"Cookie decoding error: {e}")
    
    return None

@app.route('/callback')
def callback():
    discord.callback()
    user = discord.fetch_user()
    guilds = discord.fetch_guilds()

    staff_role_ids = [
        "921147495374024714",
        "913840524627177573",
        "1222953168208658518",
        "916739439177371688",
        "1244782886595465256"
    ]

    target_guild_id = 913838786947977256

    '''
    if user.id == 269105396587823104:
        return redirect(url_for('dashboard', error="nostaff"))
    '''
    staff = False

    for guild in guilds:
        if guild.id == target_guild_id:
            roles = get_guild_member(guild.id, user.id, app.config.get("DISCORD_BOT_TOKEN"))
            for role in roles:
                if role in staff_role_ids:
                    staff = True
                    break
 
            if staff:
                session['discordname'] = str(user).replace("#0", "")
                session['discordid'] = str(user.id)
                return redirect(url_for('createcookie'))
            else:
                return redirect(url_for('dashboard', error="nostaff"))

    return redirect(url_for('dashboard', error="noguild"))

@app.route("/dashboard", subdomain="/dashboard")
def dashboard():
    cookie = checkcookie()
    error = request.args.get("error")
    # cookie = {"discordname": "texyle", "discordid": "540505831116898305", "pos": "Admin"}
    
    if cookie is not None:
        discordname = cookie.get("discordname")
        discordid = cookie.get("discordid")
        cursor = database.get_cursor(dictionary=True)
        query = "SELECT * FROM Staff WHERE DiscordID = %s"
        cursor.execute(query, (discordid,))
        info = cursor.fetchone()
        cursor.close()
        database.commit()
        if info:
            pos = [key for key, value in info.items() if value == 1]
            otherperms = {key: bool(value) for key, value in info.items() if value in [0, 1]}

            return render_template("dashboard.html", discordname=discordname, pos=pos, discordid=discordid, otherperms=otherperms)
    
    return render_template("stafflogin.html", error=error)

@app.route("/")
def home():
    return render_template("index.html", random_image=get_random_img())

@app.route("/staff")
def staff():
    return render_template("staff.html", random_image=get_random_img())

@app.route("/leaderboard")
def leaderboard():
    return render_template("leaderboard.html", random_image=get_random_img())

@app.route("/leaderboard/players")
def leaderboard1():
    return render_template("playerslb.html", random_image=get_random_img())

@app.route("/leaderboard/country")
def leaderboard2():
    return render_template("countrylb.html", random_image=get_random_img())

@app.route("/maps")
def maps():
    maps = database.fetch_map_list(app)

    return render_template("maps.html", maps=maps, flags=files.flags, map_images=files.map_images, random_image=get_random_img())

@app.route("/profile/player")
def profile():
    player_names = database.fetch_player_names(app)
    gamemodes = database.fetch_gamemodes(app)
    return render_template("profile.html", player_names = player_names, player_data = None, gamemodes = gamemodes, random_image=get_random_img())

@app.route('/profile/player/<player_name>')
def profile_with_playername(player_name):
    player_names = database.fetch_player_names(app)
    
    player_data = database.fetch_player_info(app, player_name)
    maps = database.fetch_completed_maps(app, player_name)
    progress = database.fetch_maps_in_progress(app, player_name)
    gamemodes = database.fetch_gamemodes(app)
    
    if player_data != None:
        return render_template("profile.html", 
                               player_names = player_names, 
                               player_data = player_data, 
                               maps = maps,
                               progress = progress,
                               gamemodes = gamemodes,
                               map_images=files.map_images,
                               flags=files.flags, random_image=get_random_img())
    else:
        return render_template("notfound.html", random_image=get_random_img())

@app.route('/profile/player/<int:player_id>')
def profile_with_player(player_id):
    player_names = database.fetch_player_names(app)
    
    player_data = database.fetch_player_info(app, player_id)
    maps = database.fetch_completed_maps(app, player_id)
    progress = database.fetch_maps_in_progress(app, player_id)
    gamemodes = database.fetch_gamemodes(app)
    
    if player_data != None:
        return render_template("profile.html", 
                               player_names = player_names, 
                               player_data = player_data, 
                               maps = maps,
                               progress = progress,
                               gamemodes = gamemodes,
                               map_images=files.map_images,
                               flags=files.flags, random_image=get_random_img())
    else:
        return render_template("notfound.html", random_image=get_random_img())
    
@app.route("/profile/country")
def country_profile():
    countries = [{'Code': country.alpha_2.lower(), 'Name': country.name} for country in pycountry.countries]
    gamemodes = database.fetch_gamemodes(app)
    return render_template("countryprofile.html", 
                           countries = countries,
                           data = None,
                           gamemodes = gamemodes,
                           map_images=files.map_images,
                           flags=files.flags, random_image=get_random_img())

@app.route("/profile/country/<string:country_code>")
def country_profile_with_country(country_code):
    data = database.fetch_country_profile_data(app, country_code)
    countries = [{'Code': country.alpha_2.lower(), 'Name': country.name} for country in pycountry.countries]
    gamemodes = database.fetch_gamemodes(app)
    return render_template("countryprofile.html", 
                           countries = countries,
                           data = data,
                           map_images=files.map_images,
                           gamemodes = gamemodes,
                           flags=files.flags, random_image=get_random_img()) 

@app.route('/map/<int:map_id>')
def map(map_id):
    map = database.fetch_map(app, map_id)
    victors = database.fetch_victors(app, map_id)
    sections = database.fetch_map_sections(app, map_id)
    print(sections, flush=True)
    if map != None:
        return render_template('map.html', map = map, victors = victors, sections = sections)
    else:
        return render_template("notfound.html", random_image=get_random_img())

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
    return render_template("notfound.html", random_image=get_random_img()), 404

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
