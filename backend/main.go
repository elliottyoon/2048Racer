package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/elliottyoon/2048Racer/pkg/websocket"
)

// define WebSocket endpoint
func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket endpoint hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

func setupRoutes(mux *http.ServeMux) {
	pool := websocket.NewPool()
	go pool.Start()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func main() {
	fmt.Println("2048 Racing App v0.01")

	mux := http.NewServeMux()
	setupRoutes(mux)
	log.Fatal(http.ListenAndServe(":8080", mux))
}
