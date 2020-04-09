import React from 'react';
import Messages from '../components/Messages';
import MessageForm from '../components/MessageForm';
import selectedMessages from '../selectors/messages';
import selectedRoom from '../selectors/room';
import { connect } from 'react-redux';
import { startSendMessage } from '../actions/chat';
import avatar from '../assets/images/default-avatar.png'
import connection from '../assets/images/connection.png'

class ChatInput extends React.Component {

    handleRemoveMessage = (messageToRemove) => {

        this.setState((prevState) => ({
            data: prevState.data.filter((message) => messageToRemove !== message
            )
        }))
    }

    handleSendMessage = (message) => {
        if (message) {

            const messageData = {
                textMessage: message,
                roomId: this.props.roomId,
                timestamp: new Date().getTime(),
                receiverId: this.props.room.patientId,
                senderId: this.props.user.uid,
                appointmentId: this.props.room.appointmentId
            }
            console.log('messageData', messageData);

            this.props.startSendMessage(messageData);
            //this.props.history.push('/');
        }
    }

    render() {

        const {
            room,
            messages,
            hamburgerActive
        } = this.props

        let status
        if (room !== undefined)
            status = room.status.toLowerCase()

        return (
            <div className={`conversation-wrap ${hamburgerActive && 'cover-glow'}`}>
                {(room === undefined || room === "" || room === null)?
                    (
                        <div className="no-selected-wrap">
                            <img src={connection}/>
                            <div className="connection-title">Keep connect with room</div>
                            <div className="connection-sub-title">Please connect to the room for chat via messenger.</div>
                        </div>
                    ):(
                        <div className="conversation-wrapper" >
                            <div className="header">
                                <div className="room-info">
                                    <div className={`hamburger-wrap ${hamburgerActive && 'active'}`} onClick={this.props.handleHamburger}>
                                        <i className="fas fa-bars"></i>
                                    </div>
                                    <div className="room-avatar">
                                        <img src={avatar} width="40px" height="40px" />
                                        <div className={`status ${status}`} />
                                    </div>
                                    <span>{room.patientName}</span>
                                </div>  
                                <div className="functions"></div>
                            </div>
                            {messages !== 'Loading...' && messages !== undefined && 
                                <Messages
                                    messages={messages}
                                    handleRemoveMessage={this.handleRemoveMessage}
                                />
                            }   
                            <MessageForm
                                    handleSendMessage={this.handleSendMessage}
                                />
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    messages: selectedMessages(state.rooms, props.roomId),
    room: selectedRoom(state.rooms, props.roomId),
    user: state.user
});

const mapDispatchToProps = (dispatch) => ({
    startSendMessage: (messageData) => dispatch(startSendMessage(messageData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
