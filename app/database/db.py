import mysql.connector

conn = mysql.connector.connect(
            host="193.124.204.44", 
            database="progressbot",
            user="user",
            password="I2F0HN3Ffe")
cursor = conn.cursor()

admins = ["Phantastically", "Baleron420", "NateTheCrack", "Texyle", "wlatr"]
moderators = ["A1GiJoe", "joejqd", "Treetop", "Udun", "Wolf"]
helpers = ["aeiou", "BramVeen", "chromaticfire", "Deciron", "Derek46", "EpikMineWay", "ettc", "ImChill1n", "Izaac", "Lemon"]

staff_data = {
    "Phantastically": "422453107109396490",
    "Baleron420": "491234057015787543",
    "NateTheCrack": "648581579505139722",
    "Texyle": "269105396587823104",
    "wlatr": "189064061185556480",
    "A1GiJoe": "473987030339158036",
    "joejqd": "530123955445694504",
    "Treetop": "279746524488138755",
    "Udun": "765388393600909342",
    "Wolf": "213220359120355329",
    "aeiou": "690212145937383451",
    "BramVeen": "336148116216741889",
    "chromaticfire": "712160294285082705",
    "Deciron": "318036877133217792",
    "Derek46": "338786998544498699",
    "EpikMineWay": "540505831116898305",
    "ettc": "695468387924574231",
    "ImChill1n": "1073146518481162240",
    "Izaac": "381505087115100160",
    "Lemon": "408971271087456265",
}

for name, discord_id in staff_data.items():
    admin = 1 if name in admins else 0
    moderator = 1 if name in moderators else 0
    helper = 1 if name in helpers else 0
    developer = 1 if name in ["Texyle", "ImChill1n"] else 0

    sql = """
        INSERT INTO Staff (Name, DiscordID, Admin, Developer, Moderator, Helper)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE Admin=%s, Developer=%s, Moderator=%s, Helper=%s
    """
    values = (name, discord_id, admin, developer, moderator, helper, admin, developer, moderator, helper)

    cursor.execute(sql, values)

conn.commit()
cursor.close()
conn.close()

print("Hotovo")
