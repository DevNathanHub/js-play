# Fun Server 🎉

A playful Node.js Express server packed with fun endpoints, fake data generation, system info, a guessing game, file upload, ASCII art, a rock-paper-scissors API, and real-time features using Socket.IO!

## Features

- **Random Jokes**: `/joke` – Get a random joke in JSON.
- **System Info**: `/sysinfo` – Fetch server system details.
- **Fake Person**: `/fake-person` – Generate fake user data.
- **Guessing Game**: `/game` – Play a web-based "Guess the Number" game.
- **File Upload**: `/upload` – Upload files with `multipart/form-data`.
- **ASCII Art**: `/ascii-art` – Enjoy random ASCII art.
- **Rock-Paper-Scissors**: `/rps/:choice` – Play rock-paper-scissors via API.
- **Socket.IO**: 
  - Real-time system info broadcast.
  - Simple chat example.

## Getting Started

### Prerequisites

- Node.js >=14.x

### Installation

1. Clone this repo or copy the code.
2. Install dependencies:

    ```bash
    npm install express os chance multer socket.io
    ```

3. (Optional) Create a `public/` directory for static files.

### Running the Server

```bash
node index.js
```

The server will start on port `3000` and display both local and network URLs.

---

## API Endpoints

### Root

- **GET /**  
  Main HTML page with route links.

### Jokes

- **GET /joke**  
  Returns a random joke:  
  ```json
  { "joke": "..." }
  ```

### System Info

- **GET /sysinfo**  
  Returns JSON with host, platform, architecture, CPU count, RAM, and uptime.

### Fake Person

- **GET /fake-person**  
  Generates random name, email, profession, credit card, and IP.

### Guessing Game

- **GET /game**  
  Interactive HTML form to guess a number between 1-100.

- **GET /guess?guess=NUMBER**  
  Submits your guess, returns HTML with result.

### File Upload

- **POST /upload** (form-data, field: `file`)  
  Uploads a file, returns upload info in JSON.

### ASCII Art

- **GET /ascii-art**  
  Returns a random piece of ASCII art as HTML.

### Rock-Paper-Scissors

- **GET /rps/:choice**  
  Play rock-paper-scissors!  
  Example: `/rps/rock`  
  Returns JSON:
  ```json
  {
    "userChoice": "rock",
    "computerChoice": "scissors",
    "result": "You win!"
  }
  ```

### Static Files

- All files in the `public/` directory are served at the root.

---

## Real-time Features (Socket.IO)

- **Connect via Socket.IO** at `/`
- On connect:  
  - Receives system info (`cpu`, `mem`) every 5 seconds.
  - Emits/receives chat messages with the `chat` event.

## Example Socket.IO Usage

```js
const socket = io('http://localhost:3000');
socket.on('sysinfo', data => console.log(data));
socket.emit('chat', 'Hello!');
socket.on('chat', msg => console.log(msg));
```

---

## Code Structure

- All logic is in a single file (e.g., `index.js`).
- Static files can be placed in `public/`.
- Uploaded files go to `uploads/`.

---

## Customization & Extending

- Add more jokes, ASCII art, or custom endpoints as you wish!
- Use the `/public` directory for your client-side HTML/CSS/JS.

---

## License

MIT 
---

## Credits

This project uses:
- [Express](https://expressjs.com/)
- [Chance](https://chancejs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Socket.IO](https://socket.io/)
- Node.js built-in `os` module

---

## Author

By Nang'at
