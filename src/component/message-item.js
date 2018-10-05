import React from 'react';


export default class MessageItem extends React.Component {

    constructor(props) {
        super(props)
        this.FormSection = {
            backgroundColor: this.props.user ? "#c7eafc" : this.props.color,
        }
        console.log(this.props.color)
    }

    render() {
        const { message, guest, time, user, color } = this.props
        return (
            <li className={user ? 'message right appeared' : 'message left appeared'}>
                <style type="text/css">
                    {`.messages .message.left .S${guest}::after, .messages .message.left .S${guest}::before {  right: 100%;  border-right-color: ${color};}`}
                </style>
                <div className="avatar" align="center">{user ? 'Bạn' : 'Người lạ'}</div>
                <div className={`text_wrapper S${guest}`} style={this.FormSection}>
                    <div className="text">{message}</div>
                </div>
                <div className={user ? 'time-right' : 'time-left'}>{time}</div>
            </li>
        )
    }
}
