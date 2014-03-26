window.mt = undefined

$(document).ready(function(){ 
	window.mt = MarkingTool.init({
		holder : "__holder",
		//width : $('#__viewport').width() * .40,
		//height : 800,
		image : "http://localhost/marking-tool-svn/img/img-ver-l.jpg",
		
		controlHolder : "__controls",
		controls : {
			rectangle : {
				active : true,
				onclick : function(e) { /* Optional */
					console.log(e.pageY)
					console.log(($(e.currentTarget).attr('control-name')))
				}
			}, 
			circle : {
				active : true,
				onclick : function(e) { /* Optional */ 
					console.log(e.pageY)
					console.log(($(e.currentTarget).attr('control-name')))
				}
			}, 
			arrow : {
				active : true,
				onclick : function(e) { /* Optional */
					console.log(e.pageY)
					console.log(($(e.currentTarget).attr('control-name')))
				}
			},
			pann : {
				active : true,
				onclick : function(e) { /* Optional */
					console.log(e.pageY)
					console.log(($(e.currentTarget).attr('control-name')))
				}
			}
		},
		
		actionHolder : "__actions",
		actions : {
			undo : {
				active : true,
				onclick : function(e) { /* Optional */
					console.log('External Bind Undo CLick')
				}
			},
			redo : {
				active : true,
				onclick : function(e) { /* Optional */
					console.log('External Bind Redo CLick')
				}
			},
			zoom : {
				active : true
			}
		},
		
		drawEvents : {
			onStart : function(e) {
				console.log('External Bind : Draw Start')
				console.log(e.activeControl.startAt)
			},
			onDrag : function(e) {
				console.log('External Bind : Draw Drag')
				console.log(e.activeControl.coOrdinates)
			},
			onEnd : function(e) {
				console.log('External Bind : Draw End')
				console.log(Math.abs(e.drawnControl.endAt.x * (1/mt.ratio)))
				console.log(e.drawnControl)
				mt.ControlContainer.logNew()
			}
		},
		
		sizeChange : function(o) {
			$('#slider').off('slidechange')
				.slider('value', (1 / o.ratio * 100) | 0)
				.on( "slidechange", function(e, ui) {
					$('#__actions [action-name="zoom"] [name="zoom-value"]').val($(e.target).slider('value').toString()+'%').trigger('change')
				});
		}
				
	})
	
	//mt.modifyDimensions({width : '100%'})
	mt.setColor('#CCC')
	mt.setStrokeWidth(10)
	
	
	var json = {"controls":[{"type":"rectangle","startAt":{"x":"300","y":"300"},"endAt":{"x":"800","y":"600"},"color":"#c256e1","strokeWidth" : "2"},{"type":"circle","startAt":{"x":"200","y":"200"},"endAt":{"x":"400","y":"400"},"color":"#fcc"}]}
	mt.addControlsFromJson(JSON.stringify(json))
	
	
	/* $(window).resize(function() {
		mt.modifyDimensions({width : $(window).width() * .40})
	})*/
	
	$( "#slider" ).slider({
		range: false,
		min : 10,
		max : 200,
	});
});