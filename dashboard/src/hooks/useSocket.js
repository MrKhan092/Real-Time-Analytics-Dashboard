import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let globalSocket = null;
let activeConnections = 0;

export function useSocket(onAggregate, onLiveEvent, onReplay, options = {}) {
  const callbacksRef = useRef({ onAggregate, onLiveEvent, onReplay });
  const optionsRef = useRef(options);
  const isInitialized = useRef(false);

  useEffect(() => {
    callbacksRef.current = { onAggregate, onLiveEvent, onReplay };
    optionsRef.current = options;
  }, [onAggregate, onLiveEvent, onReplay, options]);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (!globalSocket) {
      console.log("🔌 Creating new socket connection...");
      globalSocket = io("http://localhost:3001/dashboard", {
        transports: ["websocket"],
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionAttempts: Infinity,
        timeout: 20000,
      });

      globalSocket.on("connect", () => {
        console.log("✅ Connected to /dashboard:", globalSocket.id);
        if (optionsRef.current?.onConnect) {
          optionsRef.current.onConnect();
        }
      });

      globalSocket.on("disconnect", (reason) => {
        console.warn("❌ Disconnected from /dashboard:", reason);
        if (optionsRef.current?.onDisconnect) {
          optionsRef.current.onDisconnect();
        }
      });

      globalSocket.on("connect_error", (err) => {
        console.error("⚠️ connect_error:", err.message);
        if (optionsRef.current?.onDisconnect) {
          optionsRef.current.onDisconnect();
        }
      });

      globalSocket.connect();
    } else {
      if (globalSocket.connected && optionsRef.current?.onConnect) {
        optionsRef.current.onConnect();
      }
    }

    const socket = globalSocket;
    activeConnections++;
    console.log(`📊 Active connections: ${activeConnections}`);

    const handleAggregate = (a) => callbacksRef.current.onAggregate?.(a);
    const handleLiveEvent = (e) => callbacksRef.current.onLiveEvent?.(e);
    const handleReplay = (events) => callbacksRef.current.onReplay?.(events);
    const handlePing = () => {};

    socket.on("aggregate", handleAggregate);
    socket.on("live_event", handleLiveEvent);
    socket.on("replay", handleReplay);
    socket.on("ping", handlePing);

    return () => {
      activeConnections--;
      console.log(`📊 Active connections: ${activeConnections}`);

      socket.off("aggregate", handleAggregate);
      socket.off("live_event", handleLiveEvent);
      socket.off("replay", handleReplay);
      socket.off("ping", handlePing);

      if (activeConnections === 0 && globalSocket) {
        console.log("🔌 Disconnecting socket (no active connections)");
        globalSocket.disconnect();
        globalSocket.removeAllListeners();
        globalSocket = null;
      }

      isInitialized.current = false;
    };
  }, []);

  return {
    isConnected: globalSocket?.connected || false,
    socket: globalSocket,
  };
}