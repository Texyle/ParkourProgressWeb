from app.blueprints.dashboard import bp
from flask import render_template

@bp.route("/login")
def login() -> None:
    # scheme = request.scheme
    # host = request.host
    # port = request.environ.get('SERVER_PORT')

    # if port:
    #     host_with_port = f"{host}:{port}" if ':' not in host else host
    # else:
    #     host_with_port = host

    # redirect_uri = f"{scheme}://{host_with_port}/callback"
    # app.config['DISCORD_REDIRECT_URI'] = redirect_uri

    # global discord
    # discord = DiscordOAuth2Session(app)
    # return discord.create_session()
    pass

@bp.route("/createcookie")
def createcookie() -> None:
    # ip = request.remote_addr
    # discordname = session.get("discordname")
    # discordid = session.get("discordid")
    # data = json.dumps({"ip": ip, "discordname": discordname, "discordid": discordid})
    # encrypted = fernet.encrypt(data.encode()).decode()

    # try:
    #     resp = make_response(redirect(url_for('dashboard')))
    #     resp.set_cookie("login", encrypted, secure=True, httponly=True, samesite="Strict")
    #     return resp
    # except Exception as e:
    #     print(f"Error while creating cookie: {e}")
    #     return "Error", 500
    pass

@bp.route("/checkcookie")
def checkcookie() -> None:
    # bs64 = request.cookies.get("login")
    # if bs64 is None:
    #     return None
    
    # try:
    #     decrypted = fernet.decrypt(bs64.encode())
    #     cookie = json.loads(decrypted)
    #     if cookie.get("ip") == request.remote_addr:
    #         return cookie
    # except Exception as e:
    #     print(f"Cookie decoding error: {e}")
    
    # return None
    pass

@bp.route('/callback')
def callback() -> None:
    # discord.callback()
    # user = discord.fetch_user()
    # guilds = discord.fetch_guilds()

    # staff_role_ids = [
    #     "921147495374024714",
    #     "913840524627177573",
    #     "1222953168208658518",
    #     "916739439177371688",
    #     "1244782886595465256"
    # ]

    # target_guild_id = 913838786947977256

    # '''
    # if user.id == 269105396587823104:
    #     return redirect(url_for('dashboard', error="nostaff"))
    # '''
    # staff = False

    # for guild in guilds:
    #     if guild.id == target_guild_id:
    #         roles = get_guild_member(guild.id, user.id, app.config.get("DISCORD_BOT_TOKEN"))
    #         for role in roles:
    #             if role in staff_role_ids:
    #                 staff = True
    #                 break
 
    #         if staff:
    #             session['discordname'] = str(user).replace("#0", "")
    #             session['discordid'] = str(user.id)
    #             return redirect(url_for('createcookie'))
    #         else:
    #             return redirect(url_for('dashboard', error="nostaff"))

    # return redirect(url_for('dashboard', error="noguild"))
    pass

@bp.route("", subdomain="")
def dashboard() -> str:
    # cookie = checkcookie()
    # error = request.args.get("error")
    # # cookie = {"discordname": "texyle", "discordid": "540505831116898305", "pos": "Admin"}
    
    # if cookie is not None:
    #     discordname = cookie.get("discordname")
    #     discordid = cookie.get("discordid")
    #     cursor = database.get_cursor(dictionary=True)
    #     query = "SELECT * FROM Staff WHERE DiscordID = %s"
    #     cursor.execute(query, (discordid,))
    #     info = cursor.fetchone()
    #     cursor.close()
    #     database.commit()
    #     if info:
    #         pos = [key for key, value in info.items() if value == 1]
    #         otherperms = {key: bool(value) for key, value in info.items() if value in [0, 1]}

    #         return render_template("dashboard.html", discordname=discordname, pos=pos, discordid=discordid, otherperms=otherperms)
    
    # return render_template("stafflogin.html", error=error)
    return render_template("dashboard.html", discordname=None, pos=[], discordid=None, otherperms=None)