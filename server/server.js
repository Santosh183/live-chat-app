const express = require('express');
var cors = require('cors');

const app = express();
app.use(cors());
require('dotenv').config();
const dbConfig = require('./config/dbConfig');


const port = process.env.PORT || 5000;

const userRoutes = require('./routes/usersRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use(express.json());
const server = require('http').createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']

    }
})
io.on('connection', (socket) => {
    socket.on('join-room', (userId) => {
        socket.join(userId);
    });
    // send message to members in chat room
    socket.on('send-message', (message) => {
        io.to(message.members[0]).to(message.members[1]).emit('receive-message', message)
    });
})

app.use('/api/users/', userRoutes);
app.use('/api/chats/', chatRoutes);
app.use('/api/messages/', messageRoutes);

// app.listen would be listening to normal api
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
