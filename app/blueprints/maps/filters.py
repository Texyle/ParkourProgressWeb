from typing import Any
from app.blueprints.maps import bp
import re
from datetime import datetime, date

@bp.app_template_filter('format_date')
def format_date(value: date | datetime, format: str = '%b %#d, %Y') -> Any:
    if isinstance(value, date) and not isinstance(value, datetime):
        value = datetime(value.year, value.month, value.day)
    if isinstance(value, datetime):
        return value.strftime(format)
    return value

@bp.app_template_filter('to_filename')
def to_filename(map_name: str) -> str:
    return re.sub(r'[^a-z0-9]', '', map_name.lower())