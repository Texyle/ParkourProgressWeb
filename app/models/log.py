from app.extensions import db

class Log(db.Model):
    __tablename__ = 'Log'
    
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(db.String(50), nullable=False)
    Username = db.Column(db.String(100), nullable=False)
    UserAvatar = db.Column(db.String(255), nullable=False)
    ActivityType = db.Column(db.Enum('Map Change', 'Progress Change', 'Player Edit', 'Backup Load'), nullable=False)
    Timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    MapName = db.Column(db.String(100))
    ChangedField = db.Column(db.String(100))
    PlayerName = db.Column(db.String(100))
    PreviousSection = db.Column(db.String(100))
    NewSection = db.Column(db.String(100))
    BackupDate = db.Column(db.Date)
    ExtraInfo = db.Column(db.Text)
    
    def __repr__(self):
        return f"<Log {self.ID}: {self.Username} - {self.ActivityType} on {self.Timestamp}>"