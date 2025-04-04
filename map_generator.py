import noise
import numpy as np
import random
from PIL import Image


def generate_map(width=100, height=100, scale=80):
    random_base = random.randint(0, 1000)

    octaves = 4
    persistence = 0.5
    lacunarity = 2.0

    terrain_map = []

    for i in range(height):
        row = []
        for j in range(width):
            noise_val = noise.snoise2(i / scale,
                                      j / scale,
                                      octaves=octaves,
                                      persistence=persistence,
                                      lacunarity=lacunarity,
                                      repeatx=width,
                                      repeaty=height,
                                      base=564)

            normalized = noise_val + 0.5  # [-0.5, 0.5] → [0.0, 1.0]

            if normalized < 0.2:
                row.append("ocean")
            elif normalized < 0.45:
                row.append("water")
            elif normalized < 0.5:
                row.append("sand")
            elif normalized < 0.7:
                row.append("land")
            elif normalized < 0.78:
                row.append("forest")
            elif normalized < 0.85:
                row.append("mountain")
            elif normalized < 0.93:
                row.append("mountain_dark")
            elif normalized < 0.99:
                row.append("stone")
            else:
                row.append("snow")
        terrain_map.append(row)
    print(random_base)
    return terrain_map





