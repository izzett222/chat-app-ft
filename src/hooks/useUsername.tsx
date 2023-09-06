import { useContext } from "react";
import usernameContext from "../contexts/username";

export default function useUsername() {
  const items = useContext(usernameContext);
  if (!items) {
    throw new Error("you probably forgot to put <UsernameProvider>")
  }
  return items
}