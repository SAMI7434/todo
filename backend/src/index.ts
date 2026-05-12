import type { Core } from "@strapi/strapi";
import { Server } from "socket.io";

type ChatUser = {
  name?: string;
  email?: string;
};

type RoomMember = {
  id: string;
  name: string;
  email?: string;
};

type JoinPayload = {
  room: string;
  user?: ChatUser;
};

type MessagePayload = {
  room: string;
  text: string;
  user?: ChatUser;
};

const getRoomCount = (io: Server, room: string) =>
  io.sockets.adapter.rooms.get(room)?.size ?? 0;

const buildRoomMembers = async (io: Server, room: string): Promise<RoomMember[]> => {
  const sockets = await io.in(room).fetchSockets();
  return sockets.map((socket) => ({
    id: socket.id,
    name: socket.data.user?.name ?? "Guest",
    email: socket.data.user?.email,
  }));
};
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const httpServer = strapi.server.httpServer;

    if (!httpServer) {
      strapi.log.warn("Socket.IO not started: HTTP server unavailable.");
      return;
    }

    const io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      path: "/socket.io",
    });

    const emitRoomMembers = async (room: string) => {
      const members = await buildRoomMembers(io, room);
      io.to(room).emit("room:members", {
        room,
        count: members.length,
        members,
      });

      strapi.log.info(`Room members updated: ${room} (${members.length})`);
    };

    io.on("connection", (socket) => {
      strapi.log.info(`Socket connected: ${socket.id}`);

      socket.on("room:join", async ({ room, user }: JoinPayload) => {
        if (!room) {
          return;
        }

        socket.join(room);
        socket.data.room = room;
        socket.data.user = user;

        strapi.log.info(`Socket joined room: ${room} (${socket.id})`);

        await emitRoomMembers(room);

        socket.to(room).emit("message:system", {
          room,
          text: `${user?.name ?? "Someone"} joined the room.`,
          ts: new Date().toISOString(),
        });
      });

      socket.on("message:send", ({ room, text, user }: MessagePayload) => {
        if (!room || !text?.trim()) {
          return;
        }

        io.to(room).emit("message:new", {
          id: `${socket.id}-${Date.now()}`,
          room,
          text: text.trim(),
          user,
          ts: new Date().toISOString(),
        });
      });

      socket.on("room:leave", async ({ room, user }: JoinPayload) => {
        const activeRoom = room || socket.data.room;
        if (!activeRoom) {
          return;
        }

        socket.leave(activeRoom);

        await emitRoomMembers(activeRoom);

        socket.to(activeRoom).emit("message:system", {
          room: activeRoom,
          text: `${user?.name ?? "Someone"} left the room.`,
          ts: new Date().toISOString(),
        });
      });

      socket.on("disconnect", async () => {
        const activeRoom = socket.data.room as string | undefined;
        if (!activeRoom) {
          return;
        }

        strapi.log.info(`Socket disconnected: ${socket.id} (room: ${activeRoom})`);

        await emitRoomMembers(activeRoom);
      });
    });

    strapi.log.info("Socket.IO server started.");
  },
};
