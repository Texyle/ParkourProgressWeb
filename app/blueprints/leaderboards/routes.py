from app.blueprints.leaderboards import bp
from flask import render_template

@bp.route("")
def leaderboards_initial():
    #return render_template("leaderboard.html", random_image=get_random_img())
    return render_template("player_leaderboards.html")

@bp.route("/players")
def players_leaderboard():
    #return render_template("playerslb.html", random_image=get_random_img())
    return render_template("player_leaderboards.html")

@bp.route("/country")
def country_leaderboards():
    #return render_template("countrylb.html", random_image=get_random_img())
    return render_template("country_leaderboards.html")