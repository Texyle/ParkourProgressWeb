from flask import Blueprint

bp = Blueprint('staff', 
               __name__, 
               template_folder='templates', 
               static_folder='static')

from app.blueprints.staff import routes