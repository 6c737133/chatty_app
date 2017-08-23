import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: { name: "Bob" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          id:       Math.random(),
          username: "Bob",
          content:  "Has anyone seen my marbles?",
        },
        {
          id:       Math.random(),
          username: "Anonymous",
          content:  "No, I think you lost them. You lost your marbles Bob. You lost them for good."
        }
      ]
    }
  }
  
  sendingMessage(event) {
    console.log(event.target)
    if (event.target.key === 'Enter') {
      const name        = this.state.currentUser.name
      const message     = event.target.value
      const newMessage  = {
        id:       Math.random(),
        username: name,
        content:  message
      }
      this.setState( {messages: this.state.messages.concat(newMessage)} )
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>        
        <MessageList 
          messages={this.state.messages} 
        />
        <ChatBar 
          currentUser={this.state.currentUser} 
          sendMessage={this.sendingMessage.bind(this)} 
        />
      </div>
    )
  }
}

export default App;


