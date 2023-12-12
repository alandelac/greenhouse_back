const express = require("express");
const app = express();
const port = 3000;

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "greenhouse",
});

connection.connect();

app.get("/humidity", (req, res) => {
  connection.query("call get_humidity()", (err, rows, fields) => {
    if (err) throw err;

    for (let i = 0; i < rows[0].length; i++) {
      const fechaHora = new Date(rows[0][i].time);
      const hora = fechaHora.getHours();
      rows[0][i].time = hora;
    }

    res.send(rows[0]);
  });
});

app.get("/temperature", (req, res) => {
  connection.query("call get_temperature()", (err, rows, fields) => {
    if (err) throw err;

    for (let i = 0; i < rows[0].length; i++) {
      const fechaHora = new Date(rows[0][i].time);
      const hora = fechaHora.getHours();
      rows[0][i].time = hora;
    }

    res.send(rows[0]);
  });
});

app.get("/light", (req, res) => {
  connection.query("call get_light()", (err, rows, fields) => {
    if (err) throw err;

    for (let i = 0; i < rows[0].length; i++) {
      const fechaHora = new Date(rows[0][i].time);
      const hora = fechaHora.getHours();
      rows[0][i].time = hora;
    }

    res.send(rows[0]);
  });
});

process.on("exit", () => {
  connection.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
