import { useOutletContext, useParams } from "react-router-dom";
import { MessageI } from "../types";
import { SyntheticEvent, useState } from "react";
import { socket } from "../helpers/socket";
import Message from "../components/Message";

export default function ChatRoom() {
  const [text, setText] = useState("");
  const { room } = useParams();

  const { messages } = useOutletContext<{ messages: MessageI[]}>()
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      socket.emit("chat message", { message: text.trim() });
      setText("");
    }
  };
  return (<div className="flex-1 w-full">
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
</div>)
}