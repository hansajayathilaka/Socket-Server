var firebaseConfig = {
    apiKey: "AIzaSyCOLN9dUI0cK1cfhMIUu7dc7F8B-3rrN9A",
    authDomain: "remedy-746b5.firebaseapp.com",
    databaseURL: "https://remedy-746b5.firebaseio.com",
    projectId: "remedy-746b5",
    storageBucket: "remedy-746b5.appspot.com",
    messagingSenderId: "644914417801",
    appId: "1:644914417801:web:8a4d49d14394ae11517658"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var token = null;
const messaging = firebase.messaging();
messaging.requestPermission().then(doc => {
    console.log(doc);
    debugger;
    return messaging.getToken();
}).then(doc => {
    debugger;
    token = doc;
    console.log(doc);
}).catch(err => {
    console.error(err);
});

messaging.onMessage(payload => {
    console.log('On Message', payload);
});
