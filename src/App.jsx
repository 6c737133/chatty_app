import React, { Component } from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser:
      {
        name: "Anonymous"
      },
      messages: [],
      userCount: 0,
      notifications:
      {
        prevUser: "",
        newUser: ""
      }
    }
  }

  sendingMessage(e) {
    if (e.keyCode === 13 && e.target.value) {
      const newMessage = {
        type:       "postMessage",
        username:   this.state.currentUser.name,
        content:    e.target.value
      }
      this.state.websocket.send(JSON.stringify(newMessage))
      e.target.value = ''
    }
  }

  changeUser(e) {
    if (e.keyCode === 13) {
      const newUsername = (e.target.value) ? e.target.value : "Anonymous"
      const prevUsername = this.state.currentUser.name
      this.setState({
        currentUser:
        {
          name: newUsername
        }
      })
      const chgObj = {
        type:     "postNotification",
        oldName:  prevUsername,
        newName:  newUsername
      }
      this.state.websocket.send(JSON.stringify(chgObj))
    }
  }

  userNotification(userChg) {
    this.setState(
      {
        notifications:
        {
          prevUser: userChg.oldName,
          newUser:  userChg.newName
        }
      }
    )
  }

  messageNotification(newMsg) {
    this.setState(
      {
        messages: this.state.messages.concat(newMsg)
      }
    )
  }

  countNotification(newCount) {
    this.setState(
      {
        userCount: newCount.numUsers
      }
    )
  }

  componentDidMount() {
    const websocket = new WebSocket("ws://localhost:3001");

    websocket.onopen = (ws) => {
      console.log("Opened Connection");
      this.setState({ websocket });
    };

    websocket.onmessage = (message) => {
      const msgObj = JSON.parse(message.data)
      switch (msgObj.type) {
        case "incomingMessage":
          this.messageNotification(msgObj)
          break;
        case "incomingNotification":
          this.userNotification(msgObj)
          break;
        case "userCount":
          this.countNotification(msgObj)
          break;
        default:
          throw new Error("Unknown event type " + msgObj.type);
      }
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="users">
            {this.state.userCount} User(s) online
          </div>
        </nav>
        <MessageList
          messages      = {this.state.messages}
          notifications = {this.state.notifications}
        />
        <ChatBar
          currentUser = {this.state.currentUser}
          chgUser     = {this.changeUser.bind(this)}
          sendMessage = {this.sendingMessage.bind(this)}
        />
      </div>
    )
  }
}

export default App;