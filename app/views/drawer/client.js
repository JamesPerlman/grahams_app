// JavaScript Document

// set up vars
var isDrawing; // (true or false)
var drawingData; // (data being collected)
var polygonPoints; // current polygon
var polygons; // array of all drawn polygons waiting to be flushed to the server
var canvas; // 
var cx, cy;
var sending, drawing;

function init() {
	polygons = new Array();
	canvas = document.getElementById("canvas");
	
	var ctx = canvas.getContext('2d');
	ctx.lineWidth="1";
	ctx.strokeStyle="#000000";
}

function updateCursor() { cx = window.event.clientX; cy = window.event.clientY; }

function mouseDown() {
	updateCursor();
	startDrawing(cx, cy);
}

// called when the cursor is moved
function mouseMove() {
	if (drawing) {
	 	updateCursor();
	 	drawToPoint(cx, cy);
	}
}


// called on mouseUp event
function mouseUp() {
	stopDrawing();
	sendDrawingData();
}

function startDrawing(_x, _y) {
	drawing = true;
	polygonPoints = new Array();
	polygonPoints.push(_x, _y);
}

// this method draws a line point as efficiently as possible
function drawToPoint (_x, _y) {
	
	var ctx = canvas.getContext('2d');

	ctx.beginPath();
	
	ctx.moveTo(polygonPoints[polygonPoints.length-2], polygonPoints[polygonPoints.length-1]);
	
	ctx.lineTo(_x, _y);
	
	ctx.closePath();
	
	ctx.stroke();
	// add point to array
	polygonPoints.push(_x, _y);
}

function stopDrawing () {
	//
	drawing = false
	polygons.push(polygonPoints);
	polygonPoints = null;
}
// returns a string of polygon data
function stringData() {
	var datastr = "";
	for (var j=0; j<polygons.length; j++) {
		var poly = polygons[j];
		for (var i = 0; i < poly.length; i+=2) {
			datastr += poly[i] + "," + poly[i+1] + " ";
		}
		datastr += ";";
	}
	return datastr;
}
var xmlhttp;

// sends current drawn data to the server for processing
function sendDrawingData() {

	
    xmlhttp=null;

    var Url="/draw"           // THE SERVER SCRIPT TO HANDLE THE REQUEST 


  if (window.XMLHttpRequest) {

      xmlhttp=new XMLHttpRequest()                            // For all modern browsers

  } else if (window.ActiveXObject) {

     xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")   // For (older) IE

  }


 if (xmlhttp!=null)  {

     xmlhttp.onreadystatechange=processDrawingResponse;
  

   // How to send a POST request
    xmlhttp.open("PUT", Url, true);                                                         //  (httpMethod,  URL,  asynchronous)

    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

     xmlhttp.send( stringData() );

  } else
     alert("The XMLHttpRequest not supported");
}

function processDrawingResponse() {
	if (xmlRequest.readyState == 4 && xmlRequest.status == 200 && xmlRequest.responseXML != null) {
		alert(xmlSendRequest.responseText);
	}
}

