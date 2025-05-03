from flask import Blueprint

bp = Blueprint('dashboard', 
               __name__, 
               template_folder='templates', 
               static_folder='static')

from app.blueprints.dashboard import routes