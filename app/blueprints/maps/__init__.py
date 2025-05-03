from flask import Blueprint

bp = Blueprint('maps', 
               __name__, 
               template_folder='templates', 
               static_folder='static')

from app.blueprints.maps import routes, filters