from app.extensions import db

class Credentials(db.Model):
    __tablename__ = 'Credentials'
    
    Fernet = db.Column(db.Text, nullable=False, primary_key=True)
    
    def __repr__(self) -> str:
        return f"<Credentials Fernet={self.Fernet}>"