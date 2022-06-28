import React from 'react';

function ChatHistory(props) {
    const messages = props.chatHistory.map((msg, index) => (
      <p key={index}>{msg}</p>
    ))
    return (
        <div className="ChatHistory">
            {messages}
        </div>
    )
}

export default ChatHistory;