var bg_loadimg;
var createimg;
var logo;
var bodytext = 'what we believe. what we challenge. what we create.'

function preload(){
}

function setup() {
createCanvas(windowWidth, windowHeight);
bg_createimg = createImg("Background.gif");
bg_createimg.size(windowWidth, windowHeight);
bg_createimg.position(0,0);

function windowResized () {resizeCanvas (windowWidth, windowHeight); }

logo = createImg("Logo.png");
logo.position((windowWidth/2)-(logo.width/2), (windowHeight/2)-(logo.height/2));


}

function draw() {
		
}


