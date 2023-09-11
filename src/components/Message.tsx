interface MessageProps {
    message: string;
    username: string;
    sender: string;
}

export default function Message({ message, username, sender }: MessageProps) {
    return <p className={`${sender === username ? "bg-slate-100 ml-2 rounded-lg rounded-tl-none text-slate-800" : "bg-blue-500 ml-auto text-white self-end mr-2 rounded-lg rounded-tr-none"} h-10 pl-2 flex items-center text-lg flex-shrink-0  w-fit p-3`}>
        {message}
    </p>
}