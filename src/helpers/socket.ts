import { io } from "socket.io-client";
const url = process.env.REACT_APP_API_URL || 'http://localhost:4000';
// 
export const socket = io(url, {
    autoConnect: false
})