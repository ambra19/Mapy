from flask import Flask, render_template, jsonify
from map_generator import generate_map

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('/index.html')

@app.route('/map')
def map():
    grid = generate_map()
    return jsonify({"map" : grid})

if __name__ == '__main__':
    app.run(debug=True)