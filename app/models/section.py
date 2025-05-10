from app.extensions import db
from .section_player import SectionPlayer

class Section(db.Model):
    __tablename__ = 'Section'
    
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    MapID = db.Column(db.Integer, db.ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)
    SectionIndex = db.Column(db.SmallInteger, nullable=False, index=True)
    Name = db.Column(db.String(100), nullable=False)
    Role = db.Column(db.String(20))

    map = db.relationship("Map", back_populates="sections")
    players = db.relationship("SectionPlayer", back_populates="section", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Section {self.ID}: {self.Name} - {self.MapID}>"