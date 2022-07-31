import { createReducer } from "@reduxjs/toolkit";
import { CONNECT_SOCKET, DISCONNECT_SOCKET, SOCKET_USER } from "./constants/notificationConstants";

const initialState = {
    connect: false,
    socket: null,
    user: null,
};

export const NotificationsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(CONNECT_SOCKET, (state, {payload}) => {
        state.connect = true;
        state.socket = payload;
    })
    .addCase(SOCKET_USER, (state, { payload }) => {
        state.user = payload;
        // !state.users.some(user => user.id === payload.id) && state.users.push(payload);
    })
    .addCase(DISCONNECT_SOCKET, (state,{ payload=null }) => {
      state.socket = null;
      state.connect = false;

      if(payload){
        // const updateUsers   = state.users.filter((item) => JSON.parse(item)?.id !== payload);
        state.user=payload;
      }
    });
});
