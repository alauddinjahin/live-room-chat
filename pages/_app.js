import '../styles/globals.css'
import '../styles/Chat.css'
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import Layout from '../app/components/Layout';
import { wrapper } from "../redux/store";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loginUser, socketConnection, socketDisconnected } from '../redux/actions/notifications';
import { io } from "socket.io-client";
import QueryString from 'qs';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const { name, room } = router.query;
  const [connection, setConnection] = useState(null);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();


  useEffect(()=> {

    dispatch(socketDisconnected());

    // connect to socket server
    const socket = io("http://localhost:5000");
    setConnection(socket);
    dispatch(socketConnection(socket));

    if( !name || !room) return;

    console.log("asdasdasdasd");

    const userObj = {
      id: new Date().getSeconds(),
      name,
      room
    };

    setUser(userObj);

  },[room])


  useEffect(()=> {

    if(!user) return;

    dispatch(loginUser(user));
    connection?.emit("joinRoom", user);
    

  },[connection, user])



  const queryClient = new QueryClient();

  // Component.name

  const comp = Component.getLayout ?  Component.getLayout(<Component {...pageProps} />) : <Layout><Component {...pageProps} /></Layout>;

  return (
    <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          {comp}
        </Hydrate>
    </QueryClientProvider>
  )
}

// export default MyApp

export default wrapper.withRedux(MyApp);

