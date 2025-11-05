import os
from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus
from models import Base, User, Product, BlogPost, GalleryItem, ChatbotSettings

# Determine data directory (for SQLite default)
DEFAULT_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
DATA_DIR = os.environ.get('DATA_DIR', DEFAULT_DATA_DIR)
os.makedirs(DATA_DIR, exist_ok=True)

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    # SQLite fallback
    sqlite_path = os.path.join(DATA_DIR, 'sinfin_database.db')
    DATABASE_URL = f"sqlite:///{sqlite_path}"

# Create SQLAlchemy engine and session factory
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    """Return a SQLAlchemy Session. Caller is responsible for closing."""
    return SessionLocal()

def init_db():
    """Create tables and seed demo data on empty DB."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Ensure default users
        if not db.query(User).filter_by(username='ayeshanawazraza@gmail.com').first():
            db.add(User(username='ayeshanawazraza@gmail.com', password_hash=generate_password_hash('Emotional.Intelligence@123')))
        if not db.query(User).filter_by(username='admin').first():
            db.add(User(username='admin', password_hash=generate_password_hash('admin123')))

        # Ensure chatbot settings
        if not db.query(ChatbotSettings).first():
            default_faqs = '''[
                {"question": "What products do you offer?", "answer": "We specialize in premium cotton and synthetic ladies' fabrics, garments, linens, and terry toweling products.", "keywords": ["products", "offer", "sell", "fabrics", "textile"]},
                {"question": "Where do you export to?", "answer": "We export to international markets across Asia, Africa, and Europe.", "keywords": ["export", "ship", "countries", "where", "location"]},
                {"question": "How can I contact you?", "answer": "You can reach us through our contact form or email us at info@sinfinimarketing.com. We are located in Sharjah, UAE.", "keywords": ["contact", "email", "phone", "reach", "address"]},
                {"question": "What is your company's specialty?", "answer": "Sinfini Marketing FZC specializes in exporting premium quality textiles including cotton and synthetic fabrics, garments, linens, and terry toweling products.", "keywords": ["specialty", "specialize", "focus", "expertise"]}
            ]'''
            db.add(ChatbotSettings(greeting='Hello! Welcome to Sinfini Marketing FZC. How can I assist you today?', faqs=default_faqs))

        # Seed demo data if empty
        if db.query(Product).count() == 0:
            db.add_all([
                Product(name='Bamboo Terry Towels - Eco-Friendly', category='Terry Toweling', description='Eco-friendly bamboo terry towels combining sustainability with luxury.', image_url='https://images.unsplash.com/photo-1520975940276-6d98d6f2f6b1?w=800'),
                Product(name='Premium Denim Fabric', category='Cotton Fabrics', description='High-quality denim fabric perfect for jeans, jackets, and accessories.', image_url='https://images.unsplash.com/photo-1520974735194-6c1eaa8f1a79?w=800'),
                Product(name='Silk Blend Evening Fabric', category='Synthetic Fabrics', description='Luxurious silk blend fabric with beautiful drape and sheen.', image_url='https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800'),
            ])

        if db.query(BlogPost).count() == 0:
            db.add_all([
                BlogPost(title='Sustainable Textiles: Our Commitment to the Environment', content="Sustainability is not just a trend—it's a responsibility. At Sinfini Marketing FZC, we're committed to eco-friendly practices across sourcing and production.", author='Environmental Team', image_url='https://images.unsplash.com/photo-1484882918957-e9ba8f06e3f9?w=800'),
                BlogPost(title='Cotton vs Synthetic: Choosing the Right Fabric', content="Choosing between cotton and synthetic fabrics depends on your specific needs. Let's explore the benefits of each.", author='Product Specialist', image_url='https://images.unsplash.com/photo-1520974735194-6c1eaa8f1a79?w=800'),
            ])

        if db.query(GalleryItem).count() == 0:
            db.add_all([
                GalleryItem(media_type='image', media_url='https://images.unsplash.com/photo-1524102724378-4bc7a4d4a27b?w=1000', title='Factory Floor', description='High-quality production line'),
                GalleryItem(media_type='image', media_url='https://images.unsplash.com/photo-1503342394122-6c6a3c3c1b2e?w=1000', title='Textile Rolls', description='Premium fabric inventory'),
                GalleryItem(media_type='image', media_url='https://images.unsplash.com/photo-1520975940276-6d98d6f2f6b1?w=1000', title='Terry Towels', description='Eco-friendly towels ready to ship'),
            ])

        db.commit()
        print("Database initialized successfully!")
    finally:
        db.close()

if __name__ == '__main__':
    init_db()
