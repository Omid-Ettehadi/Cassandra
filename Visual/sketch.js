/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-1a8840fa-907a-4ac5-9c35-593f16e41599';
var subKey = 'sub-c-01d14cd8-e853-11e8-b652-8a5de3112bb9';
var textChannelName = "textChannel";
var dataChannelName = "dataChannel";

// Serial Connection variables
var serial;       				// The serial port object
var serialPortName = "COM7";

var ardSend = {};				// JSON variable

var servoAngle1;     				// Values for servo motors 
var servoAngle2;

var sendRate = 100;              		// Rate of sending data to arduino

// Input variables
var mainText;
var trueCount, falseCount;

/* -------------------- Functions -------------------- */
function setup() 
{
    getAudioContext().resume();
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    // Initialize pubnub
    dataServer = new PubNub(
    {
        publish_key   : pubKey,
        subscribe_key : subKey,  
        ssl: true
    });
    
    // Attach callbacks to the pubnub object to handle messages and connections
    dataServer.addListener({ message: readIncoming, presence: whoisconnected })
    dataServer.subscribe({channels: [textChannelName,dataChannelName]});

    // Setting up the serial port
    serial = new p5.SerialPort();		// Create the serial port object
    serial.open(serialPortName);		// Open the serialport
    serial.on('open',ardCon);			// Open the socket connection
    setInterval(sendData,sendRate);		// Setting the send rate     
	
    trueCount = 0;
    falseCount = 0;
}

function draw() 
{
    // Do nothing
}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
}

/* -------------------- PubNub -------------------- */
// Send data to pubnub
function sendTheMessage()
{
	
}

// Read data from pubnub
function readIncoming(inMessage) 
{
    if(inMessage.channel == textChannelName)
    {
	trueCount = 0;
        falseCount = 0;
	background(255);
	noStroke();
	fill(0);
	textSize(30);
	text(inMessage.message.theMessage, windowWidth * (1/4), windowHeight * (1/4), windowWidth * (2/4), windowHeight * (2/4));
    } 

    if(inMessage.channel == dataChannelName)
    {
	if ( inMessage.message.theMessage == true )
        {
            trueCount++;
            console.log("True Count: " + trueCount);
        } else if ( inMessage.message.theMessage == false )
        {
            falseCount++;
            console.log("False Count: " + falseCount);
        }
    }
}

function whoisconnected(connectionInfo)
{

}

/* -------------------- Arduino -------------------- */
// Send data to Arduino
function sendData()
{
    ardSend.servo1 = servoAngle1;				// Add the value to the servo1 parameter on the json object
    ardSend.servo2 = servoAngle2;				// Add the value to the servo2 parameter on the json object

    var sendString = JSON.stringify(ardSend);   		// Convert the json to a string  
    console.log(sendString)

    serial.write(sendString);                  		   	// Send it over the serial port    
    serial.write('\n');                           		// Write a new line character
}

function ardCon()
{
    console.log("connected to the Arduino Micro! Let's Go");
}