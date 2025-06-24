from typing import Any
from app.models.player import Player
from app.models.gamemode import Gamemode
from app.models.victor import Victor
from app.models.section import Section
from app.models.section_player import SectionPlayer
from app.models.map import Map
from app.extensions import db
from collections import Counter, defaultdict
import pycountry

def load_player_names() -> list[dict[str, Any]]:
    player_names = Player.query.with_entities(Player.Name, Player.ID).all()
    
    return [{"Name": name, "ID": id} for name, id in player_names]

def load_player(id: int) -> Player | None:
    player_data = (
        Player.query
        .options(
            db.joinedload(Player.victors).joinedload(Victor.map),
            db.joinedload(Player.sections).joinedload(SectionPlayer.section).joinedload(Section.map),
            db.joinedload(Player.sections).joinedload(SectionPlayer.player)
        )
        .filter_by(ID=id)
        .first()
    )
    
    return player_data

def load_gamemodes() -> list[Gamemode]:
    gamemodes = Gamemode.query.all()
    
    return gamemodes

def load_country_data(country_code: str) -> tuple[list[Player], list[Map], dict[str, Any]]:
    players_data = (
        Player.query
        .options(db.joinedload(Player.victors).joinedload(Victor.map))
        .filter(db.or_(Player.victors.any(), Player.sections.any()))
        .all()
    )
            
    stats = {}
    countries = {}
    
    total_players = 0
    total_completions = 0
    total_fails = 0
    for player in players_data:
        if player.CountryCode not in countries:
            countries[player.CountryCode] = {"Players": [], "Completions": 0, "Fails": 0}
            
        countries[player.CountryCode]["Players"].append(player)
        
        total_players += 1
        total_completions += len(player.victors)
        countries[player.CountryCode]["Completions"] += len(player.victors)
        for victor in player.victors:
            if victor.map.FailsMessage is not None:
                total_fails += victor.Fails
                countries[player.CountryCode]["Fails"] += victor.Fails
                
    if countries.get(country_code) is None:
        return [], [], {}
        
    stats["PlayerCount"] = len(countries[country_code]["Players"])
    stats["PlayerCountPercent"] = get_percent(stats["PlayerCount"], total_players)
    sorted_countries = sorted(countries, key=lambda k: len(countries[k]["Players"]), reverse=True)
    stats["PlayerCountPosition"] = sorted_countries.index(country_code) + 1
    
    stats["Completions"] = countries[country_code]["Completions"]
    stats["CompletionsPercent"] = get_percent(countries[country_code]["Completions"], total_completions)
    sorted_countries = sorted(countries, key=lambda k: countries[k]["Completions"], reverse=True)
    stats["CompletionsPosition"] = sorted_countries.index(country_code) + 1
    
    stats["Fails"] = countries[country_code]["Fails"]
    stats["FailsPercent"] = get_percent(countries[country_code]["Fails"], total_fails)
    sorted_countries = sorted(countries, key=lambda k: countries[k]["Fails"], reverse=True)
    stats["FailsPosition"] = sorted_countries.index(country_code) + 1
    
    maps = load_country_maps(country_code)
    
    return countries[country_code]["Players"], maps, stats

def load_country_maps(country_code: str) -> list[Map]:
    maps_data = (
        Map.query
        .options(
            db.joinedload(Map.victors.and_(Victor.player.has(CountryCode=country_code))),
            db.joinedload(Map.sections).joinedload(Section.players.and_(SectionPlayer.player.has(CountryCode=country_code)))
        )
        .all()
    )
        
    for map in maps_data:
        found = False
        
        for victor in map.victors:
            map.CompletionStatus = "Victor"
            map.FirstVictor = victor
            found = True
            
            break
        
        if not found:
            for section in reversed(map.sections):
                for section_player in section.players:   
                    map.CompletionStatus = "Section"
                    map.FurthestPlayer = section_player
                    map.FurthestSection = section.Name
                    found = True
                    
                    break
                
                if found: break
                    
    return maps_data
    

def get_percent(a: int, b: int) -> float | str:
    percent = a / b * 100.0
    
    if percent < 0.1:
        return '<0.1'
    else:
        return round(percent, 1)
