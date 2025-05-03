from flask import Blueprint

bp = Blueprint('leaderboards', 
               __name__, 
               template_folder='templates', 
               static_folder='static')

from app.blueprints.leaderboards import routes