<! DOCTYPE HTML>
<html>
	<head>
		<title>Canvas</title>
		
		
		<link href="css/ui-lightness/jquery-ui-1.10.3.custom.css" rel="stylesheet">
		
		<script type="text/javascript" src="js/vendor/jquery.js"></script>
		<script type="text/javascript" src="js/vendor/jquery-ui-1.10.3.custom.js"></script>
		<script type="text/javascript" src="js/MarkingTool.js"></script>
		<script type="text/javascript" src="js/ControlContainer.js"></script>
		<script type="text/javascript" src="js/app.js"></script>
	</head>
	
	<body>
			<div id="__viewport" style="top: 20px; left : 200px; position: relative; ; z-index: 10; 
					min-height: 600px; min-width: 1000px; max-height: 600px; max-width: 1000px; border: 2px orange solid; overflow: hidden;">
				<div id="__holder" style="position: relative; ; z-index: 10; border: 2px red solid; ">
					<canvas style="position: absolute; background-color: gray;position: absolute; z-index: 100; ">
						
					</canvas>
					<div style="position: absolute; background-color: rgba(255,255,255,0.1); z-index: 500; 
						cursor: crosshair; ">
						<svg xmlns="http://www.w3.org/2000/svg" 
							version="1.1" style="position:relative; z-index:510;">
						  	
						</svg>
					</div>
					<div style="position: absolute; background-color: rgba(200,100,0,0.9); z-index: 1000; 
						cursor: crosshair; display: none; ">
						<svg width="" height="" xmlns="http://www.w3.org/2000/svg" 
							version="1.1" style="position:relative; z-index:1010;">
						  	
						</svg>
					</div>
				</div>
			</div>
			
						
			<div id="__controls" style="width: 100px; height: 400px; float: right; z-index: 10000; position: absolute; top:0px;">
				<fieldset>
					<legend>Controls</legend>
					<div control-name="comment" style="cursor: pointer">
						<div style="" title="Comment">Comment</div>
					</div>
					<br/>
					
					<div control-name="rectangle" style="cursor: pointer" id="1">
						<div style="" title="Rectangle" id="2">Rectangle</div>
					</div>
					
					<br/>
					<div control-name="circle" style="cursor: pointer">
						<div style="" title="Circle">Circle</div>
					</div>
					
					<div control-name="arrow" style="cursor: pointer">
						<div style="" title="Arrow">Arrow</div>
					</div>
					
					<div control-name="pann" style="cursor: pointer">
						<div style="" title="Pann">Pann</div>
					</div>
				</fieldset>
			</div>
			
			<div id="__actions" style="width: 100px; height: 400px; float: right; z-index: 10000; position: absolute; top:180px;">
				<fieldset>
					<legend>Actions</legend>
					
					<div action-name="undo" style="cursor: pointer">
						<div title="Undo">Undo</div>
					</div>
					<div action-name="redo" style="cursor: pointer">
						<div title="Redo">Redo</div>
					</div>
					<div action-name="zoom">
						<input type="hidden" name="zoom-value" value=""/> <!-- Required -->
						<div id="slider"></div>
					</div>
					
				</fieldset>
			</div>
		</div>
	</body>
</html>