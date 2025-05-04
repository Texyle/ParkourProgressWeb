from app.blueprints.maps import bp
from flask import render_template, current_app

@bp.route('')
def map_list():
    # maps = database.fetch_map_list(app)
    
    # victor_subquery = db.aliased(models.Victor)
    # player_subquery = db.aliased(models.Player)
    # stmt = (
    #     db.select(
    #         models.Gamemode.Name.label("Gamemode"),
    #         models.Map.Extra,
    #         models.Map.Name.label("Name"),
    #         models.Map.ID.label("MapID"),
    #         models.Map.Builder,
    #         db.func.count(victor_subquery.MapID).label("VictorCount"),
    #         db.select(models.Victor.PlayerID)
    #         .where(models.Victor.MapID == models.Map.ID)
    #         .order_by(models.Victor.Date.asc())
    #         .limit(1)
    #         .scalar_subquery()
    #         .label("FirstVictorID"),
    #         db.select(models.Player.Name)
    #         .select_from(db.join(models.Victor, models.Player, models.Victor.PlayerID == models.Player.ID))
    #         .where(models.Victor.MapID == models.Map.ID)
    #         .order_by(models.Victor.Date.asc())
    #         .limit(1)
    #         .scalar_subquery()
    #         .label("FirstVictorName"),
    #         db.select(models.Player.CountryCode)
    #         .select_from(db.join(models.Victor, models.Player, models.Victor.PlayerID == models.Player.ID))
    #         .where(models.Victor.MapID == models.Map.ID)
    #         .order_by(models.Victor.Date.asc())
    #         .limit(1)
    #         .scalar_subquery()
    #         .label("FirstVictorCountry")
    #     )
    #     .select_from(
    #         db.join(models.Map, models.Gamemode, models.Gamemode.ID == models.Map.GamemodeID)
    #     )
    #     .where(models.Map.Position > 0)
    #     .group_by(models.Map.ID, models.Gamemode.Name, models.Map.Extra, models.Map.Name, models.Map.Builder)
    #     .order_by(models.Map.Position.asc())
    # )

    # result = db.session.execute(stmt).all()
    
    # return render_template("maps.html", maps=maps, flags=files.flags, map_images=files.map_images, random_image=get_random_img())
    return render_template("maps.html", 
                           maps={}, 
                           flags=[], 
                           map_images=[], 
                           random_image=current_app.get_random_img())

@bp.route('/<int:map_id>')
def map_page(map_id: int):
    # map = database.fetch_map(app, map_id)
    # victors = database.fetch_victors(app, map_id)
    # sections = database.fetch_map_sections(app, map_id)
    # print(sections, flush=True)
    # if map is not None:
    #     return render_template('map.html', map = map, victors = victors, sections = sections)
    # else:
    #     return render_template("notfound.html", random_image=get_random_img())
    return render_template('map.html', 
                           map = {"VideoURL": "", "MapName": "dqwwqdaw"}, 
                           victors = [], 
                           sections = {}, 
                           random_image=current_app.get_random_img())