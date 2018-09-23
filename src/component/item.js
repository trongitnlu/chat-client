import React from 'react';

export default class Item extends React.Component {
    render () {
        return (
            <ul className="messages clo-md-5">
                {this.props.messages.map(item =>
                    <Item key={item.id} user={item.userId == this.props.user? true : false} message={item.message}/>
                )}   
            </ul>
        )
    }
}
