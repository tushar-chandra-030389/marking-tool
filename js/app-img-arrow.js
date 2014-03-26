var svgns = "http://www.w3.org/2000/svg";
var canvas = undefined;
var drawpad = undefined;
var svgDrawpad = undefined;
var controlSelected = undefined;
var currentControlObj = undefined;
var controlStartPoints = { X : undefined, Y : undefined };

var rectCount = 0;

function addMouseParameters(eleObj) {
	eleObj.mouseIsOver = false;
	eleObj.mouseClick = false;
	
	$(eleObj).mousedown(function() { eleObj.mouseClick = true; });
	$(eleObj).mouseup(function() { eleObj.mouseClick = false; });
	
	$(eleObj).mouseenter(function() { eleObj.mouseIsOver = true; });
	$(eleObj).mouseleave(function() { eleObj.mouseIsOver = false; });
}

function loadImage() {
	var context = $(canvas)[0].getContext("2d");
	var img = new Image();
	img.onload = function () {
		var w = img.width * .5;
		var h = img.height * .5;
		$(canvas).attr("width", w).attr("height", h);
		$(drawpad).css("width", w).css("height", h);
		$(svgDrawpad).attr("width", w).attr("height", h);
		context.drawImage(img, 0, 0, w, h);
	}
	img.src = "http://localhost/canvas/img/img.jpg";
}

function markCoOrdinates(x,y) {
	var pos = $(drawpad).position();
	$("#__note").text("X:"+ (parseInt(x) - parseInt(pos.left)).toString() +",Y:"+ (parseInt(y) - parseInt(pos.top)).toString() );
}

function note2() {
	$("#__note2").text(controlStartPoints.X + " " + controlStartPoints.Y + " " + window.controlSelected);
}

function note3() {
	$("#__note3").text("Rect Count : " + window.rectCount);
}

function bindEvent(element, type, handler) {
	if(element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		element.attachEvent("on"+type, handler);
	}
}

function placeControl(pos) {
	var ele = undefined;
	var dpPos = $(drawpad).position();
	
	if(window.controlSelected === "arrow") {
		ele = document.createElementNS(svgns, 'line');
		ele.setAttributeNS(null, 'x1', currentControlObj.getAttributeNS(null, 'x1'));
		ele.setAttributeNS(null, 'x2', currentControlObj.getAttributeNS(null, 'x2'));
		ele.setAttributeNS(null, 'y1', currentControlObj.getAttributeNS(null, 'y1'));
		ele.setAttributeNS(null, 'y2', currentControlObj.getAttributeNS(null, 'y2'));
	    
	    
	    ele.setAttributeNS(null, 'fill', "white");
	    ele.setAttributeNS(null, 'stroke', "white");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'id', "__control-rect-"+(rectCount+1).toString());
	    
	    window.bindEvent(ele, "click", function(ele) { $(ele).attr("fill", "red"); alert("ds"); });
   }
   $(svgDrawpad).append(ele);
   window.rectCount++;
    
   window.controlStartPoints = { X : undefined, Y : undefined };
   $(window.currentControlObj).remove();
   window.currentControlObj = undefined;
   window.unsetControl();
}

function drawControl(pos) {
	window.currentControlObj = undefined;
	var dpPos = $(drawpad).position();
	
	if(window.controlSelected === "arrow") {
		currentControlObj = document.createElementNS(svgns, 'line');
		
		currentControlObj.setAttributeNS(null, 'x1', pos.X - dpPos.left);
	    currentControlObj.setAttributeNS(null, 'y1', pos.Y - dpPos.top);
	    currentControlObj.setAttributeNS(null, 'x2', pos.X - dpPos.left);
	    currentControlObj.setAttributeNS(null, 'y2', pos.Y - dpPos.top);
	    
	    currentControlObj.setAttributeNS(null, 'fill', "white");
	    currentControlObj.setAttributeNS(null, 'stroke', "white");
	    currentControlObj.setAttributeNS(null, 'stroke-width', "2");
   }
   $(svgDrawpad).append(currentControlObj);
}

function changeDimensions(pos) {
	var dpPos = $(drawpad).position();
	if(window.currentControlObj !== undefined) {
		currentControlObj.setAttributeNS(null, 'x2', pos.X - dpPos.left);
	    currentControlObj.setAttributeNS(null, 'y2', pos.Y - dpPos.top);
	}
}


function selectControl(controlName, ele) {
	if(window.controlSelected === controlName) {
		window.controlSelected = undefined;
		$(ele).children().css("border-color","black");
		window.resetControlStartPoint();
	}
	else {
		window.controlSelected = controlName;
		$(ele).children().css("border-color","red");
	}
}

function unsetControl() {
	window.crontrolSelected = undefined;
}

function assignControlStartPoint(point) {
	window.controlStartPoints.X = point.X;
	window.controlStartPoints.Y = point.Y;
}

function resetControlStartPoint() {
	window.controlStartPoints.X = undefined;
	window.controlStartPoints.Y = undefined;
}

$(document).ready(function() {
	canvas = $("#__canvas");
	drawpad = $("#__canvas-draw-pad");
	svgDrawpad = $(drawpad).children("#__draw-pad-svg");
	
	
	$('#__controls div[control-select="active"]').click(function(e) {
		window.selectControl($(this).attr('control-name'), this);
		
	});
	
	window.loadImage();
	
	window.addMouseParameters(drawpad);
	
	$(document).mousemove(function(e) {
		if(drawpad.mouseIsOver === true) {
			window.markCoOrdinates(e.pageX, e.pageY);
			//console.log($(controlTemplate));
			if(window.controlStartPoints.X !== undefined && window.controlStartPoints.Y !== undefined) {
				window.changeDimensions({ X:e.pageX, Y:e.pageY })
			}
		}
	});	
	
	$(document).click(function(e) {
		if(drawpad.mouseIsOver === true) {
			 if(window.controlStartPoints.X === undefined) {
			 	window.assignControlStartPoint({ X:e.pageX, Y:e.pageY });
			 	window.drawControl({ X:e.pageX, Y:e.pageY });
			 	note2();
			 } else {
			 	window.placeControl({ X:e.pageX, Y:e.pageY });
			 	note2();
			 	note3();
			 }
		}
	});
});