const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const Channel = require("./Models/ChannelModel.js");
const Users = require("./Models/UsersModel.js");
const Otp = require("./Models/OtpModel.js");

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

app.use(express.json());
app.use(cookieParser());

// JWT Secret Key (Consider moving this to environment variables for security)
const JWT_SECRET = "secretkeyforthisjwtiamwritingnotinenvfuckhackers";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shivamsharma72004@gmail.com",
    pass: "rdpk runx csnn yhjf", // Move this to environment variables for security
  },
  secure: true,
});

// Generate OTP function
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Routes

// Root route to check if the server is running
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// Route to search channels
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

// Route to get users list
app.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find({}, "username");
    res.json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get user ID and username based on JWT
app.get("/api/user/userId", async (req, res) => {
  const token = req.cookies.jwt; // Assuming the JWT is stored in cookies

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded._id;
    const user = await Users.findById(userId);

    // Return the username
    res.status(200).json({ userId, username: user.username });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
});

// Route to send OTP
app.post("/api/user/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOtp();

  const mailOptions = {
    from: "shivamsharma72004@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    // Send the OTP via email
    await transporter.sendMail(mailOptions);

    // Store the OTP in the database
    await Otp.create({ email, otp });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error sending OTP:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to send OTP" });
    }
  }
});

// Route to verify OTP
app.post("/api/user/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    // Find OTP record
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Check if OTP has expired
    const otpCreatedAt = otpRecord.createdAt;
    const now = new Date();
    const expiryTime = 10 * 60 * 1000; // 10 minutes
    if (now - otpCreatedAt > expiryTime) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "3d" });

    

    // Send JWT token in a cookie
    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    // Optionally, delete the OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  }
});

// Route to handle forgot password request
app.post("/api/user/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // Generate a token that expires in 10 minutes
    const otp = generateOtp();
    await transporter.sendMail({
      from: "shivamsharma72004@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Click on the following OTP to reset your password: ${otp}`,
    });

    // Store the OTP in the database
    await Otp.create({ email, otp });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User authentication routes
const userAuthRoutes = require("./Routes/userAuthRoutes");
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
      } catch (error) {
        console.log("Error sending message:", error);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://shivamsharma731:ShivamSharma%402004@cluster0.vikhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
