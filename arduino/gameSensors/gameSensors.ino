#include <Wire.h>
#include <SPI.h>
#include <MFRC522.h>
#include <SparkFun_TMAG5273_Arduino_Library.h>

#define NUMBER_OF_SENSORS 3
#define NUMBER_OF_MAGS 2
#define NUMBER_OF_RFID 1

#define RST_PIN_1 9
#define SS_PIN 4

TMAG5273 sensors[NUMBER_OF_MAGS];
MFRC522 mfrc522[NUMBER_OF_RFID] = {MFRC522(SS_PIN, RST_PIN_1)};

String pedestal1RFID;
String pedestal2RFID;
String pedestal3RFID;
String pedestal4RFID;

// int pedestal1Pins[4] = {};
// int pedestal2Pins[4] = {};
// int pedestal3Pins[4] = {};
// int pedestal4Pins[4] = {};

String pedestal1Data[2] = {};
String pedestal2Data[2] = {};
String pedestal3Data[2] = {};
String pedestal4Data[2] = {};

void setup() {
    Serial.begin(9600);
    Wire.begin();
    SPI.begin();

    for (byte x = 0; x < 8; x++) {
        disableMuxPort(x);
    }

    for (byte x = 0; x < NUMBER_OF_SENSORS; x++) {
        enableMuxPort(x);
        //initialize sensor
        if (x < NUMBER_OF_RFID) {
            mfrc522[x].PCD_Init();
        } else {
            sensors[x - NUMBER_OF_RFID].begin(TMAG5273_I2C_ADDRESS_INITIAL, Wire);
        }
        disableMuxPort(x);
    }

    
}

void loop() {
    for (byte x = 0; x < NUMBER_OF_SENSORS; x++) {
        enableMuxPort(x);
        

        if (x < NUMBER_OF_RFID) {
            if (mfrc522[x].PICC_IsNewCardPresent()){
                mfrc522[x].PICC_ReadCardSerial();
                if (x == 0) {
                    pedestal1Data[0] = readBytes(mfrc522[x].uid.uidByte, mfrc522[x].uid.size);
                } else if (x == 1) {
                    pedestal2Data[0] = readBytes(mfrc522[x].uid.uidByte, mfrc522[x].uid.size);
                } else if (x == 2) {
                    pedestal3Data[0] = readBytes(mfrc522[x].uid.uidByte, mfrc522[x].uid.size);
                } else if (x == 3) {
                    pedestal4Data[0] = readBytes(mfrc522[x].uid.uidByte, mfrc522[x].uid.size);
                }
            }
        } else {
            // read the sensor data
            float magX = sensors[x - NUMBER_OF_RFID].getXData();
            float magY = sensors[x - NUMBER_OF_RFID].getYData();
            float magZ = sensors[x - NUMBER_OF_RFID].getZData();
            // print the data output
            Serial.print(sensors[x - NUMBER_OF_RFID].getI2CAddress());
            Serial.print(": ");
            Serial.print(magX);
            Serial.print(" ");
            Serial.print(magY);
            Serial.print(" ");
            Serial.print(magZ);
        }

        disableMuxPort(x);
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
        idString += (String) uidByte[i];
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