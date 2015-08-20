
function _Processes ()
{
	this.update = function(modifier) {
		var n = list.length;
		for(var i=0;i<n;i++)
		{
			list[i].update(modifier);
			if(!list[i].alive)
			{
				list[i].onDeath();
				list.splice(i,1);
				n--;
				i--;
			}
		}
	};
	
	this.add = function(params, pro) {
		list.push(pro);
		list[list.length-1].onBirth(params);
	};
	
	this.terminate = function(i) {
		list[i].alive = false;
		list[i].onDeath();
		list.splice(i,1);
		n--;
		i--;
	};
	
	var list = [];
}
var Processes = new _Processes();

function ProcessPulseCursor () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		if(mouseOver!=tile){this.alive = false;}
		else{
			TileGrid[tile].setSize(((Math.sin(m)+1)*0.5*0.8+0.6)*initialSize);
			m += modifier*3;
		}
	};
	this.onBirth = function(n){
		tile = mod(n, TileGridW*TileGridH);
		initialSize = TileGrid[n].getSize();
	};
	this.onDeath = function(){
		TileGrid[tile].setSize(initialSize);
	};
	
	var m = 0;
	var tile;
	var initialSize;
}
function ProcessRotateTile () {
	
	this.alive = true;
	
	this.update = function(modifier) {
	if(mouseOver==tile&&rotateOnMouse) speed += acceleration * modifier;
		else speed -= acceleration * modifier;
		speed = Math.min(speed, maxSpeed);
		if(speed<=0) this.alive = false;
		else{
			TileGrid[tile].setAngle(TileGrid[tile].getAngle() + speed * modifier);
		}
	};
	this.onBirth = function(params) {//params = {tile:, maxSpeed:, acceleration:, speed:, rotateOnMouse:};
		tile = mod(params.tile, TileGridW*TileGridH);
		maxSpeed = params.maxSpeed;
		acceleration = params.acceleration;
		speed = params.speed;
		rotateOnMouse = params.rotateOnMouse;
	};
	this.onDeath = function(){
	};
	
	var tile;
	var maxSpeed;
	var acceleration;
	var rotateOnMouse;
	
	var speed;
}
function ProcessFadeAll () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		for(var i = 0; i < TileGridW * TileGridH; i++)
		{
			TileGrid[i].color.a = Math.max(TileGrid[i].color.a - fadeRate * modifier, fadeMin);
		}
	};
	this.onBirth = function(params) {//params={fadeRate: , fadeMin: }; fadeRate=amount to fade in 1 s
		fadeRate = params.fadeRate;
		fadeMin = Math.max(0, params.fadeMin);
	};
	this.onDeath = function() {};
	
	var fadeRate;
	var fadeMin;
}
function ProcessUnfadeCursor () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		if(mouseOver != tile){this.alive = false;}
		else{
			TileGrid[tile].color.a = Math.min(TileGrid[tile].color.a + 15.7 * modifier, 1);
		}
	};
	this.onBirth = function(n){
		tile = mod(n, TileGridW*TileGridH);
	};
	this.onDeath = function(){};
	
	var tile;
}
function ProcessCursorViewportDirectioning () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		var speed = {x:((mousePos.x * 2 - viewport.getW()) * maxSpeed / viewport.getW()) * modifier, y:((mousePos.y * 2 - viewport.getH()) * maxSpeed / viewport.getH()) * modifier};
	
		viewport.mid.x += speed.x * viewport.getCos() - speed.y * viewport.getSin();
		viewport.mid.y += speed.y * viewport.getCos() + speed.x * viewport.getSin();
	}
	this.onBirth = function(MaxSpeed) {
		maxSpeed = MaxSpeed;
	};
	this.onDeath = function() {};
	
	var maxSpeed;
}
function ProcessCursorViewportDirectioning2 () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		viewport.mid.x = rangeRadius * (mousePos.x / viewport.getW() * 2 - 1);
		viewport.mid.y = rangeRadius * (mousePos.y / viewport.getH() * 2 - 1);
	}
	this.onBirth = function(RangeRadius) {
		rangeRadius = RangeRadius;
	};
	this.onDeath = function() {};
	
	var rangeRadius;
}
function ProcessUnfadeStar () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		time += speed * modifier;
		while(time>=1)
		{
			time-=1;
			
			for(var i=0;i<6;i++)TileGrid[tile[i]].color.a=1;
			
			step++;
			
			tile[0] = mod(tile[0] - TileGridW, TileGridW * TileGridH);
			tile[1] = mod(tile[1] - TileGridW, TileGridW * TileGridH);
			tile[3] = mod(tile[3] + TileGridW, TileGridW * TileGridH);
			tile[4] = mod(tile[4] + TileGridW, TileGridW * TileGridH);
			
			tile[1]++; if(tile[1] % TileGridW == 0) tile[1] -= TileGridW;
			tile[2]++; if(tile[2] % TileGridW == 0) tile[2] -= TileGridW;
			if(tile[4] % TileGridW == 0) tile[4] += TileGridW; tile[4]--;
			if(tile[5] % TileGridW == 0) tile[5] += TileGridW; tile[5]--;
		}
		if(step >= maxSteps) this.alive = false;
	}
	this.onBirth = function(params) {//params={speed:,steps:,n:};
		speed = params.speed;
		maxSteps = params.steps;
		for(var i=0;i<6;i++)tile[i] = params.n;
		time = 1;
		step = -1;
	};
	this.onDeath = function() {};
	
	var step;
	var time;
	var tile = [];
	
	var speed;
	var maxSteps;
}
function ProcessUnfadeCrown () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		time += speed * modifier;
		while(time>=1)
		{
			time-=1;
			step++;
			
			
			for(var j=0;j<step;j++){
				TileGrid[tl].color.a = 1;
				tl = mod(tl + TileGridW, TileGridW * TileGridH);
			}
			for(var j=0;j<step;j++){
				TileGrid[tl].color.a = 1;
				tl++; if(tl % TileGridW == 0) tl -= TileGridW;
			}
			for(var j=0;j<step;j++){
				TileGrid[tl].color.a = 1;
				tl = mod(tl - TileGridW, TileGridW * TileGridH);
				tl++; if(tl % TileGridW == 0) tl -= TileGridW;
			}
			for(var j=0;j<step;j++){
				TileGrid[tl].color.a = 1;
				tl = mod(tl - TileGridW, TileGridW * TileGridH);
			}
			for(var j=0;j<step;j++){
				TileGrid[tl].color.a = 1;
				if(tl % TileGridW == 0) tl += TileGridW; tl--;
			}
			for(var j=0;j<step;j++){
				TileGrid[tl].color.a = 1;
				tl = mod(tl + TileGridW, TileGridW * TileGridH);
				if(tl % TileGridW == 0) tl += TileGridW; tl--;
			}
			
			if(tl % TileGridW == 0) tl += TileGridW; tl--;//esxcfr
		}
		if(step >= maxSteps) this.alive = false;
	}
	this.onBirth = function(params) {//params={speed:,steps:,n:};
		speed = params.speed;
		maxSteps = params.steps;
		tl = params.n;
		time = 1;
		step = -1;
	};
	this.onDeath = function() {};
	
	var step;
	var time;
	var tl;
	
	var speed;
	var maxSteps;
}
function ProcessRotateCrown () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		time += speed * modifier;
		while(time>=1)
		{
			time-=1;
			step++;
			
			
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				tl = mod(tl + TileGridW, TileGridW * TileGridH);
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				tl++; if(tl % TileGridW == 0) tl -= TileGridW;
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				tl = mod(tl - TileGridW, TileGridW * TileGridH);
				tl++; if(tl % TileGridW == 0) tl -= TileGridW;
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				tl = mod(tl - TileGridW, TileGridW * TileGridH);
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				if(tl % TileGridW == 0) tl += TileGridW; tl--;
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				tl = mod(tl + TileGridW, TileGridW * TileGridH);
				if(tl % TileGridW == 0) tl += TileGridW; tl--;
			}
			
			if(tl % TileGridW == 0) tl += TileGridW; tl--;//esxcfr
		}
		if(step >= maxSteps) this.alive = false;
	}
	this.onBirth = function(params) {//params={speed:,steps:,n:};
		speed = params.speed;
		maxSteps = params.steps;
		tl = params.n;
		time = 1;
		step = -1;
	};
	this.onDeath = function() {};
	
	var step;
	var time;
	var tl;
	
	var speed;
	var maxSteps;
}
function ProcessUnfadeRotateCrown () {
	
	this.alive = true;
	
	this.update = function(modifier) {
		time += speed * modifier;
		while(time>=1)
		{
			time-=1;
			step++;
			
			
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				TileGrid[tl].color.a = 1;
				tl = mod(tl + TileGridW, TileGridW * TileGridH);
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				TileGrid[tl].color.a = 1;
				tl++; if(tl % TileGridW == 0) tl -= TileGridW;
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				TileGrid[tl].color.a = 1;
				tl = mod(tl - TileGridW, TileGridW * TileGridH);
				tl++; if(tl % TileGridW == 0) tl -= TileGridW;
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				TileGrid[tl].color.a = 1;
				tl = mod(tl - TileGridW, TileGridW * TileGridH);
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				TileGrid[tl].color.a = 1;
				if(tl % TileGridW == 0) tl += TileGridW; tl--;
			}
			for(var j=0;j<step;j++){
				Processes.add({tile:tl, maxSpeed:2.65, acceleration:0.5, speed:2.65, rotateOnMouse:false}, new ProcessRotateTile());
				TileGrid[tl].color.a = 1;
				tl = mod(tl + TileGridW, TileGridW * TileGridH);
				if(tl % TileGridW == 0) tl += TileGridW; tl--;
			}
			
			if(tl % TileGridW == 0) tl += TileGridW; tl--;//esxcfr
		}
		if(step >= maxSteps) this.alive = false;
	}
	this.onBirth = function(params) {//params={speed:,steps:,n:};
		speed = params.speed;
		maxSteps = params.steps;
		tl = params.n;
		time = 1;
		step = -1;
	};
	this.onDeath = function() {};
	
	var step;
	var time;
	var tl;
	
	var speed;
	var maxSteps;
}
