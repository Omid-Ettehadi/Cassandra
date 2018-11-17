/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-1a8840fa-907a-4ac5-9c35-593f16e41599';
var subKey = 'sub-c-01d14cd8-e853-11e8-b652-8a5de3112bb9';
var textChannelName = "textChannel";
var dataChannelName = "dataChannel";

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
    
    trueCount = 0;
    falseCount = 0;
}

function draw() 
{
    // Do nothing
}

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

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
}