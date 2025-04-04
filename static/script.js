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
  const tileSize = 15;
  
  let map = [];
  let selectedPoints = [];
  
  fetch('/map_display')
    .then(res => res.json())
    .then(data => {
        map = data.map;

        canvas.width = map[0].length * tileSize; 
        canvas.height = map.length * tileSize ;

        drawMap();

        canvas.addEventListener("click", handleClick);
    });
  
  
  // Draw the terrain map
  function drawMap() {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        const terrain = map[y][x];
        ctx.fillStyle = terrainColors[terrain] || "#000";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize-0.5, tileSize-0.5);
      }
    }
  }

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
  

  // Handle canvas clicks
  function handleClick(e) {
    const x = Math.floor(e.offsetX / tileSize);
    const y = Math.floor(e.offsetY / tileSize);
  
    const terrain = map[y][x];
    const allowedTerrains = ["sand", "land", "forest", "mountain", "mountain_dark"];
  
    if (!allowedTerrains.includes(terrain)) {
      let message = "You can't start or end on this tile";
      handleErrors(message, 2000);
      selectedPoints.pop(); 
      return;
    }
  
    selectedPoints.push([x, y]);
    console.log(y, x);
  
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
        if (!data || data.error || data.length == 0) {
          let message = "No path found. Please try again.";
          handleErrors(message, 2000);
            return;
          }
        drawPath(data.path);
      })

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
  