const EXPRESS = require("express");
const HTTP = require("http");
const { Server } = require("socket.io");
const ARDUINO_PARSER = require("./arduino");
const path = require("path");

const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);
const io = new Server(SERVER);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

APP.use(EXPRESS.static("client"));
APP.use("/media", EXPRESS.static("media"));
APP.use("/data", EXPRESS.static(path.join(__dirname, "../data")));

// parse arduino data (option selections and button press)
ARDUINO_PARSER.subscribe("pedestal1", (data) => io.emit("pedestal1Data", data));
ARDUINO_PARSER.subscribe("pedestal2", (data) => io.emit("pedestal2Data", data));
ARDUINO_PARSER.subscribe("pedestal3", (data) => io.emit("pedestal3Data", data));
ARDUINO_PARSER.subscribe("pedestal4", (data) => io.emit("pedestal4Data", data));

SERVER.listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
