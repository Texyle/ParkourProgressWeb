from app.blueprints.staff import bp
from flask import render_template, current_app

@bp.route('')
def staff():
    #return render_template("staff.html", random_image=get_random_img())
    return render_template("staff.html", random_image=current_app.get_random_img())