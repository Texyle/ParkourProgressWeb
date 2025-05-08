import pycountry
from app.blueprints.profile import bp

@bp.app_template_filter('to_country_name')
def to_country_name(code):
    try:
        country = pycountry.countries.get(alpha_2=code.upper())
        return country.name if country else code
    except Exception:
        return code