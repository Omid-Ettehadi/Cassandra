/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-1a8840fa-907a-4ac5-9c35-593f16e41599';
var subKey = 'sub-c-01d14cd8-e853-11e8-b652-8a5de3112bb9';
var textChannelName = "textChannel";

// Input variables
var index;
var mainText;
var nextButton;

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
    dataServer.subscribe({channels: [textChannelName]});

    // Next Text Button    
    nextButton = createButton('Next Text');
    nextButton.size(100,50);
    nextButton.position((windowWidth * (1/2)) - 50 ,(windowHeight * (3/4)) - 25);
    nextButton.mousePressed(buttonFunction);
    
    index = 0;
    buttonFunction();  
}

function draw() 
{
    background(255);
    
    // Show the message 
    textSize(30);
    text(mainText, windowWidth * (1/4), windowHeight * (1/4), windowWidth * (2/4), windowHeight * (2/4));
}

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
    } else 
    {
        // Do nothing
    }
}

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
function readIncoming(inMessage) 
{
    
}

function whoisconnected(connectionInfo)
{

}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
    nextButton.position((windowWidth * (1/2)) - 50 ,(windowHeight * (3/4)) - 25);
}