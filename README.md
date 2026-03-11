# Consistent Hashing

A Node.js implementation of consistent hashing with an interactive visualization. This project demonstrates how consistent hashing distributes data keys across servers and handles dynamic server changes with minimal key remapping.

## What is Consistent Hashing?

Consistent hashing is a distributed hashing technique that minimizes key redistribution when servers are added or removed. Unlike traditional hashing where adding/removing a server requires remapping most keys, consistent hashing only remaps a small fraction (K/n keys, where K is total keys and n is total servers).

## Architecture

```
       Internet
          │
┌─────────▼─────────┐
│ Visualizer +      │  ← Single server (deployment-ready)
│ Registry          │
│ (port 8000)       │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼───┐   ┌───▼───┐
│Server │   │Server │  ← Simulated servers (in-memory)
│ 5000  │   │ 5001  │
└───────┘   └───────┘
```

The visualizer and registry are merged into a single service for easy cloud deployment (single port).

## Project Structure

| File                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `hashRing.js`       | Core ConsistentHash class with SHA-256 hashing and binary search |
| `visualizer.js`     | Combined server: visualization UI + registry + simulated servers |
| `registryServer.js` | Standalone registry (for local multi-service setup)              |
| `registry.js`       | Module for server registration/removal operations                |
| `server.js`         | Backend server that auto-registers with the registry             |
| `client.js`         | Demo client showing key-to-server mapping                        |
| `public/index.html` | Interactive canvas-based hash ring visualization                 |

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm start
```

Open http://localhost:8000 to see the interactive hash ring visualization.

For development with auto-reload:

```bash
npm run visualize
```

### Deployment

This project is ready for deployment on platforms like **Render**, **Railway**, or **Fly.io**.

| Platform | Difficulty | Cost |
| -------- | ---------- | ---- |
| Render   | ⭐ easiest | free |
| Railway  | easy       | free |
| Fly.io   | medium     | free |

The app uses `process.env.PORT` so it works automatically with cloud platforms.

### Advanced Usage (Local Development)

For testing with external servers:

1. **Start separate backend servers** (optional)

   ```bash
   node server.js 4000
   node server.js 4001
   ```

2. **Run the client demo**
   ```bash
   node client.js
   ```

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
- **Single-port deployment** - merged visualizer + registry for easy cloud hosting
- **Real-time visualization** - watch the ring update as servers change
- **Simulated servers** - add/remove servers via UI buttons

## Visualization

The visualizer displays:

- **Blue nodes**: Servers on the hash ring
- **Orange nodes**: Data keys and their assigned servers
- **Connecting lines**: Show which server handles each key

Use the **Add Server** and **Remove Server** buttons to see how keys get redistributed.

## License

ISC
