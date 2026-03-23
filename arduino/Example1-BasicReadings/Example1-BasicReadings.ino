/*
  Qwiic Mux Shield - PCA9548A/TCA9548A Basic Control
  By: Nathan Seidle
  SparkFun Electronics
  Date: March 30th, 2017
  License: MIT

  Reads two MMA8452Q accelerometers that have the same I2C address.
  You can read the MMA8452Q hookup guide and get the library from https://learn.sparkfun.com/tutorials/mma8452q-accelerometer-breakout-hookup-guide

  The PCA9548A is a mux. This means when you enableMuxPort(2) then the SDA and SCL lines of the master (Arduino)
  are connected to port 2. Whatever I2C traffic you do, such as accel.init() will be communicated to whatever
  sensor you have on port 2.

  Outputs two sets of XYZ acceleration

  Hardware Connections:
  Attach the Qwiic Mux Shield to your RedBoard or Uno.
  Plug two Qwiic MMA8452Q breakout boards into ports 0 and 1.
  Serial.print it out at 115200 baud to serial monitor.

*/

#include <Wire.h>
#include <SparkFun_MMA8452Q.h>

#define NUMBER_OF_SENSORS 2

MMA8452Q accel[NUMBER_OF_SENSORS]; //Create an array of MMA8452Q sensors

void setup()
{
  Serial.begin(115200);
  Serial.println("Qwiic Mux Shield Read Example");
  Wire.begin();

  //Disable all eight mux ports initially, then we can enable them one at a time
  for (byte x = 0 ; x <= 7 ; x++)
  {
    disableMuxPort(x);
  }

  //Initialize all the sensors
  for (byte x = 0 ; x < NUMBER_OF_SENSORS ; x++)
  {
    enableMuxPort(x); //Tell mux to connect to port X
    accel[x].init(); //Init the sensor connected to this port
    disableMuxPort(x);
  }

  Serial.println("Mux Shield online");
}

void loop()
{
  for (byte x = 0 ; x < NUMBER_OF_SENSORS ; x++)
  {
    enableMuxPort(x); //Tell mux to connect to this port, and this port only

    if (accel[x].available())
    {
      accel[x].read();

      Serial.print("Accel ");
      Serial.print(x);
      Serial.print(": ");
      Serial.print(accel[x].cx, 2);
      Serial.print(" ");
      Serial.print(accel[x].cy, 2);
      Serial.print(" ");
      Serial.print(accel[x].cz, 2);
      Serial.print(" ");

      Serial.println(); // Print new line every time.
    }

    disableMuxPort(x); //Tell mux to disconnect from this port
  }

  delay(1); //Wait for next reading
}
