interface MessageProps {
    index: number;
    message: string;
}

export default function Message({ index, message }: MessageProps) {
    return <p className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"} h-10 pl-2 flex items-center`}>
        {message}
    </p>
}