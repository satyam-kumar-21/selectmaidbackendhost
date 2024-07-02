const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cloudinary = require("cloudinary").v2;
const dbConnect = require("./database/dbConfig");
const heroRouter = require("./routes/heroRoutes");
const aboutRouter = require("./routes/aboutRoutes");
const galleryRouter = require("./routes/galleryRoutes");
const newUpdateRouter = require("./routes/newUpdateRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const ratingRouter = require("./routes/ratingRoutes");
const branchRouter = require("./routes/branchRoutes");

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

dbConnect();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS Configuration
const corsOptions = {
origin: ['https://selectmaid.netlify.app/'], // You can specify a specific origin instead of '*' for better security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Cloudinary setup
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

// Routes
app.use("/hero", heroRouter);
app.use("/about", aboutRouter);
app.use("/gallery", galleryRouter);
app.use("/new-update", newUpdateRouter);
app.use("/service", serviceRouter);
app.use("/rating", ratingRouter);
app.use("/branch", branchRouter);

// Predefined admin credentials
const admin = {
  username: 'selectmaid@admin',
  password: 'selectmaid@123'
};

app.get("/",(req,res) =>{
  res.send("hello duniya")
})

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === admin.username && password === admin.password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Handle OPTIONS requests (preflight requests)
app.options('*', cors(corsOptions)); // Enable preflight across all routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
