import { prepareBody } from '../utils/utils'

const authReducerDefault = {};

export default (state = authReducerDefault, action) => {
    console.log("action", action);
    switch (action.type) {
        case 'LOGIN':
            console.log("Login action is happening. " + action.uid);
            return {
                uid: action.uid
            }

        default:
            return state;
    }
};