from random import choice
import os
import re
from flask import current_app

class Images:
    def __init__(self):
        self.map_images = {}
        self.small_map_images = {}
        self.flag_images = {}
        
    def load_all(self):
        static_folder = current_app.static_folder
        
        maps_folder = "images/maps"
        small_maps_folder = "images/maps/small_copies"
        flags_folder = "images/flags"
        
        self.map_images = {
            os.path.splitext(f)[0]: os.path.join(maps_folder, f).replace("\\", "/")
            for f in os.listdir(os.path.join(static_folder, maps_folder))
            if f.endswith((".jpg", ".png"))
        }
        
        self.small_map_images = {
            os.path.splitext(f)[0].replace("_small", ""): os.path.join(small_maps_folder, f).replace("\\", "/")
            for f in os.listdir(os.path.join(static_folder, small_maps_folder))
            if f.endswith((".jpg", ".png"))
        }
        
        self.flag_images = {
            os.path.splitext(f)[0]: os.path.join(flags_folder, f).replace("\\", "/")
            for f in os.listdir(os.path.join(static_folder, flags_folder))
            if f.endswith(".svg")
        }

    def get_random_map_image(self, small: bool = False):
        if small:
            return choice(list(self.small_map_images.values())) if self.small_map_images else None
        else:
            return choice(list(self.map_images.values())) if self.map_images else None

    def get_map_image(self, map_name: str, small: bool = False):
        file_name = re.sub(r"[^\w]", "", map_name)

        if small:
            return self.small_map_images.get(file_name)
        else:
            return self.map_images.get(file_name)

    def get_flag_image(self, country_code: str):
        return self.flag_images.get(country_code.lower())