from app.blueprints.maps import bp
from flask import render_template, current_app
from .load_data import load_data

@bp.route('')
def map_list():
    maps = load_data()
        
    return render_template("maps.html", 
                           maps=maps, 
                           flags=current_app.images.flag_images, 
                           map_images=current_app.images.small_map_images, 
                           random_image=current_app.images.get_random_map_image())

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
                           random_image=current_app.images.get_random_map_image())