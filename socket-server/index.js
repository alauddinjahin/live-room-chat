import { Server } from "socket.io";
import formatMessage from "./utility/message.js";
import { addNewUser, getUser, getRoomUsers, removeUser, userLeave } from "./utility/users.js";

const io = new Server({ 
    cors: {
        origin:"*"
    },
    transports: ["websocket","polling"]
});


io.on("connection", (socket) => {
    
    console.log("connected");

    // new Online User 
    // socket.on("onlineUser", payload => addNewUser(payload, socket.id));  
    
    socket.on("joinRoom", (payload) => {

        const user = addNewUser(payload, socket.id);

        // join user the room 
        socket.join(user?.room);

        // Welcome current user 
        socket.emit("getMessage", formatMessage(user.name, "Welcome to ChatCord!"));

        // notify all user in the rooom except sender
        // socket.to(user.room).broadcast.emit('userConnected', user.name);

        // Broadcast when a user connects in the room
        socket.broadcast.to(user.room).emit(
            "getMessage",
            formatMessage(user.name, `${user.name} has joined the chat`)
        );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });   

    });



    // listen sendMessage event from client
    socket.on("sendMessage", ({ senderId, text, receiverId=null }) => {
        const receiver = getUser(socket.id);
        
        // console.log(getRoomUsers(receiver?.room));

        if(!receiverId){
            // send room message 
            // console.log(formatMessage(receiver.name, text));
            io.to(receiver?.room).emit("getMessage", {
                senderId,
                ...formatMessage(receiver.name, text)
            });
        }else{
            // send private getMessage event to client
            io.to(receiver?.socketId).emit("getMessage", {
                senderId,
                receiverId,
                text
            });
        }

    });    
    


    socket.on("typing", ( name ) => {
        // send event to All clients in the room 
        const user = getUser(socket.id);
        // console.log(user, 'user tyoe', socket.id);
        socket.broadcast.to(user?.room).emit("typing", name );  
    });


        
    // socket.on('joinRoom', (roomId, userId) => {
    //     // join user the room 
    //     socket.join(roomId)
        
        // // notify all user in the rooom except sender
        // socket.to(roomId).broadcast.emit('userConnected', userId);

    //     // messages
    //     socket.on('messageToroom', (message) => {
    //         //send message to the same room
    //         io.to(roomId).emit('createRoomeMessage', message)
    //     }); 
    
    //     socket.on('disconnect', () => {
    //         socket.to(roomId).broadcast.emit('userDisconnected', userId)
    //     })
    // })

    // listen sendNotification event from client
    // socket.on("sendNotification", ({ senderId, receiverId, type }) => {
    //     const receiver = getUser(receiverId);
    //      // send getNotification event to client
    //     io.to(receiver?.socketId).emit("getNotification", {
    //         senderId,
    //         receiverId,
    //         type,
    //     });
    // });   


    
    // socket.on("typing", (name) => {
    //     socket.broadcast.emit("typing", name);
    //   });

    // socket.on("typing", ({ name, receiverId=null }) => {
    //     // send event to All clients
    //     socket.broadcast.emit("typing", { name });  
        
    //     // send event to single client
    //     // const receiver = getUser(receiverId);
    //     // io.to(receiver?.socketId).emit("typing", { name });
    // });




    // disconnect single user 
    // io.on("disconnect", _=> removeUser(socket.id))




    // Runs when client disconnects from the room 

    // socket.on("disconnecting", () => {
    //     const user = userLeave(socket.id);
    //     console.log(user,'disconnecting', socket.id);

    //     if (user) {
    //         io.to(user.room).emit(
    //             "leaveMessage",
    //             formatMessage(user.name, `${user.name} has left the chat`)
    //         );

    //         // Send users and room info
    //         io.to(user.room).emit("roomUsers", {
    //             room: user.room,
    //             users: getRoomUsers(user.room),
    //         });
    //     }
    // });

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        // console.log(user,'disc');

        if (user) {
            io.to(user.room).emit(
                "getMessage",
                formatMessage(user.name, `${user.name} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });



});


io.listen(5000)