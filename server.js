const express = require("express");
const axios = require("axios");

const port = process.argv[2] || 4000;
const serverName = `Server-${port}`;

const app = express();

async function register() {
  await axios.post("http://localhost:3000/register", {
    server: serverName,
  });
}

async function remove() {
  await axios.post("http://localhost:3000/remove", {
    server: serverName,
  });
}

app.get("/", (req, res) => {
  res.send(`Hello from ${serverName}`);
});

app.listen(port, async () => {
  await register();
  console.log(serverName, "started");
});

process.on("SIGINT", async () => {
  await remove();
  process.exit();
});
