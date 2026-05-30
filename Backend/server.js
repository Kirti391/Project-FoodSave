const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ngoRoutes = require('./routes/ngoRoutes')
const donorRoutes = require('./routes/donorRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const farmRoutes = require("./routes/farmRoutes");
const userRoutes = require("./routes/userRoutes");
/* LOAD ENV */
dotenv.config();

/* DATABASE */
require('./config/db');

/* EXPRESS APP */
const app = express();

/* HTTP SERVER */
const server = http.createServer(app);

/* SOCKET.IO */
const io = socketIO(server, {
    cors: {
        origin: '*'
    }
});

/* STORE IO INSTANCE */

app.set('io', io);

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

/* SERVE FRONTEND */
app.use( express.static( path.join(__dirname, '../frontend')));
/* USE ROUTES */
app.use("/api/user", userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/donor', donorRoutes);
app.use("/api/farm", farmRoutes);
app.use('/api/volunteer', volunteerRoutes);

/* HOME ROUTE */
app.get('/', (req, res) => {
    res.sendFile( path.join( __dirname,'../frontend/index.html'));});

/* SOCKET CONNECTION */
io.on('connection', (socket) => {
    console.log('User Connected');
    socket.on('disconnect', () => {
    console.log('User Disconnected'); });
});

/* PORT */
const PORT = process.env.PORT || 5000;

/* START SERVER */
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
