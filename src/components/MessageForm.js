import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { connect } from 'react-redux';

class MessageForm extends React.Component {

    state = {
        error: undefined,
        messageBody: ""
    }

    sendMessage = () => {
        const message = this.state.messageBody.trim();
        const error = this.props.handleSendMessage(message);
        this.setState({
            error: error,
            messageBody: ""
        })
    }

    handleKeyPress = (target) => {
        if (target.charCode == 13) {
            this.refs.message.scrollIntoView({ behavior: "smooth" });
        }
    }

    handleOnChange = (e) => {
        this.setState({
            messageBody: e.target.value
        })
    }

    handleKeyPress = e => {
        console.log("keydown!!")
        // && e.shiftKey
        if (e.key === 'Enter' && e.shiftKey)
            return
        if (e.key === 'Enter') {         
            this.sendMessage()
            e.preventDefault();
        } 
    }

    render() {
        return (
            <div className='send-form'>
                {this.state.error && <p>{this.state.error}</p>}
                <div className='send-input-wrap'>
                    <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        useCacheForDOMMeasurements
                        value={this.state.messageBody}
                        onChange={this.handleOnChange}
                        onKeyUp={this.handleKeyPress}
                        placeholder="Type the message..."
                    />
                </div>
                <div className='send-button-wrap'>
                    <i className="fab fa-telegram-plane" onClick={this.sendMessage}></i>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.rooms
    };
};

export default connect(mapStateToProps)(MessageForm);
