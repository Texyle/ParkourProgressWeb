from flask import Blueprint

bp = Blueprint('utility', 
               __name__, 
               template_folder='templates', 
               static_folder='static')

from app.blueprints.utility import routes