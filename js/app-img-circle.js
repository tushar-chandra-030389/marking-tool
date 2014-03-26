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
	
	if(window.controlSelected === "circle") {
		ele = document.createElementNS(svgns, 'circle');
		console.log("cx : "+currentControlObj.getAttributeNS(null, 'cx'));
		ele.setAttributeNS(null, 'cx', currentControlObj.getAttributeNS(null, 'cx'));
	    ele.setAttributeNS(null, 'cy', currentControlObj.getAttributeNS(null, 'cy'));
	    ele.setAttributeNS(null, 'r', currentControlObj.getAttributeNS(null, 'r'));
	    ele.setAttributeNS(null, 'fill', "transparent");
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
	
	if(window.controlSelected === "circle") {
		currentControlObj = document.createElementNS(svgns, 'circle');
		
		var cx = parseInt(pos.X) - parseInt(dpPos.left);
		var cy = parseInt(pos.Y) - parseInt(dpPos.top);
		
		//console.log("X : "+ cx + "  Y : " + cy);
		
		currentControlObj.setAttributeNS(null, 'cx', cx);
	    currentControlObj.setAttributeNS(null, 'cy', cy);
	    currentControlObj.setAttributeNS(null, 'r', 0);
	    
	    currentControlObj.setAttributeNS(null, 'fill', "transparent");
	    currentControlObj.setAttributeNS(null, 'stroke', "white");
	    currentControlObj.setAttributeNS(null, 'stroke-width', "2");
   }
   $(svgDrawpad).append(currentControlObj);
}

function changeDimensions(pos) {
	var dpPos = $(drawpad).position();
	if(window.currentControlObj !== undefined) {
		var cX = parseInt(Math.abs(parseInt(window.controlStartPoints.X) + parseInt(pos.X)) /2) - parseInt(dpPos.left);
		var cY = parseInt(Math.abs(parseInt(window.controlStartPoints.Y) + parseInt(pos.Y))/2)  - parseInt(dpPos.top);
		var r = Math.pow(parseInt(pos.X) - window.controlStartPoints.X, 2) + Math.pow(parseInt(pos.Y) - window.controlStartPoints.Y, 2) 
		r = parseInt(Math.sqrt(r)/2);
		
		//console.log("IX:"+window.controlStartPoints.X+" > CX:"+parseInt(pos.X)+" > X:"+cX+" > Y:"+cY+" > R:"+r);
		
		currentControlObj.setAttributeNS(null, 'cx', cX);
	    currentControlObj.setAttributeNS(null, 'cy', cY);
	    currentControlObj.setAttributeNS(null, 'r', r);
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