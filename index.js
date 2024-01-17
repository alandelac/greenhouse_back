// modulos de firebase
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, get, set } = require("firebase/database");

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
        const year = d_t.getFullYear();
        const month = d_t.getMonth() + 1;
        const day = d_t.getDate();
        const hour = d_t.getHours();
        const minute = d_t.getMinutes();
        const second = d_t.getSeconds();
        const fecha =
          day +
          "/" +
          month +
          "/" +
          year +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second;

        // agregar el dato a la tabla de timestamp de la BD
        /* Json debe de estar como lo siguiente:
        { 
          "name": "carrot",
          "humidity": 80,
          "temperature": 18,
          "light": true
        }*/
        if(index != -1){
          set(ref(db, "planta/" + (index + 1) + "/timestamp/" + timeIndex), {
            date: fecha,
            humidity: req.body.humidity,
            light: req.body.light,
            temperature: req.body.temperature,
          });
          res.status(200);
        }
        else{
          res.status(400);
          res.send(vegetable+" don't exist");
        }
        
      } else {
        console.log("No data available");
        res.status(404);
      }
    })
    .catch((error) => {
      console.error(error);
    });

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
  let index = -1; // index del vegetal
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

// agregar una planta nueva (iniciar primeros 24 timestamp en 0s)
expressApp.post("/addPlant", (req, res) => {
  const dbRef = ref(getDatabase());
  const plant = req.body.name;
  const newHumidity = req.body.humidity;
  const newTemperature = req.body.temperature;
  const light = req.body.light;

  let index = -1; // index del vegetal

  const db = getDatabase();

  get(child(dbRef, `planta`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        data.shift();
        // checar que el indice de la verdura seleccionada
        index = data.length + 1;

        // conseguir la fecha de hoy
        const d_t = new Date();
        const year = d_t.getFullYear();
        const month = d_t.getMonth() + 1;
        const day = d_t.getDate();
        const hour = d_t.getHours();
        const minute = d_t.getMinutes();
        const second = d_t.getSeconds();
        const fecha =
          day +
          "/" +
          month +
          "/" +
          year +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second;

        set(ref(db, "planta/" + index), {
          name: plant,
          light_time: light,
          humidity: newHumidity,
          temperature: newTemperature,
        });

        for (let i = 1; i <= 25; i++) {
          set(ref(db, "planta/" + index + "/timestamp/" + i), {
            date: fecha,
            humidity: 0,
            light: false,
            temperature: 0,
          });
        }

        res.send("Plant Added");
        res.status(200);
      } else {
        console.log("No data available");
        res.status(400);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

process.on("exit", () => {
  connection.end();
});

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
