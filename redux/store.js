import {
    applyMiddleware,
    combineReducers,
    configureStore,
    getDefaultMiddleware,
} from "@reduxjs/toolkit";
import thunkMiddleware from 'redux-thunk'
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { NotificationsReducer } from "./notificationReducer";
import logger from "redux-logger";

const combinedReducer = combineReducers({
    Notifications: NotificationsReducer
});

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
        return nextState;
    } else {
        return combinedReducer(state, action);
    }
};

export const makeStore = () =>
    configureStore({
        reducer,
    });


const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension')
        return composeWithDevTools(applyMiddleware(...middleware))
    }

    return applyMiddleware(...middleware)
}


export const wrapper = createWrapper(makeStore, bindMiddleware([thunkMiddleware, logger]));


