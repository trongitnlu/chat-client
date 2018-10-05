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
        { id: 1, userId: 0, message: 'Hello', time: "" }
      ],
      mesgagesRoomOne: [],
      user: null,
      guest: null,
      isConnected: false,
      isSearch: false,
      isAlert: false,
      color: "#ffe6cb",
    }
    this.socket = null;
  }
  //Connetct với server nodejs, thông qua socket.io
  componentWillMount() {
    this.socket = io('http://localhost:6969/');  //https://trong-chat-server.herokuapp.com/
    this.socket.on('id', res => this.setState({ user: res.user, color: res.color })) // lắng nghe event có tên 'id'
    this.socket.on('newMessage', (response) => { this.newMessage(response) }); //lắng nghe event 'newMessage' và gọi hàm newMessage khi có event
    this.socket.on("thoat", res => {
      console.log(`Thoat ${res}`)
      if (res) {
        this.setState({ guest: null, isConnected: false, isSearch: false, isAlert: false })
      }
    })
  }

  //Khi có tin nhắn mới, sẽ push tin nhắn vào state mesgages, và nó sẽ được render ra màn hình
  newMessage(m) {
    const messages = this.state.messages;
    const mesgagesRoomOne = this.state.mesgagesRoomOne
    let ids = _map(messages, 'id');
    let max = Math.max(...ids);
    if (m.isGroup) {
      messages.push({
        id: max + 1,
        userId: m.id,
        message: m.data,
        time: m.time,
        color: m.color
      })
    } else {
      this.setState({ isAlert: false })
      mesgagesRoomOne.push({
        id: max + 1,
        userId: m.id,
        message: m.data,
        time: m.time,
        color: m.color
      })
    }
    let objMessage = $('.messages');
    if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight) {
      this.setState({ messages, mesgagesRoomOne });
      // objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 100); //tạo hiệu ứng cuộn khi có tin nhắn mới
      $('.messages').scrollTop($('.messages').scrollTop() + 99999)

    } else {
      this.setState({ messages, mesgagesRoomOne });
      if (m.id === this.state.user) {
        // objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 100);
        $('.messages').scrollTop($('.messages').scrollTop() + 99999)

      }
    }
  }
  //Gửi event socket newMessage với dữ liệu là nội dung tin nhắn
  sendnewMessage(m, isOneToOne) {
    let { color, user, guest, isConnected } = this.state
    this.setState({ isAlert: false })
    if (m.value) {
      if (isOneToOne) {
        if (isConnected) {
          this.socket.emit("newMessageOneToOne", { message: m.value, user: user, guest: guest, isOneToOne: true, color: color }); //gửi event về server
          m.value = "";
        } else {
          alert("Chưa kết nối với người lạ!")
        }

      } else {
        this.socket.emit("newMessage", { message: m.value, user: user, guest: guest, isGroup: true, color: color }); //gửi event về server
        m.value = "";
      }
    }
  }

  actionDisConnect(idGuest) { //Kiểm tra nếu mất kết nối thì set lại trạng thái isConnected, isSearch và hiện nút tìm kiếm
    var idSocket = idGuest + "a"
    if (this.state.isConnected)
      this.socket.on(idSocket, res => {
        if (res) {
          this.setState({ isConnected: false, isSearch: false })
        } else {
        }
      })
  }

  connectOnetoOne() {
    let { isConnected, user, isSearch } = this.state
    this.setState({ mesgagesRoomOne: [] })
    if (!isConnected && !isSearch) {
      this.setState({ isSearch: true })
      this.socket.emit("ketnoi", { user }); //gửi event về server
      this.socket.on(this.state.user, res => {
        this.setState({ guest: res.guestId, isConnected: true, isSearch: false, isAlert: true, roomOneToOne: res.room })
        this.actionDisConnect(this.state.guest)
        this.socket.on('newMessageOneToOne', (response) => { this.newMessage(response) });
      })
    } else {
      alert("Đang tìm kiếm!")
      console.log("Đang tìm kiếm!")
    }
  }

  disConnectOntoTone() {
    const { guest, user } = this.state
    this.socket.emit('thoat', { user, guest })
  }

  render() {
    const { isConnected } = this.state
    return (
      <div className="App">
        <div className="chat_window">
          <div className="top_menu">
            <div className="buttons">
              {/* <div class="button close"></div>
              <div class="button minimize"></div>
              <div class="button maximize"></div> */}
              <ul className="nav nav-tabs">
                <li className="active">
                  <a data-toggle="tab" href="#home">
                    <span>
                      <img src="https://cdn3.iconfinder.com/data/icons/toolbar-people/512/user_network_man_internet_world-512.png" style={{ width: "20px", height: "20px" }} />
                    </span>
                  </a>
                </li>
                <li><a data-toggle="tab" href="#menu1">
                  <span>
                    <img src="https://cdn1.iconfinder.com/data/icons/users-and-groups/32/user-group-chat-02-512.png" style={{ width: "20px", height: "20px" }} />
                  </span>
                </a>
                </li>
              </ul>


            </div>
            <div className="title">{this.state.user}</div>
          </div>
          <div className="tab-content">
            <div id="home" className="tab-pane fade in active">
              <MessageList user={this.state.user} messages={this.state.messages} />
              <Input checkConnect={true} sendMessage={this.sendnewMessage.bind(this)} isOneToOne={false} />
            </div>
            <div id="menu1" className="tab-pane fade">
              <div className='clearfix' style={{ height: 'auto' }} align="center">
                <button id="btnSearch" className={!isConnected ? 'btn btn-primary btnSearch' : "hidden"} onClick={() => { this.connectOnetoOne() }} >{this.state.isSearch ? 'Đang tìm' : "Tìm người"}</button>

                <a style={{ padding: '30px', cursor: "pointer", color: 'blue' }}
                  id="btnOutRoom" className={isConnected ? '' : "hidden"} onClick={() => { this.disConnectOntoTone() }} >Thoát</a>
                <div className={isConnected && this.state.isAlert ? "alert alert-primary" : "hidden"}><span>Đã kết nối với người lạ!</span></div>
              </div>
              <MessageList user={this.state.user} messages={this.state.mesgagesRoomOne} />
              <Input checkConnect={isConnected} sendMessage={this.sendnewMessage.bind(this)} isOneToOne={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
