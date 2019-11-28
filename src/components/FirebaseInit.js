import firebase from "firebase";


// Firebase Database App Init
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAWeRoMa-HNq5kW2IDuZe6jwSdr6_hIugY",
    authDomain: "cointraf-website.firebaseapp.com",
    databaseURL: "https://cointraf-website.firebaseio.com",
    projectId: "cointraf-website",
    storageBucket: "cointraf-website.appspot.com",
    messagingSenderId: "111749562436",
    appId: "1:111749562436:web:3bf8777c4c63cde128bc11",
    measurementId: "G-383ECHGL6W"
});

export default firebaseApp.firestore();
