const EXPRESS = require("express");
const HTTP = require("http");
const { Server } = require("socket.io");
const ARDUINO_PARSER = require("./arduino");

const APP = EXPRESS();
const SERVER = HTTP.createServer(APP);
const io = new Server(SERVER);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

APP.use(EXPRESS.static("client"));
APP.use("/media", EXPRESS.static("media"));

// parse arduino data (option selections and button press)

SERVER.listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
