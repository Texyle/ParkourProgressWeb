from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()
        
def get_var(name: str) -> Optional[str]:
    """Get the value of an environment variable."""
    return os.getenv(name)