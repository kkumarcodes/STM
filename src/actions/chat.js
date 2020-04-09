import uuid from "uuid";
import database, { bucket } from '../firebase/firebase';
import { Promise } from "firebase";
import { updateAppointment } from '../api/Appointment'

export const createRoom = ({
    created = new Date(),
    patientId = 0,
    patientName = "",
    practitionerId = 0,
    status = 'open',
    messages = []
} = {}
) => ({
    type: "CREATEROOM",
    room: {
        id: uuid(),
        created,
        patientName,
        patientId,
        practitionerId,
        status,
        messages
    }
});
export const startLoadRooms = () => {
    return (dispatch, getState) => {
        database.ref("rooms").on('value', (snapshot) => {
            const rooms = [];
            const userId = getState().user.uid;
            snapshot.forEach((snap) => {
                const room = snap.val();
                if (!getState().rooms.find((r) => r.id === snap.key)) {
                    if ((room.status === 'OPEN' && !room.practitionerId) ||
                        (room.status === 'BUSY' && room.practitionerId === userId)) {
                        room['id'] = snap.key;

                        if (room.messages) {
                            // let messages = [];
                            // room["messages"] = messages;
                            rooms.push(room);
                        }
                    }
                }
            })
            //console.log(rooms)
            if (rooms.length > 0) {
                const loadRoomsPromise = new Promise(function (resolve, reject) {

                    dispatch(loadRooms(rooms));
                    resolve({});
                });

                loadRoomsPromise.then(function () {
                    dispatch(startListeningMessages(rooms));
                    dispatch(startListeningOnRoomStatus(rooms));
                    dispatch(startListeningOnPracId(rooms));
                })

            }
        })
    }
}

export const startFinishChat = (room) => {
    return (dispatch, getState) => {
        console.log("ROOM", room)

        const roomId = room.id;

        const updatePractData = {
            status: "CLOSED"
        };

        database.ref(`rooms/${roomId}`).update(updatePractData).then(() => {

            updateAppointment({
                session: getState().session.session,
                appointmentId: room.appointmentId,
                status: "finished"
            })
            //updateAppointment(getState().session.session, room.appointmentId, "finished");

            dispatch(finishChat(room));

            const messageRef = database.ref(`rooms/${roomId}/messages`).push();

            const practitionerName = getState().practitioner.practitioner.forename ? getState().practitioner.practitioner.forename : "Doctor";

            const emoji = String.fromCodePoint(0x1F61A);

            const byeMessage = {
                error: false,
                receiverId: room.patientId,
                senderId: "0",
                textMessage: `${practitionerName} has closed the room. If you need any assistance please write at nicodele@gmail.com. Thank you. ${emoji}`
            }

            messageRef.set(byeMessage).then(() => {
                console.log("Bye message has been sent")
            })
        })

    }
}

export const startListeningOnPracId = (rooms) => {
    return (dispatch, getState) => {
        rooms.map((room) => {
            console.log("ROOM ID", room.id)
            database.ref(`rooms/${room.id}`).on('child_added', (snapshot) => {
                console.log("I AM HERE")
                console.log("SNAPHOT KEY", snapshot.key);

                if (snapshot.key === "practitionerId") {
                    if (snapshot.val() !== getState().user.uid) {
                        dispatch(finishChat(room))
                    } else {
                        dispatch(editRoom(room.id, { practitionerId: snapshot.val() }))
                    }
                }
            })
        })
    }
}
export const startListeningOnRoomStatus = (rooms) => {
    return (dispatch) => {

        rooms.map((room) => {
            database.ref(`rooms/${room.id}`).on('child_changed', (snapshot) => {
                if (snapshot.val() === 'BUSY') {
                    dispatch(editRoom(room.id, { status: 'BUSY' }));
                } else if (snapshot.val() === 'CLOSED') {
                    dispatch(editRoom(room.id, { status: 'CLOSED' }));
                    dispatch(finishChat(room));
                    database.ref(`rooms/${room.id}`).off();
                }
            })
        })
    }
}

export const startListeningMessages = (rooms) => {
    return (dispatch) => {
        console.log("start Listening messages");

        rooms.map((room) => {
            database.ref(`rooms/${room.id}/messages`).on('child_added', (messagesSnapshot) => {

                const message = messagesSnapshot.val();
                message['id'] = messagesSnapshot.key;

                if (message.imageURL && message.imageURL.includes("gs://")) {

                    const gsReference = bucket.refFromURL(message.imageURL);

                    gsReference.getDownloadURL().then((url) => {
                        console.log("URL", url);
                        message['imageURL'] = url;

                        dispatch(loadMessage({ roomId: room.id, message: message }));

                    })

                    //process initial app local data img upload
                } else if (message.imageURL && !message.imageURL.includes("gs://")) {
                    const imgRef = database.ref(`rooms/${room.id}/messages/${message.id}`);

                    imgRef.on('child_changed', (imgSnapshot) => {
                        console.log("IMGSNAPSHOT", imgSnapshot.val())

                        if (imgSnapshot.val()) {
                            const gsReference = bucket.refFromURL(imgSnapshot.val());

                            gsReference.getDownloadURL().then((url) => {
                                console.log("URL", url);
                                message['imageURL'] = url;

                                dispatch(loadMessage({ roomId: room.id, message: message }));
                            })
                        }
                    });

                    imgRef.off('value');
                }
                console.log("MESSAGE", message.imageURL)
                //console.log("messageSnapShot", messagesSnapshot.val());
                if (message.textMessage) {
                    dispatch(loadMessage({ roomId: room.id, message: message }));
                }
            })
        })

    }
}
export const loadRooms = (rooms) => ({
    type: "LOADROOMS",
    rooms
})

export const loadMessage = ({
    roomId,
    message
} = {}) => ({
    type: "LOADMESSAGE",
    roomId,
    message
});

export const sendMessage = (message) => ({
    type: "SENDMESSAGE",
    message
});

export const startSendMessage = (messageData) => {
    return (dispatch, getState) => {
        const {
            textMessage,
            senderId = 7777777,
            timestamp = new Date().getDate(),
            receiverId,
            appointmentId
        } = messageData;

        const room = messageData.roomId;
        console.log("appointmentId", appointmentId);
        const message = { textMessage, senderId, receiverId, timestamp };
        console.log('Start Sending message is happening here');

        const messageRef = database.ref(`rooms/${room}/messages`).push();
        messageRef.set(message).then(() => {

            const roomRef = database.ref(`rooms/${room}`);

            roomRef.once('value', (snapshot) => {
                const selectedRoom = snapshot.val();

                if (selectedRoom.status === 'OPEN' && !selectedRoom.practitionerId) {
                    const updatePractData = {
                        status: "BUSY",
                        practitionerId: message.senderId

                    };
                    roomRef.update(updatePractData).then(() => {
                        console.log("Update a room with practitioner data");

                        if (appointmentId) {
                            //update the appointment to scheduled first
                            updateAppointment({
                                session: getState().session.session,
                                status: "scheduled",
                                practitionerId: getState().practitioner.practitioner.id,
                                appointmentId: appointmentId,
                                chatRoomId: room
                            });

                            //update the appointment to inProgress
                            updateAppointment({
                                session: getState().session.session,
                                status: "inProgress",
                                appointmentId: appointmentId
                            });
                        }
                        // dispatch(editRoom(room, {
                        //     status: "BUSY",
                        //     practitionerId: getState().practitioner.practitioner.id
                        // }));
                    }).catch((error) => {
                        console.log("Error updating firebase practitioner data. ", error)
                    });
                }
            });

        }).catch((error) => {
            console.log("Error sending message. ", error);
        });

        // roomRef.once('value', (snapshot) => {

        //     const selectedRoom = snapshot.val();

        //     if (selectedRoom.status === 'OPEN' && !selectedRoom.practitionerId) {
        //         const updatePractData = {
        //             status: "BUSY",
        //             practitionerId: message.senderId
        //         };

        //         roomRef.update(updatePractData).then(() => {
        //             console.log("Update a room with practitioner data");
        //             messageRef.set(message).then(() => {
        //                 if (appointmentId) {
        //                     updateAppointment({
        //                         session: getState().session.session,
        //                         appointmentId: appointmentId,
        //                         status: "inProgress",
        //                         practitionerId: getState().practitioner.practitioner.id
        //                     })
        //                 }
        //             }).catch((error) => {
        //                 console.log(error);
        //             })
        //         }).catch((error) => {
        //             console.log(error);
        //         })
        //     } else if (selectedRoom.status === "BUSY" && selectedRoom.practitionerId) {
        //         messageRef.set(message).then(() => {
        //             console.log("Message sent");
        //         }).catch((error) => {
        //             console.log("Error sending a message");
        //         });
        //     }
        // })
    }
}

//leave room action
export const finishChat = ({
    id
} = {}) => ({
    type: "FINISHCHAT",
    id
});

//edit room action
export const editRoom = (id, updates) => ({
    type: 'EDITROOM',
    id,
    updates
});

export const sortByDate = (sortType) => ({
    type: "SORTBYDATE",
    sortType
});

