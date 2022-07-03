var socket = new WebSocket("wss://157.230.64.52:8080/ws")

let connect = cb => {
    console.log("Attempting Connection...");
  
    socket.onopen = () => {
      console.log("Successfully Connected");
    };
  
    socket.onmessage = msg => {
      console.log(msg);
      cb(msg);
    };
  
    socket.onclose = event => {
      console.log("Socket Closed Connection: ", event);
    };
  
    socket.onerror = error => {
      console.log("Socket Error: ", error);
    };
};
  
let sendMsg = msg => {
    console.log("sending msg: ", msg);
    socket.send(msg);
};

let startServerTime = () => {
  socket.send("Start Time");
}

let getSocket = () => {
  return socket;
}

export { connect, sendMsg, startServerTime, getSocket };