from datetime import datetime
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, Session
from sqlalchemy import Integer, String, Text, DateTime

Base = declarative_base()

def row_to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    @staticmethod
    def get_by_id(db: Session, user_id):
        obj = db.get(User, user_id)
        return row_to_dict(obj) if obj else None

    @staticmethod
    def get_by_username(db: Session, username):
        obj = db.query(User).filter_by(username=username).first()
        return row_to_dict(obj) if obj else None

class Product(Base):
    __tablename__ = 'products'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    @staticmethod
    def get_all(db: Session):
        rows = db.query(Product).order_by(Product.created_at.desc()).all()
        return [row_to_dict(r) for r in rows]

    @staticmethod
    def get_by_id(db: Session, product_id):
        obj = db.get(Product, product_id)
        return row_to_dict(obj) if obj else None

    @staticmethod
    def create(db: Session, name, category, description, image_url=None):
        obj = Product(name=name, category=category, description=description, image_url=image_url)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj.id

    @staticmethod
    def update(db: Session, product_id, name, category, description, image_url):
        obj = db.get(Product, product_id)
        if not obj:
            return
        obj.name = name
        obj.category = category
        obj.description = description
        obj.image_url = image_url
        obj.updated_at = datetime.utcnow()
        db.commit()

    @staticmethod
    def delete(db: Session, product_id):
        obj = db.get(Product, product_id)
        if obj:
            db.delete(obj)
            db.commit()

class BlogPost(Base):
    __tablename__ = 'blog_posts'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[str] = mapped_column(String, default='Admin')
    image_url: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    @staticmethod
    def get_all(db: Session):
        rows = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
        return [row_to_dict(r) for r in rows]

    @staticmethod
    def get_by_id(db: Session, post_id):
        obj = db.get(BlogPost, post_id)
        return row_to_dict(obj) if obj else None

    @staticmethod
    def create(db: Session, title, content, author='Admin', image_url=None):
        obj = BlogPost(title=title, content=content, author=author, image_url=image_url)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj.id

    @staticmethod
    def update(db: Session, post_id, title, content, author, image_url):
        obj = db.get(BlogPost, post_id)
        if not obj:
            return
        obj.title = title
        obj.content = content
        obj.author = author
        obj.image_url = image_url
        obj.updated_at = datetime.utcnow()
        db.commit()

    @staticmethod
    def delete(db: Session, post_id):
        obj = db.get(BlogPost, post_id)
        if obj:
            db.delete(obj)
            db.commit()

class GalleryItem(Base):
    __tablename__ = 'gallery_items'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    media_type: Mapped[str] = mapped_column(String, nullable=False)
    media_url: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    @staticmethod
    def get_all(db: Session):
        rows = db.query(GalleryItem).order_by(GalleryItem.created_at.desc()).all()
        return [row_to_dict(r) for r in rows]

    @staticmethod
    def get_by_id(db: Session, item_id):
        obj = db.get(GalleryItem, item_id)
        return row_to_dict(obj) if obj else None

    @staticmethod
    def create(db: Session, media_type, media_url, title='', description=''):
        obj = GalleryItem(media_type=media_type, media_url=media_url, title=title, description=description)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj.id

    @staticmethod
    def delete(db: Session, item_id):
        obj = db.get(GalleryItem, item_id)
        if obj:
            db.delete(obj)
            db.commit()

class ChatbotSettings(Base):
    __tablename__ = 'chatbot_settings'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    greeting: Mapped[str] = mapped_column(Text, default='Hello! How can I help you today?')
    faqs: Mapped[str] = mapped_column(Text, default='[]')
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    @staticmethod
    def get(db: Session):
        obj = db.query(ChatbotSettings).order_by(ChatbotSettings.id.asc()).first()
        return row_to_dict(obj) if obj else {'greeting': 'Hello!', 'faqs': '[]'}

    @staticmethod
    def update(db: Session, greeting, faqs):
        obj = db.query(ChatbotSettings).order_by(ChatbotSettings.id.asc()).first()
        if not obj:
            obj = ChatbotSettings(greeting=greeting, faqs=faqs)
            db.add(obj)
        else:
            obj.greeting = greeting
            obj.faqs = faqs
            obj.updated_at = datetime.utcnow()
        db.commit()
