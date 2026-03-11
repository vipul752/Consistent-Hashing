# Consistent Hashing

A Node.js implementation of consistent hashing with an interactive visualization. This project demonstrates how consistent hashing distributes data keys across servers and handles dynamic server changes with minimal key remapping.

## What is Consistent Hashing?

Consistent hashing is a distributed hashing technique that minimizes key redistribution when servers are added or removed. Unlike traditional hashing where adding/removing a server requires remapping most keys, consistent hashing only remaps a small fraction (K/n keys, where K is total keys and n is total servers).

## Architecture

```
┌─────────────────┐
│ Registry Server │  ← Maintains list of active servers
│   (port 3000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│Server │ │Server │  ← Backend servers (auto-register)
│ 4000  │ │ 4001  │
└───────┘ └───────┘

┌─────────────────┐
│   Visualizer    │  ← Interactive hash ring visualization
│   (port 8000)   │
└─────────────────┘
```

## Project Structure

| File                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `hashRing.js`       | Core ConsistentHash class with SHA-256 hashing and binary search |
| `registryServer.js` | Central registry that tracks active servers                      |
| `registry.js`       | Module for server registration/removal operations                |
| `server.js`         | Backend server that auto-registers with the registry             |
| `client.js`         | Demo client showing key-to-server mapping                        |
| `visualizer.js`     | Express server serving the visualization UI                      |
| `public/index.html` | Interactive canvas-based hash ring visualization                 |

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Installation

```bash
npm install
```

### Running the System

1. **Start the Registry Server**

   ```bash
   node registryServer.js
   ```

   The registry runs on port 3000 and tracks all active servers.

2. **Start Backend Servers** (in separate terminals)

   ```bash
   node server.js 4000
   node server.js 4001
   node server.js 4002
   ```

   Each server auto-registers with the registry on startup and deregisters on shutdown (Ctrl+C).

3. **Run the Client Demo**

   ```bash
   node client.js
   ```

   Shows which server handles each key based on the hash ring.

4. **Start the Visualizer**
   ```bash
   npm run visualize
   ```
   Open http://localhost:8000 to see the interactive hash ring visualization.

## How It Works

### Hash Function

Uses SHA-256 to generate a 32-bit hash from server names and data keys:

```javascript
function hash(value) {
  const hex = crypto.createHash("sha256").update(value).digest("hex");
  return parseInt(hex.substring(0, 8), 16);
}
```

### Server Lookup

Uses binary search to efficiently find the next server clockwise on the ring:

```javascript
getServer(dataKey) {
  const hashedKey = hash(dataKey);
  // Binary search to find next server position
  // Wraps around to first server if past the last
}
```

### Key Features

- **O(log n)** server lookup using binary search
- **Automatic registration** - servers register/deregister automatically
- **Real-time visualization** - watch the ring update as servers change
- **Graceful shutdown** - servers deregister on SIGINT

## Visualization

The visualizer displays:

- **Blue nodes**: Servers on the hash ring
- **Orange nodes**: Data keys and their assigned servers
- **Connecting lines**: Show which server handles each key

Use the **Add Server** and **Remove Server** buttons to see how keys get redistributed.

## License

ISC
