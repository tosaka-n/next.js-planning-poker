import express, { Request, Response, Express } from "express";
import { createServer, Server } from "http";
import next, { NextApiRequest } from "next";
import { Server as socketioServer, Socket } from "socket.io";
const dev = process.env.NODE_ENV === "development";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const expressApp: Express = express();
  const server: Server = createServer(expressApp);
  const io: socketioServer = new socketioServer();
  const archiveMessages: { message: string; roomId: number | string }[] = [];
  io.attach(server);

  expressApp.get("/socket", async (_: Request, res: Response) => {
    res.send("hello world");
  });

  io.on("connection", (socket: Socket) => {
    socket.on("join", ({ roomId, userId }) => {
      console.log({ join: { roomId, userId, socket: socket.handshake.address }});
      socket.join(roomId);
      io.to(socket.id).emit("roomInfo", archiveMessages);
    });
    socket.on("message", (data) => {
      io.to(data.roomId).emit("message", data);
      archiveMessages.push(data);
      console.log({ message: {...data} });
    });
    socket.on("clearAll", (data) => {
      archiveMessages.splice(0);
      io.to(data.roomId).emit("roomInfo", archiveMessages);
    });
  });

  expressApp.all("*", (req: NextApiRequest, res: any) => handle(req, res));
  server.listen(port, () => {
    console.log(dev ? `start: http://localhost:${port}` : "");
  });
});
