//Menu objects
var menuItems = [
				{name:'Change palette',action:function(){
					palette = mod(palette + 1, palettes.length)
					setPalette(palette);
				},selected:0.0},
				{name:'Change mouse action',action:function(){
					mouseAction = mod(mouseAction + 1, mouseActions.length);
				},selected:0.0}
				];
var menuItemH = 0.081;
var menuItemTextSizeToH = 0.5;
var menuHeadH = 0.18;
var menuFooterH = 0.072;
var selectedItem = -1;
var MenuRectNonContracted = {x:0.052, y:0.088, w:0.29, h:menuHeadH + menuItems.length * menuItemH + menuFooterH, shadowa:0.52, shadowb:6, shadowx:-0.0125, shadowy:0.025, texta:1.0};
var MenuRectContracted = {x:0.052, y:0.088, w:0.04, h:0.07, shadowa:0.63, shadowb:2, shadowx:-0.005, shadowy:0.01, texta:0.0};
var contractionTime = 0.55;//in seconds
var contractionPoint1 = 0.4;//0-1
var contractionPoint2 = 0.7;//0-1
var preferredRatio = 1.78;

var mw;
var mh;

var MenuRect = {x:MenuRectContracted.x, y:MenuRectContracted.y, w:MenuRectContracted.w, h:MenuRectContracted.h, shadowa:MenuRectContracted.shadowa, shadowb:MenuRectContracted.shadowb, shadowx:MenuRectContracted.shadowx, shadowy:MenuRectContracted.shadowy, texta:MenuRectContracted.texta};
var contraction = 0.0;//0-1

var drawMenu = function(){
	var titleFontSize = Math.floor(MenuRect.w * mw * 0.142);
	ctx.lineWidth = 0;
	ctx.fillStyle = 'rgb(60, 60, 69)';
	ctx.shadowColor = 'rgba(0, 0, 0, ' + MenuRect.shadowa + ')';
	ctx.shadowBlur = MenuRect.shadowb;
	ctx.shadowOffsetX = MenuRect.shadowx * mw;
	ctx.shadowOffsetY = MenuRect.shadowy * mh;
	ctx.fillRect(MenuRect.x * mw, MenuRect.y * mh, MenuRect.w * mw, MenuRect.h * mh);
	ctx.shadowColor = '#000000';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	var selBorder = MenuRect.w * 0.024
	for(var i=0;i<menuItems.length;i++)
	{
		ctx.fillStyle = 'rgba(255, 255, 255, ' + 0.12 * menuItems[i].selected + ')';
		ctx.fillRect((MenuRect.x + selBorder) * mw, (MenuRect.y + menuHeadH + menuItemH * i + selBorder) * mh, (MenuRect.w  - selBorder - selBorder) * mw, (menuItemH - selBorder - selBorder) * mh);
	}
	ctx.textAlign = 'center';
	ctx.fillStyle = 'rgba(235, 235, 246, ' + MenuRect.texta + ')';
	ctx.font = 'italic ' + titleFontSize + 'px Georgia';
	ctx.fillText("Hekzagon", (MenuRect.x + MenuRect.x + MenuRect.w) * mw / 2, (MenuRect.y + 0.028) * mh + titleFontSize);
	//ctx.font = 'italic ' + (Math.floor(MenuRect.h * mh / 2 * 0.1)) + 'px Georgia';
	//ctx.fillText("Menu coming soon", (MenuRect.x + MenuRect.x + MenuRect.w) * mw / 2, (MenuRect.y + MenuRect.y + MenuRect.h * 1.55) * mh / 2);
	//ctx.fillStyle = 'rgba(235, 235, 246, ' + MenuRect.texta * 0.7 + ')';
	ctx.textAlign = 'left';
	ctx.font = 'italic ' + Math.floor(menuItemH * menuItemTextSizeToH * mh) + 'px Georgia';
	for(var i = 0; i < menuItems.length; i++){
		ctx.fillText(menuItems[i].name, (MenuRect.x + 0.022) * mw, (MenuRect.y + menuHeadH + menuItemH * (i + (1 + menuItemTextSizeToH) / 2)) * mh);
	}
	ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
	ctx.fillRect(mousePos.x - 3, mousePos.y - 3, 6, 6);
}
