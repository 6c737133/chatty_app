import React, { Component } from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
    render() {
        const notification = this.props.notifications.newUser
        return (
            <main className="messages">
                {notification ? (
                    <div className="message-system">
                        {this.props.notifications.prevUser} changed their name to {this.props.notifications.newUser}
                    </div>
                ) : (
                        <div></div>
                    )}

                {this.props.messages.map((message) =>
                    <Message
                        key         =   {message.id}
                        username    =   {message.username}
                        content     =   {message.content}
                    />
                )}
            </main>
        );
    }
}
export default MessageList;