import React from 'react';

//import './item.scss';

export default class MessageItem extends React.Component {


    render() {
        return (
            <li className={this.props.user ? 'message right appeared' : 'message left appeared'}>
                <div className="avatar"></div>
                <div className="text_wrapper">
                    <div className="text">{this.props.message}</div>
                </div>
                {/* <div className="time">10:56 am</div> */}
            </li>
        )
    }
}