from flask import Flask, redirect, url_for
from config import Config
from app.extensions import db
from app.images import Images

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)


    db.init_app(app)
    
    app.images = Images()
    with app.app_context():
        app.images.load_all()


    from app.blueprints.home import bp as home_bp
    app.register_blueprint(home_bp, url_prefix='/home')
    
    from app.blueprints.staff import bp as staff_bp
    app.register_blueprint(staff_bp, url_prefix='/staff')
    
    from app.blueprints.maps import bp as maps_bp
    app.register_blueprint(maps_bp, url_prefix='/maps')
    
    from app.blueprints.profile import bp as profile_bp
    app.register_blueprint(profile_bp, url_prefix='/profile')
    
    from app.blueprints.dashboard import bp as dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    
    from app.blueprints.leaderboards import bp as leaderboards_bp
    app.register_blueprint(leaderboards_bp, url_prefix='/leaderboards')
    
    from app.blueprints.utility import bp as utility_bp
    app.register_blueprint(utility_bp)
    
    
    # Redirect root URL to home blueprint
    @app.route('/')
    def root():
        return redirect(url_for('home.home'))

    return app