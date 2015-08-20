// Update game objects
var update = function (modifier) {

	if (38 in keysDown) { // Player holding up
		viewport.setZoom(viewport.getZoom()-5*modifier);
	}
	if (40 in keysDown) { // Player holding down
		viewport.setZoom(viewport.getZoom()+5*modifier);
	}
	if (37 in keysDown) { // Player holding left
		viewport.setAngle(viewport.getAngle()-Pi/4*modifier);
	}
	if (39 in keysDown) { // Player holding right
		viewport.setAngle(viewport.getAngle()+Pi/4*modifier);
	}
	if (87 in keysDown) {//W
		viewport.mid.y-=500*modifier*viewport.getCos();
		viewport.mid.x+=500*modifier*viewport.getSin();
	}
	if (83 in keysDown) {//S
		viewport.mid.y+=500*modifier*viewport.getCos();
		viewport.mid.x-=500*modifier*viewport.getSin();
	}
	if (65 in keysDown) {//A
		viewport.mid.y-=500*modifier*viewport.getSin();
		viewport.mid.x-=500*modifier*viewport.getCos();
	}
	if (68 in keysDown) {//D
		viewport.mid.y+=500*modifier*viewport.getSin();
		viewport.mid.x+=500*modifier*viewport.getCos();
	}
	
	mw = viewport.getW();
	mh = viewport.getH();
	if(mw/mh>preferredRatio) mw = mh * preferredRatio;
	else mh = mw / preferredRatio;
	
	if(mousePos.x/mw<=(MenuRect.x+MenuRect.w)&&mousePos.x/mw>=MenuRect.x&&mousePos.y/mh<=(MenuRect.y+MenuRect.h)&&mousePos.y/mh>=MenuRect.y){
		
		contraction += modifier/contractionTime;
		contraction = Math.min(1.0,contraction);
		
		var h = (mousePos.y / mh - MenuRect.y - menuHeadH) / (MenuRect.h - menuFooterH - menuHeadH);
		if(h>=0&&h<=1){
			selectedItem = Math.floor(h * menuItems.length);
			menuItems[selectedItem].selected += 10.4 * modifier;
			menuItems[selectedItem].selected = clamp(menuItems[selectedItem].selected, 0.0, 1.0);
		}
		else selectedItem = -1;
		
		for(var i=0;i<menuItems.length;i++){
			menuItems[i].selected = clamp(menuItems[i].selected - 4.1 * modifier, 0.0, 1.0);
		}
		
		if(mouseDown && !prevMouseDown){
			if(selectedItem != -1) menuItems[selectedItem].action();
		}
	}
	else{
		contraction -= modifier/contractionTime;
		contraction = Math.max(0.0,contraction);
		
		
		if(mouseDown && !prevMouseDown){
			mouseActions[mouseAction]();
		}
	}
	
	MenuRect.x = MenuRectContracted.x + clamp(contraction / contractionPoint1, 0.0, 1.0) * (MenuRectNonContracted.x - MenuRectContracted.x);
	MenuRect.w = MenuRectContracted.w + clamp(contraction / contractionPoint1, 0.0, 1.0) * (MenuRectNonContracted.w - MenuRectContracted.w);
	MenuRect.y = MenuRectContracted.y + clamp((contraction - contractionPoint1) / (contractionPoint2 - contractionPoint1), 0.0, 1.0) * (MenuRectNonContracted.y - MenuRectContracted.y);
	MenuRect.h = MenuRectContracted.h + clamp((contraction - contractionPoint1) / (contractionPoint2 - contractionPoint1), 0.0, 1.0) * (MenuRectNonContracted.h - MenuRectContracted.h);
	MenuRect.shadowa = MenuRectContracted.shadowa + clamp((contraction - contractionPoint1) / (contractionPoint2 - contractionPoint1), 0.0, 1.0) * (MenuRectNonContracted.shadowa - MenuRectContracted.shadowa);
	MenuRect.shadowb = MenuRectContracted.shadowb + clamp((contraction - contractionPoint1) / (contractionPoint2 - contractionPoint1), 0.0, 1.0) * (MenuRectNonContracted.shadowb - MenuRectContracted.shadowb);
	MenuRect.shadowx = MenuRectContracted.shadowx + clamp((contraction - contractionPoint1) / (contractionPoint2 - contractionPoint1), 0.0, 1.0) * (MenuRectNonContracted.shadowx - MenuRectContracted.shadowx);
	MenuRect.shadowy = MenuRectContracted.shadowy + clamp((contraction - contractionPoint1) / (contractionPoint2 - contractionPoint1), 0.0, 1.0) * (MenuRectNonContracted.shadowy - MenuRectContracted.shadowy);
	MenuRect.texta = MenuRectContracted.texta + clamp((contraction - contractionPoint2) / (1 - contractionPoint2), 0.0, 1.0) * (MenuRectNonContracted.texta - MenuRectContracted.texta);
	
	if(mouseOver != prevMouseOver){
		Processes.add(mouseOver, new ProcessPulseCursor());
		Processes.add(mouseOver, new ProcessUnfadeCursor());
		//Processes.add({tile:mouseOver, maxSpeed:5.65, acceleration:0.95, speed:0.01}, new ProcessRotateTile());
	}

	
	Processes.update(modifier, mouseOver);
	
	prevMouseOver = mouseOver;
	prevMouseDown = mouseDown;
	
	var mouseP = rotate({x:mousePos.x-viewport.getW()/2+viewport.mid.x, y:mousePos.y-viewport.getH()/2+viewport.mid.y}, viewport.mid, viewport.getAngle());
	mouseOver = findHexagon(mouseP.x, mouseP.y, TileGridW, TileGridH, viewport.getZoom());
};
