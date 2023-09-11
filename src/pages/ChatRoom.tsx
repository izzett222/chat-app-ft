import { useOutletContext, useParams } from "react-router-dom";
import { MessageI } from "../types";
import { SyntheticEvent, useRef, useState } from "react";
import { socket } from "../helpers/socket";
import Message from "../components/Message";
import useUsername from "../hooks/useUsername";

export default function ChatRoom() {
  const [text, setText] = useState("");
  const messageContainer = useRef<HTMLDivElement>(null);
  const { room } = useParams();
  const [username] = useUsername();

  const { messages, openRooms } = useOutletContext<{
    messages: MessageI[];
    openRooms: React.Dispatch<React.SetStateAction<boolean>>;
  }>();
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      socket.emit("chat message", { message: text.trim() });
      setText("");
      messageContainer.current?.scrollTo({
        top: messageContainer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  messages.reverse()

  return (
    <div className="flex-1 w-full">
      <div className="mx-auto h-screen flex flex-col overflow-hidden">
        <div className="h-16 flex items-center px-5">
          <button className="md:hidden" onClick={() => openRooms(false)}>
            back
          </button>
          <h1 className="text-2xl text-center">{room} room</h1>
        </div>

        <div ref={messageContainer} className="flex-1 scroll-smooth relative overflow-scroll flex flex-col-reverse flex-col- pb-10 border gap-y-1 border-gray-200">
          {messages
            .filter((el) => el.room === room)
            .map((el, i) => (
              <Message
                username={username}
                sender={el.sender}
                message={el.message}
                key={i}
              />
            ))}
        </div>

        <form action="" className="flex" onSubmit={handleSubmit}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            className="pl-5 flex-1 border-b border-b-gray-200 border-l-gray-200 border-l outline-none"
          />
          <button type="submit" className="bg-yellow-200 p-5">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
