from flask import jsonify
from app.blueprints.dashboard import bp
from app.models.map import Map

@bp.route('load_maps', methods=['GET'])
def load_maps():
    maps = Map.query.all()
    return jsonify([map.to_dict() for map in maps])
    