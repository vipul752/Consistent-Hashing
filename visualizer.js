const express = require("express");
const path = require("path");
const crypto = require("crypto");
const ConsistentHash = require("./hashRing");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

// In-memory server registry (merged from registryServer.js)
const servers = new Set();

// Hash function for keys
function hash(value) {
  const hex = crypto.createHash("sha256").update(value).digest("hex");
  return parseInt(hex.substring(0, 8), 16);
}

// ==================== Registry Routes ====================

app.post("/register", (req, res) => {
  const { server } = req.body;
  servers.add(server);
  console.log("Server registered:", server);
  res.sendStatus(200);
});

app.post("/remove", (req, res) => {
  const { server } = req.body;
  servers.delete(server);
  console.log("Server removed:", server);
  res.sendStatus(200);
});

app.get("/servers", (req, res) => {
  res.json([...servers]);
});

// ==================== Visualizer Routes ====================

app.get("/test", (req, res) => {
  res.send("Server is working");
});

app.get("/ring", (req, res) => {
  // Build fresh hash ring from registered servers
  const ring = new ConsistentHash();
  servers.forEach((server) => ring.addServer(server));

  const serverData = ring.keys.map((k) => ({
    hash: k,
    server: ring.ring.get(k),
  }));

  // Sample keys to show on ring
  const keys = [
    "user1",
    "user2",
    "user3",
    "image.png",
    "video.mp4",
    "user4",
    "user5",
    "user6",
    "video2.mp4",
  ].map((k) => ({
    key: k,
    hash: hash(k),
    server: ring.getServer(k),
  }));

  res.json({ servers: serverData, keys });
});

// Add simulated server
let counter = 5000;
app.get("/add-server", (req, res) => {
  const serverName = `Server-${counter++}`;
  servers.add(serverName);
  console.log("Server registered:", serverName);
  res.json({ ok: true, server: serverName });
});

// Remove simulated server
app.get("/remove-server", (req, res) => {
  const serverList = [...servers];
  if (serverList.length > 0) {
    const serverToRemove = serverList[serverList.length - 1];
    servers.delete(serverToRemove);
    console.log("Server removed:", serverToRemove);
    res.json({ ok: true, removed: serverToRemove });
  } else {
    res.json({ ok: false, error: "No servers to remove" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Visualizer + Registry running on port ${PORT}`);
});
