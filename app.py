from flask import Flask, render_template, jsonify, request
from map_generator import generate_map
from path_finder import astar, calculate_travel_time

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
    data = request.get_json()
    start = tuple(data["start"])  
    end = tuple(data["end"])
    travel_mode = data.get("travel_mode")  
    terrain_map = app.config.get("terrain_map")  

    path = astar(terrain_map, start, end, travel_mode)

    if path:
        travel_time = calculate_travel_time(path, terrain_map, travel_mode)
        return jsonify({
            "path": path,
            "time_hours": travel_time,
            "time_minutes": travel_time * 60
        })

    else:
        print("No path found in backend")
        return jsonify({"error": "No valid path found", "path": []}), 200


if __name__ == '__main__':
    app.run(debug=True)