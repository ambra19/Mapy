from flask import Flask, render_template, jsonify, request
from map_generator import generate_map
from path_finder import astar

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map_display')
def map():
    terrain_map = generate_map()
    # save it to app config's for the session
    # gets a new map every time
    app.config["terrain_map"] = terrain_map
    return jsonify({"map" : terrain_map})

@app.route('/route', methods=["POST"])
def find_route():
    print("🚀 /route endpoint hit")

    data = request.get_json()
    start = tuple(data["start"])  # (x, y)
    end = tuple(data["end"])
    travel_mode = data.get("travel_mode")  

    print("From route", "Start:", start, "End:", end)

    terrain_map = app.config.get("terrain_map")  

    path = astar(terrain_map, start, end, travel_mode)

    if path:
        return jsonify({"path": path})
    else:
        print("No path found in backend")
        return jsonify({"error": "No valid path found", "path": []}), 200


if __name__ == '__main__':
    app.run(debug=True)