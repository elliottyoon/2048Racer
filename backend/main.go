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

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World")
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func main() {
	fmt.Println("2048 Racing App v0.01")

	setupRoutes()
	// GET CERT.PEM AND CERT.KEY
	//log.Fatal(http.ListenAndServeTLS(":8080", "cert.pem", "cert.key", nil))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
