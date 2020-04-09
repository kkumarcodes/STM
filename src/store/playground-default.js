import { createStore, combineReducers } from 'redux';

const chatReducerDefault = [{
    chatrooms: [{
        id: 0,
        patientId: 1234,
        practitionerId: 4321,
        status: 'finished'
    }]
}
];

const store = createStore(
    combineReducers({
        users: authReducer,
        chat: chatReducer
    }));

const authReducerDefault = {
    users: [{
        id: 0,
        email: 'default@gmail.com',
        name: 'Anonymous',
        phone: '+11111',
        rooms: []
    }]
};

const conversationReducerDefault = {
    conversations: [{
        id: "patiendId+practitionerId",
        messages: [{
            id: 8888,
            messageText: "Hello Patient",
            receiverId: "patientId",
            senderId: "practitionerId",
            timestamp: 150000000000,
        },
        {
            id: 99999,
            messageText: "Hello Practitoner",
            receiverId: "practitionerId",
            senderId: "patientId",
            timestamp: 150000000000
        }, {
            id: 101010,
            receiverId: "patientId",
            senderId: "practitionerId",
            timestamp: 150000000000,
            imageUrl: "gl://8ads12231"
        }]
    }]
}

store.subscribe(() => {
    console.log(store.getState())
});
