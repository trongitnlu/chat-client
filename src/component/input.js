import React from 'react'
import $ from 'jquery'
import _map from 'lodash/map'
import io from 'socket.io-client'
export default class Input extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="bottom_wrapper clearfix" >
                <div className="message_input_wrapper">
                    <div data-emojiarea data-type="unicode" data-global-picker="false">
                        <div className="emoji-button" >&#x1f604;</div>
                        <input ref="messageInput" type="text" className="message_input" placeholder="Type your message here" onKeyUp={this.checkEnter.bind(this)} />
                    </div>
                </div>
                <div className="send_message" onClick={() => this.props.sendMessage(this.refs.messageInput, this.props.isOneToOne)} ref="inputMessage" >
                    <div className='text'>Send</div>
                </div>
            </div>
        )
    }
    checkEnter(e) {
        if (e.keyCode === 13) {
            this.props.sendMessage(this.refs.messageInput, this.props.isOneToOne);
        }
    }


} 