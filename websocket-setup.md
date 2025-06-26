# Simple WebSocket Server Setup

# 1. Create a new directory for your WebSocket server
mkdir websocket-server
cd websocket-server

# 2. Initialize npm project
npm init -y

# 3. Install WebSocket library
npm install ws

# 4. Create server.js with this content:
echo 'const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", function connection(ws) {
  console.log("Client connected");
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: "connected",
    message: "Connected to WebSocket server",
    socketId: "server-id",
    timestamp: new Date().toISOString()
  }));
  
  // Simulate userJoined events every 5 seconds
  const interval = setInterval(() => {
    const demoUsers = ["Dr. Smith", "Dr. Johnson", "Dr. Brown", "Dr. Davis"];
    const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    
    ws.send(JSON.stringify({
      type: "userJoined",
      username: randomUser,
      userId: "user-" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    }));
  }, 5000);
  
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server running on ws://localhost:4000");' > server.js

# 5. Run the server
node server.js
