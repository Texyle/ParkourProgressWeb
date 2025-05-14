from dotenv import load_dotenv
import os
from sqlalchemy.engine import URL

load_dotenv()

class Config:
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "False") == "True"
    FLASK_RUN_HOST = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    FLASK_RUN_PORT = int(os.getenv("FLASK_RUN_PORT", 20000))
    PREFERRED_URL_SCHEME = os.getenv("PREFERRED_URL_SCHEME", "https")
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_ECHO = os.getenv("SQLALCHEMY_ECHO", "False") == "True"

    DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
    DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET")
    DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")

    DATABASE_LOCAL = os.getenv("DATABASE_LOCAL", "False") == "True"

    if DATABASE_LOCAL:
        SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    else:
        DATABASE_USER = os.getenv("DATABASE_USER")
        DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
        DATABASE_HOST = os.getenv("DATABASE_HOST")
        DATABASE_NAME = os.getenv("DATABASE_NAME")
        if all([DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_NAME]):
            SQLALCHEMY_DATABASE_URI = URL.create(
                "mysql+mysqlconnector",
                username=DATABASE_USER,
                password=DATABASE_PASSWORD,
                host=DATABASE_HOST,
                database=DATABASE_NAME
            )
        else:
            raise RuntimeError("Missing database variables in .env")