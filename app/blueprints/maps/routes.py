from app.blueprints.maps import bp
from flask import render_template, current_app
from .load_data import load_all_maps, load_map

@bp.route('')
def map_list():
    maps = load_all_maps()
        
    return render_template("maps.html", 
                           maps=maps, 
                           flags=current_app.images.flag_images, 
                           map_images=current_app.images.small_map_images, 
                           random_image=current_app.images.get_random_map_image())

@bp.route('/<int:map_id>')
def map_page(map_id: int):
    map = load_map(map_id)
    
    if map is not None:
        return render_template('map.html', 
                            map = map, 
                            random_image=current_app.images.get_random_map_image())
    else:
        return render_template("notfound.html", random_image=current_app.images.get_random_map_image())