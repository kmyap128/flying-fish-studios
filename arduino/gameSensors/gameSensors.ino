#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <SparkFun_TMAG5273_Arduino_Library.h>
#include <SparkFun_I2C_Mux_Arduino_Library.h>
#include <avr/wdt.h>

#define NUMBER_OF_MAGS 12
#define NUMBER_OF_RFID 4

#define RST_PIN 9
#define SS_PIN_1 4
#define SS_PIN_2 5
#define SS_PIN_3 6
#define SS_PIN_4 7

#define I2C_TIMEOUT_MS 50
#define LOOP_TIMEOUT_MS 500
#define MAX_SILENT_LOOPS 100

TMAG5273 sensors[NUMBER_OF_MAGS];
uint8_t i2cAddress = 0x22;
// Fixed array declaration — missing [] and braces were wrong
int magToMuxPort[] = { 1, 2, 3, 5, 6, 7, 1, 2, 3, 5, 6, 7 };  // 12 entries for NUMBER_OF_MAGS
int magToMuxAdd[] = {
  0x70,
  0x70,
  0x70,
  0x70,
  0x70,
  0x70,
  0x71,
  0x71,
  0x71,
  0x71,
  0x71,
  0x71,
};
int threshold = ceil(NUMBER_OF_MAGS / 2);

bool magMap[4][3] = { { false, false, false }, { false, false, false }, { false, false, false }, { false, false, false } };

bool sensorOK[NUMBER_OF_MAGS] = { false };

// Removed unused pedestal RFID strings — data arrays handle everything
String pedestal1Data[2] = { "TAG-001", "" };
String pedestal2Data[2] = { "TAG-002", "" };
String pedestal3Data[2] = { "TAG-003", "" };
String pedestal4Data[2] = { "TAG-004", "" };

int silentLoopCount = 0;
unsigned long lastOutputTime = 0;

void softwareReset() {
  Serial.println("RESET");
  Serial.flush();
  wdt_enable(WDTO_15MS);
  while (1) {} // wait for watchdog to fire
}

bool i2cBusRecovery() {
  Serial.println("I2C recovery...");
  Serial.flush();

  // Send 9 clock pulses to unstick a device holding SDA low
  pinMode(SDA, OUTPUT);
  pinMode(SCL, OUTPUT);
  for (int i = 0; i < 9; i++) {
    digitalWrite(SCL, HIGH);
    delayMicroseconds(5);
    digitalWrite(SCL, LOW);
    delayMicroseconds(5);
  }
  // Send STOP condition
  digitalWrite(SDA, LOW);
  delayMicroseconds(5);
  digitalWrite(SCL, HIGH);
  delayMicroseconds(5);
  digitalWrite(SDA, HIGH);
  delayMicroseconds(5);

  Wire.begin(); // reinitialize I2C
  delay(100);

  // Check if bus is now free
  Wire.beginTransmission(0x70);
  byte error = Wire.endTransmission();
  if (error == 0) {
    Serial.println("I2C recovery OK");
    Serial.flush();
    return true;
  }
  Serial.println("I2C recovery failed — resetting");
  Serial.flush();
  return false;
}

// Added missing magIndex
int magIndex = 0;

void enableMuxPort(byte port, uint8_t addr);
void disableMuxPort(byte port, uint8_t addr);

void setup() {
  wdt_disable();

  Serial.begin(115200);
  Wire.begin();
  Wire.setTimeout(I2C_TIMEOUT_MS);
  delay(100);

  Serial.println("Scanning I2C...");
  Serial.flush();
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print("Found device at 0x");
      Serial.println(addr, HEX);
      Serial.flush();
    }
  }
  Serial.println("Scan complete");
  Serial.flush();

  SPI.begin();

  for (byte x = 0; x < 8; x++) {
    disableMuxPort(x, 0x70);
    disableMuxPort(x, 0x71);
  }

  for (byte x = 0; x < NUMBER_OF_MAGS; x++) {
    int port = magToMuxPort[x];
    uint8_t mux_addr = magToMuxAdd[x];

    enableMuxPort(port, mux_addr);
    delay(5);

    // Fixed: was "TMAG5273 sensor" which is a declaration, not assignment
    if (sensors[x].begin(i2cAddress, Wire) == 1) {
      sensorOK[x] = true;
      Serial.print("Begin");
      Serial.print(mux_addr);
      Serial.print(" ");
      Serial.println(port);
    } else {
      sensorOK[x] = false;
      Serial.print("FAIL ");
      Serial.print(mux_addr);
      Serial.print(" ");
      Serial.println(port);
    }
      Serial.flush();

    disableMuxPort(port, mux_addr);  // moved inside loop
  }
  wdt_enable(WDTO_2S);

  lastOutputTime = millis();
  Serial.println("Setup complete");
  Serial.flush();
}

void loop() {
  wdt_reset();

  unsigned long loopStart = millis();

  pedestal1Data[1] = "";
  pedestal2Data[1] = "";
  pedestal3Data[1] = "";
  pedestal4Data[1] = "";

  bool anyData = false;

  // Read magnetometer sensors
  for (byte x = 0; x < NUMBER_OF_MAGS; x++) {
    if (!sensorOK[x]) continue;

    wdt_reset();

    int port = magToMuxPort[x];
    uint8_t mux_addr = magToMuxAdd[x];

    enableMuxPort(port, mux_addr);

    unsigned log sensorStart = millis();

    float magX = sensors[x].getXData();

    if (millis() - sensorStart > I2C_TIMEOUT_MS) {
      // This sensor took too long — bus may be locked
      disableMuxPort(port, mux_addr);
      Serial.print("TIMEOUT sensor ");
      Serial.println(x);
      Serial.flush();

      // Try bus recovery
      disableAllMuxPorts();
      if (!i2cBusRecovery()) {
        softwareReset();
      }
      return; // restart loop after recovery
    }

    float magY = sensors[x].getYData();
    float magZ = sensors[x].getZData();

    float strength = sqrt(magX * magX + magY * magY + magZ * magZ);

    anyData = true;
    // Fixed: threshold comparisons were using threshold/2 inconsistently
    // Pedestal assignment based on which mux and which port half

    if (mux_addr == 0x70 && (port < 4)) {
      magMap[0][(port - 1)%4] = checkMagStrength(strength, mux_addr, port);
    } else if (mux_addr == 0x70) {
      magMap[1][(port - 1)%4] = checkMagStrength(strength, mux_addr, port);
    } else if (mux_addr == 0x71 && (port < 4)) {
      magMap[2][(port - 1)%4] = checkMagStrength(strength, mux_addr, port);
    } else if (mux_addr == 0x71) {
      magMap[3][(port - 1)%4] = checkMagStrength(strength, mux_addr, port);
    }

    disableMuxPort(port, mux_addr);  // fixed: was disableMuxPort(x, mux_addr) — should use port
  }

  for (int i = 0; i < 4; i++) {
    int choice = 0;
    for (int j = 0; j < 3; j++) {
      if (magMap[i][j] == true) {
        choice = j+1;
      }
    }
    if (i == 0) {
      pedestal1Data[1] = choice;
    } else if (i == 1) {
      pedestal2Data[1] = choice;
    } else if (i == 2) {
      pedestal3Data[1] = choice;
    } else if (i == 3) {
      pedestal4Data[1] = choice;
    }
  }

  // Print all pedestal data on one line for Node to parse
  printPedestalData(pedestal1Data);
  Serial.print(" | ");
  printPedestalData(pedestal2Data);
  Serial.print(" | ");
  printPedestalData(pedestal3Data);
  Serial.print(" | ");
  printPedestalData(pedestal4Data);
  Serial.println();

  lastOutputTime = millis();
  silentLoopCount = 0;

  unsigned long loopDuration = millis() - loopStart;
  if (loopDuration > LOOP_TIMEOUT_MS) {
    Serial.print("SLOW LOOP: ");
    Serial.println(loopDuration);
    Serial.flush();
  }

  delay(10);  // increased from 1 — 1ms is too fast and can cause serial buffer issues
}

// Consolidated print functions into one
void printPedestalData(String data[]) {
  Serial.print(data[0]);  // RFID
  Serial.print(" ");
  Serial.print(data[1]);  // mag data
}

bool checkMagStrength(float magStrength, int mux_addr, int port) {
  if (magStrength != 0.0) {
    //magData = String(strength);
    return magStrength > 20;
    //return magStrength;
  } else {
    return false;
    //return "[empty " + String(mux_addr) + " " + String(port) + "]";
  }
}

String readBytes(byte* uidByte, byte uidSize) {
  String idString = "";
  for (int i = 0; i < uidSize; i++) {
    idString += String(uidByte[i]);  // fixed: was (String)uidByte[i] — use String() instead
  }
  return idString;
}

// Fixed: Arduino doesn't support [int] as a type — use int* and pass size separately
bool contains(int* array, int size, int val) {
  for (int x = 0; x < size; x++) {
    if (array[x] == val) return true;
  }
  return false;
}