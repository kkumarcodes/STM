
const defaultSessionReducer = {};

export default (state = defaultSessionReducer, action) => {

    switch (action.type) {

        case "SAVESESSION":
            return { ...state, session: action.session }
        default:
            return state;

    }
} 