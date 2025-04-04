const terrainColors = {
    ocean: "#1915a0",
    water: "#0074D9",
    sand: "#e9e591",
    land: "#0b892c",
    forest: "#054917",
    mountain: "#7b3b0a",
    mountain_dark: "#4b2406",
    stone: "#a7a9a2",
    snow: "#caf1ff"
  };
  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas.getContext("2d");
  const tileSize = 8;
  
  let map = [];
  let selectedPoints = [];
  
  fetch('/map_display')
    .then(res => res.json())
    .then(data => {
        map = data.map;

        canvas.width = map[0].length * tileSize;
        canvas.height = map.length * tileSize;

        drawMap();

        canvas.addEventListener("click", handleClick);
    });
  
  
  // Draw the terrain map
  function drawMap() {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const terrain = map[y][x];
        ctx.fillStyle = terrainColors[terrain] || "#000";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
  

  // Handle canvas clicks
  function handleClick(e) {
    const x = Math.floor(e.offsetX / tileSize);
    const y = Math.floor(e.offsetY / tileSize);
  
    const terrain = map[y][x];
    const allowedTerrains = ["sand", "land", "forest", "mountain", "mountain_dark"];
  
    if (!allowedTerrains.includes(terrain)) {
      alert("You can't start or end on this tile.");
      return;
    }
  
    selectedPoints.push([x, y]);
    console.log(x, y);
  
    if (selectedPoints.length === 2) {
      const [start, end] = selectedPoints;
  
      fetch('/route', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end })
      })
      .then(res => res.json())
      .then(data => {
        console.log("data from backend", data);
        if (!data || data.error || !Array.isArray(data.path) || data.path.length === 0) {
            alert("❌ There is no path between the selected points.");
            return;
          }
        drawPath(data.path);
      })
      .catch(err => {
        alert("Something went wrong while fetching the path.");
        console.error("🚨 Fetch error:", err);
      });
      console.log("start" + start, "end" + end);
    //   console.log("path" + path);
      selectedPoints = []; // Reset
    }
  }
  
  
  // Draw the path
  function drawPath(path) {
    if (path.error || !path || path.length === 0) {
        console.log("No path found baaaa");
        return;
    }
  
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
  
    for (let i = 0; i < path.length; i++) {
      const [x, y] = path[i];
      const cx = x * tileSize + tileSize / 2;
      const cy = y * tileSize + tileSize / 2;
  
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
  
    ctx.stroke();
  }
  