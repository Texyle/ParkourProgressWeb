from app.blueprints.dashboard import bp
from flask import render_template

from app.blueprints.dashboard import login
from app.blueprints.dashboard import database

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
    