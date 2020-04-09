import * as firebase from 'firebase';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};
console.log(JSON.stringify(config))
const customStorageBucket = process.env.FIREBASE_CUSTOM_STORAGE_BUCKET

firebase.initializeApp(config);

const database = firebase.database();
const auth = firebase.auth();
const bucket = firebase.app().storage(customStorageBucket)
//-LU5wguKNlOZDD4JJyHv/messages
// const ref = database.ref("rooms/-LU5wguKNlOZDD4JJyHv/messages").push();
// const ref = database.ref("rooms/-LU5wguKNlOZDD4JJyHv");

// ref.set({
//   receiverId: 1231,
//   status: "BUSY"
// })

// ref.set({
//   textMessage: "from web again again",
//   senderId: 9299292,
//   receiverId: 13123,
//   timestamp: new Date()
// })

// ref.update({
//   created: new Date(),
//   patientId: 82828,
//   patientName: Window,
//   status: "OPEN"
// });
// // ref.update({

//   textMessage: "hello",
//   senderId: 9292929,
//   receiverId: 12234234,
//   timestamp: new Date()

// });
export { firebase, auth, bucket, database as default };


// const reference = database.ref("-LTS76-toQwmt7yAcVp-");
// const genRef = reference.push();
// genRef.set(
//   {
//     messages: [{
//       textMessage: "hi",
//       senderId: 9292929
//     }]
//   }).then((data) => {
//     console.log("THe data is saved.");
//   }).catch((e) => {
//     console.log(e);
//   })
// const room = {
//   created: new Date(),
//   patientName: "WonderWoman",
//   patientId: "6235343775574555",
//   status: 'OPEN',
//   messages: [
//     {
//       receiverId: 929292,
//       senderId: 0,
//       textMessage: "Hey WonderWoman",
//       timestamp: 1546941703655
//     }
//   ],
//   appointmentId: "4889607514619902"

// }
// const roomPushRef = database.ref().child('rooms').push(); // get room push
// roomPushRef.set(room);

// database.ref("rooms").on('value', (snapshot) => {
//   const rooms = [];
//   console.log(snapshot.child)

//   snapshot.forEach((snap) => {
//     console.log(snap.key);
//     rooms.push({
//       ...snap.val()
//     });
//   });
//   // console.log('hey', rooms);
// });










