/*
 * Cassandra
 * 
 * Created 18 Nov 2018
 * by April De Zen, & Veda Adnani, & Omid Ettehadi
 */
 
 // Libraries
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include <Servo.h>

// Pin Definition
#define SERVO2pin 12
#define SERVO1pin 11
#define LEDpin 10

// LED Strip
#define NUM_LEDS 60

// Objects
Servo myServo1; 
Servo myServo2;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(60, LEDpin, NEO_GRB + NEO_KHZ800);

// Variables
int angleServo1;
int angleServo2;

int track;

// Sampling
unsigned long lastRead;
const int sampleRate = 50;


void setup()
{
  // Initialize serial communications
  Serial.begin(9600);

  // Assign Pins
  pinMode(LEDpin,OUTPUT);
  myServo1.attach(SERVO1pin);
  myServo2.attach(SERVO2pin);

  // Initialize all variables
  angleServo1 = 180;
  angleServo2 = 180;

  track = 0;

  myServo1.write(angleServo1);
  myServo2.write(angleServo2);
  
  // Setup LED Strip
  strip.begin();
  strip.setBrightness(100);
  strip.show();

  delay(2000);
}

void loop() 
{
  if (millis() - lastRead >= sampleRate)
  {
    if ( track == 0 )
    {
      for ( int j = 0; j < 60; j++)
      {
        strip.setPixelColor(j, 0, 0, 255);
        strip.show();
      }
      track = 1;
    }
    else if ( track == 1) 
    {
      for ( int j = 60; j >= 0; j--){
        strip.setPixelColor(j, 0, 0, 0);
        strip.show();
      }
      track = 0;      
    }
          
    int i = 0;
    DynamicJsonBuffer messageBuffer(256);                 // Buffer for the JSON object        
    JsonObject& p5Read = messageBuffer.parse(Serial);     // JsonObject attaches to incoming serial message

    angleServo1 = p5Read["servo1"];                       // Assign "servo1" from the json object to angleServo1
    angleServo2 = p5Read["servo2"];                       // Assign "servo2" from the json object to angleServo2
    
    if ( angleServo1+angleServo2 != 180 )
    {
      angleServo1 = 180;
      angleServo2 = 180;
    }

    Serial.print(angleServo1);
    
      myServo1.write(angleServo1);                          // Set the angleServo1 to the myServo1
      myServo2.write(angleServo2);                          // Set the angleServo2 to the myServo2

     if ( angleServo1+angleServo2 == 180 )
    {
      for ( int j = 0; j < 60; j++){
          strip.setPixelColor(j, 0, 0, 255);
          strip.show();
        }
        i = 2000;
      }
    
    lastRead = millis() + i;
  }
}
