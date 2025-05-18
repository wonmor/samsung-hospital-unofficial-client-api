from app import create_app
from flask import jsonify

app = create_app()

@app.route('/')
def hello_world():
    return jsonify(message="Hello, world!")
