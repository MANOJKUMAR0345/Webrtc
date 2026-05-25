const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const { AccessToken } = require("livekit-server-sdk");

const app = express();

app.use(cors());

// Debug
console.log("LIVEKIT_API_KEY:", process.env.LIVEKIT_API_KEY);
console.log(
  "LIVEKIT_API_SECRET:",
  process.env.LIVEKIT_API_SECRET ? "Loaded ✅" : "Missing ❌"
);

app.get("/token", async (req, res) => {
  try {
    if (
      !process.env.LIVEKIT_API_KEY ||
      !process.env.LIVEKIT_API_SECRET
    ) {
      return res.status(500).json({
        error:
          "LIVEKIT_API_KEY or LIVEKIT_API_SECRET not found in .env",
      });
    }

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: `user-${Date.now()}`,
      }
    );

    at.addGrant({
      roomJoin: true,
      room: "test-room",
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    res.json({
      token,
    });
  } catch (error) {
    console.error("Token generation error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});