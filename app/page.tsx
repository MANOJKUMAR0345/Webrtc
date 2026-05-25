"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";

import "@livekit/components-styles";

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchToken() {
      try {
        console.log("Fetching token...");

        const response = await fetch("http://localhost:3001/token");

        console.log("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.status}`);
        }

        const data = await response.json();

        console.log("Token Response:", data);

        if (!data.token) {
          throw new Error("Token not received from backend");
        }

        console.log("Token Length:", data.token.length);
        console.log(
          "Token Preview:",
          data.token.substring(0, 30) + "..."
        );

        setToken(data.token);
      } catch (err: any) {
        console.error("Token Fetch Error:", err);
        setError(err.message || "Unknown error");
      }
    }

    fetchToken();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Token Error</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ padding: "20px" }}>
        Loading LiveKit Token...
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://webrtc-v1yc3kto.livekit.cloud"
      connect={true}
      video={true}
      audio={true}
      data-lk-theme="default"
      style={{ height: "100vh" }}
      onConnected={() => {
        console.log("✅ Connected to LiveKit");
      }}
      onDisconnected={() => {
        console.log("❌ Disconnected from LiveKit");
      }}
      onError={(err) => {
        console.error("🚨 LiveKit Error:", err);
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}