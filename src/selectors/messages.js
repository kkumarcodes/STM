export default (rooms, roomId) => {
    const a = rooms.filter((room) => room.id === roomId)[0];
    const b = a ? a.messages : "Loading...";
    return b;
}