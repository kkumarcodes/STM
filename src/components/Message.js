import React from 'react';
import { Date } from 'prismic-reactjs';
import moment from 'moment/src/moment';

class Message extends React.Component {

    render () {
        const userId = this.props.userId;
        const senderId = this.props.message.senderId;
        const time = moment(Date(this.props.message.timestamp)).format("LT")

        if (userId === senderId) {
            return (
                <div className="message-body">
                    <div className="timestamp-sender">{time}</div>
                    <div className="message-main-sender">
                        {this.props.message.textMessage}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="message-body">
                    <div className="timestamp-receiver">{time}</div>
                    {this.props.message.imageURL ?
                        <img src={this.props.message.imageURL} />:
                        <div className="message-main-receiver">
                            {this.props.message.textMessage}
                        </div>}
                </div>
            );
        }
    }
}

export default Message;
