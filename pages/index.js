import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, socketDisconnected } from '../redux/actions/notifications';
import styles from '../styles/Home.module.css'


export default function Home() {

  const feedbackRef = useRef(null);
  const chatMessageBox = useRef(null);
  const inputRef = useRef(null);

  const notifications = useSelector(state => state.Notifications);
  const {socket, user} = notifications;
  const [ message, setMessage] = useState('');
  const [ roomName, setRoomName] = useState('');
  const [ roomUsers, setRoomUsers] = useState([]);
  const [ receiverId, setReceiverId] = useState(null);
  const [ greetingMessage, setGreetingMessage] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();


  const submitToSend = ()=>{
    //  socket 
    if(!message || user?.id == receiverId ) return false;

    socket?.off('sendMessage')
    .emit("sendMessage", {senderId: user.id, receiverId: receiverId, text: message });

    // socket?.on("getMessage",  (payload) => {
    //   chatMessageBox.current.insertAdjacentHTML('beforeend',outputMessage(payload)); 
    //   inputRef.current.focus();
    // });

    setMessage('')
  }


  const handleToSetMessage = (e)=> {
    setMessage(e.target.value)

    socket?.emit("typing", user.name);

    // socket?.emit("typing", {name: user.name, receiverId: receiverId});

    socket?.on("typing", (name ) => {
      feedbackRef.current.innerHTML = `<p><em>${name}</em> is typing...</p>`;
      setTimeout(() => {
        feedbackRef.current.innerHTML = "";
      }, 2000);
    });

  }

  useEffect(()=> {

    // Get room and users
    socket?.on('roomUsers', ({ room, users }) => {
      setRoomName(room);
      setRoomUsers(users);
    });
    
    // greeting message 
    socket?.on("getMessage", (msg) => {
      chatMessageBox?.current?.insertAdjacentHTML('beforeend',outputMessage(msg)); 
      inputRef?.current?.focus();
      if(chatMessageBox?.current){
        chatMessageBox.current.scrollTop = chatMessageBox.current.scrollHeight;
      }
    });

     // Scroll down


  },[socket])


  function outputMessage(message) {
    return(`<div class='message'>
      <p class='meta'>${message.name} <span>${message.time}</span></p>
      <p class='text'>${message.text}</p>
    </div>`);
  }

  const leaveRoom = ()=>{

    
    // socket?.disconnect();
    
    // // leave message
    // socket?.on("leaveMessage",  (payload) => {
    //   console.log("das", payload);
    //   // chatMessageBox?.current?.insertAdjacentHTML('beforeend',outputMessage(payload)); 
    //   // inputRef?.current.focus();
    // });
    
    dispatch(socketDisconnected());
    dispatch(loginUser(null));

    router.push('/login')

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next Chat App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css"
          integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk="
          crossorigin="anonymous"
        />
      </Head>

      <div className="chat-container">
        <header className="chat-header">
          <h1><i className="fas fa-smile"></i> ChatCord</h1>
          <h3 ref={feedbackRef}></h3>
          <a id="leave-btn" className="btn" onClick={leaveRoom}>Leave Room</a>
        </header>

        <main className="chat-main">
          <div className="chat-sidebar">
            <h3><i className="fas fa-comments"></i> Room Name:</h3>
            <h2 id="room-name">{roomName}</h2>
            <h3><i className="fas fa-users"></i> Users</h3>
            <ul id="users">
              { roomUsers && roomUsers.map(user => (
                <li key={user.socketId}>{user.name}</li>
              ))}
            </ul>
          </div>
          
          <div className="chat-messages" ref={chatMessageBox}></div>
          
        </main>

        <main className={styles.main}>

          <div className='input-box'> 
            <input 
            type={'text'}
            name="messge"
            value={message}
            onChange={handleToSetMessage}
            ref={inputRef}
            />

            <button onClick={submitToSend}>Send</button>
        </div>
        </main>
      
      </div>
        
    </div>
  )
}
