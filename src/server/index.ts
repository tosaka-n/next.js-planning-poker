import express, { Request, Response, Express } from "express";
import { createServer, Server } from "http";
import next, { NextApiRequest } from "next";
import { Server as socketioServer, Socket } from "socket.io";
const dev = process.env.NODE_ENV === "development";
const port = parseInt(process.env.PORT || "5000", 10);
const app = next({ dev });
const handle = app.getRequestHandler();
export type RoomDetails = {
  log: {
    message: string;
    userId: string;
  }[];
  roomInfo: {
    created: string;
    createdAt: Date;
    member: {
      userId: string;
      vote: string | null;
      join: Date;
    }[];
  };
};
app.prepare().then(async () => {
  const expressApp: Express = express();
  const server: Server = createServer(expressApp);
  const io: socketioServer = new socketioServer();
  const roomDetails: { [roomId: string]: RoomDetails } = {};
  io.attach(server);

  expressApp.get("/socket", async (_: Request, res: Response) => {
    res.send("hello world");
  });

  io.on("connection", (socket: Socket) => {
    socket.timeout(1000);
    socket.on("disconnect", (data) => {
      Object.values(roomDetails).forEach((room) => {
        const users = new Set();
        const newRoomInfo = room.roomInfo.member.filter((member) => {
          if (users.has(member.userId) || member.userId === socket.id) {
            return false;
          }
          users.add(member.userId);
          return true;
        });
        room.roomInfo.member = newRoomInfo;
        io.emit("roomInfo", room.roomInfo);
      });
    });
    socket.on("error", (err) => {
      if (err && err.message === "unauthorized event") {
        socket.disconnect();
      }
    });
    socket.on("join", ({ roomId }) => {
      console.log({
        join: { roomId, userId: socket.id, socket: socket.handshake.address },
      });

      socket.join(roomId);
      if (!roomDetails[roomId]) {
        roomDetails[roomId] = {
          log: [],
          roomInfo: {
            created: socket.id,
            createdAt: new Date(),
            member: [
              {
                userId: socket.id,
                vote: null,
                join: new Date(),
              },
            ],
          },
        };
        roomDetails[roomId].log = [{ userId: "Master", message: "welcome" }];
      } else if (
        !roomDetails[roomId].roomInfo.member.some(
          (member) => member.userId === socket.id
        )
      ) {
        roomDetails[roomId].roomInfo.member.push({
          userId: socket.id,
          vote: null,
          join: new Date(),
        });
      }
      console.log(roomDetails[roomId].roomInfo.member);
      if (roomDetails[roomId]) {
        io.emit("roomInfo", roomDetails[roomId]);
      }
    });
    socket.on("logs", ({ roomId }) => {
      if (roomDetails[roomId]) {
        if (
          !roomDetails[roomId].roomInfo.member.some(
            (member) => member.userId === socket.id
          )
        ) {
          roomDetails[roomId].roomInfo.member.push({
            userId: socket.id,
            vote: null,
            join: new Date(),
          });
        }
        io.to(socket.id).emit("roomInfo", roomDetails[roomId]);
      }
    });
    socket.on("vote", (data: { roomId: string; vote: string }) => {
      const targetUser = roomDetails[data.roomId].roomInfo.member.find(
        (v) => v.userId === socket.id
      );
      if (targetUser) {
        targetUser.vote = data.vote;
      }
      socket.to(data.roomId).emit("roomInfo", roomDetails[data.roomId]);
    });
    socket.on("open", ({roomId}) => {
      socket.to(roomId).emit("open");
    });
    socket.on("reset", ({roomId}) => {
      roomDetails[roomId].roomInfo.member = roomDetails[roomId].roomInfo.member.map(member => ({...member, vote: null}))
      socket.to(roomId).emit("roomInfo", roomDetails[roomId]);
    });
  });

  expressApp.all("*", (req: NextApiRequest, res: any) => handle(req, res));
  server.listen(port, () => {
    console.log(dev ? `start: http://localhost:${port}` : "");
  });
});
