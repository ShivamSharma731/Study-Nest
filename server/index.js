const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const PORT = 4545;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const userAuthRoutes = require("./Routes/userAuthRoutes");
const { tokenVerify } = require("./Middlewares/tokenVerify");

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server Running...");
});

app.use("/api/user", userAuthRoutes); // auth routes {login and signup routes}



app.listen(PORT, () => {
  console.log(`Server running on 'http://localhost:${PORT}'`);
});

mongoose.connect(
  "mongodb+srv://shivamsharma731:ShivamSharma%402004@cluster0.vikhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  // "mongodb://localhost:27017/practice"
);
