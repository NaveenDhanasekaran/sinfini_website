from flask import Flask, request, jsonify, send_from_directory
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
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

CORS(app)
jwt = JWTManager(app)

# Optionally serve React build in production if it exists
build_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build'))
if os.path.isdir(build_dir):
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        full_path = os.path.join(build_dir, path)
        if path != '' and os.path.exists(full_path):
            return send_from_directory(build_dir, path)
        return send_from_directory(build_dir, 'index.html')

# Ensure upload directories exist
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
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    db = get_db()
    user = User.get_by_username(db, username)
    
    if user and check_password_hash(user['password_hash'], password):
        access_token = create_access_token(identity=user['id'])
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user['id'],
                'username': user['username']
            }
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/verify', methods=['GET'])
@jwt_required()
def verify_token():
    current_user_id = get_jwt_identity()
    db = get_db()
    user = User.get_by_id(db, current_user_id)
    
    if user:
        return jsonify({
            'user': {
                'id': user['id'],
                'username': user['username']
            }
        }), 200
    
    return jsonify({'error': 'User not found'}), 404

# ==================== PRODUCTS ROUTES ====================

@app.route('/api/products', methods=['GET'])
def get_products():
    db = get_db()
    products = Product.get_all(db)
    return jsonify(products), 200

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    db = get_db()
    product = Product.get_by_id(db, product_id)
    
    if product:
        return jsonify(product), 200
    
    return jsonify({'error': 'Product not found'}), 404

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
    
    db = get_db()
    product_id = Product.create(
        db,
        name=data.get('name'),
        category=data.get('category'),
        description=data.get('description'),
        image_url=image_url
    )
    
    product = Product.get_by_id(db, product_id)
    return jsonify(product), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    data = request.form
    image = request.files.get('image')
    
    db = get_db()
    product = Product.get_by_id(db, product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    image_url = product['image_url']
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'products', filename)
        image.save(image_path)
        image_url = f'/uploads/products/{filename}'
    
    Product.update(
        db,
        product_id,
        name=data.get('name', product['name']),
        category=data.get('category', product['category']),
        description=data.get('description', product['description']),
        image_url=image_url
    )
    
    updated_product = Product.get_by_id(db, product_id)
    return jsonify(updated_product), 200

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    db = get_db()
    Product.delete(db, product_id)
    return jsonify({'message': 'Product deleted successfully'}), 200

# ==================== BLOG ROUTES ====================

@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    db = get_db()
    posts = BlogPost.get_all(db)
    return jsonify(posts), 200

@app.route('/api/blog/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    db = get_db()
    post = BlogPost.get_by_id(db, post_id)
    
    if post:
        return jsonify(post), 200
    
    return jsonify({'error': 'Blog post not found'}), 404

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
    
    db = get_db()
    post_id = BlogPost.create(
        db,
        title=data.get('title'),
        content=data.get('content'),
        author=data.get('author', 'Admin'),
        image_url=image_url
    )
    
    post = BlogPost.get_by_id(db, post_id)
    return jsonify(post), 201

@app.route('/api/blog/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_blog_post(post_id):
    data = request.form
    image = request.files.get('image')
    
    db = get_db()
    post = BlogPost.get_by_id(db, post_id)
    
    if not post:
        return jsonify({'error': 'Blog post not found'}), 404
    
    image_url = post['image_url']
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'blog', filename)
        image.save(image_path)
        image_url = f'/uploads/blog/{filename}'
    
    BlogPost.update(
        db,
        post_id,
        title=data.get('title', post['title']),
        content=data.get('content', post['content']),
        author=data.get('author', post['author']),
        image_url=image_url
    )
    
    updated_post = BlogPost.get_by_id(db, post_id)
    return jsonify(updated_post), 200

@app.route('/api/blog/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_blog_post(post_id):
    db = get_db()
    BlogPost.delete(db, post_id)
    return jsonify({'message': 'Blog post deleted successfully'}), 200

# ==================== GALLERY ROUTES ====================

@app.route('/api/gallery', methods=['GET'])
def get_gallery_items():
    db = get_db()
    items = GalleryItem.get_all(db)
    return jsonify(items), 200

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
    
    db = get_db()
    item_id = GalleryItem.create(
        db,
        media_type=media_type,
        media_url=f'/uploads/gallery/{filename}',
        title=data.get('title', ''),
        description=data.get('description', '')
    )
    
    item = GalleryItem.get_by_id(db, item_id)
    return jsonify(item), 201

@app.route('/api/gallery/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_gallery_item(item_id):
    db = get_db()
    GalleryItem.delete(db, item_id)
    return jsonify({'message': 'Gallery item deleted successfully'}), 200

# ==================== CHATBOT ROUTES ====================

@app.route('/api/chatbot/settings', methods=['GET'])
def get_chatbot_settings():
    db = get_db()
    settings = ChatbotSettings.get(db)
    return jsonify(settings), 200

@app.route('/api/chatbot/settings', methods=['PUT'])
@jwt_required()
def update_chatbot_settings():
    data = request.get_json()
    db = get_db()
    
    ChatbotSettings.update(
        db,
        greeting=data.get('greeting'),
        faqs=json.dumps(data.get('faqs', []))
    )
    
    settings = ChatbotSettings.get(db)
    return jsonify(settings), 200

@app.route('/api/chatbot/message', methods=['POST'])
def chatbot_message():
    data = request.get_json()
    message = data.get('message', '').lower()
    
    db = get_db()
    settings = ChatbotSettings.get(db)
    faqs = json.loads(settings.get('faqs', '[]'))
    
    # Simple FAQ matching
    for faq in faqs:
        if any(keyword in message for keyword in faq.get('keywords', [])):
            return jsonify({'response': faq.get('answer', '')}), 200
    
    return jsonify({
        'response': 'Thank you for your message. For specific inquiries, please contact us through our contact form or email us at info@sinfinimarketing.com'
    }), 200

# ==================== DASHBOARD STATS ====================

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    db = get_db()
    
    products_count = len(Product.get_all(db))
    blog_posts_count = len(BlogPost.get_all(db))
    gallery_items_count = len(GalleryItem.get_all(db))
    
    return jsonify({
        'products': products_count,
        'blog_posts': blog_posts_count,
        'gallery_items': gallery_items_count
    }), 200

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
    fe_proc = None
    if os.environ.get('START_FRONTEND_DEV') == '1':
        frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
        npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
        try:
            fe_proc = subprocess.Popen([npm_cmd, 'start'], cwd=frontend_path)
        except Exception:
            fe_proc = None

        def _cleanup():
            if fe_proc is not None and fe_proc.poll() is None:
                fe_proc.terminate()
        atexit.register(_cleanup)

    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    port = int(os.environ.get('PORT', '5000'))
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
