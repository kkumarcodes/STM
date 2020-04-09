import { fetchPosts, prepareBody } from '../utils/utils'

export const login = async (username, password) => {
    const opts = {
        "accessCode": process.env.ACCESS_CODE,
        "username": username,
        "password": password,
        "longTerm": true
    };
    const request = {
        "action": "Login",
        "request": JSON.stringify(opts)
    }

    const USER_ENDPOINT = "user";

    const formBody = prepareBody(request);

    return await fetchPosts(USER_ENDPOINT, formBody);
    
}