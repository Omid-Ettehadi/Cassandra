/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-1a8840fa-907a-4ac5-9c35-593f16e41599';
var subKey = 'sub-c-01d14cd8-e853-11e8-b652-8a5de3112bb9';
var textChannelName = "textChannel";
var dataChannelName = "dataChannel";

// Serial Connection variables
var serial;       						// The serial port object
var serialPortName = "COM7";

var ardSend = {};						// JSON variable

var servoAngle1;     					// Values for servo motors 
var servoAngle2;

var sendRate = 100;              		// Rate of sending data to arduino

// Input variables
var pageNumber;
var trueCount, falseCount;
var t, track;

// Pages/Images
var disclaimer;
var initialPage, logo;
var header;
var voteNow;
var article1, article2, article3, article4, article5;
var resArticle1, resArticle2, resArticle3, resArticle4, resArticle5;


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
    dataServer.subscribe({channels: [textChannelName,dataChannelName]});

    // Setting up the serial port
    /*serial = new p5.SerialPort();		// Create the serial port object
    serial.open(serialPortName);		// Open the serialport
    serial.on('open',ardCon);			// Open the socket connection
    setInterval(sendData,sendRate);		// Setting the send rate   */  
	
	// Initialize variables
    pageNumber = 0;
	trueCount = 0;
    falseCount = 0;
	
	t = second();
	track = 0;
	
	// --------------- Pages --------------- //
	// Disclaimer
	disclaimer = createImg("images/Disclaimer.png");
	disclaimer.size(1200, 134);
	disclaimer.position((windowWidth/2) - (disclaimer.width/2), (windowHeight/2) - (disclaimer.height/2));
	
	// Initial Page
	initialPage = createImg("images/Background.gif");
	initialPage.size(windowWidth, windowHeight);
	initialPage.position(0,0);
	initialPage.hide();
	
	logo = createImg("images/Logo.png");
	logo.size(550,95);
	logo.position((windowWidth/2) - (logo.width/2), (windowHeight/2) - (logo.height/2));
	logo.hide();
	
	header = createImg("images/Header.png");
	header.size(364,33);
	header.position(50, 50);
	header.hide();
	
	article1 = createImg("images/Article-1.png");
	article1.size(1500,856);
	article1.position((windowWidth/2) - (article1.width/2), (windowHeight/2) - (article1.height/2));
	article1.hide();
	
	resArticle1 = createImg("images/Answer-1.png");
	resArticle1.size(1500,856);
	resArticle1.position((windowWidth/2) - (resArticle1.width/2), (windowHeight/2) - (resArticle1.height/2));
	resArticle1.hide();
	
	article2 = createImg("images/Article-2.png");
	article2.size(1500,856);
	article2.position((windowWidth/2) - (article2.width/2), (windowHeight/2) - (article2.height/2));
	article2.hide();
	
	resArticle2 = createImg("images/Answer-2.png");
	resArticle2.size(1500,856);
	resArticle2.position((windowWidth/2) - (resArticle2.width/2), (windowHeight/2) - (resArticle2.height/2));
	resArticle2.hide();
	
	article3 = createImg("images/Article-3.png");
	article3.size(1500,856);
	article3.position((windowWidth/2) - (article3.width/2), (windowHeight/2) - (article3.height/2));
	article3.hide();
	
	resArticle3 = createImg("images/Answer-3.png");
	resArticle3.size(1500,856);
	resArticle3.position((windowWidth/2) - (resArticle3.width/2), (windowHeight/2) - (resArticle3.height/2));
	resArticle3.hide();
	
	article4 = createImg("images/Article-4.png");
	article4.size(1500,856);
	article4.position((windowWidth/2) - (article4.width/2), (windowHeight/2) - (article4.height/2));
	article4.hide();
	
	resArticle4 = createImg("images/Answer-4.png");
	resArticle4.size(1500,856);
	resArticle4.position((windowWidth/2) - (resArticle4.width/2), (windowHeight/2) - (resArticle4.height/2));
	resArticle4.hide();
	
	article5 = createImg("images/Article-5.png");
	article5.size(1500,856);
	article5.position((windowWidth/2) - (article5.width/2), (windowHeight/2) - (article5.height/2));
	article5.hide();
	
	resArticle5 = createImg("images/Answer-5.png");
	resArticle5.size(1500,856);
	resArticle5.position((windowWidth/2) - (resArticle5.width/2), (windowHeight/2) - (resArticle5.height/2));
	resArticle5.hide();
	
	voteNow = createImg("images/Vote.png");
	voteNow.size(250,250);
	voteNow.position((windowWidth/2) + (article1.width/2) - (voteNow.width/2) , (windowHeight/2) + (article1.height/2) - (voteNow.height/2));
	voteNow.hide();
	
}

function draw() 
{
    if ( track == 0 )
	{
		if (second() - t > 8 || t - second() > 59 - 8 )
		{
			track = 1;
			disclaimer.hide();
			initialPage.show();
			logo.show();
		}
	}
	else if ( pageNumber == 1)
	{
		initialPage.hide();
		logo.hide();
		header.show();
		article1.show();
		voteNow.show();
	}
	else if ( pageNumber == 2)
	{
		article1.hide();
		resArticle1.show();
		voteNow.hide();
	}
	else if ( pageNumber == 3)
	{
		resArticle1.hide();
		article2.show();
		voteNow.show();
	}
	else if ( pageNumber == 4)
	{
		article2.hide();
		resArticle2.show();
		voteNow.hide();
	}
	else if ( pageNumber == 5)
	{
		resArticle2.hide();
		article3.show();
		voteNow.show();
	}
	else if ( pageNumber == 6)
	{
		article3.hide();
		resArticle3.show();
		voteNow.hide();
	}
	else if ( pageNumber == 7)
	{
		resArticle3.hide();
		article4.show();
		voteNow.show();
	}
	else if ( pageNumber == 8)
	{
		article4.hide();
		resArticle4.show();
		voteNow.hide();
	}
	else if ( pageNumber == 9)
	{
		resArticle4.hide();
		article5.show();
		voteNow.show();
	}
	else if ( pageNumber == 10)
	{
		article5.hide();
		resArticle5.show();
		voteNow.hide();
	}
	else if ( pageNumber == 11)
	{
		
	}
}

function windowResized() 
{
    /*resizeCanvas(windowWidth, windowHeight);
	background(0);
	
	disclaimer.size(700, 78);
	disclaimer.position((windowWidth/2) - (disclaimer.width/2), (windowHeight/2) - (disclaimer.height/2));
	
	initialPage.size(windowWidth, windowHeight);
	initialPage.position(0,0);
	logo.size(550,95);
	logo.position((windowWidth/2) - (logo.width/2), (windowHeight/2) - (logo.height/2));
	
	article1.size(1500,856);
	article1.position((windowWidth/2) - (article1.width/2), (windowHeight/2) - (article1.height/2));*/
	
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
		pageNumber++;
		trueCount = 0;
		falseCount = 0;
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

/* -------------------- Arduino -------------------- 
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
}*/