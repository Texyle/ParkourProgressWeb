from app.blueprints.home import bp
from flask import render_template, current_app
from app.models.victor import Victor
from app.extensions import db
  
@bp.route("")
def home():
    latest_victors = (
        Victor.query
        .options(
            db.joinedload(Victor.map),
            db.joinedload(Victor.player)
        )
        .order_by(Victor.Date.desc())
        .limit(5)
        .all()
    )
    
    return render_template("home.html", 
                           random_image = current_app.images.get_random_map_image(),
                           latest_victors = latest_victors)