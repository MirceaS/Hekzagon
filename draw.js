// Draw everything
var render = function (vp, gridw, gridh) {
	
	//viewport has mid, w, h, angle, zoom
	//angle is between 0 and TwoPi
	
	
	//ctx.shadowBlur = 10;
	//ctx.shadowColor = "rgba(" + TileGrid[n].color.r + ", " + TileGrid[n].color.g + ", " + TileGrid[n].color.b + ", " + TileGrid[n].color.a * 0.7 + "";
	
	ctx.fillStyle = backgroundStyle;
	ctx.fillRect(0, 0, viewport.getW(), viewport.getH());
	
	
	var l = vp.getZoom();
	var lroot3=l*root3;
	
	var delta = {x:(vp.getCos()*lroot3),y:(-vp.getSin()*lroot3)};
	
	var m = vp.getRectP(0).y;
	var up = 0;
	for(var i=1;i<4;i++) if(vp.getRectP(i).y<m){m = vp.getRectP(i).y; up=i;}
	
	var top = Math.ceil(vp.getRectP(up).y*2/(l*3));
	var left = Math.ceil(vp.getRectP(up+3).y*2/(l*3));
	var right = Math.ceil(vp.getRectP(up+1).y*2/(l*3));
	var bottom = Math.ceil(vp.getRectP(up+2).y*2/(l*3));
	
	var start;
	var stop;
	for(var i=top;i<bottom;i++){
		var height = i*1.5*l;
		
		if(i<left) start = (vp.getRectP(up+3).y!=vp.getRectP(up).y)?(vp.getRectP(up).x-(height-vp.getRectP(up).y)*(vp.getRectP(up).x-vp.getRectP(up+3).x)/(vp.getRectP(up+3).y-vp.getRectP(up).y)):vp.getRectP(up).y;
		else start = (vp.getRectP(up+2).y!=vp.getRectP(up+3).y)?(vp.getRectP(up+3).x+(vp.getRectP(up+2).x-vp.getRectP(up+3).x)*(height-vp.getRectP(up+3).y)/(vp.getRectP(up+2).y-vp.getRectP(up+3).y)):vp.getRectP(up+2).y;
		
		if(i<right) stop = (vp.getRectP(up+1).y!=vp.getRectP(up).y)?(vp.getRectP(up).x+(vp.getRectP(up+1).x-vp.getRectP(up).x)*(height-vp.getRectP(up).y)/(vp.getRectP(up+1).y-vp.getRectP(up).y)):vp.getRectP(up+1).y;
		else stop = (vp.getRectP(up+2).y!=vp.getRectP(up+1).y)?(vp.getRectP(up+1).x-(height-vp.getRectP(up+1).y)*(vp.getRectP(up+1).x-vp.getRectP(up+2).x)/(vp.getRectP(up+2).y-vp.getRectP(up+1).y)):vp.getRectP(up+2).y;
		
		var width = Math.ceil(start/lroot3-mod(i,2)/2 )*lroot3+mod(i,2)*lroot3/2;
		
		var n = mod(mod(Math.ceil(start/lroot3-mod(i,2)/2 ) - Math.floor(i/2),gridw)+i*gridw,gridw*gridh);
		
		var renderpoint = rotate({x:(width-vp.getRectP(0).x), y:(height-vp.getRectP(0).y)},{x:0,y:0},-vp.getAngle()+Pi+Pi);
		renderpoint.x-=l;
		renderpoint.y-=l;
		
		for(var j=0;width+j*lroot3<stop;j++){
			drawHexagon({x:(renderpoint.x+delta.x*j), y:(renderpoint.y+delta.y*j)},vp.getAngle(),(n+j)%gridw + Math.floor(n/gridw)*gridw,vp);
		}
	}
	
	drawMenu();
};


function drawHexagon(pos,angle,n,vp){//position relative to screen
	var l = vp.getZoom();
	
	var size = TileGrid[n].getSize();
	
	ctx.lineWidth = 0;
	ctx.fillStyle = "rgba(" + TileGrid[n].color.r + ", " + TileGrid[n].color.g + ", " + TileGrid[n].color.b + ", " + TileGrid[n].color.a + ")";
	
	if(TileGrid[n].getAngle()==0.0) {
		
		ctx.beginPath();
		ctx.moveTo(pos.x+vp.getHVD(0).x*size, pos.y+vp.getHVD(0).y*size);
		
		for(var i=1;i<6;i++){
			ctx.lineTo(pos.x+vp.getHVD(i).x*size, pos.y+vp.getHVD(i).y*size);
		}
		ctx.lineTo(pos.x+vp.getHVD(0).x*size, pos.y+vp.getHVD(0).y*size);
		
		ctx.fill();
	}
	else{
		angle = 2*Pi - angle + TileGrid[n].getAngle();
		l *= size;
		var p = rotate({x:(pos.x), y:(pos.y-l)}, pos, angle);
		
		
		//ctx.rotate(0.000);
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
		
		for(var i=1;i<=6;i++){
			p = rotate(p, pos, Pi/3);
			ctx.lineTo(p.x, p.y);
		}

		ctx.fill();
	}
}
