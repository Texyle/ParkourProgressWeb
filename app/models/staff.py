from app.extensions import db

class Staff(db.Model):
    __tablename__ = 'Staff'
    
    Name = db.Column(db.String(30), primary_key=True)
    DiscordID = db.Column(db.String(25), nullable=False)
    Admin = db.Column(db.Boolean, nullable=False)
    Developer = db.Column(db.Boolean, nullable=False)
    Moderator = db.Column(db.Boolean, nullable=False)
    Helper = db.Column(db.Boolean, nullable=False)
    
    def __repr__(self):
        return f"<Staff {self.Name}: {self.DiscordID} - Admin: {self.Admin}, Developer: {self.Developer}, Moderator: {self.Moderator}, Helper: {self.Helper}>"