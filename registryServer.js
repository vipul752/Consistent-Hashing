const express = require("express");

const app = express();
app.use(express.json());

const servers = new Set();

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

app.listen(3000, () => {
  console.log("Registry running on port 3000");
});
