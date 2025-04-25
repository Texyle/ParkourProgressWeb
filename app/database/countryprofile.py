from mysql.connector import Error
import traceback
from flask import Flask, request, jsonify, send_from_directory
import pycountry
import py.database.database as database
from collections import Counter, defaultdict
import datetime

def fetch_country_profile_data(app, country_code):
    try:
        data_stats, data_victors, data_sections, data_maps = select_data(country_code)
        
        stats = get_stats(data_stats, country_code)
        maps = get_maps(data_victors, data_sections, data_maps)
        
        return {"Stats": stats, "Maps": maps}
        
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
def select_data(country_code):
    cursor = database.get_cursor(dictionary=True)
    
    query_stats = """
        SELECT Player.ID AS ID, Player.Name AS Name, Fails, Gamemode.Name AS Gamemode, CountryCode
        FROM Player
        RIGHT JOIN Victor ON Victor.PlayerID = Player.ID
        JOIN Map ON Map.ID = Victor.MapID
        JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
    """
    
    query_victors = """
        SELECT Map.Name AS MapName, Map.ID AS MapID, Map.Position AS Position, Gamemode.Name AS Gamemode, Extra, Player.Name AS Victor, Player.ID AS VictorID, Victor.Date AS Date
        FROM Map
        JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
        JOIN (
            SELECT MapID, MIN(Date) AS FirstVictoryDate
            FROM Victor
            JOIN Player ON Player.ID = Victor.PlayerID
            WHERE Player.CountryCode = %s
            GROUP BY MapID
        ) AS FirstVictories ON FirstVictories.MapID = Map.ID
        JOIN Victor ON Victor.MapID = Map.ID AND Victor.Date = FirstVictories.FirstVictoryDate
        JOIN Player ON Player.ID = Victor.PlayerID
        WHERE Player.CountryCode = %s;
    """
    
    query_sections = """
        WITH FurthestSections AS (
            SELECT
                Map.Name AS MapName,
                Map.ID AS MapID,
                Map.Position AS Position,
                Gamemode.Name AS Gamemode,
                Extra,
                Player.Name AS SectionPlayer,
                Player.ID AS SectionPlayerID,
                Section.Name AS SectionName,
                ROW_NUMBER() OVER (PARTITION BY Map.ID ORDER BY Section.SectionIndex DESC) AS RowNum
            FROM Map
            JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
            JOIN Section ON Section.MapID = Map.ID
            JOIN SectionPlayer ON SectionPlayer.SectionID = Section.ID
            JOIN Player ON Player.ID = SectionPlayer.PlayerID
            WHERE Player.CountryCode = %s
        )
        SELECT MapName, MapID, Position, Gamemode, Extra, SectionPlayer, SectionName, SectionPlayerID
        FROM FurthestSections
        WHERE RowNum = 1;
    """
    
    query_maps = """
        SELECT Map.ID AS MapID, Map.Name AS MapName, Map.Position AS Position, Gamemode.Name AS Gamemode, Extra
        FROM Map
        JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
    """
    
    cursor.execute(query_stats)
    stats_data = cursor.fetchall()
    
    cursor.execute(query_victors, (country_code, country_code,))
    victors_data = cursor.fetchall()
    
    cursor.execute(query_sections, (country_code,))
    sections_data = cursor.fetchall()
    
    cursor.execute(query_maps)
    maps_data = cursor.fetchall()
    
    cursor.close()
    database.commit()
        
    return stats_data, victors_data, sections_data, maps_data

def get_stats(data_stats, country_code):
    stats = {}
    country = pycountry.countries.get(alpha_2=country_code)
    if country == None:
        return None
        
    player_lists = get_player_lists(data_stats)
    player_list = player_lists.get(country_code)
    
    stats["Code"] = country_code
    stats["Name"] = country.name
    
    if player_list != None:
        stats["Players"] = player_list
        stats["PlayerCount"] = len(stats["Players"])
        stats["PlayerCountPercent"] = get_player_count_percent(data_stats, player_list)
        stats["PlayerCountPosition"] = get_player_count_position(player_lists, country_code)
        stats["Completions"] = get_completions(data_stats, country_code)
        stats["CompletionsPercent"] = get_completions_percent(data_stats, stats["Completions"])
        stats["CompletionsPosition"] = get_completions_position(data_stats, country_code)
        
        total_fails, country_fails = get_fails(data_stats, country_code)
        stats["Fails"] = country_fails
        stats["FailsPercent"] = get_fails_percent(total_fails, country_fails)
        stats["FailsPosition"] = get_fails_position(data_stats, country_code)
    else:
        stats["Players"] = None
        stats["PlayerCount"] = 0
        stats["PlayerCountPercent"] = 0
        stats["PlayerCountPosition"] = '-'

    
    return stats
    
    
def get_player_lists(data):
    countries = {}
    player_counts = {}

    for player in data:
        country_code = player["CountryCode"]
        player_name = player["Name"]
        player_id = player["ID"]

        if country_code not in countries:
            countries[country_code] = []

        if player_name not in player_counts:
            player_counts[player_name] = {"ID": player_id, "Count": 0}

        player_counts[player_name]["Count"] += 1

    for player_name, player_info in player_counts.items():
        country_code = next(p["CountryCode"] for p in data if p["Name"] == player_name)
        countries[country_code].append({"Name": player_name, "ID": player_info["ID"], "Count": player_info["Count"]})

    for country_code in countries:
        countries[country_code].sort(key=lambda x: x["Count"], reverse=True)

    return countries

def get_player_count_percent(data, players):
    country = len(players)
    total = len(data)
    percent = country / total * 100.0
    
    if percent < 0.1:
        return '<0.1'
    else:
        return round(percent, 1)
    
def get_player_count_position(player_lists, country_code):
    sorted_countries = sorted(player_lists, key=lambda k: len(player_lists[k]), reverse=True)
    return sorted_countries.index(country_code) + 1

def get_completions(data, country_code):
    return len(list(filter(lambda x: x["CountryCode"] == country_code, data )))

def get_completions_percent(data, completions):
    total = len(data)
    percent = completions / total * 100.0
    
    if percent < 0.1:
        return '<0.1'
    else:
        return round(percent, 1)
    
def get_completions_position(data, country_code):
    country_counts = Counter(item["CountryCode"] for item in data)
    sorted_country_codes = sorted(country_counts.items(), key=lambda x: x[1], reverse=True)
    sorted_country_codes_list = [country for country, count in sorted_country_codes]
    return sorted_country_codes_list.index(country_code) + 1

def get_fails(data, country_code):
    total_fails = 0
    country_fails = 0
    
    for player in data:
        if player["Gamemode"] != "Rankup":
            continue
        
        if player["CountryCode"] != country_code:
            total_fails += player["Fails"]
        else:
            country_fails += player["Fails"]
    
    return total_fails, country_fails

def get_fails_percent(total, country):
    percent = country / total * 100.0
    
    if percent < 0.1:
        return '<0.1'
    else:
        return round(percent, 1)
    
def get_fails_position(data, country_code):
    country_fails_sum = defaultdict(int)
    for item in data:
        if item["Gamemode"] != "Rankup":
            continue
        country_fails_sum[item["CountryCode"]] += item["Fails"]
    sorted_country_codes = sorted(country_fails_sum.items(), key=lambda x: x[1], reverse=True)
    sorted_country_codes_list = [country for country, total_fails in sorted_country_codes]

    return sorted_country_codes_list.index(country_code) + 1
    
    
def get_maps(data_victors, data_sections, data_maps):
    maps = []
    
    for map in data_maps:    
        found = False
        for victor in data_victors:
            if victor["MapID"] != map["MapID"]:
                continue
            
            found = True
            maps.append({"MapName": victor["MapName"], 
                         "MapID": victor["MapID"],
                         "Position": victor["Position"],
                         "Gamemode": victor["Gamemode"],
                         "List": get_list(map["Extra"]),
                         "Player": victor["Victor"],
                         "PlayerID": victor["VictorID"],
                         "Date": victor["Date"],
                         "Type": "Victor"})
            break
        
        if found:
            continue
        
        for section in data_sections:
            if section["MapID"] != map["MapID"]:
                continue
            
            found = True
            maps.append({"MapName": section["MapName"], 
                         "MapID": section["MapID"],
                         "Position": section["Position"],
                         "Gamemode": section["Gamemode"],
                         "List": get_list(map["Extra"]),
                         "Player": section["SectionPlayer"],
                         "PlayerID": section["SectionPlayerID"],
                         "Section": section["SectionName"],
                         "Date": datetime.date(9999, 1, 1),
                         "Type": "Section"})
            break
        
        if found:
            continue
        
        maps.append({"MapName": map["MapName"], 
                     "MapID": map["MapID"],
                     "Position": map["Position"],
                     "Gamemode": map["Gamemode"],
                     "List": get_list(map["Extra"]),
                     "Date": datetime.date(9999, 1, 1),
                     "Type": "None"})
    
    maps = sorted(maps, key=lambda x: x["Date"])
    for map in maps:
        map["Date"] = map["Date"].strftime("%b %d, %Y")
    
    return maps
        
def get_list(extra):
    if extra:
        return "Extra"
    
    return "Main"