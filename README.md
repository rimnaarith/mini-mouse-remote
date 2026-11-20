## 📦 `Mini mouse remote`

Control your computer mouse remotely from another device using a simple browser-based interface. This project uses `Express.js` to serve the UI, `Socket.IO` for real-time communication, and `@nut-tree/nut-js` to control the mouse.

---

### 🚀 Features

* 📡 Real-time remote control via WebSocket
* 🖱️ Move, click, and scroll your mouse
* 🌐 Works on any device with a browser (mobile/tablet/desktop)
* ⚡ Fast and lightweight implementation

---

### 🛠 Tech Stack

* [Express.js](https://expressjs.com/) - Web server
* [Socket.IO](https://socket.io/) - Real-time communication
* [@nut-tree/nut-js](https://github.com/nut-tree/nut.js) - Mouse automation

---

### 📦 Installation

```bash
git clone https://github.com/rimnaarith/mini-mouse-remote.git
cd mini-mouse-remote
npm install
```

---

### ▶️ Start the Server

```bash
npm start
```

Then open your browser and go to:

```
http://<your-ip>:3000
```

The server also prints the available IPv4 address(es) and a QR code in the terminal. Scan the QR code with your phone to open the remote mouse page.

💡 Tip: You must access the server from the same local network (e.g., your phone and computer are on the same Wi-Fi).

---

### 📱 Mobile Controls

The web interface supports:

* 🖱️ Moving the mouse by dragging your finger
* 📍 Tap to click
* 🌀 Two-finger swipe to scroll

---

### 📁 Project Structure

```
mini-mouse-remote/
├── public/             # Frontend HTML/JS files
├── server.js           # Main Express + Socket.IO backend
├── package.json
└── README.md
```

---

### 🔒 Permissions

To allow `@nut-tree/nut-js` to control your mouse, you might need to:

* ✅ Enable accessibility permissions (macOS)
* ✅ Run terminal with admin rights (Windows/Linux)

---

### 🧪 Development

To auto-restart on changes (optional):

```bash
npm install --save-dev nodemon
npx nodemon server.js
```

---