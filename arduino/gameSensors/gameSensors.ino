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

TMAG5273 sensors[NUMBER_OF_MAGS];
uint8_t i2cAddress = TMAG5273_I2C_ADDRESS_INITIAL;
// Fixed array declaration — missing [] and braces were wrong
int magToMuxPort[] = { 1, 2, 3, 5, 6, 7, 1, 2, 3, 5, 6, 7 }; // 12 entries for NUMBER_OF_MAGS
int magToMuxAdd[] = { 0x70, 0x70, 0x70, 0x70, 0x70, 0x70, 0x71, 0x71, 0x71, 0x71, 0x71, 0x71, };
int threshold = ceil(NUMBER_OF_MAGS / 2);

MFRC522 mfrc522[NUMBER_OF_RFID] = {
  MFRC522(SS_PIN_1, RST_PIN),
  MFRC522(SS_PIN_2, RST_PIN),
  MFRC522(SS_PIN_3, RST_PIN),
  MFRC522(SS_PIN_4, RST_PIN)
};

// Removed unused pedestal RFID strings — data arrays handle everything
String pedestal1Data[2] = {"TAG-001", ""};
String pedestal2Data[2] = {"TAG-002", ""};
String pedestal3Data[2] = {"TAG-003", ""};
String pedestal4Data[2] = {"TAG-004", ""};

// Added missing key declaration
MFRC522::MIFARE_Key key;

// Added missing magIndex
int magIndex = 0;

void enableMuxPort(byte port, uint8_t addr);
void disableMuxPort(byte port, uint8_t addr);

void setup() {
  Serial.begin(115200);
  Wire.begin();

  Serial.println("Scanning I2C...");
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print("Found device at 0x");
      Serial.println(addr, HEX);
    }
  }
  Serial.println("Scan complete");

  SPI.begin();

  for (byte x = 0; x < 8; x++) {
    disableMuxPort(x, 0x70);
    disableMuxPort(x, 0x71);
  }

  magIndex = 0; // reset before loop
  for (byte x = 0; x < NUMBER_OF_MAGS; x++) {
    int port = magToMuxPort[x];
    uint8_t mux_addr = magToMuxAdd[x];

    enableMuxPort(port, mux_addr);

    // Fixed: was "TMAG5273 sensor" which is a declaration, not assignment
    if (sensors[x].begin(i2cAddress, Wire) == 1) {
      Serial.print("Begin");
      Serial.print(mux_addr);
      Serial.print(" ");
      Serial.println(port);
    } else {
      Serial.print("FAIL ");
      Serial.print(mux_addr);
      Serial.print(" ");
      Serial.println(port);
      while(1);
    }

    magIndex++;
    disableMuxPort(port, mux_addr); // moved inside loop
  }

  // for (byte y = 0; y < NUMBER_OF_RFID; y++) {
  //   mfrc522[y].PCD_Init(); // removed extra SPI.begin() — only needed once
  //   for (byte i = 0; i < 6; i++) {
  //     key.keyByte[i] = 0xFF; // fixed: was keyBite (typo)
  //   }
  // }
}

void loop() {
  pedestal1Data[1] = "";
  pedestal2Data[1] = "";
  pedestal3Data[1] = "";
  pedestal4Data[1] = "";
  // Read magnetometer sensors
  for (byte x = 0; x < NUMBER_OF_MAGS; x++) {
    int port = magToMuxPort[x];
    uint8_t mux_addr = magToMuxAdd[x];
    String magData;

    enableMuxPort(port, mux_addr);

    if (sensors[x].getMagneticChannel() != 0) {
      float magX = sensors[x].getXData();
      float magY = sensors[x].getYData();
      float magZ = sensors[x].getZData();

      // Fixed: threshold comparisons were using threshold/2 inconsistently
      // Pedestal assignment based on which mux and which port half
      magData = String(magX); //+ " " + String(magY) + " " + String(magZ);
    } else {
      magData = "[empty " + String(mux_addr) + " " + String(port) + "]";
    }
      if (mux_addr == 0x70 && (x == 1 || x == 2 || x == 3)) {
        pedestal1Data[1] += magData + " ";
      } else if (mux_addr == 0x70 && (x == 5 || x == 6 || x == 7)) {
        pedestal2Data[1] += magData + " ";
      } else if (mux_addr == 0x71 && (x == 1 || x == 2 || x == 3)) {
        pedestal3Data[1] += magData + " ";
      } else if (mux_addr == 0x71 && (x == 5 || x == 6 || x == 7)) {
        pedestal4Data[1] += magData;
      }

    disableMuxPort(port, mux_addr); // fixed: was disableMuxPort(x, mux_addr) — should use port
  }

  // Read RFID sensors
  // for (byte y = 0; y < NUMBER_OF_RFID; y++) {
  //   if (mfrc522[y].PICC_IsNewCardPresent() && mfrc522[y].PICC_ReadCardSerial()) {
  //     // Fixed: combined into one if — ReadCardSerial must succeed too
  //     String uid = readBytes(mfrc522[y].uid.uidByte, mfrc522[y].uid.size);
  //     if (y == 0) pedestal1Data[0] = uid;
  //     else if (y == 1) pedestal2Data[0] = uid;
  //     else if (y == 2) pedestal3Data[0] = uid;
  //     else if (y == 3) pedestal4Data[0] = uid;

  //     mfrc522[y].PICC_HaltA(); // added — stops the card read cleanly
  //   }
  // }

  // Print all pedestal data on one line for Node to parse
  printPedestalData(pedestal1Data);
  Serial.print(" | ");
  printPedestalData(pedestal2Data);
  Serial.print(" | ");
  printPedestalData(pedestal3Data);
  Serial.print(" | ");
  printPedestalData(pedestal4Data);
  Serial.println();

  delay(10); // increased from 1 — 1ms is too fast and can cause serial buffer issues
}

String readBytes(byte *uidByte, byte uidSize) {
  String idString = "";
  for (int i = 0; i < uidSize; i++) {
    idString += String(uidByte[i]); // fixed: was (String)uidByte[i] — use String() instead
  }
  return idString;
}

// Consolidated print functions into one
void printPedestalData(String data[]) {
  Serial.print(data[0]); // RFID
  Serial.print(" ");
  Serial.print(data[1]); // mag data
}

// Fixed: Arduino doesn't support [int] as a type — use int* and pass size separately
bool contains(int* array, int size, int val) {
  for (int x = 0; x < size; x++) {
    if (array[x] == val) return true;
  }
  return false;
}