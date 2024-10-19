import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

// Extending Next.js response object to include `socket` with the server
type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

let io: IOServer | undefined;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*", // Adjust to your origin in production
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on("connection", (socket: Socket) => {
      console.log("New client connected");

      // Handle chat event
      socket.on("chat", (msg: string) => {
        io?.emit("chat", msg);
      });

      // Handle notification event
      socket.on("notification", (data: string) => {
        io?.emit("notification", data);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    // Store the instance of Socket.IO server
    res.socket.server.io = io;
  }

  res.end();
}
