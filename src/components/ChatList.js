import React from 'react';
import Room from './Room';
import { connect } from 'react-redux';
import { startLoadRooms } from '../actions/chat';
import configureStore from '../store/configureStore';

class ChatList extends React.Component {


    state = {
        rooms: this.props.rooms
    }

    render() {

        return (
                <Room rooms={this.props.rooms} />
            )
            ;
    }
    componentDidMount() {
        this.props.startLoadRooms();
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.rooms
    };
};

const mapDispatchToProps = (dispatch) => ({
    startLoadRooms: () => dispatch(startLoadRooms())
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
