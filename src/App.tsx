import { useEffect, useState , SyntheticEvent } from 'react';
import  { socket } from './helpers/socket';
import Message from './components/Message';


interface MessageI {
  message: string;
}
function App() {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<MessageI[]>([]);
  useEffect(() => {
    socket.connect()
    socket.on("connect", () => {
      console.log('connected to server')
    })

    return () => {
      socket.off("connect");
      socket.off("chat message")
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    socket.on("chat message", (data: MessageI) => {
      console.log(messages)
      setMessages([...messages, data])
    })
  }, [messages])


  const handleSubmit = (e:SyntheticEvent) => {
    e.preventDefault()
    if (text.trim().length > 0) {
      socket.emit("chat message", { message: text.trim()})
      setText("")
    }

  }
  return (
    <div>
      <div className='w-1/4 bg-purple-600 h-full'>

      </div>
      <div className="max-w-2xl mx-auto h-[700px] mt-20 flex flex-col">
      <div className="flex-1 flex flex-col justify-end pb-10 border border-gray-200">
        {messages.map((el, i) => <Message message={el.message} index={i} key={i} />)}
      </div>
      <form action="" className="flex" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          className="flex-1 border-b border-b-gray-200 border-l-gray-200 border-l outline-none"
          />
        <button type="submit" className="bg-yellow-200 p-5">Send</button>
      </form>
      </div>
    </div>
    
  );
}

export default App;
