/* -------------------- Variables -------------------- */
// Server variables
var dataServer;
var pubKey = 'pub-c-7b078ffc-490a-45f5-9ab4-67d0fe24506f';
var subKey = 'sub-c-3f1bc6ee-24bd-11e9-b742-22d0c008a4f0';
var adminChannelName = "adminChannel";
var dataChannelName = "voteChannel";

// Button variables
var trueButton, falseButton;
var trueText, falseText;

// Timer variables
var timer, timerVisible;
var timerPosition = 0;
var t;

// Pages
var initialPage, logo, thanksPage;


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
    dataServer.subscribe({channels: [adminChannelName,dataChannelName]});

    // Buttons   
    trueButton = createImg('images/Green.png');
    trueButton.size(windowWidth - 80,windowHeight/6);
    trueButton.position((windowWidth * (1/2)) - (trueButton.width/2) + 10 ,(windowHeight * (5/8)) - (trueButton.height/2));
    trueButton.mousePressed(function() { buttonFunction(true);});
	trueText = createImg('images/Believe.png');
	trueText.size(windowWidth/3,(windowWidth/3)*0.25);
    trueText.position((windowWidth * (1/2)) - (trueText.width/2) ,(windowHeight * (5/8)) - (trueText.height/2));
	trueText.mousePressed(function() { buttonFunction(true);});
    
	
	falseButton = createImg('images/Red.png');
    falseButton.size(windowWidth - 80,windowHeight/6);
    falseButton.position((windowWidth * (1/2)) - (falseButton.width/2) + 10 ,(windowHeight * (5/8)) - (falseButton.height/2) + (windowHeight/5));
    falseButton.mousePressed(function() { buttonFunction(false);});
	falseText = createImg('images/Challenge.png');
	falseText.size(windowWidth/2,(windowWidth/2)*0.19);
    falseText.position((windowWidth * (1/2)) - (falseText.width/2) ,(windowHeight * (5/8)) - (falseText.height/2) + (windowHeight/5));
	falseText.mousePressed(function() { buttonFunction(false);});
	
	// Thank you page
	thanksPage = createImg('images/Thanks.png');
	thanksPage.size( windowWidth * (2/3) , windowWidth * (2/3) * (1.68));
	thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));
	thanksPage.hide();
	
	// Initializing timer variables
	timer = 30;
	timerVisible = false;
	t = second();
	setInterval(timerFunction, 1000);					// Run timerFunction every second
	
	// Initial Page
	initialPage = createImg("images/Background.gif");
	initialPage.size(windowWidth, windowHeight);
	initialPage.position(0,0);
	
	logo = createImg("images/Logo.png");
	logo.size((windowWidth/2),(windowWidth/2)*0.17);
	logo.position((windowWidth/2) - (logo.width/2), (windowHeight/2) - (logo.height/2));
}

function draw() 
{
	// Run only if timer is turned on
    if ( timerVisible == true )
	{
		if ( timerPosition == 0 )
		{	
			// When timer is over, automatically go to the thank you page
			if ( timer <= 0 )
			{
				trueButton.hide();
				trueText.hide();
				falseButton.hide();
				falseText.hide();
				timerVisible = false;
				timer = 30;
				background(0);
				thanksPage.show();
			} 
			// else start the count down
			else {
				background(0);			
				fill(255);
				textFont("Bebas");
				textSize(windowHeight/5);
				textAlign(CENTER);
				if ( timer <= 9 ) {
					text( "0:0" + timer + "s" , 0,windowHeight/5,windowWidth,windowHeight/2);
				} else {
					text( "0:" + timer + "s" , 0,windowHeight/5,windowWidth,windowHeight/2);
				}
				// Draw the middle line
				rect(0,windowHeight/2,windowWidth,2);
			}
		}
		else if ( timerPosition == 1 )
		{
			// When timer is over, automatically go to the thank you page
			if ( timer <= 0 )
			{
				trueButton.hide();
				trueText.hide();
				falseButton.hide();
				falseText.hide();
				timerVisible = false;
				timer = 30;
				background(0);
				thanksPage.show();
			} 
			// else start the count down
			else {
				background(0);			
				fill(255);
				textFont("Bebas");
				textSize(windowHeight/20);
				textAlign(CENTER);
				if ( timer <= 9 ) {
					text( "IN   " + "0:0" + timer + "s" , 0,windowHeight*17/20,windowWidth,windowHeight/2);
				} else {
					text( "IN   " + "0:" + timer + "s" , 0,windowHeight*17/20,windowWidth,windowHeight/2);
				}
			}
		}
	}
}

// Decrease timer variable by 1
function timerFunction(){
	if ( timerVisible == true)
	{
		timer = timer - 1;
	}
}

// Base on the button that is presses, send a true or false message
function buttonFunction(index)
{
	// True button is pressed, send true message and go to thank you page
	if ( index == true )
	{
		sendTheMessage(true);
		trueButton.hide();
		trueText.hide();
		falseButton.hide();
		falseText.hide();

		timerPosition = 1;
		
		background(0);
		thanksPage.show();
		thanksPage.size( windowWidth * (1/2) , windowWidth * (1/2) * (1.68));
		thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));

	} 
	// False button is presses, send false message and go to thank you page
	else if ( index == false )
	{
		sendTheMessage(false);
		trueButton.hide();
		trueText.hide();
		falseButton.hide();
		falseText.hide();

		timerPosition = 1;

		background(0);
		thanksPage.show();
		thanksPage.size( windowWidth * (1/2) , windowWidth * (1/2) * (1.68));
		thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));
	}
	
}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
	background(0);
	
    trueButton.size(windowWidth - 80,windowHeight/6);
    trueButton.position((windowWidth * (1/2)) - (trueButton.width/2) ,(windowHeight * (5/8)) - (trueButton.height/2));
    trueText.size(windowWidth/3,(windowWidth/3)*0.25);
	trueText.position((windowWidth * (1/2)) - (trueText.width/2) ,(windowHeight * (5/8)) - (trueText.height/2));
    
	falseButton.size(windowWidth - 80,windowHeight/6);
    falseButton.position((windowWidth * (1/2)) - (falseButton.width/2) ,(windowHeight * (5/8)) - (falseButton.height/2) + (windowHeight/5));
    falseText.size(windowWidth/2,(windowWidth/2)*0.19);
	falseText.position((windowWidth * (1/2)) - (falseText.width/2) ,(windowHeight * (5/8)) - (falseText.height/2) + (windowHeight/5));
	
	thanksPage.size( windowWidth * (1/2) , windowWidth * (1/2) * (1.68));
	thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));

	logo.size((windowWidth/2),(windowWidth/2)*0.17);
	logo.position((windowWidth/2) - (logo.width/2), (windowHeight/2) - (logo.height/2));
}

/* -------------------- PubNub -------------------- */
// Send data to pubnub
function sendTheMessage( vote )
{
	dataServer.publish(
	{
		channel: dataChannelName,
		message: 
		{
			theMessage: vote,
		}
	});
}

// Read data from pubnub
function readIncoming(inMessage) 
{
	// Make sure it's the right channel
	if(inMessage.channel == adminChannelName)
	{
		// Closing the initial Page & going to vote page
		if ( inMessage.message.theMessage == 1 )
		{
			initialPage.hide();
			logo.hide();
			timerVisible = true;
			trueButton.show();
			trueText.show();
			falseButton.show();
			falseText.show();
		}
		// Voting pages
		else if ( inMessage.message.theMessage == 3 || inMessage.message.theMessage == 5 || inMessage.message.theMessage == 7 || inMessage.message.theMessage == 9 || inMessage.message.theMessage == 11)
		{
			timerPosition = 0;
			thanksPage.hide();			
			timerVisible = true;
			timer = 30;
			trueButton.show();
			trueText.show();
			falseButton.show();
			falseText.show();
		}
		// Thank you pages
		else if ( inMessage.message.theMessage == 2 || inMessage.message.theMessage == 4 || inMessage.message.theMessage == 6 || inMessage.message.theMessage == 8 || inMessage.message.theMessage == 10 || inMessage.message.theMessage == 12 )
		{
			timerPosition = 1;
			trueButton.hide();
			trueText.hide();
			falseButton.hide();
			falseText.hide();
			background(0);
			thanksPage.show();
			thanksPage.size( windowWidth * (1/2) , windowWidth * (1/2) * (1.68));
			thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));				
		}
		// Final page
		else if ( inMessage.message.theMessage == 13 )
		{
			trueButton.hide();
			trueText.hide();
			falseButton.hide();
			falseText.hide();
			timerVisible = false;
			timer = 30;
			background(0);
			thanksPage.show();
			thanksPage.size( windowWidth * (1/2) , windowWidth * (1/2) * (1.68));
			thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));	
		}
			
	}
}