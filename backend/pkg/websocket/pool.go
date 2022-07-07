package websocket

import (
	"fmt"
	"strconv"
)

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	idAssign := 1
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			(*client).ID = strconv.Itoa(idAssign)
			idAssign++
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				fmt.Println(client)
				client.Conn.WriteJSON(Message{Type: 1, Body: "CONNECTION:CONNECT:" + strconv.Itoa(idAssign-1)})
			}
			break

		case client := <-pool.Unregister:
			clientId := client.ID
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "CONNECTION:DISCONNECT:" + clientId})
			}
			break

		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")
			for client, _ := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}

}
