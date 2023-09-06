import { SyntheticEvent, useEffect, useState } from "react";
import { socket } from "../helpers/socket";
import Message from "../components/Message";
import useUsername from "../hooks/useUsername";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
interface MessageI {
  message: string;
  room: string;
  sender: string;
}
export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [username] = useUsername();
  const [rooms, setRooms] = useState<string[]>([]);
  const [room, setRoom] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newRoom, setNewRoom] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    socket.auth = { username };
    socket.connect();
    socket.on("connect", () => {
      console.log("connected to server");
    });

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
    setRoom(room);
  };
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      socket.emit("chat message", { message: text.trim() });
      setText("");
    }
  };
  const createRoom = (e: SyntheticEvent) => {
    e.preventDefault();
    if (newRoom.trim().length > 0) {
      socket.emit("create room", { newRoom });
      setRoom(newRoom);
      setRooms([...rooms, newRoom]);
      setText("");
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
      <div className="w-80">
        {rooms.map((el, i) => (
          <button className="block" onClick={() => {pickRoom(el); navigate(el)}} key={i}>
            {el}
          </button>
        ))}
        <button onClick={open}>+ new room</button>
      </div>
      {/* {room !== "" && (
        <div className="flex-1 w-full">
          <h1 className="text-2xl text-center">{room}</h1>
          <div className="max-w-2xl mx-auto h-[700px] mt-20 flex flex-col">
            <div className="flex-1 flex flex-col justify-end pb-10 border border-gray-200">
              {messages
                .filter((el) => el.room === room)
                .map((el, i) => (
                  <Message message={el.message} index={i} key={i} />
                ))}
            </div>
            <form action="" className="flex" onSubmit={handleSubmit}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="text"
                className="flex-1 border-b border-b-gray-200 border-l-gray-200 border-l outline-none"
              />
              <button type="submit" className="bg-yellow-200 p-5">
                Send
              </button>
            </form>
          </div>
        </div>
      )} */}
      <div className="flex-1 hidden md:block">
        <Outlet context={{messages}} />
      </div>
      
    </div>
  );
}
