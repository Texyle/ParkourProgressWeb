import mysql.connector
from mysql.connector import Error
import traceback
from flask import Flask, request, jsonify, send_from_directory
import pycountry
from py.database.countryprofile import fetch_country_profile_data
from embeddify import Embedder

connection = None
plugin_config = {
    'youtube': {'width' : 350, 'height' : 650},
}
embedder = Embedder(plugin_config = plugin_config)

def get_cursor(*args, **kwargs):
    global connection
    
    if connection == None or not connection.is_connected():
        connection = mysql.connector.connect(
            host="193.124.204.44", 
            database="progressbot",
            user="user",
            password="I2F0HN3Ffe")
    
    return connection.cursor(*args, **kwargs)

def commit():
    global connection
    
    if connection == None or not connection.is_connected():
        connection = mysql.connector.connect(
            host="193.124.204.44", 
            database="progressbot",
            user="user",
            password="I2F0HN3Ffe")
        return
    
    connection.commit()

def fetch_player_names(app):
    try:
        cursor = get_cursor(dictionary=True)

        query = "SELECT ID, Name FROM Player"

        cursor.execute(query)
        names = cursor.fetchall()
        cursor.close()
        commit()
        
        return names
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500

def fetch_all_players(app):
    try:
        cursor = get_cursor(dictionary=False)

        query = "SELECT Player.Name AS Nick FROM Player"

        cursor.execute(query)
        nicks = cursor.fetchall()
        cursor.close()
        commit()

        if nicks is None:
            return None
        
        return nicks
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500

def fetch_player_info(app, id):
    try:
        cursor = get_cursor(dictionary=True)

        query = """
        SELECT DiscordID, CountryCode, Name
        FROM Player 
        WHERE ID = %s
        """

        cursor.execute(query, (id,))
        info = cursor.fetchone()
        cursor.close()
        commit()

        if info is None:
            return None
        
        id = info.get("CountryCode")
        if id == "idk":
            info['CountryName'] == "Unknown"
        cc = pycountry.countries.get(alpha_2=id)
        info['CountryName'] = cc.name 


        return info
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500

def fetch_maps_in_progress(app, player_id):
    try:
        cursor = get_cursor(dictionary=True)

        query = """
        SELECT Map.Name AS Name, Section.Name AS Section, Gamemode.Name AS Gamemode, Map.ID as MapID
        FROM SectionPlayer
        JOIN Player
        ON Player.ID = SectionPlayer.PlayerID
        JOIN Section
        ON Section.ID = SectionPlayer.SectionID
        JOIN Map
        ON Map.ID = Section.MapID
        JOIN Gamemode
        ON Gamemode.ID = Map.GamemodeID
        WHERE Player.ID = %s
        """

        cursor.execute(query, (player_id,))
        prog = cursor.fetchall()
        cursor.close()
        commit()

        if prog is None:
            return None
        
        return prog
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
def fetch_completed_maps(app, player_id, gamemode=None):
    try:
        cursor = get_cursor(dictionary=True)

        if gamemode != None:
            query = """
            SELECT
                Map.Name AS Name,
                Map.ID as MapID,
                Date,
                Fails,
                Map.FailsMessage AS FailsMessage,
                Gamemode.Name AS Gamemode,
                Map.Position as Position,
                Map.Extra AS Extra,
                VictorPosition
            FROM (
                SELECT
                    Victor.MapID,
                    Victor.PlayerID,
                    Victor.Date,
                    Victor.Fails,
                    ROW_NUMBER() OVER (PARTITION BY Victor.MapID ORDER BY Victor.Date ASC) AS VictorPosition
                FROM
                    Victor
            ) AS RankedVictors
            JOIN
                Map ON Map.ID = RankedVictors.MapID
            JOIN
                Player ON Player.ID = RankedVictors.PlayerID
            JOIN
                Gamemode ON Gamemode.ID = Map.GamemodeID
            WHERE
                Player.ID = %s
                Gamemode.Name = %s
            ORDER BY
                Date DESC;
            """

            cursor.execute(query, (player_id, gamemode))
        else:
            query = """
            SELECT
                Map.Name AS Name,
                Map.ID as MapID,
                Date,
                Fails,
                Map.FailsMessage AS FailsMessage,
                Gamemode.Name AS Gamemode,
                Map.Position as Position,
                Map.Extra AS Extra,
                VictorPosition
            FROM (
                SELECT
                    Victor.MapID,
                    Victor.PlayerID,
                    Victor.Date,
                    Victor.Fails,
                    ROW_NUMBER() OVER (PARTITION BY Victor.MapID ORDER BY Victor.Date ASC) AS VictorPosition
                FROM
                    Victor
            ) AS RankedVictors
            JOIN
                Map ON Map.ID = RankedVictors.MapID
            JOIN
                Player ON Player.ID = RankedVictors.PlayerID
            JOIN
                Gamemode ON Gamemode.ID = Map.GamemodeID
            WHERE
                Player.ID = %s
            ORDER BY
                Date DESC;
            """

            cursor.execute(query, [player_id])
            
        victor = cursor.fetchall()
        cursor.close()
        commit()

        if victor is None:
            return None
        
        for entry in victor:
            date_obj = entry['Date']
            formatted_date = date_obj.strftime('%b %d, %Y')  
            entry['Date'] = formatted_date  
        
        return victor
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
def get_player_id(app, nick):
    try:
        cursor = get_cursor()
        query = "SELECT ID AS ID FROM Player WHERE Player.Name = %s"
        cursor.execute(query, (nick,))
        id = cursor.fetchone()
        return id[0]
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500

def fetch_country_player_counts(app):
    try:
        cursor = get_cursor(dictionary=True)
        
        query = """
            SELECT CountryCode, COUNT(*) AS Players
            FROM Player
            GROUP BY CountryCode
            ORDER BY Players DESC;
        """
        cursor.execute(query)
        player_counts = cursor.fetchall()
        valid_counts = {}
                
        for player_count in player_counts:
            country_code = player_count["CountryCode"].upper()
            country = pycountry.countries.get(alpha_2=country_code)
            if country:
                valid_counts[country.alpha_3] = {"Players": player_count["Players"]}
        
        return valid_counts
        
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
    
def fetch_latest_victors(app):
    try:
        cursor = get_cursor()
        
        query = """
        SELECT Player.Name AS PlayerName, Map.Name AS MapName, Victor.Date AS Date, Player.ID AS ID, Map.ID AS MapID
        FROM Victor
        JOIN Player
        ON Player.ID = Victor.PlayerID
        JOIN Map
        ON Map.ID = Victor.MapID
        ORDER BY Date DESC
        LIMIT 5
        """
        cursor.execute(query)
        victors = cursor.fetchmany(5)
        
        cursor.close()
        commit()

        victors_list = [
            {
                "player_name": row[0],
                "map_name": row[1],
                "date": row[2].isoformat(),
                "ID": row[3],
                "MapID": row[4]
            }
            for row in victors
        ]

        return victors_list
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
def fetch_map_sections(app, id):
    try:
        cursor = get_cursor(dictionary=True)

        progress_query = "SELECT ProgressStart FROM Map WHERE ID = %s"
        cursor.execute(progress_query, (id,))
        progress_result = cursor.fetchone()

        if not progress_result: 
            return {"error": "Map not found"}

        progress_start = progress_result["ProgressStart"]

        query = """
        SELECT
            Section.Name AS Name,
            Section.SectionIndex AS `Index`,
            CASE 
                WHEN Section.SectionIndex < %s THEN NULL 
                ELSE Player.ID
            END AS PlayerID,
            CASE 
                WHEN Section.SectionIndex < %s THEN NULL 
                ELSE Player.Name
            END AS PlayerName
        FROM
            Section
        JOIN
            Map ON Section.MapID = Map.ID  -- Presunuté skôr, aby bolo ProgressStart dostupné
        LEFT JOIN
            SectionPlayer ON Section.ID = SectionPlayer.SectionID
        LEFT JOIN
            Player ON SectionPlayer.PlayerID = Player.ID
        WHERE
            Section.MapID = %s
        """

        cursor.execute(query, (progress_start, progress_start, id))
        results = cursor.fetchall()

        sections = {
            "ProgressStart": progress_start  
        }

        for result in results:
            section_name = result['Name']
            section_index = result['Index']

            if section_name not in sections and section_name is not None: 
                sections[section_name] = {
                    'Index': section_index,
                    'Players': []  
                }

            if section_index >= progress_start and result['PlayerID'] is not None:
                sections[section_name]['Players'].append({
                    "ID": result['PlayerID'],
                    "Name": result['PlayerName']
                })

        return sections
    
    except Exception as e:
        app.logger.error(f"Error while fetching sections: {str(e)}\n{traceback.format_exc()}")
        return {"error": str(e)}
    
def fetch_map(app, id):
    try:
        cursor = get_cursor(dictionary=True)
        
        query = """
        SELECT Map.Name AS MapName, Gamemode.Name AS Gamemode, Map.Extra AS Extra, Map.VideoURL AS VideoURL, Map.FailsMessage AS FailsMessage
        FROM Map
        JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
        WHERE Map.Id = %s
        """
        cursor.execute(query, [id])
        map = cursor.fetchone()
        commit()

        if map is None:
            return None

        if map.get("Extra") == 0:
            map["Extra"] = False
        elif map.get("Extra") == 1:
            map["Extra"] = True

        if map["VideoURL"] != "Unknown":
            elink = embedder(map.get("VideoURL"))
            elink = elink.replace(
                'referrerpolicy="strict-origin-when-cross-origin"',
                'referrerpolicy="no-referrer-when-downgrade"'
            )
            map["VideoURL"] = elink

        return map

    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
def fetch_all_maps(app):
    # this is not used but ill leave just in case
    
    try:
        cursor = get_cursor(dictionary=True)
        
        query = """
        SELECT Gamemode.Name AS Gamemode, Extra, Map.Name AS Name, COUNT(*) AS TotalVictors, Map.ID as MapID
        FROM Victor
        JOIN Map ON Map.ID = Victor.MapID
        JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
        GROUP BY Map.ID
        """
        cursor.execute(query)
        maps = cursor.fetchall()

        for map in maps:
            extra_status = map.get("Extra")
            if extra_status == 1:
                map["Extra"] = True
            else:
                map["Extra"] = False

        return maps
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
def fetch_map_list(app):
    try:
        cursor = get_cursor(dictionary=True)
        
        query = """
        SELECT Gamemode.Name AS Gamemode, Extra, Map.Name AS Name, Map.ID as MapID, Builder,
        (SELECT COUNT(*)
            FROM Victor
            WHERE Victor.MapID = Map.ID) AS VictorCount,
        (SELECT Victor.PlayerID
            FROM Victor
            WHERE Victor.MapID = Map.ID
            ORDER BY Victor.Date ASC
            LIMIT 1) AS FirstVictorID,
        (SELECT Player.Name
            FROM Victor
            JOIN Player ON Player.ID = Victor.PlayerID
            WHERE Victor.MapID = Map.ID
            ORDER BY Victor.Date ASC
            LIMIT 1) AS FirstVictorName,
        (SELECT Player.CountryCode
            FROM Victor
            JOIN Player ON Player.ID = Victor.PlayerID
            WHERE Victor.MapID = Map.ID
            ORDER BY Victor.Date ASC
            LIMIT 1) AS FirstVictorCountry
        FROM Map
        JOIN Gamemode ON Gamemode.ID = Map.GamemodeID
        WHERE Position > 0
        ORDER BY Position;
        """
        cursor.execute(query)
        all_maps = cursor.fetchall()
        cursor.close()
        commit()

        maps = {"Rankup": {"Main": [], "Extra": []},
                "Segmented": {"Main": [], "Extra": []},
                "Onlysprint": {"Main": [], "Extra": []},
                "Tag": {"Main": [], "Extra": []}}
        for map in all_maps:
            if not maps.get(map["Gamemode"]):
                maps[map["Gamemode"]] = {"Main": [], "Extra": []}
                
            if map["Extra"] == 0:
                maps[map["Gamemode"]]["Main"].append(map)
            elif map["Extra"] == 1:
                maps[map["Gamemode"]]["Extra"].append(map)   

        return maps
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
def fetch_victors(app, map_id):
    try:
        cursor = get_cursor(dictionary=True)
        
        query = """
        SELECT Player.Name AS Name, Victor.Date AS Date, Victor.Fails AS Fails, Player.ID AS ID, Player.CountryCode as CountryCode
        FROM Victor
        JOIN Player ON Player.ID = Victor.PlayerID
        WHERE Victor.MapID = %s
        ORDER BY Date ASC
        """
        cursor.execute(query, [map_id])
        victors = cursor.fetchall()
            
        cursor.close()
        commit()
        for victor in victors:
            strfdate = victor['Date'].strftime("%b %d, %Y")
            victor['Date'] = strfdate
            victor["Country"] = pycountry.countries.get(alpha_2=victor.get("CountryCode")).name
            victor["CountryURL"] = f"/profile/country/{victor['CountryCode']}"
            victor["FlagPath"] = f"/static/images/flags/{victor['CountryCode'].lower()}.svg"
            victor["ProfileURL"] = f"/profile/player/{victor['ID']}"
         
        return victors
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
    
    
def fetch_gamemodes(app):
    try:
        cursor = get_cursor(dictionary=True)
        
        query = """
            SELECT ID, Name
            FROM Gamemode
        """
        cursor.execute(query)
        gamemodes = cursor.fetchall()
            
        cursor.close()
        commit()
        
        return gamemodes
    
    except Error as e:
        app.logger.error(f"Error while fetching data: {e.msg}\n{traceback.format_exc()}")
        return jsonify({"error": e.msg}), 500
