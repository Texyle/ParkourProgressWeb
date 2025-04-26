import os
from pathlib import Path

class Files:
    def __init__(self, static_path):
        self.static_path = static_path
        self.flags = {}
        self.map_images = {}
        
        self.load_flags()
        self.load_map_images()

    def load_flags(self):
        self.flags.clear()
        
        flags_path = 'images/flags/'
        path = os.path.join(self.static_path, flags_path)
        
        for file_path in Path(path).iterdir():
            if file_path.is_file():
                filename = file_path.stem
                self.flags[filename] = flags_path + file_path.name
                
    def load_map_images(self):
        self.map_images.clear()
        
        map_images_path = 'images/maps/'
        path = os.path.join(self.static_path, map_images_path)
        
        for file_path in Path(path).iterdir():
            if file_path.is_file():        
                filename = file_path.stem
                self.map_images[filename] = map_images_path + file_path.name
                
        map_images_path = 'images/maps/small_copies/'
        path = os.path.join(self.static_path, map_images_path)
        
        for file_path in Path(path).iterdir():
            if file_path.is_file():        
                filename = file_path.stem
                self.map_images[filename] = map_images_path + file_path.name