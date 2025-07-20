// Client-side JavaScript for the remote mouse
let socket;
let isConnected = false;
let lastTouchX = null;
let lastTouchY = null;
let sensitivity = 1.0; // Default sensitivity
let fingerCount = 0;
let isMove = false;

const touchpad = document.getElementById('touchpad');
const statusMessage = document.getElementById('status-message');
const ipAddressInput = document.getElementById('ipAddress');
const connectButton = document.getElementById('connectButton');
const typeTextInput = document.getElementById('typeText');
const typeTextButton = document.getElementById('typeTextButton');
const leftClickButton = document.getElementById('leftClickButton');
const rightClickButton = document.getElementById('rightClickButton');
const sensitivitySlider = document.getElementById('sensitivity');
const sensitivityValueSpan = document.getElementById('sensitivity-value');
const touchIndicator = document.getElementById('touch-indicator');

const keyboardButton = document.getElementById('keyboardButton');
const keyboardFocus = document.getElementById('keyboardFocus')

// Load IP address from local storage if available
const savedIp = localStorage.getItem('remoteMouseIp');
if (savedIp) {
  ipAddressInput.value = savedIp;
} else if (location.hostname !== 'localhost') {
  ipAddressInput.value = location.hostname;
}

// Load sensitivity from local storage if available
const savedSensitivity = localStorage.getItem('remoteMouseSensitivity');
if (savedSensitivity) {
  sensitivitySlider.value = savedSensitivity;
  sensitivity = parseFloat(savedSensitivity);
  sensitivityValueSpan.textContent = sensitivity.toFixed(1);
}

// Function to update status message
function updateStatus(message, colorClass = 'text-yellow-400') {
  statusMessage.textContent = message;
  statusMessage.className = `text-center text-lg font-medium ${colorClass}`;
}

// Function to connect to the server
function connectToServer() {
  const ip = ipAddressInput.value.trim();
  if (!ip) {
    updateStatus('Please enter a PC IP address.', 'text-red-400');
    return;
  }

  // Save IP address to local storage
  localStorage.setItem('remoteMouseIp', ip);

  updateStatus(`Attempting to connect to ${ip}...`, 'text-yellow-400');

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Connect to the Socket.IO server on the PC
  // Ensure you use the correct port (e.g., 3000 as in the server example)
  socket = io(`http://${ip}:3000`);

  socket.on('connect', () => {
    isConnected = true;
    updateStatus('Connected to PC!', 'text-green-400');
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    isConnected = false;
    updateStatus('Disconnected from PC.', 'text-red-400');
    console.log('Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    isConnected = false;
    updateStatus(`Connection failed: ${error.message}. Make sure the server is running and the IP is correct.`, 'text-red-400');
    console.error('Connection error:', error);
  });
}

// Event listener for connect button
connectButton.addEventListener('click', connectToServer);

// Event lister for type text butoon
typeTextButton.addEventListener('click', () => {
  const text = typeTextInput.value;
  if (!isConnected) return;

  socket.emit('type', text)
})

window.addEventListener('keydown', (e) => {
  if (!isConnected || e.target === typeTextInput || e.target === ipAddressInput) return;
  socket.emit('someKey', { code: e.keyCode })
})

keyboardButton.addEventListener('click', () => {
  keyboardFocus.focus();
})

// Touchpad event listeners
touchpad.addEventListener('touchstart', (e) => {
  if (!isConnected) {
    updateStatus('Not connected. Please connect first.', 'text-red-400');
    return;
  }
  e.preventDefault(); // Prevent scrolling/zooming
  fingerCount = e.touches.length;
  if (fingerCount === 1) {
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
    // Show touch indicator
    touchIndicator.style.opacity = '1';
    touchIndicator.style.transform = `translate(${e.touches[0].clientX - touchpad.getBoundingClientRect().left - 10}px, ${e.touches[0].clientY - touchpad.getBoundingClientRect().top - 10}px)`;
  } else if (fingerCount === 2) {
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }
});

touchpad.addEventListener('touchmove', (e) => {
  isMove = true;
  if (!isConnected || (fingerCount !== 1 && fingerCount !== 2)) return;
  e.preventDefault();


  const currentTouchX = e.touches[0].clientX;
  const currentTouchY = e.touches[0].clientY;

  if (lastTouchX !== null && lastTouchY !== null) {
    const dx = (currentTouchX - lastTouchX) * sensitivity;
    const dy = (currentTouchY - lastTouchY) * sensitivity;

    if (fingerCount === 2) {
      socket.emit('scroll', { direction: dy < 0 ? 'up' : 'down', amount: Math.abs(dy) })
    } else {
      socket.emit('mousemove', { dx, dy });
    }
  }
  lastTouchX = currentTouchX;
  lastTouchY = currentTouchY;

  // Update touch indicator position
  touchIndicator.style.transform = `translate(${currentTouchX - touchpad.getBoundingClientRect().left - 10}px, ${currentTouchY - touchpad.getBoundingClientRect().top - 10}px)`;
});

touchpad.addEventListener('touchend', () => {
  if (!isMove) {
    if (fingerCount === 1) {
      socket.emit('leftclick')
    }
    if (fingerCount === 2) {
      socket.emit('rightclick');
    }
    if (fingerCount === 3) {
      socket.emit('middleClick');
    }
  }
  isMove = false;
  lastTouchX = null;
  lastTouchY = null;
  // Hide touch indicator
  touchIndicator.style.opacity = '0';
});

// Click button event listeners
leftClickButton.addEventListener('click', () => {
  if (isConnected) {
    socket.emit('leftclick');
    console.log('Left click sent');
  } else {
    updateStatus('Not connected. Please connect first.', 'text-red-400');
  }
});

rightClickButton.addEventListener('click', () => {
  if (isConnected) {
    socket.emit('rightclick');
    console.log('Right click sent');
  } else {
    updateStatus('Not connected. Please connect first.', 'text-red-400');
  }
});

// Sensitivity slider event listener
sensitivitySlider.addEventListener('input', (e) => {
  sensitivity = parseFloat(e.target.value);
  sensitivityValueSpan.textContent = sensitivity.toFixed(1);
  localStorage.setItem('remoteMouseSensitivity', sensitivity); // Save sensitivity
});

// Initial connection attempt if IP is already saved
if (savedIp) {
  connectToServer();
} else {
  updateStatus('Enter PC IP and connect.', 'text-gray-400');
}