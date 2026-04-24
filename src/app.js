const express = require("express");
const path = require("node:path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const courseRoutes = require("./routes/courseRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const teamRoutes = require("./routes/teamRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const errorHandler = require("./middleware/errorHandler");

function normalizeOrigin(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function parseOriginList(value) {
  return [...new Set(
    String(value || "")
      .split(",")
      .map((origin) => normalizeOrigin(origin))
      .filter(Boolean)
  )];
}

const allowedOrigins = parseOriginList(
  process.env.CORS_ALLOWED_ORIGINS ||
    "http://localhost:3000,http://127.0.0.1:3000,https://london-essex-dashboard-ia9s.vercel.app"
);

const allowedOriginPatterns = [
  /^https:\/\/london-essex-dashboard(?:-[a-z0-9-]+)?\.vercel\.app$/i,
];

function isOriginAllowed(origin) {
  const normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return true;
  }

  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  return allowedOriginPatterns.some((pattern) => pattern.test(normalizedOrigin));
}

const app = express();
const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
  exposedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
  optionsSuccessStatus: 204,
};

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} origin=${req.headers.origin || "n/a"}`
  );

  return next();
});

app.use(cors(corsOptions));

app.use("/api/stripe", stripeRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
