from typing import Any
import pycountry
from app.blueprints.profile import bp
from datetime import datetime, date

@bp.app_template_filter('to_country_name')
def to_country_name(code: str) -> Any:
    try:
        country = pycountry.countries.get(alpha_2=code.upper())
        return country.name if country else code
    except Exception:
        return code
    
@bp.app_template_filter('format_date')
def format_date(value: date | datetime, format: str = '%b %#d, %Y') -> Any:
    if isinstance(value, date) and not isinstance(value, datetime):
        value = datetime(value.year, value.month, value.day)
    if isinstance(value, datetime):
        return value.strftime(format)
    return value