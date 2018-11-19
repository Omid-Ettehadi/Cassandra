/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-1a8840fa-907a-4ac5-9c35-593f16e41599';
var subKey = 'sub-c-01d14cd8-e853-11e8-b652-8a5de3112bb9';
var textChannelName = "textChannel";
var dataChannelName = "dataChannel";

// Input variables
var mainText;
var trueButton, falseButton;

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

    // Buttons   
    trueButton = createButton('True');
    trueButton.size(100,50);
    trueButton.position((windowWidth * (1/2)) - 150 ,(windowHeight * (3/4)) - 25);
    trueButton.mousePressed(function() { buttonFunction(true);});
	
	falseButton = createButton('False');
    falseButton.size(100,50);
    falseButton.position((windowWidth * (1/2)) + 50 ,(windowHeight * (3/4)) - 25);
    falseButton.mousePressed(function() { buttonFunction(false);}); 
}

function draw() 
{
    // Do nothing
}

function buttonFunction(index)
{
	if ( index == true ) 
	{
		sendTheMessage(true);
		trueButton.hide();
		falseButton.hide();
	} else if ( index == false )
	{
		sendTheMessage(false);
		trueButton.hide();
		falseButton.hide();
	}
	
}

// Send data to pubnub
function sendTheMessage(index)
{
	dataServer.publish(
	{
		channel: dataChannelName,
		message: 
		{
			theMessage: index,
		}
	});
}

// Read data from pubnub
function readIncoming(inMessage) 
{
	if(inMessage.channel == textChannelName)
	{
		background(255);
		noStroke();
		fill(0);
		textSize(30);
		text(inMessage.message.theMessage, windowWidth * (1/4), windowHeight * (1/4), windowWidth * (2/4), windowHeight * (2/4));
		
		trueButton.show();
		falseButton.show();
	}
}

function whoisconnected(connectionInfo)
{

}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
    trueButton.position((windowWidth * (1/2)) - 150 ,(windowHeight * (3/4)) - 25);
	falseButton.position((windowWidth * (1/2)) + 50 ,(windowHeight * (3/4)) - 25);
}