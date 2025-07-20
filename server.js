// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { mouse, Button, keyboard } from '@nut-tree-fork/nut-js';
import { keyCodeToKeyEnum } from './utils.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin (your phone's browser)
    methods: ["GET", "POST"]
  }
});

const PORT = 3000; // Port for the server

// Serve static files (your HTML client) - optional, you can open the HTML directly
// If you save the client HTML as index.html in a 'public' folder,
// you can access it via http://YOUR_PC_IP:3000/
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Listen for mousemove events from the client
  socket.on('mousemove', async (data) => {
    const { dx, dy } = data;
    const pos = await mouse.getPosition();
    await mouse.move([{ x: pos.x + dx, y: pos.y + dy }])
  });

  // Listen for leftclick events
  socket.on('leftclick', () => {
    mouse.click(Button.LEFT);
    console.log('Left click performed');
  });

  // Listen for rightclick events
  socket.on('rightclick', () => {
    mouse.click(Button.RIGHT);
    console.log('Right click performed');
  });

  // Listen for scroll events
  socket.on('scroll', async (data) => {

    const { direction, amount } = data;
    console.log('Scroll =>', 'dir: ', direction, ', amount: ', amount)
    if (direction === 'up') {
      mouse.scrollUp(amount * 1.3)
    } else if (direction === 'down') {
      mouse.scrollDown(amount * 1.3)
    }
  });

  // Listen type events
  socket.on('type', (text) => {
    console.log('Type: ', text);
    keyboard.type(text);
  })

  socket.on('someKey', (data) => {
    console.log('Some key: ', data.code)
    const key = keyCodeToKeyEnum(data.code);
    console.log('Converted key: ', key)
    if (key != null) {
      keyboard.type(key)
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Remote Mouse Server running on port ${PORT}`);
  console.log('To connect, open the client HTML on your phone and enter this PC\'s IP address.');
  console.log('Make sure your firewall allows connections to port ' + PORT);
});
