const express = require("express");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const ConsistentHash = require("./hashRing");

const app = express();

// Hash function for keys
function hash(value) {
  const hex = crypto.createHash("sha256").update(value).digest("hex");
  return parseInt(hex.substring(0, 8), 16);
}

app.get("/test", (req, res) => {
  res.send("Server is working");
});

app.get("/ring", async (req, res) => {
  try {
    // Get servers from registry
    const response = await axios.get("http://localhost:3000/servers");
    const serverList = response.data;

    // Build fresh hash ring
    const ring = new ConsistentHash();
    serverList.forEach((server) => ring.addServer(server));

    const servers = ring.keys.map((k) => ({
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

    res.json({ servers, keys });
  } catch (err) {
    res.json({ servers: [], keys: [] });
  }
});

// Add server via registry
let counter = 5000;
app.get("/add-server", async (req, res) => {
  try {
    const serverName = `Server-${counter++}`;
    await axios.post("http://localhost:3000/register", { server: serverName });
    res.json({ ok: true, server: serverName });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// Remove server via registry
app.get("/remove-server", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/servers");
    const servers = response.data;
    if (servers.length > 0) {
      const serverToRemove = servers[servers.length - 1];
      await axios.post("http://localhost:3000/remove", {
        server: serverToRemove,
      });
      res.json({ ok: true, removed: serverToRemove });
    } else {
      res.json({ ok: false, error: "No servers to remove" });
    }
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(8000, () => {
  console.log("Visualizer running at http://localhost:8000");
});
