import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const PORT1 = new SerialPort({ path: "COM3", baudRate: 115200 });
const PARSER1 = PORT1.pipe(new ReadlineParser({ delimiter: "\n" }));

PORT1.on("open", () => console.log("Port1 open"));
PORT1.on("error", (err) => console.error("Port1 error:", err.message));

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

// Track previous states to only fire on changes
const prevSensors = {
  pedestal1: [false, false, false],
  pedestal2: [false, false, false],
  pedestal3: [false, false, false],
  pedestal4: [false, false, false],
};

const prevRFID = {
  pedestal1: "NONE",
  pedestal2: "NONE",
  pedestal3: "NONE",
  pedestal4: "NONE",
};

// Parse one pedestal chunk: "RFID S0 S1 S2"
function parsePedestalChunk(chunk) {
  const parts = chunk.trim().split(" ");
  return {
    rfid: parts[0],
    sensors: [parts[1] === "1", parts[2] === "1", parts[3] === "1"],
  };
}

function handleLine(line) {
  const chunks = line.trim().split(" | ");
  if (chunks.length !== 4) return;

  const pedestalNames = ["pedestal1", "pedestal2", "pedestal3", "pedestal4"];

  pedestalNames.forEach((name, i) => {
    const { rfid, sensors } = parsePedestalChunk(chunks[i]);

    // Fire RFID event only when a new card is tapped
    if (rfid !== "NONE" && rfid !== prevRFID[name]) {
      prevRFID[name] = rfid;
      notify(`rfid${i + 1}`, { rfidTag: rfid });
    }

    // Fire sensor event only when state changes
    sensors.forEach((isActive, sensorIndex) => {
      if (isActive !== prevSensors[name][sensorIndex]) {
        prevSensors[name][sensorIndex] = isActive;
        notify(name, { sensorIndex, isActive });
      }
    });
  });
}

PARSER1.on("data", handleLine);

function notify(type, data) {
  SUBSCRIBERS[type]?.forEach((cb) => cb(data));
}

function subscribe(type, callback) {
  if (SUBSCRIBERS[type]) SUBSCRIBERS[type].push(callback);
}

export { subscribe };
