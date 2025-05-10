from app.blueprints.maps import bp
import re

@bp.app_template_filter('to_filename')
def to_filename(map_name):
    return re.sub(r'[^a-z0-9]', '', map_name.lower())