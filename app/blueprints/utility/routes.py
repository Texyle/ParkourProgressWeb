from app.blueprints.utility import bp
from flask import jsonify, current_app

@bp.route("/randomImage")
def random_image():
    random_image = current_app.images.get_random_map_image()

    if not random_image:
        return jsonify({"error": "No images found"}), 404
    
    return jsonify({"image_url": f"{random_image}"})

@bp.route("/mapImage/<string:map_name>")
def map_image(map_name: str):
    image = current_app.images.get_map_image(map_name)
    
    if not image:
        return jsonify({"error": "Map image not found"}), 404

    return jsonify({"image_url": f"{image}"})