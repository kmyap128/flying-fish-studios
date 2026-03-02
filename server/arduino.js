//use serial port
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

//track port (2)
const PORT = new SerialPort({ path: "COM3", baudRate: 9600 });
//create parsers (2)
const PARSER = PORT.pipe(new ReadlineParser({ delimiter: "\n" }));

const SUBSCRIBERS = { pedestal: [] };

//create data arrays through splitting (on "|" ?)

//assign data to creatures through arrays indexes (PARSER.on)
// map/trim
// notify
PORT.on("open", () => console.log("Port open"));

PARSER.on("data", (data) => {
  let newData = data.trim();
  notify("pedestal", {
    selectedPedestal: newData[0],
  });
});

//NOTIFY/SUBSCRIBE FUNCTIONALITY
function notify(type, data) {
  SUBSCRIBERS[type].forEach((callback) => callback(data));
}

function subscribe(type, callback) {
  SUBSCRIBERS[type].push(callback);
}

//add parser error conditions
PORT.on("error", (err) => console.error("Port error:", err.message));

//export subscribe
module.exports = {
  subscribe,
};
