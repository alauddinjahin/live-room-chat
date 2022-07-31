import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginComponent() {

  const router   = useRouter();

  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = ()=> {
      if(!username) return;

      setUsername("")
      setRoom("")

      router.push(`/?room=${room}&name=${username}`, undefined, { shallow: true })
  }

  return (
    <div>
         <div className="login">
          <h2>Chat Join </h2>
          
          <input
            type="text"
            placeholder="Room Name"
            onChange={(e) => setRoom(e.target.value)}
          />     

          <input
            type="text"
            placeholder="name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      
    </div>
  )
}
