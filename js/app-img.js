var svgns = "http://www.w3.org/2000/svg";
var canvas = undefined;
var drawpad = undefined;
var svgDrawpad = undefined;
var drawpadActive = undefined;

var drawnpad = undefined;
var svgDrawnpad = undefined;
var controlSelected = undefined;
var currentControlObj = undefined;
var controlStartPoints = { X : undefined, Y : undefined };

var selectedDrawnElement= undefined;

var rectCount = 0;

function addMouseMember(eleObj) {
	eleObj.mouseIsOver = false;
	eleObj.mouseDown = false;
	
	$(eleObj).mousedown(function() { eleObj.mouseDown = true; });
	$(eleObj).mouseup(function() { eleObj.mouseDown = false; });
	
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
		
		$(drawnpad).css("width", w).css("height", h);
		$(svgDrawnpad).attr("width", w).attr("height", h);
		
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

function clickOnDrawnElements(ele) {
	if(ele.selected == false) {
		window.selectDrawnElement(ele);
	} else if(ele.selected == true) {
		window.unselectDrawnElement(ele);
	}
}

function selectDrawnElement(ele) {
	if(window.selectedDrawnElement !== undefined) {
		window.selectedDrawnElement.selected = false;
		window.unselectDrawnElement(window.selectedDrawnElement);
	}
	ele.selected = true;
	ele.setAttributeNS(null, "stroke", "yellow")
	window.selectedDrawnElement = ele;
}

function unselectDrawnElement(ele) {
	ele.selected = false;
	ele.setAttributeNS(null, "stroke", "white")
	window.selectedDrawnElement = undefined;
}

function placeControl(pos) {
	var ele = undefined;
	var dpPos = $(drawpad).position();
	
	if(window.controlSelected === "rectangle") {
		ele = document.createElementNS(svgns, 'rect');
		ele.setAttributeNS(null, 'x', currentControlObj.getAttributeNS(null, 'x'));
	    ele.setAttributeNS(null, 'y', currentControlObj.getAttributeNS(null, 'y'));
	    ele.setAttributeNS(null, 'height', currentControlObj.getAttributeNS(null, 'height'));
	    ele.setAttributeNS(null, 'width', currentControlObj.getAttributeNS(null, 'width'));
	    ele.setAttributeNS(null, 'fill', "transparent");
	    ele.setAttributeNS(null, 'stroke', "white");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'id', "__control-rect-"+(rectCount+1).toString());
  } else if(window.controlSelected === "arrow") {
		ele = document.createElementNS(svgns, 'line');
		ele.setAttributeNS(null, 'x1', currentControlObj.getAttributeNS(null, 'x1'));
		ele.setAttributeNS(null, 'x2', currentControlObj.getAttributeNS(null, 'x2'));
		ele.setAttributeNS(null, 'y1', currentControlObj.getAttributeNS(null, 'y1'));
		ele.setAttributeNS(null, 'y2', currentControlObj.getAttributeNS(null, 'y2'));
	    
	    
	    ele.setAttributeNS(null, 'fill', "white");
	    ele.setAttributeNS(null, 'stroke', "white");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'id', "__control-circle-"+(rectCount+1).toString());
	    
  } else if(window.controlSelected === "circle") {
		ele = document.createElementNS(svgns, 'circle');
		
		ele.setAttributeNS(null, 'cx', currentControlObj.getAttributeNS(null, 'cx'));
	    ele.setAttributeNS(null, 'cy', currentControlObj.getAttributeNS(null, 'cy'));
	    ele.setAttributeNS(null, 'r', currentControlObj.getAttributeNS(null, 'r'));
	    ele.setAttributeNS(null, 'fill', "transparent");
	    ele.setAttributeNS(null, 'stroke', "white");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'stroke-width', "2");
	    ele.setAttributeNS(null, 'id', "__control-arrow-"+(rectCount+1).toString());
   }
   
   ele.selected = false;
   window.bindEvent(ele, "click", function() { window.clickOnDrawnElements(this); } );
   window.addMouseMember(ele);
   
   $(svgDrawnpad).append(ele);
   window.rectCount++;
    
   window.unsetControl();
   window.changeDrawPadStatus(0);
   window.unsetControlSelected();
}

function drawControl(pos) {
	window.currentControlObj = undefined;
	var dpPos = $(drawpad).position();
	
	if(window.controlSelected === "rectangle") {
		currentControlObj = document.createElementNS(svgns, 'rect');
		
		currentControlObj.setAttributeNS(null, 'x', parseInt(pos.X) - parseInt(dpPos.left));
	    currentControlObj.setAttributeNS(null, 'y', parseInt(pos.Y) - parseInt(dpPos.top));
	    currentControlObj.setAttributeNS(null, 'height', parseInt(pos.Y) - parseInt(pos.Y));
	    currentControlObj.setAttributeNS(null, 'width', parseInt(pos.X) - parseInt(pos.X));
	    currentControlObj.setAttributeNS(null, 'fill', "transparent");
	    currentControlObj.setAttributeNS(null, 'stroke', "white");
	    currentControlObj.setAttributeNS(null, 'stroke-width', "2");
  } else if(window.controlSelected === "arrow") {
  		currentControlObj = document.createElementNS(svgns, 'line');
		
		currentControlObj.setAttributeNS(null, 'x1', pos.X - dpPos.left);
	    currentControlObj.setAttributeNS(null, 'y1', pos.Y - dpPos.top);
	    currentControlObj.setAttributeNS(null, 'x2', pos.X - dpPos.left);
	    currentControlObj.setAttributeNS(null, 'y2', pos.Y - dpPos.top);
	    
	    currentControlObj.setAttributeNS(null, 'fill', "white");
	    currentControlObj.setAttributeNS(null, 'stroke', "white");
	    currentControlObj.setAttributeNS(null, 'stroke-width', "2");
	    
  } else if(window.controlSelected === "circle") {
		currentControlObj = document.createElementNS(svgns, 'circle');
		
		var cx = parseInt(pos.X) - parseInt(dpPos.left);
		var cy = parseInt(pos.Y) - parseInt(dpPos.top);
		
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
	if(window.currentControlObj !== undefined) {
		var dpPos = $(drawpad).position();
		
		if(window.controlSelected === "rectangle") {
			var width = parseInt(pos.X) - window.controlStartPoints.X - dpPos.left;
			var x = currentControlObj.getAttributeNS(null, 'x');
			var height = parseInt(pos.Y) - window.controlStartPoints.Y - dpPos.top;
			var y = currentControlObj.getAttributeNS(null, 'y');
			
			if(width < 0) {
				x = parseInt(pos.X) - dpPos.left;
			}
			if(height < 0 ){
				y = parseInt(pos.Y) - dpPos.top;
			}
			
			currentControlObj.setAttributeNS(null, 'x', x);
			currentControlObj.setAttributeNS(null, 'y', y);
			currentControlObj.setAttributeNS(null, 'height', Math.abs(height));
		    currentControlObj.setAttributeNS(null, 'width', Math.abs(width));
		  } else if(window.controlSelected === "arrow") { 
		  		currentControlObj.setAttributeNS(null, 'x2', pos.X - dpPos.left);
		    	currentControlObj.setAttributeNS(null, 'y2', pos.Y - dpPos.top);
		  } else if(window.currentControlObj !== "circle") {
			var cX = parseInt(Math.abs(parseInt(window.controlStartPoints.X) + parseInt(pos.X)) /2) - parseInt(dpPos.left);
			var cY = parseInt(Math.abs(parseInt(window.controlStartPoints.Y) + parseInt(pos.Y))/2)  - parseInt(dpPos.top);
			var r = Math.pow(parseInt(pos.X) - window.controlStartPoints.X, 2) + Math.pow(parseInt(pos.Y) - window.controlStartPoints.Y, 2) 
			r = parseInt(Math.sqrt(r)/2);
			
			currentControlObj.setAttributeNS(null, 'cx', cX);
		    currentControlObj.setAttributeNS(null, 'cy', cY);
		    currentControlObj.setAttributeNS(null, 'r', r);
		}
	}
}


function selectControl(controlName, ele) {
	if(window.controlSelected === controlName) {
		window.controlSelected = undefined;
		$(ele).children().css("border-color","black");
		window.changeDrawPadStatus(0);
	}
	else {
		window.controlSelected = controlName;
		window.changeDrawPadStatus(1);
		$(ele).children().css("border-color","red");
	}
	if(window.selectedDrawnElement !== undefined) {
		window.selectedDrawnElement.selected = false;
		window.unselectDrawnElement(window.selectedDrawnElement);	
		window.selectedDrawnElement = undefined;
	}
	
}

function unsetControl() {
	console.log("usetting... draw control");
	$(window.currentControlObj).remove();
}

function unsetControlSelected() {
	window.controlSelected = undefined;
}

function changeDrawPadStatus(status) { // 1 -on, 0 -off
	if(status == 1) {
		$(drawpad).css("display","block");
		window.drawpadActive = true;
	} else {
		$(drawpad).css("display","none");
		window.drawpadActive = false;
		drawpad.mouseIsOver = false;
		drawpad.mouseDown = false;
	}
	unsetControl();
	window.resetControlStartPoint();
}


function assignControlStartPoint(point) {
	window.controlStartPoints.X = point.X;
	window.controlStartPoints.Y = point.Y;
}

function resetControlStartPoint() {
	console.log("re-setting....");
	window.controlStartPoints.X = undefined;
	window.controlStartPoints.Y = undefined;
}

/*
function moveDrawnElement(pos) {
	if(window.selectedDrawnElement !== undefined) {
		if(window.selectedDrawnElement.mouseDown == true) {
			var tagName = window.selectedDrawnElement.tagName; 
			if(tagName === "rect") {
				var dpPos = $(drawpad).position();
				//window.selectedDrawnElement.setAttributeNS(null, "x", pos.X - dpPos.left);
				//window.selectedDrawnElement.setAttributeNS(null, "y", pos.Y - dpPos.top);
			}
		}
	}
}*/



$(document).ready(function() {
	canvas = $("#__canvas");
	drawpad = $("#__canvas-draw-pad");
	svgDrawpad = $(drawpad).children("#__draw-pad-svg");
	drawpadActive = false;
	
	drawnpad = $("#__canvas-drawn-pad");
	svgDrawnpad = $(drawnpad).children("#__drawn-pad-svg");
	
	$('#__controls div[control-select="active"]').click(function(e) {
		window.selectControl($(this).attr('control-name'), this);
	});
	
	window.loadImage();
	
	window.addMouseMember(drawnpad);
	window.addMouseMember(drawpad);
	
	$(document).mousemove(function(e) {
		if(drawpad.mouseIsOver === true) {
			window.markCoOrdinates(e.pageX, e.pageY);
			
			if(window.controlStartPoints.X !== undefined && window.controlStartPoints.Y !== undefined) {
				window.changeDimensions({ X:e.pageX, Y:e.pageY });
			}
		}
	});	
	
	$(document).click(function(e) {
		if(drawpad.mouseIsOver === true) {
			//alert(window.controlStartPoints.X + " " + window.controlStartPoints.Y);
			 if(window.controlSelected != undefined &&  window.controlStartPoints.X === undefined) {
			 	window.assignControlStartPoint({ X:e.pageX, Y:e.pageY });
			 	window.drawControl({ X:e.pageX, Y:e.pageY });
			 	note2();
			 } else if(window.controlSelected !== undefined && window.controlStartPoints.X !== undefined) {
			 	window.placeControl({ X:e.pageX, Y:e.pageY });
			 	note2();
			 	note3();
			 } 
		}
		
		
		if(drawnpad.mouseIsOver === true) {
			if(window.selectedDrawnElement !== undefined) {
			 	if(window.selectedDrawnElement.mouseIsOver == true) {
					//Already handled
				} else  {
					window.unselectDrawnElement(window.selectedDrawnElement);
					window.selectedDrawnElement = undefined;
				}	
				
			 } 
		}
	});
	
	$(document).mousedown(function(e) {
		
		/*
		if(drawnpad.mouseIsOver === true) {
					if(window.selectedDrawnElement !== undefined) {
						 if(window.selectedDrawnElement.mouseIsOver == true) {
							window.moveDrawnElement({ X:e.pageX, Y:e.pageY });
						} else  {
							
						}	
											  } 
				}*/
		
	});
});