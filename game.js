var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

/*features to add:
fade menu completely?
change the way the mouse moves the viewport
create themes: palettes with background
find a better cursor
menu where you choose between themes and tools
make the crown and star processes add whatever process to the tiles they visit
or at least make it take parameters on birth ffs
work on translations and stuff (multistate transitions/nonlinear transitions)
*/

/*To Do: 
Optimize! 
Processes! (make'em private and better)
Multiple viewports! 
Fix zooming so it zooms relative to some point!
Tile offsets!
Make menu
Make everything smoother and bouncier
*/

//basic and geometric variables
var root3 = Math.sqrt(3);
var Pi = Math.PI;

//basic and geometric functions
function mod(m, n) {
	return ((m % n) + n) % n;
}

function clamp(x, a, b) {
	return Math.max(Math.min(x, b), a);
}

function rotate(p1, p2, ang){//rotate p1 around p2 ang radians
	var x = p1.x - p2.x;
	var y = p1.y - p2.y;
	var sin = Math.sin(ang);
	var cos = Math.cos(ang);
	
	return {x:(x*cos-y*sin+p2.x), y:(x*sin+y*cos+p2.y)};
}

// Game objects
var TileGridW;
var TileGridH;

var TileGrid = [];

var viewport = new Viewport();

var keysDown = {};

var mousePos = {x:0, y:0};

var prevMouseOver = 0;
var mouseOver = 0;

var prevMouseDown = false;
var mouseDown = false;

var backgroundStyle;

var mouseAction;
var mouseActions;

var palette;
var palettes;


//Classes

function Viewport (){

	this.mid = {x:0.0, y:0.0};
	var w = ctx.canvas.width;
	var h = ctx.canvas.height;
	var angle = 0.0;
	var zoom = 45;//length of a hexagon's side in px
	
	//optimizations
	var HVD = []; //the displacements of the vertices of a hexagon from the centre when the haxagon has rotation 0
	var rectP = [];//the 4 points of the rectangle corresponding to the current viewport with respect to Origin 
	var hRectP = [];
	var sin = 0
	var cos = 1;
	
	
	
	this.getAngle = function (){
		return angle;
	};
	this.setAngle = function (x){
		angle = mod(x,Pi*2);
		
		sin = Math.sin(angle);
		cos = Math.cos(angle);
		
		calcHVD();
		calcRectP();
	};
	this.getW = function(){
		return w;
	}
	this.getH = function(){
		return h;
	}
	this.setW = function(){
		w = ctx.canvas.width;
		
		calcRectP();
	}
	this.setH = function(){
		h = ctx.canvas.height;
		
		calcRectP();
	}
	this.setZoom = function(x){
		var prev = zoom;
	
		zoom = clamp(x, 5, 300);
		
		for(var i=0;i<6;i++){
			HVD[i].x*=zoom/prev;
			HVD[i].y*=zoom/prev;
		}
		calcRectP();
	}
	this.getZoom = function(){
		return zoom;
	}
	this.getHVD = function(i){
		return HVD[mod(i,6)];
	}
	this.getRectP = function(i){
		return {x:(rectP[mod(i,4)].x + this.mid.x), y:(rectP[mod(i,4)].y + this.mid.y)};
	}
	this.getSin = function(){
		return sin;
	}
	this.getCos = function(){
		return cos;
	}
	
	
	var calcHVD = function(){
		HVD[0] = rotate({x:0, y:(-zoom)}, {x:0,y:0}, -angle);
		for(var i=1;i<6;i++) HVD[i] = rotate(HVD[i-1], {x:0, y:0}, Pi/3);
	}
	var calcRectP = function(){
		rectP[0] = rotate({x:(-w/2-zoom), y:(-h/2-zoom)}, {x:0, y:0}, angle);
		rectP[1] = rotate({x:(w/2+zoom), y:(-h/2-zoom)}, {x:0, y:0}, angle);
		rectP[2] = {x:(-rectP[0].x), y:(-rectP[0].y)};
		rectP[3] = {x:(-rectP[1].x), y:(-rectP[1].y)};
	}
	
	calcHVD();
}

function Tile () {
	
	this.getSize = function (){
		return size;
	};
	this.setSize = function(x){
		size = Math.max(x, 0.0);
	};
	this.getAngle = function (){
		return angle;
	};
	this.setAngle = function (x){
		angle = mod(x,Pi*2);
	};
	
	this.offset = {x:0, y:0};
	this.color = {r:0, g:0, b:0, a:0};
	var size = Math.random()*0.58+0.3;//1 -> full size
	var angle = 0.0;//in radians
}


//game logic functions

//x,y position relative to Origin; w,h-size of the hexagon grid (for example 6 by 9 hexagons), l- length of a hexagon's side
function findHexagon (x, y, w, h, l) {//don't try to understand how it works, it just does
	
	var lroot3=l*root3;

	var a=Math.floor(y/l-x/lroot3);
	var b=Math.floor(y/l+x/lroot3);
	var c=Math.floor((x+x)/lroot3);
	
	if(mod(a-c,3)==2){a++;c--;}
	else if(mod(a-c,3)==0){
		if(mod(a-c+b,2)==0) c--;
		else a++;
	}
	
	var right=(c-a+1)/3;
	var down=(a+c-right+1)/2;
	
	return mod(mod(right,w)+down*w,w*h);
}

// The main game loop
var main = function () {

	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
		
	var now = Date.now();
	var delta = Math.min(1000, now - then);

	update(delta / 1000);
	//ctx.beginPath();
	render(viewport, TileGridW, TileGridH);
	//ctx.fill();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
init();
main();
