import { useState } from "react";
import usernameContext from "../contexts/username";

export default function UsernameProvider({children}:React.PropsWithChildren<{}>) {
  const [username, setUsername] = useState<string>("");
  return <usernameContext.Provider value={[username, setUsername]}>
    {children}
    </usernameContext.Provider>
}