jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
};

jQuery.fn.relHCenter = function () {
    this.css("position","absolute");
    this.css("left", ((this.parent().width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
};

jQuery.fn.relVCenter = function () {
    this.css("position","absolute");
    this.css("top", ((this.parent().height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    return this;
};

MarkingTool = {
	svgns : "http://www.w3.org/2000/svg",
	
	options : undefined,
	
	imageLoaded : false,
	ratio : undefined, /* (Original / Visible) */
	
	color : undefined,
	strokeWidth : undefined,
	
	viewport : undefined,
	holder : undefined,
	holderPosition : { x : undefined ,y : undefined },
	canvas : undefined,
	drawpad : undefined,
	drawsvg : undefined,
	drawnpad : undefined,
	drawnsvg : undefined,
	width : undefined,
	height : undefined,
	
	image : undefined, 
	
	controlHolder : undefined,
	controls : undefined,
	
	activeControl : undefined,
	activeControlParent : undefined,
	
	actionHolder : undefined,
	actions : undefined,
	
	ControlContainer : undefined,
	
	sizeChangeEvent : undefined,
	
	init : function(params) {	
		this.options = params
		if(typeof params == 'object')
			this.fillOptions()
		
		this.activeControlParent = new this.setActiveControlParent()
		
		this.addMouseMember(this.drawnpad)
		this.addMouseMember(this.drawpad)
		this.bindMouseInPadEvents()
		
		this.ControlContainer = new ControlContainer()
		this.setColor('#fff')
		this.setStrokeWidth(2)
		
		return this
	},
	
	fillOptions : function() {
		for(key in this.options) {
			switch(key) {
				case 'holder' : 
					this.setHolder(this.options[key])
					this.setCanvas()
					this.setDrawnPad()
					this.setDrawPad()
					break
				
				case 'width' : 
					this.width = this.options[key]
					break
					
				case 'height' : 
					this.height = this.options[key]
					break
					
				case 'image' : 
					this.loadImage(this.options[key])
					break
					
				case 'controlHolder' :
					this.setControlHolder(this.options[key])
					break
				
				case 'controls' : 
					if(this.controlHolder !== undefined)
						this.setControls(this.options[key])
					break		
				
				case 'actionHolder' :
					this.setActionHolder(this.options[key])
					break
				
				case 'actions' : 
					if(this.actionHolder !== undefined)
						this.setActions(this.options[key])
					break
					
				case 'sizeChange' : 
					this.sizeChangeEvent = this.options[key]
			}
		}
	},
	
	setHolder : function(holderId) {
		this.holder = $('#'+holderId)[0]
		this.viewport = $(this.holder).parent()
	},
	
	setHolderPosition : function() {
		var posvp = $(this.viewport).position()
		var poshd = $(this.holder).position()
		this.holderPosition.x =  posvp.left + poshd.left
		this.holderPosition.y =  posvp.top + poshd.top
		
	}, 
	
	setCanvas : function() {
		if(this.holder === undefined || this.holder.length === 0)
			console.log('No holder found')
		else {
			this.canvas = $(this.holder).children('canvas')[0]
		}	
	},
	
	setDrawnPad : function() {
		if(this.holder === undefined || this.holder.length === 0)
			console.log('No holder found')
		else {
			this.drawnpad = $(this.holder).children('div')[0]
			this.setDrawnSvg()
		}
	},
	
	setDrawnSvg : function() {
		this.drawnsvg = $(this.drawnpad).children('svg')[0]
	},
	
	setDrawPad : function() {
		if(this.holder === undefined || this.holder.length === 0)
			console.log('No holder found')
		else {
			this.drawpad = $(this.holder).children('div')[1]
			this.setDrawSvg()
		}
	},
	
	setDrawSvg : function() {
		this.drawsvg = $(this.drawpad).children('svg')[0]
	},
	
	/**
	 * @param {Bool} s 0 -> display : none, 1 -> display : block
	 */
	toggleDrawPadDisplay : function(s) {
		if(s === 1)
			$(this.drawpad).css('display', 'block')
		else if(s === 0)
			$(this.drawpad).css('display', 'none')
	},
	
	/**
	 * @param {String} color Hexadecimal code for color
	 */
	setColor : function(c) {
		this.color = c
	},
	
	/**
	 * @param {Integer} w Stroke width
	 */
	setStrokeWidth : function(w) {
		this.strokeWidth = w
	},
	
	loadImage : function(path) {
		this.image = new Image()
		this.image.onload = function(th) { 
			return function() {
				th.imageOnLoad(th) 
			}
		}(this)
		
		this.image.src = path
	},
	
	/**
	 * 
 	 * @param {Object} o Object of MarkingTool
	*/
	imageOnLoad : function(th) {
		if(th.width === undefined && th.height === undefined) {
			if(th.image.width > th.image.height) {
				var rw = $(th.viewport).width() / th.image.width
				th.setWidth(th.image.width * (rw * .96))
				th.setHeight(th.image.height * (rw * .96))	
			} else {
				var rh = $(th.viewport).height() / th.image.height
				th.setWidth(th.image.width * (rh * .96))
				th.setHeight(th.image.height * (rh * .96))
			}
		} else if(th.width !== undefined){
			th.setHeightRespectToWidth()
		} else if(th.height !== undefined) {
			th.setWidthRespectToHeight()
		}
		
		th.setDimensions()
		th.setHolderPosition()
		th.renderImage()
			
		th.imageLoaded = true
	},
	
	setWidth : function(w) {
		this.width = w
	},
	
	setHeight : function(h) {
		this.height = h
	},
	
	setHeightRespectToWidth : function() {
		var r = this.image.width / this.image.height
		h = ( 1 / r ) * this.width
		this.setHeight(h) 
	},
	
	setWidthRespectToHeight : function() {
		var r = this.image.width / this.image.height
		w = ( r ) * this.height
		this.setWidth(w)
	},
	
	setDimensions : function() {
		var centerCoOrd = this.getVisibleImageCenterCoOrd()
		
		
		this.canvas.width = this.width
		this.canvas.height = this.height
		
		$(this.holder).css('width', this.width).css("height", this.height)
		
		$(this.drawnpad).css("width", this.width).css("height", this.height)
		$(this.drawnsvg).attr("width", this.width).attr("height", this.height)
		
		$(this.drawpad).css("width", this.width).css("height", this.height)
		$(this.drawsvg).attr("width", this.width).attr("height", this.height)
		
		this.ratio = this.image.width / this.width
		
		this.adjustPlacement()
		
		this.setHolderPosition()
		
		
		this.pannImageCenteredTo(centerCoOrd.x,centerCoOrd.y)
		
		if(this.sizeChangeEvent !== undefined) {
			this.sizeChangeEvent.call(this, this)
		}
	},
	
	renderImage : function() {
		var context = $(this.canvas)[0].getContext("2d")
		context.drawImage(this.image, 0, 0, this.width, this.height)
	},
	
	resizeAllRenderedSvgs : function() {
		for(var i=0; i<this.ControlContainer.getNewCount(); i++) {
			var c = this.ControlContainer.getNewControl(i)
			if(c !== undefined){
				c.changeDimension(c.endAt.x * (1 / this.ratio), c.endAt.y * (1 / this.ratio), this)
			}
		}
		
		for(var i=0; i<this.ControlContainer.getOldCount(); i++) {
			var c = this.ControlContainer.getOldControl(i)
			if(c !== undefined){
				c.changeDimension(c.endAt.x * (1 / this.ratio), c.endAt.y * (1 / this.ratio), this)
			}
		}
	},
	
	getVisibleImageCenterCoOrd : function() {
		var $holder = $(this.holder)
		var $viewport = $(this.viewport)
		var pos = $holder.position()
		
		var o = {x:undefined, y:undefined}
		
		if($holder.width() <= $viewport.width()) {
			o.x =  parseInt($holder.width()/2)
		} else {
			o.x = parseInt(Math.abs(pos.left))+parseInt($viewport.width() / 2)
		}
		
		if($holder.height() <= $viewport.height()) {
			o.y =  parseInt($holder.height()/2)
		} else {
			o.y = parseInt(Math.abs(pos.top))+parseInt($viewport.height() / 2)
		} 
		
		o.x = parseInt(o.x  * this.ratio)
		o.y = parseInt(o.y  * this.ratio)
		
		return o 
	},
	
	/**
	 * 
 	 * @param {Object} d {width : w} | {height : h}
	 */
	modifyDimensions : function(d) {
		if(this.imageLoaded === false) {
			setTimeout(function(th,d) { return function() {th.modifyDimensions(d)  } }(this,d),1000)
		} else {
			if(d.width !== undefined) {
				var strDim = d.width.toString()
				if((strDim.substr(strDim.length-1,1)) === '%'){
					d.width = this.image.width * parseInt(strDim.substr(0,strDim.length-1)) / 100
				}
				this.setWidth(d.width)
				this.setHeightRespectToWidth()
			} else if(d.height !== undefined) {
				var strDim = d.height.toString()
				if((strDim.substr(strDim.length-1,1)) === '%'){
					d.height = this.image.height * parseInt(strDim.substr(0,strDim.length-1)) / 100 
				}
				this.setHeight(d.height)
				this.setWidthRespectToHeight()
			}
			this.setDimensions()
			this.renderImage()
			this.resizeAllRenderedSvgs()
		}
	},
	
	adjustPlacement : function() {
		var $viewport = $(this.viewport)
		var $holder = $(this.holder)
		
		if($viewport.width() > $holder.width()) {
			$holder.relHCenter()
		} else {
			$holder.css('left',0)	
		}
		
		if($viewport.height() > $holder.height()) {
			$holder.relVCenter()
		} else {
			$holder.css('top',0)
		}
	},
	
	/**
	 * 
	 * @param {Object} o {x1:,y1:,x2:,y2} or {top:,left:}
	 */
	pannImage : function(o) {
		var $viewport = $(this.viewport)
		var $holder = $(this.holder)
		var pos = $holder.position()
		if(o.left !== undefined) {
			console.log(o)
			console.log(this.ratio)
		}
			
		if($holder.width() > $viewport.width()) {
			if(o.left === undefined) {
				o.left = pos.left + (o.x2-o.x1)
			}
			if(o.left > 0 && o.left < parseInt($viewport.width() * .001))
				$holder.css('left', o.left)
			else if(o.left < 0 && ($holder.width() + o.left) > parseInt($viewport.width() * .999) )
				$holder.css('left', o.left)
		}
		
		if($holder.height() > $viewport.height()) {
			if(o.top === undefined) {
				o.top = pos.top + (o.y2-o.y1)	
			}	
			
			if(o.top > 0 && o.top < parseInt($viewport.height() * .001))
				$holder.css('top', o.top)
			else if(o.top < 0 && ($holder.height() + o.top) > parseInt($viewport.height() * .999) )
				$holder.css('top', o.top)
		}
		
		this.setHolderPosition()
	},
	
	pannImageCenteredTo : function(x,y) {
		var $viewport = $(this.viewport)
		this.pannImage({ top : -1 * Math.abs(y / this.ratio - $viewport.height() / 2) , left : -1 * Math.abs(x / this.ratio - $viewport.width() / 2) })
	},
	
	setControlHolder : function(h) {
		this.controlHolder = $('#'+h)[0]
	},
	
	setControls : function(c) {
		this.controls = {}
		for(k in c){
			if(c[k].active !== true)
				continue
			switch(k) {
				case 'rectangle' :
					this.controls.rectangle = {}
					break
					
				case 'circle' :
					this.controls.circle = {}
					break
					
				case 'arrow' :
					this.controls.arrow = {}
					break
				case 'pann' :
					this.controls.pann = {}
					break
			}
			
			if(this.controls[k] !== undefined)
				this.populateControlObject(k, c[k])
		}
	},
	
	populateControlObject : function(name, o) {
		
		this.controls[name].o = $(this.controlHolder).find('[control-name="'+name+'"]')[0]
		this.controls[name].active = false
		$(this.controls[name].o).attr('active','false')
		$(this.controls[name].o).click(function(th, name) { 
			return function(e) { 
				if(th.controls[name].active === false) {
					/* th.setAllControlsActiveStatus(false) */
					if(this.activeControl !== undefined) {
						th.controls[this.activeControl.name].active = false
					}
					th.setActiveControl(name)
					th.controls[name].active = true;
					$(th.controls[name].o).attr('active','true')
					
					if(name === 'pann') {
						th.toggleDrawPadDisplay(0)
						$(th.drawnpad).css('cursor','move')
					}
					else {
						th.toggleDrawPadDisplay(1)
						$(th.drawnpad).css('cursor','crosshair')
					}
						
				} else if(th.controls[name].active === true){
					th.controls[name].active = false;			
					$(th.controls[name].o).attr('active','false')
					th.toggleDrawPadDisplay(0)
					
					if(name === 'pann') {
						$(th.drawnpad).css('cursor','crosshair')
					}
				}
			}
		}(this, name))
		
		if(o.onclick !== undefined)
			$(this.controls[name].o).click(o.onclick)
	},
	
	/**
	 * 
	 * @param {bool} s status
	 */
	setAllControlsActiveStatus : function(s) {
		$.each(this.controls ,(function(th) {
			return function(k, v) {
				if(th.controls[k].active !== s)
					th.controls[k].active = s
			}
		})(this))
	},
	
	/* Set Actions */
	
	setActionHolder : function(h) {
		this.actionHolder = $('#'+h)[0]
	},
	
	setActions : function(c) {
		this.actions = {}
		for(k in c){
			if(c[k].active !== true)
				continue
				
			switch(k) {
				case 'undo' :
					this.actions.undo = {}
					break
				case 'redo' :
					this.actions.redo = {}
					break
				case 'zoom' : 
					this.actions.zoom = {}
					break
			}
			
			if(this.actions[k] !== undefined)
				this.populateActionObject(k, c[k])
		}
	},
	
	populateActionObject : function(name, o) {
		this.actions[name].o = $(this.actionHolder).find('[action-name="'+name+'"]')[0]
		this.actions[name].active = false
		$(this.actions[name].o).attr('active','false')
		
		th = this
		switch(name) {
			case 'undo' : $(this.actions[name].o).click( th.getUndoClick )
				break
			case 'redo' : $(this.actions[name].o).click( th.getRedoClick )
				break
			case 'zoom' : $(this.actions[name].o).children('[name="zoom-value"]').bind('change', function(th) { return function() {
					th.modifyDimensions({width : $(this).val()})
				}} (this))
				break 
		}
		if(o.onclick !== undefined)
			$(this.actions[name].o).click(o.onclick)
	},
	
	getUndoClick : function() {
		c = th.ControlContainer.removeNewControl()
		if(c !== undefined)
			$(c.o).remove()
	},
	
	getRedoClick : function() {
		c = th.ControlContainer.removeRedoControl()
		if(c!==undefined)
			th.addToDrawnPad(c, 0)
	},
	
	/* Active Control Functions */
	
	setActiveControl : function(name) {
		this.activeControl = Object.create(this.activeControlParent)
		this.activeControl.name = name
		
		if(name === 'pann')
			this.activeControl.o = undefined
		else 
			this.activeControl.o = this.getControlSvg(name)
			
		this.activeControl.captureStart = true
		this.activeControl.startAt = { x : undefined ,y : undefined }
		this.activeControl.captureEnd = false
		this.activeControl.endAt = { x : undefined ,y : undefined }
		this.activeControl.coOrdinates = { x : undefined ,y : undefined }
		this.activeControl.color = undefined
		this.activeControl.strokeWidth = undefined
		this.activeControl.ready = false
	},
	
	setActiveControlParent : function() {
		this.setStart = function(x, y, th) {
				this.startAt.x = x * th.ratio
			this.startAt.y = y * th.ratio
			this.captureStart = false
			this.captureEnd = true
		}
		
		this.setEnd = function(x, y, th) {
			if(this.captureStart === false && this.captureEnd === true) {
				this.endAt.x = x * th.ratio
				this.endAt.y = y * th.ratio
				this.captureEnd = false
				this.ready = true
			}
		}
		
		this.setColor = function(c) {
			this.color = c
		},
		
		this.setStrokeWidth = function(w) {
			this.strokeWidth = w
		},
		
		this.changeDimension = function(x, y, th) {
			switch(this.name) {
				case 'rectangle' : th.changeRectangleDimension(this.o, ( this.startAt.x *  (1 / th.ratio) ), ( this.startAt.y *  (1 / th.ratio) ), x, y) 
					break
				case 'circle' : th.changeCircleDimension(this.o, ( this.startAt.x *  (1 / th.ratio) ), ( this.startAt.y *  (1 / th.ratio) ), x, y) 
					break
				case 'arrow' : th.changeArrowDimension(this.o, ( this.startAt.x *  (1 / th.ratio) ), ( this.startAt.y *  (1 / th.ratio) ), x, y) 
					break
			}
			this.coOrdinates.x = x
			this.coOrdinates.y = y
		}
		
		this.placeOnDrawPad = function(th) {
			$(th.drawsvg).append(this.o);
		}
		
		this.removeFromDrawPad = function(th) {
			$(this.o).remove()
		}
		
		/**
		 * @param {String} type new->new control, old->old control
		 */
		this.placeOnDrawnPad = function(th, type) {
			if(type === 'old')
				th.addToDrawnPad(this, 2)
			else
				th.addToDrawnPad(this, 1)
		}
	},
	
	unsetActiveControl : function() {
		this.activeControl = undefined
	},
	
	resetActiveControl : function() {
		name = this.activeControl.name
		this.unsetActiveControl()
		this.setActiveControl(name)
	},
	
	/* Add Control to drawn pad */
	
	/**
	 * @param {Object} c Control Object
	 * @param {Integer} atc Add To ControlContainer 0-> Don't add, 1-> Add to new, 2-> Add to old
	 */
	addToDrawnPad : function(c, atc) {
		//console.log(this)
		$(this.drawnsvg).append(c.o)
		if(atc === 1)
			this.ControlContainer.addNewControl(c) /* Add to Control Container in new stack */
		else if(atc === 2)
			this.ControlContainer.addOldControl(c) /* Add to Control Container in old stack */
	},
	
	
	
	/* Add existing Controls */
	
	/**
	 * @param {Object} j Json Object {"controls" : [
	 * 									{
	 * 										"type" : "<rectangle|circle|arrow>",
	 * 										"startAt" : { x:<xCoOrd>, y:<yCoOrd> },
	 * 										"endAt" : { x:<xCoOrd>, y:<yCoOrd> },
	 * 										"color" : "<#ffffff>",
	 * 										"strokeWidth" : "<number>"
	 * 									}
	 * 								]}
	 */
	addControlsFromJson : function(j) {
		var jo = $.parseJSON(j)
		
		if(this.imageLoaded === false) {
			setTimeout(function(th,j) { return function() { th.addControlsFromJson(j)  } }(this,j),200)
		} else {
			$.each(jo.controls, function(th) {
				return function(k,v){
					th.setActiveControl(v.type)
					th.activeControl.setStart(parseInt(v.startAt.x) /  th.ratio , parseInt(v.startAt.y) /  th.ratio, th) 
					th.activeControl.setEnd(parseInt(v.endAt.x) /  th.ratio, parseInt(v.endAt.y) /  th.ratio, th)
					th.activeControl.changeDimension(parseInt(v.endAt.x) /  th.ratio, parseInt(v.endAt.y) /  th.ratio, th)
					
					if(v.color !== undefined) {
						th.activeControl.setColor(v.color)
						th.changeControlColor(th.activeControl.o, v.color)	
					}
					
					if(v.strokeWidth !== undefined) {
						th.activeControl.setStrokeWidth(v.strokeWidth)
						th.changeControlStrokeWidth(th.activeControl.o, v.strokeWidth)
					}
					
					th.activeControl.placeOnDrawnPad(th,'old')
				}
			}(this))
			this.unsetActiveControl()
		}
	},
	
	
	/* Mouse Functions */
	
	addMouseMember : function(o) {
		o.mouseIsOver = false
		o.mouseDown = false
		
		$(o).mousedown(function() { o.mouseDown = true })
		$(o).mouseup(function() { o.mouseDown = false })
		
		$(o).mouseenter(function() { o.mouseIsOver = true  })
		$(o).mouseleave(function() {
			o.mouseIsOver = false
			o.mouseDown = false 
		})
	},
	
	bindMouseInPadEvents : function() {
		$(this.drawpad).mousemove(function(th) {
			return function(e) {
				if(th.activeControl !== undefined) { /* A control is selected */
					if(th.activeControl.captureStart === false && th.activeControl.captureEnd === true) {/* Control started to render on drawpad*/
						th.activeControl.changeDimension(e.pageX - th.holderPosition.x, e.pageY - th.holderPosition.y, th)
						
						if(th.options.drawEvents.onDrag !== undefined) {
							e.activeControl = th.activeControl
							th.options.drawEvents.onDrag(e)
						}
					}
				}
			}
		}(this))
		
		$(this.drawpad).mousedown(function(th) {
			return function(e) {
				if(th.activeControl !== undefined) { /* A control is selected */
					if(th.activeControl.captureStart === true) { /* Control start position */
						th.activeControl.setStart(e.pageX - th.holderPosition.x, e.pageY - th.holderPosition.y, th)
						th.activeControl.placeOnDrawPad(th)
						
						if(th.options.drawEvents.onStart !== undefined) {
							e.activeControl = th.activeControl
							th.options.drawEvents.onStart(e)
						}
					}
				}
			}
		}(this))
		
		$(this.drawpad).mouseup(function(th) {
			return function(e) {
				if(th.activeControl !== undefined) { /* A control is selected */
					if(th.activeControl.captureEnd === true) { /* Control end position */
						th.activeControl.setEnd(e.pageX - th.holderPosition.x, e.pageY - th.holderPosition.y, th)
						th.activeControl.removeFromDrawPad(th)
						th.activeControl.placeOnDrawnPad(th, 'new')
						th.resetActiveControl()
						
						if(th.options.drawEvents.onEnd !== undefined) {
							e.drawnControl = th.ControlContainer.getTopNewControl()
							th.options.drawEvents.onEnd(e)
						}
					}
				}
			}
		}(this))
		
		
		$(this.drawnpad).mousemove(function(th) {
			return function(e) {
				//console.log('drawnpad move')
				if(th.activeControl !== undefined) {
					if(th.activeControl.name === 'pann' && th.controls[th.activeControl.name].active === true) {
						if(th.activeControl.captureStart === false && th.activeControl.captureEnd === true) {
							th.activeControl.changeDimension(e.pageX - th.holderPosition.x, e.pageY - th.holderPosition.y, th)
							th.pannImage({x1: th.activeControl.startAt.x * (1 / th.ratio), y1: th.activeControl.startAt.y * (1 / th.ratio), x2: th.activeControl.coOrdinates.x, y2: th.activeControl.coOrdinates.y})
						}
					}
				}
			}
		} (this))
		
		$(this.drawnpad).mousedown(function(th) {
			return function(e) {
				//console.log('drawnpad down')
				if(th.activeControl !== undefined) {
					if(th.activeControl.name === 'pann' && th.controls[th.activeControl.name].active === true) {
						if(th.activeControl.captureStart === true) { /* Control start position */
							th.activeControl.setStart(e.pageX - th.holderPosition.x, e.pageY - th.holderPosition.y, th)
						}		
					}
				}
			}
		} (this))
		
		$(this.drawnpad).mouseup(function(th) {
			return function(e) {
				//console.log('drawnpad down')
				if(th.activeControl !== undefined) {
					if(th.activeControl.name === 'pann' && th.controls[th.activeControl.name].active === true) {
						th.resetActiveControl()
					}
				}
			}
		} (this))
	},
	
	/* Draw Control SVG Functions */
	
	/**
	 * 
 	 * @param {Object} ca Control Active 
	 */
	getControlSvg : function(name) {
		switch(name) {
			case 'rectangle' : return this.getRectangleSvg()
				break
			case 'circle' : return this.getCircleSvg()
				break  
			case 'arrow' : return this.getArrowSvg()
				break
		}
	},
	
	getRectangleSvg : function() {
		var svg = document.createElementNS(this.svgns, 'rect')
		svg.setAttributeNS(null, 'x', 0)
	    svg.setAttributeNS(null, 'y', 0)
	    svg.setAttributeNS(null, 'height', 0)
	    svg.setAttributeNS(null, 'width', 0)
	    svg.setAttributeNS(null, 'fill', "transparent")
	    svg.setAttributeNS(null, 'stroke', this.color)
	    svg.setAttributeNS(null, 'stroke-width', this.strokeWidth)
	    return svg
	},
	
	changeRectangleDimension : function(o, x1, y1, x2, y2) {
		var w = (parseInt(x2) - parseInt(x1))
		var h = (parseInt(y2) - parseInt(y1))
		var x = undefined
		var y = undefined
		
		if(w < 0) /* Start point is x2 */
			x = parseInt(x2)
		else  /* Start point is x1 */
			x = parseInt(x1)
			
		if(h < 0 ) /* Start point is y2 */
			y = parseInt(y2)
		else /* Start point is y1 */
			y = parseInt(y1)
		
		o.setAttributeNS(null, 'x', x)
		o.setAttributeNS(null, 'y', y)
		o.setAttributeNS(null, 'height', Math.abs(h))
	    o.setAttributeNS(null, 'width', Math.abs(w))
	},
	
	getCircleSvg : function() {
		var svg = document.createElementNS(this.svgns, 'circle')
		svg.setAttributeNS(null, 'cx', 0)
	    svg.setAttributeNS(null, 'cy', 0)
	    svg.setAttributeNS(null, 'r', 0)
	    svg.setAttributeNS(null, 'fill', "transparent")
	    svg.setAttributeNS(null, 'stroke', this.color)
	    svg.setAttributeNS(null, 'stroke-width', this.strokeWidth)
	    return svg	
	},
	
	changeCircleDimension : function(o, x1, y1, x2, y2) {
		var cX = parseInt(Math.abs(parseInt(x1) + parseInt(x2)) / 2);
		var cY = parseInt(Math.abs(parseInt(y1) + parseInt(y2)) / 2);
		var r = Math.pow(parseInt(x2) - parseInt(x1), 2) + Math.pow(parseInt(y2) - parseInt(y1), 2) 
		r = parseInt(Math.sqrt(r)/2);
		
		o.setAttributeNS(null, 'cx', cX);
	    o.setAttributeNS(null, 'cy', cY);
	    o.setAttributeNS(null, 'r', r);
	},
	
	getArrowSvg : function() {
		var svg = document.createElementNS(this.svgns, 'line');
		svg.setAttributeNS(null, 'x1', 0)
	    svg.setAttributeNS(null, 'y1', 0)
	    svg.setAttributeNS(null, 'x2', 0)
	    svg.setAttributeNS(null, 'y2', 0)
	    svg.setAttributeNS(null, 'fill', 'transparent')
	    svg.setAttributeNS(null, 'stroke', this.color)
	    svg.setAttributeNS(null, 'stroke-width', this.strokeWidth)
	    return svg
	},
	
	changeArrowDimension : function(o, x1, y1, x2, y2) {
		o.setAttributeNS(null, 'x1', x1);
		o.setAttributeNS(null, 'x2', x2);
		o.setAttributeNS(null, 'y1', y1);
    	o.setAttributeNS(null, 'y2', y2);
	},
	
	changeControlColor : function(o, c) {
		o.setAttributeNS(null, 'stroke', c)
	},
	
	changeControlStrokeWidth : function(o, w) {
		o.setAttributeNS(null, 'stroke-width', w)
	}
}