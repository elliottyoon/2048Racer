package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader {
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	// change this later
	CheckOrigin: func(r *http.Request) bool {return true},
}

// listen for new messages begin sent to our WebSocket endpoint
func reader(conn *websocket.Conn) {
	for {
		// read message
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		fmt.Println(string(p))
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}
}

// define WebSocket endpoint
func serveWs(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)

	// upgrade connection to WS connection
	ws, err := upgrader.Upgrade(w, r, nil) 
	if err != nil {
		log.Println(err)
	}

	// listen indefinitely for new messages coming in via connection
	reader(ws)
}

func setupRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Simple Server")
	})
	mux.HandleFunc("/ws", serveWs)
}

func main() {
	mux := http.NewServeMux()
	setupRoutes(mux)
	
	log.Fatal(http.ListenAndServe(":8080", mux))
}