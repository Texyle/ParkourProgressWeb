import os
from pathlib import Path

class Flags:
    def __init__(self, static_path):
        self.static_path = static_path
        self.flags_path = 'images/flags/'
        self.flags = {}
        self.load()
        
    def load(self):
        self.flags.clear()
        
        path = os.path.join(self.static_path, self.flags_path)
        
        for file_path in Path(path).iterdir():
            if file_path.is_file():
                filename = file_path.stem
                self.flags[filename] = self.flags_path + file_path.name