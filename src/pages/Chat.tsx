import { SyntheticEvent, useEffect, useState } from "react";
import { socket } from "../helpers/socket";
import useUsername from "../hooks/useUsername";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
interface MessageI {
  message: string;
  room: string;
  sender: string;
}
export default function Chat() {
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [username] = useUsername();
  const [rooms, setRooms] = useState<string[]>([]);
  const [hideRooms, setHideRooms] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newRoom, setNewRoom] = useState<string>("");
  useEffect(() => {
    socket.auth = { username };
    socket.connect();
    socket.on("connect", () => {
      console.log("connected to server");
      
    });
    socket.on("messages", (data:MessageI[]) => {
      console.log(data, '====================');
      setMessages(data)
  })

    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    socket.on("chat message", (data: MessageI) => {
      setMessages([...messages, data]);
    });
    return () => {
      socket.off("chat message");
    };
  }, [messages]);

  useEffect(() => {
    socket.on("rooms", (data: string[]) => {
      setRooms(data);
    });
    socket.on("new room", (data: string) => {
      setRooms([...rooms, data]);
    });
    return () => {
      socket.off("rooms");
      socket.off("new room");
    };
  }, [rooms]);

  const pickRoom = (room: string) => {
    socket.emit("join room", { room });

  };
  const createRoom = (e: SyntheticEvent) => {
    e.preventDefault();
    if (newRoom.trim().length > 0) {
      socket.emit("create room", { newRoom });
      setRooms([...rooms, newRoom]);
      setNewRoom("");
    }
  };

  const close = () => {
    setShowDialog(false);
  };
  const open = () => {
    setShowDialog(true);
  };
  if (username === "") {
    return <Navigate to={"/"} />;
  }
  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅"];
  return (
    <div className="flex">
      <Dialog isOpen={showDialog} onDismiss={close}>
        <form action="" className="flex" onSubmit={createRoom}>
          <input
            value={newRoom}
            onChange={(e) => {
              setNewRoom(e.target.value);
            }}
            type="text"
            className="flex-1 border-b border-b-gray-200 border-l-gray-200 border-l outline-none"
          />
          <button type="submit" className="bg-yellow-200 p-5">
            create room
          </button>
        </form>
      </Dialog>
      <div
        className={`min-w-[224px] ${
          hideRooms ? "hidden" : "block"
        } md:block pt-10 px-3 border-r-gray-200 border-r`}
      >
        <h2 className="ml-2 mb-1 font-medium text-slate-700">Rooms</h2>
        <div className="flex flex-col gap-1">
          {rooms.map((el, i) => (
            <div key={i}>
              <NavLink
                to={`${el}`}
                onClick={() => {
                  pickRoom(el);
                }}
                className={({ isActive }) => `hidden rounded-sm md:flex gap-1 p-2 ${isActive ? "bg-slate-50" : ""}`}
                
              >
                <span className="aspect-square rounded-sm w-12 flex justify-center items-center text-4xl bg-slate-200">
                  {emojis[i % emojis.length]}
                </span>{" "}
                <span className="text-xl text-gray-700">{el}</span>
              </NavLink>
              <NavLink
                to={`${el}`}
                className={({ isActive }) => `flex gap-1 p-2 md:hidden ${isActive ? "bg-slate-50" : ""}`}
                onClick={() => {
                  setHideRooms(true);
                  pickRoom(el);
                }}
              
              >
                <span className="aspect-square rounded-sm w-12 flex justify-center items-center text-4xl bg-slate-200">
                  {emojis[i % emojis.length]}
                </span>{" "}
                <span className="text-xl text-gray-700">{el}</span>
              </NavLink>
            </div>
          ))}
        </div>

        <button className="w-full bg-yellow-200 text-gray-700 py-2 rounded-md mt-2 text-lg" onClick={open}>New room</button>
      </div>
      <div className={`flex-1 ${hideRooms ? "block" : "hidden"} md:block`}>
        <Outlet context={{ messages, openRooms: setHideRooms }} />
      </div>
    </div>
  );
}
