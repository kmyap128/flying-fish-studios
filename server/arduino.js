//use serial port
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

//track port (2)
const PORT1 = new SerialPort({ path: "COM3", baudRate: 115200 });
const PORT2 = new SerialPort({ path: "COM4", baudRate: 115200 });
//create parsers (2)
const PARSER1 = PORT1.pipe(new ReadlineParser({ delimiter: "\n" }));
const PARSER2 = PORT2.pipe(new ReadlineParser({ delimiter: "\n" }));

const SUBSCRIBERS = {
  pedestal1: [],
  pedestal2: [],
  pedestal3: [],
  pedestal4: [],
};

//create data arrays through splitting (on "|" ?)
//assign data to creatures through arrays indexes (PARSER.on)
// map/trim
// notify
PORT1.on("open", () => console.log("Port1 open"));
PORT2.on("open", () => console.log("Port2 open"));

PARSER1.on("data", (data) => {
  let newData = data.split(" | ");
  let data1 = newData[0].split(" ");
  let data2 = newData[1].split(" ");
  notify("pedestal1", {
    selectedPedestal: data1[0],
    selectedChoice: data1[1],
  });
  notify("pedestal2", {
    selectedPedestal: data2[0],
    selectedChoice: data2[1],
  });
});

PARSER2.on("data", (data) => {
  let newData = data.split(" | ");
  let data3 = newData[0].split(" ");
  let data4 = newData[1].split(" ");
  notify("pedestal3", {
    selectedPedestal: data3[0],
    selectedChoice: data3[1],
  });
  notify("pedestal4", {
    selectedPedestal: data4[0],
    selectedChoice: data4[1],
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
