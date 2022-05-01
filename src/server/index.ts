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
  const archiveMessages: {message: string, roomId: number | string }[] = [];
  io.attach(server);

  expressApp.get("/socket", async (_: Request, res: Response) => {
    res.send("hello world");
  });

  io.on("connection", (socket: Socket) => {
    socket.on("join", (roomId) => {
      socket.join(roomId);
    });
    socket.on("message", (data) => {
      console.log(data)
      io.to(data.roomId).emit("message", {
        message: data.message
      });
      archiveMessages.push(data)
    });
  });

  expressApp.all("*", (req: NextApiRequest, res: any) => handle(req, res));
  server.listen(port, () => {
    console.log(`start: http://localhost:${port}`)
  });
});
