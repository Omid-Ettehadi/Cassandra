/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-7b078ffc-490a-45f5-9ab4-67d0fe24506f';
var subKey = 'sub-c-3f1bc6ee-24bd-11e9-b742-22d0c008a4f0';
var adminChannelName = "adminChannel";

// Variables
var ExperimentStatus = 0;	// Message to be sent
var timer = 30;			// Timer's time
var nextButton;			// Next button


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
    dataServer.addListener({ message: readIncoming })
    dataServer.subscribe({channels: [adminChannelName]});

    // Next Text Button    
    nextButton = createButton('Next Text');
    nextButton.size((windowWidth/2),(windowHeight/3));
    nextButton.position((windowWidth * (1/2)) - (nextButton.width/2) ,(windowHeight * (3/4)) - (nextButton.height/2));
    nextButton.mousePressed(buttonFunction);
	
	// Initialize Timer	
	setInterval(timerFunction, 1000);					// Run timerFunction every second
	//sendTheMessage(0);
}

function draw() 
{
    background(0);
    
    // Show the message 
    textSize(windowHeight/20);
	fill(255);
	textAlign(CENTER);
	
    text(ExperimentStatus, windowWidth * (1/4), windowHeight * (1/4), windowWidth * (2/4), windowHeight * (2/4));
	
	if ( ExperimentStatus == 2 || ExperimentStatus == 4 || ExperimentStatus == 6 || ExperimentStatus == 8 || ExperimentStatus == 10 || ExperimentStatus == 12  )
	{
		// Timer
		// When timer is over, automatically go to the thank you page
		if ( timer <= 0 )
		{
			sendTheMessage(ExperimentStatus);
			//timer = 5;
		} 
		// else start the count down
		else {
			if ( timer <= 9 ) {
				text( "0:0" + timer + " s" , 0,windowHeight/20,windowWidth,windowHeight/2);
			} else {
				text( "0:" + timer + " s" , 0,windowHeight/20,windowWidth,windowHeight/2);
			}
		}
	}
}

// Decrease timer variable by 1
function timerFunction(){
	timer = timer - 1;
}

// Base on index send a command
function buttonFunction()
{
	timer = 30;
    sendTheMessage(ExperimentStatus);
}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
	nextButton.size((windowWidth/2),(windowHeight/3));
    nextButton.position((windowWidth * (1/2)) - (nextButton.width/2) ,(windowHeight * (3/4)) - (nextButton.height/2));
}

/* -------------------- PubNub -------------------- */
// Send data to pubnub
function sendTheMessage( command )
{
    dataServer.publish(
    {
        channel: adminChannelName,
        message: 
        {
            theMessage: command,
        }
    });
	
	ExperimentStatus++;
}

// Read data from pubnub
function readIncoming(inMessage) {}