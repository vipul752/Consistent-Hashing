const crypto = require("crypto");

function hash(data) {
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return parseInt(hash.substring(0, 8), 16);
}

class consistentHashing {
  constructor() {
    this.ring = new Map(); // Hash ring
    this.keys = []; //sorted hash or server
  }

  addServer(server) {
    const key = hash(server);

    this.ring.set(key, server); // 1000 -> Server-A
    this.keys.push(key); // [1000, 2000, 3000]
    this.keys.sort((a, b) => a - b); // Sort the keys in ascending order
  }

  removeServer(server) {
    const key = hash(server);

    this.ring.delete(key);
    const index = this.keys.indexOf(key);
    if (index !== -1) {
      this.keys.splice(index, 1);
    }
  }

  getServer(key) {
    if (this.keys.length === 0) return null;

    const hashedKey = hash(key);

    //binary search

    let low = 0;
    let high = this.keys.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      if (this.keys[mid] === hashedKey) {
        return this.ring.get(this.keys[mid]);
      }

      if (this.keys[mid] < hashedKey) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const index = low % this.keys.length;

    return this.ring.get(this.keys[index]);
  }
}

const hashRing = new consistentHashing();

hashRing.addServer("Server-A");
hashRing.addServer("Server-B");
hashRing.addServer("Server-C");

const keys = [
  "user1",
  "user2",
  "user3",
  "user4",
  "user5",
  "user6",
  "user7",
  "user8",
];

keys.forEach((key) => {
  console.log(key, "->", hashRing.getServer(key));
});
