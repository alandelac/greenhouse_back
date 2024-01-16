// modulos de firebase
const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  ref,
  onValue,
  child,
  get,
  set,
} = require("firebase/database");

// cosas para que funcione firebase
const firebaseConfig = {
  apiKey: "AIzaSyATF3Ey9JHnMC3EYlAy4jcHtSY_9F7kvPU",
  authDomain: "greenmayas-48771.firebaseapp.com",
  databaseURL: "https://greenmayas-48771-default-rtdb.firebaseio.com",
  projectId: "greenmayas-48771",
  storageBucket: "greenmayas-48771.appspot.com",
  messagingSenderId: "774450277707",
  appId: "1:774450277707:web:c42dac297cc9f96de5ccce",
  measurementId: "G-X0XKN74T3T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const express = require("express");
const expressApp = express();
expressApp.use(express.json());
const port = 3000;

// agregar un nuevo time stamp a la base de datos
// req.body.name tiene el nombre de la verdura a la cual agregar un nuevo dato
expressApp.post("/addData", (req, res) => {
  const dbRef = ref(getDatabase());
  let vegetable = req.body.name;
  let index = -1; // index del vegetal
  let timeIndex = -1; // index del timestamp
  const db = getDatabase();

  get(child(dbRef, `planta`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        data.shift();
        // checar que el indice de la verdura seleccionada
        for (let i = 0; i < data.length; i++) {
          if (data[i].name == vegetable) {
            index = i;
            timeIndex = data[index].timestamp.length;
          }          
        }

        // conseguir la fecha de hoy
        const d_t = new Date();
        let year = d_t.getFullYear();
        let month = d_t.getMonth();
        let day = d_t.getDate();

        // agregar el dato a la tabla de timestamp de la BD
        /* Json debe de estar como lo siguiente:
        { 
          "name": "carrot",
          "humidity": 80,
          "temperature": 18,
          "light": true
        }*/
        set(ref(db, "planta/" + (index + 1) + "/timestamp/" + timeIndex), {
          date: day + "/" + (month+1) + "/" + year,
          humidity: req.body.humidity,
          light: req.body.light,
          temperature: req.body.temperature,
        });
        res.status(200);
      } else {
        console.log("No data available");
        res.status(404);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  res.send("Timestamp agregado");
  res.status(200);
});

// obtener la info de los actuadores
expressApp.get("/getActuator", (req, res) => {
  const dbRef = ref(getDatabase());

  get(child(dbRef, `actuators`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        data.shift();
        console.log(data);
        res.send(data);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

// obtener temperaturo de una planta
/* El paquete o json solo debe de incluir el nombre de la planta
{
  "name": "carrot"
}
*/
expressApp.get("/getPlantData", (req, res) => {
  const dbRef = ref(getDatabase());
  let vegetable = req.query.name;
  let metrics = req.query.metrics;
  let index = -1; // index del vegetal
  let timeIndex = -1; // index del timestamp
  const db = getDatabase();

  get(child(dbRef, `planta`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        data.shift();
        for (let i = 0; i < data.length; i++) {
          if (data[i].name == vegetable) {
            index = i;
          }
          //  data[index].timestamp.shift();

          console.log("algo");
        }
        let sendingData = data[index].timestamp;
        sendingData = sendingData.slice(-24);
        
        res.status(200);
        res.send(sendingData);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  res.status(200);
});

process.on("exit", () => {
  connection.end();
});

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
