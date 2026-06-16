const express = require('express');
const methodOverride = require('method-override');
const dbConnect = require('./config/dbConnect');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');
const Notification = require('./models/notificationModel');
const User = require('./models/userModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session({
  secret: 'tomatoM4to-chat-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

// Middleware to pass flash messages to all EJS views
app.use(async (req, res, next) => {
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  
  if (req.user) {
    res.locals.unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
  } else {
    res.locals.unreadCount = 0;
  }
  next();
});

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routers/loginRouter"));
app.use("/rooms", require("./routers/roomRouter"));
app.use("/profile", require("./routers/profileRouter"));
app.use("/notifications", require("./routers/notificationRouter"));

app.use(errorHandler);

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');

  // Each user joins their private room for notifications
  socket.on('registerUser', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('chatMessage', async (data) => {
    const { roomId, userId, username, content, roomName } = data;

    // Save message to DB
    const newMessage = await Message.create({
      room: roomId,
      sender: userId,
      content: content
    });

    // Mention logic (@username)
    const mentionRegex = /@(\w+)/g;
    const mentions = content.match(mentionRegex);

    if (mentions) {
      const mentionedUsernames = [...new Set(mentions.map(m => m.substring(1)))];
      for (const targetName of mentionedUsernames) {
        const targetUser = await User.findOne({ username: targetName });
        if (targetUser && targetUser._id.toString() !== userId) {
          await Notification.create({
            recipient: targetUser._id,
            sender: userId,
            room: roomId,
            messageContent: content
          });
          io.to(`user_${targetUser._id}`).emit('newNotification', {
            senderName: username,
            roomName: roomName || "채팅방",
            content: content
          });
        }
      }
    }

    // Broadcast to the room
    io.to(roomId).emit('message', {
      _id: newMessage._id,
      username: username,
      content: content,
      createdAt: newMessage.createdAt
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});