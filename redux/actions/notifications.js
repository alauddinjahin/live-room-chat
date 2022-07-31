
import { CONNECT_SOCKET, DISCONNECT_SOCKET, SOCKET_USER } from "../constants/notificationConstants";

export function socketConnection(socket) {
    return {
      type: CONNECT_SOCKET,
      payload: socket,
    }
}

export function socketDisconnected() {
    return {
      type: DISCONNECT_SOCKET,
      payload: null,
    }
}
  

export function loginUser(payload){
    return {
        type: SOCKET_USER,
        payload,
    }
}

