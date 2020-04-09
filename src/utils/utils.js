import { Promise } from "firebase";

const BASE_URL = process.env.BACKEND_URL;

export const prepareBody = (request) => {
    var formBody = [];
    for (var property in request) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(request[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return formBody;
}

export const fetchPosts = (endpoint, body) => {
    const URL = `${BASE_URL}${endpoint}`;

    console.log(URL);
    return fetch(URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
        .then((response) => response.json())
        .then(res => {
            if (res.status === "success") {
                return res;
            } else {
                console.log("error sending api request", endpoint);
                return Promise.reject(res);
            }
        });
}
