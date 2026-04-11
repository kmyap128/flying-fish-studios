#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <SparkFun_TMAG5273_Arduino_Library.h>
#include <SparkFun_I2C_Mux_Arduino_Library.h>

#define NUMBER_OF_MAGS 12
#define NUMBER_OF_RFID 4

#define RST_PIN 9
#define SS_PIN_1 4
#define SS_PIN_2 5
#define SS_PIN_3 6
#define SS_PIN_4 7

#define MAGNET_THRESHOLD 50.0  // mT — tune this value as needed

// Mux port for each of the 12 sensors, in order
// Pedestal 1: mux 0x70, ports 1,2,3
// Pedestal 2: mux 0x70, ports 5,6,7
// Pedestal 3: mux 0x71, ports 1,2,3
// Pedestal 4: mux 0x71, ports 5,6,7
int magToPort[] = { 1, 2, 3, 5, 6, 7, 1, 2, 3, 5, 6, 7 };
uint8_t magToMux[] = {
  0x70, 0x70, 0x70, 0x70, 0x70, 0x70,  // sensors 0-5: first mux
  0x71, 0x71, 0x71, 0x71, 0x71, 0x71   // sensors 6-11: second mux
};

TMAG5273 sensors[NUMBER_OF_MAGS];
uint8_t i2cAddress = TMAG5273_I2C_ADDRESS_INITIAL;

MFRC522 mfrc522[NUMBER_OF_RFID] = {
  MFRC522(SS_PIN_1, RST_PIN),
  MFRC522(SS_PIN_2, RST_PIN),
  MFRC522(SS_PIN_3, RST_PIN),
  MFRC522(SS_PIN_4, RST_PIN)
};
MFRC522::MIFARE_Key key;

// Current magnet state per sensor (true = magnet present)
bool magnetState[NUMBER_OF_MAGS] = { false };

// RFID uid per pedestal (empty string = no card)
String pedestalRFID[NUMBER_OF_RFID] = { "", "", "", "" };

void enableMuxPort(byte port, uint8_t addr) {
  Wire.beginTransmission(addr);
  Wire.write(1 << port);
  Wire.endTransmission();
}

void disableMuxPort(byte port, uint8_t addr) {
  Wire.beginTransmission(addr);
  Wire.write(0);
  Wire.endTransmission();
}

String readRFID(byte readerIndex) {
  String idString = "";
  for (int i = 0; i < mfrc522[readerIndex].uid.size; i++) {
    idString += String(mfrc522[readerIndex].uid.uidByte[i]);
  }
  return idString;
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  SPI.begin();

  // Disable all mux ports to start
  for (byte x = 0; x < 8; x++) {
    disableMuxPort(x, 0x70);
    disableMuxPort(x, 0x71);
  }

  // Initialize magnetometer sensors
  for (byte x = 0; x < NUMBER_OF_MAGS; x++) {
    int port = magToPort[x];
    uint8_t mux = magToMux[x];

    enableMuxPort(port, mux);

    if (sensors[x].begin(i2cAddress, Wire) == 1) {
      Serial.print("Sensor ");
      Serial.print(x);
      Serial.println(" OK");
    } else {
      Serial.print("FAIL ");
      Serial.println(x);
    }

    disableMuxPort(port, mux);
  }

  // Initialize RFID readers
  for (byte y = 0; y < NUMBER_OF_RFID; y++) {
    mfrc522[y].PCD_Init();
    for (byte i = 0; i < 6; i++) {
      key.keyByte[i] = 0xFF;
    }
  }

  Serial.println("Setup complete");
}

void loop() {
  // --- Read magnetometers ---
  for (byte x = 0; x < NUMBER_OF_MAGS; x++) {
    int port = magToPort[x];
    uint8_t mux = magToMux[x];

    enableMuxPort(port, mux);

    if (sensors[x].getMagneticChannel() != 0) {
      float magX = sensors[x].getXData();
      float magY = sensors[x].getYData();
      float magZ = sensors[x].getZData();

      // Total field strength
      float strength = sqrt(magX * magX + magY * magY + magZ * magZ);
      magnetState[x] = (strength >= MAGNET_THRESHOLD);
    }

    disableMuxPort(port, mux);
  }

  // --- Read RFID ---
  for (byte y = 0; y < NUMBER_OF_RFID; y++) {
    if (mfrc522[y].PICC_IsNewCardPresent() && mfrc522[y].PICC_ReadCardSerial()) {
      pedestalRFID[y] = readRFID(y);
      mfrc522[y].PICC_HaltA();
    }
  }

  // --- Output one line per pedestal ---
  // Format: RFID SENSOR0 SENSOR1 SENSOR2
  // Example: TAG001 1 0 0 | TAG002 0 1 0 | ...
  // Each pedestal: sensors x*3, x*3+1, x*3+2
  for (byte p = 0; p < 4; p++) {
    Serial.print(pedestalRFID[p].length() > 0 ? pedestalRFID[p] : "NONE");
    Serial.print(" ");
    Serial.print(magnetState[p * 3]     ? "1" : "0");
    Serial.print(" ");
    Serial.print(magnetState[p * 3 + 1] ? "1" : "0");
    Serial.print(" ");
    Serial.print(magnetState[p * 3 + 2] ? "1" : "0");
    if (p < 3) Serial.print(" | ");
  }
  Serial.println();

  delay(100); // 10 updates per second is plenty
}