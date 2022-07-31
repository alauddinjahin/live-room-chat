// ================================= Users ============================

// // User leaves chat
// function userLeave(id) {
//   const index = users.findIndex(user => user.id === id);

//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }


let onlineUsers=[];

// Join user to chat
const addNewUser = (payload, socketId) => {
    // const {id, name, room } = payload;
    const user = {...payload, socketId};
    !onlineUsers.some( user => user?.socketId === socketId) && onlineUsers.push(user);
    return user;
};

// Get current user
const getUser = (socketId) => onlineUsers.find(user => user.socketId === socketId);


// User leaves chat
const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter( user => user.socketId !== socketId);
};

function userLeave(socketId) {
    const index = onlineUsers.findIndex(user => user.socketId === socketId);
  
    if (index !== -1) {
      return onlineUsers.splice(index, 1)[0];
    }
}


// Get room users
function getRoomUsers(room) {
    return onlineUsers.filter(user => user.room === room);
}
  
export {
    addNewUser,
    getUser,
    removeUser,
    userLeave,
    getRoomUsers
};

