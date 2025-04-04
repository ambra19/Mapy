import time

TERRAIN_COST = {
    "sand": 5,
    "land": 1,
    "forest": 10,
    "mountain": 20,
    "mountain_dark": 30,
    "ocean": -1,
    "water": -1,
    "stone": -1,
    "snow": -1,
}

class Node:
    def __init__(self, parent=None, position=None):
        self.parent = parent
        self.position = position
        self.g = 0
        self.h = 0
        self.f = 0

    def __eq__(self, other):
        return self.position == other.position

def astar(terrain_map, start, end):
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
            cost = TERRAIN_COST.get(terrain, -1)
            if cost == -1:
                continue

            new_node = Node(current_node, (x, y))
            children.append(new_node)

        for child in children:
            if child in closed_list:
                continue

            child.g = current_node.g + TERRAIN_COST[terrain_map[child.position[1]][child.position[0]]]
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