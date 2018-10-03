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
        { id: 1, userId: 0, message: 'Hello', time: "" },
      ],
      user: null,
      isConnected: false
    }
    this.socket = null;
  }
  //Connetct với server nodejs, thông qua socket.io
  componentWillMount() {
    this.socket = io('http://localhost:6969/');  //https://trong-chat-server.herokuapp.com/
    this.socket.on('id', res => this.setState({ user: res })) // lắng nghe event có tên 'id'
    // this.socket.on('connect', res=> { res.isConnected ? this.setState({isConnected: true}) : this.setState({isConnected: false})})
    this.connectOnetoOne()
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
      message: m.data,
      time: m.time
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

  connectOnetoOne(){
    let {isConnected, user} = this.state
    let socket = this.socket
    if(!isConnected){
      console.log(isConnected)
      socket.emit("connect", {data: user})
    }else{
      console.log("Chua connect!")
    }
  }
  render() {
    return (
      <div className="App">
        <div className="chat_window">
          <div className="top_menu">
            <div className="buttons">
              {/* <div class="button close"></div>
              <div class="button minimize"></div>
              <div class="button maximize"></div> */}
              <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#home">Chat Group</a></li>
                <li><a data-toggle="tab" href="#menu1">Chat với 1 người</a></li>
              </ul>


            </div>
            <div className="title">Chat</div>
          </div>
          <div className="tab-content">
            <div id="home" className="tab-pane fade in active">
              <MessageList className="messages" user={this.state.user} messages={this.state.messages} />
            </div>
            <div id="menu1" className="tab-pane fade">
              <MessageList className="messages" user={this.state.user} messages={this.state.messages} />
            </div>
          </div>
          <div></div>
          <Input sendMessage={this.sendnewMessage.bind(this)} />
        </div>
      </div>
    );
  }
}

export default App;
