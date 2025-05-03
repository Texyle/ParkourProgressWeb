from app.blueprints.staff import bp
from flask import render_template

@bp.route('')
def staff():
    #return render_template("staff.html", random_image=get_random_img())
    return render_template("staff.html")