from random import choice
import os
import re
from flask import current_app

class Images:
    def __init__(self):
        self.map_images = []
        self.small_map_images = []
        self.flag_images = {}
        
    def load_all(self):
        static_folder = current_app.static_folder
        
        maps_folder = os.path.join(static_folder, "images", "maps")
        small_maps_folder = os.path.join(static_folder, "images", "maps", "small_copies")
        flags_folder = os.path.join(static_folder, "images", "flags")
        
        self.map_images = [f for f in os.listdir(maps_folder) if f.endswith((".jpg", ".png"))]
        self.small_map_images = [f for f in os.listdir(small_maps_folder) if f.endswith((".jpg", ".png"))]
        self.flag_images = {
            os.path.splitext(f)[0]: f
            for f in os.listdir(flags_folder)
            if f.endswith(".svg")
        }

    def get_random_map_image(self, small: bool = False):
        if small:
            return choice(self.small_map_images) if self.small_map_images else None
        else:
            return choice(self.map_images) if self.map_images else None

    def get_map_image(self, map_name: str, small: bool = False):
        file_name = re.sub(r"[^\w]", "", map_name)
        file_name += "_small" if small else ""

        if small:
            for image in self.small_map_images:
                if image.startswith(file_name):
                    return image
        else:
            for image in self.map_images:
                if image.startswith(file_name):
                    return image

        return None

    def get_flag_image(self, country_code: str):
        return self.flag_images.get(country_code.lower())