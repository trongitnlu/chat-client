import React from 'react'
import $ from 'jquery'
import _map from 'lodash/map'
import io from 'socket.io-client'
export default class Input extends React.Component {

    
    render() {
        return (
            <div className="bottom_wrapper clearfix" >
                <div className="message_input_wrapper">
                    <input ref="messageInput" type="text" className="message_input" placeholder="Type your message here" onKeyUp={this.checkEnter.bind(this)} />
                </div>
                <div className="send_message" onClick={() => this.props.sendMessage(this.refs.messageInput)} ref="inputMessage" >
                    <div className='icon'></div>
                    <div className='text'>Send</div>
                </div>
            </div>
        )
    }
    checkEnter(e) {
        console.log(e)
        if (e.keyCode === 13) {
            this.props.sendMessage(this.refs.messageInput);
        }
    }


} 