const { initializeApp } =require ("firebase/app");
const { getDatabase, ref, onValue, child, get } =require ("firebase/database");

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyATF3Ey9JHnMC3EYlAy4jcHtSY_9F7kvPU",
  authDomain: "greenmayas-48771.firebaseapp.com",
  databaseURL: "https://greenmayas-48771-default-rtdb.firebaseio.com",
  projectId: "greenmayas-48771",
  storageBucket: "greenmayas-48771.appspot.com",
  messagingSenderId: "774450277707",
  appId: "1:774450277707:web:c42dac297cc9f96de5ccce",
  measurementId: "G-X0XKN74T3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const dbRef = ref(getDatabase());
get(child(dbRef, `actuators`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

const express = require("express");
const expressApp = express();
const port = 3000;



expressApp.get("/humidity", (req, res) => {
  res.send("Hola Mundo");
});


process.on("exit", () => {
  connection.end();
});

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
