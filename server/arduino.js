//use serial port
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

//track port (2)
const PORT1 = new SerialPort({ path: "COM3", baudRate: 115200 });
//create parsers (2)
const PARSER1 = PORT1.pipe(new ReadlineParser({ delimiter: "\n" }));

const SUBSCRIBERS = {
  pedestal1: [],
  pedestal2: [],
  pedestal3: [],
  pedestal4: [],
  rfid1: [],
  rfid2: [],
  rfid3: [],
  rfid4: [],
};

//create data arrays through splitting (on "|" ?)
//assign data to creatures through arrays indexes (PARSER.on)
// map/trim
// notify
PORT1.on("open", () => console.log("Port1 open"));
PORT1.on("error", (err) => console.error("Port error", err.message));

PARSER1.on("data", (data) => {
  let newData = data.split(" | ");
  let data1 = newData[0].split(" ");
  let data2 = newData[1].split(" ");
  let data3 = newData[2].split(" ");
  let data4 = newData[3].split(" ");
  notify("pedestal1", {
    //rfidTag: data1[0],
    selectedChoice: data1[1],
  });
  notify("pedestal2", {
    //rfidTag: data2[0],
    selectedChoice: data2[1],
  });
  notify("pedestal3", {
    //rfidTag: data3[0],
    selectedChoice: data3[1],
  });
  notify("pedestal4", {
    //rfidTag: data4[0],
    selectedChoice: data4[1],
  });
});

//NOTIFY/SUBSCRIBE FUNCTIONALITY
function notify(type, data) {
  SUBSCRIBERS[type]?.forEach((callback) => callback(data));
}

function subscribe(type, callback) {
  if (SUBSCRIBERS[type]) SUBSCRIBERS[type].push(callback);
}

//export subscribe
export { subscribe };
