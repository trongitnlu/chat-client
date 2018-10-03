import React from 'react';
import MessageItem from './message-item';

//import './message-list.scss'


export default class MessageList extends React.Component {
    render() {
        return (
            <ul className="messages">
                {this.props.messages.map(item =>
                    <MessageItem user={item.userId === this.props.user ? true : false} message={item.message} time={item.time} />
                )}
            </ul>
        )
    }
}