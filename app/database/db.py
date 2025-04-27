from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL
from app.env import get_var

db = SQLAlchemy()

def init_db(app: Flask):
    url = URL.create(
        "mysql",
        username=get_var("DATABASE_USER"),
        password=get_var("DATABASE_PASSWORD"),
        host=get_var("DATABASE_HOST"),
        database=get_var("DATABASE_NAME")
    )
    
    app.config["SQLALCHEMY_DATABASE_URI"] = url
    
