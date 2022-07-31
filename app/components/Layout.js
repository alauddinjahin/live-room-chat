
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Layout = ({ children, hideFooter = false }) => {

  // const notificationData = useSelector(state => state.Notifications);
  // const {socket} = notificationData;

  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //     socket?.on("getMessage", (data) => {
  //       setMessages((prev) => [...prev, data]);
  //     });
  // }, [socket]);


  return (
      <div>
          {/* <div>
          { JSON.stringify(messages)}
          </div> */}
          { children }
      </div>
  );
}

export default Layout;
