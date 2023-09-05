import { io } from "socket.io-client";
const url = "http://localhost:4005"
// 
export const socket = io(url, {
    autoConnect: false
})