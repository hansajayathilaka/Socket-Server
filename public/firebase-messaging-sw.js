importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');

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

const messaging = firebase.messaging();

// When user not in the web page
messaging.setBackgroundMessageHandler(function (payload) {
    const title = 'Title';
    const options = {
        body: payload.data,
    }
    return self.registraiton.showNotification(title, options)
});
