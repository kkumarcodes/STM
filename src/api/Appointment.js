
import { fetchPosts, prepareBody } from '../utils/utils';

const APPOINTMENT_ENDPOINT = "appointment";

export const updateAppointment = (data) => {

    const opts = prepareOpts(data);

    console.log("PrepareOpts", opts);

    const request = {
        "action": "UpdateAppointment",
        "request": JSON.stringify(opts)
    }

    const formBody = prepareBody(request);

    fetchPosts(APPOINTMENT_ENDPOINT, formBody).then((updateAppResponse) => {
        console.log("Appointment is successfully updated");

    }).catch((error) => {
        console.log("Error updating the appointment. ", error);
    });
}

const prepareOpts = (data) => {

    const {
        session,
        appointmentId,
        status,
        practitionerId,
        chatRoomId
    } = data

    if (practitionerId) {
        return {
            "accessCode": process.env.ACCESS_CODE,
            session: session,
            "entry": {
                "appointment": {
                    "id": Number(appointmentId)
                },
                "eta": new Date().getTime(),
                "practitioner": {
                    "id": practitionerId
                },
                "status": status,
                "chatRoomId": chatRoomId
            }
        }
    } else {
        return {
            "accessCode": process.env.ACCESS_CODE,
            session: session,
            "entry": {
                "appointment": {
                    "id": Number(appointmentId)
                },
                "status": status
            }
        }
    }

}
