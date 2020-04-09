const chatReducerDefault = [];

export default (state = chatReducerDefault, action) => {
    switch (action.type) {
        case "LOADROOMS":

            return [
                ...state,
                ...action.rooms
            ]


        case "SENDMESSAGE":
            return state.map((room) => {
                if (room.id === action.roomId) {
                    return {
                        ...room,
                        messages: [...room.messages, action.message]
                    }
                }
                else {
                    return room;
                }
            });

        case "LOADMESSAGE":
            console.log("LoadMessage action is happening");
            return state.map((room) => {
                
                if (room.id === action.roomId) {
                    
                    return {
                        ...room,
                        messages: [...room.messages, action.message]
                    };
                } else {
                    return room;
                };
            });
        case "CREATEROOM":
            console.log("createroom action is happening");
            console.log(chatReducerDefault)
            return [
                ...state,
                action.room
            ];
        case "FINISHCHAT":
            console.log("LeaveRoom action is happening");

            return state.filter((room) => {
                return room.id !== action.id
            });
        case "EDITROOM":
            console.log("EditRoom action is happening");

            return state.map((room) => {
                if (room.id === action.id) {
                    return {
                        ...room,
                        ...action.updates
                    };
                } else {
                    return room;
                }
            })
        case "SORTBYDATE":
            console.log("Sort By date action is happening");
            if (action.sortType === 'descending') {

                return state.sort((o1, o2) => {
                    return new Date(o2.created) - new Date(o1.created)
                })
            } else if (action.sortType === 'ascending') {
                return state.sort((o1, o2) => {
                    return new Date(o1.created) - new Date(o2.created)
                })
            }
        default:
            console.log("Default action is happening");
            return state;
    }
};