import React from 'react';
import Modal from 'react-modal';

const MessageModal = (props) => (

    <Modal
        isOpen={!!props.Login}
        contentLabel='lselected message'
    >
        <h3>Message Modal</h3>
        <button onClick={props.clearIsLogin}>Okay</button>

    </Modal>
);


export default MessageModal;