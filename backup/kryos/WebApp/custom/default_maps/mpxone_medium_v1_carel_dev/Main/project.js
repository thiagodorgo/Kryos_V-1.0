var project = {"languages":{"en":"English"},"extensions":{"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Move":[function(base,webMI,window,document,self){
// This Quick Dynamic moves the applied graphical element in X- and/or Y-direction depending on the value of the defined node and the ranged defined by "minValue" and "maxValue", i.e. the
// range defined by "minValue" and "maxValue" will be translated to the range defined by "startPositionX" and "stopPositionX" and/or to the range defined by "startPositionY" and
// "stopPositionY".
// The movement in X-direction will only be done if both "startPositionX" and "stopPositionX" are defined.
// The movement in Y-direction will only be done if both "startPositionY" and "stopPositionY" are defined.
// e.g.: the defined range of the value from 0 (=minValue) to 100 (=maxValue) will be translated to 0 (=startPositionX) to 10 (=stopPositionX) pixels in X-direction
// Parameters:
//	nodeId:			this node triggers this Quick Dynamic
//	minValue:		lower bound of the range where the node's value should lie in
//	maxValue:		upper bound of the range where the node's value should lie in
//	startPositionX:	start position for X-direction where "minValue" will be translated to
//	stopPositionX:	stop position for X-direction where "maxValue" will be translated to
//	startPositionY:	start position for Y-direction where "minValue" will be translated to
//	stopPositionY:	stop position for Y-direction where "maxValue" will be translated to

var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;
	if (base.startPositionX != "" && base.stopPositionX != "") {
		webMI.gfx.setMoveX(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startPositionX, base.stopPositionX));
	}
	if (base.startPositionY != "" && base.stopPositionY != "") {
		webMI.gfx.setMoveY(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startPositionY, base.stopPositionY));
	}
};

},{"nodeId":"","minValue":"0","maxValue":"100","startPositionX":"0","stopPositionX":"500","startPositionY":"","stopPositionY":""}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.Slide":[function(base,webMI,window,document,self){
var step_len = 10; // each step is fixed to 10 pixels
var num_steps = base.length / step_len;
var timing = base.move_time / num_steps; //time in millisecs
var curStep = 0;
var timer=0;
var forward = true;
var moving = false;
var xpos = 0;
var ypos = 0;

// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************


webMI.addEvent(base.id, "click", function(e) {
	if(!moving && base.direction=="up")			
		forward?moveUp(true):moveUp(false);
	if(!moving && base.direction=="down")
		forward?moveUp(false):moveUp(true);
	if(!moving && base.direction=="right")			
		forward?moveRight(true):moveRight(false);
	if(!moving && base.direction=="left")			
		forward?moveRight(false):moveRight(true);
});

function moveUp(up)
{
	moving = true;
	forward = !forward;
	curStep = 0;
	
	var dir = -1;
	if(!up)
		dir = 1;

	timer = setInterval(function(e){
		if(curStep >= num_steps)
		{
			moving = false;		
			clearInterval(timer);					
		}
		else
		{
			ypos = ypos + (dir*10);	
			try{
				webMI.gfx.setMoveY(base.id, ypos);
			}
			catch (err)
			{
				clearInterval(timer);
			}
		}
	
		curStep++;
	},timing);

}

function moveRight(right, startingpos)
{
    moving = true;
	forward = !forward;	
	curStep = 0;

	var dir = 1;
	if(!right)
		dir = -1;

	timer = setInterval(function(e){
		if(curStep >= num_steps)
		{
			moving = false;							
			clearInterval(timer);	
		}
		else
		{
			xpos = xpos + (dir*10);
			try{		
				webMI.gfx.setMoveX(base.id, xpos);
			}
			catch (err)
			{
				clearInterval(timer);
			}
		}	

		curStep++;
	},timing);
}
},{"move_time":"2000","direction":"up"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Scale":[function(base,webMI,window,document,self){
// This Quick Dynamic scales the applied graphical element in X- and/or Y-direction depending on the value of the defined node and the ranged defined by "minValue" and "maxValue", i.e. the
// range defined by "minValue" and "maxValue" will be translated to the range defined by "startScaleX" and "stopScaleX" and/or to the range defined by "startScaleY" and
// "stopScaleY".
// The scale in X-direction will only be done if both "startScaleX" and "stopScaleX" are defined.
// The scale in Y-direction will only be done if both "startScaleY" and "stopScaleY" are defined.
// e.g.: the defined range of the value from 0 (=minValue) to 100 (=maxValue) will be translated to 0 (=startScaleX) to 10 (=stopScaleX) in X-direction
// Parameters:
//	nodeId:			this node triggers this Quick Dynamic
//	minValue:		lower bound of the range where the node's value should lie in
//	maxValue:		upper bound of the range where the node's value should lie in
//	startScaleX:	start position for X-direction where "minValue" will be translated to
//	stopScaleX:		stop position for X-direction where "maxValue" will be translated to
//	startScaleY:	start position for Y-direction where "minValue" will be translated to
//	stopScaleY:		stop position for Y-direction where "maxValue" will be translated to
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;

	if (base.startScaleX != "" && base.stopScaleX != "") {
		webMI.gfx.setScaleX(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startScaleX / 100, base.stopScaleX / 100));
	}
	if (base.startScaleY != "" && base.stopScaleY != "") {
		webMI.gfx.setScaleY(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startScaleY / 100, base.stopScaleY / 100));
	}
}

},{"nodeId":"","minValue":"0","maxValue":"100","startScaleX":"","stopScaleX":"","startScaleY":"0","stopScaleY":"1"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.index":[function(base,webMI,window,document,self){
if (!this.currentLanguage)
	this.currentLanguage = { value: null };
if (!this.firstConnect)
	this.firstConnect = {value: true, defaultFrameName: "", defaultUrl: ""};

var currentLanguage = this.currentLanguage;
var firstConnect = this.firstConnect;
var childwindowsDiv = null;
var currentFrame = [];
var extensionsDiv = null;
var displaysJs = null;
var mobile = /mobile|android|blackberry|fennec|iemobile|ip(hone|ad|od)|opera m(ob|in)i|playbook|silk|windows (ce|phone)/i.test(navigator.userAgent);
var firefox_svg = (webMI.getConfig("frame.displaytype") != "xhtml" && (navigator.userAgent.indexOf("Firefox") > -1));
var isIOSDevice = /(iPod|iPhone|iPad)/.test(navigator.userAgent);
var iOSVersion = null;
var pointerEventsOn = window.PointerEvent !== undefined;

var isStartHTML = location.search.indexOf("startHTML") > -1;
var isRedirected = webMI.query["redirected"];
var locationPort = location.port == "" ? "80" : location.port;
var locationHost = (location.host.indexOf(":") == -1) ? (location.host + ":" + locationPort) : location.host;
var isHostName = /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z/i.test(location.host);
var initialStatus = null;
var lastHostName = null;
var lastServerState = null;
var errorscreen = "Standard";
var indexHtmWindow = window;
if (indexHtmWindow.isRootDisplay) {
	try {
		while (top != indexHtmWindow && indexHtmWindow.parent.webMI)
			indexHtmWindow = indexHtmWindow.parent;
	} catch (ex) {}
}
var scaleType = webMI.getConfig("frame.scaletype");
var alarmManagementGlobal = webMI.getConfig("alarm.management.global");

var globalParameters = false;
setTimeout(function waitUntilReady() {
	webMI.data.read(["SYSTEM.GLOBALS.atvFontColor", "SYSTEM.GLOBALS.atvFillColor","SYSTEM.GLOBALS.atvFillColor2", "SYSTEM.GLOBALS.atvBorderColor"], function(e) {
		if (e[0].value && e[1].value && e[2].value && e[3].value)
			globalParameters = {font: e[0].value, fill: e[1].value, fill2: e[2].value, border: e[3].value};
	});
}, 1000);

webMI.addEvent(webMI.data, "serverstatechange", function(e) {
	if (initialStatus == null)
		initialStatus = e.status;

	var state = false;
	if (e.status == "Sop" || e.status == "Snop")
		state = e.active["connection-status"].primary || e.active["connection-status"].secondary;
	else
		state = e["active-exists"] == true && (e.active["connection-status"].primary || e.active["connection-status"].secondary);

	//redirect if server is passive on visu start
	if (initialStatus == "Passive") {
		console.warn("Connected to Passive - Redirect to Active");
		webMI.trigger.fire("com.atvise.RedundancyRedirect", e);
		//redirect if server gets snop with startHTML
	} else if (e.status == "Snop" && isStartHTML && (isRedirected != "Snop" || initialStatus != "Snop")) {
		console.warn("Connected to Snop - Redirect to Sop");
		e.toPassive = true;
		webMI.trigger.fire("com.atvise.RedundancyRedirect", e);
		//redirect if redu mode is switched on
	} else if (lastServerState == "Snop" && (e.status == "Active" || e.status == "Passive")) {
		webMI.trigger.fire("com.atvise.RedundancyRedirect", e);
	}
	lastServerState = e.status;

	//redirect if firefox and ips
	if (firefox_svg || !isHostName) {
		var currentActiveHostName = e.active.currentHostName;
		if (currentActiveHostName != lastHostName && lastHostName != null)
			webMI.trigger.fire("com.atvise.RedundancyRedirect", e);

		var hostIndex = e.active.hostNames.indexOf(currentActiveHostName);
		var connectionStatus = e.active["connection-status"];
		connectionStatus = hostIndex == 0 ? connectionStatus.primary : connectionStatus.secondary;
		if (connectionStatus)
			lastHostName = currentActiveHostName;
	}

	//define error screens for redundancy environment
	var isSplit = e.status == "Sop" || e.status == "Snop";
	var errorrow1 = document.getElementById("errorrow1");

	if (errorrow1 == null)
		return;

	if (!isSplit && errorscreen != "Redundancy") {
		errorscreen = "Redundancy";
		errorrow1.innerHTML = "Waiting for active server ...";
		errorrow1.parentNode.style.marginTop = "35px";
		errorrow1.style.color = "#0096e1";

		document.getElementById("errorbox").style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgwAAABiCAMAAAALOXs+AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAqUExURf///wAAAP7+/v7+/iCj5YTM8cfo+f///////1O46////////wCW4f7//w9I/GkAAAAMdFJOU94A49P8+/efHfptQwuZvxgAAAZqSURBVHja7V3t1qMsDHQNWrV6/7f7tn708QtIAJFXJudsd7ftH3E6zIQkFv8c4/X58y4QjwpHLHRl90UE1g9g+NdQSc33LywgwNCV5UgNHRYwezA0xQcMxYca/oEasgfDq/wGNCTA8EFAOcX7pyEpsRcq8CJ6cQcDzWCgccdAPCDIFQxduQTsZe7bREM/MMBe5g6GV/kXL9jLrMHQrLCwtpepKCFa74J4sS+Vj4CciaEqYS+zZ4bZVlZ9tbeXyWljxNVuYlKPhepVAXuZOTN0CzH0CzUkdUQBShAuFXmAYbaV1H+DfhqySUVDaq4WL8aVcgTDrB7bEQwt7OWTSEIKhlk91v0U9Z+GpAQvDXGpZpiJQc1gUMnaSwDicjC8/9TjFFXiRxTAhGlh6PCOk61cYm0v79Vrp+IYuUiGfCQ3Zuj2xPDTkKiAy22baIqNelxryBQr4LBFXAmGja3cUUNKGhIocF4yV1vZH+3l6+aLIUDDS0MKwLCzlf3WXtKPGlLJpkFCXpeBPFGPCdtLAitcqBmag638BaVUAYf777NkMmJoj1jAEcVzEOFhKxOxlzbtALJgr5mHrdTZy8i5SN5dh2hkSG4fW5mUvdTddgRfY0laqJQGDAoNVvm4Ca2t/L+cXiJ49CCtdTuPm+0l6WUD9gtBFsZXPZ7by8QykJCQ1uVi1jM0ZvWYyuklgQ4iCEgGMaRcAYcIKCDfNvW40ZD320sQghOP8sCgP5TYUsNtDVbkkZ3MfmOQMUPHIwZNg1VcPcSDBeSjdr38beVRQzbRf5AkgD9Cu4Ah1GOap5cARGAB+ebYyj6pBitgwFE9WsGwqXVrB120N9pLAjycVoukzLC1lTYwnB5R3Kse6TQFC/WoWSWBrbSC4dhghS3iMZphbyuVLu5usCJgIsiPR1brpqpjKO0RBd1KBYCEeGVktrLV7xGpNljthgHmjBGrbJDZSjUMO14YBmWrgIuqh0iwLlnLx7MaEGGt2zDskgu7Nw4NVtHwbnYT2DM4CyE8lKiHbTJSDXWSFXC4+SHdhKaFqhoq4/+jVsDhjkdyE5oWKrXbFnaS4eYjCrtEzPlMm/QoICMYtLVu9YcK1Owj1IcYamsF3G3tM2RMwCL5yN4mtKeV6ouBdvaU6kgMse0lBfxWnnuD1U0YTitHMvg4yq9YqIcq5Qo4hPAHIq91qyc01PO/kmmwIlCBl5zSgcFY66bKkRRGelA3Nlg5Tu0BTGQZSEutm5pS0K0OCycjxi9WRGS6RtIyR77yUZOMc6l1a8ft4Vww6BusotEDfvsBk07WFqop2aAnhjTGQwInzGUx9k1Yi2ArGzPcUQFHzh/mggB71YdDC9UsHNUwVLc2WBGyDpdvE7YWqnYpYWiHoZU0WAUvQPS6tUg+MtyErYVqJgTVG7zl/U+woiM7gg/EbmK2lXr1OGWa1AgDTdbptMEqmmCAeNBfszDpZLeVaxiU+o0iyuklfu2+ZGByE9YWqrG6RdXDMNRqyTjwZ8BRLHowfwQMsdzEyzzXbbr71XyEXR0rn1j2MtwDr0MZrmc/7drRTTBsZbUqkW5PCxoiHVHo08yrNDROr9zdhHUyR/lRDOvuGXWokO21T7CiVNkxl3tNIjdhn8xxUh2tbE36Eeyl3EFQZkAQbxPGceFLkqHehgkMp0cUFPLqCIQgvmSmm7BP5rB1VHEr4K7Ip7kkl3LOO5rdBGcyh6HrNu6IcZ9TCAhJ+zZhGRd+2nV77L2N3mBFbHbIeKvgjWgQqEfrfIa0RoxTEG7JKh3JeQqVBxgODVZ0AQ8wQJ9d06VTYzLnKVQLGGpd8DRkF0w+UuhVy2vco9VN2G2lY0SvgKNA33l6hsHgJgQDH2VxfYMVcSw0ZAPjal0GPsriogo4km6NWRtKW8HHxk0wx4W7RNgR4+SC++yOq8jti8Jx4R7UsLaXlz5yRrhID5wNqb9gcyJGOi7cJYLP7+CdS5E7lTw4l2B1E5epx7AVcOHuKxLSWmZorlOPG3sZeMQ4FZJ6NsoeFHavxal189eQsRusKGeisPUVGt3EYivVdXFyeulczCdPtDIfmf18+cjYJubTyggRbn4HheHF7LwlGW3Fz1ZGCc8KOBYpyDrKMgAI/woXWxkngjdYkdsX4CZOV2NRj5HCyV665NOyPaYg/ieHN95l3MAMuITjRXFjtJeESDH+A0A63RFkySq6AAAAAElFTkSuQmCC)";
		document.getElementById("errorrow2").style.display = "none";
	} else if (isSplit && errorscreen != "Split") {
		errorscreen = "Split";
		errorrow1.innerHTML = "A <b>connection error</b> may have occurred.";
		errorrow1.parentNode.style.marginTop = "20px";
		errorrow1.style.color = "#f25e00";

		document.getElementById("errorbox").style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgwAAABiCAMAAAALOXs+AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURf///wAAAP7+/v////NtGP////////indP////////rHp/aMSf3gzv7w6PJeAP///wM5Z7oAAAAOdFJOU94A49L6nx34bUPy+vLsv21lagAABMRJREFUeNrtndma2jAMRjN2NghJ3/9tCyELxEu8W8S/vq/Tm7lozamsM5Lc6s8xmuevW4W4VDiy0LP+RQTODzD8tZzx9vUbDhAw9IzNqaHHARYPQ1s9YaieqeEPqaF4GBr2CtSQgOFJAHvHDTUkYOALDHy+MYgGLrAkMPRsjV0vObUvFc0/FuEvTjC0fIMBell6ZmjYHg30smgY2g8WoJeFw7Akho5BL4uHYdHK+3SHXhYPw7t6rOqprujqJYdbpoBh0cpumqZu18uemMpVkEunY3PSynF6xbjVkNDLEjPDUj0OMwwD9LJkGJbq8TG946OGRGooDoavxDBNNfSyXBg2rZy+UwMm4AqEYake6w2Getz1ktBFwaGX0WH40Mo1BL0kpZWwS8uDs5x126vHdzzQoigyMxyqx+mol6ghy4FBqB4FvUQNWQwMS2KoDzDU+wQcidSAyyoBDL08MXzVkEgNZcDQClp51EtKLQq4ZVQYJFp5SA0NDb2EXFaxu5ZSrYRelpkZpFoJvSwShpuqeoRelgcDl2ulRC/zT8DhpooLg6Z6hF4WBoOglf/W2GiAXpYCQ3NMDCIMAxW9hF3G7Vq27KiVKwsj9LK0zCBq5SjCQEovgWMsGCRa+RBhoKKX4CAqDNsKlQjD5w8kKS9YIQLBINNKGQzSBSvEpWD4WqHargQZDNQWrKCWwWGQNiVWGO6qFkWfTecglz6HZ7VCpYUBC1YXzwzybmUnh4HMghVQjAGDolu5wtDJu5c5WxTgIBoMilk3FQxEF6wQIWBQdStVMFDVS4DpD4Ny1m1QwUCqRQGtDAmDctZthWE4n4AjI5ZwR4PTc5l1U8OACbiLZgb1rFuthiHvghVHiRAHhl49BLvCUGMCrgwY1CtUehgoLlghPGHQDsFqYBAXrAj4JKj0gqFlmhWq6TgCSVsvEZ4waFeo9DBIJuBIuCXk0VEtT1aoRh0MWfWSI0kEzwySWTcRhlG1YJV7Ag6fe0gYzlaoHpJBJ+jlNWHQaaUJDMQm4JAofGBoznYrz2Cg8MQ4EAgCg14r97m3u/obsuglBxHhYdBrpREMWbqXEEvf07PWSiMYMuolx6URMDOcaOWsC49XdJrvwILVJWA4fZnDLPJOwCERBIFBukLlEg/8D1Y/D8N59WgY+fWSI034wXA71UrjSFxD4iP3Pzuz58JdQrpgFVss8ZaPj5Rba6V1aqDRokDisL4mzpoSdqkh14IVBwMBYDDUSvUSzU8sWCFMYNA+F+4AQ84JOKQETxhMtdIYBjwx/ls+4VI9GsMg6CWP+7fhSBNeOdT8uXAXGKQLVnlalpDI81MzWqFyhiHDBBxHSnAurMxn3ZxgwILVTxaQFt1KCxjILFghLGAw1cr5n3v3jsGue5lOL5GD/GAI1q0ko5fcxDMQn2cVoymRvnuJDzxIFjWfdXNuUUgm4DKIJfzSVC0DzbrRXrBC5jCqGYLNuukWrBLpJT5yTxiiVY+ZJ+AAhj0MbbhZN61eJnxiHBi4HFOCxJC5ewkujE/oQyvreBFfL0/MAkQYXhNLtzJB7HqZyS2hk9pD27QySWACjnZmaHlCGFIsWHFcDc4wNCxloHtJ2SduLG3giXHC0fC0MeslR1CM/03U+W/32gJMAAAAAElFTkSuQmCC)";
		errorrow2.innerHTML = "Waiting for online server.";
		document.getElementById("errorrow2").style.display = "inherit";
	}

	if (e.status == "Snop" && isStartHTML)
		errorrow1.innerHTML = "Connected to SNOP, redirecting to SOP.";

	document.getElementById("errorscreen").style.display = !state ? "block" : "none";
});

webMI.trigger.connect("com.atvise.RedundancyRedirect", function(e) {
	var e = e.value;

	var newHost = e.active.hostNames;
	var connectionStatus = e.active["connection-status"];
	if (e.toPassive) {
		newHost = e.passive.hostNames;
		connectionStatus = e.passive["connection-status"];
	}

	var hostIndexPrio1 = 0;
	if (e.active.hostNames.indexOf(locationHost) > -1)
		hostIndexPrio1 = e.active.hostNames.indexOf(locationHost);
	else if (e.passive.hostNames.indexOf(locationHost) > -1)
		hostIndexPrio1 = e.passive.hostNames.indexOf(locationHost);
	var hostIndexPrio2 = hostIndexPrio1 == 0 ? 1 : 0;

	var connectionPrio1 = hostIndexPrio1 == 0 ? connectionStatus.primary : connectionStatus.secondary;
	var connectionPrio2 = hostIndexPrio2 == 0 ? connectionStatus.primary : connectionStatus.secondary;

	var redirectPopup = false;
	if ((mobile || firefox_svg || !isHostName) && initialStatus != "Passive")
		redirectPopup = true;
	if (e.status == "Snop")
		redirectPopup = "Snop";

	var parameters = location.search;
	if (redirectPopup != false) {
		if (location.search == "")
			parameters = "?redirected=" + redirectPopup;
		else if (location.search.indexOf("redirected=") == -1)
			parameters = parameters + "&redirected=" + redirectPopup;
		else
			parameters = parameters.replace("redirected=" + isRedirected, "redirected=" + redirectPopup);
	}

	if (connectionPrio1)
		indexHtmWindow.location.replace(location.protocol + "//" + newHost[hostIndexPrio1] + parameters);
	else if (connectionPrio2)
		indexHtmWindow.location.replace(location.protocol + "//" + newHost[hostIndexPrio2] + parameters);
});

webMI.trigger.connect("com.atvise.languages", function(e) { e.value(project.languages); });

webMI.trigger.connect("com.atvise.display_structure", function(e) {
	var loadingscreen = document.getElementById("loadingscreen");
	var excludePreloaded = (webMI.query.excludePreload == null)?[]:webMI.query.excludePreload;
	var includePreloaded = (webMI.query.includePreload == null)?[]:webMI.query.includePreload;

	if (typeof webMI.query.defaultdisplay !== "undefined") {
		for (var i = 0; i < displaysJs.menu.length; ++i) {
			if (displaysJs.menu[i].name == webMI.query.defaultdisplay)
				firstConnect.defaultUrl = webMI.display.createURL(displaysJs.menu[i].display);
		}
	} else if (typeof webMI.query.defaulturl !== "undefined") {
		firstConnect.defaultUrl = webMI.query.defaulturl;
	}

	/*firstConnect.value -> set false in first fire*/
	e.value(displaysJs, webMI.query.preload == "true", excludePreloaded, includePreloaded, loadingscreen, firstConnect);
});

var popup = null;
var popupmenulist = null;
var audio = null;
var popupvisible = "hidden";
var lastMenu = null;
var popups = [];
var eleStayOnTop = null;
var greatestZIndex = 1000;

/**
 * get highest z-index
 * @param id
 * @returns {number}
 */
function parseIndexOfElements(tag) {

	var elements = webMI.rootWindow.document.getElementsByTagName(tag);
	var index = greatestZIndex;
	var content = "";
	for (var i = 0; i < elements.length; i++) {
		try {
			var zIndex = parseInt(elements[i].style.zIndex, 10);
			if ((zIndex > index) && (zIndex !== 'auto')) {
				index = zIndex;
				content = elements[i];
			}
		} catch(na){
		}
	}

	return {"content": content, "index": index + 1};
}

var extensionSizeCount = 0;

function incESC() {
	if (extensionsDiv) {
		extensionsDiv.style.height = "inherit";
		extensionsDiv.style.width = "inherit";
	}
	extensionSizeCount++;
}

function decESC() {
	extensionSizeCount--;
	if (extensionsDiv && !extensionSizeCount) {
		extensionsDiv.style.height = "";
		extensionsDiv.style.width = "";
	}
}
function fillCurrentFrame(names, lang) {
	firstConnect = { value: true, defaultFrameName: "", defaultUrl: "" };
	var remaining = names.length;
	for (var i = 0; i < names.length; i++) {
		webMI.trigger.fire("getSource_" + names[i], function(e, currentDisplayWebMI) {
			if (typeof currentDisplayWebMI != "undefined")
				currentFrame[i] = {"name":names[i],"display":decodeURIComponent(e)}; //currentFrame.length
			else
				currentFrame[i] = {"name":names[i],"url":tabHandler.getIFrame(names[i]).src};
			if (--remaining == 0) {
				tabHandler.renewGlobal();
				switchLanguage(lang);
			}
		});
	}
}
function checkPopupsTopParent(index) {
	var isbodytop = false;
	var elem = popups[index];
	while (elem.parentNode && !isbodytop) {
		isbodytop = (elem.parentNode == document.body);
		elem = elem.parentNode;
	}
	if (!isbodytop) {
		popups.splice(index, 1);
	}
	return isbodytop;
}

function pushPopups(curPopup, onDemand) {
	//(replace and remove) or push
	var push_b = true;
	for (var x = 0; x < popups.length; x++) {
		if (popups[x].id == curPopup.id && popups[x].parentNode == curPopup.parentNode) {
			if (popups[x].style)
				popups[x].style.visibility = "hidden";
			if (onDemand) {
				if (popups[x].parentNode)
					popups[x].parentNode.removeChild(popups[x]);
			}
			popups[x] = curPopup;
			push_b = false;
		}
	}
	push_b && popups.push(curPopup);
}

function contentDocumentOf(frame) {
	try {
		return frame.contentWindow.document;
	} catch (ex) {
		return null;
	}
}

var mouseMoveFunctions = [];
var mouseUpFunctions = [];

webMI.addEvent(document, pointerEventsOn ? "pointermove" : isIOSDevice ? "touchmove" : "mousemove", function(e) {
	if (!e) 
		e = window.event;

	if (isIOSDevice && e.touches) 
		e = e.touches[0];
	
	for (var i = 0; i < mouseMoveFunctions.length; ++i) 
		mouseMoveFunctions[i].mouseMoveFunction(e);
});

webMI.addEvent(document, pointerEventsOn ? "pointerup" : isIOSDevice ? "touchend" : "mouseup", function(e) {
	if (!e) 
		e = window.event;
	
	if (isIOSDevice && e.touches) 
		e = e.touches[0];
	
	for (var i = 0; i < mouseUpFunctions.length; ++i) 
		mouseUpFunctions[i].mouseUpFunction(e);
});


webMI.trigger.connect("com.atvise.windowLoaded", function(e) {
	var ret = {};
	ret.openedWindow = e.value;
	webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"pushPopup","popup":ret});

	var doc = ret.openedWindow.document;
	var mainframe = doc.getElementById("mainframe");
	webMI.addEvent(mainframe, "load", function() {
		if (doc != null && doc.location.href != "about:blank") {
			if (contentDocumentOf(mainframe) == null)
				return;
			tabHandler.registerDisplay(contentDocumentOf(mainframe));
			tabHandler.beforeFirstUse(contentDocumentOf(mainframe), true);
			mainframe.contentWindow.webMI.addOnfocus(function() {
				if (mainframe.contentWindow != null)
					tabHandler.getFocused(contentDocumentOf(mainframe));
			});
			mainframe.contentWindow.webMI.addOnunload(function() {
				if (mainframe.contentWindow != null)
					tabHandler.removeDoc(contentDocumentOf(mainframe));
				webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"removePopup","popup":ret});;
			});
		}
	});
});


function openWindow(features, offsetLeft, offsetTop, clientWidth, clientHeight) {
	function addDefaults(obj, features) {
		for (var i in features)
			if (!(i in obj))
				obj[i] = features[i];
		return obj;
	}

	var styleDefaults = {
		fill: "#FFFFFF",
		headerFill: "#000000",
		headerFontFill: "#FFFFFF",
		headerFontFamily: "Arial",
		headerFontSize: 16,
		headerBackgroundImage: "url(headgd.png)"
	};

	if (globalParameters){
		styleDefaults.headerFill = globalParameters.font;
		styleDefaults.headerFontFill = globalParameters.fill;
		styleDefaults.headerBackgroundImage = "";
	}

	var borderWidth = 1;

	features = addDefaults(features, {
		url: "about:blank",
		display: "",
		query: {},
		title: " ",
		height: 0,
		width: 0,
		extern: false,
		modal: false,
		modalbackground: "gray",
		name: "_blank",
		position: "center",
		resizable: true,
		movable: true,
		scrollbars: true,
		menubar: false,
		status: false,
		titlebar: true,
		toolbar: false,
		close_on_esc: true,
		style: styleDefaults
	});

	var ret = null;
	var contentMultiplicator = webMI.getClientInfo() ? webMI.getClientInfo().deviceScaling.window.content : 1;
	var titlebarMultiplicator = webMI.getClientInfo() ? webMI.getClientInfo().deviceScaling.window.titlebar : 1;
	var h = (features.height - 20) * contentMultiplicator + 20 * titlebarMultiplicator; //Height of titlebar is fixed to 20px 
	var w = features.width * contentMultiplicator;

	/* Limit size and position of window to client size */
	var ratio = w / h;
	if (w > (clientWidth - 50)) {
		w = clientWidth - 50;
		h = w / ratio;
	}

	if (h > (clientHeight - 50)) {
		h = clientHeight - 50;
		w = h * ratio;
	}

	if (features.x + w > clientWidth)
		features.x = clientWidth - w - 25;

	if (features.y + h > clientHeight)
		features.y = clientHeight - h - 25;

	/*Bug in Windows 10 - invisible borders on programm windows
	 * There is always an offset in x direction of 7 pixels
	 * see https://msdn.microsoft.com/library/hh869301(v=vs.85).aspx
	 * and  http://stackoverflow.com/questions/35259756/wpf-and-windows-10-invisible-border-around-windows
	 */
	var isWindows10 = window.navigator.appVersion.search("Windows NT 10.0") != -1;

	var scaleFactor = 1;
	var compatibilityModeFactor = 1;
	var touchDevice = webMI.getClientInfo() ? webMI.getClientInfo().isTouchDevice : false;
	var mainFrameWebMI = document.getElementById("mainframe").contentWindow.webMI;
	var mainContainerEl = document.getElementById("mainContainer");
	var mainContainerOffset = {};
	mainContainerOffset.top = 0;
	mainContainerOffset.left = 0;
	if (autofit) {
		scaleFactor = webMI.gfx.getAbsoluteScaleFactor(true, mainContainerEl.childNodes[0]);
		if (scaleType !== "transform" && scaleType !== "zoom") {
			compatibilityModeFactor = parseFloat(mainContainerEl.style.width) / mainFrameWebMI.display.getInitialViewBox()[2];
		}
		mainContainerOffset.top = webMI.gfx.getAbsoluteOffset("top", true, mainContainerEl);
		mainContainerOffset.left = webMI.gfx.getAbsoluteOffset("left", true, mainContainerEl);
	}

	var x = 0, y = 0;
	if (features.extern) {
		x = typeof(features.x) == "number" ? screenX + (((features.x*compatibilityModeFactor) + offsetLeft) * scaleFactor) + mainContainerOffset.left : screenX + ((window.innerWidth - w) / 2);
		y = typeof(features.y) == "number" ? screenY + (((features.y*compatibilityModeFactor) + offsetTop) * scaleFactor) + mainContainerOffset.top : screenY + ((window.innerHeight - h) / 2);
		if (isWindows10) {
			x -= 7;
		}
		x = x > 0 ? x : 0;
		y = y > 0 ? y : 0;
	} else {
		w *= compatibilityModeFactor;
		h *= compatibilityModeFactor;
	  x = typeof(features.x) == "number" ? features.x * compatibilityModeFactor : (clientWidth - w - (2*borderWidth)) / 2;
	  y = typeof(features.y) == "number" ? features.y * compatibilityModeFactor : (clientHeight - h - (2*borderWidth)) / 2;
	}

	if (features.display != "")
		features.url = webMI.display.createURL(features.display);

	/*query add current language*/
	features.query.language = currentLanguage.value;

	features.url += "?";
	var cnt = 0;
	for (var i in features.query) {
		if (cnt != 0) {
			features.url += "&";
		}
		features.url += i + "=" + encodeURIComponent(features.query[i]);
		cnt++;
	}

	if (features.extern && !features.modal) {
		var href = window.location.href;

		if (href.lastIndexOf("?") != -1)
			href = href.substr(0, href.lastIndexOf("?"));

		if (features.url.indexOf("about:blank") != 0)
			features.url = href + "?defaulturl=" + encodeURIComponent(features.url) + "&language=" + currentLanguage.value + "&useSVGKeyboard=" + webMI.query["useSVGKeyboard"];
		else
			features.url = "";

		if (features.modal && window.showModalDialog) {
			var args = "dialogHeight:" + h + "px;dialogWidth:" + w + "px";

			if (features.position != "default")
				args += ";dialogTop:"+y+"px;dialogLeft:"+x+"px";

			var ids = {"resizable":"resizable","scrollbars":"scroll", "status":"status"};
			for (var i in ids)
				args += ";"+ids[i]+":"+(features[i] ? "yes" : "no");

			window.showModalDialog(features.url, features.name, args);
			return {};
		} else {
			var args = "height=" + h + ",width=" + w;

			if (features.position != "default")
				args += ",top="+y+",left="+x;

			var ids = ["resizable", "scrollbars", "menubar", "status", "modal"];
			for (var i in ids)
				args += ","+ids[i]+"="+(features[ids[i]] ? "yes" : "no");

			ret = {
				openedWindow: window.open(features.url, features.name, args),

				getContentDocument: function() {
					var extPopupFrame = this.openedWindow.document.getElementById("mainframe");
					if(extPopupFrame != null)
						return contentDocumentOf(extPopupFrame);
				},

				close: function() {

					return this.openedWindow.close();
				}
			};

			if (navigator.userAgent.indexOf("MSIE 7") != -1) {
				webMI.addEvent(ret, "load", function() {
					ret.resizeTo(w + 13, h + 31);
					ret.resizeTo(w + 12, h + 31);
				});
			}
			tabHandler.blurFocused();
			tabHandler.renew();
		}
	} else {
		var childWindowTopZindex = 1;

		var headerheight = 20 * titlebarMultiplicator;
		var touchCloseAreaSize = 50;
		var resizeDragAreaSize = touchDevice ? 40 : 20;

		if (!features.titlebar) {
			headerheight = 0;
			var transparentMoveAreaHeight = touchDevice ? 20 : 10;
		}

		var ret = {};
		ret.backgroundDiv = document.createElement("div");
		ret.backgroundDiv.style.position = "absolute";
		ret.backgroundDiv.style.left = 0;
		ret.backgroundDiv.style.top = 0;
		if (features.modal) {
			incESC();
			ret.backgroundDiv.style.zIndex = parseIndexOfElements("*").index;
			ret.backgroundDiv.style.backgroundColor = features.modalbackground;
			ret.backgroundDiv.style.width = mainFrameHandler.element_.clientWidth + "px";
			ret.backgroundDiv.style.height = mainFrameHandler.element_.clientHeight + "px";
			ret.backgroundDiv.style.opacity = 0.5;
			ret.backgroundDiv.style.filter = "alpha(opacity=50)";
			if (features.extern) console.warn("External-modal popups are no longer supported, please refer to the documentation.");
		}
		childwindowsDiv.appendChild(ret.backgroundDiv);

		ret.main = document.createElement("div");
		ret.main.id = "popup_main";
		ret.main.style.position = "absolute";
		ret.main.style.outline = borderWidth + "px solid " + features.style.headerFill;
		ret.main.style.zIndex = parseIndexOfElements("*").index;
		ret.bgiframe = document.createElement("iframe");
		ret.bgiframe.id = "popup_bgiframe";
		ret.bgiframe.frameBorder = 0;
		ret.bgiframe.style.position = "absolute";
		ret.bgiframe.style.top = "0px";
		ret.bgiframe.style.left = "0px";
		ret.bgiframe.style.width = "100%";
		ret.bgiframe.style.height = "100%";
		ret.main.appendChild(ret.bgiframe);
		ret.bgdiv = document.createElement("div");
		ret.bgdiv.id = "popup_bgdiv";
		ret.bgdiv.style.position = "absolute";
		ret.bgdiv.style.top = "0px";
		ret.bgdiv.style.left = "0px";
		ret.bgdiv.style.width = "100%";
		ret.bgdiv.style.height = "100%";
		ret.bgdiv.style.backgroundColor = features.style.fill;
		ret.main.appendChild(ret.bgdiv);
		ret.content = document.createElement("div");
		ret.content.frameBorder = 0;
		ret.content.style.position = "absolute";
		ret.content.style.top = headerheight + "px";
		ret.content.style.left = 0;
		ret.content.style.overflow = "hidden";
		ret.content.id = "popupcontent";
		ret.main.appendChild(ret.content);
		ret.iframe = document.createElement("iframe");
		ret.iframe.frameBorder = 0;
		ret.iframe.style.position = "absolute";
		ret.iframe.style.top = 0;
		ret.iframe.style.left = 0;
		ret.iframe.style.width = "100%";
		ret.iframe.style.height = "100%";
		ret.iframe.style.overflow = "hidden";
		ret.content.appendChild(ret.iframe);
		ret.foreignObjectDiv = document.createElement("div");
		ret.foreignObjectDiv.style.position = "absolute";
		ret.content.appendChild(ret.foreignObjectDiv);
		childwindowsDiv.appendChild(ret.main);
		if (features.titlebar || features.movable) {
			ret.head = document.createElement("div");
			ret.head.style.position = "absolute";
			ret.head.style.left = "0px";
			ret.head.style.width = "100%";
			if (features.titlebar) {
				ret.head.style.top = "0px";
				ret.head.style.height = headerheight + "px";
				ret.head.style.lineHeight = headerheight + "px";
				ret.head.style.backgroundColor = features.style.headerFill;
				ret.head.style.backgroundImage = features.style.headerBackgroundImage;
				ret.head.style.backgroundSize = "contain";
				ret.head.style.fontSize = features.style.headerFontSize + "px";
				ret.head.style.fontFamily = features.style.headerFontFamily;
				ret.head.style.color = features.style.headerFontFill;
				ret.head.style.boxSizing = "border-box";
				ret.head.style.paddingLeft = "2px";
			} else if (features.movable) {
				//if titlebar is not visible, create a transparent div so the user can drag that to move the window
				ret.head.style.top = -transparentMoveAreaHeight / 2 + "px";
				ret.head.style.height = transparentMoveAreaHeight + "px";
			}
			ret.main.appendChild(ret.head);
		}
		if (features.titlebar) {
			ret.title = document.createTextNode("");
			ret.head.appendChild(ret.title);
			ret.closea = document.createElement("div");
			ret.closea.style.cursor = "pointer";
			ret.closea.style.position = "absolute";
			ret.closea.style.width = headerheight + "px";
			ret.closea.style.height = headerheight + "px";
			ret.closea.style.top = "0px";
			ret.closea.style.right = "0px";
			ret.closea.style.zIndex = "1";
			addCloseEvent(ret.closea);
			ret.head.appendChild(ret.closea);
			ret.closeimg = document.createElement("img");
			ret.closeimg.src = "close.png";
			ret.closeimg.width = headerheight * 0.9;
			ret.closeimg.height = headerheight * 0.9;
			ret.closeimg.style.border = "0";
			ret.closeimg.style.display = "block";
			ret.closeimg.style.margin = "auto";
			ret.closeimg.style["image-rendering"] = "crisp-edges";
			ret.closea.appendChild(ret.closeimg);
			if (touchDevice) {
				ret.touchCloseArea = document.createElement("div");
				ret.touchCloseArea.style.cursor = "pointer";
				ret.touchCloseArea.style.position = "absolute";
				ret.touchCloseArea.style.width = touchCloseAreaSize + "px";
				ret.touchCloseArea.style.height = touchCloseAreaSize + "px";
				ret.touchCloseArea.style.top = (headerheight - touchCloseAreaSize) / 2 + "px";
				ret.touchCloseArea.style.right = (headerheight - touchCloseAreaSize) / 2 + "px";
				ret.touchCloseArea.style.borderRadius = "50%";
				ret.touchCloseArea.style.zIndex = "1";
				addResizeEvent(ret.touchCloseArea, resizeTopRight);
				addCloseEvent(ret.touchCloseArea);
				disableDragStart(ret.touchCloseArea);
				ret.main.appendChild(ret.touchCloseArea);
			}
		}

		var clientX,
			clientY,
			deltaX = 0,
			deltaY = 0;
		function addCloseEvent(element) {
			webMI.addEvent(element, "click", function(e) {
				webMI.display.closeWindow(ret);
			});
			webMI.addEvent(element, "touchend", function(e) {
				e.preventDefault();
				if (deltaX <= 5 && deltaY <= 5) {
					webMI.display.closeWindow(ret);
				}
				deltaX = 0;
				deltaY = 0;
			});
			webMI.addEvent(element, "touchmove", function(e) {
				var deltaXnew = e.changedTouches[0].clientX - clientX;
				var deltaYnew = e.changedTouches[0].clientY - clientY;
				if (deltaXnew > deltaX) deltaX = deltaXnew;
				if (deltaYnew > deltaY) deltaY = deltaYnew;
			});
			webMI.addEvent(element, "touchstart", function(e) {
				e.preventDefault();
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			});
			//Prevent dragging of window when mouse is over close button
			webMI.addEvent(element, ["pointerdown", "mousedown"], function(e) {
				e.stopPropagation();
			});
		}

		function disableDragStart(obj) {
			webMI.addEvent(obj, "dragstart", function(e) {
				if (!e) e = window.event;
				if (e.preventDefault) e.preventDefault();
			});
			//prevent scrolling and resizing at same time
			obj.style.touchAction = "none";
			//iOS doesn't support touchAction fully right now
			if (isIOSDevice) obj.addEventListener("touchmove", function(e) { e.preventDefault(); }, { passive: false });
		}

		if (ret.head) disableDragStart(ret.head);

		ret.resizeTo = function(w, h) {
			ret.main.style.width = w + "px";
			ret.main.style.height = h + "px";
			ret.content.style.width = w + "px";
			ret.content.style.height = h - headerheight + "px";
		};

		ret.moveTo = function(l, t) {
			if (l < 0) l = 0;
			if (t < 0) t = 0;

			if (l != null) ret.main.style.left = l + "px";
			if (t != null) ret.main.style.top = t + "px";
		};

		ret.setTitle = function(t) {
			if (ret.title) ret.title.data = t;
		};

		ret.setURL = function(u) {
			var isExternalHost = webMI.isExternalHost(u, location);
			if (!isExternalHost) {
				ret.iframe.scrolling = "no";
			}
			if (isIOSDevice) {
				ret.content.style.overflow = "scroll";
				ret.content.style["-webkit-overflow-scrolling"] = "touch";
			}
			ret.iframe.src = u;

			if (!isExternalHost) {
				webMI.addEvent(ret.iframe, "load", function(e) {
					if (ret.closed)
						return;

					webMI.addEvent(contentDocumentOf(ret.iframe), ["click", "keypress", "touchstart"], function(e) {
						webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"restartTimer"});
					});
					webMI.addEvent(contentDocumentOf(ret.iframe), pointerEventsOn ? "pointerdown" : "touchstart", function(e) {
						if (!pointerEventsOn || e.pointerType == "touch") {
							ret.iframe.contentWindow.webMI.display.showPopup(0, 0, null);
						}
					});
					consistencyHandler.read();
				});
			}
		};

		ret.closed = false;
		ret.close = function() {
			if (!ret.closed) {
				ret.closed = true;
				try {
					if (ret.iframe.contentWindow != null) tabHandler.removeDoc(contentDocumentOf(ret.iframe), true);
				} catch (ex) {}

				ret.iframe.src = "";
				if (features.modal) decESC();
				childwindowsDiv.removeChild(ret.backgroundDiv);
				childwindowsDiv.removeChild(ret.main);
				webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", { action: "removePopup", popup: ret });
				consistencyHandler.pop();

				for (var i = 0; i < mouseMoveFunctions.length; ++i) {
					if (mouseMoveFunctions[i] != ret) continue;
					mouseMoveFunctions.splice(i, 1);
					mouseUpFunctions[i].mouseUpFunction();
					mouseUpFunctions.splice(i, 1);
					break;
				}
			}
		};

		ret.getFrame = function() {
			return ret.iframe;
		};

		ret.getForeignObjectContainer = function() {
			return ret.foreignObjectDiv;
		};

		ret.getContentDocument = function() {
			try {
				return contentDocumentOf(ret.iframe);
			} catch (ex) {
				return null;
			}
		};
		ret.getContentWindowWebMI = function() {
			try {
				if (ret.iframe.contentWindow.webMI) {
					return ret.iframe.contentWindow.webMI;
				}
				return null;
			} catch (ex) {
				return null;
			}
		};

		function setVisibility(value) {
			if (!value) {
				childWindowTopZindex = parseIndexOfElements("*").index;
				ret.main.style.zIndex = childWindowTopZindex;
			}
			ret.content.style.visibility = value ? "" : "hidden";
		}

		if (features.movable) {
			ret.head.style.cursor = "move";
			ret.head.style.touchAction = "none";
			//iOS doesn't support touchAction fully right now
            if (isIOSDevice) ret.head.addEventListener("touchmove", function(e) {e.preventDefault();}, {passive: false} ); 

			webMI.addEvent(ret.head, pointerEventsOn ? "pointerdown" : isIOSDevice ? "touchstart" : "mousedown", function(e) {
				if (!e) 
					e = window.event;

				if (isIOSDevice && e.touches) 
					e = e.touches[0];

				if (!features.modal) {
					incESC();
					ret.backgroundDiv.style.width = "100%";
					ret.backgroundDiv.style.height = "100%";
				}

				if (autofit) scaleFactor = webMI.gfx.getAbsoluteScaleFactor(true, mainContainerEl.childNodes[0]);

				ret.mouseHandler = { _function: ret.moveTo, x: e.clientX - parseFloat(ret.main.style.left) * scaleFactor, y: e.clientY - parseFloat(ret.main.style.top) * scaleFactor };
				setVisibility();
			});

			addMouseOutTimer(ret.head);
			webMI.addEvent(ret.head, pointerEventsOn ? "pointerup" : isIOSDevice ? "touchend" : "mouseup", function(e) {
				for (var i = 0; i < mouseUpFunctions.length; ++i) mouseUpFunctions[i].mouseUpFunction(e);
			});
		}

		function addMouseOutTimer(element) {
			ret.mouseOutTimer = null;
			webMI.addEvent(element, pointerEventsOn ? "pointerleave" : "mouseout", function(e) {
				if (ret.mouseOutTimer) {
					clearTimeout(ret.mouseOutTimer);
				}
				ret.mouseOutTimer = setTimeout(function() {
					for (var i = 0; i < mouseUpFunctions.length; ++i) mouseUpFunctions[i].mouseUpFunction(e);
				}, 500);
			});
		}

		if (features.resizable) {
			var offset = -resizeDragAreaSize / 2;
			//Draggable div top left corner
			ret.rsTopLeft = createDraggableDiv(resizeTopLeft, "nwse-resize");
			ret.rsTopLeft.style.top = offset + "px";
			ret.rsTopLeft.style.left = offset + "px";
			//Draggable div top right corner
			ret.rsTopRight = createDraggableDiv(resizeTopRight, "nesw-resize");
			ret.rsTopRight.style.top = offset + "px";
			ret.rsTopRight.style.right = offset + "px";
			//Draggable div bottom left corner
			ret.rsBottomLeft = createDraggableDiv(resizeBottomLeft, "nesw-resize");
			ret.rsBottomLeft.style.bottom = offset + "px";
			ret.rsBottomLeft.style.left = offset + "px";
			//Draggable div bottom right corner
			ret.rsBottomRight = createDraggableDiv(resizeBottomRight, "nwse-resize");
			ret.rsBottomRight.style.bottom = offset + "px";
			ret.rsBottomRight.style.right = offset + "px";
		}

		function createDraggableDiv(resizeFunction, cursor) {
			var draggableDiv = document.createElement("div");
			draggableDiv.style.cursor = cursor;
			draggableDiv.style.position = "absolute";
			draggableDiv.style.width = resizeDragAreaSize + "px";
			draggableDiv.style.height = resizeDragAreaSize + "px";
			draggableDiv.style.borderRadius = "50%";
			ret.main.appendChild(draggableDiv);
			disableDragStart(draggableDiv);
			addMouseOutTimer(draggableDiv);
			addResizeEvent(draggableDiv, resizeFunction);
			return draggableDiv;
		}

		function addResizeEvent(element, resizeFunction) {
			webMI.addEvent(element, pointerEventsOn ? "pointerdown" : isIOSDevice ? "touchstart" : "mousedown", function(e) {
				if (!e) e = window.event;

				if (isIOSDevice && e.touches) e = e.touches[0];

				if (!features.modal) {
					incESC();
					ret.backgroundDiv.style.width = "100%";
					ret.backgroundDiv.style.height = "100%";
				}

				if (autofit) scaleFactor = webMI.gfx.getAbsoluteScaleFactor(true, mainContainerEl.childNodes[0]);

				ret.mouseHandler = {
					_function: resizeFunction,
					x: e.clientX,
					y: e.clientY,
					startingValues: {
						width: parseFloat(ret.main.style.width),
						height: parseFloat(ret.main.style.height),
						left: parseFloat(ret.main.style.left),
						top: parseFloat(ret.main.style.top)
					}
				};
				setVisibility();
			});
		}

		function resizeTopLeft(x, y, startingValues) {
			ret.resizeTo(startingValues.width - x, startingValues.height - y);
			ret.moveTo(startingValues.left + x, startingValues.top + y);
		}

		function resizeTopRight(x, y, startingValues) {
			ret.resizeTo(startingValues.width + x, startingValues.height - y);
			ret.moveTo(null, startingValues.top + y);
		}

		function resizeBottomLeft(x, y, startingValues) {
			ret.resizeTo(startingValues.width - x, startingValues.height + y);
			ret.moveTo(startingValues.left + x, null);
		}

		function resizeBottomRight(x, y, startingValues) {
			ret.resizeTo(startingValues.width + x, startingValues.height + y);
		}

		ret.mouseMoveFunction = function(e) {
			if (ret.mouseOutTimer) clearTimeout(ret.mouseOutTimer);

			var obj = ret.mouseHandler;

			if (obj != null && obj != undefined && obj._function != undefined) obj._function((e.clientX - obj.x) * (1 / scaleFactor), (e.clientY - obj.y) * (1 / scaleFactor), obj.startingValues);
		};

		ret.mouseUpFunction = function(e) {
			if (ret.mouseHandler) {
				setVisibility(1);
				ret.mouseHandler = null;
				if (!features.modal) {
					decESC();
					ret.backgroundDiv.style.width = 0;
					ret.backgroundDiv.style.height = 0;
				}
			}
		};

		mouseMoveFunctions.push(ret);
		mouseUpFunctions.push(ret);

		if (!webMI.isExternalHost(features.url, location)) {
			webMI.addEvent(ret.iframe, "load", function() {
				var docAct, webMIAct;
				if (ret.iframe.contentWindow) {
					if ((docAct = ret.getContentDocument()) != null) {
						if (docAct.location.href != "about:blank") {
							tabHandler.registerDisplay(docAct);
							tabHandler.beforeFirstUse(docAct, true);
							if ((webMIAct = ret.getContentWindowWebMI()) != null) {
								webMIAct.addOnfocus(function() {
									tabHandler.getFocused(docAct);
								});
							  features.close_on_esc && webMIAct.keys.addCombinationListener(0,27,function(e) {
										if (tabHandler.isFocused(docAct) && tabHandler.getAcceptKeys()) {
											webMI.display.closeWindow(ret);
										}
									});
							}
						}
						if (isIOSDevice && docAct.documentElement) {
							// MobileSafari sometimes expands the normal size of the iframe
							// to the size of width / height svg attributes. Avoid this by
							// removing the attributes so the document will fit automatically.

						if (iOSVersion != null && parseInt(iOSVersion[1], 10) >= 8)
						  return;

							docAct.documentElement.removeAttribute("width");
							docAct.documentElement.removeAttribute("height");
						}
					}
				}
			});
		}

		ret.resizeTo(w, h);
		ret.moveTo(x + offsetLeft, y + offsetTop);
		ret.setTitle(features.title);
		ret.setURL(features.url);

		consistencyHandler.push();
		tabHandler.blurFocused();
		tabHandler.renew(features.modal);
		webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"pushPopup","popup":ret});
	}

	return ret;
}

function switchUser(uData) {
	if (webMI.display.isRoot() && "preferredlanguage" in uData && "username" in uData &&
		uData.username != "" && uData.preferredlanguage != "" && uData.preferredlanguage != currentLanguage.value) {
		/* [AT-D-5620] workaround for Firefox (all versions): call switchLanguage directly in case that default display is not loaded yet */
			if (tabHandler.getIFrameNames().length == 0)
				switchLanguage(uData.preferredlanguage);
			else
				fillCurrentFrame(tabHandler.getIFrameNames(), uData.preferredlanguage);
	}
}

var addedClosePopUpEvents = [];
var displayPopupOpen = {};
var isDisplayMenu;
var clickAreaId;
var oldClickAreaId;

function showPopup(x, y, menu) {

	if (menu == -1) addedClosePopUpEvents = [];

	oldClickAreaId = clickAreaId;

	if (menu != null && menu != -1 && typeof menu.style != "undefined") {
		clickAreaId = menu.style.clickAreaId;
		if (oldClickAreaId != undefined && oldClickAreaId != clickAreaId) displayPopupOpen[oldClickAreaId] = false;
		isDisplayMenu = menu.style.isDisplayMenu;
	}

	if (typeof isDisplayMenu != "undefined" && isDisplayMenu == true) {
		if (typeof displayPopupOpen[clickAreaId] == "undefined" || displayPopupOpen[clickAreaId] == false) displayPopupOpen[clickAreaId] = true;
		else displayPopupOpen[clickAreaId] = false;
	}

	var showCount = 10000;

	function getHover(color) {
		return function(e) {
			var element = (e.currentTarget != undefined) ? e.currentTarget : e.srcElement;
			element.style.backgroundColor = color;
		};
	};


	function compareMenu(lastMenu, menu) {
		var same = true;
		if (lastMenu != null && lastMenu != -1) {
			for (var i in menu) {
				if (i != "style" && i != "itemsCount") {
					same = lastMenu[i] != undefined;
				}
			}
		} else {
			same = false;
		}
		return same;
	};

	var sameMenu = compareMenu(lastMenu, menu);

	if (menu != null && menu != -1 && !sameMenu && !menu.mouseout) {
		if ("itemsCount" in menu && Number(menu.itemsCount) != 0) showCount = Number(menu.itemsCount);

		lastMenu = menu;
		popupvisible = "visible";

		var styleDefaults = { maxRows: 10, fontSize: 12, fontFamily: "Arial", fontFill: "#000000", width: 140, fill: "#FFFFFF", stroke: "#000000", strokeWidth: 2, hoverFill: "#EFEFEF", closeTime: 500, zIndex: 100, showType: "right" };
		var style = (menu.style != undefined) ? menu.style : {};
		for (var i in styleDefaults) {
			if (style[i] == undefined) style[i] = styleDefaults[i];
		}

		var padding = 3;
		var fontPix = parseFloat(style.fontSize);

		if (popupmenulist != undefined) {
			while (popupmenulist.hasChildNodes()) {
				popupmenulist.removeChild(popupmenulist.lastChild);
			}
		}
		if (popup != undefined) {
			while (popup.hasChildNodes()) {
				popup.removeChild(popup.lastChild);
			}
		}

		function getPath(target) {
			var path = [];
			var currentElem = target;
			while (currentElem) {
				path.push(currentElem);
				currentElem = currentElem.parentElement;
			}
			if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
			  path.push(document);
			if (path.indexOf(window) === -1)
			  path.push(window);
			return path;
		}

		function closePopups(e) {

			if(typeof menu.style == "undefined")
			     return;

			if (e.path == undefined) var path = getPath(e.target);
			else var path = e.path;

			var isConcernedButton = path.filter(function(v) {
				return typeof v.id != "undefined" && (v.id.indexOf(clickAreaId) != -1);
			})[0] != undefined;

			if ( 
				 isConcernedButton == false && (e.currentTarget.id == undefined || e.currentTarget.id == "") || (e.currentTarget.id == "popup_1_main" && menu.style.closeOnMouseout == "true")
				) {
				/* [AT-D-7194]: Prevent Popup closing on touch on show previous/next button in IE and Edge */
				if (pointerEventsOn && e.type == "pointerleave" && e.pointerType == "touch") {
					return;
				}
				window.setTimeout(function() {
					for (var x = 0; x < popups.length; x++) {
						popups[x].style.visibility = "hidden";
					}
				}, style.closeTime);
				lastMenu = null;

				for (key in displayPopupOpen) {
					displayPopupOpen[key] = false;
				}
			}
		};

		function createEntry(parent, menuElement, menuAction, menuElementFn, level, listPos, onDemand, textAlign, menuPosition) {
			var listEntryEl = document.createElement("div");
			listEntryEl.setAttribute("listPos", listPos);
			if (menuElement == ""){/*empty row*/
				listEntryEl.innerHTML = "&nbsp;";
				applyStyleToListItem(listEntryEl);
				parent.appendChild(listEntryEl);
				return;
			}
			if (level && level < 0){/*scroller*/
				if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(menuElement)) {
					var img = document.createElement("img");
					img.src = menuElement;

					if (style.itemHeight)
						img.style.height = style.itemHeight + "px";
					else
						img.style.height = fontPix+padding + "px";

					img.style.width = "40px";
					listEntryEl.appendChild(img);

					listEntryEl.setDisabled = function() {
						img.style.opacity = 0.4;
						img.style.filter = "alpha(opacity=40)";
					};
					listEntryEl.setEnabled = function() {
						img.style.opacity = 1;
						img.style.filter = "alpha(opacity=100)";
					};
				} else {
					listEntryEl.innerHTML = menuElement;

					listEntryEl.setDisabled = function() {
						listEntryEl.style.color = "#c1c1c1";
					};
					listEntryEl.setEnabled = function() {
						listEntryEl.style.color = style.fontFill;
					};
				}

				applyStyleToListItem(listEntryEl);
				listEntryEl.style.textAlign = "center";
			} else {
				applyStyleToListItem(listEntryEl);
				var newDiv = document.createElement("div");
				var divStyle = "display: inline-block; word-break: break-word; overflow: hidden; vertical-align: middle";
				newDiv.setAttribute("style", divStyle);
				newDiv.style.lineHeight = (fontPix+padding) + "px";
				newDiv.style.maxHeight = ((fontPix+padding)) + "px";
				if (style.itemHeight > (fontPix+padding) * 2)
					newDiv.style.maxHeight = ((fontPix+padding) * 2) + "px";

				newDiv.innerHTML = menuElement;
				listEntryEl.appendChild(newDiv);
				if(textAlign) listEntryEl.style.textAlign = textAlign;
				if(menuPosition) listEntryEl.menuPosition = menuPosition;
				if (!onDemand) /*wegen onDemand and iPad onmouseover*/
					webMI.addEvent(listEntryEl, "click", closePopups);
				webMI.addEvent(listEntryEl, "mouseover", getHover(style.hoverFill));
				webMI.addEvent(listEntryEl, "mouseout", getHover(style.itemFill ? style.itemFill : style.fill));
			}
			parent.appendChild(listEntryEl);
			for (var i = 0; i < menuAction.length; ++i) {
				webMI.addEvent(listEntryEl, menuAction[i], menuElementFn[i]);
			}
		};
		function applyStyleToListItem(listEntryEl) {
			var a_style = "text-decoration: none; color: #000000; cursor: pointer;";
			listEntryEl.setAttribute("style", a_style);
			listEntryEl.style.color = style.fontFill;
			
			var heightMultiplicator = webMI.getClientInfo() ? webMI.getClientInfo().deviceScaling.contextmenu.rowheight : 1;
			if (style.itemHeight)
				listEntryEl.style.height = style.itemHeight + "px";
			else
				listEntryEl.style.height = (fontPix+padding) * heightMultiplicator + "px";

			listEntryEl.style.lineHeight = listEntryEl.style.height;
			if (style.itemFill) listEntryEl.style.background = style.itemFill;
			if (style.itemBorder) listEntryEl.style.border = style.itemBorder;
			if (style.itemPadding) listEntryEl.style.padding = style.itemPadding + "px";
			if (style.itemMargin) {
				listEntryEl.style.marginTop = style.itemMargin + "px";
				listEntryEl.style.marginBottom = style.itemMargin + "px";
			}
			if (style.itemBorderRadius) listEntryEl.style.borderRadius = style.itemBorderRadius + "px";
		}
		function closeAndOpenPopup(parent, level, i, listPos) {
			for (var p in popups) {
				var parts = popups[p].id.split("_");
				if (parts[1] != undefined) {
					var lev = parseFloat(parts[1]);
					if (i && popups[p].id == "popup_" + level + "_" + i && popups[p].parentNode == parent) {
						popups[p].style.visibility = "visible";
						listPos && popups[p].topCorrection(listPos);
					}
					else if (lev >= level) {
						popups[p].style.visibility = "hidden";
					}
				}
			}
		};
		var level = 1;
		function createMenu(menu, parent, offset, name, level, onDemand) {
			var onD = onDemand || false;
			var curPopup = (parent) ? document.createElement("DIV") : popup;
			var p_style = "position: absolute; visibility: hidden; width: 160px; border: 2px solid #000; padding: 0; margin: 0";
			var curMenulist = (parent) ? document.createElement("DIV") : popupmenulist;
			var pm_style = "list-style: none; margin: 0; padding: 3px; margin-left: 0px";

			curPopup.setAttribute("style", p_style);
			curMenulist.setAttribute("style", pm_style);

			var entries = 0;
			var showMenu = 0;

			function showNext(list, step) {
				function deltaPos(e){return (e>=0)?1:0;}
				function appendOrRemoveSpacer(showMenu, entries, append) {
					var lC,nB;
					if (showMenu <= entries) return;
					if (curMenulist.lastChild.menuPosition == "bottom")
						list.removeChild(nB = list.lastChild.previousSibling);
					list.removeChild(lC = list.lastChild);
					if (append)
						for (var i=0;i<showMenu-entries;i++) createEntry(list,"");
					else
						for (var i=0;i<showMenu-entries;i++) list.removeChild(list.lastChild);
					if (nB) list.appendChild(nB);
					list.appendChild(lC);
				}
				return function(e) {
					var dP;
					if ((dP=deltaPos(step))==1 && showMenu >= entries || dP==0 && showMenu <= showCount) return;

					var fixedTopItem = 0;
					var fixedBottomItem = 0;
					var stepCorr = step;
					var showCountCorr = showCount;
					if (curMenulist.firstChild.menuPosition == "top") {
						if (showMenu > 0) list.firstChild.nextSibling.setEnabled();
						fixedTopItem = 1;
						stepCorr = (step < 0) ? step+1 : step-1;
						showCountCorr--;
					} else {
						if (showMenu > 0) list.firstChild.setEnabled();
					}

					if (curMenulist.lastChild.menuPosition == "bottom") {
						if (showMenu >= entries) list.lastChild.previousSibling.setEnabled();
						fixedBottomItem = 1;
						stepCorr = (step < 0) ? step+1 : step-1;
						showCountCorr--;
					} else {
						if (showMenu >= entries) list.lastChild.setEnabled();
					}

					
					appendOrRemoveSpacer(showMenu, entries-fixedTopItem-fixedBottomItem, false);
					if (dP == 1) showMenu += stepCorr;
					var lb,corr=((lb = showMenu-showCountCorr+(deltaPos(-stepCorr)*stepCorr))<0)?Math.abs(lb):0;
					for (var i = 1 + fixedTopItem; i < list.childNodes.length - 1 - fixedBottomItem; i++) {
						list.childNodes[i].style.display = ((i-1-fixedTopItem)>=(lb+corr) && (i-1-fixedTopItem)<lb+showCountCorr+corr)?"block":"none";
						list.childNodes[i].setAttribute("listPos", i - lb + corr + 1);
					}
					if (dP == 0) showMenu += stepCorr;
					appendOrRemoveSpacer(showMenu, entries-fixedTopItem-fixedBottomItem, true);

					if (curMenulist.firstChild.menuPosition == "top") {
						if (showMenu <= showCount) list.firstChild.nextSibling.setDisabled();
					} else {
						if (showMenu <= showCount) list.firstChild.setDisabled();
					}

					if (curMenulist.lastChild.menuPosition == "bottom") {
						if (showMenu >= showCount) list.lastChild.previousSibling.setDisabled();
					} else {
						if (showMenu >= showCount) list.lastChild.setDisabled();
					}
				};
			};

			createEntry(curMenulist, "<i class='fas fa-chevron-up'></i>", ["click"], [showNext(curMenulist, -showCount)], -1); // '/prev.png'
			for (var i in menu) {
				if (i == "tooltip") {
					var listEntryEl = document.createElement("div");
					listEntryEl.style.whiteSpace = "nowrap";
					listEntryEl.style.color = style.fontFill;
					listEntryEl.innerHTML = webMI.secureString(menu.text);
					//listEntryEl.appendChild(document.createTextNode(menu.text));
					curMenulist.appendChild(listEntryEl);
					entries++;
					break;
				} else if (i == "languagemenu") {
					function getFn(id) {
						return function() {
							fillCurrentFrame(tabHandler.getIFrameNames(), id);
						};
					};
					for (var id in project.languages) {
						createEntry(curMenulist, project.languages[id], ["click"], [getFn(id)], level, entries + 1, undefined, (style.textAlign) ? style.textAlign : undefined);
						entries++;
					}
					break;
				} else if (i != "style" && i != "itemsCount") {
					if (menu[i].sub == undefined) {
						function getChangeFn(i, level) {
							return function(e) { closeAndOpenPopup(curPopup,level+1); };
						};
						var html = menu[i].text;
						if(menu[i].icon){
							var fav = menu[i].icon.fav;
							var right = menu[i].icon.align === "right";
							html = (!right ? fav + " ": "") + html + (right ? " " + fav : "");
						} 
						var textAlign = null;
						if(menu[i].textAlign) textAlign = menu[i].textAlign

						var menuPosition = null;
						if(menu[i].menuPosition) menuPosition = menu[i].menuPosition

						createEntry(curMenulist, html, ["mouseover", "click"], [getChangeFn(i, level), menu[i].value], level, entries + 1, null, textAlign, menuPosition);
						entries++;
					} else if (typeof menu[i].sub == "function") {
						var subLevel = level + 1;
						function getOpenFn1(i, fn, startAdress, level, offset, onclick) {
							var clickAdded = false;
							return function(e) {
								var listEntryEl = (e.currentTarget)?e.currentTarget:e.srcElement;
								var listPos = Number(listEntryEl.getAttribute("listPos") || "0");
								fn(startAdress, function(tmpObj) {
									var subMenu = createMenu(tmpObj, curPopup, offset, i, level, true);
									closeAndOpenPopup(curPopup, level, i, listPos);
									/*wegen onDemand and iPad onmouseover*/
									if (!clickAdded) {
										webMI.addEvent(listEntryEl, "click", closePopups);
										webMI.addEvent(listEntryEl, "click", onclick);
										clickAdded = true;
									}
								});
							};
						};
						createEntry(curMenulist, i + " >", ["mouseover"], [getOpenFn1(i, menu[i].sub, menu[i].base, subLevel, entries, menu[i].value)], level, entries + 1, true);
						entries++;
					} else {
						var subLevel = level + 1;
						var subMenu = createMenu(menu[i].sub, curPopup, entries, i, subLevel);
						function getOpenFn2(i, level) {
							return function(e) {
								var listEntryEl = (e.currentTarget)?e.currentTarget:e.srcElement;
								var listPos = Number(listEntryEl.getAttribute("listPos") || "0");
								closeAndOpenPopup(curPopup, level, i, listPos);
							};
						};
						createEntry(curMenulist, i + " >", ["mouseover", "click"], [getOpenFn2(i, subLevel), menu[i].value], level, entries + 1);
						entries++;
					}
				}
			}
			createEntry(curMenulist, "<i class='fas fa-chevron-down'></i>", ["click"], [showNext(curMenulist, showCount)], -1); // '/next.png'

			if (entries > 0) {

				//sort entries -> top item on top, bottom item to bottom
				var items = curMenulist.children;
				var topItem, bottomItem;
				for (var i in items) {
					if (items[i].menuPosition == "top")
						topItem = items[i];
					else if (items[i].menuPosition == "bottom")
						bottomItem = items[i];
				}

				if (topItem) curMenulist.insertBefore(topItem, curMenulist.childNodes[0]);
				if (bottomItem) curMenulist.appendChild(bottomItem);

				var mainContainer = document.getElementById("mainContainer");
				var height;
				var heightMultiplicator = webMI.getClientInfo() ? webMI.getClientInfo().deviceScaling.contextmenu.rowheight : 1;

				var entryHeight = (style.itemHeight && style.itemHeight > fontPix) ? style.itemHeight : (fontPix+padding) * heightMultiplicator;
				if (style.itemPadding) entryHeight = entryHeight + 2 * style.itemPadding;
				if (style.itemMargin) entryHeight = entryHeight + style.itemMargin;
				if (style.itemBorder) {
					var borderPx = style.itemBorder.match(/\d+\s*/g);
					if (borderPx) {
						borderPx = parseInt(borderPx[0].replace("px","").trim());
							entryHeight = entryHeight + borderPx * 2;
						}
					}
				//entryHeight = entryHeight + padding;

				if (entries <= showCount)
					height = (entryHeight * entries) + 6;
				else
					height = (entryHeight * (showCount+2)) + 6;
				if (style.itemMargin) height = height - style.itemMargin;
				curPopup.id = "popup_" + level + "_" + name;
				curPopup.appendChild(curMenulist);
				var top = 0;
				var left = 0;
				var innerWidth = parseFloat(mainContainer.style.width);
				var innerHeight = parseFloat(mainContainer.style.height);
				var startLeft = 0;

				startLeft = ((x + style.width) >= innerWidth) ?  innerWidth - style.width - style.strokeWidth: x;

				if (parent) {
					top = (fontPix+padding) * (offset);
					/*no window scrolling horizontally*/
					var dir = 1;
					if (style.showType == "right") {
						for (var lev = 0; lev < level; lev++) {
							startLeft += (style.width * dir);
							if (startLeft > innerWidth - 10) {
								dir = -1;
								startLeft -= 2 * style.width;
							}
							if (startLeft - style.width < 0) {
								dir = 1;
								startLeft += 2 * style.width;
							}
						}
					} else if (style.showType == "alternate")
						dir = (level%2 == 0) ? 1 : -1;

					left = dir * style.width;

					//substract border of first and second directory only for first folder - if direction goes left
					if (dir === -1) {
						left -= 2 * style.strokeWidth;
					}

					curPopup.style.top = -innerHeight + "px";
				} else {

					if (!style.elementHight) {
						top = (y + height) >= (innerHeight-5) ? innerHeight - 2*height: y;
					} else {
						top = (y + height) >= (innerHeight-5) ? y - height - style.elementHight: y;
					}

					left = startLeft;
					curPopup.style.top = top + "px";
				}
				var onlyOnce = false;
				curPopup.topCorrection = function(listPos) {
					/*if is scrollable DIV then topCorrection need once*/
					if (entries <= showCount && onlyOnce) return;
					/*mouseover && scrollable -> calculate pos*/
					var heightMultiplicator = webMI.getClientInfo() ? webMI.getClientInfo().deviceScaling.contextmenu.rowheight : 1;
					var entryHeight = style.itemHeight && style.itemHeight > fontPix ? style.itemHeight : (fontPix+padding)*heightMultiplicator;
					if (style.itemPadding) entryHeight = entryHeight + 2 * style.itemPadding;
					if (style.itemMargin) entryHeight = entryHeight + style.itemMargin;
					if (style.itemBorder) {
						var borderPx = style.itemBorder.match(/\d+\s*/g);
						if (borderPx) {
							borderPx = parseInt(borderPx[0].replace("px","").trim());
								entryHeight = entryHeight + borderPx * 2;
							}
						}

					top = (listPos!=0)? entryHeight * (listPos-1):top;
					/*no window scrolling  vertically part*/
					curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
					if (curPopup.totalOffset + height > (innerHeight - 10)) {
						top = top - (curPopup.totalOffset + height - innerHeight) - 30;
						curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
						if (curPopup.totalOffset < 0) {
							top = top - curPopup.totalOffset;
							curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
						}
					}
					onlyOnce = true;
					curPopup.style.top = top + "px";
				};
				curPopup.style.left = left + "px";
				if (typeof style.width == "string" && style.width == "auto") {
					curPopup.style.width = "auto";
				} else if (typeof style.width == "object" && style.width.length == 2 && style.width[0] == "auto") {
					curPopup.style.width = style.width[0];
					if (curPopup.clientWidth < style.width[1]) {
						curPopup.style.width = (style.width[1]) + "px";
					}
				} else if (typeof style.width == "number") {
					curPopup.style.width = (style.width) + "px";
				}
				//curPopup.style.width = (style.width) + "px";
				curPopup.style.fontSize = style.fontSize + "px";
				curPopup.style.fontFamily = style.fontFamily;
				if (style.fill != 0) curPopup.style.backgroundColor = style.fill;
				if (style.borderRadius) curPopup.style.borderRadius = style.borderRadius + "px";
				curPopup.style.border = style.strokeWidth + "px solid " + style.stroke;
				curPopup.style.visibility = (parent) ? "hidden" : "visible";
				curPopup.style.zIndex = Math.max(style.zIndex, parseIndexOfElements("*").index);
				if (parent) {
					parent.appendChild(curPopup);
				}
				pushPopups(curPopup, onD);
		
				if (typeof menu.style != "undefined" && menu.style.closeOnMouseout == "false" && !mobile) {

					var list = document.querySelectorAll("iframe");
							
					for (var i = 0; i < list.length; i++) {
						if (addedClosePopUpEvents.indexOf(list[i]) == -1) {
							webMI.addEvent(list[i].contentDocument, "click", closePopups);
							addedClosePopUpEvents.push(list[i]);
						}
					}

					webMI.addEvent(document, "click", closePopups);
					if (pointerEventsOn) {
						curPopup.onpointerleave = {};
					} else {
						curPopup.onmouseleave = {};
					}
				} else {
				/* Add event without webMI.addEvent, because this section will be called mulitply times and webMI.addEvent always adds a new event.
				 * Use Pointer Events if enabled according to issue [AT-D-7194] */
				if (pointerEventsOn) {
						curPopup.onpointerleave = closePopups;
					} else {
						curPopup.onmouseleave = closePopups;
					}
				}

				if (curPopup.style.width == "auto") {
					var corLeft = ((x + curPopup.offsetWidth) >= innerWidth) ?  innerWidth - (curPopup.offsetWidth+50) : x;
					curPopup.style.left = corLeft + "px";
				}
				/*First use Scroller*/
				if (entries <= showCount) {
					if (curMenulist.firstChild.menuPosition == "top")
						curMenulist.removeChild(curMenulist.firstChild.nextSibling);
					else
						curMenulist.removeChild(curMenulist.firstChild);
					
					if (curMenulist.lastChild.menuPosition == "bottom")
						curMenulist.removeChild(curMenulist.lastChild.previousSibling);
					else
						curMenulist.removeChild(curMenulist.lastChild);
				}
				else {
					showNext(curMenulist, showCount).call();
				}
			} else {
				popupvisible = "hidden";
			}
			return curPopup;
		};
		createMenu(menu, null, null, "main", 1);
		for (var p = popups.length; p > 0; p--) {
			checkPopupsTopParent(p - 1);
		}
	} else if (menu == null || sameMenu || !menu.mouseout) {
		popupvisible = "hidden";
		for (var i = 0; i < popups.length; i++) {
			popups[i].style.visibility = "hidden";
		}
		lastMenu = null;
	}

	popup.style.visibility = popupvisible;

}
function setSoundHandler() {
	var loopTimeout = {};
	if (audio != undefined) {
		while (audio.hasChildNodes()) {
			audio.removeChild(audio.lastChild);
		}
	}

	function iterArray(arr, fn) {
		for (var i = 0; i < arr.length; i++) fn(arr[i], i);
	};
	function iterObject(arr, fn) {
		for (var obj in arr) fn(arr[obj], obj);
	};
	function createElementWithAttrs(nodeName, attrs) {
		var elem = webMI.dom.createElement("http://www.w3.org/1999/xhtml", nodeName);
		iterObject(attrs, function(val, key) {
			elem.setAttribute(key, val);
		});
		return elem;
	};
	function play(myAudio, playcount, loop, URL) {
		if (loop != undefined && (loop == 0 || loop == 1)) {
			myAudio.loop = loop == 0;
			myAudio.play();
		} else if (loop != undefined && playcount < loop) {
			if (!myAudio.ended) {
				loopTimeout[URL||myAudio.src] = window.setTimeout(function(){play(myAudio,playcount,loop)},1500);
			}
			else {
				myAudio.play();
				loopTimeout[URL||myAudio.src] = window.setTimeout(function(){play(myAudio,playcount+1,loop)},500);
		}
	}
	};
	function stop(myAudio, URL) {
		myAudio.pause();
		clearTimeout(loopTimeout[URL || myAudio.src]);
	};
	audio.appendObject = function(src, loop) {
		var object = null;
		var audioTagSupport = !!(document.createElement('audio').canPlayType);
		if (audioTagSupport) {
			var myAudio = createElementWithAttrs("audio",{'style':'display:none',controls:"true",autoplay:"true"});
			if (typeof myAudio.canPlayType === "function" && myAudio.canPlayType("audio/mp4") !== "" && src.indexOf(".m4a") != -1) {
				myAudio.src = src;
				audio.appendChild(myAudio);
				play(myAudio, 1, loop);
			} else if (typeof myAudio.canPlayType === "function" && myAudio.canPlayType("audio/ogg") !== "" && src.indexOf(".ogg") != -1) {
				myAudio.src = src;
				audio.appendChild(myAudio);
				play(myAudio,1,loop)
			} else if (typeof myAudio.canPlayType === "function" && myAudio.canPlayType('audio/wav; codecs="1"') !== "" && src.indexOf(".wav") != -1) {
				myAudio.src = src;
				audio.appendChild(myAudio);
				play(myAudio,1,loop)
			} else {
				object = createElementWithAttrs("object",{'width':'0','height':'0','type':"audio/x-wav",'data':src});
				object.appendChild(createElementWithAttrs("param",{'name':'src','value':src}));
				if (loop == 0)
					object.appendChild(createElementWithAttrs("param",{'name':'loop','value':'true','valuetype':'data'}));
				else
					object.appendChild(createElementWithAttrs("param",{'name':'playcount','value':loop}));
				audio.appendChild(object);
			}
		}
	};
	audio.appendEmbed = function(src, loop) {
		var embed = null;
		if (loop == 0) {
			embed = createElementWithAttrs("embed",{'src':src,'hidden':'true','loop':'true'});
		}
		else {
			embed = createElementWithAttrs("embed",{'src':src,'hidden':'true','playcount':loop});
		}
		audio.appendChild(embed);
		return embed;
	};
	audio.removeAudio = function(url) {
		if (url == undefined) {
			iterArray(audio.childNodes, function(child) {
				if (child.nodeName.toLowerCase() == "audio")
					stop(child);
				audio.removeChild(child);
			});
		}
		else {
			var obs = [];
			iterArray(audio.childNodes, function(child) {
				if (child.nodeName.toLowerCase() == "object") {
					if (/MSIE/.test(navigator.userAgent)) {
						if (RegExp(url + "$").test(child.URL)) {
							obs[obs.length] = child;
						}
					}
					iterArray(child.childNodes, function(subchild) {
						if (subchild.nodeName.toLowerCase() == "param" && subchild.getAttribute("value") == url) {
							obs[obs.length] = child;
						}
					});
				}
				if ((child.nodeName.toLowerCase()=="embed" && child.getAttribute("src") == url )||
					(child.nodeName.toLowerCase()=="audio" && RegExp(url+"$").test(child.getAttribute("src")) ) ){
					obs[obs.length] = child;
				}
			});
			if (obs.length > 0) {
				iterArray(obs, function(ob) {
					if (ob.nodeName.toLowerCase() == "audio")
						stop(ob);
					audio.removeChild(ob);
				});
			}
		}
	};
	webMI.sound.setHandler(audio.appendObject, audio.removeAudio);
}

webMI.addEvent(webMI.data, "clientvariableschange", function(e) {
	switchUser(e);
});

//initialize quick dynamics
var consistencyHandler = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Consistency Handler");
var tabHandler = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Tab Handler");
webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Configuration", {"action":"init", "indexParameters":webMI.query});

return function(type, v1, v2, v3, v4, v5) {
	if (!extensionsDiv) {
		extensionsDiv = document.getElementById("extensions");

		if (extensionsDiv) {
			childwindowsDiv = extensionsDiv.appendChild(document.createElement("div"));
			childwindowsDiv.style.left = 0;
			childwindowsDiv.style.position = "absolute";
			childwindowsDiv.style.top = 0;
			childwindowsDiv.style.width = "100%";
			childwindowsDiv.style.height = "100%";

			popup = extensionsDiv.appendChild(document.createElement("div"));
			popupmenulist = popup.appendChild(document.createElement("div"));
			audio = extensionsDiv.appendChild(document.createElement("div"));
		}
	}

	if (type == "addedforeignobject" && "scrolling" in webMI.query) {
		var children = v1.children;

		for (var i = 0; i < children.length; ++i) {
			var child = children[i];
			var nodeName = child.nodeName;

			if (nodeName.toLowerCase() == "iframe")
				child.scrolling = webMI.query["scrolling"];
		}
	}
	if (type == "openwindow")
		return openWindow(v1, v2, v3, v4, v5);
	if (type == "showpopup")
		return showPopup(v1, v2, v3);
	if (type == "loadeddisplaysjs")
		displaysJs = v1;
	if (type == "loadedmainframe") {
		if("scrolling" in webMI.query)
		  v1.scrolling = webMI.query["scrolling"];

		if (webMI.isExternalHost(v1.src, location)) {
			return;
		}
		if (webMI.display.isRoot()) {
			setSoundHandler();
			if(alarmManagementGlobal)
			  webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Alarmmanagement", {"id": ""});
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoReconnect", {"activated":"true", "interval":"5", "defaultconfiguration": true});
		}
		webMI.addEvent(contentDocumentOf(v1), ["click", "keypress", "touchstart"], function(e) {
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"restartTimer"});
		});
		webMI.addEvent(contentDocumentOf(v1), pointerEventsOn ? "pointerdown" : "touchstart", function(e) {
			if (!pointerEventsOn || e.pointerType == "touch") {
				v1.contentWindow.webMI.display.showPopup(0, 0, null);
			}
		});

		if (typeof v1.contentWindow.webMI == "undefined") {
			webMI.query.preload = false;
		}
		if (currentFrame.length > 0) {
			for (var i = 0; i < currentFrame.length; i++) {
				/** open display only if current farme is not equal with the frame before switch language occured */
				webMI.trigger.fire("getSource_" + currentFrame[i].name, function(e) {
					if (currentFrame[i].display != e) {
						if (currentFrame[i].url) {
							webMI.display.openUrl(currentFrame[i].url, currentFrame[i].name);
						} else {
							webMI.display.openDisplay(
								currentFrame[i].display.replace(displaysJs["postfix"],""),
								webMI.query,
								currentFrame[i].name
							);
						}
					}
				});
			}
		}
	}
	else if (type == "switchedlanguage") {
		currentLanguage.value = v1;
	}
};
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Rotate":[function(base,webMI,window,document,self){
// This Quick Dynamic rotates the applied graphical element depending on the value of the defined node and the ranged defined by "startAngle" and "stopAngle", i.e. the
// range defined by "minValue" and "maxValue" will be translated to the range defined by "startAngle" and "stopAngle".
// e.g.: the defined range of the value from 0 (=minValue) to 100 (=maxValue) will be translated to 0 (=startAngle) to 360° (=stopAngle)
// Parameters:
//	nodeId:		this node triggers this Quick Dynamic
//	minValue:	lower bound of the range where the node's value should lie in
//	maxValue:	upper bound of the range where the node's value should lie in
//	startAngle:	start position for the rotation where "minValue" will be translated to
//	stopAngle:	stop position for the rotation where "maxValue" will be translated to
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;
	webMI.gfx.setRotation(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startAngle, base.stopAngle));
}

},{"nodeId":"","minValue":"0","maxValue":"100","startAngle":"0","stopAngle":"360"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Save As":[function(base,webMI,window,document,self){
function createElement(nodeName, attributes, style, parent) {
	var element = webMI.dom.createElement("http://www.w3.org/1999/xhtml", nodeName);
	for (var i in attributes)
		element.setAttribute(i, attributes[i]);
	for (var i in style)
		element.style[i] = style[i];

	return parent.appendChild(element);
}

function openDataDialog() {
	var openedWindow = webMI.display.openWindow({
		extern:false,
		modal:false,
		width: 800,
		height: 600
	});
	var doc = openedWindow.getContentDocument();
	var data = base.content;
	doc.open();
	doc.write(data.replace(/\n/g, "<br/>"));
	doc.close();
	openedWindow.iframe.focus();

	webMI.addEvent(doc, "keydown", function(e) {
		if (e.keyCode == 27)
			openedWindow.close();
	});
}

function triggerSaveAsDialog() {
	var location = window.location;
	var origin = location.protocol + "//" + location.host + "/";
	var form = createElement("form", {
		"action": origin + base.action,
		"enctype": base.enctype,
		"method": base.method,
		"target": emptyFrameName
	}, {
		"display": "none"
	}, doc.body);

	for (var i in base) {
		createElement("input", {
			"type": "hidden",
			"name": i,
			"value": base[i]
		}, {}, form);
	}

	form.submit();
	doc.body.removeChild(form);
}

var indexHtmWindow = window;
try {
	while (top != indexHtmWindow && indexHtmWindow.parent.webMI)
		indexHtmWindow = indexHtmWindow.parent;
} catch (ex) { }

var doc = indexHtmWindow.document;
if(typeof base.useBOM == 'string')
	base.useBOM = base.useBOM == "true";
if(base.useBOM == true)
	base.content = "\ufeff" + base.content;
var emptyFrameName = "emptyframe";
var iframe = doc.getElementById(emptyFrameName);
if (iframe != null)
	return triggerSaveAsDialog();
if (indexHtmWindow["NO-EXPORT-SCRIPT"])
	return openDataDialog();

webMI.data.call("BrowseNodes", {
	startAddress: "SYSTEM.LIBRARY.ATVISE.RESOURCES",
	vTypes: ["VariableTypes.ATVISE.ScriptCode"]
}, function(e) {
	var exportScriptExists = !("error" in e) && base.action in e;
	if (exportScriptExists) {
		iframe = createElement("iframe", {
			"name": emptyFrameName,
			"id": emptyFrameName
		}, {
			"display": "none"
		}, doc.body);

		triggerSaveAsDialog();
	} else {
		indexHtmWindow["NO-EXPORT-SCRIPT"] = true;
		openDataDialog();
	}
});

},{"name":"filename.txt","type":"text/plain","action":"export","method":"post","enctype":"application/x-www-form-urlencoded","useBOM":"false"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Tooltip":[function(base,webMI,window,document,self){
var styleDefaults = { fontFamily: "Arial", fontSize: 12, fontFill: "#000000", width: "auto", fill: "#FFFFFF", stroke: "#000000", strokeWidth: 2, hoverFill: "#EFEFEF", closeTime: 0 };

var tempObj = { tooltip: "tooltip", text: base.text, style: styleDefaults, mouseout: false };
var x = 0;
var y = 0;
/*
webMI.addEvent(base.id, "mousemove", function(e) {
	x = e.clientX;
	y = e.clientY;
});
*/
webMI.addEvent(base.id, "mouseover", function(e) {
	var element = e.toElement || e.target;

	var eventX = e.clientX;
	var eventY = e.clientY;

	if(e.atviseCustomEvent){
	  eventX = e.atviseOriginalEvent.clientX;
	  eventY = e.atviseOriginalEvent.clientY;
	}

	var p = webMI.gfx.createPoint(eventX, eventY);

	if (element && element.ownerDocument != document) {
	  // is a foreignObject, because it is not in the iframes document
	  p = p.matrixTransform(webMI.gfx.getScreenCTM(base.id).inverse())
	}else{
	  //is an svg element, because it is in the iframes document
	  p = p.matrixTransform(webMI.gfx.getScreenCTM().inverse())
	}
	//transform to #maincontainer
	p = p.matrixTransform(webMI.gfx.getScreenCTM(true));


	tempObj.mouseout=false;
	webMI.display.showPopup(p.x, p.y + 20, tempObj);
});



webMI.addEvent(base.id, "mouseout", function(e) {
	tempObj.mouseout=true;
	webMI.display.showPopup(x, y, tempObj);
});

webMI.addOnunload(function() {
	webMI.display.showPopup(x, y, null);
	base = null;
	tempObj = null;
	document = null;
	webMI = null;
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Set Node":[function(base,webMI,window,document,self){
// This Quick Dynamic sets the value of the defined node to the value defined by the parameter "value" depending on one of the events defined by "onEvent".
// Parameters:
//	nodeId:		node which value will be set
//	value:		the above specified node will be set to this value
//	onEvent:	the event triggering this Quick Dynamic, which is one of the following:
//		click:		mouse click
//		dblclick:	double click of mouse button
//		mousedown:	press down the mouse button
//		mouseup:	release the mouse button
//		muuseover:	move the mouse cursor over the applied graphical element
//		mousemove:	move the mouse anywhere over the applied graphical element
//		mouseout:	move the mouse cursor out of the applied graphical element

webMI.addEvent(base.id, base.onEvent, function(e) {
	webMI.data.write(base.nodeId, base.value);
});
},{"nodeId":"","value":"","onEvent":"click"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Set Text":[function(base,webMI,window,document,self){
// This Quick Dynamic sets the text of the applied text element according to the value of the defined node with the defined decimal places (max. 9).
// Parameters:
//	nodeId:			node from which the value will be taken (variable should be of type "number" or "boolean" or "strings". strings shall only contain numbers)
//	decimalPlaces:	number of decimal places which shall be used to display numbers (not more than 9)
if (base.decimalPlaces > 9) { // more than 9 decimalplaces do not work with "sprintf"
	base.decimalPlaces = 9;
}
var format = "%." + base.decimalPlaces + "f";
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;

	if (typeof value == "boolean" || typeof value == "string") {
		webMI.gfx.setText(base.id, value);
	} else {
		webMI.gfx.setText(base.id, webMI.sprintf(format, value));
	}
	//CR: Was machen wir mit nodes vom Type "DateTime"?
}

},{"nodeId":"","decimalPlaces":"0"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout":[function(base,webMI,window,document,self){
//Detailed information about the usage of this Quick Dynamic can be found in the help

function setTimer(obj) {
	return setTimeout(function() {
		if(obj.popups != undefined) {
			obj.clonedPopups = obj.popups.slice(0);
			for (var i = 0; i < obj.clonedPopups.length; i++){
				obj.clonedPopups[i].close();
			}
			obj.clonedPopups = [];
		}
		webMI.data.logout();
		webMI.display.openDisplay(obj.logoutDisplay, webMI.query, obj.targetFrame);
		obj.activated = false;
	}, obj.autoLogoutTime);
}

if(base.action == "configure") {
	this.autoLogoutTime = parseFloat(base.autoLogoutTime)*1000;
	this.targetFrame = base.targetFrame;
	this.logoutDisplay = base.logoutDisplay;
	this.activated = base.activated === "true";
}

if(base.action == "start" && this.activated == false) {
		this.timerId = setTimer(this);
		this.activated = true;
}

if(base.action == "restartTimer" && this.activated == true) {
	clearTimeout(this.timerId);
	this.timerId = setTimer(this);
}

if(base.action == "manualLogout" && this.activated == true) {
	clearTimeout(this.timerId);
	this.activated = false;
}

if(base.action == "pushPopup") {
	if(this.popups == undefined)
		this.popups = [];
	this.popups.push(base.popup);
}

if(base.action == "removePopup") {
	for (var i = 0; i < this.popups.length; i++){
		if (this.popups[i] == base.popup) this.popups.splice(i,1);
	}
}
},{"action":"configure","activated":"false","autoLogoutTime":"600","targetFrame":"content","logoutDisplay":"AGENT.DISPLAYS.Main"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Navigation":[function(base,webMI,window,document,self){
// Quickdynamic for navigation
// This Quick Dynamic generates a navigation based on the existing display structure.
// To use this quick dynamics, draw a rectangle and apply the dynamics to the rectangle.
// Custom menus also can be passed as a JSON string.
// For more information please refer to the help assigned to this quick dynamic.

var id = base.id;
var client = webMI.getClientInfo();

/* Parse parameter and/or set defaults */
var action = {};
action.point = {};

/* Internal Data */
var internal = {};
internal.button = {};
internal.button.active;
internal.container = {};
internal.container.id = base.id + "_container";
internal.container.z = parseInt(base.containerZIndex, 10);
internal.content = {};
internal.content.frame = base.content;
internal.index = {};
internal.index.display = {};
internal.index.item = {};
internal.menu = {};
internal.menu.homes = {};
internal.menu.index = {};
internal.menu.index.panel = 0;
internal.menu.index.item = 0;
internal.menu.item = {};
internal.menu.panel = {};
internal.menu.panel.active = 0;
internal.visible = (base.visible === "true");

/* Configuration */
var config = {};
config.animate = {};
config.animate.factor = typeof base.animateFactor === "undefined" ? 1 : parseInt(base.animateFactor, 10);
config.animate.type = base.animateTpye;
config.arrow = {};
config.arrow.active = base.arrowActive === "true";
config.arrow.align = base.arrowAlign;
config.arrow.background = base.arrowBackground;
config.arrow.color = base.arrowColor;
config.arrow.icon = {};
config.arrow.icon.height = parseInt(base.arrowIconHeight, 10);
config.arrow.icon.width = parseInt(base.arrowIconWidth, 10);
config.arrow.text = {};
config.arrow.text.down = base.arrowTextDown;
config.arrow.text.up = base.arrowTextUp;
config.arrow.text.left = base.arrowTextLeft;
config.arrow.text.right = base.arrowTextRight;
config.font = {};
config.font.size = parseInt(base.fontSize, 10);
config.font.type = base.fontType;
config.font.color = {};
config.font.color.active = base.fontColorActive;
config.font.color.inactive = base.fontColorInactive;
config.home = {};
config.home.align = {};
config.home.align.horizontal = base.homeAlignHorizontal;
config.home.align.vertical = base.homeAlignVertical;
config.home.background = base.homeBackground;
config.home.color = base.homeColor;
config.home.text = base.homeText;
config.icon = {};
config.icon.arrows = {};
config.icon.arrows.active = base.iconArrowsActive === "true";
config.icon.arrows.down = base.iconArrowDown;
config.icon.arrows.left = base.iconArrowLeft;
config.icon.arrows.right = base.iconArrowRight;
config.icon.arrows.up = base.iconArrowUp;
config.icon.folder = {}
config.icon.folder.active = base.iconFolderActive === "true";
config.icon.folder.open = base.iconFolderOpen;
config.icon.folder.close = base.iconFolderClose;
config.icon.home = {};
config.icon.home.active = base.iconHomeActive === "true";
config.icon.home.icon = base.iconHomeIcon;
config.item = {};
config.item.align = {};
config.item.align.horizontal = base.itemAlignHorizontal;
config.item.align.vertical = base.itemAlignVertical;
config.item.count = parseInt(base.itemCount, 10);
config.item.background = {};
config.item.background.active = base.itemBackgroundActive;
config.item.background.hover = base.itemBackgroundHover;
config.item.background.inactive = base.itemBackgroundInactive;
config.item.border = {};
config.item.border.color = base.itemBorderColor;
config.item.border.radius = base.itemBorderRadius;
config.item.border.width = parseInt(base.itemBorderWidth, 10);
config.item.border.style = base.itemBorderStyle;
config.item.padding = parseInt(base.itemPadding, 10);
config.menu = {};
config.menu.align = {};
config.menu.align.panel = base.panelAlign;
config.menu.custom = base.customMenu;
config.menu.index = {};
config.menu.panels = {};
config.menu.structure = null;

/* Setting for Scrolling */
var scroll = {};
scroll.factor = {};
scroll.factor.general = parseInt(base.scrollFactorGeneral, 10);
scroll.factor.mobile = parseInt(base.scrollFactorMobile, 10);
scroll.factor.panel = parseInt(base.scrollFactorPanel, 10);

/* Setting for the pannel */
var panel = {};
panel.apply = {};
panel.apply.Settings = (base.panelApplySettings === "true");
panel.background = {};
panel.background.color = base.panelBackgroundColor;
panel.border = {};
panel.border.color = base.panelBorderColor;
panel.border.width = parseInt(base.panelBorderWidth, 10);
panel.border.style = base.panelBorderStyle;
/* Get container setup */
var svg = window.document.getElementById(base.id);
var css = applyStyling(svg);

/* Setup layout for menu */
var layout = {};
layout.side = {};
layout.side.width = {};
layout.side.width.active = Math.floor(css.width * parseInt(base.itemWidthActive, 10) / 100);
layout.side.width.inactive = Math.floor(css.width * parseInt(base.itemWidthInactive, 10) / 100);
layout.side.height = {};
layout.side.height.active = parseInt(base.itemHeightSteady, 10);
layout.side.height.inactive = parseInt(base.itemHeightSteady, 10);
layout.center = {};
layout.center.width = {};
layout.center.width.active = parseInt(base.itemWidthSteady, 10);
layout.center.width.inactive = parseInt(base.itemWidthSteady, 10);
layout.center.height = {};
layout.center.height.active = Math.floor(css.height * parseInt(base.itemHeightActive, 10) / 100);
layout.center.height.inactive = Math.floor(css.height * parseInt(base.itemHeightInactive, 10) / 100);

/* Force alignment of panel for button and other components */
layout.arrow = zCopy(isCenter() ? layout.center : layout.side);
layout.home = zCopy(isCenter() ? layout.center : layout.side);
layout.menu = zCopy(isCenter() ? layout.center : layout.side);
layout.item = zCopy(isCenter() ? layout.center : layout.side);


/* Corrections for home buttons */
if (isCenter()) {
	layout.home.width.active = parseInt(base.homeWidth, 10);
	layout.home.width.inactive = parseInt(base.homeWidth, 10);
} else {
	layout.home.height.active = parseInt(base.homeHeight, 10);
	layout.home.height.inactive = parseInt(base.homeHeight, 10);
}

/* Corrections for arrows */
if (isCenter()) {
	layout.arrow.width.active = parseInt(base.arrowWidth, 10);
	layout.arrow.width.inactive = parseInt(base.arrowWidth, 10);
} else {
	layout.arrow.height.active = parseInt(base.arrowHeight, 10);
	layout.arrow.height.inactive = parseInt(base.arrowHeight, 10);
}

/* Corrections for menu container */
if (isCenter()) {
	layout.menu.height = css.height;
	layout.menu.width = css.width;
	layout.menu.width -= layout.home.width.active;
	layout.menu.width -= config.arrow.active ? layout.arrow.width.active * 2 : 0;
	layout.menu.width += config.arrow.active ? config.item.padding : 0;
} else {
	layout.menu.height = css.height;
	layout.menu.height -= layout.home.height.active;
	layout.menu.height -= config.arrow.active ? layout.arrow.height.active * 2 : 0;
	layout.menu.height += config.arrow.active ? config.item.padding : 0;
	layout.menu.width = css.width;
}

/* Correction for items */
if (config.item.count) {
	var optimum = {};
	optimum.height = layout.menu.height / config.item.count;
	optimum.width = layout.menu.width / config.item.count;

	if (isCenter()) {
		layout.item.width.active = optimum.width;
		layout.item.width.inactive = optimum.width;
	} else {
		layout.item.height.active = optimum.height;
		layout.item.height.inactive = optimum.height;
	}
}


/* Optional fill container based on items */
layout.fill = zCopy(layout.item);


/* Get container setup and init */
var hasRight = applySecurity();
var atviseMenu = createAtviseTable(svg, css);
initAtviseMenu(atviseMenu, internal.visible);


// ---------------------------------------------------------------------------------------------------------------
// FUNCTION SECTION
// ---------------------------------------------------------------------------------------------------------------

/**
 * Handle Security
 */
function applySecurity() {
	hasRight = false;

	/* Get some security infos */
	var right = (base["securityRight"] == undefined) ? "" : base["securityRight"];
	if (right.search(/SYSTEM\.SECURITY\.RIGHTS\./) != -1) {
		right = right.substring(23, right.length); //remove "prefix" SYSTEM.SECURITY.RIGHTS.
	}

	if (right != "") {
		webMI.addEvent(webMI.data, "clientvariableschange", function (e) {
			hasRight = false;
			if (("username" in e) && (e.username != "")) {
				hasRight = webMI.hasRight(right);
			}

			setTimeout(function () {
				var element = webMI.rootWindow.document.getElementById(internal.container.id + "_navigation");
				if (hasRight)
					element.style.filter = "brightness(1.0)";
				else
					element.style.filter = "brightness(0.75)";
			}, 250);
		});
	} else {
		hasRight = true;
	}

	return hasRight;
}

/**
 * Get parameter from svg an parse it into css
 * Afterwards reset svg
 * @param svg
 */
function applyStyling(svg) {
	var css = {};

	if (!panel.apply.Settings) {
		css.borderColor = panel.border.color;
		css.borderWidth = panel.border.width;
		css.borderStyle = panel.border.style;
		css.backgroundColor = panel.background.color;
	} else {
		css.borderColor = svg.getAttribute("stroke-opacity") === "0" ? "" : svg.getAttribute("stroke");
		css.borderWidth = parseInt(svg.getAttribute("stroke-width"));
		css.borderStyle = "solid";
		css.backgroundColor = svg.getAttribute("fill-opacity") === "0" ? "" : svg.getAttribute("fill");
	}

	css.top = parseInt(svg.getAttribute("y"), 10);
	css.left = parseInt(svg.getAttribute("x"), 10);
	css.width = parseInt(svg.getAttribute("width"), 10) - css.borderWidth * 2;
	css.height = parseInt(svg.getAttribute("height"), 10) - css.borderWidth * 2;

	/* reset svg - set opacity to transparent */
	svg.setAttribute("stroke-opacity", "0");
	svg.setAttribute("fill-opacity", "0");
	return (css);
}


/**
 * Create box for navigation arrows
 * @param top
 * @returns {HTMLDivElement}
 */
function createAtviseArrow(top) {
	var html;

	var icon = {};
	icon.down = config.arrow.text.down;
	icon.left = config.arrow.text.left;
	icon.right = config.arrow.text.right;
	icon.up = config.arrow.text.up;

	if (config.icon.arrows.active) {
		icon.down = config.icon.arrows.down;
		icon.left = config.icon.arrows.left;
		icon.right = config.icon.arrows.right;
		icon.up = config.icon.arrows.up;
	}

	if (top)
		html = isCenter() ? icon.left : icon.up;
	else
		html = isCenter() ? icon.right : icon.down;

	var height = layout.arrow.height.inactive;
	var width = layout.arrow.width.inactive;

	if (isCenter()) {
		height -= config.item.border.width * 2;
		width -= config.item.border.width * 2;
		width -= config.item.padding;
	} else {
		height -= config.item.border.width * 2;
		height -= config.item.padding;
		width -= config.item.border.width * 2;
	}

	/* create top navigation container */
	var divArrow = createAtviseElement({
		background: config.arrow.background,
		borderColor: config.item.border.color,
		borderCollapse: "separate",
		borderRadius: config.item.border.radius + "px",
		borderStyle: config.item.border.style,
		borderWidth: config.item.border.width + "px",
		MozBorderRadius: config.item.border.radius + "px",
		color: config.arrow.color,
		display: "table",
		overflow: "hidden",
		textAlign: config.arrow.align,
		verticalAlign: "middle",
		height: height + "px",
		width: width + "px",
	});

	divArrow.setAttribute("id", internal.container.id + "_arrow_" + (top ? "top" : "bottom"));

	divArrow.onmouseover = function (e) {
		var currentColor = zConvertRGB(divArrow.style.backgroundColor);
		if (currentColor != config.item.background.active)
			divArrow.style.background = config.item.background.hover;
	};

	divArrow.onmouseout = function (e) {
		var currentColor = zConvertRGB(divArrow.style.backgroundColor);
		if (currentColor != config.item.background.active)
			divArrow.style.background = config.arrow.background;
	};

	if (top) {
		divArrow.addEventListener("click", zActionClickTop, false);
	} else {
		divArrow.addEventListener("click", zActionClickBottom, false);
	}

	/* add contents */
	var isPng = html.split('.').pop() === "png";
	var height = config.arrow.icon.height + "px";
	var width = config.arrow.icon.width + "px";
	var img = '<img height="' + height + '" width="' + width + '" src="' + html + '" />';


	html = isPng ? img : html;
	divArrow.appendChild(createAtviseSpan(html));

	return divArrow;
}


/**
 * Creating an atvise element and add css properties)
 * @param style
 * @param align
 * @returns {HTMLDivElement}
 */
function createAtviseElement(style) {
	var element = webMI.rootWindow.document.createElement("div");
	for (var key in style) {
		element.style[key] = style[key];
	}
	return element;
}


/**
 * Create box for home button
 * @returns {HTMLDivElement}
 */
function createAtviseHome(id, content, parent) {
	var text = content.text;
	var icon = content.icon;
	var html = (icon ? icon + " " : "") + text;

	var height = layout.home.height.inactive;
	var width = layout.home.width.inactive;

	if (isCenter()) {
		height -= config.item.border.width * 2;
		width -= config.item.border.width * 2;
		width -= config.item.padding;
	} else {
		height -= config.item.border.width * 2;
		height -= config.item.padding;
		width -= config.item.border.width * 2;
	}

	/* create top navigation container */
	var divHome = createAtviseElement({
		background: config.home.background,
		borderColor: config.item.border.color,
		borderCollapse: "separate",
		borderRadius: config.item.border.radius + "px",
		borderStyle: config.item.border.style,
		borderWidth: config.item.border.width + "px",
		MozBorderRadius: config.item.border.radius + "px",
		color: config.home.color,
		display: "table",
		overflow: "hidden",
		textAlign: config.home.align.horizontal,
		verticalAlign: config.home.align.vertical,
		height: height + "px",
		width: width + "px",
	});

	divHome.setAttribute("id", internal.container.id + "_home");

	divHome.onmouseover = function (e) {
		var currentColor = zConvertRGB(divHome.style.backgroundColor);
		if (currentColor != config.item.background.active)
			divHome.style.background = config.item.background.hover;
	};

	divHome.onmouseout = function (e) {
		var currentColor = zConvertRGB(divHome.style.backgroundColor);
		if (currentColor != config.item.background.active)
			divHome.style.background = config.item.background.inactive;
	};

	/* add event listener */
	if (typeof parent !== "undefined") {
		divHome.addEventListener("click", function (e) {
			togglePanel(parent);
		}, false);
	}

	divHome.appendChild(createAtviseSpan(html));
	divHome.title = text;

	return divHome;
}


/**
 * Create an atvise menu item (e.g. button)
 * @param id
 * @param text
 * @param handler
 * @param margin
 * @returns {HTMLDivElement}
 */
function createAtviseItem(id, content, handler, margin) {
	var text = content.text;
	var icon = content.icon;
	var left = content.left === true;

	var html = (left ? (icon ? icon + " " : "") : "") + text + (!left ? (icon ? " " + icon : "") : "");

	var height = layout.item.height.inactive;
	var width = layout.item.width.inactive;

	if (isCenter()) {
		height -= config.item.border.width * 2;
		width -= config.item.border.width * 2;
		width -= config.item.padding;
	} else {
		height -= config.item.border.width * 2;
		height -= config.item.padding;
		width -= config.item.border.width * 2;
	}

	var borderSpacing = webMI.getClientInfo().browserType.isChrome ? "0px" : "0px";

	/* create top navigation container */
	var divItem = createAtviseElement({
		background: config.item.background.inactive,
		borderColor: config.item.border.color,
		borderCollapse: "separate",
		borderSpacing: borderSpacing,
		borderRadius: config.item.border.radius + "px",
		borderStyle: config.item.border.style,
		borderWidth: config.item.border.width + "px",
		MozBorderRadius: config.item.border.radius + "px",
		color: config.item.color,
		display: "table",
		textAlign: config.item.align.horizontal,
		height: height + "px",
		width: width + "px",
	});

	if (isCenter()) {
		divItem.style.marginRight = config.item.padding + "px";
		if (isBottom()) {
			divItem.style.marginTop = css.height - layout.item.height.inactive + "px";
		} else {
			divItem.style.marginBottom = config.item.padding + "px";
		}
	} else {
		divItem.style.marginBottom = config.item.padding + "px";
	}

	divItem.setAttribute("id", internal.container.id + "_item_" + id);

	if (typeof handler.menu !== "undefined") {
		var divItemLeft = createAtviseElement({
			display: "table-cell",
			textOverflow: "ellipsis",
			overflow: "hidden",
			verticalAlign: "middle",
			width: "75%",
		});

		divItemLeft.setAttribute("id", internal.container.id + "_item_" + id + "_button");
		divItemLeft.innerHTML = text;

		var divItemLine = createAtviseElement({
			display: "table-cell",
			backgroundColor: typeof handler.withDisplay !== "undefined" ? config.item.background.hover : config.item.background.inactive,
			verticalAlign: "middle",
			width: config.item.padding / 2 + "px",
			minWidth: config.item.padding / 2 + "px",
		});

		var divItemRight = createAtviseElement({
			display: "table-cell",
			textOverflow: "ellipsis",
			overflow: "hidden",
			verticalAlign: "middle",
			width: "25%",
		});

		divItemRight.innerHTML = icon;
	}

	/* HOVER */
	function setHover(elements, color) {
		for (var key in elements) {
			elements[key].style.background = color;
			elements[key].style.borderColor = color;
		}
	}

	if (typeof handler.withDisplay !== "undefined") {
		divItemLeft.onmouseover = function (e) {
			var currentColor = zConvertRGB(divItemLeft.style.backgroundColor);
			if (currentColor != config.item.background.active)
				divItemLeft.style.background = config.item.background.hover;
		};
		divItemLeft.onmouseout = function (e) {
			var currentColor = zConvertRGB(divItemLeft.style.backgroundColor);
			if (currentColor != config.item.background.active)
				divItemLeft.style.background = config.item.background.inactive;
		};
		divItemRight.onmouseover = function (e) {
			var currentColor = zConvertRGB(divItemRight.style.backgroundColor);
			if (currentColor != config.item.background.active)
				divItemRight.style.background = config.item.background.hover;
		};
		divItemRight.onmouseout = function (e) {
			var currentColor = zConvertRGB(divItemRight.style.backgroundColor);
			if (currentColor != config.item.background.active)
				divItemRight.style.background = config.item.background.inactive;
		};
	} else if (typeof handler.menu !== "undefined") {
		divItemLeft.onmouseover = function (e) {
			setHover([divItemLeft, divItemLine, divItemRight], config.item.background.hover);
		};
		divItemLeft.onmouseout = function (e) {
			setHover([divItemLeft, divItemLine, divItemRight], config.item.background.inactive);
		};
		divItemLine.onmouseover = function (e) {
			setHover([divItemLeft, divItemLine, divItemRight], config.item.background.hover);
		};
		divItemLine.onmouseout = function (e) {
			setHover([divItemLeft, divItemLine, divItemRight], config.item.background.inactive);
		};
		divItemRight.onmouseover = function (e) {
			setHover([divItemLeft, divItemLine, divItemRight], config.item.background.hover);
		};
		divItemRight.onmouseout = function (e) {
			setHover([divItemLeft, divItemLine, divItemRight], config.item.background.inactive);
		};
	} else {
	divItem.onmouseover = function (e) {
		var currentColor = zConvertRGB(divItem.style.backgroundColor);
		if (currentColor != config.item.background.active)
			divItem.style.background = config.item.background.hover;
	};
	divItem.onmouseout = function (e) {
		var currentColor = zConvertRGB(divItem.style.backgroundColor);
		if (currentColor != config.item.background.active)
			divItem.style.background = config.item.background.inactive;
	};
	}


	if (typeof handler !== "undefined") {
		if (typeof handler.withDisplay !== "undefined") {
			divItemLeft.onclick = function (e) {
				if (!hasRight) {
					return;
				}
				setButtonInactive();
				setButtonActive(e.target.parentElement.id + "_button");
				webMI.display.openDisplay(handler.withDisplay, getQuery(), internal.content.frame);
			};
			divItemRight.onclick = function (e) {
				setButtonInactive();
				setHover([divItemLeft, divItemRight], config.item.background.inactive);
				divItem.style.background = config.item.background.inactive;
				togglePanel(handler.menu);
				setButtonActive();
			};
		} else if (typeof handler.menu !== "undefined") {
			divItem.onclick = function (e) {
				setButtonInactive();
				setHover([divItemLeft, divItemLine, divItemRight], config.item.background.inactive);
				divItem.style.background = config.item.background.inactive;
				togglePanel(handler.menu);
				setButtonActive();
			};
		} else if (typeof handler.display !== "undefined") {
			divItem.onclick = function (e) {
				if (!hasRight) {
					return;
				}
				setButtonInactive();
				setHover([divItem], config.item.background.inactive);
				setButtonActive(e.target.parentElement.id);
				webMI.display.openDisplay(handler.display, getQuery(), internal.content.frame);
			};
		}
	}

	if (typeof handler.menu !== "undefined") {
		if (!left) {
			divItem.appendChild(divItemLeft);
			divItem.appendChild(divItemLine);
		}
		divItem.appendChild(divItemRight);
		if (left) {
			divItem.appendChild(divItemLine);
			divItem.appendChild(divItemLeft);
		}
	} else {
		divItem.appendChild(createAtviseSpan(html));
	}
	divItem.title = text;

	return divItem;
}


/**
 * Creating a clean Query for new displays
 * @returns {query}
 */
function getQuery() {
    var query = webMI.query;
    var submit = {};
	var removeKey = [];

    var filters = [];
    if(base.removeKeyFromQuery)
        filters = (base.removeKeyFromQuery).split(",");

    for(var f in filters){
		var filter = filters[f];

		if(filter.indexOf("*")){
			filter = filter.split("*")[0];
		    for(var key in query){
			    if(key.indexOf(filter) == 0){
				    removeKey.push(key);
			    }
		    }
		} else {
			removeKey.push(filter);
		}
    }

    /* remove all keys with nav prefix */
    for(var key in query){
		if(removeKey.indexOf(key) > -1){
			// console.error("remove " + key);
		} else {
			submit[key] = query[key];
		}
    }
    return submit;
}


/**
 * Creating the container for the menu
 * @returns {HTMLDivElement}
 */
function createAtviseMenu() {
	var setDisplay;
	var isIE11 = !!window.MSInputMethodContext && !!webMI.rootWindow.document.documentMode;

	if (isIE11) {
		setDisplay = isCenter() ? "flex" : "block";
	} else {
		setDisplay = isCenter() ? "-webkit-box" : "block";
	}

	return createAtviseElement({
		display: setDisplay,
		overflow: "hidden",
		verticalAlign: "top",
	});
}


/**
 * Returns a placeholder element
 * @param dimension
 * @returns {*}
 */
function createAtvisePlaceholder(dimension, margin) {
	if (dimension.height < 0 || dimension.width < 0)
		return false;

	var height = dimension.height;
	var width = dimension.width;

	if (isCenter()) {
		height -= config.item.border.width * 2;
		width -= config.item.border.width * 2;
		width -= margin ? config.item.padding : '0';
	} else {
		height -= config.item.border.width * 2;
		height -= margin ? config.item.padding : '0';
		width -= config.item.border.width * 2;
	}

	var divSpace = createAtviseElement({
		background: config.item.background.inactive,
		borderColor: config.item.border.color,
		borderCollapse: "separate",
		borderRadius: config.item.border.radius + "px",
		borderStyle: config.item.border.style,
		borderWidth: config.item.border.width + "px",
		MozBorderRadius: config.item.border.radius + "px",
		color: config.item.color,
		display: "table",
		textAlign: config.item.align.horizontal,

		height: height + "px",
		width: width + "px",
	});

	if (isCenter()) {
		divSpace.style.marginRight = config.item.padding + "px";
		if (isBottom()) {
			divSpace.style.marginTop = css.height - layout.item.height.inactive + "px";
		} else {
			divSpace.style.marginBottom = config.item.padding + "px";
		}
	} else {
		divSpace.style.marginBottom = config.item.padding + "px";
	}

	return divSpace;

}


/**
 * Returns a container for html content
 * @param html
 * @returns {HTMLDivElement}
 */
function createAtviseSpan(html) {
	var out = createAtviseElement({
		display: "table-cell",
		margin: "5px",
		padding: "5px",
		maxWidth: "1px",
		textOverflow: "ellipsis",
		overflow: "hidden",
		verticalAlign: config.item.align.vertical,
	});
	out.innerHTML = html;
	return out;
}


/**
 * Create a box for the navigation
 * @param svg
 * @param container
 * @param css
 * @returns {HTMLDivElement}
 */
function createAtviseTable(svg, css) {

	/* create the panel */
	var atviseMenuPanel = createAtviseElement({
		backgroundColor: css.backgroundColor,
		color: config.font.color.inactive,
		fontFamily: config.font.type,
		fontSize: config.font.size + "px"
	});
	atviseMenuPanel.setAttribute("id", internal.container.id + "_box");

	/* create a table */
	var atviseMenuTable = webMI.rootWindow.document.createElement('table');
	atviseMenuTable.style.height = css.height + "px";
	atviseMenuTable.style.width = css.width + "px";
	atviseMenuTable.style.borderCollapse = "collapse";
	atviseMenuTable.setAttribute('border', '0');

	/* create some rows */
	var atviseMenuHome = webMI.rootWindow.document.createElement('tr');
	var atviseMenuTop = webMI.rootWindow.document.createElement('tr');
	var atviseMenuNav = webMI.rootWindow.document.createElement('tr');
	var atviseMenuBottom = webMI.rootWindow.document.createElement('tr');
	var atviseMenuLine = webMI.rootWindow.document.createElement('tr');

	/* fix for bottom/right padding */
	var fix = {};
	if (isCenter()) {
		fix.height = 0;
		fix.width = config.item.padding;
	} else {
		fix.height = config.item.padding;
		fix.width = 0;
	}

	/* create some columns */
	var cellHome = createAtviseTableCell(layout.home.height.inactive, layout.home.width.inactive);
	var cellTop = createAtviseTableCell(layout.arrow.height.inactive, layout.arrow.width.inactive);
	var cellNavigation = createAtviseTableCell(layout.menu.height, layout.menu.width);
	var cellBottom = createAtviseTableCell(layout.arrow.height.inactive - fix.height, layout.arrow.width.inactive - fix.width);

	/* create some cells */
	var divNavigation = createAtviseMenu();
	divNavigation.setAttribute("id", internal.container.id + "_menu");

	/* fit all together */
	var content = {text: config.home.text, icon: false};
	cellHome.appendChild(createAtviseHome(0, content));
	cellTop.appendChild(createAtviseArrow(true));
	cellNavigation.appendChild(divNavigation);
	cellBottom.appendChild(createAtviseArrow(false));

	if (isCenter()) {
		atviseMenuLine.appendChild(cellHome);
		if (config.arrow.active)
			atviseMenuLine.appendChild(cellTop);
		atviseMenuLine.appendChild(cellNavigation);
		if (config.arrow.active)
			atviseMenuLine.appendChild(cellBottom);

		atviseMenuTable.appendChild(atviseMenuLine);
	} else {
		atviseMenuHome.appendChild(cellHome);
		atviseMenuTop.appendChild(cellTop);
		atviseMenuNav.appendChild(cellNavigation);
		atviseMenuBottom.appendChild(cellBottom);

		atviseMenuTable.appendChild(atviseMenuHome);
		if (config.arrow.active)
			atviseMenuTable.appendChild(atviseMenuTop);
		atviseMenuTable.appendChild(atviseMenuNav);
		if (config.arrow.active)
			atviseMenuTable.appendChild(atviseMenuBottom);
	}

	atviseMenuPanel.appendChild(atviseMenuTable);

	/* use webMI methods to add the box */
	foreignObject = webMI.gfx.addForeignObject({
		x: 0,
		y: 0,
		width: css.width,
		height: css.height,
		id: internal.container.id,
		childNodes: [atviseMenuPanel]
	}, svg);

	return atviseMenuPanel;
}


/**
 * Create a cell
 * @param height
 * @param width
 * @returns {HTMLTableDataCellElement}
 */
function createAtviseTableCell(height, width) {
	var element = webMI.rootWindow.document.createElement('td');
	if (height)
		element.style.height = height + "px";
	if (width)
		element.style.width = width + "px";
	element.style.padding = "0px";
	element.style.margin = "0px";

	if (isCenter()) {
		element.style.textAlign = "left";
		if (isBottom()) {
			element.style.verticalAlign = "bottom";
		} else {
			element.style.verticalAlign = "top";
		}
	} else {
		element.style.verticalAlign = "top";
		if (isRight()) {
			element.style.textAlign = "-webkit-right";
			element.style.textAlign = "-moz-right";
			element.style.textAlign = "-o-right";
			element.style.textAlign = "-ms-right";
		} else {
			element.style.textAlign = "left";
		}
	}

	element.setAttribute("align", "right");

	return element
}


/**
 * Init menu
 * @param container
 * @param internal.container.z
 * @param div
 * @param internal.visible
 */
function initAtviseMenu(div) {
	var element = parseIndexOfElements("div");
	div.parentElement.setAttribute("id", internal.container.id + "_navigation");
	div.parentElement.style.zIndex = element.index < internal.container.z ? internal.container.z : element.index, 10;
	div.parentElement.style.borderColor = css.borderColor;
	div.parentElement.style.borderWidth = css.borderWidth + "px";
	div.parentElement.style.borderStyle = css.borderStyle;
	div.parentElement.style.opacity = "1";
}


/**
 * Shortcut for bottom alignment comparison
 * @returns {boolean}
 */
function isBottom() {
	return config.menu.align.panel === "bottom";
}


/**
 * Shortcut for center comparison
 * @returns {boolean}
 */
function isCenter() {
	return config.menu.align.panel === "bottom" || config.menu.align.panel === "top";
}


/**
 * Shortcut for right alignment comparison
 * @returns {boolean}
 */
function isRight() {
	return config.menu.align.panel === "right";
}


/**
 * Parsing the result of the displays parsing trigger and create menu
 * @param menuIndex
 * @param menuStructure
 * @param lastIndex
 * @param lastName
 */
function parseDisplayMenu(index, menuStructure) {
	var currentIndex = index;

	if (index === 0) {
		var content = {text: config.home.text, icon: config.icon.home.icon};
		internal.menu.homes[0] = createAtviseHome(0, content);
	}

	var subList = []; // sub menu button (folder)
	var odbList = []; // object display button (display)
	for (var key in menuStructure) {
		if (typeof menuStructure[key].sub !== "undefined") {
			if (typeof menuStructure[key].display !== "undefined")
				odbList.push(key);
			else
				subList.push(key);
			var content = {text: menuStructure[key].name, icon: config.icon.folder.close};
			internal.menu.index.panel = internal.menu.index.panel + 1;
			menuStructure[key].id = internal.menu.index.panel;
			internal.menu.homes[internal.menu.index.panel] = createAtviseHome(internal.menu.index.panel, content, currentIndex);
			parseDisplayMenu(internal.menu.index.panel, menuStructure[key].sub);
		} else {
			odbList.push(key);
		}
	}

	var panelIndex = internal.container.id + "_menu";
	internal.menu.panel[currentIndex] = createAtviseMenu();
	internal.menu.panel[currentIndex].setAttribute("id", panelIndex);
	internal.menu.panel[currentIndex].addEventListener("wheel", zActionMouseWheel, false);
	internal.menu.panel[currentIndex].addEventListener("touchstart", zActionTouchStart, false);
	internal.menu.panel[currentIndex].addEventListener("touchmove", zActionTouchMove, false);

	var margin = false;

	var dimension = {};
	if (isCenter()) {
		dimension.height = layout.item.height.inactive;
		dimension.width = layout.menu.width;
	} else {
		dimension.height = layout.menu.height;
		dimension.width = layout.item.width.inactive;
	}

	for (var key in subList) {
		var content = {text: menuStructure[subList[key]].name, icon: config.icon.folder.open};
		var handler = {};
		handler.menu = menuStructure[subList[key]].id;

		/* add display to button */
		if (typeof menuStructure[subList[key]]["display"] != "undefined") {
			handler.withDisplay = menuStructure[subList[key]].display;
		}

		internal.menu.index.item = internal.menu.index.item + 1;
		internal.menu.item[internal.menu.index.item] = createAtviseItem(internal.menu.index.item, content, handler, margin);
		internal.menu.panel[currentIndex].appendChild(internal.menu.item[internal.menu.index.item]);

		/* add item to index */
		if (typeof menuStructure[subList[key]]["display"] != "undefined") {
			internal.index.item[internal.container.id + "_item_" + internal.menu.index.item] = {
				id: internal.container.id + "_item_" + internal.menu.index.item,
				index: internal.menu.index.item,
				display: handler.withDisplay,
				panel: currentIndex,
			};
			internal.index.display[handler.withDisplay] = internal.index.item[internal.container.id + "_item_" + internal.menu.index.item];
		}

		if (!isCenter()) {
			dimension.height -= parseInt(internal.menu.item[internal.menu.index.item].style.height, 10);
			if (margin) dimension.height -= parseInt(internal.menu.item[internal.menu.index.item].style.marginBottom, 10);
			dimension.height -= config.item.border.width * 2;
		} else {
			dimension.width -= parseInt(internal.menu.item[internal.menu.index.item].style.width, 10);
			if (margin) dimension.width -= parseInt(internal.menu.item[internal.menu.index.item].style.marginRight, 10);
			dimension.width -= config.item.border.width * 2;
		}

		margin = true;
	}

	for (var key in odbList) {
		var content = {text: menuStructure[odbList[key]].name, icon: false};
		var handler = {};

		/* add sub menu to button */
		if (typeof menuStructure[odbList[key]]["sub"] != "undefined") {
			content.icon = config.icon.folder.open;
			handler.menu = menuStructure[odbList[key]].id;
			handler.withDisplay = menuStructure[odbList[key]].display;
		}

		handler.display = menuStructure[odbList[key]].display;

		internal.menu.index.item = internal.menu.index.item + 1;
		internal.menu.item[internal.menu.index.item] = createAtviseItem(internal.menu.index.item, content, handler, margin);
		internal.menu.panel[currentIndex].appendChild(internal.menu.item[internal.menu.index.item]);

		/* add item to index */
		internal.index.item[internal.container.id + "_item_" + internal.menu.index.item] = {
			id: internal.container.id + "_item_" + internal.menu.index.item,
			index: internal.menu.index.item,
			display: handler.display,
			panel: currentIndex,
		};
		internal.index.display[handler.display] = internal.index.item[internal.container.id + "_item_" + internal.menu.index.item];

		if (!isCenter()) {
			dimension.height -= parseInt(internal.menu.item[internal.menu.index.item].style.height, 10);
			if (margin) dimension.height -= parseInt(internal.menu.item[internal.menu.index.item].style.marginBottom, 10);
			dimension.height -= config.item.border.width * 2;
		} else {
			dimension.width -= parseInt(internal.menu.item[internal.menu.index.item].style.width, 10);
			if (margin) dimension.width -= parseInt(internal.menu.item[internal.menu.index.item].style.marginRight, 10);
			dimension.width -= config.item.border.width * 2;
		}

		margin = true;
	}

	if (!isCenter()) {
		dimension.height -= config.item.padding;
	} else {
		dimension.width -= config.item.padding;
	}

	var divSpace = createAtvisePlaceholder(dimension, margin);

	if (divSpace) {
		internal.menu.index.item = internal.menu.index.item + 1;
		internal.menu.item[internal.menu.index.item] = divSpace;
		internal.menu.panel[currentIndex].appendChild(internal.menu.item[internal.menu.index.item]);
	}

	if (currentIndex === 0) {
		togglePanel(0);
	}
}


/**
 * get highest z-index
 * @param id
 * @returns {number}
 */
function parseIndexOfElements(tag) {
	var elements = webMI.rootWindow.document.getElementsByTagName(tag);
	var index = internal.container.z;
	var content = "";
	for (var i = 0; i < elements.length; i++) {
		try {
			var zIndex = parseInt(elements[i].style.zIndex, 10);
			if ((zIndex > index) && (zIndex !== 'auto')) {
				index = zIndex;
				content = elements[i];
			}
		} catch (na) {
		}
	}
	return {"content": content, "index": index + 1};
}


/**
 * Set button with given id active
 * @param activate
 */
function setButtonActive(activate) {
	if (!activate && !internal.button.active)
		return;

	var activate = activate ? cropActivate(activate) : internal.button.active;

	internal.button.active = activate;

	function cropActivate(activate) {
		var crop = activate.substring(activate.length - "_button".length, activate.length) === "_button";
		if (crop)
			return activate.substring(0, activate.length - "_button".length);
		return activate;
	}

	index = internal.index.item[internal.button.active];
	if (typeof index === "undefined")
		return;

	var setActive = internal.menu.item[index.index];
	var setButton = setActive.querySelector("#" + activate + "_button");

	if (!setButton) {
		setButton = setActive;
	}

	var setWidth = layout.item.width.active;
	setWidth -= config.item.border.width * 2;
	setWidth -= (isCenter() ? config.item.padding : 0);

	var setHeight = layout.item.height.active;
	setHeight -= config.item.border.width * 2;
	setHeight -= !isCenter() ? config.item.padding : 0;

	setActive.style.width = setWidth + "px";
	setActive.style.height = setHeight + "px";

	setButton.style.backgroundColor = config.item.background.active;
	setButton.style.color = config.font.color.active;

	if (isBottom()) {
		setActive.style.marginTop = css.height - layout.item.height.active + "px";
	}
}


/**
 * Set last active button inactive
 */
function setButtonInactive() {
	if (!internal.button.active)
		return;

	var index = internal.index.item[internal.button.active];
	if (typeof index === "undefined")
		return;

	var setInactive = internal.menu.item[index.index];
	var setButton = setInactive.querySelector("#" + internal.button.active + "_button");

	if (!setButton) {
		setButton = setInactive;
	}

	var setWidth = layout.item.width.inactive;
	setWidth -= config.item.border.width * 2;
	setWidth -= (isCenter() ? config.item.padding : 0);

	var setHeight = layout.item.height.inactive;
	setHeight -= config.item.border.width * 2;
	setHeight -= !isCenter() ? config.item.padding : 0;

	setInactive.style.width = setWidth + "px";
	setInactive.style.height = setHeight + "px";

	setButton.style.backgroundColor = config.item.background.inactive;
	setButton.style.color = config.font.color.inactive;

	if (isBottom()) {
		setInactive.style.marginTop = css.height - layout.item.height.inactive + "px";
	}
}


/**
 * Switch between different panels
 * @param open
 * @param close
 */
function togglePanel(open) {

	if (!(open == 0 || hasRight)) {
		return;
	}

	var changeHome = webMI.rootWindow.document.getElementById(internal.container.id + "_home").parentElement;
	changeHome.removeChild(changeHome.childNodes[0]);
	changeHome.appendChild(internal.menu.homes[open]);

	var changeMenu = webMI.rootWindow.document.getElementById(internal.container.id + "_menu").parentElement;
	changeMenu.removeChild(changeMenu.childNodes[0]);
	internal.menu.panel[open].style.width = changeMenu.offsetWidth + "px";
	internal.menu.panel[open].style.height = changeMenu.offsetHeight + "px";
	changeMenu.appendChild(internal.menu.panel[open]);

	internal.menu.panel.active = open;
}


// ---------------------------------------------------------------------------------------------------------------
// ANIMATION SECTION
// ---------------------------------------------------------------------------------------------------------------


/**
 * Action on click at top navigation
 * @param event
 */
function zActionClickTop(event) {
	zActionClickMove(true);
}


/**
 * Action on click at bottom navigation
 * @param event
 */
function zActionClickBottom(event) {
	zActionClickMove(false);
}


/**
 * Action on click scrolling
 * @param event
 */
function zActionClickMove(direction) {
	var element = webMI.rootWindow.document.getElementById(internal.container.id + "_menu");
	var posX = element.scrollLeft;
	var posY = element.scrollTop;

	if (isCenter()) {
		if (direction) {
			if (element.scrollLeftMax < posX - layout.item.width.inactive)
				posX = element.scrollLeftMax;
			element.scrollLeft = posX - layout.item.width.inactive;
		} else {
			element.scrollLeft = posX + layout.item.width.inactive;
		}
	} else {
		if (direction) {
			element.scrollTop = posY - layout.item.height.inactive;
		} else {
			if (element.scrollTopMax < posY + layout.item.height.inactive)
				posY = element.scrollTopMax;
			element.scrollTop = posY + layout.item.height.inactive;
		}
	}
}


/**
 * Action on mouse wheel move
 * @param event
 */
function zActionMouseWheel(event) {
	if (isCenter()) {
		zAnimationScrollMenu(event["deltaY"], 0);
	} else {
		zAnimationScrollMenu(0, event["deltaY"]);
	}
}


/**
 * Action on touch start gesture
 * @param event
 */
var moveInit = {};

function zActionTouchStart(event) {
	moveInit = {x: 0, y: 0};
	action.point.start = {x: event.touches[0].pageX, y: event.touches[0].pageY}
}


/**
 * Action on touch move gesture
 * @param event
 */
function zActionTouchMove(event) {
	event.preventDefault();
	action.point.end = {
		x: event.touches[0].pageX,
		y: event.touches[0].pageY
	};

	var deltaX = action.point.start.x - action.point.end.x;
	var deltaY = action.point.start.y - action.point.end.y;

	if (moveInit.x === 0) {
		moveInit.x = deltaX > 0 ? 1 : -1
	}

	if (moveInit.y === 0) {
		moveInit.y = deltaY > 0 ? 1 : -1
	}

	var movement = {
		x: deltaX > 0 ? 1 : -1,
		y: deltaY > 0 ? 1 : -1
	}

	if (moveInit.x == movement.x && moveInit.y == movement.y) {
		zAnimationScrollMenu(deltaX, deltaY);
	} else {
		moveInit = {x: "f", y: "f"};
	}
}


/**
 * Starting animation
 */
function zAnimation(init) {
	var element = parseIndexOfElements("*");
	var div = webMI.rootWindow.document.getElementById(internal.container.id + "_navigation");
	div.style.zIndex = element.index < internal.container.z ? internal.container.z : element.index, 10;

	if (init && !internal.visible) {
		if (config.animate.type === "none") {
			atviseMenu.parentElement.style.display = "none";
		} else if (config.animate.type === "fade") {
			atviseMenu.parentElement.style.opacity = 0;
			atviseMenu.parentElement.style.display = "none";
		} else if (config.animate.type === "slide-left") {
			atviseMenu.parentElement.style.width = "0px";
		} else if (config.animate.type === "slide-right") {
			atviseMenu.parentElement.style.width = "0px";
		}
	} else if (!init) {
		internal.visible = !internal.visible;
		if (config.animate.type === "none") {
			zAnimationToggle();
		} else if (config.animate.type === "fade") {
			zAnimationFade();
		} else if (config.animate.type === "slide-left") {
			zAnimationSlide(true);
		} else if (config.animate.type === "slide-right") {
			zAnimationSlide(false);
		}
	}

	togglePanel(internal.menu.panel.active);
}


/**
 * Hide view menu with fading animation
 */
function zAnimationFade() {
	var opacity = parseFloat(atviseMenu.parentElement.style.opacity, 10);

	if (internal.visible && atviseMenu.parentElement.style.display === "none")
		atviseMenu.parentElement.style.display = "inherit";

	if (internal.visible && opacity < 1) {
		atviseMenu.parentElement.style.opacity = opacity + config.animate.factor / 60;
		setTimeout(zAnimationFade, config.animate.factor / 60);
	} else if (!internal.visible && opacity > 0) {
		atviseMenu.parentElement.style.opacity = opacity - config.animate.factor / 60;
		setTimeout(zAnimationFade, config.animate.factor / 60);
	} else if (internal.visible && opacity >= 1) {
		/* correction of calculation inaccuracies */
		atviseMenu.parentElement.style.opacity = 1;
	} else if (!internal.visible && opacity <= 0) {
		/* correction of calculation inaccuracies */
		atviseMenu.parentElement.style.opacity = 0;
		atviseMenu.parentElement.style.display = "none";
	}
}


/**
 * hide view menu with sliding animation
 * @param isLeft
 */
function zAnimationSlide(isLeft) {
	var animationTime = 1000 / 60 / config.animate.factor;
	var configWidth = parseInt(css.width, 10);
	var configLeft = parseInt(css.left, 10);
	var width = parseFloat(atviseMenu.parentElement.style.width);
	var newWidth, newLeft;

	if (internal.visible && width < configWidth) {
		newWidth = width + configWidth / animationTime;
		// atviseMenu.style.width = (newWidth > configWidth ? configWidth : newWidth) - css.borderWidth * 2 + "px";
		atviseMenu.parentElement.style.width = (newWidth > configWidth ? configWidth : newWidth) + "px";
		setTimeout(function () {
			zAnimationSlide(isLeft)
		}, animationTime);
	} else if (!internal.visible && width > 0) {
		newWidth = width - configWidth / animationTime;
		// atviseMenu.style.width = (newWidth < 0 ? 0 : newWidth - css.borderWidth * 2 - config.item.border.width * 2) + "px";
		atviseMenu.parentElement.style.width = (newWidth < 0 ? 0 : newWidth) + "px";
		setTimeout(function () {
			zAnimationSlide(isLeft)
		}, animationTime);
	}

	if (!isLeft && typeof newWidth !== "undefined") {
		newLeft = configLeft + (configWidth - newWidth);
		atviseMenu.parentElement.style.left = newLeft + "px";
	}
}


/**
 * hide view menu without animation
 */
function zAnimationToggle() {
	if (internal.visible) {
		atviseMenu.parentElement.style.display = "inherit";
		// atviseMenu.parentElement.style.opacity = 1;
	} else {
		atviseMenu.parentElement.style.display = "none";
		// atviseMenu.parentElement.style.opacity = 0;
	}
}


/**
 * Moving elements e.g. scroll elements
 * @param deltaX
 * @param deltaY
 */
function zAnimationScrollMenu(deltaX, deltaY) {
	var element = webMI.rootWindow.document.getElementById(internal.container.id + "_menu");

	var posX = element.scrollLeft;
	var posY = element.scrollTop;
	var ajustment = scroll.factor.general;

	var client = webMI.getClientInfo();
	if (client.isMobile || client.isTablet) {
		ajustment = scroll.factor.mobile;
	}

	if (deltaY < 0) {
		element.scrollTop = posY - layout.item.height.inactive * ajustment / 100;
	} else if (deltaY > 0) {
		if (element.scrollTopMax < posY + layout.item.height.inactive)
			posY = element.scrollTopMax;
		element.scrollTop = posY + layout.item.height.inactive * ajustment / 100;
	}

	if (deltaX > 0) {
		element.scrollLeft = posX + layout.item.width.inactive * ajustment / 100;
	} else if (deltaX < 0) {
		if (element.scrollLeftMax < posX - layout.item.width.inactive)
			posX = element.scrollLeftMax;
		element.scrollLeft = posX - layout.item.width.inactive * ajustment / 100;
	}
}


/**
 * Yet another json copy shortcut
 * @param obj
 * @returns {any}
 */
function zCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}


/**
 * Convert rgb color to hex
 * @param rgb
 * @returns {string}
 */
function zConvertRGB(rgb) {
    if(!rgb)
        return false;

	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

	function hexCode(i) {
		return ("0" + parseInt(i).toString(16)).slice(-2);
	}

	return "#" + hexCode(rgb[1]) + hexCode(rgb[2])
		+ hexCode(rgb[3]);
}


/**
 * simple compare function
 * @param a
 * @param b
 * @returns {boolean}
 */
function zIsUndefined(a) {
	return typeof a === "undefined";
}


// ---------------------------------------------------------------------------------------------------------------
// TRIGGER SECTION
// ---------------------------------------------------------------------------------------------------------------

/**
 * Trigger for parsing display menu structure
 * or use custom menu settings
 */
if (zIsUndefined(config.menu.custom) || config.menu.custom === "") {
	webMI.trigger.fire("com.atvise.display_structure", function (e, preload) {
		var displayMenu = e.menu;
		for (var key in displayMenu) {
			if (zIsUndefined(displayMenu[key].sub))
				delete(displayMenu[key]);
		}
		config.menu.structure = e.menu;
		parseDisplayMenu(0, config.menu.structure);

		if (!internal.visible) {
			zAnimation(true);
		}
	});
} else {
	config.menu.structure = JSON.parse(config.menu.custom);
	parseDisplayMenu(0, config.menu.structure);
	if (!internal.visible) {
		zAnimation(true);
	}
}

/**
 * Connection for handling display animation (hide/view)
 */
webMI.trigger.connect("com.atvise.menu_toggle", function (e) {
	if (id !== e.value)
		return;
	zAnimation();
});


/**
 * Connection to monitor events of a particular display container and to update navigation
 */
webMI.trigger.connect("com.atvise.iframe.onloadFrame", function (e) {
	/* do not listen to wrong frames */
	if (e.value.name !== internal.content.frame) {
		return;
	}

	/* decode display */
	var display = decodeURI(e.value.content);

	if (typeof internal.index.display[display] !== "undefined") {
		var openItem = internal.index.display[display].id;
		var openPanel = internal.index.display[display].panel;

		/* reset old active button */
		if (typeof internal.button.active !== "undefined" && openItem !== internal.button.active) {
			setButtonInactive();
		}

		/* jump to new panel */
		if (openPanel !== internal.menu.panel.active) {
			togglePanel(openPanel);
		}

		/* jump to new button */
		if (openItem !== internal.button.active) {
			setButtonActive(openItem);
		}

	} else if (typeof internal.button.active !== "undefined") {
		setButtonInactive();
	}
});
},{"id":"none","content":"content","containerZIndex":"3000","visible":"true","animateFactor":"1","animateTpye":"fade","fontType":"Arial","fontColorActive":"#555555","fontColorInactive":"#555555","fontSize":"16","arrowActive":"true","arrowAlign":"center","arrowBackground":"#f6f6f6","arrowColor":"#555555","arrowWidth":"73","arrowHeight":"73","arrowIconHeight":"10","arrowIconWidth":"10","arrowTextDown":"&#709;","arrowTextLeft":"prev.png","arrowTextRight":"next.png","arrowTextUp":"&#708;","homeAlignHorizontal":"center","homeAlignVertical":"middle","homeBackground":"#e5e5e5","homeColor":"#555555","homeHeight":"73","homeWidth":"150","homeText":"HOME","iconArrowsActive":"true","iconFolderActive":"true","iconHomeActive":"true","iconArrowDown":"<i class=\"fas fa-chevron-down\"></i>","iconArrowLeft":"<i class=\"fas fa-chevron-left\"></i>","iconArrowRight":"<i class=\"fas fa-chevron-right\"></i>","iconArrowUp":"<i class=\"fas fa-chevron-up\"></i>","iconFolderOpen":"<i class=\"fas fa-caret-right\"></i>","iconFolderClose":"<i class=\"fas fa-caret-left\"></i>","iconHomeIcon":"<i class=\"fas fa-home\"></i>","itemAlignHorizontal":"center","itemAlignVertical":"middle","itemCount":"4","itemBackgroundActive":"#f2d600","itemBackgroundHover":"#cfcfcf","itemBackgroundInactive":"#e5e5e5","itemBorderColor":"#d7d7d7","itemBorderRadius":"3","itemBorderWidth":"1","itemBorderStyle":"solid","itemPadding":"5","itemHeightActive":"100","itemHeightInactive":"80","itemHeightSteady":"132","itemWidthActive":"100","itemWidthInactive":"85","itemWidthSteady":"200","scrollFactorGeneral":"100","scrollFactorMobile":"15","scrollFactorPanel":"10","panelAlign":"right","panelApplySettings":"false","panelBorderColor":"#919191","panelBorderWidth":"0","panelBorderStyle":"solid"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Open PopUp":[function(base,webMI,window,document,self){
// This Quick Dynamic opens a display as popup depending on one of the events defined by "onEvent".
// Parameters:
//	PopUp:		display which will be opened as popup
//	onEvent:	the event triggering this Quick Dynamic, which is one of the following:
//		click:		mouse click
//		dblclick:	double click of mouse button
//		mousedown:	press down the mouse button
//		mouseup:	release the mouse button
//		muuseover:	move the mouse cursor over the applied graphical element
//		mousemove:	move the mouse anywhere over the applied graphical element
//		mouseout:	move the mouse cursor out of the applied graphical element
//	width:		width of the popup (in pixels)
//	height:		height of the popup (in pixels)
//	extern:		if true, popup will be opened in external browser window
//	menubar:	if true, menubar will be displayed
//	moveable:	if true, popup will be moveable
//	resizeable:	if true, popup will be resizeable
//	scrollbars:	if true, popup will have scrollbars
//	status:		if true, status bar will be displayed
//	title:		specifies the title of the popup
//	toolbar:	if true, toolbar will be displayed
//  modal:		if true, popup will be open of type modal, i.e. always in foreground

webMI.addEvent(base.id, base.onEvent, function(e) {
	var width = parseFloat(base.width);
	var height = parseFloat(base.height);
	var extern = base.extern==="true";
	var	menubar = base.menubar==="true";
	var moveable = base.moveable==="true";
	var resizeable = base.resizeable==="true";
	var scrollbars = base.scrollbars==="true";
	var status = base.status==="true";
	var toolbar = base.toolbar==="true";
	var modal = base.modal==="true";
	var passParameters = base.passParameters==="true";
	var popup = {display:base.PopUp,extern:extern,height:height,menubar:menubar,modal:modal,movable:moveable,resizable:resizeable,scrollbars:scrollbars,status:status,title:base.title,toolbar:toolbar,width:width};

	if(passParameters)
		popup.query = webMI.query;

	webMI.display.openWindow(popup);
});
},{"PopUp":"","onEvent":"click","width":"300","height":"400","extern":"false","menubar":"false","moveable":"true","resizeable":"false","scrollbars":"false","status":"false","title":"","toolbar":"false","modal":"true","passParameters":"true"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Open Picker":[function(base,webMI,window,document,self){
var style;

// Check if to be opened centered
if (typeof base != "undefined" && base.openCentered == "true") {
	// If no styles defined
	if (typeof base.style != "undefined")
		webMI.display.openWindow({display:base.picker,extern:false,height:base.height,width:base.width,menubar:false,modal:true,movable:true,resizable:false,scrollbars:false,status:false,title:base.title,toolbar:false,query:base.parameters,style:base.style});
	else
		webMI.display.openWindow({display:base.picker,extern:false,height:base.height,width:base.width,menubar:false,modal:true,movable:true,resizable:false,scrollbars:false,status:false,title:base.title,toolbar:false,query:base.parameters});
} else {
	var popUpPoint = setPopUpPosition(base.callingElementWidth, base.callingElementHeight, base.width, base.height)
	// If no styles defined
	if (typeof base.style != "undefined")
		webMI.display.openWindow({display:base.picker,extern:false,x:popUpPoint.x,y:popUpPoint.y,height:base.height,width:base.width,menubar:false,modal:true,movable:true,resizable:false,scrollbars:false,status:false,title:base.title,toolbar:false,query:base.parameters,style:base.style});
	else
		webMI.display.openWindow({display:base.picker,extern:false,x:popUpPoint.x,y:popUpPoint.y,height:base.height,width:base.width,menubar:false,modal:true,movable:true,resizable:false,scrollbars:false,status:false,title:base.title,toolbar:false,query:base.parameters});
}


// Check if pop up has enough space right and at the bottom if opened below calling element.
// If not, change position to above element and/or aligned to right
function setPopUpPosition(callingElementWidth, callingElementHeight, pickerWidth, pickerHeight) {

	var x,y;

	var frame = webMI.rootWindow.document.querySelectorAll("iframe")[1];
	var frame_Width = parseFloat(frame.parentElement.style.width.slice(0,-2));
	var frame_Height = parseFloat(frame.parentElement.style.height.slice(0,-2));

	var matrix = webMI.gfx.getScreenCTM(true);
	var popUpPoint = webMI.gfx.createPoint(0,callingElementHeight).matrixTransform(matrix);

	// If pop up elements is broader than available space on right
	if (popUpPoint.x + pickerWidth > frame_Width) {
		x = popUpPoint.x - (pickerWidth - callingElementWidth);
	} else {
		x = popUpPoint.x;
	}
	// If pop up elements is higher than available space at bottom
	if (popUpPoint.y + pickerHeight > frame_Height) {
		y = popUpPoint.y - pickerHeight - callingElementHeight;
	} else {
		y = popUpPoint.y;
	}
	return webMI.gfx.createPoint(x,y);
}
},{"openCentered":"true"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Tab Handler":[function(base,webMI,window,document,self){
if (typeof this.data === "undefined") {
	this.data = { "arr_indexed": [], "arr_not_indexed": [], "act_tab": {"array":null,"index":null}, "act_doc": null, "parent_doc": null, "prev_doc": null, "has_parent": false };
	this.doc_storage = [];
	this.acceptKeys = {"accept":true, "preventFirst":false, "active": true};
	this.iframes = [];
	this.afterLoadCallbacks = [];

	webMI.keys.addCombinationListener(0,9,nextTab);
	webMI.keys.addCombinationListener(4,9,prevTab);
	webMI.keys.addCombinationListener(0,13,applyTab);
	webMI.keys.addCombinationListener(0,32,applyTab);
	webMI.keys.addCombinationListener(0,27,applyTab);
	webMI.keys.addCombinationListener(0,38,applyTab);
	webMI.keys.addCombinationListener(0,40,applyTab);
	webMI.keys.addCombinationListener(0,37,applyTab);
	webMI.keys.addCombinationListener(0,39,applyTab);

	/*PreventDefault bei Tab,Enter,Esc,Backspace*/
	webMI.keys.addPressListener(function(e){preventTab(e,9)},9);
	webMI.keys.addPressListener(function(e){preventTab(e,13)},13);
	webMI.keys.addPressListener(function(e){preventTab(e,27)},27);
	webMI.keys.addPressListener(function(e){preventTab(e,8)},8);
	webMI.keys.addDownListener(function(e){preventTab(e,9)},9);
	webMI.keys.addDownListener(function(e){preventTab(e,13)},13);
	webMI.keys.addDownListener(function(e){preventTab(e,27)},27);
	webMI.keys.addDownListener(function(e){preventTab(e,8)},8);

	webMI.keys.addUpListener(releaseClick,13);
	webMI.keys.addUpListener(releaseClick,38);
	webMI.keys.addUpListener(releaseClick,40);
	webMI.keys.addUpListener(releaseClick,37);
	webMI.keys.addUpListener(releaseClick,39);
}

var data = this.data;
var doc_storage = this.doc_storage;
var acceptKeys = this.acceptKeys;
var iframes = this.iframes;
var afterLoadCallbacks = this.afterLoadCallbacks;

/*Outer*/
function register(tabIndex, keyHandler, doc) {
	if (!acceptKeys.accept)
		return;

	if (tabIndex&&tabIndex==-999999){
		return;
	} else if (tabIndex&&tabIndex>=1){
		pushToStorage(doc,tabIndex,keyHandler);
	}
	else {
		pushToStorage(doc,null,keyHandler);
	}
}
function registerDisplay(doc) {
	if (!acceptKeys.accept)
		return;

	pushToStorage(doc,null,null);
}
function blurFocused(){
	if (!testDocumentExists(data.act_doc))
		return;

	if (data.act_tab.array == "indexed") {
		data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur");
	} else if (data.act_tab.array == "not_indexed") {
		data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur");
	}
	storeActTab();
}
function beforeFirstUse(doc,storeParent,callback){
	if (storeParent){
		storeParentDoc(doc,data.prev_doc);
		getFocused(doc);
	}
	if(callback){
		callback.call(this);
	}
}
function getFocused(doc){
	if (!acceptKeys.accept || !testDocumentExists(doc) || isFocused(doc))
		return;

	getFromStorage(doc);
	if (data.arr_indexed.length > 0 && data.act_tab.array == "indexed"){
		setCurrentIndex(data.arr_indexed[data.act_tab.index].keyHandler);
	} else if (data.arr_indexed.length > 0){
		setCurrentIndex(data.arr_indexed[0].keyHandler);
	} else if (data.arr_not_indexed.length > 0 && data.act_tab.array == "not_indexed") {
		setCurrentIndex(data.arr_not_indexed[data.act_tab.index].keyHandler);
	} else if (data.arr_not_indexed.length > 0) {
		setCurrentIndex(data.arr_not_indexed[0].keyHandler);
	}
}
function isFocused(doc){
	return (testDocumentExists(data.act_doc) && doc == data.act_doc)
}
function removeDoc(doc, switchToParent){
	removeFromStorage(doc,switchToParent);
}
function setCurrentIndex(keyHandler, callback){
	if (!testDocumentExists(data.act_doc) && acceptKeys.accept)
		return;

	//callback just from button
	var retValBlur;
	if (data.act_tab.array == "indexed") {
		retValBlur = data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur",callback);
	} else if (data.act_tab.array == "not_indexed") {
		retValBlur = data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur",callback);
	}
	data.act_tab = findKeyHandler(keyHandler);
	if (data.act_tab.array == "indexed") {
		data.arr_indexed[data.act_tab.index].keyHandler.call(this,"focus");
	} else	if (data.act_tab.array == "not_indexed") {
		data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"focus");
	}
	if (callback && (typeof retValBlur === "undefined" || (typeof retValBlur === "boolean" && !retValBlur))){
		callback.call(this);
	}
}
function renew(modal){
	/*if external, internal not modal or no parent exists*/
	if (typeof modal === "undefined" || modal || !data.has_parent) {
		data.has_parent = true;
		data.prev_doc = data.act_doc;
	}
	data.arr_indexed = [];
	data.arr_not_indexed = [];
	data.act_tab = {"array":null,"index":null};
	data.act_doc = null;
	data.parent_doc = null;
}
function changeDisplay(){
	data.has_parent = false;
	data.prev_doc = null;
	data.arr_indexed = [];
	data.arr_not_indexed = [];
	data.act_tab = {"array":null,"index":null};
	data.act_doc = null;
	data.parent_doc = null;
}
function renewGlobal(){
	data.arr_indexed.length = 0;
	data.arr_not_indexed.length = 0;
	data.act_tab = {"array":null,"index":null};
	data.act_doc = null;
	data.parent_doc = null;
	doc_storage.length = 0;
	data.has_parent = false;
	data.prev_doc = null;
	iframes.length = 0;
	afterLoadCallbacks.length = 0;
}

function pushIFrame(fname, frame, defaultFrameName){
	var replace = false;
	var obj = {name:fname,frame:frame,loaded:false, hasevent:false};
	if (defaultFrameName && fname != defaultFrameName) obj.loaded = true;
	for (var i=0; i<iframes.length;i++){
		if (fname != "" && iframes[i].name == fname){
			iframes[i] = obj;
			replace = true;
		}
	}
	if (!replace){
		iframes.push(obj);
	}
}
function getIFrame(fname){
	for (var i=0;i<iframes.length;i++){
		try {
			if (iframes[i].name == fname) return iframes[i].frame;
		} catch (ex) {}
	}
	return null;
}
function setIFrameHasEvent(frame){
	for (var i=0;i<iframes.length;i++){
		try {
			if (iframes[i].frame == frame) iframes[i].hasevent = true;
		} catch (ex) {}
	}
}
function hasIFrameEvent(frame){
	for (var i=0;i<iframes.length;i++){
		try {
			if (iframes[i].frame == frame) return iframes[i].hasevent;
		} catch (ex) {}
	}
	return false;
}
function setIFrameLoaded(frame,bool){
	for (var i=0;i<iframes.length;i++){
		try {
			if (iframes[i].frame == frame) iframes[i].loaded = bool;
		} catch (ex) {}
	}
}
function areAllIFrameLoaded(){
	for (var i=0;i<iframes.length;i++){
		try {
			if (!iframes[i].loaded) return false;
		} catch (ex) {}
	}
	return true;
}
function getIFrameNames(){
	var ret = [];
	for (var i=iframes.length-1;i>=0;i--){
		try{
			if (iframes[i].frame.contentWindow != null && iframes[i].name != "" ) ret.push(iframes[i].name);
		} catch (ex) {
			iframes.splice(i, 1);
		}
	}
	return ret;
}

//returns the names of the iFrames projected in the default-display
function getParentIFrameNames(){
	var foreignObjectsContainer = document.getElementById("foreignobjects");
	var currentWin = null;
	while(!foreignObjectsContainer){
	  currentWin = window.parent;
	  foreignObjectsContainer = currentWin.document.getElementById("foreignobjects");

	}
	var parentFrameNames = [];
	for(var i=0; i < foreignObjectsContainer.childNodes.length;i++){
	  for(var h=0; h < foreignObjectsContainer.childNodes[i].childNodes.length;h++){
		if(foreignObjectsContainer.childNodes[i].childNodes[h].nodeName.toLowerCase() == "iframe"){
			var frameName = foreignObjectsContainer.childNodes[i].childNodes[h].getAttribute("framename");
			if(frameName !== null){
			  parentFrameNames.push(foreignObjectsContainer.childNodes[i].childNodes[h].getAttribute("framename"));
			}
		}
	  }
	}
	return parentFrameNames;
}

var indexHtmWindow = window;
try {
	while (!indexHtmWindow.isRootDisplay && indexHtmWindow != indexHtmWindow.parent && indexHtmWindow.parent.webMI)
		indexHtmWindow = indexHtmWindow.parent;
} catch (ex) { }
function cleanIFrames() {
	var iframes_obj = iframes;
	if (indexHtmWindow.isRootDisplay) {
		var domIFrames = indexHtmWindow.document.getElementsByTagName('iframe');
		if (domIFrames.length > 1) {
			for (i = 0; i < iframes.length; i++) {
				var remove = true;
				for (j in domIFrames) {
					try {
						if (iframes[i].frame.id == domIFrames[j].id)
							remove = false;
					} catch (ex) {}
					try {
						if (iframes[i].frame.contentWindow.webMI)
							remove = false;
					} catch (ex) {}
				}
				if (remove) {
					if (iframes_obj != iframes)
						return;
					iframes.splice(i,1);
					iframes_obj = iframes;
					i--;
				}
			}
		}
	}
	return;
}

function removeCallback(frame){
  for (var i=afterLoadCallbacks.length-1;i>=0;i--){
	var frameElement = afterLoadCallbacks[i].frame;
	if(typeof frameElement === "string"){
	  if(afterLoadCallbacks[i].frame === frame.getAttribute("framename")){
		afterLoadCallbacks.splice(i,1);
	  }
	}else{
	  if(afterLoadCallbacks[i].frame === frame){
		afterLoadCallbacks.splice(i,1);
	  }
	}

  }
}

function addAfterIFrameLoad(fun,frame){
	var find = false;
	for (var i=0;i<afterLoadCallbacks.length;i++){
		if (afterLoadCallbacks[i].callback==fun) find = true;
	}
	if (!find) afterLoadCallbacks.push({callback:fun, frame:frame});
}
function runAfterIFrameLoad(){
	for (ali=0;ali<afterLoadCallbacks.length;ali++){
		afterLoadCallbacks[ali].callback.call(this);
	}
	afterLoadCallbacks.length = 0;
}
function setAcceptKeys(bool){
	if (acceptKeys.active)
		acceptKeys.accept = bool;
}
function setAcceptKeysPrevent(bool){
	if (acceptKeys.active)
		acceptKeys.preventFirst = bool;
}
function getAcceptKeys(){
	var ret = (acceptKeys.accept && !acceptKeys.preventFirst);
	acceptKeys.preventFirst = false;
	return ret;
}

/*Inner*/
function sortFunction(a,b){return (a.tabIndex-b.tabIndex)};

function pushToStorage(doc,index1,handler1){
	if (doc.location == "about:blank")
		return;
	var sto_index = null;
	for (var j=0;j<doc_storage.length;j++){
		if (doc_storage[j].doc == doc) sto_index = j;
	}
	if (sto_index == null) {
		sto_index = doc_storage.length;
		doc_storage[doc_storage.length] = {"doc":doc,"data":{ "arr_indexed": [], "arr_not_indexed": [], "act_tab": {"array":null,"index":null}, "act_doc": null, "parent_doc": null }};
	}
	if (index1 != null && handler1 != null){
		doc_storage[sto_index].data.arr_indexed[doc_storage[sto_index].data.arr_indexed.length] = {"tabIndex":index1, "keyHandler": handler1};
	} else if (index1 == null && handler1 != null){
		doc_storage[sto_index].data.arr_not_indexed[doc_storage[sto_index].data.arr_not_indexed.length] = {"tabIndex":doc_storage[sto_index].data.arr_not_indexed.length, "keyHandler": handler1};
	}
}
function findDocStorage(doc,callback) {
	for (var j=0;j<doc_storage.length;++j) {
		if (doc_storage[j].doc == doc) {
			callback.call(this,j);
			return;
		}
	}
}

function getFromStorage(doc) {
	findDocStorage(doc,function(ind){
		data.arr_indexed = doc_storage[ind].data.arr_indexed;
		data.arr_not_indexed = doc_storage[ind].data.arr_not_indexed;
		data.act_tab = doc_storage[ind].data.act_tab;
		data.act_doc = doc;
	});
	data.arr_indexed.sort(sortFunction);
	data.arr_not_indexed.sort(sortFunction);
}

function storeActTab() {
	findDocStorage(data.act_doc,function(ind){
		doc_storage[ind].data.act_tab = data.act_tab;
	});
}

function storeParentDoc(doc,parent) {
	findDocStorage(doc,function(ind){
		doc_storage[ind].data.parent_doc = parent;
	});
}

function removeFromStorage(doc,switchToParent){
	findDocStorage(doc,function(ind){
		switchToParent && getFocused(doc_storage[ind].data.parent_doc);
		doc_storage.splice(ind,1);
	});
}

function setAndRunFirst(ori){
	if (ori == 1){
		for (var i=0;i<data.arr_indexed.length;i++){
			if (data.arr_indexed[i].keyHandler.call(this,"isActive",getComputedVisibility)){
				data.arr_indexed[i].keyHandler.call(this,"focus");
				data.act_tab = {"array":"indexed", "index": i};
				return;
			}
		}
		for (var i=0;i<data.arr_not_indexed.length;i++){
			if (data.arr_not_indexed[i].keyHandler.call(this,"isActive",getComputedVisibility)){
				data.arr_not_indexed[i].keyHandler.call(this,"focus");
				data.act_tab = {"array":"not_indexed", "index": i};
				return;
			}
		}
	} else {
		for (var i=data.arr_not_indexed.length-1;i>-1;i--){
			if (data.arr_not_indexed[i].keyHandler.call(this,"isActive",getComputedVisibility)){
				data.arr_not_indexed[i].keyHandler.call(this,"focus");
				data.act_tab = {"array":"not_indexed", "index": i};
				return;
			}
		}
		for (var i=data.arr_indexed.length-1;i>-1;i--){
			if (data.arr_indexed[i].keyHandler.call(this,"isActive",getComputedVisibility)){
				data.arr_indexed[i].keyHandler.call(this,"focus");
				data.act_tab = {"array":"indexed", "index": i};
				return;
			}
		}
	}
}

function findKeyHandler(keyHandler){
	for (var i=0; i<data.arr_indexed.length;i++){
		if (data.arr_indexed[i].keyHandler == keyHandler){
			return {"array":"indexed","index":i};
		}
	}
	for (var i=0; i<data.arr_not_indexed.length;i++){
		if (data.arr_not_indexed[i].keyHandler == keyHandler){
			return {"array":"not_indexed","index":i}
		}
	}
	return {"array":null,"index":null};
}
function getKeyCode(e){
	var e = window.event||e;
	return (e.keyCode||e.charCode);
}
function preventTab(e,kk){
	if (!acceptKeys.accept) return true;
	if (kk == 9 || kk == 13 || kk == 27 || kk == 8){
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
			return false;
		}
	}
}
function nextTab(e,shiftNum){
	if (!acceptKeys.accept || acceptKeys.preventFirst){ acceptKeys.preventFirst = false; return true;}
	shiftNum = shiftNum || 0;
	if (data.arr_indexed.length == 0 && data.arr_not_indexed.length == 0) return;
	if (data.act_tab.array == null) {
		setAndRunFirst(1);
	} else {
		if (data.act_tab.array == "indexed" &&  data.act_tab.index < data.arr_indexed.length-1){ /*normal next indexed*/
			if (shiftNum == 0)
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"indexed", "index": data.act_tab.index+1};
		} else if (data.act_tab.array == "indexed" &&  data.act_tab.index == data.arr_indexed.length-1 && data.arr_not_indexed.length > 0){ /*indexed overflow and exists not_indexed*/
			if (shiftNum == 0)
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"not_indexed", "index": 0};
		} else if (data.act_tab.array == "indexed" &&  data.act_tab.index == data.arr_indexed.length-1 && data.arr_not_indexed.length == 0){ /*indexed overflow and not exists not_indexed*/
			if (shiftNum == 0)
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"indexed", "index": 0};
		} else if (data.act_tab.array == "not_indexed" &&  data.act_tab.index < data.arr_not_indexed.length-1){ /*normal next not_indexed*/
			if (shiftNum == 0)
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"not_indexed", "index": data.act_tab.index+1};
		} else if (data.act_tab.array == "not_indexed" &&  data.act_tab.index == data.arr_not_indexed.length-1 && data.arr_indexed.length > 0){ /*not_indexed overflow and exists indexed*/
			if (shiftNum == 0)
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"indexed", "index": 0};
		} else if (data.act_tab.array == "not_indexed" &&  data.act_tab.index == data.arr_not_indexed.length-1 && data.arr_indexed.length == 0){ /*not_indexed overflow and not exists indexed*/
			if (shiftNum == 0)
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"not_indexed", "index": 0};
		}
		if (data.act_tab.array == "indexed"){
			if (data.arr_indexed[data.act_tab.index].keyHandler.call(this,"isActive",getComputedVisibility))
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"focus");
			else if ( shiftNum < (data.arr_indexed.length + data.arr_not_indexed.length) )
				nextTab(e,shiftNum+1);
			else
				data.act_tab = {"array":null, "index": null};
		} else if (data.act_tab.array == "not_indexed") {
			if (data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"isActive",getComputedVisibility))
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"focus");
			else if ( shiftNum < (data.arr_indexed.length + data.arr_not_indexed.length) )
				nextTab(e,shiftNum+1);
			else
				data.act_tab = {"array":null, "index": null};
		}
	}
}

function prevTab(e,shiftNum){
	if (!acceptKeys.accept || acceptKeys.preventFirst){ acceptKeys.preventFirst = false; return true;}
	shiftNum = shiftNum || 0;
	if (data.arr_indexed.length == 0 && data.arr_not_indexed.length == 0) return;
	if (data.act_tab.array == null) {
		setAndRunFirst(-1);
	} else {
		if (data.act_tab.array == "indexed" &&  data.act_tab.index > 0){ /*normal next indexed*/
			if (shiftNum == 0)
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"indexed", "index": data.act_tab.index-1};
		} else if (data.act_tab.array == "indexed" &&  data.act_tab.index == 0 && data.arr_not_indexed.length > 0){ /*indexed overflow and exists not_indexed*/
			if (shiftNum == 0)
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"not_indexed", "index": data.arr_not_indexed.length-1};
		} else if (data.act_tab.array == "indexed" &&  data.act_tab.index == 0 && data.arr_not_indexed.length == 0){ /*indexed overflow and not exists not_indexed*/
			if (shiftNum == 0)
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"indexed", "index": data.arr_indexed.length-1};
		} else if (data.act_tab.array == "not_indexed" &&  data.act_tab.index > 0){ /*normal next not_indexed*/
			if (shiftNum == 0)
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"not_indexed", "index": data.act_tab.index-1};
		} else if (data.act_tab.array == "not_indexed" &&  data.act_tab.index == 0 && data.arr_indexed.length > 0){ /*not_indexed overflow and exists indexed*/
			if (shiftNum == 0)
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"indexed", "index": data.arr_indexed.length-1};
		} else if (data.act_tab.array == "not_indexed" &&  data.act_tab.index == 0 && data.arr_indexed.length == 0){ /*not_indexed overflow and not exists indexed*/
			if (shiftNum == 0)
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"blur");
			data.act_tab = {"array":"not_indexed", "index": data.arr_not_indexed.length-1};

		}
		if (data.act_tab.array == "indexed"){
			if (data.arr_indexed[data.act_tab.index].keyHandler.call(this,"isActive",getComputedVisibility))
				data.arr_indexed[data.act_tab.index].keyHandler.call(this,"focus");
			else if ( shiftNum < (data.arr_indexed.length + data.arr_not_indexed.length) )
				prevTab(e,shiftNum+1);
			else
				data.act_tab = {"array":null, "index": null};
		} else if (data.act_tab.array == "not_indexed") {
			if (data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"isActive",getComputedVisibility))
				data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"focus");
			else if ( shiftNum < (data.arr_indexed.length + data.arr_not_indexed.length) )
				prevTab(e,shiftNum+1);
			else
				data.act_tab = {"array":null, "index": null};
		}
	}
}
function callApply(fun,kk){
	if (data.act_tab.array == "indexed") {
		return data.arr_indexed[data.act_tab.index].keyHandler.call(this,fun,kk);
	} else if (data.act_tab.array == "not_indexed") {
		return data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,fun,kk);
	}
}
function applyTab(e){
	var kk = getKeyCode(e);
	if (!acceptKeys.accept || (acceptKeys.preventFirst)){
		 if (kk != 27) acceptKeys.preventFirst = false;
		 return true;
	}
	if ((data.arr_indexed.length == 0 && data.arr_not_indexed.length == 0) || data.act_tab.array == null ) return;
	if (!callApply("isActive",getComputedVisibility)){ nextTab(e); return;}
	var fun;
	if (kk == 13) {
		fun = "apply";
	} else if ( kk == 27){
		fun = "back";
	} else if ( kk == 32){
		fun = "space";
	} else if ( kk == 38){
		fun = "arrow";
	} else if ( kk == 40){
		fun = "arrow";
	} else if ( kk == 37){
		fun = "arrow";
	} else if ( kk == 39){
		fun = "arrow";
	}
	callApply(fun,kk);
}
function releaseClick(e){
	if ((data.arr_indexed.length == 0 && data.arr_not_indexed.length == 0) || data.act_tab.array == null ) return;
	callApply("releaseClick",null);
}

function getComputedVisibility(element) {
	function isVisible(style) {
		return style["visibility"] != "hidden";
	}
	var elementDoc = element.ownerDocument;
	var elementWin = elementDoc.defaultView || elementDoc.parentWindow;
	if (elementWin.getComputedStyle) {
		var computedStyle = elementWin.getComputedStyle(element);
		return isVisible(computedStyle) && computedStyle["display"] != "none";
	}
	var visible = isVisible(element.currentStyle);
	if (!visible)
		return visible;

	var parent = element.parentNode;
	while (parent.id != "webmivmlroot") {
		if (!isVisible(parent.currentStyle))
			return false;
		parent = parent.parentNode;
	}
	return visible;
}

function testDocumentExists(doc) {
	try {
		return doc.location != "";
	} catch(e) {
		return false;
	}
}

if (base.activate == "false"){
	acceptKeys.active = false;
	acceptKeys.accept = false;
	return;
} else {
	return {
		"register": register,
		"registerDisplay": registerDisplay,
		"blurFocused": blurFocused,
		"beforeFirstUse": beforeFirstUse,
		"getFocused": getFocused,
		"isFocused": isFocused,
		"removeDoc": removeDoc,
		"setCurrentIndex": setCurrentIndex,
		"renew": renew,
		"changeDisplay": changeDisplay,
		"renewGlobal": renewGlobal,
		"pushIFrame": pushIFrame,
		"getIFrame": getIFrame,
		"setIFrameHasEvent": setIFrameHasEvent,
		"hasIFrameEvent": hasIFrameEvent,
		"setIFrameLoaded": setIFrameLoaded,
		"areAllIFrameLoaded": areAllIFrameLoaded,
		"getIFrameNames": getIFrameNames,
		"getParentIFrameNames": getParentIFrameNames,
		"cleanIFrames": cleanIFrames,
		"removeCallback": removeCallback,
		"addAfterIFrameLoad": addAfterIFrameLoad,
		"runAfterIFrameLoad": runAfterIFrameLoad,
		"setAcceptKeys": setAcceptKeys,
		"setAcceptKeysPrevent": setAcceptKeysPrevent,
		"getAcceptKeys": getAcceptKeys,
		"nextTab": nextTab,
		"prevTab": prevTab
	}
}
},{"activate":"true"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss KPI Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_kpi_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoReconnect":[function(base,webMI,window,document,self){
var self = this;

if (!this.initialized || base.defaultconfiguration == "false") {
	this.activated = base.activated == "true";
	this.interval = parseInt(base.interval);
}

if (this.initialized)
	return;

var indexHtmWindow = window;
try {
	while (top != indexHtmWindow && indexHtmWindow.parent.webMI)
		indexHtmWindow = indexHtmWindow.parent;
} catch (ex) { }

var connectingText = "Connecting ...";
var reconnectingText = "Retry in %d second(s) ...";
var seconds = 0;
var state = 0;
var timer = null;
var statusBar = createElement("div", {}, {
	"bottom": 0,
	"color": "white",
	"fontFamily": "Arial",
	"fontWeight": "bold",
	"display": "none",
	"height": "35px",
	"lineHeight": "35px",
	"position": "absolute",
	"textAlign": "center",
	"width": "100%",
	"zIndex": 999
}, indexHtmWindow.document.getElementById('mainContainer'));

handleStateChange(webMI.getState()); //Call handleStateChange in case that the state had already changed to >0
webMI.addEvent(webMI.data, "statechange", handleStateChange);

webMI.addEvent(webMI.data, "serverstatechange", function(e) {
	if (state < 0 && (e.status == "Sop" || e.status == "Snop"))
		setStatusText(webMI.sprintf("Trying to connect..."));
	else
		statusBar.style.display = "none";
});

function connect() {
	if (!self.activated || state > -1)
		return;

	setStatusText(webMI.sprintf(reconnectingText, self.interval - seconds));

	if (seconds >=  self.interval) {
		seconds = 0;
		setStatusText(connectingText);
		webMI.data.call("read", "", function(e) {
			var up = false;
			if (e["result"] || e["error"] > -1000)
				up = true;

			handleServerState(up);
		});
	} else {
		++seconds;
	}
}

this.initialized = true;

function createElement(nodeName, attributes, style, parent) {
	var element = webMI.dom.createElement("http://www.w3.org/1999/xhtml", nodeName);
	for (var i in attributes)
		element.setAttribute(i, attributes[i]);
	for (var i in style)
		element.style[i] = style[i];

	return parent.appendChild(element);
}

function setStatusText(text) {
	statusBar.style.display = "block";

	if ("innerText" in statusBar)
		statusBar.innerText = text;
	else
		statusBar.textContent = text;
}

function handleServerState(up) {
	if (up)
		indexHtmWindow.location.reload(true);
	else {
		var topErrorScreen = indexHtmWindow.document.getElementById("errorscreen");
		if (topErrorScreen)
			topErrorScreen.style.display = "block";
	}
}

function handleStateChange(s) {
	state = s;
	if (state < 0 && !webMI.isRedundant() && timer == null)
		timer = setInterval(connect, 1000);
	else if (state > -1)
		statusBar.style.display = "none";
}
},{"activated":"true","interval":"5","defaultconfiguration":"false"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Configuration":[function(base,webMI,window,document,self){
if(base.action == "init")
	this.indexParameters = base.indexParameters;

if(base.action == "existsIndexParameter" && base.parameterName != "")
	return this.indexParameters[base.parameterName];
else
	return null;
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Opacity":[function(base,webMI,window,document,self){
// This Quick Dynamic sets the opacity of the fill color and/or stroke color of the applied graphical element depending on the value of the defined node and the ranged defined by
// "minRange" and "maxRange", i.e. the range defined by "minRange" and "maxRange" will be translated to the range defined by "StartFill" and "StopFill" and/or to the range defined by
// "StartStroke" and "StopStroke".
// The opacity for the fill color will only be set if both "StartFill" and "StopFill" are defined.
// The opacity for the stroke color will only be set if both "StartStroke" and "StopStroke" are defined.
// e.g.: the defined range of the value from 0 (=minRange) to 100 (=maxRange) will be translated to 0 (=StartFill) to 1 (=StopFill) where 1 means 100% opacity
// Parameters:
//	nodeId:			this node triggers this Quick Dynamic
//	minRange:		lower bound of the range where the node's value should lie in
//	maxRange:		upper bound of the range where the node's value should lie in
//	StartFill:		value for the lowest opacity in percent
//	StopFill:		value for the highest opacity in percent (1=100%)
//	StartStroke:	value for the lowest stroke in percent
//	StopStroke:		value for the highest stroke in percent (1=100%)
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;
	if (base.StartFill != "" && base.StopFill != "") {
		webMI.gfx.setFillOpacity(base.id, webMI.translate(value, base.minRange, base.maxRange, base.StartFill, base.StopFill));
	}
	if (base.StartStroke != "" && base.StopStroke != "") {
		webMI.gfx.setStrokeOpacity(base.id, webMI.translate(value, base.minRange, base.maxRange, base.StartStroke, base.StopStroke));
	}
}

},{"nodeId":"","minRange":"0","maxRange":"100","StartFill":"0","StopFill":"1","StartStroke":"","StopStroke":""}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Open Main Menu":[function(base,webMI,window,document,self){
var StylePresets = { width: parseInt(base.minWidth,10), fontSize:base.fontSize, fill: "#c7c7c7", stroke: "#393939", hoverFill: "#fcec3c", closeTime: 0 }; // fontSize and minWidth taken from parameters for backwards compatibility

// Apply style settings from object display element if available
var style = (base.style != undefined) ? base.style : {};

// If pre-set setting
for (var i in StylePresets) {
	if (style[i] == undefined) {
		style[i] = StylePresets[i];
	}
}
var styleSettings = style;

var frameName = base.frameName ? base.frameName : "content";
var itemsCount = base.itemsCount ? base.itemsCount : "0";

var menuMain = {};
var menuUser = {};
var menuSystem = {};
var menuReport = {};

function getDisplayFn(display) {
	return function(e) {
		if(webMI.rootWindow.responsiveHandler.active) {
			function changeLayout(){
				if(currDisp.indexOf("Landscape") >= 0){
					display = display.substr(display.indexOf("DISPLAYS.") + "DISPLAYS.".length);
					currDisp = currDisp.substr(0, currDisp.lastIndexOf("."));
					display = currDisp + "." + display
				} else if(currDisp.indexOf("Portrait") >= 0){
					display = display.substr(display.indexOf("DISPLAYS.") + "DISPLAYS.".length);
					currDisp = currDisp.substr(0, currDisp.lastIndexOf("."));
					display = currDisp + "." + display
				}
			}
			var path = document.location.pathname;
			var currDisp = path.substring(path.lastIndexOf('/')+1, path.length);
			if(currDisp.indexOf(".svg") >= 0){
				currDisp = getDisplayName(currDisp.replace(".svg", ""));
				display = getDisplayName(display);
				changeLayout();
				display = getDisplayCode(display);
			} else {
				changeLayout();
			}
		}
		webMI.display.openDisplay(display,webMI.query,frameName);
		webMI.display.showPopup(0, 0, -1); // empties addedClosePopUpEvents in ATVISE.QUICKDYNAMICS.index
	};
}

function getUrlFn(url) {
	if (typeof url === "undefined")
		return;

	return function(e) {
		webMI.display.openUrl(url,webMI.query,frameName);
	};
}

webMI.trigger.fire("com.atvise.display_structure", function(e, preload) {
	var displayConfig = e;
	if (displayConfig) {
		if (displayConfig.menu) {
			function addEntry(menu, menuObj) {
				for (var i in menuObj) {
					menu[i] = menuObj[i];
				}
				return menu;
			};

			function atviseDefault(menuName) {
				return (menuName == "MAIN" || menuName == "SYSTEM" || menuName == "USER" || menuName == "REPORT");
			};

			function createMenu(menuObj, menuItem) {
				var menuItemId = menuItem.identifier.substr(menuItem.identifier.search(".DISPLAYS.")+10);
				if (menuItem.sub) {
					if (!atviseDefault(menuItem.name) && !atviseDefault(menuItemId)) {
						menuObj[menuItem.name] = {
							sub: {},
							text: menuItem.name,
							value: (menuItem.display ? getDisplayFn(menuItem.display) : getUrlFn(menuItem.url))
						};
						for (var i in menuItem.sub) {
							var sub = {};
							createMenu(menuObj[menuItem.name]["sub"], menuItem.sub[i]);
						}
					} else {
						for (var i in menuItem.sub) {
							createMenu(menuObj, menuItem.sub[i]);
						}
					}
				} else if (menuItem.display) {
					menuObj[menuItem.display] = {text: menuItem.name, value: getDisplayFn(menuItem.display) };
				} else if (menuItem.url) {
					menuObj[menuItem.url] = {text: menuItem.name, value: getUrlFn(menuItem.url) };
				}
				menuObj.style = styleSettings;
				menuObj.style.closeOnMouseout = base.closeOnMouseout;
				switch(menuItem.name) {
					case "MAIN": menuMain = addEntry(menuMain, menuObj); break;
					case "USER": menuUser = addEntry(menuUser, menuObj); break;
					case "SYSTEM": menuSystem = addEntry(menuSystem, menuObj); break;
					case "REPORT": menuReport = addEntry(menuReport, menuObj); break;
					default: break;
				}
				switch(menuItemId) {
					case "MAIN": menuMain = addEntry(menuMain, menuObj); break;
					case "USER": menuUser = addEntry(menuUser, menuObj); break;
					case "SYSTEM": menuSystem = addEntry(menuSystem, menuObj); break;
					case "REPORT": menuReport = addEntry(menuReport, menuObj); break;
					default: break;
				}
			};

			for (var i in displayConfig.menu) {
				var menuObj = { };
				var menuItem;
				if(displayConfig.menu[i].name != "TABLET" && displayConfig.menu[i].name != "MOBILE"){
					menuItem = displayConfig.menu[i];
				}
				if (menuItem) {
					createMenu(menuObj, menuItem);
				}
			}
		}
	}
});

var tempObj = {};
tempObj.style = styleSettings;
tempObj.style.closeOnMouseout = base.closeOnMouseout;
tempObj.itemsCount = itemsCount;
if (base.name != undefined) {
	function addEntries(menu) {
		for (var i in menu) {
			tempObj[i] = menu[i];
		}
	};
	switch(base.name) {
		case "MAIN": addEntries(menuMain); break;
		case "USER": addEntries(menuUser); break;
		case "SYSTEM": addEntries(menuSystem); break;
		case "REPORT": addEntries(menuReport); break;
		default: break;
	}
}

webMI.addEvent(base.id, base.onEvent, function(e) {
	var p = webMI.gfx.createPoint(base.x,base.y).matrixTransform(webMI.gfx.getScreenCTM(true));
	tempObj.style.closeOnMouseout = base.closeOnMouseout;
	tempObj.style.clickAreaId = base.id;
	tempObj.style.isDisplayMenu = true;
	webMI.display.showPopup(0, 0, -1);
	webMI.display.showPopup(p.x, p.y, tempObj);
});

webMI.addOnunload(function() {
	tempObj.style.closeOnMouseout = base.closeOnMouseout;
	tempObj.style.clickAreaId = base.id;
	tempObj.style.isDisplayMenu = true;
	webMI.display.showPopup(0, 0, tempObj);
});
},{"onEvent":"click","name":"MAIN","frameName":"content","itemsCount":"0","fontSize":"12","minWidth":"160","closeOnMouseout":"true"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.Rotation on/off":[function(base,webMI,window,document,self){
var curStep = 0;
var timer;
var isRotating = false;

var interval = 60000 / (base.rpm * 50);
var i = base.rot_wise=="clockwise"?1:-1;

webMI.data.subscribe(base.on, function(e){
	if(e.value){
		if(!isRotating)
		{
			isRotating = true;		
			timer = setInterval(function(e){
				curStep++;
				if(curStep >= 20)
					curStep = 0;
				try{
					webMI.gfx.setRotation(base.id, webMI.translate(i*curStep, 0, 20, 0, 360));
					
				}
				catch (err)
				{
					clearInterval(timer);
				}
			},interval);		
		}
	}
	else
	{
		isRotating = false;
		clearInterval(timer);
	}
});
},{"rpm":"10","rot_wise":"clockwise"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Alarmmanagement":[function(base,webMI,window,document,self){
Date.prototype.toSortableString = function(_withMS) {
	function _preNull(_nr) {
		if (_nr < 10)
		   return "0" + _nr;
		return _nr;
	}
	var _ret = this.getFullYear() + "-" + _preNull(this.getMonth()+1) + "-" + _preNull(this.getDate()) + " " +
	_preNull(this.getHours()) + ":" + _preNull(this.getMinutes()) + ":" + _preNull(this.getSeconds());
	if (_withMS)
		_ret += "." + this.getMilliseconds();
	return _ret;
};

var self = this;

var displaysDict = {};

webMI.trigger.fire("com.atvise.display_structure", function(e) {

	function getIdentifierDisplayDictionary(root) {
		for(var element in root) {
			if (typeof root[element].sub != "undefined") getIdentifierDisplayDictionary(root[element].sub);
			else if (typeof root[element].display != "undefined") displaysDict[root[element].identifier] = root[element].display;
		}
	}
	getIdentifierDisplayDictionary(e.menu);
});

function initializeAlarmmanagement(alarmmanagement) {
	webMI.addEvent(webMI.data, "serverstatechange", function(e) {
		var state = e.active["connection-status"].primary || e.active["connection-status"].secondary;
		if (!state) {
			alarms = [];
			webMI.trigger.fire("com.atvise.alarms_notify_item", false);
			webMI.trigger.fire("com.atvise.alarms_notify", false);
		}
	});

	if (alarmmanagement["subscriptionId"] != null){
		alarms.length = 0;
		webMI.data.unsubscribeFilter(alarmmanagement["subscriptionId"]);
	} else {
		webMI.trigger.connect("com.atvise.alarms_items", function(e){
			if (typeof e.value == "function")
				e.value(alarms);
		});

		webMI.trigger.connect("com.atvise.alarms_exist", function(e){
			if (typeof e.value == "function")
				e.value(alarms.length > 0);
		});

		webMI.trigger.connect("com.atvise.alarms_next_display", function(e){

			for (var i in alarms){
				if (alarms[i] != undefined && alarms[i][1] != undefined){
					if ((alarms[i][1]).text == 1 && alarms[i][3] != undefined && alarms[i][3].text != ""){
						webMI.display.openDisplay(displaysDict[(alarms[i][3]).text]);
						break;
					}
				}
			}
		});
	}

	function isAtviseVersion3(item) {
		if (webMI.getMethodSupport().indexOf("AlarmConditions") != -1) {
			thisIsAtviseVersion3 = true;
		} else {
			thisIsAtviseVersion3 = typeof item.ParentId !== "undefined";
		}
		return thisIsAtviseVersion3;
	}

	var filter = {};
	filter.type = ["v:2"]
	filter.select = select;
	alarmmanagement["subscriptionId"] = webMI.data.subscribeFilter(filter, function(e) {

		if (((e.ShelvingState == undefined || e.ShelvingState == "Unshelved") && (e.SuppressedStateId == undefined || e.SuppressedStateId == false))) {
			if (webMI.getMethodSupport().indexOf("AlarmConditions") != -1) {
				if (typeof e.AlarmId != "undefined" && e.state > 0 && e.ConditionState != 2 && e.retain == true) {
					addAlarmItem(e);
					webMI.trigger.fire("com.atvise.alarms_notify_item", e);
				} else {
					removeAlarmItem(e);
					if ((e.state > 0 || typeof e.AlarmId != "undefined" && typeof e.value != "undefined") && e.ConditionState != 2) webMI.trigger.fire("com.atvise.alarms_notify_item", e);
				}
			} else {
				if (e.state > 0) addAlarmItem(e);
				else removeAlarmItem(e);
				webMI.trigger.fire("com.atvise.alarms_notify_item", e);
			}
		} else removeAlarmItem(e);
	});

	function addAlarmItem(itm) {
		if (itm.state == 1 || itm.state == 3) {
			var datarow = [];
			if (itm.address) {
				datarow.id = itm.address;
				datarow.item = itm;
				datarow[0] = { name: "display", text: itm.display ? itm.display : "" };
				datarow[1] = { name: "status", text: typeof itm.state != "undefined" ? itm.state : -1 };
				datarow[2] = { name: "timestamp", text: itm.timestamp ? new Date(itm.timestamp).toSortableString() : "" };
				datarow[3] = { name: "replaceddisplay", text: itm.display ? webMI.sprintf(itm.display, itm) : "" };
				updateItem(datarow, "id");
				webMI.trigger.fire("com.atvise.alarms_notify", true);
			}
		} else if (itm.state == 2) {
			removeAlarmItem(itm);
		}
	};

	function removeAlarmItem(itm) {
		var datarow = [];
		datarow.id = itm.address;
		removeItem(datarow, "id");
		if (alarms.length < 1) {
			webMI.trigger.fire("com.atvise.alarms_notify", false);
		}
	};

	function updateItem(dataItem, identifier) {
		if (alarms.length > 0) {
			var rowNr = -1;
			var i = alarms.length-1;
			while (i > -1) {
				if (alarms[i] != undefined) {
					if (alarms[i][identifier] != undefined && alarms[i][identifier] == dataItem[identifier]) {
						rowNr = i;
						break;
					}
				}
				i--;
			}
			if (rowNr > -1) {
				alarms = _arrayInsertElement(alarms, rowNr, dataItem, true);
			} else {
				alarms.push(dataItem);
			}
		} else {
			alarms.push(dataItem);
		}
	};

	function removeItem(dataItem, identifier) {
		if (alarms.length > 0) {
			var rowNr = -1;
			var i = alarms.length-1;
			while (i > -1) {
				if (alarms[i] != undefined) {
					if (alarms[i][identifier] != undefined && alarms[i][identifier] == dataItem[identifier]) {
						rowNr = i;
						break;
					}
				}
				i--;
			}
			if (rowNr > -1) {
				alarms.splice(rowNr, 1);
			}
		}
	};

	function _arrayInsertElement(arrayInstance, position, newElement, overwrite) {
		if (arrayInstance.length > 0) {
			if (overwrite) {
				arrayInstance[position] = newElement;
			} else {
				var a = arrayInstance.slice();
				var b = a.splice(position,a.length);
				a[position] = newElement;
				arrayInstance = a.concat(b);
			}
		} else {
			arrayInstance.push(newElement);
		}
		return arrayInstance;
	};
}

if (typeof this.alarmmanagement === "undefined") {
	var alarms = [];
	var select = [];
	select.push("v:AlarmId");
	select.push("v:ConditionState");
	select.push("v:ShelvingState");
	select.push("v:SuppressedStateId");
	select.push("v:state");
	select.push("v:address");
	select.push("v:display");
	select.push("v:timestamp");
	select.push("v:eventtext");
	select.push("v:priority");
	select.push("v:retain");
	select.push("v:value");

	this.alarmmanagement = {"subscriptionId": null};
	initializeAlarmmanagement(this.alarmmanagement);
}
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.Node Description":[function(base,webMI,window,document,self){
webMI.data.call("get_node_descr", {"node": base.node, "limit": base.limit}, function(f) {
	var value = f.result;
	webMI.gfx.setText(base.id, value);
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Energy Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_energy_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Acknowledge Alarm":[function(base,webMI,window,document,self){
// This Quick Dynamic acknowledges the defined alarm depending on one of the events defined by "onEvent".
// Parameters:
//	alarm:		alarm which will be acknowledged
//	onEvent:	the event triggering this Quick Dynamic, which is one of the following:
//		click:		mouse click
//		dblclick:	double click of mouse button
//		mousedown:	press down the mouse button
//		mouseup:	release the mouse button
//		muuseover:	move the mouse cursor over the applied graphical element
//		mousemove:	move the mouse anywhere over the applied graphical element
//		mouseout:	move the mouse cursor out of the applied graphical element

webMI.addEvent(base.id, base.onEvent, function(e) {
	webMI.alarm.accept(base.alarm);
});
},{"alarm":"","onEvent":"click"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager":[function(base,webMI,window,document,self){
// This Quick Dynamic helps managing aggregate selection
var self = this;
var AggregateFunctions = [];
self.timeout = 3000;
self.lastBrowse = 0;
self.bufferedAggregateList = false;

var AggregateManager = new function () {
	this.subscribeID = null;
	this.subscribeFilterID = null;
	this.aggregateIndex = [];

	this.validAggregates = ["AnnotationCount", "Average", "Count", "Delta", "DeltaBounds", "DurationBad", "DurationGood", "DurationInStateNonZero",
		"DurationInStateZero", "End", "EndBound", "Interpolative", "Maximum", "Maximum2", "MaximumActualTime", "MaximumActualTime2",
		"Minimum", "Minimum2", "MinimumActualTime", "MinimumActualTime2", "NumberOfTransitions", "PercentBad", "PercentGood",
		"Range", "Range2", "Sampled", "StandardDeviationPopulation", "StandardDeviationSample", "Start", "StartBound", "TimeAverage", "TimeAverage2",
		"Total", "Total2", "VariancePopulation", "VarianceSample", "WorstQuality", "WorstQuality2"];

	/** returns list of valid aggregates **/
	this.getAggregateList = function () {
		return this.validAggregates;
	};

	/** check if its a valid aggregate **/
	/* @param aggregate ... string name of aggregate */
	this.isValidAggregate = function (aggregate) {
		if (this.validAggregates.indexOf(aggregate) != -1) return true;
		return false;
	}


	/** browse for configured aggregates **/
	/* @param nodeAddress ... address for browse aggregate parameters */
	/* @param callback ... callback function */
	this.isAggregates = function (nodeAddress, callback) {
		if (typeof nodeAddress == "undefined")
			return;

		if (webMI.getMethodSupport().indexOf("BrowseNodes") == -1) {
			console.warn("The method BrowseNodes is not supported! Aggregates can not be queried.")
			callback(false);
			return;
		}
		
		function checkAggregate(aggregateList) {
				var aggregateAddress = false;

				function createList(aggregateList) {
					for (var key in aggregateList) {
						var aggregateName = aggregateList[key].name;
						var aggregateIndex = aggregateName.replace("AGENT.HISTORY.AGGREGATETEMPLATES", "");

						if (AggregateFunctions.indexOf(aggregateIndex) < 0)
							AggregateFunctions.push(aggregateIndex);

						if (aggregateList[key].childs)
							createList(aggregateList[key].childs);
					}
				}

				if (AggregateFunctions.length == 0) {
					createList(aggregateList);
				}

				for (var i in AggregateFunctions) {
					var name = AggregateFunctions[i];
					var pos = nodeAddress.lastIndexOf(name);

					if (pos > -1 && nodeAddress.substring(pos) == name) {
						aggregateAddress = name;
						break;
					}
				}

				return(aggregateAddress);
		}

		var currentTime = Date.now();
		if (self.lastBrowse + self.timeout < currentTime) {
			self.bufferedAggregateList = false;
			self.lastBrowse = currentTime;

			webMI.data.call("BrowseNodes", {
					startAddress: "AGENT.HISTORY.AGGREGATETEMPLATES",
					vTypes: ["i=61", "i=62x", "i=63", "i=2340x", "ns=1;s=ObjectTypes.ATVISE.AggregateTemplate", "ns=1;s=ObjectTypes.ATVISE.AggregateFunction"],
					mapping: ["name:nodeid:splitnamespace", "text:browsename", "type:typedefinition:splitnamespace"],
				},
				function (aggregateList) {
					self.bufferedAggregateList = aggregateList;
					self.lastBrowseCompleted = true;
					var aggregateAddress = checkAggregate(self.bufferedAggregateList);
					callback(aggregateAddress);
				}
			);
		} else {
			if (self.bufferedAggregateList != false) {
				var aggregateAddress = checkAggregate(self.bufferedAggregateList);
				callback(aggregateAddress);
			} else {
				var self_function = this;
				setTimeout(function() {
					self_function.isAggregates(nodeAddress, callback);
				}, 100);
			}
		}
	}


	/** subscribe node or aggregate on given base adresse **/
	/* @param base ... node or aggregate address  */
	/* @param manageNodeResult ... callback if node address is found */
	/* @param manageAggregateResult ... callback if aggregate address is found (optional) */
	/* @param modComponent ... callback to modify components if aggregate is found (optional) */
	this.subscribeNodeOrAggregate = function (base, manageNodeResult, manageAggregateResult, modComponent) {
		var self = this;
		if (typeof manageAggregateResult == "undefined") {
			manageAggregateResult = manageNodeResult;
		}

		this.isAggregates(base, function (aggregateAddress) {
			if (aggregateAddress == false) {
				self.subscribeByNode(base, manageNodeResult);
			} else {
				if (typeof modComponent != "undefined" && typeof modComponent == "function") {
					modComponent();
				}

				aggregateBase = base.replace(aggregateAddress, "");
				aggregateTemplate = "AGENT.HISTORY.AGGREGATETEMPLATES" + aggregateAddress;

				webMI.data.call("BrowseNodes", {
						startAddress: aggregateTemplate,
						vTypes: ["i=61", "i=62", "i=63", "i=2340", "ns=1;s=ObjectTypes.ATVISE.AggregateTemplate", "ns=1;s=ObjectTypes.ATVISE.AggregateFunction"],
						mapping: ["name:nodeid:splitnamespace", "text:browsename", "type:typedefinition:splitnamespace"],
					},

					function (aggregate) {
						var aggregateKeys = [];
						var aggregateConfig = {};

						for (var key in aggregate)
							aggregateKeys.push(key);

						function evalAggregate(aggregate, aggregateKeys, aggregateConfig, manageAggregateResult) {
							if (aggregateKeys.length) {
								var key = aggregateKeys.pop();
								if (aggregate[key]["type"] == "i=2340") {
									aggregateConfig["aggregate"] = aggregate[key].text;
									evalAggregate(aggregate, aggregateKeys, aggregateConfig, manageAggregateResult);
								} else if (aggregate[key]["type"] == "i=62") {
									webMI.data.read(aggregateTemplate + "." + key, function (e) {
										aggregateConfig[key] = e.value;
										evalAggregate(aggregate, aggregateKeys, aggregateConfig, manageAggregateResult);
									});
								} else {
									evalAggregate(aggregate, aggregateKeys, aggregateConfig, manageAggregateResult);
								}
							} else {
								try {
									self.subscribeByAggregate(aggregateConfig, manageAggregateResult);
								} catch(ex) {
									console.warn("DEBUG: AGM not ready"); // in case of slow loading do not display errors
								}
							}
						}

						aggregateConfig["address"] = aggregateBase;
						evalAggregate(aggregate, aggregateKeys, aggregateConfig, manageAggregateResult);
					}
				);

			}
		});
	}

	/** compatible: @internal subscribe if node on given base adresse **/
	this.subscribeNode = function (base, manageNodeResult) {
		this.subscribeByNode(base, manageNodeResult);
	}

	/** @internal subscribe if node on given base adresse **/
	this.subscribeByNode = function (base, manageNodeResult) {
		this.subscribeID = webMI.data.subscribe(base, manageNodeResult);
	}

	/** compatible: @internal subscribe if aggregate on given base adresse **/
	this.subscribeAggregate = function (AggregateConfig, manageAggregateResult) {
		return this.subscribeByAggregate(AggregateConfig, manageAggregateResult);
	}

	/** unsubscribe aggregate **/
	this.unsubscribeAggregate = function(id){
	    var unSubscribeDone = false;
		for(var key in this.aggregateIndex){
			if(this.aggregateIndex[key] == id){
				webMI.data.unsubscribeFilter(id);
				delete this.aggregateIndex[key];
				unSubscribeDone = true;
				break;
			}
		}

		/* clean index if empty */
		if(!Object.keys(this.aggregateIndex).length){
			this.aggregateIndex = [];
		}

		return unSubscribeDone;
	}

	/** @internal subscribe if aggregate on given base adresse **/
	this.subscribeByAggregate = function (AggregateConfig, manageAggregateResult) {
		this.subscribeFilterID = webMI.data.subscribeFilter({
				address: ["v:" + AggregateConfig["address"]],
				aggregate: ["v:" + AggregateConfig["aggregate"]],
				select: ["v:priority", "v:value", "v:username", "v:address", "v:timestamp", "v:type", "v:status", "v:ReplacementNames", "v:ReplacementValues"],
				interval: ["v:" + AggregateConfig["interval_value"]],
				unit: ["v:" + AggregateConfig["interval_unit"]],
				type: "v:1",
				init: ["v:true"]
			},
			function (subscribeResult) {
				manageAggregateResult(subscribeResult);
			}
		);
		this.aggregateIndex.push(this.subscribeFilterID);
		return(this.subscribeFilterID);
	}

	/** gets and extracts the aggregate configuration from browseNode **/
	/* @param aggregate_template ... node adresse of the aggregate template */
	/* @param aggregate_result ... object of browse node result */
	/* @param callback ... callback function */
	this.extractAggregateConfig = function (aggregate_template, aggregate_result, callback) {
		var Aggregate = "";
		var AggregateKeys = [];
		for (var item in aggregate_result) {
			if (AggregateManager.isValidAggregate(item)) {
				Aggregate = item;
			} else {
				AggregateKeys.push(aggregate_template + "." + item);
			}
		}
		;
		if (Aggregate != "") {
			var AggregateValue = [];
			webMI.data.read(AggregateKeys,
				function (readAggregateConfig) {
					for (var item in readAggregateConfig) {
						AggregateValue[AggregateKeys[item].substring(AggregateKeys[item].lastIndexOf(".") + 1)] = readAggregateConfig[item].value;
					}
					AggregateValue["aggregate"] = Aggregate;
					callback(AggregateValue);
				});
		} else {
			callback(false);
		}
	}


	/** destroy **/
	this.destroy = function () {
		if (this.subscribeID != null) {
			webMI.data.unsubscribe(this.subscribeID);
		}
		if (this.subscribeFilterID != null) {
			webMI.data.unsubscribeFilter(this.subscribeFilterID);
		}
		for (var key in this) {
			this[key] = null;
		}
	}
}

return AggregateManager;
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Open Context Menu":[function(base,webMI,window,document,self){
var StylePresets = { width: parseInt(base.minWidth,10), fontSize:base.fontSize, closeTime: 0, strokeWidth: 2 }; // fontSize and minWidth taken from parameters for backwards compatibility

// Apply style settings from object display element if available
var style = (base.style != undefined) ? base.style : {};

// If pre-set setting
for (var i in StylePresets) {
	if (style[i] == undefined) {
		style[i] = StylePresets[i];
	}
}
var styleSettings = JSON.parse(JSON.stringify(style));
styleSettings.closeOnMouseout = base.closeOnMouseout;

/**
 * Make sure the HTML pop-up has the same width as the SVG drawing
 */
function scaleContextMenu() {
	// Reset hardcoded styleSettings values
	styleSettings.width = parseInt(base.minWidth, 10);

	var matrix = webMI.gfx.getScreenCTM(true);
	var scaleX = matrix["a"];
	var scaleY = matrix["d"];

	var bottomPoint = webMI.gfx.createPoint(base.x,base.y).matrixTransform(matrix);
	var topPoint =  webMI.gfx.createPoint(0,0).matrixTransform(matrix);
	styleSettings.width *= scaleX;
	styleSettings.strokeWidth = parseInt(Math.round(parseInt(style.strokeWidth) * scaleX));
	if (styleSettings.strokeWidth > 0 && styleSettings.strokeWidth < 1) styleSettings.strokeWidth = 1;
	styleSettings.width = styleSettings.width - styleSettings.strokeWidth * 2; // Subtract left and right width of outline to match exact SVG width in total
	styleSettings.fontSize = Math.round(parseInt(style.fontSize) * scaleY);
	if (base.elementHeight)
		styleSettings.elementHight = base.elementHeight;
	else
		styleSettings.elementHight = (bottomPoint.y - topPoint.y);
}

function getFn(val) {
	return function() {
		if (base.trigger != undefined) {
			webMI.trigger.fire(base.trigger, val);
		}
		if (base.outputNode != "") {
			webMI.data.write(base.outputNode, val);
		}
		var p = webMI.gfx.createPoint(base.x,base.y).matrixTransform(webMI.gfx.getScreenCTM(true));
		webMI.display.showPopup(p.x, p.y, null);
	};
}
function closeContextMenu(){
	if (typeof tempObj.style == "undefined") tempObj.style = {};
	tempObj.style.closeOnMouseout = base.closeOnMouseout;
	tempObj.style.clickAreaId = base.id;
	webMI.display.showPopup(0, 0, null);
}
function openContextMenu(){
	scaleContextMenu();
	if (!base.active || base.active()) {
		var p = webMI.gfx.createPoint(base.x,base.y).matrixTransform(webMI.gfx.getScreenCTM(true));
		tempObj.style.closeOnMouseout = base.closeOnMouseout;
		tempObj.style.clickAreaId = base.id;
		if (base.menuObj && typeof base.menuObj == "function"){ //showPopup in callback
			base.menuObj(function(tempObj){
				tempObj.style = styleSettings;
				tempObj.itemsCount = base.itemsCount;
				webMI.display.showPopup(p.x, p.y, tempObj);
			});
		}
		else {
			webMI.display.showPopup(p.x, p.y, tempObj);
		}
	}
}

var tempObj = {};

if (base.menuObj != undefined && typeof base.menuObj == "object") {
	tempObj = base.menuObj;
	tempObj.style = styleSettings;
	tempObj.itemsCount = base.itemsCount;
} else if (base.menuObj != undefined && typeof base.menuObj == "function") {
	//tempObj calculate dynamically in event
	tempObj.style = {};
	tempObj.style.closeOnMouseout = base.closeOnMouseout;
} else {
	tempObj = { style: styleSettings, itemsCount: base.itemsCount };
	var texts = [base.key1, base.key2, base.key3, base.key4, base.key5];
	var textvals = [base.value1, base.value2, base.value3, base.value4, base.value5];
	for (var i=0; i<5; i++) {
		if (texts[i] != undefined && textvals[i] != undefined) {
			tempObj[i] = { text: texts[i], value: getFn(textvals[i]) };
		}
	}
}
if (base.onEvent == "immediately" && base.id != ""){
	openContextMenu();
} else if (base.onEvent == "immediately" && base.id == ""){
	closeContextMenu();
} else {
	webMI.addEvent(base.id, base.onEvent,openContextMenu);
}
webMI.addOnunload(function() {
	closeContextMenu();
	base = null;
	tempObj = null;
	webMI = null;
});
},{"onEvent":"click","itemsCount":"0","fontSize":"12","minWidth":"180","closeOnMouseout":"true"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.Open PopUp Display":[function(base,webMI,window,document,self){
// This Quick Dynamic opens a display as popup depending on one of the events defined by "event".
// Parameters:
//	display:		display which will be opened as popup
//	event:	the event triggering this Quick Dynamic, which is one of the following:
//		click:		mouse click
//		dblclick:	double click of mouse button
//		mousedown:	press down the mouse button
//		mouseup:	release the mouse button
//		muuseover:	move the mouse cursor over the applied graphical element
//		mousemove:	move the mouse anywhere over the applied graphical element
//		mouseout:	move the mouse cursor out of the applied graphical element
//	width:		width of the popup (in pixels)
//	height:		height of the popup (in pixels)
//	moveable:	if true, popup will be moveable
//	resizeable:	if true, popup will be resizeable
//  modal:		if true, popup will be open of type modal, i.e. always in foreground
// addrbase: the node passed as 'base' parameter to the Display

// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************


webMI.addEvent(base.id, base.event, function(e) {

	var screenCTM =	webMI.gfx.getScreenCTM(true);
	var ratio = screenCTM.d;
	
	var width = parseFloat(base.width);
	width = width*ratio;
	
	var height = parseFloat(base.height);
	height = height*ratio;
	
	var moveable = base.moveable==="true";
	var resizeable = base.resizeable==="true";
	var modal = base.modal==="true";
	
	var xpos = e.clientX;
	var ypos = e.clientY;
	
	if(base.position=="center")
	{
		xpos = "";
		ypos = "";
	}
	if(base.position=="pointer top-right")
	{
		xpos = xpos - width;
	}
	if(base.position=="pointer bottom-right")
	{
		xpos = xpos - width;
		ypos = ypos - height;
	}
	if(base.position=="pointer bottom-left")
	{
		ypos = ypos - height;
	}
	
	var passObj = {};
	passObj["base"] = base.addrbase
	
	webMI.display.openWindow({display:base.display,extern:false,width:width,height:height+20,menubar:false,modal:modal,movable:moveable,resizable:resizeable,scrollbars:false,status:false,title:"",toolbar:false,x:xpos,y:ypos,query:passObj});

});
},{"height":"300","width":"150","position":"pointer top-left","moveable":"false","resizeable":"false","modal":"true","event":"click"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.Enable Access Right":[function(base,webMI,window,document,self){
webMI.data.call("get_access_right", {"rights": base.rights}, function(f) {
	var value = f.result;
	if (value)
		webMI.gfx.setVisible(base.id,true);
	//webMI.gfx.setText(base.id, value);
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss HEOS Dashboard":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_heos_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Consistency Handler":[function(base,webMI,window,document,self){
if (typeof this.data === "undefined") {
	this.data = { "groups": {}, "storage": [] };

	webMI.trigger.connect("com.atvise.switchedlanguage", function(e) {
		data.groups = {};
		data.storage = [];
	});
}

var data = this.data;

function register(group, address, update) {
	if (!data.groups[group])
		data.groups[group] = [];

	data.groups[group].push({ "address": address, "update": update });
}

function set(group, address, value) {
	if (data.groups[group]) {
		for (var i = 0; i < data.groups[group].length; i++) {
			if (data.groups[group][i].address == address)
				data.groups[group][i].value = value;
		}
	}
}

function read(group) {
	var addresses = [];
	var entries = [];

	for (var i in data.groups) {
		if (i == group || !group) {
			for (var j = 0; j < data.groups[i].length; j++) {
				addresses.push(data.groups[i][j].address);
				entries.push(data.groups[i][j]);
			}
		}
	}

	webMI.data.read(addresses, function(e) {
		for (var i = 0; i < entries.length; i++) {
			entries[i].value = e[i].value;
			entries[i].update(e[i].value);
		}
	});
}

function write(group) {
	if (data.groups[group]) {
		var addresses = [];
		var values = [];

		for (var i = 0; i < data.groups[group].length; i++) {
			addresses.push(data.groups[group][i].address);
			values.push(data.groups[group][i].value);
		}

		webMI.data.write(addresses, values);
	}
}

function renew() {
	data.groups = {};
	data.storage = [];
}

function push() {
	data.storage.push(data.groups);
}

function pop() {
	data.groups = data.storage.pop();
}

return {
	"register": register,
	"set": set,
	"read": read,
	"write": write,
	"renew": renew,
	"push": push,
	"pop": pop
}
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Set Slider Vertical":[function(base,webMI,window,document,self){
var finger = -1;
var min = parseInt(base.min);
var max = parseInt(base.max);
var curValue;
var baseValue;
var MouseMove = false;
var ResetValue = false;
var h = parseInt(webMI.gfx.getHeight(base.id));
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

function getPosition(event) {
	if (event.changedTouches) {
		if (event.type == "touchstart" && finger == -1) /* on touchstart */
			finger = event.changedTouches[0].identifier;
		else if (finger != event.changedTouches[0].identifier) /* move or touchend */
			return {
				x: -1
			};

		return webMI.gfx.createPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
	} else
		return webMI.gfx.createPoint(event.clientX, event.clientY);
}

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	if (!MouseMove) {
		baseValue = e.value;
		webMI.gfx.setMoveY("slider_pointer", webMI.translate((baseValue), min, max, 0, -h));
	}
}

webMI.addEvent(base.id, ["mousedown", "touchstart"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") mouseDownEvent(e);
});

webMI.addEvent("slider_pointer", ["mousedown", "touchstart"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") mouseDownEvent(e);
});

function mouseDownEvent(e) {
	e.preventDefault();
	var p = getPosition(e);
	if (p.x != -1) {
		MouseMove = true;
		ResetValue = false;
		p = p.matrixTransform(webMI.gfx.getScreenCTM().inverse());
		var stepWidthSlider = (max - min)/webMI.gfx.getHeight(base.id);
		var posSlider = (p.y - webMI.gfx.getY(base.id));
		curValue = max - (posSlider * stepWidthSlider);
	}
}

webMI.addEvent(document, ["mousemove", "touchmove"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") {
		var bcr = base.ele.getBoundingClientRect();
		var p = getPosition(e);
		if (MouseMove && p.x != -1 && p.y >= bcr.top && p.y <= bcr.bottom && p.x >= bcr.left && p.x <= bcr.right) {
			e.preventDefault();
			ResetValue = false;
			p = p.matrixTransform(webMI.gfx.getScreenCTM().inverse());
			var stepWidthSlider = (max - min)/webMI.gfx.getHeight(base.id);
			var posSlider = (p.y - webMI.gfx.getY(base.id));
			// At bottom step round down
			if (posSlider < 1) posSlider = 0;
			// At top step round up
			if (posSlider > webMI.gfx.getHeight(base.id) - 1) posSlider = webMI.gfx.getHeight(base.id);
			curValue = max - (posSlider * stepWidthSlider); 
			webMI.gfx.setMoveY("slider_pointer", webMI.translate((curValue), min, max, 0, -h));
			try {
				webMI.gfx.setScaleY("bar", webMI.translate(curValue, min, max, 0, 1));
			} catch (e) {}
			var formatString = "%0." + base.decimalPositions + "f";
			curValue = webMI.sprintf(formatString, curValue);
			webMI.gfx.setText("slider_value", curValue);
		}
	}
	return false;
});

webMI.addEvent(document, ["mouseup", "touchend"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") {
		var p = getPosition(e);
		if (MouseMove && p.x != -1) {
			e.preventDefault();
			MouseMove = false;
			finger = -1;
			if (ResetValue) {
				webMI.data.write(base.node, baseValue);
			} else {
				var bcr = base.ele.getBoundingClientRect();
				if (p.y >= bcr.bottom) curValue = min;
				if (p.y <= bcr.top) curValue = max;
				webMI.data.write(base.node, curValue);
			}
		}
	}
	return false;
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss KPI Result Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_kpi_result_link", {"node":base.group}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Color by Node":[function(base,webMI,window,document,self){
// This Quick Dynamics changes the color and stroke of the applied graphical element depending whether or not the value of the node is within the defined range.
// Parameters:
//	nodeId:			this node (value within or out of the defined range) triggers this Quick Dynamic
//	minRange:		lower bound of the range where the node's value should lie in
//	maxRange:		upper bound of the range where the node's value should lie in; if not specified it will be set to "minRange", i.e. the quick dynamic will be triggered at a
//					discrete value (minRange=maxRange=value) only and not for a range
//	fillInRange:	this fill color of the graphical element will be set when value of the node is within the defined range
//	strokeInRange:	this stroke color of the graphical element will be set when value of the node is within the defined range
//	fillOutRange:	this fill color of the graphical element will be set when value of the node is out of the defined range
//	strokeOutRange:	this stroke color of the graphical element will be set when value of the node is out of the defined range
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;

	if (String(base.maxRange) == "") {
		var maxRange=base.minRange; // If no maxRange is specified, the color will only be changed at a discrete value (value = minRange = maxRange)
	} else {
		var maxRange = parseFloat(base.maxRange);
	}
	if (value >= base.minRange && value <= maxRange) {
		webMI.gfx.setFill(base.id, base.fillInRange);
		webMI.gfx.setStroke(base.id, base.strokeInRange);
	}
	else {
		webMI.gfx.setFill(base.id, base.fillOutOfRange);
		webMI.gfx.setStroke(base.id, base.strokeOutOfRange);
	}
}

},{"nodeId":"","minRange":"0","maxRange":"","fillInRange":"#00ff00","strokeInRange":"#000000","fillOutOfRange":"#ff0000","strokeOutOfRange":"#000000"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.Open Display on Frame":[function(base,webMI,window,document,self){
// This Quick Dynamic opens a display on an iframe
// Parameters:
//	display:		display which will be opened
//	event:	the event triggering this Quick Dynamic, which is one of the following:
//		click:		mouse click
//		dblclick:	double click of mouse button
//		mousedown:	press down the mouse button
//		mouseup:	release the mouse button
//		muuseover:	move the mouse cursor over the applied graphical element
//		mousemove:	move the mouse anywhere over the applied graphical element
//		mouseout:	move the mouse cursor out of the applied graphical element
// frame: the frame name
// addrbase: the node passed as 'base' parameter to the Display

// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, base.event, function(e) {

	webMI.display.openDisplay(base.display, {base:base.addrbase}, base.frame);

});
},{"event":"click"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Thermodebug Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_thermodebug_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Color by Alarm":[function(base,webMI,window,document,self){
// This Quick Dynamic changes the color and stroke of the applied graphical element depending on the different alarm states.
// Parameters:
//	alarm:						alarm (node) which will trigger this Quick Dynamic
//	alarmOnFill:				color to fill the graphical element in case an alarm occurs
//	alarmOnStroke:				color for the stroke of the graphical element in case an alarm occurs
//	alarmOffFill:				fill color of the graphical element to set it back to the original state when the alarm is off acknowledged
//	alarmOffStroke:				stroke color of the graphical element to set it back to the original state when the alarm is off acknowledged
//	blinkOnUnacknowledged:		flash interval for alarm state "on unacknowledged"
//	blinkOnAcknowledged:		flash interval for alarm state "on acknowledged"
//	blinkOffUnacknowledged:		flash interval for alarm state "off unacknowledged"
//	blinkOnOffUnacknowledged:	flash interval for alarm state "on off unacknowledged"

/*
var alarm = webMI.query["alarm"];
var alarmOnFill = webMI.query["alarmOnFill"];
var alarmOnStroke = webMI.query["alarmOnStroke"];
var alarmOffFill = webMI.query["alarmOffFill"];
var alarmOffStroke = webMI.query["alarmOffStroke"];
var blinkOnUnacknowledged = webMI.query["blinkOnUnacknowledged"];
var blinkOnAcknowledged = webMI.query["blinkOnAcknowledged"];
var blinkOffUnacknowledged = webMI.query["blinkOffUnacknowledged"];
var blinkOnOffUnacknowledged = webMI.query["blinkOnOffUnacknowledged"];
*/


webMI.alarm.subscribe(base.alarm, function(e) {
	var value = e.state;
	var flash250 = {0:base.alarmOnStroke,1:base.alarmOffStroke,2:base.alarmOnStroke,3:base.alarmOffStroke,4:base.alarmOnStroke,5:base.alarmOffStroke,6:base.alarmOnStroke,7:base.alarmOffStroke,8:base.alarmOnStroke,9:base.alarmOffStroke,10:base.alarmOnStroke,11:base.alarmOffStroke};
	var flash500 = {0:base.alarmOnStroke,2:base.alarmOffStroke,4:base.alarmOnStroke,6:base.alarmOffStroke,8:base.alarmOnStroke,10:base.alarmOffStroke};
	var flash750 = {0:base.alarmOnStroke,3:base.alarmOffStroke,6:base.alarmOnStroke,9:base.alarmOffStroke};
	var flash1500 = {0:base.alarmOnStroke,6:base.alarmOffStroke};


	switch (value) {
		case 1 : // blinkOnUnacknowledged
			webMI.gfx.setFill(base.id, base.alarmOnFill);
			switch (base.blinkOnUnacknowledged)
			{
				case "visible": webMI.gfx.setVisible(base.id, null); break;
				case "invisible": webMI.gfx.setVisible(base.id, false); break;
				case "Flash every 250ms" : webMI.gfx.setStroke(base.id, flash250); break;
				case "Flash every 500ms" : webMI.gfx.setStroke(base.id, flash500); break;
				case "Flash every 750ms" : webMI.gfx.setStroke(base.id, flash750); break;
				case "Flash every 1500ms" : webMI.gfx.setStroke(base.id, flash1500); break;
			}
			break;
		case 2 : // blinkOnAcknowledged
			webMI.gfx.setFill(base.id, base.alarmOnFill);
			switch (base.blinkOnAcknowledged)
			{
				case "visible": webMI.gfx.setVisible(base.id, null); break;
				case "invisible": webMI.gfx.setVisible(base.id, false); break;
				case "Flash every 250ms" : webMI.gfx.setStroke(base.id, flash250); break;
				case "Flash every 500ms" : webMI.gfx.setStroke(base.id, flash500); break;
				case "Flash every 750ms" : webMI.gfx.setStroke(base.id, flash750); break;
				case "Flash every 1500ms" : webMI.gfx.setStroke(base.id, flash1500); break;
			}
			break;
		case 3 : // blinkOffUnacknowledged
			webMI.gfx.setFill(base.id, base.alarmOnFill);
			switch (base.blinkOffUnacknowledged)
			{
				case "visible": webMI.gfx.setVisible(base.id, null); break;
				case "invisible": webMI.gfx.setVisible(base.id, false); break;
				case "Flash every 250ms" : webMI.gfx.setStroke(base.id, flash250); break;
				case "Flash every 500ms" : webMI.gfx.setStroke(base.id, flash500); break;
				case "Flash every 750ms" : webMI.gfx.setStroke(base.id, flash750); break;
				case "Flash every 1500ms" : webMI.gfx.setStroke(base.id, flash1500); break;
			}
			break;
		case 5 : // blinkOnOffUnacknowledged
			webMI.gfx.setFill(base.id, base.alarmOnFill);
			switch (base.blinkOnOffUnacknowledged)
			{
				case "visible": webMI.gfx.setVisible(base.id, null); break;
				case "invisible": webMI.gfx.setVisible(base.id, false); break;
				case "Flash every 250ms" : webMI.gfx.setStroke(base.id, flash250); break;
				case "Flash every 500ms" : webMI.gfx.setStroke(base.id, flash500); break;
				case "Flash every 750ms" : webMI.gfx.setStroke(base.id, flash750); break;
				case "Flash every 1500ms" : webMI.gfx.setStroke(base.id, flash1500); break;
			}
			break;
		default: // off acknowledged
			webMI.gfx.setFill(base.id,base.alarmOffFill);
			webMI.gfx.setStroke(base.id,base.alarmOffStroke);
			break;
	}
});
},{"alarm":"","alarmOnFill":"","alarmOnStroke":"","alarmOffFill":"","alarmOffStroke":"","blinkOnUnacknowledged":"Flash every 250ms","blinkOnAcknowledged":"Flash every 500ms","blinkOffUnacknowledged":"Flash every 750ms","blinkOnOffUnacknowledged":"Flash every 1500ms"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Stroke by Node":[function(base,webMI,window,document,self){
// This Quick Dynamic changes the stroke of the applied graphical element depending whether or not the value of the node is within the defined range.
// Parameters:
//	nodeId:					this node (value within or out of the defined range) triggers this Quick Dynamic
//	minRange:				lower bound of the range where the node's value should lie in
//	maxRange:				upper bound of the range where the node's value should lie in; if not specified it will be set to "minRange", i.e. the quick dynamic will be triggered at a
//							discrete value (minRange=maxRange=value) only and not for a range
//	strokeStyleInRange:		this stroke style of the graphical element will be set when the value of the node is within the defined range
//	strokeColorInRange:		this stroke color of the graphical element will be set when the value of the node is within the defined range
//	strokeWidthInRange:		this stroke width of the graphical element will be set when the value of the node is within the defined range
//	strokeOpacityInRange:	this stroke opacity of the graphical element will be set when the value of the node is within the defined range
//	strokeStyleOutRange:	this stroke style of the graphical element will be set when the value of the node is out of the defined range
//	strokeColorOutRange:	this stroke color of the graphical element will be set when the value of the node is out of the defined range
//	strokeWidthOutRange:	this stroke width of the graphical element will be set when the value of the node is out of the defined range
//	strokeOpacityOutRange:	this stroke opacity of the graphical element will be set when the value of the node is out of the defined range
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;

	if (String(base.maxRange) == "") {
		var maxRange=base.minRange; // If no maxRange is specified, the stroke will be changed at any value except at the value that coincides with the value of the minRange. (minRange = maxRange = value)
	} else {
		var maxRange = parseFloat(base.maxRange);
	}
	if (value >= base.minRange && value <= maxRange) {
		webMI.gfx.setStroke(base.id, base.strokeColorInRange);
		webMI.gfx.setStrokeOpacity(base.id, base.strokeOpacityInRange);
		webMI.gfx.setStrokeWidth(base.id, base.strokeWidthInRange);
		webMI.gfx.setStrokeDasharray(base.id, base.strokeStyleInRange);
	}
	else {
		webMI.gfx.setStroke(base.id, base.strokeColorOutRange);
		webMI.gfx.setStrokeOpacity(base.id, base.strokeOpacityOutRange);
		webMI.gfx.setStrokeWidth(base.id, base.strokeWidthOutRange);
		webMI.gfx.setStrokeDasharray(base.id, base.strokeStyleOutRange);
	}
}

},{"minRange":"0","strokeColorInRange":"#00ff00","strokeWidthInRange":"1","strokeOpacityInRange":"1","strokeColorOutRange":"#aa0000","strokeWidthOutRange":"2","strokeOpacityOutRange":"1"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Set Slider Horizontal":[function(base,webMI,window,document,self){
var finger = -1;
var min = parseInt(base.min);
var max = parseInt(base.max);
var curValue;
var baseValue;
var MouseMove = false;
var ResetValue = false;
var h = parseInt(webMI.gfx.getWidth(base.id));
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

function getPosition(event) {
	if (event.changedTouches) {
		if (event.type == "touchstart" && finger == -1) /* on touchstart */
			finger = event.changedTouches[0].identifier;
		else if (finger != event.changedTouches[0].identifier) /* move or touchend */
			return {
				x: -1
			};

		return webMI.gfx.createPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
	} else
		return webMI.gfx.createPoint(event.clientX, event.clientY);
}



AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	if (!MouseMove) {
		baseValue = e.value;
		webMI.gfx.setMoveX("slider_pointer", webMI.translate((baseValue), min, max, 0, h));
	}
}

webMI.addEvent(base.id, ["mousedown", "touchstart"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") mouseDownEvent(e);
});

webMI.addEvent("slider_pointer", ["mousedown", "touchstart"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") mouseDownEvent(e);
});

function mouseDownEvent(e) {
	e.preventDefault();
	var p = getPosition(e);
	if (p.x != -1) {
		MouseMove = true;
		ResetValue = false;
		p = p.matrixTransform(webMI.gfx.getScreenCTM().inverse());
		var stepWidthSlider = (max - min)/webMI.gfx.getWidth(base.id);
		var posSlider = (p.x - webMI.gfx.getX(base.id));
		curValue = min + (posSlider * stepWidthSlider);
	}
}

webMI.addEvent(document, ["mousemove", "touchmove"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") {
		var bcr = base.ele.getBoundingClientRect();
		var p = getPosition(e);
		if (MouseMove && p.x != -1 && p.y >= bcr.top && p.y <= bcr.bottom && p.x >= bcr.left && p.x <= bcr.right) {
			e.preventDefault();
			ResetValue = false;
			p = p.matrixTransform(webMI.gfx.getScreenCTM().inverse());
			var stepWidthSlider = (max - min)/webMI.gfx.getWidth(base.id);
			var posSlider = p.x - webMI.gfx.getX(base.id);
			// At bottom step round down
			if (posSlider < 1) posSlider = 0;
			// At top step round up
			if (posSlider > webMI.gfx.getWidth(base.id) - 1) posSlider = webMI.gfx.getWidth(base.id);
			curValue = min + (posSlider * stepWidthSlider);
			webMI.gfx.setMoveX("slider_pointer", webMI.translate(curValue, min, max, 0, h));
			try {
				webMI.gfx.setScaleX("bar", webMI.translate(curValue, min, max, 0, 1));
			} catch (e) {}
			var formatString = "%0." + base.decimalPositions + "f";
			curValue = webMI.sprintf(formatString, curValue);
			webMI.gfx.setText("slider_value", curValue);
		}
	}
	return false;
});

webMI.addEvent(document, ["mouseup", "touchend"], function(e) {
	if (webMI.gfx.getX("activeIndicator") == "1") {
		var p = getPosition(e);
		if (MouseMove && p.x != -1) {
			e.preventDefault();
			MouseMove = false;
			finger = -1;
			if (ResetValue) {
				webMI.data.write(base.node, baseValue);
			} else {
				webMI.data.write(base.node, curValue);
			}
		}
	}
	return false;
});

},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO_boss Alarms List":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_alarms_link", {"node": ""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Energy Graph Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_energy_graph_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Safe Restore Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_safe_restore_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Display by Node":[function(base,webMI,window,document,self){
// This Quick Dynamic opens a new display if the value of the node defined by "nodeId" lies within the range defined by "minRange" and "maxRange".
// Parameters:
//	nodeId:		node triggering this Quick Dynamic
//	minRange:	lower bound of the range where the node's value should lie in
//	maxRange:	upper bound of the range where the node's value should lie in; if not specified it will be set to "minRange", i.e. the quick dynamic will be triggered at a
//				discrete value (minRange=maxRange=value) only and not for a range
//	Display:	the display which shall be opened
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;

	if (String(base.maxRange) == "") {
		var maxRange=base.minRange; // If no maxRange is specified, the Display will only be opened at a discrete value (value = minRange = maxRange)
	} else {
		var maxRange = parseFloat(base.maxRange);
	}
	if (value >= base.minRange && value <= maxRange) {
		webMI.display.openDisplay(base.display, {});
	}
}

},{"nodeId":"","minRange":"0","maxRange":"","display":""}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO Device HACCP Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_device_haccp_link", {"node": base.device}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Display on Event":[function(base,webMI,window,document,self){
// This Quick Dynamic opens a new display depending on one of the events defined by "onEvent".
// Parameters:
//	display:	display which will be opened
//	onEvent:	the event triggering this Quick Dynamic, which is one of the following:
//		click:		mouse click
//		dblclick:	double click of mouse button
//		mousedown:	press down the mouse button
//		mouseup:	release the mouse button
//		muuseover:	move the mouse cursor over the applied graphical element
//		mousemove:	move the mouse anywhere over the applied graphical element
//		mouseout:	move the mouse cursor out of the applied graphical element

webMI.addEvent(base.id, base.onEvent, function(e) {
	webMI.display.openDisplay(base.display, {});
});
},{"display":"","onEvent":"click"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Report Archive Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_archive_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Usage Balancer Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_usage_balancer_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss HVAC Geolighting Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_geolighting_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss HVAC Night Purge Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_hvac_np_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss HVAC Smart Start Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_hvac_ss_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO_boss Device Main Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
	webMI.data.call("get_device_link", {"node": base.device}, function(f) {
	if(f.result=="noaccess")	
		alert("Access Denied");
	else
		eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Parameter Control Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_param_control_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Technology Switch Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_tech_switch_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO_boss Device Trend Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_device_trends_link", {"node": base.device}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Calendary Category Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_category_link", {"node": base.category}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Dewpoint Broadcast Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_dpbc_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Global Trend Group Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_global_trends_link", {"node":base.group}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO_boss Device Alarms Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_device_alarms_link", {"node": base.device}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Visibility and Blinking":[function(base,webMI,window,document,self){
// This Quick Dynamic changes the visibility (including flashing) of the applied graphical element if the value of the node defined by "nodeId" lies within or out of the range defined
// by "minRange" and "maxRange".
// Parameters:
//	nodeId:					node triggering this Quick Dynamic
//	minRange:				lower bound of the range where the node's value should lie in
//	maxRange:				upper bound of the range where the node's value should lie in; if not specified it will be set to "minRange", i.e. the quick dynamic will be triggered at a
//							discrete value (minRange=maxRange=value) only and not for a range
//	VisibilityBelowRange:	visibility to be set if the node's value is below the defined range; can be "Visible", "Invisible" or one of the specified flash rates
//	VisibilityInRange:		visibility to be set if the node's value is within the defined range; can be "Visible", "Invisible" or one of the specified flash rates
//	VisibilityAboveRange:	visibility to be set if the node's value is above the defined range; can be "Visible", "Invisible" or one of the specified flash rates
var AggregateManager = webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Aggregate Manager");
webMI.addOnunload(function unloadAggregateManager() {
	AggregateManager.destroy();
	AggregateManager = null;
});

AggregateManager.subscribeNodeOrAggregate(base.nodeId, handleResult);

function handleResult(e) {
	var value = e.value;
	var flash250 = {0:true,1:false,2:true,3:false,4:true,5:false,6:true,7:false,8:true,9:false,10:true,11:false};
	var flash500 = {0:true,2:false,4:true,6:false,8:true,10:false};
	var flash750 = {0:true,3:false,6:true,9:false};
	var flash1500 = {0:true,6:false};
	var maxRange = 0;

	if (String(base.maxRange) == "") {
		maxRange=base.minRange; // If no maxRange is specified, the visibility will only be changed at a discrete value (value = minRange = maxRange)
	} else {
		maxRange = parseFloat(base.maxRange);
	}

	if (value < base.minRange && String(base.VisibilityBelowRange) != "") {
		switch (base.VisibilityBelowRange)
		{
			case "Visible" : webMI.gfx.setVisible(base.id, true); break;
			case "Flash every 250ms" : webMI.gfx.setVisible(base.id, flash250); break;
			case "Flash every 500ms" : webMI.gfx.setVisible(base.id, flash500); break;
			case "Flash every 750ms" : webMI.gfx.setVisible(base.id, flash750); break;
			case "Flash every 1500ms" : webMI.gfx.setVisible(base.id, flash1500); break;
			case "Invisible" : webMI.gfx.setVisible(base.id, false); break;
		}
	}
	if (value >= base.minRange && value <= maxRange && String(base.VisibilityInRange) != "") {
		switch (base.VisibilityInRange)
		{
			case "Visible" : webMI.gfx.setVisible(base.id, true); break;
			case "Flash every 250ms" : webMI.gfx.setVisible(base.id, flash250); break;
			case "Flash every 500ms" : webMI.gfx.setVisible(base.id, flash500); break;
			case "Flash every 750ms" : webMI.gfx.setVisible(base.id, flash750); break;
			case "Flash every 1500ms" : webMI.gfx.setVisible(base.id, flash1500); break;
			case "Invisible" : webMI.gfx.setVisible(base.id, false); break;
		}
	}
	if (value > maxRange && String(base.VisibilityAboveRange) != "") {
		switch (base.VisibilityAboveRange)
		{
			case "Visible" : webMI.gfx.setVisible(base.id, true); break;
			case "Flash every 250ms" : webMI.gfx.setVisible(base.id, flash250); break;
			case "Flash every 500ms" : webMI.gfx.setVisible(base.id, flash500); break;
			case "Flash every 750ms" : webMI.gfx.setVisible(base.id, flash750); break;
			case "Flash every 1500ms" : webMI.gfx.setVisible(base.id, flash1500); break;
			case "Invisible" : webMI.gfx.setVisible(base.id, false); break;
		}
	}
}

},{"nodeId":"","minRange":"","maxRange":"","VisibilityBelowRange":"Flash every 500ms","VisibilityInRange":"Visible","VisibilityAboveRange":"Flash every 1500ms"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss HVAC Night Purge Graph Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_hvac_np_graph_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss HVAC Smart Start Graph Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_hvac_ss_graph_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Threshold Notification Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_threshnot_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO_boss Device Parameters Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_device_params_link", {"node": base.device}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Parameter Control History Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_param_control_hist_link", {"node":""}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Floating Suction Racks Detail Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_fs_link", {"node":base.rack_num}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.boss Floating Suction Racks Efficency Page":[function(base,webMI,window,document,self){
// ***** applying style="cursor:pointer" *****
webMI.addEvent(base.id, "mouseover", function(e)
{
	document.getElementById(e.target.id).style.cursor = "pointer";
});
// *******************************************

webMI.addEvent(base.id, "click", function(e)
{
 webMI.data.call("get_fs_eff_link", {"node":base.rack_num}, function(f) {
 if(f.result=="noaccess")	
	alert("Access Denied");
 else
	 eval(f.result);
 });
});
},{}]}};project.quickdynamics=project.extensions;