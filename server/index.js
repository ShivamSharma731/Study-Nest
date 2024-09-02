const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Channel = require("./Models/ChannelModel.js");
const nodemailer = require("nodemailer");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const PORT = 4545;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const userAuthRoutes = require("./Routes/userAuthRoutes");
const { tokenVerify } = require("./Middlewares/tokenVerify");
const Users = require("./Models/UsersModel.js");
const OtpModel = require("./Models/OtpModel.jsx");

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server Running...");
});

app.get("/searchChannels", async (req, res) => {
  const { query } = req.query;

  try {
    const channels = await Channel.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: "Failed to search channels" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find({}, "username");
    res.json(users);
  } catch (er) {
    console.error("Error fetching user list:", er);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/user/userId", async (req, res) => {
  const token = req.cookies.jwt; // Assuming the JWT is stored in cookies

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "secretkeyforthisjwtiamwritingnotinenvfuckhackers"
    );
    const userId = decoded._id;
    const user = await Users.findById(userId);

    // Return the username
    res.status(200).json({ userId, username: user.username });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shivamsharma72004@gmail.com",
    pass: "ShivamSharma@1970",
  },
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

app.post("/api/user/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // generate nodemailer and otp and send a mail to this.mail
  const otp = generateOtp();
  console.log(otp);

  const mailOptions = {
    from: "shivamsharma72004@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  // send the otp
  try {
    await transporter.sendMail(mailOptions);
    await OtpModel.create({ email, otp });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log("Error sending otp : ", err);
  }
});

app.use("/api/user", userAuthRoutes);

// Socket.IO connection
io.on("connection", async (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle the 'getChannels' event
  socket.on("getChannels", async () => {
    try {
      const channels = await Channel.find().select("name"); // Fetch channel names from the database
      socket.emit("channelList", channels); // Send the channel list to the client
    } catch (error) {
      console.error("Error fetching channels:", error);
      socket.emit("channelList", []); // Send an empty list if there was an error
    }
  });

  // Handle the 'createChannel' event
  socket.on("createChannel", async (channelName) => {
    try {
      // Create a new channel and save it to the database
      const newChannel = new Channel({ name: channelName });
      await newChannel.save();

      // Fetch the updated list of channels and broadcast it
      const channels = await Channel.find().select("name");
      io.emit("channelList", channels); // Broadcast to all connected clients
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  });

  // Handle fetching messages for a specific channel
  socket.on("fetchMessages", async (channelId) => {
    try {
      const channel = await Channel.findById(channelId).populate("messages");
      if (channel) {
        socket.emit("channelMessages", channel.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  // Handle joining a channel
  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
  });

  // Handle sending a message
  socket.on(
    "sendMessage",
    async ({ channelId, content, senderId, username }) => {
      // Create a new message object including the username
      const newMessage = {
        content,
        timestamp: new Date(),
        sender: senderId,
        username: username, // Add the username to the message object
      };

      try {
        // Save the message to the database
        await Channel.findByIdAndUpdate(
          channelId,
          { $push: { messages: newMessage } },
          { new: true }
        );
        // Emit the new message to the channel so all users can see it
        io.to(channelId).emit("newMessage", newMessage);
      } catch (err) {
        console.log(err);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

mongoose.connect(
  "mongodb+srv://shivamsharma731:ShivamSharma%402004@cluster0.vikhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
