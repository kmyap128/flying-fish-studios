#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <SparkFun_TMAG5273_Arduino_Library.h>
#include <SparkFun_I2C_Mux_Arduino_Library.h>

#define NUMBER_OF_SENSORS 16
#define NUMBER_OF_MAGS 12
#define NUMBER_OF_RFID 4

#define RST_PIN 9
#define SS_PIN_1 4;
#define SS_PIN_2 5;
#define SS_PIN_3 6;
#define SS_PIN_4 7;

TMAG5273 sensors[NUMBER_OF_MAGS];
uint8_t i2cAddress = TMAG5273_I2C_ADDRESS_INITIAL;
int magToMuxNum = { 1, 2, 3, 5, 6, 7 }

MFRC522 mfrc522[NUMBER_OF_RFID] = { MFRC522(SS_PIN_1, RST_PIN), MFRC522(SS_PIN_2, RST_PIN), MFRC522(SS_PIN_3, RST_PIN), MFRC522(SS_PIN_4, RST_PIN) };

String pedestal1RFID;
String pedestal2RFID;
String pedestal3RFID;
String pedestal4RFID;

String pedestal1Data[2] = {};
String pedestal2Data[2] = {};
String pedestal3Data[2] = {};
String pedestal4Data[2] = {};

void setup() {
  Serial.begin(115200);
  Wire.begin();
  SPI.begin();

  for (byte x = 0; x < 8; x++) {
    disableMuxPort(x, 0x70);
    disableMuxPort(x, 0x71);
  }

  int magIndex = 0;
  for (byte x = 0; x < NUMBER_OF_SENSORS; x++) {
    int threshold = NUMBER_OF_SENSORS / 2;
    int index = magToMuxNum[x];
    uint8_t mux_addr;
    if (x < threshold) {
      mux_addr = 0x70;
    } else {
      mux_addr = 0x71;
    }
    enableMuxPort(index, mux_addr);
    if (contains(magToMuxNum, x % threshold)) {
      sensors[magIndex] = TMAG5273 sensor;
      if (sensors[magIndex].begin(i2cAddress, Wire) == 1) {
        serial.println("Begin");
      } else {
        Serial.print("FAIL ");
        Serial.println(x);
        while(1);
      }
      magIndex++;
    } else {
      int index = x / 4;
      SPI.begin();
      mfrc522[index].PCD_Init();
      for(byte i = 0; i < 6; i++) {
        key.keyBite[i] = 0xFF;
      }
    }

    disableMuxPort(x);
  }
}

void loop() {
  int magIndex = 0;
  for (byte x = 0; x < NUMBER_OF_SENSORS; x++) {
    if (contains(magToMuxNum, x % threshold)) {
      int index = magToMuxNum[magIndex];
    uint8_t mux_addr;
    if (x < threshold) {
      mux_addr = 0x70;
    } else {
      mux_addr = 0x71;
    }
      enableMuxPort(x, mag_addr);
      if (sensors[magIndex].getMagneticChannel() != 0) {
        float magX = sensors[magIndex].getXData();
        float magY = sensors[magIndex].getYData();
        float magZ = sensors[magIndex].getZData();

        Serial.print(sensors[magIndex].getI2CAddress());
        Serial.print(": ");
        Serial.print(magX);
        Serial.print(" ");
        Serial.print(magY);
        Serial.print(" ");
        Serial.print(magZ);
        Serial.print(" ");
        magIndex++;
      }
    } else {
      int index = x / 4;
      if (mfrc522[index].PICC_IsNewCardPresent()) {
        mfrc522[index].PICC_ReadCardSerial();
        if (index == 0) {
          pedestal1Data[0] = readBytes(mfrc522[index].uid.uidByte, mfrc522[index].uid.size)
        } else if (index == 1) {
          pedestal2Data[0] = readBytes(mfrc522[index].uid.uidByte, mfrc522[index].uid.size)
        } else if (index == 2) {
          pedestal3Data[0] = readBytes(mfrc522[index].uid.uidByte, mfrc522[index].uid.size)
        } else if (index == 3) {
          pedestal4Data[0] = readBytes(mfrc522[index].uid.uidByte, mfrc522[index].uid.size)
        }
      }
    }

    disableMuxPort(x, mux_addr);
  }

  printPedestal1Data();
  Serial.print(" | ");
  printPedestal2Data();
  Serial.print(" | ");
  printPedestal3Data();
  Serial.print(" | ");
  printPedestal4Data();
  Serial.println();

  delay(1);
}

String readBytes(byte *uidByte, byte uidSize) {
  String idString = "";
  for (int i = 0; i < uidSize; i++) {
    idString += (String)uidByte[i];
  }

  return idString;
}

void printPedestal1Data() {
  Serial.print("Pedestal 1: ");
  Serial.print(pedestal1Data[0]);
  Serial.print(" ");
  Serial.print(pedestal1Data[1]);
}

void printPedestal2Data() {
  Serial.print("Pedestal 2: ");
  Serial.print(pedestal2Data[0]);
  Serial.print(" ");
  Serial.print(pedestal2Data[1]);
}

void printPedestal3Data() {
  Serial.print("Pedestal 3: ");
  Serial.print(pedestal3Data[0]);
  Serial.print(" ");
  Serial.print(pedestal3Data[1]);
}

void printPedestal4Data() {
  Serial.print("Pedestal 4: ");
  Serial.print(pedestal4Data[0]);
  Serial.print(" ");
  Serial.print(pedestal4Data[1]);
}

bool contains([int] array, int val) {
  for (int x = 0; x < array.length; x++) {
    if (array[x] == val) {
      return true;
    }
  }
  return false;
}