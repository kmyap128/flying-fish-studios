
const int pedestal1Pin = 2;
const int pedestal2Pin = 3;
const int pedestal3Pin = 4;

void setup() {
  Serial.begin(9600);
  pinMode(pedestal1Pin, INPUT_PULLUP);
  pinMode(pedestal2Pin, INPUT_PULLUP);
  pinMode(pedestal3Pin, INPUT_PULLUP);
}

void loop() {
  int mag1State = digitalRead(pedestal1Pin);
  int mag2State = digitalRead(pedestal2Pin);
  int mag3State = digitalRead(pedestal3Pin);

    if (mag1State == LOW) {
      Serial.print("1");
    } else if (mag2State == LOW) {
      Serial.print("2");
    } else if (mag3State == LOW) {
      Serial.print("3");
    } else {
    Serial.print("0");
  }
  
  Serial.println();
}