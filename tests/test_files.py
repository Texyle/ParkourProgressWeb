from typing import Any
import pytest
from pathlib import Path
from app.files import Files

@pytest.fixture
def mock_static_path(tmp_path) -> Any:
    # Create a temporary directory structure for testing
    flags_dir = tmp_path / "images" / "flags"
    maps_dir = tmp_path / "images" / "maps"
    small_copies_dir = tmp_path / "images" / "maps" / "small_copies"

    flags_dir.mkdir(parents=True)
    maps_dir.mkdir(parents=True)
    small_copies_dir.mkdir(parents=True)

    (flags_dir / "flag1.png").touch()
    (flags_dir / "flag2.png").touch()
    (maps_dir / "map1.png").touch()
    (small_copies_dir / "map1_small.png").touch()

    return tmp_path


def test_files_initialization(mock_static_path: Path) -> None:
    files = Files(static_path=mock_static_path)

    # Test flags
    assert "flag1" in files.flags
    assert "flag2" in files.flags
    assert files.flags["flag1"] == "images/flags/flag1.png"
    assert files.flags["flag2"] == "images/flags/flag2.png"

    # Test map images
    assert "map1" in files.map_images
    assert "map1_small" in files.map_images
    assert files.map_images["map1"] == "images/maps/map1.png"
    assert files.map_images["map1_small"] == "images/maps/small_copies/map1_small.png"


def test_load_files_with_nonexistent_directory(mock_static_path: Path) -> None:
    files = Files(static_path=mock_static_path)

    # Test loading from a nonexistent directory
    nonexistent_path = Path("nonexistent/path")
    result = files._load_files(nonexistent_path)
    assert result == {}