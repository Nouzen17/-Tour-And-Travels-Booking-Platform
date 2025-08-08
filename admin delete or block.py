from flask_pymongo import PyMongo

mongo = PyMongo()

def get_user_by_id(user_id):
    return mongo.db.users.find_one({"_id": user_id})

def delete_user_by_id(user_id):
    return mongo.db.users.delete_one({"_id": user_id})

def block_user(user_id):
    return mongo.db.users.update_one({"_id": user_id}, {"$set": {"isBlocked": True}})

def unblock_user(user_id):
    return mongo.db.users.update_one({"_id": user_id}, {"$set": {"isBlocked": False}})


import jwt
from flask import request, jsonify
from functools import wraps
from bson import ObjectId
from config import JWT_SECRET
from models.user_model import mongo

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = mongo.db.users.find_one({"_id": ObjectId(data["id"])})
            if not current_user:
                return jsonify({"message": "User not found"}), 401
        except Exception as e:
            return jsonify({"message": "Token is invalid", "error": str(e)}), 401

        return f(current_user, *args, **kwargs)
    return decorated

def admin_only(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user["role"] != "admin":
            return jsonify({"message": "Admin access required"}), 403
        return f(current_user, *args, **kwargs)
    return decorated


from flask import Blueprint, jsonify
from bson import ObjectId
from models.user_model import mongo
from middleware.auth_middleware import token_required, admin_only

admin_bp = Blueprint('admin_bp', _name_)

# Delete user account
@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@token_required
@admin_only
def delete_user(current_user, user_id):
    result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "User deleted successfully"})

# Block user
@admin_bp.route("/users/<user_id>/block", methods=["PUT"])
@token_required
@admin_only
def block_user(current_user, user_id):
    result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"isBlocked": True}})
    if result.matched_count == 0:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "User blocked successfully"})

# Unblock user
@admin_bp.route("/users/<user_id>/unblock", methods=["PUT"])
@token_required
@admin_only
def unblock_user(current_user, user_id):
    result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"isBlocked": False}})
    if result.matched_count == 0:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "User unblocked successfully"})

from flask import Flask
from flask_pymongo import PyMongo
from config import MONGO_URI
from models.user_model import mongo
from routes.admin_routes import admin_bp

app = Flask(_name_)
app.config["MONGO_URI"] = MONGO_URI

mongo.init_app(app)

# Register routes
app.register_blueprint(admin_bp, url_prefix="/api/admin")

if _name_ == "_main_":
    app.run(debug=True, port=1670)

if user.get("isBlocked", False):

    return jsonify({"message": "Your account is blocked. Contact admin."}), 403
