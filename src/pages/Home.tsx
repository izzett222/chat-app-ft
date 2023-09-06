import { useState } from "react"
import useUsername from "../hooks/useUsername"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [username, setUsername] = useState<string>("")
  const navigate = useNavigate()
  const [text, setText] = useUsername()
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value)
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (username.trim().length > 0) {
      setText(username)
      setUsername("")
      navigate("/chat")
    }
  }
  console.log(text, "=======")
  return <div>
    <form className="max-w-md mx-auto mt-40 flex flex-col gap-3" onSubmit={handleSubmit} >
      <input type="text" id="first_name" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Your username" required />
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
  </div>
}