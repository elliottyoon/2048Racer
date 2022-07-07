package websocket

import (
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

func handleMessage(body string, c *Client) string {
	switch body {
	case "POST:StartTime":
		// this is the equivalent to Date.getTime() in Javascript, which we will use
		currTime := time.Now().UTC().UnixNano() / 1e6
		fmt.Printf("Current time: %v\n", currTime)
		return "EVENT:StartTime:" + strconv.FormatInt(currTime, 10)
	case "EVENT:UserWon:":
		return "EVENT:PlayerWin:" + c.ID

		// API requests
	case "GET:GameState":
		return ""
	case "GET:WinningTile":
		return "2048"
	case "GET:TileOdds": // %2, %4
		return "90,10"
	case "CONNECT:ConnectToUI":
		return "" // this shouldn't be in this function
		// abstract out so that handler first looks at header
	}
	return body

}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		message := Message{Type: messageType, Body: handleMessage(string(p), c)}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
