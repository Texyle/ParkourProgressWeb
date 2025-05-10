from app.blueprints.home import bp
from datetime import datetime, date

@bp.app_template_filter('format_date')
def format_date(value, format='%b %#d, %Y'):
    if isinstance(value, date) and not isinstance(value, datetime):
        value = datetime(value.year, value.month, value.day)
    if isinstance(value, datetime):
        return value.strftime(format)
    return value