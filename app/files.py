from pathlib import Path
from typing import Dict, Union


class Files:

    FLAG_PATH: Path = Path("images/flags")
    MAP_PATH: Path = Path("images/maps")
    MAP_PATH_SMALL: Path = Path("images/maps/small_copies")

    def __init__(self, static_path: Union[str, Path]) -> None:
        """Initializes the class with the given static path and loads necessary files."""

        self.static_path = Path(static_path)
        self.flags = self._load_files(self.FLAG_PATH)
        self.map_images = self._load_files(self.MAP_PATH)
        self.map_images |= self._load_files(self.MAP_PATH_SMALL)

    def _load_files(self, rel_path: Path) -> Dict[str, str]:
        directory = self.static_path / rel_path
        if not directory.is_dir():
            return {}

        return {
            file.stem: (rel_path / file.name).as_posix()
            for file in directory.iterdir()
            if file.is_file()
        }