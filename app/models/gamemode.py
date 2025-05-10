from app.extensions import db

class Gamemode(db.Model):
    __tablename__ = 'Gamemode'
    
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(20), nullable=False, index=True)
    
    maps = db.relationship('Map', back_populates='gamemode', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<Gamemode ID={self.ID}, Name={self.Name}>"