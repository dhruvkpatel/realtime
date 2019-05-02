// Design for the Robotic platform
// ref: https://playground.arduino.cc/ComponentLib/Servo/
// ref: servo and data type control from serial monitor: https://jingyan.baidu.com/article/6181c3e0a6e75b152ef15399.html
#include <Servo.h>
#include <string.h>
#include <stdio.h>
#define LED_PIN 
// #define SOFT_START_CONTROL_PIN 12
#define SERVO_PIN_1 10
#define SERVO_PIN_2 11
#define LED_PIN 2


Servo sev_1; 
Servo sev_2;

const int start_pos_1 = 80;
const int start_pos_2 = 73;

void setup() {

  Serial.begin(9600);    
  sev_1.attach(SERVO_PIN_1);
  sev_1.write(start_pos_1);
  delay(15);
  sev_2.attach(SERVO_PIN_2);
  sev_2.write(start_pos_2); 
  delay(15);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  delay(100);

  digitalWrite(LED_PIN, HIGH);
}

void loop() {

  int servo_array[2]; 
  int flag_stop = 0; 
  int myTimeout = 5;
  Serial.setTimeout(myTimeout);

  if(Serial.available()){

    String message= Serial.readString();
//    Serial.println(message);

    int commaPosition;
    int idx = 0; 
    int str_fg;
    String char_fg;
    char g;

    bool validMessage = true;
    for (int i = 0; i < 3; i++) {
      commaPosition = message.indexOf(',');

      if (commaPosition == -1 && i != 2) {
        validMessage = false;
      }
      
      if (i != 0) {
        int value = message.substring(0, commaPosition).toInt();
        servo_array[i - 1] = value;
      }
      message = message.substring(commaPosition + 1, message.length());
    }

    int servo_angle_1 = servo_array[0];
    int servo_angle_2 = servo_array[1]; 
     
     sev_1.write(servo_angle_1);
     delay(15);
     sev_2.write(servo_angle_2); 
     delay(15); 
   }

   else {
    delay(50);   
   }

   int servo_angle_1 = sev_1.read();
   int servo_angle_2 = sev_2.read();
   Serial.print("f,");
   Serial.print(servo_angle_1);
   Serial.print(",");
   Serial.print(servo_angle_2);
   Serial.print("\n");

}
      
//      int sev_currentangle_1 = sev_1.read();
//      int sev_currentangle_2 = sev_2.read();
//      Serial.print("f");
//      Serial.print(",");
//      Serial.print(sev_currentangle_1);
//      Serial.print(",");
//      Serial.print(sev_currentangle_2);
//      Serial.print("\n");
 
