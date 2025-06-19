from app.extensions import db
from .gamemode import Gamemode
from .section import Section
from .message import Message
from .victor_separator import VictorSeparator

class Map(db.Model):
    __tablename__ = 'Map'
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(40), nullable=False, unique=True)
    GamemodeID = db.Column(db.Integer, db.ForeignKey('Gamemode.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    VictorRole = db.Column(db.Text)
    ProgressStart = db.Column(db.SmallInteger, default=0)
    Icon = db.Column(db.String(60), default='⚪')
    StartingSectionMessage = db.Column(db.String(100))
    FailsMessage = db.Column(db.String(20))
    NoVictorsMessage = db.Column(db.Text)
    HideRoles = db.Column(db.Boolean, default=False)
    Extra = db.Column(db.Boolean, default=False)
    Builder = db.Column(db.String(48), nullable=False)
    VideoURL = db.Column(db.String(150), nullable=False)
    Position = db.Column(db.SmallInteger, default=0, index=True)
    
    gamemode = db.relationship("Gamemode", back_populates="maps")
    victors = db.relationship("Victor", back_populates="map", cascade="all, delete-orphan", order_by="Victor.VictorIndex.asc()")
    sections = db.relationship("Section", back_populates="map", cascade="all, delete-orphan", order_by="Section.SectionIndex.asc()")
    messages = db.relationship("Message", back_populates="map", cascade="all, delete-orphan")
    victor_separators = db.relationship("VictorSeparator", back_populates="map", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Map {self.ID}: {self.Name} - {self.GamemodeID}>"