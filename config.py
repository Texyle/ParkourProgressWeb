from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", True)
    FLASK_APP = os.getenv("FLASK_APP", "app")
    FLASK_RUN_HOST = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    FLASK_RUN_PORT = int(os.getenv("FLASK_RUN_PORT", 20000))
    PREFERRED_URL_SCHEME = os.getenv("PREFERRED_URL_SCHEME", "https")
    SECRET_KEY = os.getenv("SECRET_KEY")

    DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
    DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET")
    DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")

    DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "progressbot_test")
    DATABASE_USER = os.getenv("DATABASE_USER", "test")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")