/*
 * Cassandra
 * 
 * Created 18 Nov 2018
 * by April De Zen, & Veda Adnani, & Omid Ettehadi
 */
 
 // Libraries
#include <ArduinoJson.h>
#include <FastLED.h>
#include <Servo.h>

// Pin Definition
#define SERVO1pin 12
#define SERVO2pin 11
#define LEDpin 10

// LED Strip
#define NUM_LEDS 60

// Objects
Servo myServo1; 
Servo myServo2;
CRGB leds[NUM_LEDS]; 

// Variables
int angleServo1;
int angleServo2;

// Sampling
unsigned long lastRead;
const int sampleRate = 25;

void setup()
{
  // Initialize serial communications
  Serial.begin(9600);

  // Assign Pins
  pinMode(LEDpin,OUTPUT);
  myServo1.attach(SERVO1pin);
  myServo2.attach(SERVO2pin);

  // Initialize all variables
  angleServo1 = 0;
  angleServo2 = 0;

  // Setup LED Strip
  FastLED.addLeds<WS2812, LEDpin, GRB>(leds, NUM_LEDS);
}

void loop() 
{
  if (millis() - lastRead >= sampleRate)
  {
    DynamicJsonBuffer messageBuffer(200);                 // Buffer for the JSON object        
    JsonObject& p5Read = messageBuffer.parse(Serial);     // JsonObject attaches to incoming serial message
    
    angleServo1 = p5Read["servo1"];                       // Assign "servo1" from the json object to angleServo1
    angleServo2 = p5Read["servo2"];                       // Assign "servo2" from the json object to angleServo2
  
    myServo1.write(angleServo1);                          // Set the angleServo1 to the myServo1
    myServo2.write(angleServo2);                          // Set the angleServo2 to the myServo2

    /*
    // LED Strip
    // Going white and then off
    for (int i = 0; i <= 60; i++)
    {
      leds[i] = CRGB ( 255, 255, 255);
      FastLED.show();
    }
    for (int i = 60; i >= 0; i--) 
    {
      leds[i] = CRGB ( 0, 0, 0);
      FastLED.show();
    }
    */
    
    lastRead = millis();
  }
}
