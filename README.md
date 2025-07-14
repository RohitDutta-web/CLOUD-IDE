## Project Overview

Code Nimbus delivers a full-featured, browser-based IDE that accelerates development by shifting environments to the cloud. It combines real-time collaboration, containerized workspaces, integrated terminals and GitHub workflows into a seamless, shareable experience.

### What Is Code Nimbus?  
Code Nimbus runs your development environment in Docker containers accessible via the browser. It offers:
- A React-based UI with animated headers and responsive layouts  
- Instant terminal access inside each workspace  
- GitHub integration for branch management and pull requests  
- Real-time code collaboration powered by WebSockets  

### Problems It Solves  
- Environment drift across machines and OS versions  
- Time wasted on local setup and dependency conflicts  
- Limited collaboration in traditional editors  
- Disconnected workflows between code, terminals and Git  

### Core Features  
- Real-time Collaboration  
  • Synchronized editing, live cursors and chat in every workspace  
- Docker Containerization  
  • Isolated, reproducible environments per project  
- Integrated Terminal  
  • Full Bash shell inside your browser with persistent state  
- GitHub Integration  
  • One-click clone, commit, push and PR management  
- Theming & Extensibility  
  • Customizable layouts, plugin support for language servers and linters  

### When to Use Code Nimbus  
- Distributed teams needing shared workspaces  
- Workshops, coding bootcamps and hackathons  
- Microservice development with container isolation  
- Onboarding new developers with zero-setup environments  
- Demos, client previews and collaborative debugging sessions
## Quick Start

Get the full CLOUD-IDE stack running locally or via Docker Compose in minutes.

### Prerequisites  
• Node.js >= 18 and npm  
• Docker & Docker Compose (for Docker mode)

---

### Local Development

1. Clone the repo  
   ```bash
   git clone https://github.com/RohitDutta-web/CLOUD-IDE.git
   cd CLOUD-IDE
   ```

2. Install dependencies  
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. Configure environment  
   Create `server/.env` with these variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/codeNimbus
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Start MongoDB  
   ```bash
   docker run -d --name codeNimbus-db -p 27017:27017 mongo:latest
   ```

5. Launch the server  
   ```bash
   cd server
   node app.js
   ```
   (Alternatively, install nodemon globally and run `nodemon app.js` for auto-reload.)

6. Launch the client  
   ```bash
   cd client
   npm run dev
   ```
   Open http://localhost:5173 in your browser.

---

### Docker Compose

1. At project root, create `docker-compose.yml`:
   ```yaml
   version: '3.8'
   services:
     db:
       image: mongo:latest
       ports:
         - '27017:27017'
     server:
       build:
         context: ./server
         dockerfile: Dockerfile.user
       working_dir: /home/node
       volumes:
         - ./server:/home/node
       env_file:
         - ./server/.env
       command: npm run dev || node app.js
       ports:
         - '3000:3000'
       depends_on:
         - db
     client:
       image: node:18
       working_dir: /home/node
       volumes:
         - ./client:/home/node
       command: npm run dev -- --host
       ports:
         - '5173:5173'
   ```

2. Start all services  
   ```bash
   docker-compose up --build
   ```

3. Access the IDE  
   http://localhost:5173

Stop the stack with Ctrl+C or `docker-compose down`.

---

### Tips  
• Override Vite port: `npm run dev -- --port=3001`  
• Lint client code before commits: `cd client && npm run lint`  
• Persist DB data: add a volume to the `db` service in `docker-compose.yml`  
• For server hot-reload, add nodemon as a devDependency and update the compose command to `nodemon app.js`
## Core Concepts & Architecture

This section outlines how the CLOUD-IDE system components interact: the React client with persistent authentication state, the Node.js/Express server with Socket.IO–powered terminals, per-user and per-room Docker containers, and persistent storage. Together they deliver a real-time, container-backed coding environment.

### Redux Persist Setup for User Authentication State

Provides a persistent Redux store for tracking authenticated user data (`user`) and login status (`isLoggedIn`). State syncs to `localStorage`, preserving sessions across reloads.

#### Essential Files
- `src/utils/userSlice.js` – defines authentication slice.  
- `src/utils/store.js` – configures Redux store with Redux Persist.  
- `src/main.jsx` – wraps the app in `<Provider>` and `<PersistGate>`.

#### 1. Define the authentication slice (`userSlice.js`)
Holds `user` (object|null) and `isLoggedIn` (boolean). Exports:
- `setUser(payload)`
- `setIsLoggedIn(payload)`
- `logOut()`

```javascript
// src/utils/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, isLoggedIn: false };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) { state.user = action.payload },
    setIsLoggedIn(state, action) { state.isLoggedIn = action.payload },
    logOut(state) {
      state.user = null;
      state.isLoggedIn = false;
    }
  }
});

export const { setUser, setIsLoggedIn, logOut } = userSlice.actions;
export default userSlice.reducer;
```

#### 2. Configure Redux Persist (`store.js`)
Wraps `userReducer` with `persistReducer`, whitelisting keys to persist.

```javascript
// src/utils/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "isLoggedIn"]
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: { user: persistedUserReducer }
});

export const persistor = persistStore(store);
```

#### 3. Integrate Provider and PersistGate (`main.jsx`)
Ensure Redux and persisted state load before rendering.

```javascript
// src/main.jsx
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./utils/store.js";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { Toaster } from "./components/ui/sonner.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
      <Toaster />
    </PersistGate>
  </Provider>
);
```

#### Practical Usage
- On login, dispatch `setUser(userData)` and `setIsLoggedIn(true)`.  
- On logout or token expiry, dispatch `logOut()`.  
- To reset persistence, call `persistor.purge()` or clear site storage.

---

### Socket.IO Authentication & Terminal Session Setup

Secures WebSocket clients via JWT in HTTP cookies, then provisions Docker-backed terminals (via `node-pty`) and real-time messaging per user and per room.

#### 1. Socket.IO JWT Middleware
Parses `token` from `socket.handshake.headers.cookie`, verifies it, and injects `socket.userId`.

```javascript
import cookie from "cookie";
import jwt from "jsonwebtoken";

io.use((socket, next) => {
  const raw = socket.handshake.headers.cookie;
  if (!raw) return next(new Error("Authentication token missing"));

  const { token } = cookie.parse(raw);
  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = id;
    next();
  } catch {
    next(new Error("Authentication failed"));
  }
});
```

#### 2. Connection Handler & Containers
- On connect: `createUSerContainer(userId)`  
- Track `userId → socket.id` for cleanup  
- On `"join-room"`:
  - Join Socket.IO room  
  - `createRoomContainer(roomId)`  
  - Spawn a bash shell via `node-pty` (80×24)  
  - Proxy terminal I/O over WebSocket

```javascript
import pty from "node-pty";
import path from "path";
const userSocketMap = new Map();

io.on("connection", socket => {
  const { userId } = socket;
  createUSerContainer(userId);
  console.log(`User ${userId} connected (${socket.id})`);

  socket.on("join-room", roomId => {
    socket.join(roomId);
    createRoomContainer(roomId);
    userSocketMap.set(userId, socket.id);
    socket.to(roomId).emit("user-joined", { userId });

    const ptyProcess = pty.spawn("bash", [], {
      name: "xterm-color",
      cols: 80, rows: 24,
      cwd: path.resolve(process.env.HOME || "/home"),
      env: process.env
    });

    ptyProcess.on("data", data => {
      socket.emit("terminal-output", data);
    });

    socket.on("terminal-input", input => ptyProcess.write(input));
    socket.on("resize-terminal", ({ cols, rows }) => {
      ptyProcess.resize(cols, rows);
    });
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of userSocketMap) {
      if (sid === socket.id) {
        userSocketMap.delete(uid);
        console.log(`User ${uid} disconnected`);
        break;
      }
    }
  });
});
```

#### 3. Real-Time Messaging
Broadcasts chat messages to all clients in a room.

```javascript
socket.on("send-message", ({ roomId, message, sender }) => {
  io.to(roomId).emit("receive-message", { message, sender });
});
```

#### 4. Client-Side Usage Pattern

```javascript
import { io } from "socket.io-client";

const socket = io(process.env.SOCKET_URL, { withCredentials: true });

socket.on("connect_error", err => {
  console.error("Socket error:", err.message);
});

// Join a room
socket.emit("join-room", roomId);

// Terminal I/O
terminal.onData(data => socket.emit("terminal-input", data));
socket.on("terminal-output", data => terminal.write(data));
window.addEventListener("resize", () => {
  const { cols, rows } = terminal;
  socket.emit("resize-terminal", { cols, rows });
});

// Chat
sendButton.onclick = () => {
  socket.emit("send-message", { roomId, message: input.value, sender: username });
};
socket.on("receive-message", ({ message, sender }) => {
  chatWindow.append(`${sender}: ${message}`);
});
```

#### Practical Guidance
- Ensure `CLIENT_URL` matches origin for both HTTP and WebSocket CORS.  
- Store JWT in an HTTP-accessible cookie named `token`.  
- Clean up `pty` processes on client disconnect to avoid orphaned shells.  
- Adjust default `cols`/`rows` to match the client terminal emulator.

---

### Creating User Private Docker Containers

Provides each authenticated user with a persistent, isolated Docker container backed by a host-mounted workspace.

#### Workflow
- Ensures host directory `/home/codeNimbus/user/{userId}` exists.  
- If a container named `{userId}-codeNimbus-image` exists, returns it.  
- Otherwise, spins up a new container from `your-code-nimbus-image`, mounting the user directory at `/workspace`.

#### API Surface

```javascript
import { createUSerContainer } from "server/utils/dockerManager";

// Returns a Dockerode Container object or container ID
const containerOrId = await createUSerContainer(userId);
```

#### Usage in an Express Route

```javascript
import express from "express";
import { createUSerContainer } from "./server/utils/dockerManager";

const router = express.Router();

router.post("/start-container", async (req, res) => {
  const userId = req.user.id;
  try {
    const container = await createUSerContainer(userId);
    const id = typeof container === "string" ? container : container.id;
    res.json({ success: true, containerId: id });
  } catch (err) {
    console.error("Failed to start container:", err);
    res.status(500).json({ error: "Container initialization failed" });
  }
});

export default router;
```

#### Practical Tips
- Ensure `/home/codeNimbus/user/{userId}` has appropriate permissions for the Docker daemon.  
- To run commands inside the container (e.g., compile code), use Dockerode’s `container.exec()` API.  
- Clean up unused containers manually with `docker rm {containerName}` or schedule automated cleanup.  
- Monitor container resource usage to enforce per-user quotas.
## User Guide

This section walks you through everyday tasks in Code Nimbus: updating your social links and interacting with the built-in terminal.

### Updating Social Links (LinkedIn & GitHub)

You can modify your LinkedIn and GitHub URLs directly from your profile settings.

#### Front-end Usage

1. Navigate to **Profile → Social Links**.  
2. In the **LinkedIn URL** or **GitHub URL** field, paste your profile link.  
3. Click **Modify** to save.

Behind the scenes, `UserDetails.jsx` manages state and submits to your server:

```jsx
// state
const [linkedInUrl, setLinkedInUrl] = useState('');
const [gitHubUrl, setGitHubUrl]   = useState('');

// onChange handlers
const handleLinkedInEntry = e => setLinkedInUrl(e.target.value);
const handleGitHubEntry   = e => setGitHubUrl(e.target.value);

// submit functions
const handleLinkedIn = async () => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_LINKEDIN,
      { url: linkedInUrl },
      { withCredentials: true }
    );
    if (res.data.success) toast(res.data.message);
  } catch (e) { console.error(e); }
};

const handleGitHub = async () => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_GITHUB,
      { url: gitHubUrl },
      { withCredentials: true }
    );
    if (res.data.success) toast(res.data.message);
  } catch (e) { console.error(e); }
};
```

#### Back-end Controllers

Your server extracts `req.id` from the auth token, finds the user, updates the URL, and returns a status:

```js
// user.controller.js
export const linkedIn = async (req, res) => {
  const { url } = req.body;
  const user     = await User.findById(req.id);
  if (!user) return res.status(400).json({ message: "Invalid user", success: false });
  user.linkedIn = url;
  await user.save();
  res.status(200).json({ message: "LinkedIn Account updated", success: true });
};

export const gitHub = async (req, res) => {
  const { url } = req.body;
  const user     = await User.findById(req.id);
  if (!user) return res.status(400).json({ message: "Invalid user", success: false });
  user.gitHub = url;
  await user.save();
  res.status(200).json({ message: "GitHub Account updated", success: true });
};
```

#### Practical Tips

- Ensure your auth middleware sets `req.id` from the JWT in the `token` cookie.  
- Define `VITE_LINKEDIN` and `VITE_GITHUB` in `.env` to match your API routes (e.g. `/api/user/linkedin`).  
- Use `toast` for instant feedback on success or failure.

---

### Terminal UI Component (TerminalUi)

Embed a standalone xterm.js terminal for simple input/output echoing.

#### Setup

1. Install xterm:  
   ```bash
   npm install @xterm/xterm
   ```
2. Import its CSS once, e.g. in `index.jsx`:  
   ```js
   import '@xterm/xterm/css/xterm.css';
   ```

#### Implementation

```jsx
import { Terminal } from '@xterm/xterm';
import { useEffect, useRef } from 'react';

export default function TerminalUi() {
  const terminalRef = useRef(null);
  const isRendered  = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;

    const term = new Terminal({ cursorBlink: false, rows: 20 });

    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.writeln('Welcome to Code Nimbus');

      term.onData(data => {
        term.write(data); // echo back
      });
    }
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{ width: '100%', height: '100%', background: '#000' }}
    />
  );
}
```

#### Usage

- Place `<TerminalUi />` inside any layout (e.g. in `Room.jsx`).  
- Ensure its container has fixed or flex dimensions so xterm can render correctly.  
- To extend:
  - Adjust rows/cols, enable `cursorBlink`, set `fontFamily` or `theme`.  
  - Replace the echo logic in `onData` with custom command parsing or logging.  
  - Call `term.dispose()` in a cleanup if you remount often.

---

### Real-time Terminal Integration Using xterm.js and Socket.IO

Run a live shell session in the browser by connecting xterm.js to a `node-pty` subprocess over WebSockets.

#### Client-side (`TerminalUi.jsx`)

```jsx
import { Terminal } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function TerminalUi({ roomId }) {
  const terminalRef = useRef(null);
  const termRef     = useRef(null);
  const socketRef   = useRef(null);

  useEffect(() => {
    if (termRef.current) return;

    // Initialize xterm
    termRef.current = new Terminal({ cursorBlink: false, rows: 24 });
    termRef.current.open(terminalRef.current);

    // Connect to server
    socketRef.current = io(process.env.REACT_APP_SERVER_URL, { withCredentials: true });
    socketRef.current.emit('join-room', roomId);

    // Incoming data → terminal
    socketRef.current.on('terminal-output', data => {
      termRef.current.write(data);
    });

    // User keystrokes → server
    termRef.current.onData(data => {
      socketRef.current.emit('terminal-input', data);
    });

    // Resize events
    termRef.current.onResize(({ cols, rows }) => {
      socketRef.current.emit('resize-terminal', { cols, rows });
    });

    termRef.current.writeln('Connected to remote shell');
  }, [roomId]);

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
}
```

#### Server-side (excerpt from `app.js`)

```js
import pty from 'node-pty';
import path from 'path';

io.on('connection', socket => {
  socket.on('join-room', roomId => {
    const ptyProcess = pty.spawn('bash', [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: path.resolve(process.env.HOME),
      env: process.env,
    });

    // PTY → client
    ptyProcess.on('data', data => {
      socket.emit('terminal-output', data);
    });

    // client → PTY
    socket.on('terminal-input', input => {
      ptyProcess.write(input);
    });

    // handle resize
    socket.on('resize-terminal', ({ cols, rows }) => {
      ptyProcess.resize(cols, rows);
    });
  });

  socket.on('disconnect', () => {
    // optional: clean up PTY processes
  });
});
```

#### Practical Usage

- Pass a valid `roomId` and ensure your auth middleware permits joining that room.  
- Tune `cols`/`rows` to fit your UI panel.  
- Implement cleanup on socket disconnect to avoid orphaned PTY processes.  
- Style the terminal container (full width/height or flex) to prevent clipping.
## API Reference

### Authentication Middleware (userAuthentication)

Overview  
Protect routes by verifying a JWT stored in a cookie, attaching the user’s ID to `req.id`.

#### Middleware Implementation

File: `server/middlewares/auth.middleware.js`

```javascript
import jwt from "jsonwebtoken";

const userAuthentication = async (req, res, next) => {
  try {
    // 1. Extract token from cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "Please login first",
        success: false
      });
    }

    // 2. Verify token and attach user ID
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.id;

    next();
  } catch (e) {
    console.error("Auth error:", e);
    res.status(500).json({
      message: "Auth server issue",
      success: false
    });
  }
};

export default userAuthentication;
```

Key Points  
- Reads JWT from the `token` cookie  
- Verifies with `process.env.SECRET_KEY`  
- On success, sets `req.id` to the user’s MongoDB `_id`  
- Returns 400 if no token, 500 on verification errors  

#### Applying the Middleware

File: `server/routes/user.routes.js`

```javascript
import express from "express";
import userAuthentication from "../middlewares/auth.middleware.js";
import {
  updateUser,
  sendVerificationMail,
  logOut,
  gitHub,
  linkedIn
} from "../controllers/user.controller.js";

const router = express.Router();

router.put("/update",      userAuthentication, updateUser);
router.get("/verification", userAuthentication, sendVerificationMail);
router.get("/logout",      userAuthentication, logOut);
router.post("/github",     userAuthentication, gitHub);
router.post("/linkedin",   userAuthentication, linkedIn);

export default router;
```

Practical Usage  
1. Configure your client (e.g., Axios) to send cookies:  
   ```js
   axios.defaults.withCredentials = true;
   ```  
2. On login, set the JWT cookie (see `logIn` controller).  
3. All protected routes receive `req.id` in controllers.  

Example in `updateUser` controller:

```javascript
export const updateUser = async (req, res) => {
  const user = await User.findById(req.id);
  // … validate input, apply changes, save user
  res.json({ success: true, user });
};
```

Environment Variables  
- `SECRET_KEY`: used for both `jwt.sign` (login) and `jwt.verify` (middleware)  
- Configure cookie options (`sameSite`, `httpOnly`, `secure`) in your Express setup  

---

### Real-time Terminal Sessions via Socket.IO and node-pty

Overview  
Spawn a pseudo-terminal (pty) per room and stream I/O over WebSocket for collaborative terminal sessions.

#### How It Works  
1. Client emits `join-room` with a room ID.  
2. Server joins the Socket.IO room, creates a container, then spawns a bash pty.  
3. Server listens on pty output and emits `terminal-output`.  
4. Client sends keystrokes as `terminal-input` and resize events as `resize-terminal`.  

#### Server Setup

File: `server/app.js` (excerpt)

```javascript
import { Server } from "socket.io";
import pty from "node-pty";
import path from "path";
import createRoomContainer from "./utils/container.js";

const io = new Server(httpServer, { /* auth middleware applied here */ });

io.on("connection", socket => {
  let ptyProcess;

  socket.on("join-room", roomId => {
    socket.join(roomId);
    createRoomContainer(roomId);

    ptyProcess = pty.spawn("bash", [], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: path.resolve(process.env.HOME || "/home"),
      env: process.env
    });

    // Forward output to client
    ptyProcess.on("data", data => {
      socket.emit("terminal-output", data);
    });

    // Handle client input
    socket.on("terminal-input", input => {
      ptyProcess.write(input);
    });

    // Handle resize
    socket.on("resize-terminal", ({ cols, rows }) => {
      ptyProcess && ptyProcess.resize(cols, rows);
    });
  });

  socket.on("disconnect", () => {
    ptyProcess && ptyProcess.kill();
  });
});
```

#### Client Usage Pattern

```javascript
import { io } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const socket = io(process.env.SERVER_URL, { withCredentials: true });
const term   = new Terminal({ cursorBlink: true });
const fit    = new FitAddon();

term.loadAddon(fit);
term.open(document.getElementById("terminal"));
fit.fit();

socket.emit("join-room", roomId);

socket.on("terminal-output", data => term.write(data));
term.onData(data => socket.emit("terminal-input", data));

window.addEventListener("resize", () => {
  fit.fit();
  socket.emit("resize-terminal", {
    cols: term.cols,
    rows: term.rows
  });
});
```

Practical Guidance  
- Apply Socket.IO authentication (`io.use(...)`) to secure real-time sessions.  
- Debounce resize events to reduce load.  
- Ensure `pty` processes terminate on `disconnect` to avoid orphans.  
- Adjust initial `cols`/`rows` based on client viewport for better UX.
## Deployment & Configuration

Overview: Guide to prepare production deployment, manage environment variables, establish database and SMTP connections, and enforce secure cookies.

### Environment Variables Setup

Define variables in a `.env` file at project root (not committed to VCS).

Required variables:
- NODE_ENV — “production” or “development”
- PORT — HTTP port (e.g. 3000)
- MONGO_URI — MongoDB connection string
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD — SMTP server credentials
- COOKIE_SECRET — secret key for signing cookies

Example `.env`:
```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster/mydb
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=abc123
SMTP_PASSWORD=secret
COOKIE_SECRET=your_cookie_secret
```

Load variables at startup (in `server/app.js` or entrypoint):
```javascript
import dotenv from "dotenv";
dotenv.config();
```

### Database Connection Configuration

Establish a MongoDB connection using Mongoose.

File: server/config/db.js
```javascript
import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;

export const dbConnection = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✔️  Database connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message || err);
    process.exit(1); // abort startup on DB failure
  }
};
```

Usage in `server/app.js`:
```javascript
import express from "express";
import { dbConnection } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  await dbConnection();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
```

### SMTP Transporter Setup

Configure Nodemailer transporter for transactional emails.

File: server/config/smtp.config.js
```javascript
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
```

Example usage:
```javascript
import { transporter } from "./config/smtp.config.js";

export async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: '"Cloud IDE" <noreply@cloud-ide.com>',
    to,
    subject: "Welcome to Cloud IDE",
    html: `<p>Hi ${name}, your workspace is ready.</p>`,
  };
  await transporter.sendMail(mailOptions);
  console.log(`✉️  Sent welcome email to ${to}`);
}
```

### Secure Cookies Configuration

Enforce HTTP-only, secure cookies for sessions or authentication tokens.

1. Install dependencies:
   ```bash
   npm install cookie-parser express-session
   ```

2. Configure in `server/app.js`:
   ```javascript
   import express from "express";
   import cookieParser from "cookie-parser";
   import session from "express-session";

   const app = express();

   // Parse and sign cookies
   app.use(cookieParser(process.env.COOKIE_SECRET));

   // Session configuration
   app.use(session({
     name: "sid",
     secret: process.env.COOKIE_SECRET,
     resave: false,
     saveUninitialized: false,
     cookie: {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
       maxAge: 1000 * 60 * 60 * 24, // 1 day
     },
   }));
   ```

3. Usage:
   ```javascript
   // After login
   req.session.userId = user._id;
   // To clear session
   req.session.destroy(err => { /* ... */ });
   ```

Ensure your application runs over HTTPS in production to enable secure cookies.
## Contribution Guide

This guide covers coding standards, folder structure, linting, imports, and the pull-request process.

### Repository Layout

client/  
&nbsp;&nbsp;├── components.json        # UI tokens, component aliases, styling conventions  
&nbsp;&nbsp;├── eslint.config.js      # ESLint rules for React, Hooks, Refresh  
&nbsp;&nbsp;├── jsconfig.json         # Path aliases (`@/…`) for imports  
&nbsp;&nbsp;└── src/                   # React components and pages  
common/  
&nbsp;&nbsp;└── …                      # Shared utilities and types  
server/  
&nbsp;&nbsp;└── …                      # API, database models, server-side logic  
scripts/  
&nbsp;&nbsp;└── …                      # Build, deploy, maintenance scripts  

### Coding Standards & Linting

All client-side code must pass ESLint checks defined in `client/eslint.config.js`.

Run the linter:  
```bash
# from project root
npx eslint --config client/eslint.config.js client/
```

Common workflows:  
- **Fix errors automatically**  
  ```bash
  npx eslint --fix --config client/eslint.config.js client/
  ```
- **VSCode integration**: ensure your ESLint extension points at `client/eslint.config.js`.  
- **Adding rules**: extend the `rules` object or add plugins in the second array element of `client/eslint.config.js`.

### Import Aliases

Use `@/` to reference files under `client/src`. This leverages `client/jsconfig.json`.

Example:  
```jsx
// Before (relative paths)
import Button from "../../../components/Button"

// After (alias)
import Button from "@/components/Button"
```

### Component Styling Conventions

`client/components.json` defines styling tokens, component aliases, and icon mappings.

To add a new component alias:  
1. Open `client/components.json`.  
2. Under `"aliases"`, add your entry:
   ```jsonc
   {
     "aliases": {
       "Card": "src/components/ui/Card.jsx",
       "MyWidget": "src/components/widgets/MyWidget.jsx"
     }
   }
   ```
3. Run your code; imports resolve via `@/components/Card`.

### Branching & Commit Messages

- Create a topic branch:  
  ```bash
  git checkout -b feature/123-add-login-form
  ```
- Follow [Conventional Commits](https://www.conventionalcommits.org/):
  ```
  feat(auth): add login form with validation
  fix(ui): correct button margin in header
  docs: update CONTRIBUTING guide
  ```
- Push when your branch is ready:
  ```bash
  git push origin feature/123-add-login-form
  ```

### Opening a Pull Request

1. Push your branch to the remote.  
2. Navigate to the repository on GitHub.  
3. Click “New pull request” targeting `main`.  
4. In the PR template:
   - Reference related issue (e.g., `Closes #123`).  
   - Provide a concise description of changes.  
   - List any manual testing steps.  
5. Ensure:
   - All ESLint checks pass.  
   - No unresolved merge conflicts.  
   - CI build (if configured) succeeds.  
6. Request reviews from relevant teammates.  

Thank you for contributing! We welcome your improvements and feedback.
