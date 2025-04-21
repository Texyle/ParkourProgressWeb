from dotenv import load_dotenv
import os

load_dotenv()
        
def get_var(name):
    return os.getenv(name)