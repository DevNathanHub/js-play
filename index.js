    const express = require('express');
    const os = require('os');
    const Chance = require('chance');
    const chance = new Chance();

    const app = express();
    const PORT = 3000;

    const http = require('http');
    const socketIo = require('socket.io');

    const server = http.createServer(app);
    const io = socketIo(server);

    const multer = require('multer');
    const upload = multer({ dest: 'uploads/' });


    // Middleware to serve static files
    app.use(express.static('public'));

    // Fun endpoints
    app.get('/', (req, res) => {
        res.send(`
            <h1>Welcome to Fun Server!</h1>
            <p>Try these routes:</p>
            <ul>
                <li><a href="/joke">/joke</a> - Get a random joke</li>
                <li><a href="/sysinfo">/sysinfo</a> - System information</li>
                <li><a href="/fake-person">/fake-person</a> - Generate fake data</li>
                <li><a href="/game">/game</a> - Simple number game</li>
            </ul>
        `);
    });

    app.get('/joke', (req, res) => {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            "What do you call a fake noodle? An impasta!"
        ];
        res.json({ joke: chance.pickone(jokes) });
    });

    app.get('/sysinfo', (req, res) => {
        res.json({
            hostname: os.hostname(),
            platform: os.platform(),
            architecture: os.arch(),
            cpuCount: os.cpus().length,
            totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
            uptime: `${(os.uptime() / 3600).toFixed(2)} hours`
        });
    });

    app.get('/fake-person', (req, res) => {
        res.json({
            name: chance.name(),
            email: chance.email(),
            profession: chance.profession(),
            creditCard: chance.cc(),
            ip: chance.ip()
        });
    });

    app.get('/game', (req, res) => {
        const secretNumber = Math.floor(Math.random() * 100) + 1;
        res.send(`
            <h1>Guess the Number (1-100)</h1>
            <form action="/guess" method="get">
                <input type="number" name="guess" min="1" max="100" required>
                <button type="submit">Submit</button>
            </form>
            <p>Hint: The server remembers your number until you restart it!</p>
        `);
    });

    app.get('/guess', (req, res) => {
        const userGuess = parseInt(req.query.guess);
        const secretNumber = Math.floor(Math.random() * 100) + 1;
        
        if (userGuess === secretNumber) {
            res.send(`<h1>🎉 Correct! ${secretNumber} was the number!</h1>`);
        } else if (userGuess < secretNumber) {
            res.send(`<h1>Too low! Try a higher number than ${userGuess}</h1>`);
        } else {
            res.send(`<h1>Too high! Try a lower number than ${userGuess}</h1>`);
        }
    });

    app.post('/upload', upload.single('file'), (req, res) => {
        res.json({ 
            message: 'File uploaded!',
            file: req.file 
        });
    });

    app.get('/ascii-art', (req, res) => {
        const arts = [
            `
            (\\__/) 
            (•ㅅ•) 
            / 　 づ
            `,
            `
            ʕ•ᴥ•ʔ
            `,
            `
            (╯°□°）╯︵ ┻━┻
            `
        ];
        res.send(`<pre>${chance.pickone(arts)}</pre>`);
    });


    app.get('/rps/:choice', (req, res) => {
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = req.params.choice.toLowerCase();
        const computerChoice = chance.pickone(choices);
        
        if (!choices.includes(userChoice)) {
            return res.status(400).json({ error: 'Invalid choice. Use rock, paper, or scissors' });
        }
        
        let result;
        if (userChoice === computerChoice) {
            result = "It's a tie!";
        } else if (
            (userChoice === 'rock' && computerChoice === 'scissors') ||
            (userChoice === 'paper' && computerChoice === 'rock') ||
            (userChoice === 'scissors' && computerChoice === 'paper')
        ) {
            result = "You win!";
        } else {
            result = "Computer wins!";
        }
        
        res.json({
            userChoice,
            computerChoice,
            result
        });
    });

    // Socket.IO logic
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        // Send system info every 5 seconds
        const sysInfoInterval = setInterval(() => {
            socket.emit('sysinfo', {
                cpu: os.loadavg()[0].toFixed(2),
                mem: (100 - (os.freemem() / os.totalmem()) * 100).toFixed(2)
            });
        }, 5000);
        
        // Chat functionality
        socket.on('chat', (msg) => {
            io.emit('chat', `User: ${msg}`);
        });
        
        socket.on('disconnect', () => {
            clearInterval(sysInfoInterval);
            console.log('Client disconnected');
        });
    });

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running at:
        - Local: http://localhost:${PORT}
        - Network: http://${getLocalIpAddress()}:${PORT}`);
    });
    
    // Add this helper function (before the server starts):
    function getLocalIpAddress() {
        const interfaces = require('os').networkInterfaces();
        for (const interfaceName in interfaces) {
            for (const iface of interfaces[interfaceName]) {
                if (!iface.internal && iface.family === 'IPv4') {
                    return iface.address;
                }
            }
        }
        return 'localhost';
    }