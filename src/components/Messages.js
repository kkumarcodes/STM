import React from 'react';
import Message from './Message';
import { connect } from 'react-redux';

class Messages extends React.Component {

    constructor(props) {
        super(props)
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        const messagesArray = Object.values(this.props.messages);
        const userId = this.props.user.uid;

        messagesArray.sort((o1, o2) => {
            return new Date(o1.timestamp) - new Date(o2.timestamp)
        });

        return (
            <div className="message-wrapper">
                {
                    messagesArray.map((message, key) =>
                        (
                            <Message
                                key={key}
                                message={message}
                                handleRemoveMessage={this.props.handleRemoveMessage}
                                userId={userId} />
                        )
                    )
                }

                <div className='last-message-anchor'
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(Messages);
