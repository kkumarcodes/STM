export default (rooms, roomId) => {
    const a = rooms.filter((room) => room.id === roomId)[0];
    console.log("selectedroom", a);
    return a;
}