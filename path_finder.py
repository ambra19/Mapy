import time

TERRAIN_SPEED = {
    "sand":        {"walk": 2.5,  "drive": 20}, # 0.4 0.05
    "land":        {"walk": 5.0,  "drive": 45}, # 0.2 0.02
    "forest":      {"walk": 4.0,  "drive": 25}, # 0.33 0.06
    "mountain":    {"walk": 3.0,  "drive": 15},
    "mountain_dark": {"walk": 1.0,  "drive": 10},
    "ocean":       {"walk": 0,    "drive": 0},  
    "water":       {"walk": 0,    "drive": 0},  
    "stone":       {"walk": 0,  "drive": 0},  
    "snow":        {"walk": 0,  "drive": 0}
}

def get_time_cost(terrain, travel_mode):
    speed = TERRAIN_SPEED[terrain][travel_mode]
    if speed == 0:
        return float('inf')  
    if travel_mode == "walk":
        return (1 / speed) * 10
    return(1 / speed) * 100  # the bigger the speed => the lower the cost

def calculate_travel_time(path, terrain_map, travel_mode):
    if not path or len(path) < 2:
        return 0
    
    total_time_hours = 0
    for (x, y) in path:
        terrain = terrain_map[y][x]
        speed = TERRAIN_SPEED[terrain][travel_mode]
        if speed > 0:
            total_time_hours += 1 / speed
    
    return total_time_hours

class Node:
    def __init__(self, parent=None, position=None):
        self.parent = parent
        self.position = position
        self.g = 0
        self.h = 0
        self.f = 0

    def __eq__(self, other):
        return self.position == other.position

def astar(terrain_map, start, end, travel_mode):
    start_node = Node(None, start)
    end_node = Node(None, end)
    
    open_list = [start_node]
    closed_list = []

    while open_list:
        current_node = min(open_list, key=lambda x: x.f)
        open_list.remove(current_node)
        closed_list.append(current_node)

        if current_node == end_node:
            path = []
            current = current_node
            while current:
                path.append(current.position)
                current = current.parent
            return path[::-1]

        children = []
        for offset in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
            x = current_node.position[0] + offset[0]
            y = current_node.position[1] + offset[1]

            if x < 0 or y < 0 or x >= len(terrain_map[0]) or y >= len(terrain_map):
                continue

            terrain = terrain_map[y][x]
            cost = get_time_cost(terrain, travel_mode)  
            if cost == float('inf'):
                continue

            new_node = Node(current_node, (x, y))
            children.append(new_node)

        for child in children:
            if child in closed_list:
                continue

            # CHANGED: Use time-based cost instead of TERRAIN_COST
            terrain = terrain_map[child.position[1]][child.position[0]]
            child.g = current_node.g + get_time_cost(terrain, travel_mode)

            # Manhattan distance heuristic
            child.h = (abs(child.position[0] - end_node.position[0]) + abs(child.position[1] - end_node.position[1])) * 1  
            child.f = child.g + child.h

            # Check if node exists in open list with lower g
            found = False
            for idx, open_node in enumerate(open_list):
                if open_node == child and open_node.g <= child.g:
                    found = True
                    break
                elif open_node == child and open_node.g > child.g:
                    open_list.pop(idx)
                    break

            if not found:
                open_list.append(child)

    return None  