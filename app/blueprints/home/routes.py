from app.blueprints.home import bp
from flask import render_template
  
@bp.route("")
def home():
    # stmt = (
    #     db.select(models.Victor.Date, models.Victor.MapID, models.Victor.PlayerID, models.Map.Name.label("MapName"), models.Player.Name.label("PlayerName"))
    #     .join(models.Map)
    #     .join(models.Player)
    #     .order_by(models.Victor.Date.desc())
    #     .limit(5)
    # )
    # latest_victors = db.session.execute(stmt).all()
        
    # return render_template("index.html", random_image=get_random_img(), latest_victors=latest_victors)
    return render_template("home.html")