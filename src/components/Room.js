import React, { Component, Fragment } from 'react';
import ChatInput from "./ChatInput";
import { startLogout } from "../actions/auth";
import { connect } from 'react-redux';
import { startFinishChat } from '../actions/chat'
import { Date } from 'prismic-reactjs';
import moment from 'moment/src/moment';

import avatar from '../assets/images/default-avatar.png'

class Room extends Component {

    state = {
        roomId: "",
        headerBtnToogle: false,
        firstLoading: false,
        hamburgerActive: true,
        removeToogle: false,
        roomHoverId: '',
        hoverFirstTime: false
    }

    onFinishHandler(room) {
        console.log("remove room")
        this.props.startFinishChat(room);
    }
    onClickHandler = (id) => {
        this.setState({
            roomId: id,
            hamburgerActive: false
        })
    }
    handleHoverOff = () => {
        this.setState({
            removeToogle: false,
        })
    }

    handleHoverOn = (id) => {
        console.log(id)
        this.setState({
            roomHoverId: id,
            hoverFirstTime: false
        })
    }

    handleRoomOutSide = () => {
        this.setState({
            hamburgerActive: false
        })
    }

    handleHamburger = () => {
        this.setState({
            hamburgerActive: !this.state.hamburgerActive
        })
    }

    onClickHeaderBtnHandler = () => {
        this.setState({
            headerBtnToogle: !this.state.headerBtnToogle,
            firstLoading: true
        })
    }

    onClickRoomBtnHandler = (e) => {
        e.stopPropagation();
        this.setState({
            roomBtnToogle: !this.state.roomBtnToogle,
            firstLoading: true
        })
    }

    onClickRemoveBtnHandler = (e) => {
        e.stopPropagation();
        this.setState({
            removeToogle: !this.state.removeToogle,
            hoverFirstTime: true,
        })
    }
    
    render() {

        const {
            roomId,
            headerBtnToogle,
            firstLoading,
            hamburgerActive,
            removeToogle,
            roomHoverId,
            hoverFirstTime
        } = this.state

        const {
            rooms
        } = this.props

        return (

            <div className='messenger-wrapper'>
                <div className={`room-wrapper ${hamburgerActive && 'room-show'}`}>
                    <div className='header'>
                        <div className='heading-avatar-icon'>
                        </div>
                        <div className="cus-button-group">
                            <div className="user-avatar">
                                <img src={avatar} width="40px" height="40px" />
                            </div>
                            <div className={`drop-down-btn ${headerBtnToogle && 'active'}`} name="drop-scroll-btn" onClick={this.onClickHeaderBtnHandler}>
                                <i className="fas fa-angle-down" name="drop-scroll-btn"></i>
                                <div className={`drop-scroll ${firstLoading && (headerBtnToogle ? 'appear' : 'disappear')}`}>
                                    <ul>
                                        <li name="logout-button" onClick={this.props.startLogout}>Logout</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='room-wrap'>
                        {rooms.map((chatroom, i) => {

                            const messagesArray = Object.values(chatroom.messages)
                            const lastMessage = messagesArray[messagesArray.length - 1]
                            const status = chatroom.status.toLowerCase()
                            const time = moment(Date(lastMessage.timestamp)).format("ll")

                            return (
                                <div className={`room ${(roomId === chatroom.id) ? 'active' : ''}`} key={i} onClick={() => this.onClickHandler(chatroom.id)} onMouseLeave={this.handleHoverOff}>
                                    <div className="avatar">
                                        <img src={avatar} width="50px" height="50px" />
                                        <div className={`status ${status}`} />
                                    </div>
                                    <div className='contents'>
                                        <div className="details">
                                            <div className="name">{chatroom.patientName}</div>
                                            <div className="message-preview">{lastMessage.textMessage}</div>
                                        </div>
                                        <div className="date">
                                            <span className="time-meta">{time}</span>
                                            <div className='drop-down-btn' name="remove-drop-scroll-btn"
                                                onClick={this.onClickRemoveBtnHandler}
                                                onMouseEnter={() => this.handleHoverOn(chatroom.id)}
                                            >
                                                <i className="fas fa-angle-down" name="remove-drop-scroll-btn"></i>
                                                <div className={`drop-scroll ${(roomHoverId === chatroom.id) && hoverFirstTime && (removeToogle ? 'appear' : 'disappear')}`}>
                                                    <ul>
                                                        <li name="finishbutton" onClick={() => this.onFinishHandler(chatroom)}>Complete</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <ChatInput roomId={this.state.roomId} handleHamburger={this.handleHamburger} hamburgerActive={hamburgerActive} />
            </div>
        );
    }

}
const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout()),
    startFinishChat: (room) => dispatch(startFinishChat(room))
});

export default connect(undefined, mapDispatchToProps)(Room);

