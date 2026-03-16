const int sta1RFIDPin = 1;
const int sta1Pedestal1Pin = 2;
const int sta1Pedestal2Pin = 3;
const int sta1Pedestal3Pin = 4;

const int sta2RFIDPin = 6
const int sta2Pedestal1Pin = 7;
const int sta2Pedestal2Pin = 8;
const int sta2Pedestal3Pin = 9;

void setup() {
  Serial.begin(9600);

  pinMode(sta1RFIDPin, INPUT);
  pinMode(sta1Pedestal1Pin, INPUT_PULLUP);
  pinMode(sta1Pedestal2Pin, INPUT_PULLUP);
  pinMode(sta1Pedestal3Pin, INPUT_PULLUP);

  pinMode(sta2RFIDPin, INPUT);
  pinMode(sta2Pedestal1Pin, INPUT_PULLUP);
  pinMode(sta2Pedestal2Pin, INPUT_PULLUP);
  pinMode(sta2Pedestal3Pin, INPUT_PULLUP);
}

void loop() {
  int sta1RFIDState = digitalRead(sta1RFIDPin);
  int sta1mag1State = digitalRead(sta1Pedestal1Pin);
  int sta1mag2State = digitalRead(sta1Pedestal2Pin);
  int sta1mag3State = digitalRead(sta1Pedestal3Pin);

  int sta2RFIDState = digitalRead(sta2RFIDPin);
  int sta2mag1State = digitalRead(sta2Pedestal1Pin);
  int sta2mag2State = digitalRead(sta2Pedestal2Pin);
  int sta2mag3State = digitalRead(sta2Pedestal3Pin);

  Serial.print("Pedestal1: ")

    if (sta1mag1State == LOW) {
      Serial.print("1");
    } else if (sta1mag2State == LOW) {
      Serial.print("2");
    } else if (sta1mag3State == LOW) {
      Serial.print("3");
    } else {
    Serial.print("0");
  }

  Serial.print("Pedestal2: ")

    if (sta2mag1State == LOW) {
      Serial.print("1");
    } else if (sta2mag2State == LOW) {
      Serial.print("2");
    } else if (sta2mag3State == LOW) {
      Serial.print("3");
    } else {
    Serial.print("0");
  }

  Serial.print(" | ");
  
  Serial.println();
}