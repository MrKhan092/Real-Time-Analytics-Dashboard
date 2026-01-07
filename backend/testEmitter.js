// backend/src/testEmitter.js
import { io } from "socket.io-client";

const s = io("http://localhost:3001/website", { transports: ["websocket"] });

s.on("connect", () => {
  console.log("emitter connected", s.id);
  setInterval(() => {
    const ev = {
      timestamp: new Date().toISOString(),
      userId: "auto_" + Math.floor(Math.random()*1000),
      route: ["/home","/product","/cart","/checkout"][Math.floor(Math.random()*4)],
      action: ["click","view","impression","submit","error"][Math.floor(Math.random()*5)],
      metadata: { sample: true }
    };
    s.emit("user_event", ev);
    console.log("sent", ev.action, ev.route);
  }, 600);
});
