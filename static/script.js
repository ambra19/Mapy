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
  const tileSize = 18;
  
  let map = [];
  let selectedPoints = [];
  let noPath = false;
  
  function loadMap() {
    fetch('/map_display')
      .then(res => res.json())
      .then(data => {
          map = data.map;

          canvas.width = map[0].length * tileSize; 
          canvas.height = map.length * tileSize ;

          drawMap();

          canvas.addEventListener("click", handleClick);
      });
  }

  document.getElementById('resetMap').addEventListener('click', loadMap);
  window.onload = loadMap;

  // Draw the terrain map
  function drawMap() {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const terrain = map[y][x];
        ctx.fillStyle = terrainColors[terrain] || "#000";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize-0.3, tileSize-0.3);
      }
    }
  }

  function resetPaths() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    selectedPoints = [];
  }

  // Add event listener to the reset button
  document.getElementById('resetButton').addEventListener('click', resetPaths);

  function handleErrors(message, duration) {
    // Create notification container
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'error-close-button';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    
    // Add close functionality
    closeButton.onclick = () => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => errorDiv.remove(), 300);
    };
    errorDiv.appendChild(closeButton);

    // Add to DOM
    document.body.appendChild(errorDiv);

    // Auto-remove after duration
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            errorDiv.classList.add('fade-out');
        }
    }, duration);
  }
  
  function colorTile(x, y, color) {
    const canvas = document.getElementById('mapCanvas'); // Replace with your canvas ID
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }

  function resetTile(x, y) {
    const terrain = map[y][x];
    ctx.fillStyle = terrainColors[terrain] || "#000";
    ctx.fillRect(x * tileSize, y * tileSize, tileSize-0.3, tileSize-0.3);
}

function handleClick(e) {
  const x = Math.floor(e.offsetX / tileSize);
  const y = Math.floor(e.offsetY / tileSize);

  const terrain = map[y][x];
  const travelMode = document.querySelector('input[name="travel_mode"]:checked').value;
  const allowedTerrains = ["sand", "land", "forest", "mountain", "mountain_dark"];

  if (!allowedTerrains.includes(terrain)) {
      let message = "You can't start or end on this tile";
      handleErrors(message, 2000);
      if (selectedPoints.length > 0) {
          selectedPoints.pop(); 
      }
      return;
  }

  // Add new point
  selectedPoints.push([x, y]);
  colorTile(x, y, 'rgba(255, 0, 0, 1)'); // Temporary red color
  console.log(y, x);

  // If we have two points, check for path
  if (selectedPoints.length === 2) {
      const [start, end] = selectedPoints;
      const [startX, startY] = start;
      const [endX, endY] = end;

      fetch('/route', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start, end, travel_mode: travelMode })
      })
      .then(res => res.json())
      .then(data => {
          if (!data || data.error || data.length == 0) {
              let message = "No path found. Please try again.";
              handleErrors(message, 2000);
              // Reset the tiles to their original colors
              resetTile(startX, startY);
              resetTile(endX, endY);
              selectedPoints = [];
              return;
          }
          // Only proceed if path exists
          colorTile(startX, startY, "#00FF00"); // Green for start
          colorTile(endX, endY, "#FF0000");     // Red for end
          drawPath(data.path);
      })
      .catch(err => {
          console.error("Error:", err);
          // Reset tiles on error too
          if (selectedPoints.length === 2) {
              const [[startX, startY], [endX, endY]] = selectedPoints;
              resetTile(startX, startY);
              resetTile(endX, endY);
          }
          selectedPoints = [];
      });
      
      selectedPoints = []; // Reset for next selection
  }
}
  
  
  // Draw the path
  function drawPath(path) {
    if (path.error || !path || path.length === 0) {
        console.log("No path found baaaa");
        selectedPoints = [];
        return;
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
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
  