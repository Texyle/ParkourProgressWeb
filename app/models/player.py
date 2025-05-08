from app.extensions import db

class Player(db.Model):
    __tablename__ = 'Player'
    
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(16), nullable=False, unique=True)
    DiscordID = db.Column(db.String(20))
    CountryCode = db.Column(db.String(3), default='idk')
    VisualFlag = db.Column(db.String(60))
    
    victors = db.relationship("Victor", back_populates="player")
    sections = db.relationship("SectionPlayer", back_populates="player")
        
    def __repr__(self):
        return f"<Player {self.ID}: {self.Name}>"