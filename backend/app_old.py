from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, url_for, session, flash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import timedelta
from database import init_db, get_db
from models import User, Product, BlogPost, GalleryItem, ChatbotSettings
import json
import subprocess
import atexit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Persist data/uploads to a configurable directory (works on Render disk)
DEFAULT_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
DATA_DIR = os.environ.get('DATA_DIR', DEFAULT_DATA_DIR)
os.makedirs(DATA_DIR, exist_ok=True)
app.config['UPLOAD_FOLDER'] = os.path.join(DATA_DIR, 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
"""Ensure JWT is read from Authorization header to avoid 422 errors when verifying
tokens from the admin dashboard which sends `Authorization: Bearer <token>`.
"""
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

CORS(app)
jwt = JWTManager(app)

# ---------- JWT error handlers for clearer behavior ----------
@jwt.unauthorized_loader
def _jwt_missing_token(err):
    # Missing Authorization header
    return jsonify({'error': 'missing_authorization', 'detail': err}), 401

@jwt.invalid_token_loader
def _jwt_invalid_token(err):
    # Invalid token format/signature
    return jsonify({'error': 'invalid_token', 'detail': err}), 401

@jwt.expired_token_loader
def _jwt_expired_token(jwt_header, jwt_payload):
    # Expired token
    return jsonify({'error': 'token_expired'}), 401

# ==================== WEB ROUTES (Flask Templates) ====================

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/blog/<int:post_id>')
def blog_detail(post_id):
    return render_template('blog_detail.html', post_id=post_id)

@app.route('/contact')
def contact():
    return render_template('contact.html')

# Admin routes
@app.route('/admin/login')
def admin_login():
    return render_template('admin/login.html')

@app.route('/admin/dashboard')
def admin_dashboard():
    return render_template('admin/dashboard.html')

@app.route('/admin/products')
def admin_products():
    return render_template('admin/products.html')

@app.route('/admin/blog')
def admin_blog():
    return render_template('admin/blog.html')

@app.route('/admin/gallery')
def admin_gallery():
    return render_template('admin/gallery.html')

@app.route('/admin/chatbot')
def admin_chatbot():
    return render_template('admin/chatbot.html')

# Ensure upload directories exist (under DATA_DIR)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'products'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'blog'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'gallery'), exist_ok=True)

# Initialize database
init_db()

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm', 'ogg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = (data or {}).get('username')
        password = (data or {}).get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400

        # Dummy auth: accept any non-empty username/password
        access_token = create_access_token(identity=username)
        return jsonify({
            'access_token': access_token,
            'user': {
                'username': username
            }
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify_token():
    identity = get_jwt_identity()
    return jsonify({'user': {'username': identity}}), 200

# ==================== PRODUCTS ROUTES ====================

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        db = get_db()
        try:
            products = Product.get_all(db)
            return jsonify(products), 200
        finally:
            db.close()
    except Exception as e:
        return jsonify({'error': 'Failed to fetch products'}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        db = get_db()
        try:
            product = Product.get_by_id(db, product_id)
        if product:
            return jsonify(product), 200
        return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to fetch product'}), 500

@app.route('/api/products', methods=['POST'])
@jwt_required()
def create_product():
    data = request.form
    image = request.files.get('image')
    
    image_url = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'products', filename)
        image.save(image_path)
        image_url = f'/uploads/products/{filename}'
    
    try:
        product_id = Product.create(db_session, name=data.get('name'), category=data.get('category'), description=data.get('description'), image_url=image_url)
        db = get_db()
        try:
            product = Product.get_by_id(db, product_id)
        return jsonify(product), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create product'}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    data = request.form
    image = request.files.get('image')
    
    try:
        db = get_db()
        try:
            product = Product.get_by_id(db, product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        image_url = product['image_url']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'products', filename)
            image.save(image_path)
            image_url = f'/uploads/products/{filename}'
        
        Product.update(db_session, product_id, name=data.get('name', product['name']), category=data.get('category', product['category']), description=data.get('description', product['description']), image_url=image_url)
        updated_product = Product.get_by_id(db_session, product_id)
        return jsonify(updated_product), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update product'}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        Product.delete(db_session, product_id)
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete product'}), 500

# ==================== BLOG ROUTES ====================

@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    try:
        posts = BlogPost.get_all(db_session)
        return jsonify(posts), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch blog posts'}), 500

@app.route('/api/blog/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    try:
        post = BlogPost.get_by_id(db_session, post_id)
        if post:
            return jsonify(post), 200
        return jsonify({'error': 'Blog post not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to fetch blog post'}), 500

@app.route('/api/blog', methods=['POST'])
@jwt_required()
def create_blog_post():
    data = request.form
    image = request.files.get('image')
    
    image_url = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'blog', filename)
        image.save(image_path)
        image_url = f'/uploads/blog/{filename}'
    
    try:
        post_id = BlogPost.create(db_session, title=data.get('title'), content=data.get('content'), author=data.get('author', 'Admin'), image_url=image_url)
        post = BlogPost.get_by_id(db_session, post_id)
        return jsonify(post), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create blog post'}), 500

@app.route('/api/blog/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_blog_post(post_id):
    data = request.form
    image = request.files.get('image')
    
    try:
        post = BlogPost.get_by_id(db_session, post_id)
        if not post:
            return jsonify({'error': 'Blog post not found'}), 404
        
        image_url = post['image_url']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'blog', filename)
            image.save(image_path)
            image_url = f'/uploads/blog/{filename}'
        
        BlogPost.update(db_session, post_id, title=data.get('title', post['title']), content=data.get('content', post['content']), author=data.get('author', post['author']), image_url=image_url)
        updated_post = BlogPost.get_by_id(db_session, post_id)
        return jsonify(updated_post), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update blog post'}), 500

@app.route('/api/blog/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_blog_post(post_id):
    try:
        BlogPost.delete(db_session, post_id)
        return jsonify({'message': 'Blog post deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete blog post'}), 500

# ==================== GALLERY ROUTES ====================

@app.route('/api/gallery', methods=['GET'])
def get_gallery_items():
    try:
        items = GalleryItem.get_all(db_session)
        return jsonify(items), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch gallery items'}), 500

@app.route('/api/gallery', methods=['POST'])
@jwt_required()
def create_gallery_item():
    data = request.form
    file = request.files.get('file')
    
    if not file or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'gallery', filename)
    file.save(file_path)
    
    file_ext = filename.rsplit('.', 1)[1].lower()
    media_type = 'video' if file_ext in ['mp4', 'webm', 'ogg'] else 'image'
    
    try:
        item_id = GalleryItem.create(db_session, media_type=media_type, media_url=f'/uploads/gallery/{filename}', title=data.get('title', ''), description=data.get('description', ''))
        item = GalleryItem.get_by_id(db_session, item_id)
        return jsonify(item), 201
    except Exception as e:
        return jsonify({'error': 'Failed to create gallery item'}), 500

@app.route('/api/gallery/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_gallery_item(item_id):
    try:
        GalleryItem.delete(db_session, item_id)
        return jsonify({'message': 'Gallery item deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete gallery item'}), 500

# ==================== CHATBOT ROUTES ====================

@app.route('/api/chatbot/settings', methods=['GET'])
def get_chatbot_settings():
    try:
        settings = ChatbotSettings.get(db_session)
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch chatbot settings'}), 500

@app.route('/api/chatbot/settings', methods=['PUT'])
@jwt_required()
def update_chatbot_settings():
    data = request.get_json()
    try:
        ChatbotSettings.update(db_session, greeting=data.get('greeting'), faqs=json.dumps(data.get('faqs', [])))
        settings = ChatbotSettings.get(db_session)
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update chatbot settings'}), 500

@app.route('/api/chatbot/message', methods=['POST'])
def chatbot_message():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    try:
        settings = ChatbotSettings.get(db_session)
        faqs = json.loads(settings.get('faqs', '[]'))
        
        # Simple FAQ matching
        for faq in faqs:
            if any(keyword in message for keyword in faq.get('keywords', [])):
                return jsonify({'response': faq.get('answer', '')}), 200
        
        return jsonify({
            'response': 'Thank you for your message. For specific inquiries, please contact us through our contact form or email us at info@sinfinimarketing.com'
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to process chatbot message'}), 500

# ==================== DASHBOARD STATS ====================

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        # Get counts
        products = Product.get_all(db_session)
        blog_posts = BlogPost.get_all(db_session)
        gallery_items = GalleryItem.get_all(db_session)
        
        stats = {
            'products_count': len(products),
            'blog_count': len(blog_posts),
            'gallery_count': len(gallery_items),
            'total_views': 1234  # Placeholder
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch dashboard stats'}), 500

# ==================== FILE SERVING ====================

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ==================== CONTACT FORM ====================

@app.route('/api/contact', methods=['POST'])
def contact_form():
    data = request.get_json()
    # In a real application, you would send an email or store this in database
    # For now, just return success
    return jsonify({'message': 'Message sent successfully'}), 200

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    port = int(os.environ.get('PORT', '5000'))
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
