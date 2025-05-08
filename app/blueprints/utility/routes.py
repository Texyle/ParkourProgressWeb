from app.blueprints.utility import bp
from flask import jsonify, current_app

@bp.route("/randomImage")
def random_image():
    random_image = current_app.images.get_random_map_image()

    if not random_image:
        return jsonify({"error": "No images found"}), 404

    return jsonify({"image_url": f"{random_image}"})