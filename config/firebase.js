import *as firebase from 'firebase';

  var config = {
    apiKey: "AIzaSyD4GT1OmA2u9NyQNh8KOR-KZnX2NU4lBdg",
    authDomain: "handyman-finder-e2da8.firebaseapp.com",
    databaseURL: "https://handyman-finder-e2da8.firebaseio.com",
    projectId: "handyman-finder-e2da8",
    storageBucket: "handyman-finder-e2da8.appspot.com",
    messagingSenderId: "856759030191"
  };
  firebase.initializeApp(config);

  export default firebase 