#include <Wire.h>
#include <SparkFun_TMAG5273_Arduino_Library.h>
#include <SparkFun_I2C_Mux_Arduino_Library.h>
#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN 9
#define SS_PIN_1 4

TMAG5273 sensor1;
TMAG5273 sensor2;
uint8_t i2cAddress = TMAG5273_I2C_ADDRESS_INITIAL;

MFRC522 rfid1(SS_PIN_1, RST_PIN);
MFRC522::MIFARE_Key key;

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(115200);

  for (byte x = 0 ; x <= 7 ; x++)
  {
    disableMuxPort(x);
  }

  enableMuxPort(0);
  SPI.begin();
  rfid1.PCD_Init();

  for(byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  disableMuxPort(0);

  enableMuxPort(1);
  if(sensor1.begin(i2cAddress, Wire) == 1) {
    Serial.println("Begin");
  } else {
    Serial.println("FAIL 1");
    while(1);
  }
  disableMuxPort(1);

  enableMuxPort(2);
  if(sensor2.begin(i2cAddress, Wire) == 1) {
    Serial.println("Begin");
  } else {
    Serial.println("FAIL 2");
    while(1);
  }
  disableMuxPort(2);
}

void loop() {
  enableMuxPort(0);
  if (rfid1.PICC_IsNewCardPresent()) {
  rfid1.PICC_ReadCardSerial();
  Serial.print(readBytes(rfid1.uid.uidByte, rfid1.uid.size));
  Serial.print(" ");
  disableMuxPort(0);
  }

  enableMuxPort(1);
  if(sensor1.getMagneticChannel() != 0) {
    float magX = sensor1.getXData();
    float magY = sensor1.getYData();
    float magZ = sensor1.getZData();

    Serial.print("Sensor 1: ");
    Serial.print(magX);
    Serial.print(" ");
    Serial.print(magY);
    Serial.print(" ");
    Serial.print(magZ);
  }
  disableMuxPort(1);
  enableMuxPort(2);
  if(sensor2.getMagneticChannel() != 0) {
    float magX = sensor2.getXData();
    float magY = sensor2.getYData();
    float magZ = sensor2.getZData();

    Serial.print(" | Sensor 2: ");
    Serial.print(magX);
    Serial.print(" ");
    Serial.print(magY);
    Serial.print(" ");
    Serial.print(magZ);
    Serial.println();
  }
  disableMuxPort(2);

  delay(1);
}

String readBytes(byte *uidByte, byte uidSize) {
  String idString = "";
  for (int i = 0; i < uidSize; i++) {
    idString += (String)uidByte[i];
  }

  return idString;
}
