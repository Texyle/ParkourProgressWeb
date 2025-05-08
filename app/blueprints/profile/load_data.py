# Импортируем необходимые модели и расширения из приложения
from app.models.player import Player  # Модель игрока
from app.models.gamemode import Gamemode  # Модель игрового режима
from app.models.victor import Victor  # Модель победителя
from app.models.section import Section  # Модель секции
from app.models.section_player import SectionPlayer  # Модель игрока в секции
from app.extensions import db  # Расширение для работы с базой данных
from collections import Counter, defaultdict
import pycountry

# Функция для загрузки имен игроков и их ID
def load_player_names():
    # Выполняем запрос к базе данных, чтобы получить только имена и ID игроков
    player_names = Player.query.with_entities(Player.Name, Player.ID).all()
    
    # Преобразуем результат в список словарей с ключами "Name" и "ID"
    return [{"Name": name, "ID": id} for name, id in player_names]

# Функция для загрузки данных конкретного игрока по его ID
def load_player(id: int):
    # Выполняем запрос с использованием joinedload для загрузки связанных данных
    player_data = (
        Player.query
        .options(
            db.joinedload(Player.victors).joinedload(Victor.map),  # Загрузка побед и связанных карт
            db.joinedload(Player.sections).joinedload(SectionPlayer.section).joinedload(Section.map),  # Загрузка секций и связанных карт
            db.joinedload(Player.sections).joinedload(SectionPlayer.player)  # Загрузка игроков в секциях
        )
        .filter_by(ID=id)  # Фильтруем по ID игрока
        .first()  # Получаем первый (и единственный) результат
    )
    
    # Возвращаем данные игрока
    return player_data

# Функция для загрузки всех игровых режимов
def load_gamemodes():
    # Выполняем запрос к базе данных для получения всех игровых режимов
    gamemodes = Gamemode.query.all()
    
    # Возвращаем список игровых режимов
    return gamemodes

# Функция для загрузки статистики игроков по коду страны
def load_stats(country_code: str):
    players_data = (
        Player.query
        .filter(db.or_(Player.victors.any(), Player.sections.any()))
        .all()
    )
    
    countries = [{'Code': country.alpha_2.lower(), 'Name': country.name} for country in pycountry.countries]
    
    stats = {}
    
    players = {}
    
    for player in players_data:
        if player.CountryCode not in players:
            players[player.CountryCode] = []
            
        players[player.CountryCode].append(player)
        
    sorted_countries = sorted(players, key=lambda k: len(players[k]), reverse=True)
    stats["PlayerCountPosition"] = sorted_countries.index(country_code) + 1
        
    stats["PlayerCount"] = len(players[country_code])
    stats["PlayerCountPercent"] = get_percent(stats["PlayerCount"], len(players))
        
    
    return stats

def load_players(country_code: str):
    # Выполняем запрос к базе данных для получения всех игроков
    players = (
        Player.query
        .filter_by(CountryCode = country_code)
        .filter(db.or_(Player.victors.any(), Player.sections.any()))
        .all()
    )
    
    return players

def get_percent(a: int, b: int):
    percent = a / b * 100.0
    
    if percent < 0.1:
        return '<0.1'
    else:
        return round(percent, 1)
