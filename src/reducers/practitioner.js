const pracReducerDefault = {};

export default (state = pracReducerDefault, action) => {
    console.log("action", action);
    switch (action.type) {
        case "SAVEPRACTITIONER":
            return { ...state, practitioner: action.practitioner }
        default:
            return state;
    }
};