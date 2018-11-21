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
var trueText, falseText;
var timer, timerVisible;
var t;

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

    // Buttons   
    trueButton = createImg('images/Green.png');
    trueButton.size(windowWidth - 80,200);
    trueButton.position((windowWidth * (1/2)) - (trueButton.width/2) + 10 ,(windowHeight * (5/8)) - (trueButton.height/2));
    trueButton.mousePressed(function() { buttonFunction(true);});
	trueText = createImg('images/Believe.png');
	trueText.size(342,87);
    trueText.position((windowWidth * (1/2)) - (trueText.width/2) ,(windowHeight * (5/8)) - (trueText.height/2));
	trueText.mousePressed(function() { buttonFunction(true);});
    
	
	falseButton = createImg('images/Red.png');
    falseButton.size(windowWidth - 80,200);
    falseButton.position((windowWidth * (1/2)) - (falseButton.width/2) + 10 ,(windowHeight * (5/8)) - (falseButton.height/2) + 250);
    falseButton.mousePressed(function() { buttonFunction(false);});
	falseText = createImg('images/Challenge.png');
	falseText.size(453,92);
    falseText.position((windowWidth * (1/2)) - (falseText.width/2) ,(windowHeight * (5/8)) - (falseText.height/2) + 250);
	falseText.mousePressed(function() { buttonFunction(false);});
	
	// Thank you page
	thanksPage = createImg('images/Thanks.png');
	thanksPage.size( windowWidth * (1/3) , windowWidth * (1/3) * (1.68));
	thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));
	thanksPage.hide();
	
	timer = 30;
	setInterval(timerFunction, 1000);
	timerVisible = true;
	t = second();
}

function draw() 
{
    if ( timerVisible == true )
	{
		if ( timer == 0 )
		{
			trueButton.hide();
			trueText.hide();
			falseButton.hide();
			falseText.hide();
			timerVisible = false;
			timer = 30;
			background(0);
			thanksPage.show();
		} else {
			background(0);			
			fill(255);
			textFont("Bebas");
			textSize(250);
			textAlign(CENTER);
			if ( timer <= 9 ) {
				text( "0:0" + timer + "s" , 0,200,windowWidth,windowHeight);
			} else {
				text( "0:" + timer + "s" , 0,200,windowWidth,windowHeight);
			}
			
			rect(0,windowHeight/2,windowWidth,2);
		}
	}
		
}

function timerFunction(){
	if ( timerVisible == true)
	{
		timer = timer - 1;
	}
}

function buttonFunction(index)
{
	if ( index == true ) 
	{
		sendTheMessage(true);
		trueButton.hide();
		trueText.hide();
		falseButton.hide();
		falseText.hide();
		timerVisible = false;
		timer = 30;
		background(0);
		thanksPage.show();
		thanksPage.size( windowWidth * (1/3) , windowWidth * (1/3) * (1.68));
		thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));

	} else if ( index == false )
	{
		sendTheMessage(false);
		trueButton.hide();
		trueText.hide();
		falseButton.hide();
		falseText.hide();
		timerVisible = false;
		timer = 30;
		background(0);
		thanksPage.show();
		thanksPage.size( windowWidth * (1/3) , windowWidth * (1/3) * (1.68));
		thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));
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
		thanksPage.hide();
		background(255);
		noStroke();
		fill(0);
		textSize(30);
		text(inMessage.message.theMessage, windowWidth * (1/4), windowHeight * (1/4), windowWidth * (2/4), windowHeight * (2/4));
		
		timerVisible = true;
		trueButton.show();
		trueText.show();
		falseButton.show();
		falseText.show();
	}
}

function whoisconnected(connectionInfo)
{

}

function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight);
	background(0);
	
    trueButton.size(windowWidth,200);
    trueButton.position((windowWidth * (1/2)) - (trueButton.width/2) ,(windowHeight * (5/8)) - (trueButton.height/2));
    trueText.position((windowWidth * (1/2)) - (trueText.width/2) ,(windowHeight * (5/8)) - (trueText.height/2));
    
	falseButton.size(windowWidth,200);
    falseButton.position((windowWidth * (1/2)) - (falseButton.width/2) ,(windowHeight * (5/8)) - (falseButton.height/2) + 250);
    falseText.position((windowWidth * (1/2)) - (falseText.width/2) ,(windowHeight * (5/8)) - (falseText.height/2) + 250);
	
	thanksPage.size( windowWidth * (1/3) , windowWidth * (1/3) * (1.68));
	thanksPage.position((windowWidth/2) - (thanksPage.width/2), (windowHeight/2) - (thanksPage.height/2));
}