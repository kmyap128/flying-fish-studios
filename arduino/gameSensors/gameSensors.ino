#include <Wire.h>
#include "SparkFun_TMAG5273_Arduino_Library.h"

#define NUMBER_OF_SENSORS 16
#define NUMBER_OF_MAGS 12
#define NUBMER_OF_RFID 4

TMAG5273 sensor[NUMBER_OF_MAGS];

void setup() {
    Serial.begin(9600);
    Wire.begin();

    for (byte x = 0; x < 16; x++) {
        disableMuxPort(x);
    }

    for (byte x = 0; x < NUMBER_OF_SENSORS; x++) {
        enableMuxPort(x);
        //initialize sensor
        disableMuxPort(x);
    }
}

void loop() {
    for (byte x = 0; x < NUMBER_OF_SENSORS; x++) {
        enableMuxPort(x);

        if (/* sensor is available */) {
            // read the sensor data

            // print the data output
        }

        disableMuxPort(x);
    }

    delay(1);
}