fetch('/map')
  .then(res => res.json())
  .then(data => {
    const map = data.map;
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const tileSize = 10;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const cell = map[y][x];
        if (cell == "water") {
            ctx.fillStyle = "#07098a"; // blue for water
        }
        else if (cell == "land") {
            ctx.fillStyle = "#136309"; // green for land
        }
        else if (cell == "mountain") {
            ctx.fillStyle = "#612906"; // brown for mountains
        }
        else if (cell == "snow") {
            ctx.fillStyle = "#e5fbff"; // white for empty space
        }
        else if (cell == "mountain_dark") {
            ctx.fillStyle = "#3e2004"; 
        }
        else if (cell == "deep_water") {
            ctx.fillStyle = "#2d49f8"; 
        }

        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  });
