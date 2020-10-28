function setPalette(x) {
	var l = palettes[x].length;
	var frqsum = 0;
	for(var i = 0; i < l; i++)frqsum += palettes[x][i].frq;
	
	for(var i = 0; i < TileGridW * TileGridH; i++){
		var n = Math.random() * frqsum;
		var j = 0;
		while(n >= 0){n -= palettes[x][j].frq; j++;}
		var c = palettes[x][j-1];
		TileGrid[i].color.r = c.r;
		TileGrid[i].color.g = c.g;
		TileGrid[i].color.b = c.b;
	}
}

//initialization
var init = function(){

	TileGridW = 30;
	TileGridH = 30;

	backgroundStyle = '#ffffff';

	palettes = [
	        [{r:16, g:8,  b:18, frq:30},
	      	 {r:200,g:20, b:47, frq:60},
	 	 {r:232,g:227,b:228,frq:5},
		 {r:242,g:242,b:242,frq:5}],

	        [{r:40, g:105,b:169,frq:1},
		 {r:60, g:158,b:255,frq:1}, 
		 {r:30, g:30, b:30, frq:1}, 
		 {r:255,g:224,b:171,frq:1},
		 {r:255,g:255,b:255,frq:1}],
		
		[{r:1,  g:27, b:71, frq:1},
		 {r:103,g:121,b:153,frq:1}, 
		 {r:204,g:204,b:204,frq:1}, 
		 {r:255,g:203,b:150,frq:1}, 
		 {r:255,g:150,b:46, frq:1}],
		
		[{r:255,g:179,b:84, frq:100},
		 {r:234,g:104,b:70, frq:45}, 
		 {r:203,g:54, b:73, frq:22}, 
		 {r:105,g:42, b:73, frq:10}, 
		 {r:63, g:97, b:96, frq:90}]
	];

	mouseActions = [
		function(){
			Processes.add({speed:11.3, steps:6, n:mouseOver}, new ProcessUnfadeRotateCrown());
		},
		function(){
			Processes.add({speed:9.8, steps:12, n:mouseOver}, new ProcessUnfadeStar());
		},
		function(){
			Processes.add({speed:20.2, steps:16, n:mouseOver}, new ProcessUnfadeCrown());
		}
	];

	
	for(i = 0; i < TileGridW * TileGridH; i++) TileGrid[i] = new Tile();
	
	palette = 0 //Math.floor(Math.random() * palettes.length);
	setPalette(palette);

	mouseAction = 0;
	
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	viewport.setW();
	viewport.setH();
	
	Processes.add({fadeRate: 0.86, fadeMin: 0.055}, new ProcessFadeAll());
	Processes.add(212.0, new ProcessCursorViewportDirectioning());
	
	/*
	TileGrid[29].setSize(0.28);
	TileGrid[11].setSize(1);
	TileGrid[11].setAngle(0.3);
	TileGrid[10].setAngle(0.22);*/
	
	// Handle keyboard controls
	
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);
	
	addEventListener("resize", function(e) {
		ctx.canvas.width  = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
	
		viewport.setW();
		viewport.setH();
	}, false);
	
	canvas.addEventListener("mousemove", function(e) {
		mousePos = getMousePos(canvas, e);
	}, false);
	
	canvas.addEventListener("mousedown", function (e) {
		mouseDown = true;
	}, false);
	canvas.addEventListener("mouseup", function (e) {
		mouseDown = false;
	}, false);
	
	if (canvas.addEventListener) {
	// IE9, Chrome, Safari, Opera
	canvas.addEventListener("mousewheel", MouseWheelHandler, false);
	// Firefox
	canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	}
	// IE 6/7/8
	else canvas.attachEvent("onmousewheel", MouseWheelHandler);
};


function MouseWheelHandler(e) {

	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	viewport.setZoom(viewport.getZoom()+5*delta);
	
	return false;
}

function getMousePos(cnvs, evt) {
	var rect = cnvs.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
