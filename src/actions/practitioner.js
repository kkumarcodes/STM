import { fetchPosts, prepareBody } from '../utils/utils'

const ENDPOINT = "patientpractitioner";
const ACCESS_CODE = process.env.ACCESS_CODE;

export const savePractitioner = ({ id, user: { username, forename, surname } } = {}) => ({
    type: "SAVEPRACTITIONER",
    practitioner: {
        id,
        username,
        forename,
        surname
    }
});

export const startGetPractitioner = () => {
    return (dispatch, getState) => {

        const session = getState().session.session;

        const opts = {
            accessCode: ACCESS_CODE,
            session: session,
            practitioner: {
                phone: session.user.username
            }
        }
        const request = {
            "action": "GetPractitioner",
            "request": JSON.stringify(opts)
        }

        const formBody = prepareBody(request);

        fetchPosts(ENDPOINT, formBody).then((pracResponse) => {

            if (pracResponse.practitioner.availability !== "Available") {
                const opts = {
                    accessCode: ACCESS_CODE,
                    session: session,
                    practitionerLog: {
                        practitioner: {
                            phone: session.user.username
                        },
                        availability: "available"
                    }
                }

                const request = {
                    "action": "UpdatePractitioner",
                    "request": JSON.stringify(opts)
                }

                const formUpdatePracBody = prepareBody(request);

                fetchPosts(ENDPOINT, formUpdatePracBody).then((pracResponse) => {
                    console.log("Update Practitioner status to available.")
                })
            }
            dispatch(savePractitioner(pracResponse.practitioner));
        });
    }
}