const crypto = require("crypto");

function hash(value) {
  const hex = crypto.createHash("sha256").update(value).digest("hex");
  return parseInt(hex.substring(0, 8), 16);
}

class ConsistentHash {
  constructor() {
    this.ring = new Map();
    this.keys = [];
  }

  addServer(server) {
    const key = hash(server);

    this.ring.set(key, server);
    this.keys.push(key);
    this.keys.sort((a, b) => a - b);

    console.log("Server added:", server);
  }

  removeServer(server) {
    const key = hash(server);

    this.ring.delete(key);

    const index = this.keys.indexOf(key);
    if (index !== -1) this.keys.splice(index, 1);

    console.log("Server removed:", server);
  }

  getServer(dataKey) {
    if (this.keys.length === 0) return null;

    const hashedKey = hash(dataKey);

    let low = 0;
    let high = this.keys.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      if (this.keys[mid] === hashedKey) {
        return this.ring.get(this.keys[mid]);
      }

      if (this.keys[mid] < hashedKey) low = mid + 1;
      else high = mid - 1;
    }

    const index = low % this.keys.length;

    return this.ring.get(this.keys[index]);
  }
}

module.exports = ConsistentHash;
