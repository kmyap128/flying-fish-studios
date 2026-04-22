//use serial port
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const SILENT_TIMEOUT_MS = 5000;
const RECONNECT_DELAY_MS = 2000;

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

let silentTimer = null;
let isConnected = false;

function resetSilentTimer() {
  if (silentTimer) clearTimeout(silentTimer);
  silentTimer = setTimeout(() => {
    console.warn(
      `⚠️ No data from Arduino for ${SILENT_TIMEOUT_MS}ms — attempting reconnect`,
    );
    reconnect();
  }, SILENT_TIMEOUT_MS);
}

function reconnect() {
  isConnected = false;
  if (PORT1 && PORT1.isOpen) {
    PORT1.close(() => scheduleReconnect());
  } else {
    scheduleReconnect();
  }
}

function scheduleReconnect() {
  console.log(`🔄 Reconnecting in ${RECONNECT_DELAY_MS}ms...`);
  setTimeout(() => {
    if (!isConnected) {
      PORT1 = new SerialPort({ path: PORT_PATH, baudRate: BAUD_RATE });
      PARSER1 = PORT1.pipe(new ReadlineParser({ delimiter: "\n" }));
      attachListeners();
    }
  }, RECONNECT_DELAY_MS);
}

//create data arrays through splitting (on "|" ?)
//assign data to creatures through arrays indexes (PARSER.on)
// map/trim
// notify
PORT1.on("open", () => console.log("Port1 open"));
PORT1.on("error", (err) => console.error("Port error", err.message));

PARSER1.on("data", (data) => {
  resetSilentTimer();
  
  let newData = data.split(" | ");
  if (newData.length > 1) {
    if (newData[0]) {
      let data1 = newData[0].split(" ");
      notify("pedestal1", {
        selectedChoice: data1[1],
      });
      notify("rfid1", {
        rfidTag: data1[0],
        selectedChoice: data1[1],
      });
    }
    if (newData[1]) {
      let data2 = newData[1].split(" ");
      notify("pedestal2", {
        selectedChoice: data2[1],
      });
      notify("rfid2", {
        rfidTag: data2[0],
        selectedChoice: data2[1],
      });
    }
    if (newData[2]) {
      let data3 = newData[2].split(" ");
      notify("pedestal3", {
        selectedChoice: data3[1],
      });
      notify("rfid3", {
        rfidTag: data3[0],
        selectedChoice: data3[1],
      });
    }
    if (newData[3]) {
      let data4 = newData[3].split(" ");
      notify("pedestal4", {
        selectedChoice: data4[1],
      });
      notify("rfid4", {
        rfidTag: data4[0],
        selectedChoice: data4[1],
      });
    }
  }
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
