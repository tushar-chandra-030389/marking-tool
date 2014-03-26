function ControlContainer() {
	var newcount = 0 
	var newstack = []
	var oldcount = 0
	var oldstack = []
	var redocount = 0
	var redostack = []
	
	var that = this
	
	/* --- REMOVE AT PRODUCTION START --- */
	
	this.logNew = function() { console.log(newstack) }
	this.logOld = function() { console.log(oldstack) }
	
	/* --- REMOVE AT PRODUCTION END --- */
	
	
	var getUniqueId = function() {
		return 'clnyxxxxxxxyxxxyxxxyxxxyxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0
			var v = c == 'x' ? r : (r&0x3|0x8)
			return v.toString(16)
		})
	} 
	
	var setClientIdInElementAttr = function(c) {
		$(c.o).attr('ci',c.clientId)
	}
	
	this.addNewControl = function(c) {
		if(c.saved === undefined)
			c.saved = false
		if(c.clientId === undefined) {
			c.clientId = getUniqueId()
			setClientIdInElementAttr(c)
		} 
		newstack[newcount] = c
		newcount++	
	}
	
	this.getNewControl = function(i) {
		return newstack[i]
	}
	
	this.getTopNewControl = function() {
		return newstack[newcount-1]
	}
	
	this.getNewCount = function() {
		return newcount
	}
		
	this.removeNewControl = function() {
		//var c = newstack[newcount-1]
		var c = that.getNewControl(newcount-1)
		if(c !== undefined) {
			newstack.splice(newcount-1,1)
			newcount--
			that.addRedoControl(c)	
		}
		return c
	}
	
	this.addRedoControl = function(c) {
		redostack[redocount] = c
		redocount++
	}
	
	this.removeRedoControl = function() {
		var c = redostack[redocount-1]
		if(c !== undefined) {
			redostack.splice(redocount-1,1)
			redocount--
			that.addNewControl(c)	
		}
		return c
	}
	
	this.addOldControl = function(c) {
		oldstack[oldcount] = c
		oldcount++	
	}
	
	this.getOldControl = function(i) {
		return oldstack[i]
	}
	
	this.getTopOldControl = function() {
		return oldstack[oldcount-1]
	}
	
	this.getOldCount = function() {
		return oldcount
	}
	
	this.removeOldControl = function() {
		var c = that.getOldControl(oldcount-1)
		if(c !== undefined) {
			oldstack.splice(oldcount-1,1)
			oldcount--
		}
		return c
	}
}