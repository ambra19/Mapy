from noise import pnoise2
import numpy as np
import random
from noise import snoise2


def generate_map(width=80, height=60, scale=0.02):
    terrain = []

    random_base = random.randint(0, 1000)

    for y in range(height):
        row = []
        for x in range(width):
            noise_val = snoise2(
                x * scale, y * scale,
                octaves=4,
                persistence=0.4,
                lacunarity=2.0,
                repeatx=1024,
                repeaty=1024,
                base=random_base  
            )

            normalized = (noise_val + 0.5)  # [-0.5, 0.5] → [0, 1]

            if normalized < 0.1:
                row.append("water")
            elif normalized < 0.2:
                row.append("deep_water")
            elif normalized < 0.55:
                row.append("land")
            elif normalized < 0.7:
                row.append("mountain")
            elif normalized < 0.85:
                row.append("mountain_dark")
            else:
                row.append("snow")
        terrain.append(row)
    return terrain

