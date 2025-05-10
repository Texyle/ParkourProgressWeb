from app.extensions import db
from app.models.map import Map

class Victor(db.Model):
    __tablename__ = 'Victor'
    
    MapID = db.Column(db.Integer, db.ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    PlayerID = db.Column(db.Integer, db.ForeignKey('Player.ID', ondelete='CASCADE', onupdate='CASCADE'), primary_key=True)
    Date = db.Column(db.Date, nullable=False, index=True)
    Fails = db.Column(db.Integer, default=0)
    VictorIndex = db.Column(db.Integer, index=True)
    
    map = db.relationship("Map", back_populates="victors")
    player = db.relationship("Player", back_populates="victors")
    
    def __repr__(self):
        return f"<Victor {self.MapID}: {self.PlayerID} - {self.Date}>"
