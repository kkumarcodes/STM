import { fetchPosts, prepareBody } from '../utils/utils'

export const getFirebaseToken = (session) => {
    const opts = {
        "accessCode": process.env.ACCESS_CODE,
        "session": session,
        "user": session.user
    }

    const request = {
        "action": "GetFirebaseToken",
        "request": JSON.stringify(opts)
    }

    const FIREBASE_ENDPOINT = "firebase"

    const formBody = prepareBody(request);

    return fetchPosts(FIREBASE_ENDPOINT, formBody);
}