from app.extensions import db

class VictorSeparator(db.Model):
    __tablename__ = 'VictorSeparator'
    
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    MapID = db.Column(db.Integer, db.ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    Date = db.Column(db.Date, nullable=False)
    Message = db.Column(db.String(120), nullable=False)
    
    map = db.relationship("Map", back_populates="victor_separators")
    
    def __repr__(self):
        return f"<VictorSeparator {self.ID}: {self.MapID} - {self.Date} - {self.Message}>"