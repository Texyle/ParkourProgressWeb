from app.extensions import db
from .player import Player

class SectionPlayer(db.Model):
    __tablename__ = "SectionPlayer"
    
    SectionID = db.Column(db.Integer, db.ForeignKey("Section.ID", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    PlayerID = db.Column(db.Integer, db.ForeignKey("Player.ID", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    
    section = db.relationship("Section", back_populates="players")
    player = db.relationship("Player", back_populates="sections")
    
    def __repr__(self):
        return f"<SectionPlayer {self.SectionID}: {self.PlayerID}>"