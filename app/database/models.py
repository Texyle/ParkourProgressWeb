from app.database.sqlalchemy import db
from sqlalchemy import Column, Integer, String, Text, Enum, DateTime, Date, ForeignKey, SmallInteger, Boolean
from sqlalchemy.orm import relationship

class Credentials(db.Model):
    __tablename__ = 'Credentials'
    Fernet = Column(Text, nullable=False, primary_key=True)

class Gamemode(db.Model):
    __tablename__ = 'Gamemode'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(20), nullable=False)

class Logs(db.Model):
    __tablename__ = 'Logs'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    UserID = Column(String(50), nullable=False)
    Username = Column(String(100), nullable=False)
    UserAvatar = Column(String(255), nullable=False)
    ActivityType = Column(Enum('Map Change', 'Progress Change', 'Player Edit', 'Backup Load'), nullable=False)
    Timestamp = Column(DateTime, default=db.func.current_timestamp())
    MapName = Column(String(100))
    ChangedField = Column(String(100))
    PlayerName = Column(String(100))
    PreviousSection = Column(String(100))
    NewSection = Column(String(100))
    BackupDate = Column(Date)
    ExtraInfo = Column(Text)

class Map(db.Model):
    __tablename__ = 'Map'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(40), nullable=False, unique=True)
    GamemodeID = Column(Integer, ForeignKey('Gamemode.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    VictorRole = Column(Text)
    ProgressStart = Column(SmallInteger, default=0)
    Icon = Column(String(60), default='⚪')
    StartingSectionMessage = Column(String(100))
    FailsMessage = Column(String(20))
    NoVictorsMessage = Column(Text)
    HideRoles = Column(Boolean, default=False)
    Extra = Column(Boolean, default=False)
    Builder = Column(String(48), nullable=False)
    VideoURL = Column(String(150), nullable=False)
    Position = Column(SmallInteger, default=0)

    gamemode = relationship("Gamemode", back_populates="maps")

Gamemode.maps = relationship("Map", order_by=Map.ID, back_populates="gamemode")

class Message(db.Model):
    __tablename__ = 'Message'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    MapID = Column(Integer, ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    Guild = Column(String(20), nullable=False)
    Channel = Column(String(20), nullable=False)
    Message = Column(String(20), nullable=False)

class Player(db.Model):
    __tablename__ = 'Player'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(16), nullable=False, unique=True)
    DiscordID = Column(String(20))
    CountryCode = Column(String(3), default='idk')
    VisualFlag = Column(String(60))
    
    def to_dict(self):
        return {
            "ID": self.ID,
            "Name": self.Name,
            "DiscordID": self.DiscordID,
            "CountryCode": self.CountryCode,
            "VisualFlag": self.VisualFlag
        }

class Section(db.Model):
    __tablename__ = 'Section'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    MapID = Column(Integer, ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    SectionIndex = Column(SmallInteger, nullable=False)
    Name = Column(String(100), nullable=False)
    Role = Column(String(20))

    map = relationship("Map", back_populates="sections")

Map.sections = relationship("Section", order_by=Section.SectionIndex, back_populates="map")

class SectionPlayer(db.Model):
    __tablename__ = 'SectionPlayer'
    SectionID = Column(Integer, ForeignKey('Section.ID', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    PlayerID = Column(Integer, ForeignKey('Player.ID', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)

class Staff(db.Model):
    __tablename__ = 'Staff'
    Name = Column(String(30), primary_key=True)
    DiscordID = Column(String(25), nullable=False)
    Admin = Column(Boolean, nullable=False)
    Developer = Column(Boolean, nullable=False)
    Moderator = Column(Boolean, nullable=False)
    Helper = Column(Boolean, nullable=False)

class Victor(db.Model):
    __tablename__ = 'Victor'
    MapID = Column(Integer, ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    PlayerID = Column(Integer, ForeignKey('Player.ID', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    Date = Column(Date, nullable=False)
    Fails = Column(Integer, default=0)
    VictorIndex = Column(Integer)

class VictorSeparator(db.Model):
    __tablename__ = 'VictorSeparator'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    MapID = Column(Integer, ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    Date = Column(Date, nullable=False)
    Message = Column(String(120), nullable=False)