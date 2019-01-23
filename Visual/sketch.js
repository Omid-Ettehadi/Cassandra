/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-1a8840fa-907a-4ac5-9c35-593f16e41599';
var subKey = 'sub-c-01d14cd8-e853-11e8-b652-8a5de3112bb9';
var textChannelName = "textChannel";
var dataChannelName = "dataChannel";
var isDataSentToPubNub;

// Serial Connection variables
var serial;       						// The serial port object
var serialPortName = "COM7";			// The serial port name
var ardSend = {};						// JSON variable for Arduino's data
var servoAngle1;     					// Value for servo motor 1 
var servoAngle2;						// Value for servo motor 2
var isDataSentToArduino;       			// Make sure data is only sent once

// Audio
var soundArticle1, soundArticle2,
    soundArticle3, soundArticle4,
	soundArticle5, soundArticle6;
var isSongPlayed;						// Make sure song is only played once

// Pages/Images
var disclaimer;
var initialPage, logo;
var header;
var voteNow;
var article1, article2,
    article3, article4,
	article5, article6;
var resArticle1, resArticle2,
    resArticle3, resArticle4,
	resArticle5, resArticle5;

// Votes
var trueCount, falseCount;
var percentage1, percentage2,
    percentage3, percentage4,
	percentage5, percentage6;
var percentageFalse1, percentageFalse2,
    percentageFalse3, percentageFalse4,
	percentageFalse5, percentageFalse6;
var accuracy;

// Timer variables
var timer, shouldCount, timeAtStart;

// Other
var pageNumber;

/* -------------------- Functions -------------------- */
function preload(){
	// Preload sounds
	soundArticle1 = loadSound("audios/Story-1.mp3");
	soundArticle2 = loadSound("audios/Story-2.mp3");
	soundArticle3 = loadSound("audios/Story-3.mp3");
	soundArticle4 = loadSound("audios/Story-4.mp3");
	soundArticle5 = loadSound("audios/Story-5.mp3");
	soundArticle6 = loadSound("audios/Story-6.mp3");
}
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
    serial = new p5.SerialPort();		// Create the serial port object
    serial.open(serialPortName);		// Open the serialport
    serial.on('open',ardCon);			// Open the socket connection
    //setInterval(sendData,sendRate);		// Setting the send rate   
	
	// Initialize variables
    pageNumber = 0;
	trueCount = 0;
    falseCount = 0;
	
	isDataSentToPubNub = 0
	isDataSentToArduino = 0;
	isSongPlayed = 0;
	
	// Initializing timer variables
	timer = 5;
	shouldCount = false;
	timeAtStart = second();
	setInterval(timerFunction, 1000);					// Run timerFunction every second
	
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
	
	article6 = createImg("images/Article-6.png");
	article6.size(1500,856);
	article6.position((windowWidth/2) - (article6.width/2), (windowHeight/2) - (article6.height/2));
	article6.hide();
	
	resArticle6 = createImg("images/Answer-6.png");
	resArticle6.size(1500,856);
	resArticle6.position((windowWidth/2) - (resArticle6.width/2), (windowHeight/2) - (resArticle6.height/2));
	resArticle6.hide();
	
	voteNow = createImg("images/Vote.png");
	voteNow.size(250,250);
	voteNow.position((windowWidth/2) + (article1.width/2) - (voteNow.width/2) , (windowHeight/2) + (article1.height/2) - (voteNow.height/2));
	voteNow.hide();
	
}

function draw() 
{
	// Logo Page
    if ( pageNumber == 0 )
	{
		if (second() - timeAtStart > 8 || timeAtStart - second() > 59 - 8 )
		{
			disclaimer.hide();
			initialPage.show();
			logo.show();
			shouldCount = true;
		}
	}
	// Question 1
	else if ( pageNumber == 1)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		initialPage.hide();
		logo.hide();
		header.show();
		article1.show();
		voteNow.show();
		// Audio
		if ( isSongPlayed == 0 && !soundArticle1.isPlaying() ) 
		{
			soundArticle1.play();
			soundArticle1.setVolume(1);
			isSongPlayed = 1; 
		}
		// Arduino
		isDataSentToArduino = 0;
	}
	// Answer 1
	else if ( pageNumber == 2)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		article1.hide();
		resArticle1.show();
		voteNow.hide();
		// Audio
		isSongPlayed = 0;
		// Data
		if ( isDataSentToArduino == 0 )
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage1 = 0;
				percentageFalse1 = 0;
			}
			else 
			{
				percentage1 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse1 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
			// Arduino
			sendData();
			isDataSentToArduino = 1;
		}
	}
	// Question 2
	else if ( pageNumber == 3)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		resArticle1.hide();
		article2.show();
		voteNow.show();
		// Audio
		if ( isSongPlayed == 0  && !soundArticle2.isPlaying() ) 
		{
			soundArticle2.play();
			soundArticle2.setVolume(1);
			isSongPlayed = 1; 
		}
		// Arduino
		isDataSentToArduino = 0;
	}
	// Answer 2
	else if ( pageNumber == 4)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		article2.hide();
		resArticle2.show();
		voteNow.hide();
		// Audio
		isSongPlayed = 0;
		// Data
		if ( isDataSentToArduino == 0 )
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage2 = 0;
				percentageFalse2 = 0;
			}
			else 
			{
				percentage2 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse2 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
			// Arduino
			sendData();
			isDataSentToArduino = 1;
		}
	}
	// Question 3
	else if ( pageNumber == 5)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		resArticle2.hide();
		article3.show();
		voteNow.show();
		// Audio
		if ( isSongPlayed == 0 && !soundArticle3.isPlaying() )
		{
			soundArticle3.play();
			soundArticle3.setVolume(1);
			isSongPlayed = 1; 
		}
		// Arduino
		isDataSentToArduino = 0;
	}
	// Answer 3
	else if ( pageNumber == 6)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		article3.hide();
		resArticle3.show();
		voteNow.hide();
		// Audio
		isSongPlayed = 0;
		// Data
		if ( isDataSentToArduino == 0 )
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage3 = 0;
				percentageFalse3 = 0;
			}
			else 
			{
				percentage3 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse3 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
			// Arduino
			sendData();
			isDataSentToArduino = 1;
		}
	}
	// Question 4
	else if ( pageNumber == 7)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		resArticle3.hide();
		article4.show();
		voteNow.show();
		// Audio
		if ( isSongPlayed == 0 && !soundArticle4.isPlaying() )
		{
			soundArticle4.play();
			soundArticle4.setVolume(1);
			isSongPlayed = 1; 
		}
		// Arduino
		isDataSentToArduino = 0;
	}
	// Answer 4
	else if ( pageNumber == 8)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		article4.hide();
		resArticle4.show();
		voteNow.hide();
		// Audio
		isSongPlayed = 0;
		// Data
		if ( isDataSentToArduino == 0 )
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage4 = 0;
				percentageFalse4 = 0;
			}
			else 
			{
				percentage4 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse4 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
			// Arduino
			sendData();
			isDataSentToArduino = 1;
		}
	}
	// Question 5
	else if ( pageNumber == 9)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		resArticle4.hide();
		article5.show();
		voteNow.show();
		// Audio
		if ( isSongPlayed == 0 && !soundArticle5.isPlaying() )
		{
			soundArticle5.play();
			soundArticle5.setVolume(1);
			isSongPlayed = 1; 
		}
		// Arduino
		isDataSentToArduino = 0;
	}
	// Answer 5
	else if ( pageNumber == 10)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		article5.hide();
		resArticle5.show();
		voteNow.hide();
		// Audio
		isSongPlayed = 0;
		// Data
		if ( isDataSentToArduino == 0 )
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage5 = 0;
				percentageFalse5 = 0;
			}
			else 
			{
				percentage5 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse5 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
			// Arduino
			sendData();
			isDataSentToArduino = 1;
		}
	}
	// Question 6
	else if ( pageNumber == 11)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		resArticle5.hide();
		article6.show();
		voteNow.show();
		// Audio
		if ( isSongPlayed == 0 && !soundArticle6.isPlaying() ) 
		{
			soundArticle6.play();
			soundArticle6.setVolume(1);
			isSongPlayed = 1; 
		}
		// Arduino
		isDataSentToArduino = 0;
	}
	// Answer 6
	else if ( pageNumber == 12)
	{
		if ( isDataSentToPubNub == 0 ) {sendTheMessage();}
		// Visual
		article6.hide();
		resArticle6.show();
		voteNow.hide();
		// Audio
		isSongPlayed = 0;
		// Data
		if ( isDataSentToArduino == 0 )
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage6 = 0;
				percentageFalse6 = 0;
			}
			else 
			{
				percentage6 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse6 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
			// Arduino
			sendData();
			isDataSentToArduino = 1;
		}
	}
	// Result Page
	else if ( pageNumber == 13)
	{
		sendTheMessage();
		// Visual
		resArticle6.hide();
		finalPage();
		// Audio
		isSongPlayed = 0;
		//Arduino
		isDataSentToArduino = 0;
		pageNumber = "Done";
	}
}

// Decrease timer variable by 1
function timerFunction(){
	if ( shouldCount == true)
	{
		timer = timer - 1;
		if (timer <= 0){
			pageNumber++;
			isDataSentToPubNub = 0;
			timer = 5;
		}
	}
}

function finalPage ()
{
	//textFont("Bebas");
	
	// Question 1
    noStroke();
	fill(140, 198, 63);
    rect(50, 140, (windowWidth-100), 30);

    noStroke();
    fill(193, 39, 45);
    w = (windowWidth-100) * (percentageFalse1/100);
    rect(50, 140, w, 30);
	
	fill(193, 39, 45);
	textSize(21);
	textAlign(LEFT);
	text(round(percentageFalse1) + " % ", 50, 175, windowWidth/3,50);
	
	fill(255);
	textSize(14);
	textAlign(LEFT);
	text('QUESTION 1', 50, 120, windowWidth/3,50);
	
	// Question 2
    noStroke();
	fill(193, 39, 45);
    rect(50, 240, (windowWidth-100), 30);

    noStroke();
    fill(140, 198, 63);
    w = (windowWidth-100) * (percentage2/100);
    rect(50, 240, w, 30);
	
	fill(140, 198, 63);
	textSize(21);
	textAlign(LEFT);
	text(round(percentage2) + " % ", 50, 275, windowWidth/3,50);
	
	fill(255);
	textSize(14);
	textAlign(LEFT);
	text('QUESTION 2', 50, 220, windowWidth/3,50);

	// Question 3
	noStroke();
    fill(193, 39, 45);
    rect(50, 340, (windowWidth-100), 30);

    noStroke();
    fill(140, 198, 63);
    w = (windowWidth-100) * (percentage3/100);
    rect(50, 340, w, 30);
	
	fill(140, 198, 63);
	textSize(21);
	textAlign(LEFT);
	text(round(percentage3) + " % ", 50, 375, windowWidth/3,50);
	
	fill(255);
	textSize(14);
	textAlign(LEFT);
	text('QUESTION 3', 50, 320, windowWidth/3,50);
	
	// Question 4
	stroke(255);
    fill(193, 39, 45);
	noStroke();
    rect(50, 440, (windowWidth-100), 30);

    noStroke();
    fill(140, 198, 63);
    var w = (windowWidth-100) * (percentage4/100);
    rect(50, 440, w, 30);
	
	var percentage4Text = round(percentage4) + " % ";
	textAlign(LEFT);
	textSize(21);
	text(percentage4Text, 50, 475, windowWidth/3,50);
	
	fill(255);
	textAlign(LEFT);
	textSize(14);
	text('QUESTION 4', 50, 420, windowWidth/3,50);

	
	// Question 5
	stroke(255);
    fill(193, 39, 45);
	noStroke();
    rect(50, 540, (windowWidth-100), 30);

    noStroke();
    fill(140, 198, 63);
    var w = (windowWidth-100) * (percentage5/100);
    rect(50, 540, w, 30);
	
	var percentage5Text = round(percentage5) + " % ";
	textAlign(LEFT);
	textSize(21);
	text(percentage5Text, 50, 575, windowWidth/3,50);
	
	fill(255);
	textAlign(LEFT);
	textSize(14);
	text('QUESTION 5', 50, 520, windowWidth/3,50);

	
	//  Question 6
	stroke(255);
    fill(140, 198, 63);
	noStroke();
    rect(50, 640, (windowWidth-100), 30);

    noStroke();
    fill(193, 39, 45);
    var w = (windowWidth-100) * (percentageFalse6/100);
    rect(50, 640, w, 30);
	
	var percentageFalse6Text = round(percentageFalse6) + " % ";
	textAlign(LEFT);
    fill(193, 39, 45);
	textSize(21);
	text(percentageFalse6Text, 50, 675, windowWidth/3,50);
	
	fill(255);
	textAlign(LEFT);
	textSize(14);
	text('QUESTION 6', 50, 620, windowWidth/3,50);

	accuracy = (percentageFalse1 + percentage2 + percentage3 + percentage4 + percentage5 + percentageFalse6)/6;
	
	fill(255);
	textAlign(CENTER);
	textSize(75);
	
	accuracy = "Community Accuracy: " + round(accuracy) + " %";
	text(accuracy, 0, (windowHeight* (3/4)),windowWidth, (windowHeight* (3/4))+200);
}

function windowResized() {}

/* -------------------- PubNub -------------------- */
// Send data to pubnub
function sendTheMessage() {
	dataServer.publish(
    {
        channel: textChannelName,
        message: 
        {
            theMessage: pageNumber,
        }
    });
	isDataSentToPubNub = 1;
	//console.log(pageNumber);
}

// Read data from pubnub
function readIncoming(inMessage) 
{
    /*if(inMessage.channel == textChannelName)
    {
		pageNumber++;
		if ( pageNumber == 1 )
		{
			trueCount = 0;
			falseCount = 0;
		} else if ( pageNumber == 3 ) 
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage1 = 0;
				percentageFalse1 = 0;
			}
			else {
				percentage1 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse1 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
		} else if ( pageNumber == 5 ) 
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage2 = 0;
				percentageFalse2 = 0;
			}
			else {
				percentage2 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse2 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
		} else if ( pageNumber == 7 ) 
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage3 = 0;
				percentageFalse3 = 0;
			}
			else {
				percentage3 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse3 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
		} else if ( pageNumber == 9 ) 
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage4 = 0;
				percentageFalse4 = 0;
			}
			else {
				percentage4 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse4 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
		} else if ( pageNumber == 11 ) 
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage5 = 0;
				percentageFalse5 = 0;
			}
			else {
				percentage5 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse5 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
		} else if ( pageNumber == 12 ) 
		{
			if ( trueCount == 0 && falseCount == 0 )
			{
				percentage6 = 0;
				percentageFalse6 = 0;
			}
			else {
				percentage6 = (trueCount/(trueCount+falseCount))*100;
				percentageFalse6 = (falseCount/(trueCount+falseCount))*100;
			}
			trueCount = 0;
			falseCount = 0;
		}
    } */

    if(inMessage.channel == dataChannelName)
    {
		if ( inMessage.message.theMessage == true )
		{
			trueCount++;
		} else if ( inMessage.message.theMessage == false )
		{
			falseCount++;
		}
    }
}

function whoisconnected(connectionInfo) {}

/* -------------------- Arduino -------------------- */
// Send data to Arduino
function sendData()
{
	var sum = trueCount + falseCount;
	var percBelievers = trueCount/sum;
	var percChallengers = falseCount/sum;
	
	servoAngle1 = map(percBelievers, 0, 1, 180 , 0);
	servoAngle2 = map(percChallengers, 0, 1, 180 , 0);

    ardSend.servo1 = round(servoAngle1);			// Add the value to the servo1 parameter on the json object
    ardSend.servo2 = round(servoAngle2);			// Add the value to the servo2 parameter on the json object

	// -------------------- Send the message 3 times -------------------- //
    var sendString = JSON.stringify(ardSend);   	// Convert the json to a string  
    console.log(sendString)

    serial.write(sendString);                  		// Send it over the serial port    
    serial.write('\n');                           	// Write a new line character
	
	ardSend.servo1 = servoAngle1;					// Add the value to the servo1 parameter on the json object
    ardSend.servo2 = servoAngle2;					// Add the value to the servo2 parameter on the json object

    var sendString = JSON.stringify(ardSend);   	// Convert the json to a string  
    //console.log(sendString)

    serial.write(sendString);						// Send it over the serial port    
    serial.write('\n');                           	// Write a new line character
	
	ardSend.servo1 = servoAngle1;					// Add the value to the servo1 parameter on the json object
    ardSend.servo2 = servoAngle2;					// Add the value to the servo2 parameter on the json object

    var sendString = JSON.stringify(ardSend);   	// Convert the json to a string  
    //console.log(sendString)

    serial.write(sendString);                   	// Send it over the serial port    
    serial.write('\n');                           	// Write a new line character
}

function ardCon()
{
    console.log("connected to the Arduino Micro! Let's Go");
}