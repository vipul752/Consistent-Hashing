const ConsistentHash = require("./hashRing");

const hashRing = new ConsistentHash();

const servers = new Set();

function registerServer(server) {
  servers.add(server);
  hashRing.addServer(server);
}

function removeServer(server) {
  servers.delete(server);
  hashRing.removeServer(server);
}

function getServerForKey(key) {
  return hashRing.getServer(key);
}

module.exports = {
  registerServer,
  removeServer,
  getServerForKey,
};
