from app.models.map import Map
from app.models.gamemode import Gamemode
from app.models.victor import Victor
from app.models.section import Section
from app.models.section_player import SectionPlayer
from app.extensions import db 

def load_all_maps():
    gamemodes = Gamemode.query.order_by(Gamemode.ID.asc()).all()

    maps = {gamemode.Name: {"Main": [], "Extra": []} for gamemode in gamemodes}

    maps_data = (
        Map.query
        .options(db.joinedload(Map.victors).joinedload(Victor.player))
        .order_by(Map.GamemodeID.asc())
        .order_by(Map.Position.asc())
        .all()
    )


    for map in maps_data:
        gamemode_name = map.gamemode.Name 
        victors = sorted(map.victors, key = lambda v: v.Date)
        if len(victors) > 0:
            map.FirstVictor = victors[0]
        else:
            map.FirstVictor = None
        if map.Extra:
            maps[gamemode_name]["Extra"].append(map)
        else:
            maps[gamemode_name]["Main"].append(map)

    return maps

def load_map(id: int):
    map_data = (
        Map.query
        .options(
            db.joinedload(Map.victors).joinedload(Victor.player),
            db.joinedload(Map.sections).joinedload(Section.players).joinedload(SectionPlayer.player)
        )
        .filter_by(ID = id)
        .first()
    )
        
    return map_data