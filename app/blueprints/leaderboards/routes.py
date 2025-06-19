from app.blueprints.leaderboards import bp
from flask import render_template, current_app

@bp.route("")
def leaderboards_initial() -> str:
    #return render_template("leaderboard.html", random_image=get_random_img())
    return render_template("player_leaderboards.html",
                           random_image=current_app.images.get_random_map_image())

@bp.route("/players")
def players_leaderboard() -> str:
    #return render_template("playerslb.html", random_image=get_random_img())
    return render_template("player_leaderboards.html",
                           random_image=current_app.images.get_random_map_image())

@bp.route("/country")
def country_leaderboards() -> str:
    #return render_template("countrylb.html", random_image=get_random_img())
    return render_template("country_leaderboards.html",
                           random_image=current_app.images.get_random_map_image())