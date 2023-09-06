import { createContext } from "react";

const usernameContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>] | null>(null);

export default usernameContext;