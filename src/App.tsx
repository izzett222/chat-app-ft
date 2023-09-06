import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Chat from './pages/Chat';
import UsernameProvider from "./components/UsernameProvider";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />}>
          <Route path=":room" element={<ChatRoom />} />
        </Route> 
    </>
    
  ));
  return <UsernameProvider><RouterProvider router={router} /></UsernameProvider> ;
}

export default App;
