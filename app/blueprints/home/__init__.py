from flask import Blueprint

bp = Blueprint('home', 
               __name__, 
               template_folder='templates', 
               static_folder='static')

from app.blueprints.home import routes, filters