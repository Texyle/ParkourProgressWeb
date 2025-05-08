from app.blueprints.profile import bp
from flask import render_template, current_app
from .load_data import *
import pycountry

@bp.route("/player")
def player_profile_initial():
    player_names = load_player_names()
    
    return render_template("player_profile.html", 
                           player_names = player_names, 
                           player = None,
                           gamemodes = [], 
                           random_image=current_app.images.get_random_map_image())

# not sure if this is needed, but keeping it for now
# @bp.route('/player/<player_name>')
# def player_profile(player_name: str):
#     #player_names = database.fetch_player_names(app)
#     players = db.session.execute(db.select(models.Player)).scalars().all()
#     players = [player.to_dict() for player in players]
    
#     player_data = database.fetch_player_info(app, player_name)
#     maps = database.fetch_completed_maps(app, player_name)
#     progress = database.fetch_maps_in_progress(app, player_name)
#     gamemodes = database.fetch_gamemodes(app)
    
#     if player_data is not None:
#         return render_template("profile.html", 
#                                players = players, 
#                                player_data = player_data, 
#                                maps = maps,
#                                progress = progress,
#                                gamemodes = gamemodes,
#                                map_images=files.map_images,
#                                flags=files.flags, random_image=get_random_img())
#     else:
#         return render_template("notfound.html", random_image=get_random_img())

@bp.route('/player/<int:player_id>')
def player_profile(player_id: int):
    player_names = load_player_names()
    player = load_player(player_id)
    gamemodes = load_gamemodes()

    return render_template("player_profile.html", 
                           player_names = player_names, 
                           player = player,
                           player_name = player.Name,
                           player_discord = player.DiscordID,
                           player_data = None, 
                           gamemodes = gamemodes, 
                           map_images=current_app.images.small_map_images,
                           random_image=current_app.images.get_random_map_image(),
                           flags=current_app.images.flag_images)
    
@bp.route("/country")
def country_profile_initial():
    countries = [{'Code': country.alpha_2.lower(), 'Name': country.name} for country in pycountry.countries]
    stats = load_stats()
#     gamemodes = database.fetch_gamemodes(app)
#     return render_template("countryprofile.html", 
#                            countries = countries,
#                            data = None,
#                            gamemodes = gamemodes,
#                            map_images=files.map_images,
#                            flags=files.flags, random_image=get_random_img())
    return render_template("country_profile.html", 
                           countries = countries,
                           stats = None,
                           data = None,
                           gamemodes = [],
                           map_images = [],
                           flags=current_app.images.flag_images,
                           random_image=current_app.images.get_random_map_image())

@bp.route("/country/<string:country_code>")
def country_profile(country_code: str):
#     if country_code.lower() not in [country.alpha_2.lower() for country in pycountry.countries]:
#         return render_template("notfound.html", random_image=get_random_img())
#     data = database.fetch_country_profile_data(app, country_code)
#     countries = [{'Code': country.alpha_2.lower(), 'Name': country.name} for country in pycountry.countries]
#     gamemodes = database.fetch_gamemodes(app)
#     return render_template("countryprofile.html", 
#                            countries = countries,
#                            data = data,
#                            map_images=files.map_images,
#                            gamemodes = gamemodes,
#                            flags=files.flags, random_image=get_random_img())
    countries = [{'Code': country.alpha_2.lower(), 'Name': country.name} for country in pycountry.countries]
    stats = load_stats(country_code)
    players = load_players(country_code)
    country_name = next((country['Name'] for country in countries if country['Code'] == country_code.lower()), None)
    
    return render_template("country_profile.html", 
                            data = None,
                            country_code = country_code,
                            country_name = country_name,
                            stats = stats,
                            players = players,
                            countries = countries,
                            gamemodes = [],
                            map_images = [],
                            flags=current_app.images.flag_images,
                            random_image=current_app.images.get_random_map_image())