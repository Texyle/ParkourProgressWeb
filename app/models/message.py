from app.extensions import db

class Message(db.Model):
    __tablename__ = 'Message'
    
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    MapID = db.Column(db.Integer, db.ForeignKey('Map.ID', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    Guild = db.Column(db.String(20), nullable=False)
    Channel = db.Column(db.String(20), nullable=False)
    Message = db.Column(db.String(20), nullable=False)
    
    map = db.relationship("Map", back_populates="messages")
    
    def __repr__(self) -> str:
        return f"<Message {self.ID}: {self.Guild} - {self.Channel} - {self.Message}>"