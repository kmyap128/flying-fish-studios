const int sta3RFIDPin = 1;
const int sta3Pedestal1Pin = 2;
const int sta3Pedestal2Pin = 3;
const int sta3Pedestal3Pin = 4;

const int sta4RFIDPin = 6
const int sta4Pedestal1Pin = 7;
const int sta4Pedestal2Pin = 8;
const int sta4Pedestal3Pin = 9;

void setup() {
  Serial.begin(9600);

  pinMode(sta3RFIDPin, INPUT);
  pinMode(sta3Pedestal1Pin, INPUT_PULLUP);
  pinMode(sta3Pedestal2Pin, INPUT_PULLUP);
  pinMode(sta3Pedestal3Pin, INPUT_PULLUP);

  pinMode(sta4RFIDPin, INPUT);
  pinMode(sta4Pedestal1Pin, INPUT_PULLUP);
  pinMode(sta4Pedestal2Pin, INPUT_PULLUP);
  pinMode(sta4Pedestal3Pin, INPUT_PULLUP);
}

void loop() {
  int sta3RFIDState = digitalRead(sta3RFIDPin);
  int sta3mag1State = digitalRead(sta3Pedestal1Pin);
  int sta3mag2State = digitalRead(sta3Pedestal2Pin);
  int sta3mag3State = digitalRead(sta3Pedestal3Pin);

  int sta4RFIDState = digitalRead(sta4RFIDPin);
  int sta4mag1State = digitalRead(sta4Pedestal1Pin);
  int sta4mag2State = digitalRead(sta4Pedestal2Pin);
  int sta4mag3State = digitalRead(sta4Pedestal3Pin);

  Serial.print("Pedestal3: ")

    if (sta3mag1State == LOW) {
      Serial.print("1");
    } else if (sta3mag2State == LOW) {
      Serial.print("2");
    } else if (sta3mag3State == LOW) {
      Serial.print("3");
    } else {
    Serial.print("0");
  }

  Serial.print("Pedestal4: ")

    if (sta4mag1State == LOW) {
      Serial.print("1");
    } else if (sta4mag2State == LOW) {
      Serial.print("2");
    } else if (sta4mag3State == LOW) {
      Serial.print("3");
    } else {
    Serial.print("0");
  }

  Serial.print(" | ");
  
  Serial.println();
}