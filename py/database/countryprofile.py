from mysql.connector import Error
import traceback
from flask import Flask, request, jsonify, send_from_directory
import pycountry
import py.database.database as database
from collections import Counter, defaultdict

def fetch_country_stats(app, country_code):
    try:
        cursor = database.get_cursor(dictionary=True)
        
        query = """
            SELECT Player.ID AS ID, Player.Name AS Name, Fails, Gamemode.Name AS Gamemode, CountryCode
            FROM Player
            RIGHT JOIN Victor ON Victor.PlayerID = Player.ID
            JOIN Map ON Map.ID = Victor.MapID
            JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
        """
        
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        database.commit()
        
        stats = {}
        country = pycountry.countries.get(alpha_2=country_code)
        if country == None:
            return None
          
        player_lists = get_player_lists(data)
        player_list = player_lists.get(country_code)
        
        stats["Code"] = country_code
        stats["Name"] = country.name
        
        if player_list != None:
            stats["Players"] = player_list
            stats["PlayerCount"] = len(stats["Players"])
            stats["PlayerCountPercent"] = get_player_count_percent(data, player_list)
            stats["PlayerCountPosition"] = get_player_count_position(player_lists, country_code)
            stats["Completions"] = get_completions(data, country_code)
            stats["CompletionsPercent"] = get_completions_percent(data, stats["Completions"])
            stats["CompletionsPosition"] = get_completions_position(data, country_code)
            
            total_fails, country_fails = get_fails(data, country_code)
            stats["Fails"] = country_fails
            stats["FailsPercent"] = get_fails_percent(total_fails, country_fails)
            stats["FailsPosition"] = get_fails_position(data, country_code)
        else:
            stats["Players"] = None
            stats["PlayerCount"] = 0
            stats["PlayerCountPercent"] = 0
            stats["PlayerCountPosition"] = '-'

        
        return stats
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
    
def get_player_lists(data):
    countries = {}
    
    for player in data:
        if not player["CountryCode"] in countries.keys():
            countries[player["CountryCode"]] = []
            
        if not any(p["Name"] == player["Name"] for p in countries[player["CountryCode"]]):
            countries[player["CountryCode"]].append({"ID": player["ID"], "Name": player["Name"]})
    
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
    
    
    