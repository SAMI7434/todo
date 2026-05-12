import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
	if (!socket) {
		socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:1337", {
			path: "/socket.io",
			withCredentials: true,
		});
	}

	return socket;
}

export function closeSocket() {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}
