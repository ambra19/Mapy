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

# A* Pathfinding 
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
    # start_time = time.time()
    # max_time = 1.0  # seconds

    start_node = Node(None, start)
    end_node = Node(None, end)
    
    open_list = [start_node]
    closed_list = []

    while open_list:
        # A* gets in an inf loop when it tries to find a path
        # near the edge of the map
        # if time.time() - start_time > max_time:
        #     return None
        current_node = open_list[0]
        current_index = 0
        for index, node in enumerate(open_list):
            if node.f < current_node.f:
                current_node = node
                current_index = index

        open_list.pop(current_index)
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
            node_pos = (current_node.position[0] + offset[0],
                        current_node.position[1] + offset[1])

            if (
                node_pos[0] < 0  # x cannot be negative
                or node_pos[0] >= len(terrain_map[0])  # x < map width
                or node_pos[1] < 0  # y cannot be negative
                or node_pos[1] >= len(terrain_map)  # y < map height
            ):
                continue  # Skip invalid positions

            terrain = terrain_map[node_pos[1]][node_pos[0]]
            cost = TERRAIN_COST.get(terrain, -1)

            if cost == -1:
                continue

            new_node = Node(current_node, node_pos)
            new_node.cost = cost  # Store cost here
            children.append(new_node)

        for child in children:
            if child in closed_list:
                continue

            child.g = current_node.g + child.cost
            child.h = (child.position[0] - end_node.position[0]) ** 2 + (child.position[1] - end_node.position[1]) ** 2
            child.f = child.g + child.h

            if any(open_node for open_node in open_list if child == open_node and child.g > open_node.g):
                continue

            open_list.append(child)


def main():

    maze = [[0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

    start = (0, 0)
    end = (7, 6)

    path = astar(maze, start, end)
    print(path)


if __name__ == '__main__':
    main()