const WebSocket = require("ws");
const dotenv = require("dotenv");

dotenv.config();

const port = parseInt(process.env.WS_PORT || "8080", 10);

const wss = new WebSocket.Server({ port });

wss.on("connection", (ws) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(interval);
    }
  }, 30000);

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`${message}`); // echos message back to the client
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  ws.on("pong", () => {
    console.log("Received pong from client");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
