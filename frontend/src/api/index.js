var socket = new WebSocket("wss://2048now.com/ws")

let connect = (updateMB, cb) => {
    console.log("Attempting Connection...");
  
    socket.onopen = () => {
      console.log("Successfully Connected");
    };
  
    socket.onmessage = msg => {
      // console.log(msg);
      cb(msg);
    };
  
    socket.onclose = event => {
      console.log("Socket Closed Connection: ", event);
      updateMB("You have been disconnected.");
    };
  
    socket.onerror = error => {
      console.log("Socket Error: ", error);
    };
};
  
let sendMsg = msg => {
    console.log("sending msg: ", msg);
    socket.send(msg);
};

let ping = () => {
  // prevent Websocket timeouts
  socket.send("ping");
}

let startServerTime = () => {
  socket.send("Start Time");
}

let getSocket = () => {
  return socket;
}

export { connect, sendMsg, startServerTime, getSocket, ping };