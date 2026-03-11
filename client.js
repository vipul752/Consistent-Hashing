const axios = require("axios");
const ConsistentHash = require("./hashRing");

async function run() {
  const res = await axios.get("http://localhost:3000/servers");

  const servers = res.data;

  const ring = new ConsistentHash();

  servers.forEach((s) => ring.addServer(s));

  const keys = ["user1", "user2", "user3", "user4", "user5"];

  keys.forEach((k) => {
    console.log(k, "->", ring.getServer(k));
  });
}

run();
