/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-1a8840fa-907a-4ac5-9c35-593f16e41599';
var subKey = 'sub-c-01d14cd8-e853-11e8-b652-8a5de3112bb9';
var textChannelName = "textChannel";

// Variables
var index;          // Keep track of stage
var mainText;       // Message to be sent
var nextButton;     // Next button

/* -------------------- Functions -------------------- */
function setup() 
{
    getAudioContext().resume();
    createCanvas(windowWidth, windowHeight);
    background(0);
    
    // Initialize pubnub
    dataServer = new PubNub(
    {
        publish_key   : pubKey,
        subscribe_key : subKey,  
        ssl: true
    });
    
    // Attach callbacks to the pubnub object to handle messages and connections
    dataServer.addListener({ message: readIncoming, presence: whoisconnected })
    dataServer.subscribe({channels: [textChannelName]});

    // Next Text Button    
    nextButton = createButton('Next Text');
    nextButton.size((windowWidth/2),(windowHeight/3));
    nextButton.position((windowWidth * (1/2)) - (nextButton.width/2) ,(windowHeight * (3/4)) - (nextButton.height/2));
    nextButton.mousePressed(buttonFunction);
    
	// Initialize variables
    index = 0;
    buttonFunction();
}

function draw() 
{
    background(0);
    
    // Show the message 
    textSize(30);
	fill(255);
	textAlign(CENTER);
    text(mainText, windowWidth * (1/4), windowHeight * (1/4), windowWidth * (2/4), windowHeight * (2/4));
}

// Base on index send a command
function buttonFunction()
{
    if ( index == 0 ) 
    {
        mainText = "0";
        sendTheMessage();
        index++;
        
    } else if ( index == 1 )
    {
        mainText = "1";
        sendTheMessage();
        index++;
    } else if ( index == 2 )
    {
        mainText = "2";
        sendTheMessage();
        index++;
    } else if ( index == 3 )
    {
        mainText = "3";
        sendTheMessage();
        index++;
    } else if ( index == 4 )
    {
        mainText = "4";
        sendTheMessage();
        index++;
    } else if ( index == 5 )
    {
        mainText = "5";
        sendTheMessage();
        index++;
    } else if ( index == 6 )
    {
        mainText = "6";
        sendTheMessage();
        index++;
    } else if ( index == 7 )
    {
        mainText = "7";
        sendTheMessage();
        index++;
    } else if ( index == 8 )
    {
        mainText = "8";
        sendTheMessage();
        index++;
    } else if ( index == 9 )
    {
        mainText = "9";
        sendTheMessage();
        index++;
    } else if ( index == 10 )
    {
        mainText = "10";
        sendTheMessage();
        index++;
    } else if ( index == 11 )
    {
        mainText = "11";
        sendTheMessage();
        index++;
    } else if ( index == 12 )
    {
        mainText = "12";
        sendTheMessage();
        index++;
    } else 
    {
        // Do nothing
    }
}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
	nextButton.size((windowWidth/2),(windowHeight/3));
    nextButton.position((windowWidth * (1/2)) - (nextButton.width/2) ,(windowHeight * (3/4)) - (nextButton.height/2));
}

/* -------------------- PubNub -------------------- */
// Send data to pubnub
function sendTheMessage()
{
    dataServer.publish(
    {
        channel: textChannelName,
        message: 
        {
            theMessage: mainText,
        }
    });
}

// Read data from pubnub
function readIncoming(inMessage) {}

function whoisconnected(connectionInfo) {}