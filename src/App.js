import React, { Component } from 'react';
import './App.css';
import Input from './component/input'
import MessageList from './component/message-list'
import $ from 'jquery'
import _map from 'lodash/map'
import io from 'socket.io-client'

class App extends Component {
  constructor(props) {
    super(props);
    //Khởi tạo state,
    this.state = {
      messages: [
        { id: 1, userId: 0, message: 'Hello' },
      ],
      user: null,
    }
    this.socket = null;
  }
  //Connetct với server nodejs, thông qua socket.io
  componentWillMount() {
    this.socket = io('https://trong-chat-server.herokuapp.com/');
    this.socket.on('id', res => this.setState({ user: res })) // lắng nghe event có tên 'id'
    this.socket.on('newMessage', (response) => { this.newMessage(response) }); //lắng nghe event 'newMessage' và gọi hàm newMessage khi có event
  }
  //Khi có tin nhắn mới, sẽ push tin nhắn vào state mesgages, và nó sẽ được render ra màn hình
  newMessage(m) {
    const messages = this.state.messages;
    let ids = _map(messages, 'id');
    let max = Math.max(...ids);
    messages.push({
      id: max + 1,
      userId: m.id,
      message: m.data
    });

    let objMessage = $('.messages');
    if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight) {
      this.setState({ messages });
      objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 100); //tạo hiệu ứng cuộn khi có tin nhắn mới

    } else {
      this.setState({ messages });
      if (m.id === this.state.user) {
        objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 100);
      }
    }
  }
  //Gửi event socket newMessage với dữ liệu là nội dung tin nhắn
  sendnewMessage(m) {
    if (m.value) {
      this.socket.emit("newMessage", m.value); //gửi event về server
      m.value = "";
    }
  }

  render() {
    return (
      <div className="App">
        <div class="chat_window">
          <div class="top_menu">
            <div class="buttons">
              <div class="button close"></div>
              <div class="button minimize"></div>
              <div class="button maximize"></div>
            </div>
            <div class="title">Chat</div>
          </div>
          <MessageList className="messages" user={this.state.user} messages={this.state.messages} />
          <div></div>
          <Input sendMessage={this.sendnewMessage.bind(this)}/>
          <div>Ngon com</div>
        </div>
      </div>
    );
  }
}

export default App;
