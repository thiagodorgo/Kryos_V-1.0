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

webMI.data.subscribe(base.nodeId, function(e) {
	var value = e.value;
	if (base.startPositionX != "" && base.stopPositionX != "") {
		webMI.gfx.setMoveX(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startPositionX, base.stopPositionX));
	}
	if (base.startPositionY != "" && base.stopPositionY != "") {
		webMI.gfx.setMoveY(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startPositionY, base.stopPositionY));
	}
});
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
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.index":[function(base,webMI,window,document,self){
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
var hasVML = document.createEventObject;
var isIOSDevice = /(iPod|iPhone|iPad)/.test(navigator.userAgent);

/*
	iOS workaround for all versions >= iOS 6
	possibility to disable longpoll
	possibility to set a polling interval
	Issue-Id: [AT-D-4256]
*/

if (isIOSDevice){
	var iOSVersion = (/OS (\d+)_(\d+)(_\d+)?/).exec(navigator.userAgent);
	if (iOSVersion != null && parseInt(iOSVersion[1], 10) >= 6){
		webMI.setConfig("data.enablelongpoll", false);
		webMI.setConfig("data.publishinterval", 500);
	}
}

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
	e.value(displaysJs, webMI.query.preload=="true", excludePreloaded, includePreloaded, loadingscreen, firstConnect);
});

var popup = null;
var popupmenulist = null;
var audio = null;
var popupvisible = "hidden";
var menuTimer = null;
var lastMenu = null;
var popups = [];
var eleStayOnTop = null;
var greatestZIndex = 0;


var extensionSizeCount = 0;

function incESC() {
	if (extensionsDiv) {
		extensionsDiv.style.height = "100%";
		extensionsDiv.style.width = "100%";
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
function fillCurrentFrame(names,lang){
	firstConnect = {value: true, defaultFrameName: "", defaultUrl: ""};
	var remaining = names.length;
	for (var i=0;i<names.length;i++){
		webMI.trigger.fire("getSource_" + names[i], function(e,currentDisplayWebMI){
			currentFrame[currentFrame.length] = {"name":names[i],"display":decodeURIComponent(e)};
			if (--remaining==0){
				tabHandler.renewGlobal();
				switchLanguage(lang);
			}
		});
	}
}
function checkPopupsTopParent(index){
	var isbodytop = false;
	var elem = popups[index];
	while (elem.parentNode && !isbodytop){
		isbodytop = (elem.parentNode == document.body);
		elem = elem.parentNode;
	}
	if (!isbodytop){
		popups.splice(index,1);
	}
	return isbodytop;
}

function pushPopups(curPopup,onDemand){
	//(replace and remove) or push
	var push_b = true;
	for (var x=0; x<popups.length;x++){
		if (popups[x].id == curPopup.id && popups[x].parentNode == curPopup.parentNode ){
			if (popups[x].style)
				popups[x].style.visibility = "hidden";
			if (onDemand){
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
	/* use contentWindow instead of contentDocument for <IE9 */
	return frame.contentWindow.document;
}

var mouseMoveFunctions = [];
var mouseUpFunctions = [];

webMI.addEvent(document, "mousemove", function(e) {
	if (!e)
		e = window.event;

	for (var i = 0; i < mouseMoveFunctions.length; ++i)
		mouseMoveFunctions[i].mouseMoveFunction(e);
});

webMI.addEvent(document, "mouseup", function(e) {
	for (var i = 0; i < mouseUpFunctions.length; ++i)
		mouseUpFunctions[i].mouseUpFunction(e);
});

function openWindow(features, offsetLeft, offsetTop, clientWidth, clientHeight) {


	function addDefaults(obj, features) {
		for (var i in features)
			if (!(i in obj))
				obj[i] = features[i];
		return obj;
	}

	var styleDefaults = { fill: "#FFFFFF", headerFill: "#000000", headerFontFill: "#FFFFFF", headerFontFamily: "Arial", headerFontSize: 16 };

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
		toolbar: false,
		close_on_esc: true,
		style: styleDefaults
	});

	var ret = null;
	var h = features.height;
	var w = features.width;
	var x = typeof(features.x) == "number" ? features.x : (clientWidth - w) / 2;
	var y = typeof(features.y) == "number" ? features.y : (clientHeight - h) / 2;

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
			features.url = href + "?defaulturl=" + encodeURIComponent(features.url)+"&language="+currentLanguage.value+"&useSVGKeyboard="+webMI.query["useSVGKeyboard"];
		else
			features.url = "";

		x += offsetLeft;
		y += offsetTop;

		if (features.modal && window.showModalDialog) {
			var args = "dialogHeight:"+h+"px;dialogWidth:"+w+"px";

			if (features.position != "default")
				args += ";dialogTop:"+y+"px;dialogLeft:"+x+"px";

			var ids = {"resizable":"resizable","scrollbars":"scroll", "status":"status"};
			for (var i in ids)
				args += ";"+ids[i]+":"+(features[i] ? "yes" : "no");

			window.showModalDialog(features.url, features.name, args);
			return {};
		} else {
			var args = "height="+h+",width="+w;

			if (features.position != "default")
				args += ",top="+y+",left="+x;

			var ids = ["resizable","scrollbars","menubar","status","modal"];
			for (var i in ids)
				args += ","+ids[i]+"="+(features[ids[i]] ? "yes" : "no");

			ret = {
				openedWindow: window.open(features.url, features.name, args),

				getContentDocument: function() {
					var extPopupFrame = this.openedWindow.document.getElementById("mainframe");
					if(extPopupFrame != null)
						return contentDocumentOf(extPopupFrame);
				},

				close: function () {
					return this.openedWindow.close();
				}
			};

			webMI.addEvent(ret.openedWindow, "load", function(e) {
				var doc = ret.openedWindow.document;
				var mainframe = doc.getElementById("mainframe");
				ret.contentDocument = contentDocumentOf(mainframe);
				webMI.addEvent(mainframe, "load", function() {
					if (doc!=null && doc.location.href != "about:blank"){
						tabHandler.registerDisplay(contentDocumentOf(mainframe));
						tabHandler.beforeFirstUse(contentDocumentOf(mainframe),true);
						mainframe.contentWindow.webMI.addOnfocus(function(){
							if (mainframe.contentWindow != null)
								tabHandler.getFocused(contentDocumentOf(mainframe));
						});
						mainframe.contentWindow.webMI.addOnunload(function(){
							if (mainframe.contentWindow != null)
								tabHandler.removeDoc(contentDocumentOf(mainframe));
							webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"removePopup","popup":ret});
						});
					}
				});
			});

			if (navigator.userAgent.indexOf("MSIE 7") != -1) {
				webMI.addEvent(ret, "load", function() {
					ret.resizeTo(w + 13, h + 31);
					ret.resizeTo(w + 12, h + 31);
				});
			}
			tabHandler.blurFocused();
			tabHandler.renew();
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"pushPopup","popup":ret});
		}
	} else {
		var childWindowTopZindex = 1;

		var ret = {};
		var headerheight = 20;

		ret.backgroundDiv = document.createElement("div");
		ret.backgroundDiv.style.position = "absolute";
		ret.backgroundDiv.style.left = 0;
		ret.backgroundDiv.style.top = 0;
		if (features.modal) {
			incESC();
			ret.backgroundDiv.style.zIndex = greatestZIndex;
			ret.backgroundDiv.style.backgroundColor = features.modalbackground;
			ret.backgroundDiv.style.width = mainFrameHandler.element_.clientWidth + "px";
			ret.backgroundDiv.style.height = mainFrameHandler.element_.clientHeight + "px";
			ret.backgroundDiv.style.opacity = 0.5;
			ret.backgroundDiv.style.filter = "alpha(opacity=50)";
			if(features.extern)
				console.warn("External-modal popups are no longer supported, please refer to the documentation.");
		}
		childwindowsDiv.appendChild(ret.backgroundDiv);

		ret.main = document.createElement("div");
		ret.main.style.position = "absolute";
		ret.main.style.border = "1px solid black";
		ret.main.style.zIndex = ++greatestZIndex;
		ret.bgiframe = document.createElement("iframe");
		ret.bgiframe.frameBorder = 0;
		ret.bgiframe.style.position = "absolute";
		ret.bgiframe.style.top = "0px";
		ret.bgiframe.style.left = "0px";
		ret.bgiframe.style.width = "100%";
		ret.bgiframe.style.height = "100%";
		ret.main.appendChild(ret.bgiframe);
		ret.bgdiv = document.createElement("div");
		ret.bgdiv.style.position = "absolute";
		ret.bgdiv.style.top = "0px";
		ret.bgdiv.style.left = "0px";
		ret.bgdiv.style.width = "100%";
		ret.bgdiv.style.height = "100%";
		ret.bgdiv.style.backgroundColor = features.style.fill;
		ret.main.appendChild(ret.bgdiv);
		ret.head = document.createElement("div");
		ret.head.style.position = "absolute";
		ret.head.style.top = 0;
		ret.head.style.left = 0;
		ret.head.style.backgroundColor = features.style.headerFill;
		ret.head.style.height = headerheight+"px";
		ret.main.appendChild(ret.head);
		ret.headtxt = document.createElement("span");
		ret.headtxt.style.position = "absolute";
		ret.headtxt.style.width = "100%";
		ret.headtxt.style.fontSize = features.style.headerFontSize + "px";
		ret.headtxt.style.fontFamily = features.style.headerFontFamily;
		ret.headtxt.style.color = features.style.headerFontFill;
		ret.headtxt.style.backgroundImage = "url(headgd.png)";
		ret.head.appendChild(ret.headtxt);
		ret.title = document.createTextNode("");
		ret.headtxt.appendChild(ret.title);
		ret.closea = document.createElement("a");
		ret.closea.href = "javascript:;";
		ret.main.appendChild(ret.closea);
		ret.closeimg = document.createElement("img");
		ret.closeimg.src = "close.gif";
		ret.closeimg.width = 17;
		ret.closeimg.height = 17;
		ret.closeimg.style.border = "0";
		ret.closeimg.style.position = "absolute";
		ret.closeimg.style.right = "0px";
		ret.closea.appendChild(ret.closeimg);
		ret.content = document.createElement("div");
		ret.content.frameBorder = 0;
		ret.content.style.position = "absolute";
		ret.content.style.top = headerheight+"px";
		ret.content.style.left = 0;
		ret.main.appendChild(ret.content);
		ret.iframe = document.createElement("iframe");
		ret.iframe.frameBorder = 0;
		ret.iframe.style.position = "absolute";
		ret.iframe.style.top = 0;
		ret.iframe.style.left = 0;
		ret.iframe.style.width = "100%";
		ret.iframe.style.height = "100%";
		ret.content.appendChild(ret.iframe);
		ret.foreignObjectDiv = document.createElement("div");
		ret.main.appendChild(ret.foreignObjectDiv);
		childwindowsDiv.appendChild(ret.main);

		function disableDragStart(obj) {
			webMI.addEvent(obj, "dragstart", function(e) {
				if (!e)
					e = window.event;

				if (e.preventDefault)
					e.preventDefault();
			});
		};

		disableDragStart(ret.head);

		ret.resizeTo = function(w, h) {
			ret.main.style.width = w+"px";
			ret.main.style.height = h+"px";
			ret.head.style.width = w+"px";
			ret.content.style.width = w+"px";
			ret.content.style.height = (h-headerheight)+"px";
			if (ret.rs) {
				ret.rs.style.left = (w-5)+"px";
				ret.rs.style.top = (h-5)+"px";
			}
		};

		ret.moveTo = function(l, t) {
			function min(a, b) {
				return a < b ? a : b;
			}

			if (l < 0 ) l = 0;
			if (t < 0 ) t = 0;
//				l = min(l, parseInt(mainframe.style.width) - parseInt(ret.main.style.width) - 2);
//				t = min(t, parseInt(mainframe.style.height) - parseInt(ret.main.style.height) - 2);

			ret.main.style.left = l+"px";
			ret.main.style.top  = t+"px";
		};

		ret.setTitle = function(t) {
			ret.title.data = t;
		};

		ret.setURL = function(u) {
			ret.iframe.src = u;

			webMI.addEvent(ret.iframe, "load", function(e) {
				if (ret.closed)
					return;

				webMI.addEvent(contentDocumentOf(ret.iframe), ["click","keypress","touchstart"], function(e) {
					webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"restartTimer"});
				});
				webMI.addEvent(contentDocumentOf(ret.iframe), "touchstart", function(e) {
					ret.iframe.contentWindow.webMI.display.showPopup(0, 0, null);
				});
				consistencyHandler.read();
			});
		};

		function closeInternalPopup() {
			if (!ret.closed) {
				ret.closed = true;
				if (ret.iframe.contentWindow != null)
					tabHandler.removeDoc(contentDocumentOf(ret.iframe),true);

				ret.iframe.src = "";

				if (features.modal)
					decESC();
				childwindowsDiv.removeChild(ret.backgroundDiv);
				childwindowsDiv.removeChild(ret.main);
				webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"removePopup","popup":ret});
				consistencyHandler.pop();

				for (var i = 0; i < mouseMoveFunctions.length; ++i) {
					if (mouseMoveFunctions[i] != ret)
						continue;

					mouseMoveFunctions.splice(i, 1);
					mouseUpFunctions.splice(i, 1);
					break;
				}
			}
		}

		ret.closed = false;
		ret.close = function() {
			/*
				setTimeout is required as a workaround for iPad Issue [AT-D-3275]
				userAgent: Version/5.1 Mobile/9B176 Safari/7534.48.3
				please retest with newer version if Timeout is still required (browser bug)
			*/
			if (isIOSDevice){
				setTimeout(function() {
					closeInternalPopup();
				}, 500);
			}
			else closeInternalPopup();
		};

		ret.getFrame = function() {
			return ret.iframe;
		};

		ret.getForeignObjectContainer = function() {
			return ret.content;
		};

		ret.getContentDocument = function() {
			try {
				return contentDocumentOf(ret.iframe);
			} catch(ex) {
				return null;
			}
		};
		ret.getContentWindowWebMI = function() {
			try {
				if (ret.iframe.contentWindow.webMI){
					return ret.iframe.contentWindow.webMI;
				}
				return null;
			} catch(ex) {
				return null;
			}
		};

		function setVisibility(value) {
			if (!value){
				greatestZIndex++;
				childWindowTopZindex = greatestZIndex;
				ret.main.style.zIndex = childWindowTopZindex;
			}
			ret.content.style.visibility = value ? "" : "hidden";
		};

		if (features.movable) {
			ret.head.style.cursor = "move";

			webMI.addEvent(ret.head, "mousedown", function(e) {
				if (!e)
					e = window.event;

				if (!features.modal) {
					incESC();
					ret.backgroundDiv.style.width = "100%";
					ret.backgroundDiv.style.height = "100%";
				}

				ret.mouseHandler = { _function: ret.moveTo,
					x: parseInt(ret.main.style.left) - e.clientX,
					y: parseInt(ret.main.style.top) - e.clientY};
				setVisibility();
			});
		}

		if (features.resizable) {
			ret.rs = document.createElement("div");
			ret.rs.style.cursor = "se-resize";
			ret.rs.style.position = "absolute";
			ret.rs.style.width = "5px";
			ret.rs.style.height = "5px";
			ret.main.appendChild(ret.rs);

			disableDragStart(ret.rs);

			webMI.addEvent(ret.rs, "mousedown", function(e) {
				if (!e)
					e = window.event;

				if (!features.modal) {
					incESC();
					ret.backgroundDiv.style.width = "100%";
					ret.backgroundDiv.style.height = "100%";
				}

				ret.mouseHandler = { _function: ret.resizeTo,
					x: parseInt(ret.main.style.width) - e.clientX,
					y: parseInt(ret.main.style.height) - e.clientY};
				setVisibility();
			});
		}

		ret.mouseMoveFunction = function(e) {
			var obj = ret.mouseHandler;

			if (obj != null)
				obj._function(obj.x + e.clientX, obj.y + e.clientY);
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

		webMI.addEvent(ret.closea, "click", function() {
			webMI.display.closeWindow(ret);
		});

		webMI.addEvent(ret.iframe,"load", function(){
			var docAct, webMIAct;
			if (ret.iframe.contentWindow){
				if ((docAct = ret.getContentDocument()) != null){
					if (docAct.location.href != "about:blank"){
						tabHandler.registerDisplay(docAct);
						tabHandler.beforeFirstUse(docAct,true);
						if ((webMIAct = ret.getContentWindowWebMI()) != null){
							webMIAct.addOnfocus(function(){
								tabHandler.getFocused(docAct);
							});
							features.close_on_esc && webMIAct.keys.addCombinationListener(0,27,function(e) {
									if (tabHandler.isFocused(docAct) && tabHandler.getAcceptKeys()){
										webMI.display.closeWindow(ret);
									}
								});

						}
					}
					if (isIOSDevice && docAct.documentElement){
						// MobileSafari sometimes expands the normal size of the iframe
						// to the size of width / height svg attributes. Avoid this by
						// removing the attributes so the document will fit automatically.

						docAct.documentElement.removeAttribute("width");
						docAct.documentElement.removeAttribute("height");
					}
				}
			}
		});
		ret.resizeTo(w,h);
		ret.moveTo(x + offsetLeft,y + offsetTop);
		ret.setTitle(features.title);
		ret.setURL(features.url);

		consistencyHandler.push();
		tabHandler.blurFocused();
		tabHandler.renew(features.modal);
		webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"pushPopup","popup":ret});
	}

	return ret;
}

function switchUser(uData){
	if (webMI.display.isRoot() && "preferredlanguage" in uData && "username" in uData &&
		uData.username != "" && uData.preferredlanguage != "" && uData.preferredlanguage != currentLanguage.value) {
			fillCurrentFrame(tabHandler.getIFrameNames(),uData.preferredlanguage);
	}
}

function showPopup(x, y, menu) {
	var showCount = 10000;

	function getHover(color) {
		return function(e) {
			var element = (e.currentTarget != undefined) ? e.currentTarget : e.srcElement;
			element.style.backgroundColor = color;
		};
	};


	function compareMenu(lastMenu, menu) {
		var same = true;
		if (lastMenu != null) {
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

	if (menu != null && !sameMenu && !menu.mouseout) {
		if ("itemsCount" in menu && Number(menu.itemsCount) != 0) showCount = Number(menu.itemsCount);

		lastMenu = menu;
		popupvisible = "visible";

		var styleDefaults = { maxRows: 10, fontSize: 12, fontFamily: "Arial", fontFill: "#000000", width: 140, fill: "#FFFFFF", stroke: "#000000", strokeWidth: 2, hoverFill: "#EFEFEF", closeTime: 500, zIndex: 100 };
		var style = (menu.style != undefined) ? menu.style : {};
		for (var i in styleDefaults) {
			if (style[i] == undefined) {
				style[i] = styleDefaults[i];
			}
		}

		var padding = 3;
		var fontPix = Math.ceil(style.fontSize * 1.3);

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

		function closePopups() {
			if (menuTimer != null) {
				window.clearTimeout(menuTimer);
			}
			menuTimer = window.setTimeout(function() {
				for (var x in popups) {
					popups[x].style.visibility = "hidden";
				}
			}, style.closeTime);
			lastMenu = null;
		};

		function createEntry(parent, menuElement, menuAction, menuElementFn, level, listPos, onDemand) {
			var li = document.createElement("li");
			li.setAttribute("listPos",listPos);
			if (menuElement == ""){/*empty row*/
				li.innerHTML = "&nbsp;";
				parent.appendChild(li);
				return;
			}
			if (level && level < 0){/*scroller*/
				var img = document.createElement("img");
				img.src = menuElement;img.style.height = fontPix+"px";
				img.style.width ="40px";
				li.appendChild(img);li.style.textAlign = "center";

				li.setDisabled = function(){
					img.style.opacity = 0.4;
					img.style.filter = "alpha(opacity=40)";
				};
				li.setEnabled = function(){
					img.style.opacity = 1;
					img.style.filter = "alpha(opacity=100)";
				};
			} else {
//				var a = document.createElement("a");
//				var i_style = "position: absolute; width: 100%; height: 100%; border: 0; z-index: -1;";
				var a_style = "text-decoration: none; color: #000000; cursor: pointer;white-space: nowrap;";
				if (hasVML) {
					li.style.setAttribute("cssText", a_style);
				} else {
					li.setAttribute("style", a_style);
				}
//				a.appendChild(document.createTextNode(menuElement));
//				a.href = "javascript:void(0);";
				li.style.color = style.fontFill;
				li.style.lineHeight = (fontPix+padding)+"px";
//				li.appendChild(a);
				li.appendChild(document.createTextNode(menuElement));
				if (!onDemand) /*wegen onDemand and iPad onmouseover*/
					webMI.addEvent(li, "click", closePopups);
				webMI.addEvent(li, "mouseover", getHover(style.hoverFill));
				webMI.addEvent(li, "mouseout", getHover(style.fill));
			}
			parent.appendChild(li);
			for (var i = 0; i < menuAction.length; ++i) {
				webMI.addEvent(li, menuAction[i], menuElementFn[i]);
			}
		};
		function closeAndOpenPopup(parent,level,i,listPos){
			for (var p in popups) {
				var parts = popups[p].id.split("_");
				if (parts[1] != undefined) {
					var lev = parseFloat(parts[1]);
					if (i && popups[p].id == "popup_"+level+"_"+i && popups[p].parentNode == parent){
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
			var p_style = "position: absolute; visibility: hidden; width: 160px; background-color: #FFFFFF; border: 2px solid #000; padding: 0; margin: 0";
			var curMenulist = (parent) ? document.createElement("UL") : popupmenulist;
			var pm_style = "list-style: none; margin: 0; padding: 3px; margin-left: 5px";

			if (hasVML) {
				curPopup.style.setAttribute("cssText", p_style);
				curMenulist.style.setAttribute("cssText", pm_style);
			} else {
				curPopup.setAttribute("style", p_style);
				curMenulist.setAttribute("style", pm_style);
			}

			var entries = 0;
			var showMenu = 0;

			function showNext(list,step){
				function deltaPos(e){return (e>=0)?1:0;}
				function appendOrRemoveSpacer(showMenu,entries,append){
					var nB;
					if (showMenu <= entries) return;
					list.removeChild(nB = list.lastChild);
					if (append)
						for (var i=0;i<showMenu-entries;i++) createEntry(list,"");
					else
						for (var i=0;i<showMenu-entries;i++) list.removeChild(list.lastChild);
					list.appendChild(nB);
				}
				return function(e) {
					var dP;
					if ((dP=deltaPos(step))==1 && showMenu >= entries || dP==0 && showMenu <= showCount) return;
					if (showMenu > 0) list.firstChild.setEnabled();
					if (showMenu >= entries) list.lastChild.setEnabled();
					appendOrRemoveSpacer(showMenu,entries,false);
					if (dP==1) showMenu += step;
					var lb,corr=((lb = showMenu-showCount+(deltaPos(-step)*step))<0)?Math.abs(lb):0;
					for (var i=1;i<list.childNodes.length-1;i++){
						list.childNodes[i].style.display = ((i-1)>=(lb+corr) && (i-1)<lb+showCount+corr)?"block":"none";
						list.childNodes[i].setAttribute("listPos",i-lb+corr+1);
					}
					if (dP==0) showMenu += step;
					appendOrRemoveSpacer(showMenu,entries,true);
					if (showMenu >= entries) list.lastChild.setDisabled();
					if (showMenu <= showCount) list.firstChild.setDisabled();
				};
			};

			createEntry(curMenulist, "/prev.png",["click"],[showNext(curMenulist,-showCount)],-1);
			for (var i in menu) {
				if (i == "tooltip") {
					var li = document.createElement("li");
					li.style.whiteSpace = "nowrap";
					li.innerHTML = menu.text;
					//li.appendChild(document.createTextNode(menu.text));
					curMenulist.appendChild(li);
					entries++;
					break;
				} else if (i == "languagemenu") {
					function getFn(id) {
						return function() {
							fillCurrentFrame(tabHandler.getIFrameNames(),id);
						};
					};
					for (var id in project.languages) {
						createEntry(curMenulist, project.languages[id], ["click"], [getFn(id)], level, entries+1);
						entries++;
					}
					break;
				} else if (i != "style" && i != "itemsCount") {
					if (menu[i].sub == undefined) {
						function getChangeFn(i, level) {
							return function(e) { closeAndOpenPopup(curPopup,level+1); };
						};
						createEntry(curMenulist, menu[i].text, ["mouseover","click"], [getChangeFn(i,level),menu[i].value], level, entries+1);
						entries++;
				} else if (typeof menu[i].sub == "function") {
						var subLevel = level + 1;
						function getOpenFn1(i,fn,startAdress,level,offset,onclick){
							var clickAdded = false;
							return function(e) {
								var li = (e.currentTarget)?e.currentTarget:e.srcElement;
								var listPos = Number(li.getAttribute("listPos")||"0");
								fn(startAdress,function(tmpObj){
									var subMenu = createMenu(tmpObj, curPopup, offset, i, level,true);
									closeAndOpenPopup(curPopup,level,i,listPos);
									/*wegen onDemand and iPad onmouseover*/
									if (!clickAdded){
										webMI.addEvent(li, "click", closePopups);
										webMI.addEvent(li, "click", onclick);
										clickAdded = true;
									}
								});
							};
						};
						createEntry(curMenulist, i + " >", ["mouseover"], [getOpenFn1(i,menu[i].sub,menu[i].base,subLevel,entries,menu[i].value)], level, entries+1, true);
						entries++;
					} else {
						var subLevel = level + 1;
						var subMenu = createMenu(menu[i].sub, curPopup, entries, i, subLevel);
						function getOpenFn2(i, level) {
							return function(e) {
								var li = (e.currentTarget)?e.currentTarget:e.srcElement;
								var listPos = Number(li.getAttribute("listPos")||"0");
								closeAndOpenPopup(curPopup,level,i,listPos);
							};
						};
						createEntry(curMenulist, i + " >", ["mouseover", "click"], [getOpenFn2(i, subLevel), menu[i].value], level, entries+1);
						entries++;
					}
				}
			}
			createEntry(curMenulist, "/next.png",["click"],[showNext(curMenulist,showCount)],-1);

			if (entries > 0) {
				var height;
				if (entries <= showCount)
					height = ((fontPix+padding) * entries) + 6;
				else
					height = ((fontPix+padding) * (showCount+2)) + 6;
				curPopup.id = "popup_" + level + "_" + name;
				curPopup.appendChild(curMenulist);
				var top = 0;
				var left = 0;
				var innerWidth = webMI.display.isRoot() ? parseFloat(mainFrameHandler.width_) : parseFloat(window.innerWidth);
				var startLeft = 0;
				if (webMI.display.isRoot()) {
					startLeft = ((x + mainFrameHandler.offsetLeft()+style.width) >= innerWidth) ?  innerWidth - (style.width+50) : x + mainFrameHandler.offsetLeft();
				} else {
					//alert(x + " " + style.width + " " + innerWidth);
					startLeft = x + style.width >= innerWidth ? innerWidth - (style.width+50) : x;
				}
				if (parent) {
					top = (fontPix+padding) * (offset);
					/*no window scrolling horizontally*/
					var dir = 1;
					for (var lev=0;lev<level;lev++){
						startLeft += (style.width*dir)
						if (startLeft>mainFrameHandler.width_-10){
							dir = -1;startLeft -= 2*style.width;
						}
						if (startLeft-style.width<0){
							dir = 1;startLeft += 2*style.width;
						}
					}
					left = dir*style.width;
					curPopup.style.top  = -mainFrameHandler.height_ + "px";
				} else {

					var innerHeight = webMI.display.isRoot() ? parseFloat(mainFrameHandler.height_) : parseFloat(window.innerHeight);
					if (webMI.display.isRoot()) {
						top = ((y + mainFrameHandler.offsetTop()+height) >= (innerHeight-5)) ? innerHeight - ((height)+50) : y + mainFrameHandler.offsetTop();
					} else {
						top = (y + height) >= (innerHeight-5) ? innerHeight - ((height)+50) : y;
					}
					left = startLeft;
					curPopup.style.top  = top + "px";
				}
				var onlyOnce = false;
				curPopup.topCorrection = function(listPos){
					/*if is scrollable DIV then topCorrection need once*/
					if (entries <= showCount && onlyOnce) return;
					/*mouseover && scrollable -> calculate pos*/
					top = (listPos!=0)?(fontPix+padding) * (listPos-1):top;
					/*no window scrolling  vertically part*/
					curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
					if (curPopup.totalOffset + height > (mainFrameHandler.height_ - 10)) {
						top = top - (curPopup.totalOffset + height - mainFrameHandler.height_) - 30;
						curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
						if (curPopup.totalOffset < 0) {
							top = top - curPopup.totalOffset;
							curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
						}
					}
					onlyOnce = true;
					curPopup.style.top  = top + "px";
				};
				curPopup.style.left = left + "px";
				if (typeof style.width == "string" && style.width=="auto"){
					curPopup.style.width = "auto";
				} else if (typeof style.width == "object" && style.width.length == 2 && style.width[0]=="auto"){
					curPopup.style.width = style.width[0];
					if (curPopup.clientWidth < style.width[1]){
						curPopup.style.width = (style.width[1]) + "px";
					}
				} else if (typeof style.width == "number"){
					curPopup.style.width = (style.width) + "px";
				}
				//curPopup.style.width = (style.width) + "px";
				curPopup.style.fontSize = style.fontSize + "pt";
				curPopup.style.fontFamily = style.fontFamily;
				curPopup.style.backgroundColor = style.fill;
				curPopup.style.border = style.strokeWidth + "px solid " + style.stroke;
				curPopup.style.visibility = (parent) ? "hidden" : "visible";
				curPopup.style.zIndex = Math.max(style.zIndex,greatestZIndex);
				if (parent) {
					parent.appendChild(curPopup);
				}
				pushPopups(curPopup,onD);
				webMI.addEvent(curPopup, "mouseout", closePopups);
				webMI.addEvent(curPopup, "mouseover", function(e) {
					if (menuTimer != null) {
						window.clearTimeout(menuTimer);
					}
				});
				if (curPopup.style.width == "auto"){
					var corLeft;
					if (webMI.display.isRoot()) {
						corLeft = ((x + mainFrameHandler.offsetLeft()+curPopup.offsetWidth) >= innerWidth) ?  innerWidth - (curPopup.offsetWidth+50) : x + mainFrameHandler.offsetLeft();
					} else {
						corLeft = x + curPopup.offsetWidth >= innerWidth ? innerWidth - (curPopup.offsetWidth+50) : x;
					}
					curPopup.style.left = corLeft + "px";
				}
				/*First use Scroller*/
				if (entries <= showCount){
					curMenulist.removeChild(curMenulist.firstChild);
					curMenulist.removeChild(curMenulist.lastChild);
				}
				else {
					showNext(curMenulist,showCount).call();
				}
			} else {
				popupvisible = "hidden";
			}
			return curPopup;
		};
		createMenu(menu, null, null, "main", 1);
		for (var p=popups.length; p>0;p--){
			checkPopupsTopParent(p-1);
		}
	} else if (menu == null || sameMenu || !menu.mouseout) {
		popupvisible = "hidden";
		lastMenu = null;
	}

	popup.style.visibility = popupvisible;

}
function setSoundHandler(){
	loopTimeout = {};
	if (audio != undefined) {
		while (audio.hasChildNodes()) {
			audio.removeChild(audio.lastChild);
		}
	}

	function iterArray(arr,fn){
		for (var i=0; i<arr.length; i++) fn(arr[i],i);
	};
	function iterObject(arr,fn){
		for (var obj in arr) fn(arr[obj],obj);
	};
	function createElementWithAttrs(nodeName,attrs){
		var elem = webMI.dom.createElement("http://www.w3.org/1999/xhtml", nodeName);
		iterObject(attrs,function(val,key){
			elem.setAttribute(key,val);
		});
		return elem;
	};
	function play(myAudio,playcount,loop,URL){
		if (loop == 0 || playcount < loop){
			if(!myAudio.ended){
				loopTimeout[URL||myAudio.src] = window.setTimeout(function(){play(myAudio,playcount,loop)},1500);
			}
			else {
				myAudio.play();
				loopTimeout[URL||myAudio.src] = window.setTimeout(function(){play(myAudio,playcount+1,loop)},500);
			}
		}
	};
	function stop(myAudio,URL){
		myAudio.pause();
		clearTimeout(loopTimeout[URL||myAudio.src]);
	};
	audio.appendObject = function(src,loop){
		var object = null;
		if (/MSIE/.test(navigator.userAgent)){
			object = createElementWithAttrs("object",{'width':'0','height':'0','classid':"clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6"});
			audio.appendChild(object);
			object.URL=src;
			if (loop == 0){
				var intervalId = setInterval(function(){object.controls.play();},1000);
				object.setAttribute('intervalId',intervalId,0);
			}
			else {
				object.settings.playCount = loop;
				object.controls.play();
			}
		} else if (/iPad/.test(navigator.userAgent)) {
		} else {
			var audioTagSupport = !!(document.createElement('audio').canPlayType);
			if (audioTagSupport){
				var myAudio = createElementWithAttrs("audio",{'style':'display:none',controls:"true",autoplay:"true"});
				var canPlayWav = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/wav; codecs="1"');
			}
			if (audioTagSupport && canPlayWav && src.indexOf(".wav") != -1){
				myAudio.src = src;
				audio.appendChild(myAudio);
				play(myAudio,1,loop);
			}
			else {
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
	audio.appendEmbed = function(src,loop){
		var embed = null;
		if (loop == 0){
			embed = createElementWithAttrs("embed",{'src':src,'hidden':'true','loop':'true'});
		}
		else {
			embed = createElementWithAttrs("embed",{'src':src,'hidden':'true','playcount':loop});
		}
		audio.appendChild(embed);
		return embed;
	};
	audio.removeAudio = function(url){
		if (url == "undefined") {
			iterArray(audio.childNodes,function(child){
				if (/MSIE/.test(navigator.userAgent))
					clearInterval(child.getAttribute("intervalId"));
				if (child.nodeName.toLowerCase() == "audio")
					stop(child);
				audio.removeChild(child);
			});
			iterObject(loopTimeout,function(obj){clearTimeout(obj);})
		}
		else {
			var obs = [];
			iterArray(audio.childNodes,function(child){
				if (child.nodeName.toLowerCase() == "object") {
					if (/MSIE/.test(navigator.userAgent)){
						if (RegExp(url+"$").test(child.URL)){
							obs[obs.length] = child;
						}
					}
					iterArray(child.childNodes,function(subchild){
						if ( subchild.nodeName.toLowerCase() == "param" && subchild.getAttribute("value") == url ){
							obs[obs.length] = child;
						}
					});
				}
				if ((child.nodeName.toLowerCase()=="embed" && child.getAttribute("src") == url )||
					(child.nodeName.toLowerCase()=="audio" && RegExp(url+"$").test(child.src) ) ){
					obs[obs.length] = child;
				}
			});
			if (obs.length > 0){
				iterArray(obs,function(ob){
					if (/MSIE/.test(navigator.userAgent))
						window.clearInterval(ob.getAttribute("intervalId"));
					if (ob.nodeName.toLowerCase() == "audio")
						stop(ob);
					audio.removeChild(ob);
				});
			}
		}
	};
	webMI.sound.setHandler(audio.appendObject,audio.removeAudio);
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
			popupmenulist = popup.appendChild(document.createElement("ul"));
			audio = extensionsDiv.appendChild(document.createElement("div"));
			setSoundHandler();
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
	if (type == "loadedmainframe"){
		if (webMI.display.isRoot()) {
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Alarmmanagement", {"id": ""});
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoReconnect", {"activated":"true", "interval":"5", "defaultconfiguration": true});
		}
		webMI.addEvent(contentDocumentOf(v1), ["click","keypress","touchstart"], function(e) {
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"restartTimer"});
		});
		webMI.addEvent(contentDocumentOf(v1), "touchstart", function(e) {
			v1.contentWindow.webMI.display.showPopup(0, 0, null);
		});

		if("scrolling" in webMI.query)
			v1.scrolling = webMI.query["scrolling"];

		if (typeof v1.contentWindow.webMI == "undefined"){
			webMI.query.preload = false;
		}
		if (currentFrame.length > 0){
			for (var i=0;i<currentFrame.length;i++){
				webMI.display.openDisplay(currentFrame[i].display.replace(displaysJs["postfix"],""), webMI.query, currentFrame[i].name);
			}
		}
	}
	else if (type == "switchedlanguage") {
		currentLanguage.value = v1;
	}
};
},{}],
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

webMI.data.subscribe(base.nodeId, function(e) {
	var value = e.value;

	if (base.startScaleX != "" && base.stopScaleX != "") {
		webMI.gfx.setScaleX(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startScaleX / 100, base.stopScaleX / 100));
	}
	if (base.startScaleY != "" && base.stopScaleY != "") {
		webMI.gfx.setScaleY(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startScaleY / 100, base.stopScaleY / 100));
	}
});
},{"nodeId":"","minValue":"0","maxValue":"100","startScaleX":"","stopScaleX":"","startScaleY":"0","stopScaleY":"1"}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Table":[function(base,webMI,window,document,self){
/*
 atvise table widget http://www.atvise.com/

 Copyright (C) 2008-2010 Certec EDV GmbH. All Rights Reserved.
 $Rev: 4122 $

 WARNING: This software program is protected by copyright law
 and international treaties. Unauthorized reproduction or
 distribution of this program, or any portion of it, may result
 in severe civil and criminal penalties, and will be prosecuted
 to the maximum extent possible under the law

 May only be used with explicit written authorization by Certec
*/

/**
 * The AtviseTable Class.
 * @class
 * @param {Object} tableElement An SVG Group element.
*/
function AtviseTable(tableElement) {
	var hasVML = !(document.implementation && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
	var hasSVG = (document.implementation && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));

	if (tableElement != undefined && typeof tableElement == "object" && (hasVML || hasSVG)) {
		this.tableElement = tableElement;
		this.tableElement.dataProvider =		null;
		this.tableElement.headerRects =			[];
		this.tableElement.headerTexts =			[];
		this.tableElement.headerObjects =		[];
		this.tableElement.maskingFunctions =	[];
		this.tableElement.headersOutside =		0;
		this.tableElement.firstHeaderOutside =	-1;
		this.tableElement.cellRects =			[];
		this.tableElement.cellTexts =			[];
		this.tableElement.cellTextContents =	[];
		this.tableElement.sortingArrow =		null;
		this.tableElement.scrollRowOffset =		0;
		this.tableElement.scrollColOffset =		0;
		this.tableElement.selectedRow =			-1;
		this.tableElement.selectedColumn =		-1;
		this.configuration =					{};
		this.scrollbar =						{};
		this.statusbar =						{};
		this.style =							{};
		this.styleEven =						{};
		this.styleOdd =							{};
		this.hasVML =							hasVML;
		this.hasSVG =							hasSVG;
		this.isMobile =							false; //(navigator.userAgent && /iPad|iPhone|Opera Mobi/.test(navigator.userAgent));
	}
}

/*  ***********************************************************
	********** atvise table widget PUBLIC FUNCTIONS **********
	*********************************************************** */

/**
 * Adds a column to the AtviseTable.
 * @param {Number} [position] Position of the column.
*/
AtviseTable.prototype.addColumn = function(position) {
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var style = this.style;
	var column = (position!=undefined)?position:(configuration.columnCount+1);
	column--; // array starts with 0, user types in +1
	var createRows = (arguments[1]!=undefined)?arguments[1]:true;
	var textOffsetY = configuration.rowHeight - ((configuration.rowHeight/2)-(style.fontSize/2)) - 2;

	var startY;
	if(column==0)startY=0;
	else startY=parseInt(webMI.gfx.getY(tableElement.headerRects[column-1]));

	var startX;
	if(column==0)startX=0; //configuration.tableWidth;
	else startX=parseInt(webMI.gfx.getX(tableElement.headerRects[column-1]))+parseInt(webMI.gfx.getWidth(tableElement.headerRects[column-1]));

	//creates header cell&text
	if (tableElement.headerObjects[column]!=undefined) {
		this._setProperties(tableElement.headerObjects[column],style.header);
	}
	var name = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].name)?tableElement.headerObjects[column].name:"";
	var width = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].width)?tableElement.headerObjects[column].width:style.header.width;
	var fill = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].fill)?tableElement.headerObjects[column].fill:style.header.fill;
	var fontFamily = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].fontFamily)?tableElement.headerObjects[column].fontFamily:style.header.fontFamily;
	var fontSize = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].fontSize)?tableElement.headerObjects[column].fontSize:style.header.fontSize;
	var fontColor = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].fontColor)?tableElement.headerObjects[column].fontColor:style.header.fontColor;
	var stroke = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].stroke)?tableElement.headerObjects[column].stroke:style.stroke;
	var strokeWidth = (tableElement.headerObjects[column]!=undefined && tableElement.headerObjects[column].strokeWidth)?tableElement.headerObjects[column].strokeWidth:style.strokeWidth;
	var headerRect = webMI.gfx.addRect({width:width,height:configuration.rowHeight,x:startX,y:startY,fill:fill,stroke:stroke,strokeWidth:strokeWidth}, tableElement);
	headerRect.column = column;
	headerRect.originalColor = fill;
	headerRect.setAttribute("atv:table-header-rect","true");
	var headerText = null;
	if (this.hasVML) {
		headerText = webMI.gfx.addText({x:startX+style.textOffsetX,y:startY+textOffsetY,fontFamily:fontFamily,fill:fontColor,fontSize:fontSize,text:name},tableElement);
	} else {
		headerText = webMI.gfx.addText({x:startX+width/2,y:startY+textOffsetY,fontFamily:fontFamily,fill:fontColor,fontSize:fontSize,text:name,textAnchor:"middle"},tableElement);
	}
	headerText.setAttribute("atv:table-header-text","true");

	// if there already exists an element at the position insert the new elements before it
	var overwrite = (tableElement.headerRects[column] == undefined);
	tableElement.headerRects = this._arrayInsertElement(tableElement.headerRects, column, headerRect, overwrite);
	tableElement.headerTexts = this._arrayInsertElement(tableElement.headerTexts, column, headerText, overwrite);
	// creates content cells
	if(configuration.rowCount==0) {
		configuration.tableHeight=configuration.rowHeight;
	} else if(createRows) {
		var y=startY+configuration.rowHeight;
		var x=startX;
		//draws as many cells as there are rows
		for (var row=0; row<configuration.rowCount; row++){
			// sets color for odd and even rows
			var cellStyle = this._cellStyle((row%2==0));
			this._createCell(column,row,x,y,cellStyle,false);
			y+=configuration.rowHeight;
			if(column==0) {
				configuration.tableHeight+=configuration.rowHeight;
			}
		}
	}
	configuration.columnCount++;
	configuration.tableWidth= (parseFloat(configuration.tableWidth)) + parseFloat(style.header.width);	//updates tableWidth
	this._calcHeadersOutside();
	this._drawScrollBars();
};
/**
 * Adds a row at the end of the table.
 * @param {Boolean} updateTable Indicates if the table shall be updated after the row was added.
*/
AtviseTable.prototype.addRow = function(updateTable){
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var style = this.style;
	updateTable = (updateTable != undefined) ? updateTable : true;
	if(configuration.columnCount>0) {
		// only add a row if it doesnt exceed the display size
		var calculatedDisplayHeight = (configuration.displayHeight-this.statusbar.height);
		if (this.scrollbar.barBottom!=undefined) {
			calculatedDisplayHeight-=this.configuration.scrollbarSize;
		}
		if (configuration.tableHeight + configuration.rowHeight < calculatedDisplayHeight) {
			var x=parseInt(webMI.gfx.getX(tableElement.headerRects[0]));
			var y;

			if(configuration.rowCount==0)y=configuration.rowHeight;
			else y=parseInt(webMI.gfx.getY(tableElement.cellRects[0][configuration.rowCount-1]))+configuration.rowHeight;
			var cellStyle = this._cellStyle((configuration.rowCount%2 == 0));
			//creates as many cells as there are columns
			for (var col=0;col<configuration.columnCount;col++){
				this._createCell(col,configuration.rowCount,x,y,cellStyle,false);
				x+=parseFloat(tableElement.headerObjects[col].width);
			}
			configuration.tableHeight+=configuration.rowHeight;
			configuration.rowCount++;
		}
	}
	if (updateTable) {
		this._setDataExtract();
	}
};
/**
 * Returns the current configuration Object of the table.
 * @type {Object} configurationObject
*/
AtviseTable.prototype.configuration = function() {
	return this.configuration;
};
/**
 * Returns the current headers and filtered data array of the table in CSV format.
 * @type {String} headersAndDataAsCSV
*/
AtviseTable.prototype.dataExportCSV = function(separator) {
	var csv = "";
	var separator = separator ? separator : ",";

	//header export
	if(this.tableElement.headerObjects.length > 0) {
		for(var i in this.tableElement.headerObjects) {
			if(this.tableElement.headerObjects[i].name.toString().search(separator) > -1)
				csv += "\"" + this.tableElement.headerObjects[i].name.toString().replace(/\"/, "\"\"") + "\"" + separator;
			else
				csv += this.tableElement.headerObjects[i].name.toString() + separator;
		}
		csv = csv.substr(0, csv.lastIndexOf(separator)) + "\n";
	}

	//data export
	var data = this.dataProvider().dataArray;

	if(this.dataProvider().dataFiltered.length > 0)
		data = this.dataProvider().dataFiltered;

	if(data.length > 0) {
		for(row in data) {
			for(column in data[row]) {
				if(data[row][column].text != undefined) {
					var maskedElement = (typeof this.tableElement.maskingFunctions[column] === "undefined") ?
						data[row][column].text.toString() :
						this.tableElement.maskingFunctions[column]( data[row][column].text.toString() );
					if(maskedElement.search(separator) > - 1)
						csv += "\"" + maskedElement.replace(/\"/, "\"\"") + "\"" + separator;
					else
						csv += maskedElement + separator;
				}
			}
			csv = csv.substr(0, csv.lastIndexOf(separator)) + "\n";
		}
	}
	return csv;
};
/**
 * Returns the data provider of the table.
 * @type {Object} dataProvider AtviseDataProvider
*/
AtviseTable.prototype.dataProvider = function() {
	return this.tableElement.dataProvider;
};
/**
 * Returns all header objects of the table.
 * @type {Array} headerObjects
*/
AtviseTable.prototype.headers = function() {
	return this.tableElement.headerObjects;
};
/**
 * Removes all columns of the table.
 * @param {Boolean} deleteCells Indicates if only the headers should be deleted or all content cells too.
*/
AtviseTable.prototype.removeAllColumns = function(deleteCells){
	var j=this.configuration.columnCount;
	for(var i=j;i>=1;i--){
		this.removeColumn(i,deleteCells,false,false);
	}
	// if there are no more columns, there can't exist more rows
	this.configuration.rowCount = 0;
	this.configuration.tableHeight = 0;
};
/**
 * Removes a column from the table.
 * @param {Number} colNr Column index.
 * @param {Boolean} deleteCells Indicates if only the header should be deleted or all content cells too.
 * @param {Boolean} deleteHeader Indicates if the headerObject should be deleted too, or only the rectangle and text element.
 * @param {Boolean} deleteData Indicates if the data at the column should be deleted too.
*/
AtviseTable.prototype.removeColumn = function(colNr, deleteCells, deleteHeader, deleteData) {
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var col = (colNr>0)?colNr-1:0;	// array starts with 0...
	deleteCells = (deleteCells == undefined) ? false : deleteCells;
	deleteHeader = (deleteHeader == undefined) ? false : deleteHeader;
	deleteData = (deleteData == undefined) ? false : deleteData;

	if (col<configuration.columnCount && col>-1) {
		// rearrange all cells following the column position
		if (deleteCells) {
			for (var row=(configuration.rowCount-1); row>-1; row--) {
				for (var i=(configuration.columnCount-1); i>col; i--) {
					if (tableElement.cellRects[i-1][row]) {
						var preX = parseFloat(webMI.gfx.getX(tableElement.cellRects[i-1][row]));
						webMI.gfx.setX(tableElement.cellRects[i][row],preX);
						webMI.gfx.setX(tableElement.cellTexts[i][row],preX + this.style.textOffsetX);
					}
				}
				tableElement.removeChild(tableElement.cellRects[col][row]);
				tableElement.removeChild(tableElement.cellTexts[col][row]);
			}
			tableElement.cellRects.splice(col,1);
			tableElement.cellTexts.splice(col,1);
			tableElement.cellTextContents.splice(col,1);

			// rearrange all headers following the column position
			for (var i=(tableElement.headerRects.length-1); i>col; i--) {
				if (tableElement.headerRects[i-1]) {
					var preX = parseFloat(webMI.gfx.getX(tableElement.headerRects[i-1]));
					webMI.gfx.setX(tableElement.headerRects[i],preX);
					webMI.gfx.setX(tableElement.headerTexts[i],preX+(parseFloat(webMI.gfx.getWidth(tableElement.headerRects[i])/2)));
				}
			}
		}
		configuration.tableWidth-=parseFloat(webMI.gfx.getWidth(tableElement.headerRects[col]));
		tableElement.removeChild(tableElement.headerRects[col]);
		tableElement.removeChild(tableElement.headerTexts[col]);
		tableElement.headerRects.splice(col,1);
		tableElement.headerTexts.splice(col,1);
		configuration.columnCount--;

		if(deleteData) {
			this.dataProvider().removeColumn(colNr);
		}
		if(deleteHeader) {
			tableElement.headerObjects.splice(col,1);
		}
	}
	this._calcHeadersOutside();
	// only set the table data if cells have been removed
	if (deleteCells && deleteData) {
		this._setDataExtract();
	}
};
/**
 * Removes all rows from the table.
*/
AtviseTable.prototype.removeAllRows = function(deleteData, updateTable) {
	var deleteData = (deleteData == undefined) ? false : deleteData;
	updateTable = (updateTable == undefined) ? false : updateTable;
	var j=this.configuration.rowCount;
	for(var i=j;i>=1;i--){
		this.removeRow(i,deleteData,false);
	}
	if (updateTable) {
		this._setDataExtract();
	}
};
/**
 * Removes a row from the table.
 * @param {Number} rowNr Row index.
 * @param {Boolean} deleteData Indicates if the data at the row should be deleted too.
 * @param {Boolean} [updateTable] Indicates if the table should be updated after removing the row.
*/
AtviseTable.prototype.removeRow = function(rowNr,deleteData,updateTable) {
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var updateTable = (updateTable != undefined) ? updateTable : true;
	if (rowNr<=configuration.rowCount && rowNr>0) {	//only if rowNr is valid
		if(deleteData) {
			this.dataProvider().removeRow(rowNr, updateTable);
		}
		for (var col=0;col<configuration.columnCount;col++){	//removes as many cells from the row as there are columns
			tableElement.removeChild(tableElement.cellRects[col][configuration.rowCount-1]);
			tableElement.removeChild(tableElement.cellTexts[col][configuration.rowCount-1]);
			tableElement.cellRects[col].splice(configuration.rowCount-1,1);
			tableElement.cellTexts[col].splice(configuration.rowCount-1,1);
		}
		configuration.rowCount--;					//decrements total number of rows
		configuration.tableHeight-=configuration.rowHeight;		//updates the table height
	}
	if (updateTable) {
		this._setDataExtract();
	}
};
/**
 * Returns the selected column number of the table (human format).
 * @type {Number} colNr
*/
AtviseTable.prototype.selectedColumn = function() {
	return (this.tableElement.selectedColumn>-1)?this.tableElement.selectedColumn+1:undefined;
};
/**
 * Returns the selected data of the table.
 * @type {Array} data
*/
AtviseTable.prototype.selectedData = function() {
	function unique(arrayInstance) {
		var r = new Array();
		o:for(var i = 0, n = arrayInstance.length; i < n; i++) {
			for(var x = 0, y = r.length; x < y; x++) {
				if(r[x]==arrayInstance[i]) {
					continue o;
				}
			}
			r[r.length] = arrayInstance[i];
		}
		return r;
	}
	var data = [];
	var dataRow = this.dataProvider().dataRow((this.tableElement.selectedRow+1));
	var dataColumn = this.dataProvider().dataColumn((this.tableElement.selectedColumn+1));
	for (var i in dataRow) {
		data.push(dataRow[i]);
	}
	for (var i in dataColumn) {
		data.push(dataColumn[i]);
	}
	return unique(data);
};
/**
 * Returns the selected data column of the current data of the table.
 * @type {Array} dataColumn
*/
AtviseTable.prototype.selectedDataColumn = function() {
	return this.dataProvider().dataColumn((this.tableElement.selectedColumn+1));
};
/**
 * Returns the selected data row of the current data of the table.
 * @type {Array} dataRow
*/
AtviseTable.prototype.selectedDataRow = function() {
	return this.dataProvider().dataRow((this.tableElement.selectedRow+1));
};
/**
 * Returns the selected row number of the table (human format).
 * @type {Number} rowNr
*/
AtviseTable.prototype.selectedRow = function() {
	return (this.tableElement.selectedRow>-1)?this.tableElement.selectedRow+1+this.tableElement.scrollRowOffset:undefined;
};
/**
 * Sets the configuration of the table.
 * @param {Object} newConfiguration Configuration object.
*/
AtviseTable.prototype.setConfiguration = function(newConfiguration) {
	var selectRowOld = this.configuration.selectRow;
	var selectColumnOld = this.configuration.selectColumn;
	this.configuration = this._setProperties(this.configuration, newConfiguration, true);
	this.scrollbar.buttonHeight=this.configuration.scrollbarSize;
	this.scrollbar.buttonWidth=this.configuration.scrollbarSize;
	this.scrollbar.barBottomHeight=this.configuration.scrollbarSize;
	this.scrollbar.barSideWidth=this.configuration.scrollbarSize;
	this.scrollbar.barGripHeight=this.configuration.scrollbarSize;
	this.scrollbar.barGripWidth=this.configuration.scrollbarSize;
	if (((selectRowOld != this.configuration.selectRow) && this.configuration.selectRow) || ((selectColumnOld != this.configuration.selectColumn) && this.configuration.selectColumn)) {
		for (var i=0; i<this.configuration.columnCount; i++) {
			for (var j=0; j<this.configuration.rowCount; j++) {
				webMI.addEvent(this.tableElement.cellRects[i][j],"click",this._associateObjWithEvent(this,"_selectCell",[this.tableElement.cellRects[i][j]]));
				webMI.addEvent(this.tableElement.cellTexts[i][j],"click",this._associateObjWithEvent(this,"_selectCell",[this.tableElement.cellRects[i][j]]));
			}
		}
	}
	this.statusbar.height = this.configuration.rowHeight;
	if (!this.configuration.drawStatusBar) {
		this._undrawStatusBar();
	}
};
/**
 * Attaches an data provider to the table.
 * @param {Object} dataProvider A data provider of type AtviseDataProvider
*/
AtviseTable.prototype.setDataProvider = function(source, config) {
	if (config == undefined) {
		var statusbarHeight = (this.configuration.drawStatusBar)?this.statusbar.height:0;
		var rows = Math.floor((this.configuration.displayHeight-statusbarHeight-this.configuration.rowHeight) / this.configuration.rowHeight);
		config = {maxResults: rows};
	}
	config.sortedByColumn = this.configuration.sortedByColumn;
	config.sortingUp = this.configuration.sortingUp;
	this.tableElement.dataProvider = new AtviseDataProvider(source, config);
	this.tableElement.dataProvider.subscribe(this._associateObjWithEvent(this,"_setDataExtract",[]));
};
/**
 * Sets/Adds a header object to the table.
 * @param {Object} header Header object.
 * @param {Number} column Column index.
 * @param {Boolean} overwrite Indicates if the the header shall be overwritten.
*/
AtviseTable.prototype.setHeader = function(header, column, overwrite) {
	// decrement, because array index is starting with 0
	column--;
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var style = this.style;

	var headerRects = tableElement.headerRects;
	var headerTexts = tableElement.headerTexts;
	this._addHeader(header, column, overwrite);
	var headerObjects = tableElement.headerObjects;

	var insert = (column < configuration.columnCount && !overwrite);

	// check if there are more/less columns than headers
	if (headerObjects.length > configuration.columnCount && configuration.autoResize) {
		for (var i=(configuration.columnCount+1); i<(headerObjects.length+1); i++) {
			this.addColumn(i);
		}
	} else if (headerObjects.length < configuration.columnCount && configuration.autoResize ) {
		for (var i=headerObjects.length; i<configuration.columnCount; i++) {
			this.removeColumn(i, true, true, false);
		}
	}
	// update the column according to the headerObject data
	if (column < configuration.columnCount) {
		this._updateHeader(column);
	}
	// if inserting, also reset all headers following the inserted header
	if (insert) {
		for (var i=(column+1); i<configuration.columnCount; i++) {
			this._updateHeader(i);
		}
	}

	var calculatedTableWidth = 0;
	for (var i=0; i<tableElement.headerRects.length; i++) {
		calculatedTableWidth += parseFloat(webMI.gfx.getWidth(tableElement.headerRects[i]));
	}
	configuration.tableWidth = calculatedTableWidth;
	this._calcHeadersOutside();
	this._drawScrollBars();
	if (this.configuration.drawStatusBar) {
		this._drawStatusBar();
	}
	this._drawSortingArrow();
};
/**
 * Sets/Adds an array of header objects to the table.
 * @param {Boolean} overwrite Indicates if the header objects shall be overwritten.
*/
AtviseTable.prototype.setHeaders = function(headers) {
	var overwrite = (arguments[1])?arguments[1]:true;
	if (overwrite && this.configuration.autoResize) {
		this.removeAllColumns(true);
	}
	if (headers.length < this.configuration.columnCount) {
		for (var i=this.configuration.columnCount; i>headers.length; i--) {
			this.removeColumn(i, true, true, false);
		}
	}
	for (var i=0; i<(headers.length); i++) {
		var column = i+1;
		this.setHeader(headers[i], column, overwrite);
	}
};
/**
 * Sets/Adds an array of masking functions to the table.
 * @param {Array}: maskingFunctions: [{columnNumber: 1, <OR columnName: columnName,> mask: function(){...}},...]
*/
AtviseTable.prototype.setMaskingFunctions = function(maskingFunctions){
	this.tableElement.maskingFunctions = new Array(this.tableElement.headerTexts.length);

	for (var i = 0; i < maskingFunctions.length; i++){
		var mask;
		if (maskingFunctions[i].hasOwnProperty("maskFunction")){
			mask = maskingFunctions[i].maskFunction;
		} else if (maskingFunctions[i].maskName == "dateMS"){
			mask = function(timestamp){
				if (timestamp == null || timestamp == "")
					return "";
				var date = new Date(parseInt(timestamp, 10));
				return webMI.sprintf("%d-%02d-%02d %02d:%02d:%02d.%03d", date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
			};
		} else if (maskingFunctions[i].maskName == "date"){
			mask = function(timestamp){
				if (timestamp == null || timestamp == "")
					return "";
				var date = new Date(parseInt(timestamp, 10));
				return webMI.sprintf("%d-%02d-%02d %02d:%02d:%02d", date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			};
		} else
			mask = function(){return ""};

		if (maskingFunctions[i].hasOwnProperty("columnName")){
			var found = false;
			for (var j = 0; j < this.configuration.columnCount; j++){
				if (this.tableElement.headerObjects[j].name == maskingFunctions[i]["columnName"]){
					this.tableElement.maskingFunctions[j] = mask;
					found = true;
				}
			}
			if (!found)
				console.warn("Table: Please make sure that the column named: " + maskingFunctions[i]["columnName"] + " exists.");
		} else if (maskingFunctions[i].columnNumber < this.tableElement.maskingFunctions.length)
			this.tableElement.maskingFunctions[maskingFunctions[i].columnNumber] = maskingFunctions[i].mask;
		else if (maskingFunctions[i].columnNumber >= this.tableElement.maskingFunctions.length)
			console.warn("Table: Please note, the column number of the masking function is larger than the amount of existing columns.");
	}
};
/**
 * Sets the scrollbar object of the table.
 * @param {Object} scrollbar Scrollbar object.
*/
AtviseTable.prototype.setScrollbar = function(scrollbar) {
	this._setProperties(this.scrollbar, scrollbar, true);
};
/**
 * Sets the statusbar object of the table.
 * @param {Object} statusbar Statusbar object.
*/
AtviseTable.prototype.setStatusbar = function(statusbar) {
	this._setProperties(this.statusbar, statusbar, true);
	if (this.configuration.drawStatusBar) {
		this._drawStatusBar();
	}
};
/**
 * Sets the style object of the table.
 * @param {Object} style Style object.
*/
AtviseTable.prototype.setStyle = function(style) {
	this._setProperties(this.style, style, true);
};
/**
 * Sets the style object for even rows of the table.
 * @param {Object} style Style object.
*/
AtviseTable.prototype.setStyleEven = function(style) {
	this._setProperties(this.styleEven, style, true);
	var data = this.dataProvider().data;
	if (data.length > 0) {
		for (var i=0; i<data.length; i++) {
			if (i%2==0) {
				this.dataProvider().setRowStyle((i+1), this.styleEven);
			}
		}
	}
};
/**
 * Sets the style object for odd rows of the table.
 * @param {Object} style Style object.
*/
AtviseTable.prototype.setStyleOdd = function(style) {
	this._setProperties(this.styleOdd, style, true);
	var data = this.dataProvider().data;
	if (data.length > 0) {
		for (var i=0; i<data.length; i++) {
			if (i%2==0) {
				this.dataProvider().setRowStyle((i+1), this.styleOdd);
			}
		}
	}
};

/*  ***********************************************************
	********** atvise table widget PRIVATE FUNCTIONS **********
	*********************************************************** */

// TODO: missing documentation
AtviseTable.prototype._addHeader = function(headerObject) {
	if (!headerObject) return;
	var headerObjects = this.tableElement.headerObjects;
	headerObject = this._setProperties(headerObject, {name:"Header_"+headerObjects.length,width:"140",fill:"#868a86",highlight: {fill: "#C0C0C0", selected:"#877DDF"},fontFamily:"Arial",fontSize:"16",fontColor:"#000000", sortable:true, resizable:true, cursor: "pointer"}, false);
	if (headerObjects.length > 0) {
		var position = headerObjects.length;
		var overwrite = false;
		if(arguments.length>1) {
			if (typeof arguments[1] == "number") {
				position = arguments[1];
			} else {
				return;
			}
			if (typeof arguments[2] == "boolean") {
				overwrite = arguments[2];
			} else {
				return;
			}
		}
		// position lies within the existing array of header objects
		headerObjects = this._arrayInsertElement(headerObjects, position, headerObject, overwrite);
	} else {
		headerObjects.push(headerObject);
	}
	this.tableElement.headerObjects = headerObjects;
};

// TODO: missing documentation
AtviseTable.prototype._arrayInsertElement = function(arrayInstance, position, newElement, overwrite) {
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
// TODO: missing documentation
AtviseTable.prototype._arrayRemoveElement = function(arrayInstance, position) {
	if (arrayInstance.length > 0) {
		if (arrayInstance[position] != undefined) {
			arrayInstance.splice(position, 1);
		}
	}
	return arrayInstance;
};
// TODO: missing documentation
// associates an object with a method (usually called to access the atviseTable with "this" from an child element - e.g. header mousedown)
AtviseTable.prototype._associateObjWithEvent = function(obj, methodName, myArguments){
    return (function(e){
        e = e||window.event;
        return obj[methodName](e, myArguments);
    });
};
// TODO: missing documentation
AtviseTable.prototype._calcHeadersOutside = function() {
	var headersOutside = 0;
	var visible = true;
	var firstOutside = -1;

	for (var i=0; i<this.tableElement.headerRects.length; i++) {
		var headerX = parseFloat(webMI.gfx.getX(this.tableElement.headerRects[i]));
		var headerW = parseFloat(webMI.gfx.getWidth(this.tableElement.headerRects[i]));

		if((headerX+headerW)>this.configuration.displayWidth) {
			if (headersOutside == 0) {
				firstOutside = i;
			}
			headersOutside++;
			visible = false;
		}
		webMI.gfx.setVisible(this.tableElement.headerRects[i],visible);
		webMI.gfx.setVisible(this.tableElement.headerTexts[i],visible);
	}
	if (firstOutside > -1) {
		for (var i=firstOutside; i<this.tableElement.cellRects.length; i++) {
			for (var j=0; j<this.tableElement.cellRects[i].length; j++) {
				if (this.tableElement.cellRects[i][j] != undefined) {
					webMI.gfx.setVisible(this.tableElement.cellRects[i][j], visible);
				}
			}
		}
	}

	this.tableElement.firstHeaderOutside = firstOutside;
	this.tableElement.headersOutside = headersOutside;
};
// TODO: missing documentation
AtviseTable.prototype._cellStyle = function(even) {
	return (even)?this.styleEven:this.styleOdd;
};
// TODO: missing documentation
AtviseTable.prototype._checkArray = function(arrayToCheck, idx1, idx2) {
	if (arrayToCheck == undefined) {
		arrayToCheck = [];
	}
	if (idx1 != undefined) {
		if (arrayToCheck[idx1] == undefined) {
			arrayToCheck[idx1] = [];
		}
	}
	if (idx2 != undefined) {
		if (arrayToCheck[idx1][idx2] == undefined) {
			arrayToCheck[idx1][idx2] = [];
		}
	}
};
// TODO: missing documentation
AtviseTable.prototype._createCell = function(col,row,x,y,cellStyle){
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var style = this.style;

	var cellRects = tableElement.cellRects;
	var cellTexts = tableElement.cellTexts;
	var cellTextContents = tableElement.cellTextContents;
	var textOffsetY = configuration.rowHeight - ((configuration.rowHeight/2)-(style.fontSize/2)) - 2;

	this._checkArray(cellRects,col,row);
	this._checkArray(cellTexts,col,row);
	this._checkArray(cellTextContents,col,row);

	//default text and style of the cell
	var fill = cellStyle.fill;
	var fontFamily = cellStyle.fontFamily;
	var fontSize = cellStyle.fontSize;
	var fontColor = cellStyle.fontColor;
	var stroke = cellStyle.stroke;
	var strokeWidth = cellStyle.strokeWidth;
	var dataObj = (this.dataProvider() != null) ? this.dataProvider().dataObject((row+1), (col+1)) : undefined;
	if (dataObj != undefined) {
		cellTextContents[col][row] = dataObj.text;
		if (dataObj.fill!=undefined) {
			fill = dataObj.fill;
		}
		if (dataObj.fontColor!=undefined) {
			fontColor = dataObj.fontColor;
		}
		if (dataObj.fontSize!=undefined) {
			fontSize = dataObj.fontSize;
		}
		if (dataObj.fontFamily!=undefined) {
			fontFamily = dataObj.fontFamily;
		}
		if (dataObj.stroke!=undefined) {
			stroke = dataObj.stroke;
		}
		if (dataObj.strokeWidth!=undefined) {
			strokeWidth = dataObj.strokeWidth;
		}
	} else {
		cellTextContents[col][row]="";
	}

	var visible = true;
	if (this.tableElement.firstHeaderOutside > -1 && col >= this.tableElement.firstHeaderOutside) {
		visible = false;
	}

	// creates cell rectangle
	cellRects[col][row]= webMI.gfx.addRect({width:webMI.gfx.getWidth(tableElement.headerRects[col]),height:configuration.rowHeight,x:x,y:y,fill:fill,stroke:stroke,strokeWidth:strokeWidth,visible:visible},tableElement);
	cellRects[col][row].column=col;
	cellRects[col][row].row=row;
	cellRects[col][row].originalColor=fill;
	cellRects[col][row].setAttribute("atv:table-body-rect","true");
	var maskedElement = (typeof this.tableElement.maskingFunctions[col] === "undefined") ?
		this.tableElement.cellTextContents[col][row] :
		this.tableElement.maskingFunctions[col]( this.tableElement.cellTextContents[col][row] );
	cellTexts[col][row] = webMI.gfx.addText({x:x+style.textOffsetX,y:y+textOffsetY,fontFamily:fontFamily,fill:fontColor,fontSize:fontSize,text:maskedElement,visible:visible},tableElement);
	cellTexts[col][row].column=col;
	cellTexts[col][row].row=row;
	cellTexts[col][row].setAttribute("atv:table-body-text","true");

	if (configuration.highlightCells || configuration.selectRow || configuration.selectColumn) {
		webMI.addEvent(cellRects[col][row],"mouseover",this._associateObjWithEvent(this,"_highlightCell",[cellRects[col][row], true]));
		webMI.addEvent(cellRects[col][row],"mouseout",this._associateObjWithEvent(this,"_highlightCell",[cellRects[col][row], false]));
		webMI.addEvent(cellTexts[col][row],"mouseover",this._associateObjWithEvent(this,"_highlightCell",[cellRects[col][row], true]));
		webMI.addEvent(cellTexts[col][row],"mouseout",this._associateObjWithEvent(this,"_highlightCell",[cellRects[col][row], false]));
		if (configuration.selectRow || configuration.selectColumn) {
			webMI.addEvent(cellRects[col][row],"click",this._associateObjWithEvent(this,"_selectCell",[cellRects[col][row]]));
			webMI.addEvent(cellTexts[col][row],"click",this._associateObjWithEvent(this,"_selectCell",[cellRects[col][row]]));
		}
	}
};
// TODO: missing documentation
AtviseTable.prototype._createPredefinedTable = function() {
	var oldAutoResize = this.configuration.autoResize;
	this.setConfiguration({autoResize:true});
	var headerRects = [];
	var headerTexts = [];
	var rects = [];
	var texts = [];
	var data = [];
	var childsToRemove = [];

	for (var i in this.tableElement.childNodes) {
		var childEle = this.tableElement.childNodes[i];
		if (childEle.attributes != undefined) {
			if (this.hasSVG && childEle.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-header-rect") == "true") {
				headerRects.push(childEle);
			} else if (this.hasVML && childEle.getAttribute("atv:table-header-rect") == "true") {
				headerRects.push(childEle);
			} else if (this.hasSVG && childEle.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-header-text") == "true") {
				headerTexts.push(childEle);
			} else if (this.hasVML && childEle.getAttribute("atv:table-header-text") == "true") {
				headerTexts.push(childEle);
			} else if (this.hasSVG && childEle.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-body-rect") == "true") {
				rects.push(childEle);
			} else if (this.hasVML && childEle.getAttribute("atv:table-body-rect") == "true") {
				rects.push(childEle);
			} else if (this.hasSVG && childEle.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-body-text") == "true") {
				texts.push(childEle);
			} else if (this.hasVML && childEle.getAttribute("atv:table-body-text") == "true") {
				texts.push(childEle);
			}  else {
				childsToRemove.push(childEle);
			}
		}
	}
	// remove all non-table childs

	var i = childsToRemove.length-1;
	while (i > -1) {
		this.tableElement.removeChild(childsToRemove[i]);
		i--;
	}
	if (headerRects.length < 1) {
		// there were no child elements defined for creating a table
		this.setConfiguration({autoResize:oldAutoResize});
		this._createTable();
		return;
	}
	// read headers
	var startX = 0;
	for (var i=0; i<headerRects.length; i++) {
		var name = webMI.gfx.getText(headerTexts[i]);
		var fontColor = webMI.gfx.getFill(headerTexts[i]);
		var fontSize = webMI.gfx.getFontSize(headerTexts[i]);
		var fontFamily = webMI.gfx.getFontFamily(headerTexts[i]);
		var width = Math.floor(parseFloat(webMI.gfx.getWidth(headerRects[i])));
		var fill = webMI.gfx.getFill(headerRects[i]);
		var stroke = webMI.gfx.getStroke(headerRects[i]);
		var strokeWidth = webMI.gfx.getStrokeWidth(headerRects[i]);
		this._addHeader({name: name, width: width, fill: fill, fontColor: fontColor, fontSize:fontSize, fontFamily:fontFamily, stroke:stroke, strokeWidth:strokeWidth, sortable: true, resizable: true, eventList: []});
		this._checkArray(this.tableElement.headerRects,i);
		this._checkArray(this.tableElement.headerTexts,i);
		this.tableElement.headerRects[i] = headerRects[i];
		this.tableElement.headerRects[i].column = i;
		this.tableElement.headerRects[i].originalColor = fill;
		this.tableElement.headerTexts[i] = headerTexts[i];
		webMI.gfx.setX(this.tableElement.headerRects[i], startX);
		webMI.gfx.setX(this.tableElement.headerTexts[i], startX + (width/2));
		fontSize = (fontSize == undefined)?this.style.header.fontSize:fontSize;
		var textOffsetY = this.configuration.rowHeight - ((this.configuration.rowHeight/2)-(fontSize/2)) - 2;
		webMI.gfx.setY(this.tableElement.headerRects[i],0);
		webMI.gfx.setY(this.tableElement.headerTexts[i],0+textOffsetY);
		this.tableElement.headerTexts[i].setAttribute("text-anchor","middle");
		webMI.gfx.setWidth(this.tableElement.headerRects[i], width);
		webMI.gfx.setHeight(this.tableElement.headerRects[i], this.configuration.rowHeight);
		startX += width;
		this.configuration.tableWidth += width;
		this._updateHeader(i);
	}

	this.setConfiguration({columnCount:this.tableElement.headerRects.length});
	// read data and cells
	if (rects.length == texts.length) {
		var idx = 0;
		var width = 0;
		var startX = 0;
		var startY = this.configuration.rowHeight;
		for (var i=0; i<rects.length; i++) {
			if (i != 0 && (i % this.configuration.columnCount) == 0) {
				this.configuration.rowCount++;
				startY += this.configuration.rowHeight;
				idx = 0;
				startX = 0;
			}
			this._checkArray(data,this.configuration.rowCount,idx);
			this._checkArray(this.tableElement.cellRects,idx,this.configuration.rowCount);
			this._checkArray(this.tableElement.cellTexts,idx,this.configuration.rowCount);
			this._checkArray(this.tableElement.cellTextContents,idx,this.configuration.rowCount);

			var text = webMI.gfx.getText(texts[i]);
			var fill = webMI.gfx.getFill(rects[i]);
			var fontColor = webMI.gfx.getFill(texts[i]);
			var fontSize = webMI.gfx.getFontSize(texts[i]);
			var fontFamily = webMI.gfx.getFontFamily(texts[i]);
			var stroke = webMI.gfx.getStroke(rects[i]);
			var strokeWidth = webMI.gfx.getStrokeWidth(rects[i]);

			data[this.configuration.rowCount][idx] = {text:text, fill:fill, fontColor: fontColor, fontSize:fontSize, fontFamily:fontFamily, stroke: stroke, strokeWidth:strokeWidth};
			this.tableElement.cellRects[idx][this.configuration.rowCount] = rects[i];
			this.tableElement.cellTexts[idx][this.configuration.rowCount] = texts[i];
			this.tableElement.cellTextContents[idx][this.configuration.rowCount] = text;

			this.tableElement.cellRects[idx][this.configuration.rowCount].column=idx;
			this.tableElement.cellRects[idx][this.configuration.rowCount].row=this.configuration.rowCount;
			this.tableElement.cellRects[idx][this.configuration.rowCount].originalColor=fill;

			if (this.configuration.highlightCells || this.configuration.selectRow || this.configuration.selectColumn) {
				webMI.addEvent(this.tableElement.cellRects[idx][this.configuration.rowCount],"mouseover",this._associateObjWithEvent(this,"_highlightCell",[this.tableElement.cellRects[idx][this.configuration.rowCount], true]));
				webMI.addEvent(this.tableElement.cellRects[idx][this.configuration.rowCount],"mouseout",this._associateObjWithEvent(this,"_highlightCell",[this.tableElement.cellRects[idx][this.configuration.rowCount], false]));
				webMI.addEvent(this.tableElement.cellTexts[idx][this.configuration.rowCount],"mouseover",this._associateObjWithEvent(this,"_highlightCell",[this.tableElement.cellRects[idx][this.configuration.rowCount], true]));
				webMI.addEvent(this.tableElement.cellTexts[idx][this.configuration.rowCount],"mouseout",this._associateObjWithEvent(this,"_highlightCell",[this.tableElement.cellRects[idx][this.configuration.rowCount], false]));
				if (this.configuration.selectRow || this.configuration.selectColumn) {
					webMI.addEvent(cellRects[col][row],"click",this._associateObjWithEvent(this,"_selectCell",[cellRects[col][row]]));
					webMI.addEvent(cellTexts[col][row],"click",this._associateObjWithEvent(this,"_selectCell",[cellRects[col][row]]));
				}
			}

			var width = parseFloat(this.tableElement.headerObjects[idx].width);
			webMI.gfx.setX(this.tableElement.cellRects[idx][this.configuration.rowCount], startX);
			webMI.gfx.setX(this.tableElement.cellTexts[idx][this.configuration.rowCount], startX + this.style.textOffsetX);
			webMI.gfx.setWidth(this.tableElement.cellRects[idx][this.configuration.rowCount],width);
			fontSize = (fontSize == undefined)?this.style.fontSize:fontSize;
			var textOffsetY = this.configuration.rowHeight - ((this.configuration.rowHeight/2)-(fontSize/2)) - 2;
			webMI.gfx.setY(this.tableElement.cellRects[idx][this.configuration.rowCount], startY);
			webMI.gfx.setY(this.tableElement.cellTexts[idx][this.configuration.rowCount], startY + textOffsetY);
			startX += width;
			idx++;
		}
		this.configuration.rowCount++;
		this.setDataProvider({data: data});
	}
	this.setConfiguration({autoResize:false});
};
// TODO: missing documentation
AtviseTable.prototype._createTable = function() {
	// if the tableElement has no predefined cells then create as many as there is space
	var cols = Math.floor(((this.configuration.displayWidth-this.configuration.scrollbarSize) / this.style.header.width));
	var statusbarHeight = (this.configuration.drawStatusBar)?this.statusbar.height:0;
	var rows = Math.floor((this.configuration.displayHeight-statusbarHeight-this.configuration.rowHeight) / this.configuration.rowHeight);
	this.setConfiguration({rowCount: rows});
	for (var i=1; i<(cols+1); i++) {
		this.addColumn(i);
	}
};
// TODO: missing documentation
AtviseTable.prototype._drag = function(e, arguments) {
	var moveX = arguments[0];
	var moveY = arguments[1];

	//var origX = element.offsetLeft, origY = element.offsetTop;
	var deltaX = 10;
	var deltaY = 10; //startX - origX, deltaY = startY - origY;

	if (document.addEventListener) {  // DOM Level 2 event model
        document.addEventListener("mousemove", moveHandler, true);
        document.addEventListener("mouseup", upHandler, true);
    }
    else if (document.attachEvent) {  // IE 5+ Event Model
        element.setCapture();
        element.attachEvent("onmousemove", moveHandler);
        element.attachEvent("onmouseup", upHandler);
        // Treat loss of mouse capture as a mouseup event
        element.attachEvent("onlosecapture", upHandler);
    }
    else {  // IE 4 Event Model
        var oldmovehandler = document.onmousemove; // used by upHandler()
        var olduphandler = document.onmouseup;
        document.onmousemove = moveHandler;
        document.onmouseup = upHandler;
    }

	if(e.stopPropagation) e.stopPropagation();
	else e.cancelBubble = true;

	if(e.preventDefault) e.preventDefault();
	else e.returnValue = false;

	function moveHandler(e) {
		if (!e) e = window.event;
		var startX = parseFloat(webMI.gfx.getX(element));
		var startY = parseFloat(webMI.gfx.getY(element));
		//cnsole.log(startX + "    " + startY);
		if(moveX) {
			webMI.gfx.setX(element, (startX + deltaX));
		}
		if(moveY) {
			webMI.gfx.setY(element, (startY + deltaY));
		}

		if(e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}

	function upHandler(e) {
		if (!e) e = window.event;
		if (document.removeEventListener) {  // DOM event model
            document.removeEventListener("mouseup", upHandler, true);
            document.removeEventListener("mousemove", moveHandler, true);
        }
        else if (document.detachEvent) {  // IE 5+ Event Model
            element.detachEvent("onlosecapture", upHandler);
            element.detachEvent("onmouseup", upHandler);
            element.detachEvent("onmousemove", moveHandler);
            element.releaseCapture();
        }
        else {  // IE 4 Event Model
            document.onmouseup = olduphandler;
            document.onmousemove = oldmovehandler;
        }
		if(e.stopPropagation) e.stopPropagation();
		else e.cancelBubble = true;
	}
};
// TODO: missing documentation
AtviseTable.prototype._drawScrollBars = function() {
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var lastItemIndex = (this.dataProvider() != null) ? this.dataProvider().lastItemIndex() : null;
	this._undrawScrollBars();
	if (tableElement && lastItemIndex != null && configuration.columnCount > 0 && configuration.rowCount > 0) {
		var scrollbar = this.scrollbar;
		var statusbar = this.statusbar;
		var maxRows = Math.floor((this.configuration.displayHeight-statusbar.height-this.configuration.rowHeight) / this.configuration.rowHeight);
		var drawSide = (lastItemIndex+2) > maxRows;
		var maxOffset = (lastItemIndex+2) - configuration.rowCount;
		if (tableElement.scrollRowOffset > maxOffset && maxOffset > -1) {
			tableElement.scrollRowOffset = maxOffset;
		}
		var drawBottom = configuration.tableWidth > configuration.displayWidth;
		var xBottom=parseInt(webMI.gfx.getX(tableElement.cellRects[tableElement.scrollColOffset][tableElement.cellRects[0].length-1]));
		var yBottom=0;

		if(configuration.rowCount==0) {
			yBottom=configuration.rowHeight;
		} else {
			yBottom=parseInt(webMI.gfx.getY(tableElement.cellRects[0][tableElement.cellRects[0].length-1]))+configuration.rowHeight;
			// scrollbar size plus table height exceed the displayHeight
			if ((yBottom + configuration.rowHeight + configuration.scrollbarSize) > configuration.displayHeight) {
				this.removeRow(tableElement.cellRects[0].length-1,false,false);
			}
		}
		var xSide=configuration.tableWidth;
		var ySide=parseInt(webMI.gfx.getY(tableElement.headerRects[0]));

		if (this.tableElement.headersOutside > 0) {
			for (var i=this.tableElement.firstHeaderOutside; i<this.configuration.columnCount; i++) {
				if (this.tableElement.headerRects[i] != undefined) {
					xSide -= parseFloat(webMI.gfx.getWidth(this.tableElement.headerRects[i]));
				}
			}
		}

		if (drawBottom && xSide > configuration.displayWidth) {
			xSide = configuration.displayWidth - ((drawSide)?scrollbar.barSideWidth:0);
		} else if(drawSide) {
			xSide = (configuration.tableWidth+scrollbar.barSideWidth>configuration.displayWidth)?configuration.displayWidth-scrollbar.barSideWidth:configuration.tableWidth;
		}
		if(drawSide && drawBottom) {
			scrollbar.barDecoRect=webMI.gfx.addRect({width:scrollbar.buttonWidth,height:scrollbar.buttonHeight,x:xSide,y:yBottom,fill:"#eeeeee",stroke:"#000000",strokeWidth:1}, tableElement);
		}
		// coordinates for arrows
		var x1,x2,x3,x4,y1,y2,y3,y4;

		//barBottom
		if(drawBottom) {
			scrollbar.barBottom=webMI.gfx.addRect({width:xSide,height:scrollbar.barBottomHeight,x:xBottom,y:yBottom,fill:scrollbar.barFill,stroke:scrollbar.barStroke,strokeWidth:scrollbar.barStrokeWidth}, tableElement);
			scrollbar.buttonLeft=webMI.gfx.addRect({width:scrollbar.buttonWidth,height:scrollbar.buttonHeight,x:xBottom,y:yBottom,fill:scrollbar.buttonFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			scrollbar.buttonRight=webMI.gfx.addRect({width:scrollbar.buttonWidth,height:scrollbar.buttonHeight,x:xSide-scrollbar.buttonWidth,y:yBottom,fill:scrollbar.buttonFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			var overflowX = configuration.tableWidth - configuration.displayWidth;
			var sliderWidth =  xSide-(2*scrollbar.buttonWidth);
			scrollbar.barGripWidth = sliderWidth - overflowX;
			scrollbar.barBottomGrip=webMI.gfx.addRect({width:scrollbar.barGripWidth,height:scrollbar.barBottomHeight,x:xBottom+scrollbar.buttonWidth,y:yBottom,fill:scrollbar.barGripFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			var gripXoffset = ((sliderWidth-scrollbar.barGripWidth)/tableElement.headersOutside)*tableElement.scrollColOffset;
			webMI.gfx.setMoveX(scrollbar.barBottomGrip,gripXoffset);
			webMI.addEvent(scrollbar.buttonLeft,"click",this._associateObjWithEvent(this,"_scroll",["left"]));
			webMI.addEvent(scrollbar.buttonRight,"click",this._associateObjWithEvent(this,"_scroll",["right"]));
			/* TODO: activate _drag Event when _drag function works
				webMI.addEvent(scrollbar.barBottomGrip,"mousedown",function(e) {
				_drag(e, scrollbar.barBottomGrip, [true,false]);
			});*/
			//draws arrow for buttonRight
			x1=parseInt(webMI.gfx.getX(scrollbar.buttonRight))+scrollbar.buttonWidth/3;
			y1=parseInt(webMI.gfx.getY(scrollbar.buttonRight))+scrollbar.buttonHeight/3;
			x2=x1+scrollbar.buttonWidth/3;
			y2=y1+scrollbar.buttonHeight/6;
			x3=x1;
			y3=y2+scrollbar.buttonHeight/6;
			x4=x1;
			y4=y1;
			scrollbar.buttonRightArrow=webMI.gfx.addPolyline({fill:"#000000",points:[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}],stroke:"#000000",strokeWidth:0},tableElement);
			//draws arrow for buttonLeft
			x1=parseInt(webMI.gfx.getX(scrollbar.buttonLeft))+2*scrollbar.buttonWidth/3;
			y1=parseInt(webMI.gfx.getY(scrollbar.buttonLeft))+scrollbar.buttonHeight/3;
			x2=x1;
			y2=y1+scrollbar.buttonHeight/3;
			x3=x1-scrollbar.buttonWidth/3;
			y3=y2-scrollbar.buttonHeight/6;
			x4=x1;
			y4=y1;
			scrollbar.buttonLeftArrow=webMI.gfx.addPolyline({fill:"#000000",points:[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}],stroke:"#000000",strokeWidth:0},tableElement);
			//events for buttons
			webMI.addEvent(scrollbar.buttonRightArrow,"click", this._associateObjWithEvent(this,"_scroll",["right"]));
			webMI.addEvent(scrollbar.buttonLeftArrow,"click", this._associateObjWithEvent(this,"_scroll",["left"]));
		}
		if(drawSide) {
			var barSideHeight = configuration.tableHeight-(4*scrollbar.buttonHeight)+configuration.rowHeight;
			scrollbar.barSide=webMI.gfx.addRect({width:scrollbar.barSideWidth,height:barSideHeight,x:xSide,y:ySide+(2*scrollbar.buttonHeight),fill:scrollbar.barFill,stroke:scrollbar.barStroke,strokeWidth:scrollbar.barStrokeWidth}, tableElement);
			scrollbar.buttonUp=webMI.gfx.addRect({width:scrollbar.buttonWidth,height:scrollbar.buttonHeight,x:xSide,y:ySide+scrollbar.buttonHeight,fill:scrollbar.buttonFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			scrollbar.buttonUpPage=webMI.gfx.addRect({width:scrollbar.buttonWidth,height:scrollbar.buttonHeight,x:xSide,y:ySide,fill:scrollbar.buttonFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			scrollbar.buttonDown=webMI.gfx.addRect({width:scrollbar.buttonWidth,height:scrollbar.buttonHeight,x:xSide,y:ySide+(2*scrollbar.buttonHeight)+barSideHeight,fill:scrollbar.buttonFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			scrollbar.buttonDownPage=webMI.gfx.addRect({width:scrollbar.buttonWidth,height:scrollbar.buttonHeight,x:xSide,y:ySide+(3*scrollbar.buttonHeight)+barSideHeight,fill:scrollbar.buttonFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			scrollbar.barGripHeight = barSideHeight / ((lastItemIndex+1) - (configuration.rowCount-1));
			scrollbar.barSideGrip=webMI.gfx.addRect({width:scrollbar.barSideWidth,height:scrollbar.barGripHeight,x:xSide,y:(ySide+(2*scrollbar.buttonHeight))+((tableElement.scrollRowOffset)*scrollbar.barGripHeight),fill:scrollbar.barGripFill,stroke:scrollbar.buttonStroke,strokeWidth:scrollbar.buttonStrokeWidth}, tableElement);
			//TODO: activate when position detection works (webMI2)... webMI.addEvent(scrollbar.barSide,"mousedown",this._associateObjWithEvent(this,"_scroll",["pos"]));
			webMI.addEvent(scrollbar.buttonUp,"click",this._associateObjWithEvent(this,"_scroll",["up",1]));
			webMI.addEvent(scrollbar.buttonUpPage,"click",this._associateObjWithEvent(this,"_scroll",["up",configuration.rowCount]));
			webMI.addEvent(scrollbar.buttonDown,"click",this._associateObjWithEvent(this,"_scroll",["down",1]));
			webMI.addEvent(scrollbar.buttonDownPage,"click",this._associateObjWithEvent(this,"_scroll",["down",configuration.rowCount]));
			/* TODO: activate _drag Event when _drag function works
			webMI.addEvent(scrollbar.barSideGrip,"mousedown",this._associateObjWithEvent(this,"_drag",[false,true]));
			*/
			//draws arrow for buttonUp
			x1=parseInt(webMI.gfx.getX(scrollbar.buttonUp))+scrollbar.buttonWidth/3;
			y1=parseInt(webMI.gfx.getY(scrollbar.buttonUp))+2*scrollbar.buttonHeight/3;
			x2=x1+scrollbar.buttonWidth/6;
			y2=y1-scrollbar.buttonHeight/3;
			x3=x1+scrollbar.buttonWidth/3;
			y3=y1;
			x4=x1;
			y4=y1;
			scrollbar.buttonUpArrow=webMI.gfx.addPolyline({fill:"#000000",points:[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}],stroke:"#000000",strokeWidth:0},tableElement);
			var factor = 4;
			scrollbar.buttonUpPageArrow=webMI.gfx.addPolyline({fill:"#000000",points:[{x:x1,y:(y1-scrollbar.buttonHeight)-factor},{x:x2,y:(y2-scrollbar.buttonHeight)-factor},{x:x3,y:(y3-scrollbar.buttonHeight)-factor},{x:x4,y:(y4-scrollbar.buttonHeight)-factor},{x:x1,y:(y1-scrollbar.buttonHeight)+factor},{x:x2,y:(y2-scrollbar.buttonHeight)+factor},{x:x3,y:(y3-scrollbar.buttonHeight)+factor},{x:x4,y:(y4-scrollbar.buttonHeight)+factor}],stroke:"#000000",strokeWidth:0},tableElement);
			//draws arrow for buttonDown
			x1=parseInt(webMI.gfx.getX(scrollbar.buttonDown))+scrollbar.buttonWidth/3;
			y1=parseInt(webMI.gfx.getY(scrollbar.buttonDown))+scrollbar.buttonHeight/3;
			x2=x1+scrollbar.buttonWidth/3;
			y2=y1;
			x3=x2-scrollbar.buttonWidth/6;
			y3=y1+scrollbar.buttonHeight/3;
			x4=x1;
			y4=y1;
			scrollbar.buttonDownArrow=webMI.gfx.addPolyline({fill:"#000000",points:[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}],stroke:"#000000",strokeWidth:0},tableElement);
			scrollbar.buttonDownPageArrow=webMI.gfx.addPolyline({fill:"#000000",points:[{x:x1,y:(y1+scrollbar.buttonHeight)-factor},{x:x2,y:(y2+scrollbar.buttonHeight)-factor},{x:x3,y:(y3+scrollbar.buttonHeight)-factor},{x:x4,y:(y4+scrollbar.buttonHeight)-factor},{x:x1,y:(y1+scrollbar.buttonHeight)+factor},{x:x2,y:(y2+scrollbar.buttonHeight)+factor},{x:x3,y:(y3+scrollbar.buttonHeight)+factor},{x:x4,y:(y4+scrollbar.buttonHeight)+factor}],stroke:"#000000",strokeWidth:0},tableElement);
			//events for buttons
			webMI.addEvent(scrollbar.buttonUpArrow,"click", this._associateObjWithEvent(this,"_scroll", ["up",1]));
			webMI.addEvent(scrollbar.buttonUpPageArrow,"click", this._associateObjWithEvent(this,"_scroll", ["up",configuration.rowCount]));
			webMI.addEvent(scrollbar.buttonDownArrow,"click", this._associateObjWithEvent(this,"_scroll",["down",1]));
			webMI.addEvent(scrollbar.buttonDownPageArrow,"click", this._associateObjWithEvent(this,"_scroll",["down",configuration.rowCount]));
		}
	}
	if (this.configuration.drawStatusBar) {
		this._drawStatusBar();
	}
};
// TODO: missing documentation
AtviseTable.prototype._drawSortingArrow = function(){
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	if (tableElement.headerRects.length > 0 && tableElement.headerRects[configuration.sortedByColumn] != undefined) {
		var x1=parseInt(webMI.gfx.getX(tableElement.headerRects[configuration.sortedByColumn]))+parseInt(webMI.gfx.getWidth(tableElement.headerRects[configuration.sortedByColumn]))-10;
		var y1=parseInt(webMI.gfx.getY(tableElement.headerRects[configuration.sortedByColumn]))+parseInt(webMI.gfx.getHeight(tableElement.headerRects[configuration.sortedByColumn]))/2 - 5;
			var x2=x1-10;
		var y2;
		if(configuration.sortingUp)y2=y1-10;
		else y2=y1+10;
		var x3=x2-10;
		var y3=y1;
		var x4=x1;
		var y4=y1;
		if(configuration.sortingUp){y1+=10;y2+=10;y3+=10;y4+=10;}
		this._undrawSortingArrow();

		tableElement.sortingArrow =	webMI.gfx.addPolyline({fill:"#000000",points:[{x:x1,y:y1},{x:x2,y:y2},{x:x3,y:y3},{x:x4,y:y4}],stroke:"#000000",strokeWidth:0},tableElement);

		if (tableElement.headerObjects[configuration.sortedByColumn] != undefined && tableElement.headerObjects[configuration.sortedByColumn].sortable) {
			webMI.addEvent(tableElement.sortingArrow,"click",this._associateObjWithEvent(this,"_sort",[configuration.sortedByColumn]));
		}
	}
};
// TODO: missing documentation
AtviseTable.prototype._drawStatusBar = function() {
	this._undrawStatusBar();
	var tableElement = this.tableElement;
	var statusbar = this.statusbar;
	var configuration = this.configuration;
	var style = this.style;
	var scrollbar = this.scrollbar;
	var x=(tableElement.cellRects[tableElement.scrollColOffset] != undefined && tableElement.cellRects[tableElement.scrollColOffset].length>0)?parseInt(webMI.gfx.getX(tableElement.cellRects[tableElement.scrollColOffset][tableElement.cellRects[tableElement.scrollColOffset].length-1])):0;
	var y=0;
	if(scrollbar.barBottom!=undefined) {
		y=parseFloat(webMI.gfx.getY(scrollbar.barBottom))+scrollbar.barBottomHeight;
	} else if (tableElement.cellRects.length > 0 && tableElement.cellRects[0].length > 0) {
		y=parseFloat(webMI.gfx.getY(tableElement.cellRects[0][tableElement.cellRects[0].length-1])) + configuration.rowHeight;
	} else {
		y=configuration.rowHeight;
	}
	var xWidth = configuration.tableWidth;
	if (scrollbar.barSide!=undefined && configuration.tableWidth + scrollbar.barSideWidth > configuration.displayWidth) {
		xWidth = configuration.displayWidth - scrollbar.barSideWidth;
	}
	// subtract all invisible cells
	if (this.tableElement.headersOutside > 0 && (scrollbar.barSide==undefined || scrollbar.barSide == null)) {
		for (var i=this.tableElement.firstHeaderOutside; i<this.configuration.columnCount; i++) {
			if(this.tableElement.headerRects[i]!=undefined) {
				var width = parseFloat(webMI.gfx.getWidth(this.tableElement.headerRects[i]));
				xWidth -= width;
			}
		}
	}
	var textOffsetY = statusbar.height -((statusbar.height/2)-(statusbar.fontSize/2)) - 2;
	var rowOffset = this.tableElement.scrollRowOffset;
	var lastItemIndex = (this.dataProvider() != null) ? this.dataProvider().lastItemIndex() + 1 : null;
	var rowOffsetEnd = (rowOffset+this.configuration.rowCount);
	if (rowOffsetEnd > lastItemIndex) {
		rowOffsetEnd = lastItemIndex;
	}
	var labelAmountText = (lastItemIndex != null && lastItemIndex > 0) ? "Data: " + (this.tableElement.scrollRowOffset+1) + " - " + rowOffsetEnd + " of " + lastItemIndex : "Data: 0";
	if (statusbar.bar==undefined) {
		statusbar.bar=webMI.gfx.addRect({width:xWidth,height:statusbar.height,x:x,y:y,fill:statusbar.fill,stroke:statusbar.stroke,strokeWidth:statusbar.strokeWidth}, tableElement);
		statusbar.label=webMI.gfx.addText({x:x+style.textOffsetX,y:y+textOffsetY,fontFamily:statusbar.fontFamily,fill:statusbar.fontColor,fontSize:statusbar.fontSize,text:labelAmountText},tableElement);
		var errorText="";
		statusbar.error=webMI.gfx.addText({x:xWidth/2,y:y+textOffsetY,fontFamily:statusbar.fontFamily,fill:statusbar.fontColor,fontSize:statusbar.fontSize,text:errorText},tableElement);
	} else {
		webMI.gfx.setY(statusbar.bar,y);
		webMI.gfx.setY(statusbar.label,y+textOffsetY);
		webMI.gfx.setY(statusbar.error,y+textOffsetY);
		webMI.gfx.setText(statusbar.label, labelAmountText);
		webMI.gfx.setWidth(statusbar.bar,xWidth);
	}
};
// TODO: missing documentation
AtviseTable.prototype._highlightCell = function(e, myArguments) {
	function highlightCell(tableElement, dataProvider, elem, fill) {
		if (elem != undefined && fill != undefined) {
			if (!highlight) {
				if (elem.row != undefined && elem.column != undefined) {
					var dataObj = dataProvider.dataObject((elem.row+1), (elem.column+1));
					if (dataObj != undefined && dataObj.fill != undefined ) {
						fill = dataObj.fill;
					}
				} else {
					if (tableElement.headerObjects[elem.column] != undefined && tableElement.headerObjects[elem.column].fill != undefined) {
						fill = tableElement.headerObjects[elem.column].fill;
					}
				}
			}
			webMI.gfx.setFill(elem,fill);
		}
	}
	function getCellFill(tableElement, dataProvider, elem) {
		if(elem != undefined) {
			var fill = elem.originalColor;
			var dataObj = dataProvider.dataObject((elem.row+1), (elem.column+1));
			if (dataObj != undefined && dataObj.fill != undefined) {
				fill = dataObj.fill;
			}
			return fill;
		}
	}


	var dataProvider = this.dataProvider();
	var elem = (myArguments[0])?myArguments[0]:null;

	var highlight = (myArguments[1])?myArguments[1]:false;
	var fill = (highlight)?this.style.highlight.fill:getCellFill(this.tableElement, dataProvider, elem);


	if ((elem.row != this.tableElement.selectedRow) && (elem.column != this.tableElement.selectedColumn)) {
		highlightCell(this.tableElement, dataProvider, elem,fill);
		if (this.configuration.selectRow && elem.row != undefined) {
			if (elem.row != this.tableElement.selectedRow) {
				for (var i=0; i<this.configuration.columnCount; i++) {
					if (i != this.tableElement.selectedColumn) {
						highlightCell(this.tableElement,this.tableElement.cellRects[i][elem.row], (highlight)?fill:getCellFill(this.tableElement, this.tableElement.cellRects[i][elem.row]));
					}
				}
			}
		}
		if(this.configuration.selectColumn && elem.column != undefined) {
			if (elem.column != this.tableElement.selectedColumn) {
				for (var i=0; i<this.configuration.rowCount; i++) {
					if (i != this.tableElement.selectedRow) {
						highlightCell(this.tableElement,this.tableElement.cellRects[elem.column][i], (highlight)?fill:getCellFill(this.tableElement, this.tableElement.cellRects[elem.column][i]));
					}
				}
			}
		}
	}
};
// TODO: missing documentation
AtviseTable.prototype._init = function(config) {
	var displayWidth = 1280;
	var displayHeight = 1024;
	if (this.hasVML && this.tableElement.getAttribute("atv:table-width") != undefined) {
		displayWidth = parseFloat(this.tableElement.getAttribute("atv:table-width"));
	} else if (this.hasSVG && this.tableElement.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-width") != undefined && this.tableElement.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-width") != "") {
		displayWidth = parseFloat(this.tableElement.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-width"));
	}
	if (this.hasVML && this.tableElement.getAttribute("atv:table-height") != undefined) {
		displayHeight = parseFloat(this.tableElement.getAttribute("atv:table-height"));
	} else if (this.hasSVG && this.tableElement.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-height") != undefined && this.tableElement.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-height") != "") {
		displayHeight = parseFloat(this.tableElement.getAttributeNS("http://webmi.atvise.com/2007/svgext","table-height"));
	}

//	this._setProperties(this.configuration, {displayWidth:parseFloat(displayWidth), displayHeight:parseFloat(displayHeight), rowHeight: 25, rowCount: 0, columnCount: 0, tableHeight: 0, tableWidth: 0, sortable: true, sortingUp: false, sortedByColumn: 0, scrollbarSize: 25, drawStatusBar: true, highlightCells: true, selectRow:false, selectColumn:false, autoResize: false, selectFixed: false});
	this._setProperties(config, {displayWidth:parseFloat(displayWidth), displayHeight:parseFloat(displayHeight), rowHeight: 25, rowCount: 0, columnCount: 0, tableHeight: 0, tableWidth: 0, sortable: true, sortingUp: false, sortedByColumn: 0, scrollbarSize: 25, drawStatusBar: true, highlightCells: true, selectRow:false, selectColumn:false, autoResize: false, selectFixed: false});
	this.configuration = config;
	this._setProperties(this.style, {header: {width: 140, fill: "#868a86", fontFamily: "Arial", fontSize: 16, fontColor: "#000000", stroke: "#000000", strokeWidth:1, sortable: true, resizable: true, cursor: "pointer"}, highlight: {fill: "#fcec3c", selected:"#FFA200"}, stroke: "#000000", strokeWidth: 1, fontFamily: "Arial", fontSize: 14, fontColor: "#000000", cursor: "default", linkColor: "#1F31FF", linkCursor: "pointer", textOffsetX: 5});
	this._setProperties(this.styleEven, this.style);
	this._setProperties(this.styleOdd, this.style);
	this.styleEven.fill = "#EFEFEF";
	this.styleOdd.fill = "#cbcbcb";
	var size = this.configuration.scrollbarSize;
	this._setProperties(this.scrollbar, {buttonHeight: size, buttonWidth: size, barSideWidth: size, barFill: "#eeeeee", barStroke: "#000000", strokeWidth:1, buttonFill: "#999999", buttonStroke: "#000000", buttonStrokeWidth:1, barGripFill: "#C0C0C0", barGripHeight: size, barGripWidth: size});
	this._setProperties(this.statusbar, {height:this.configuration.rowHeight, fill:"#4F4F4F", stroke:"#000000", strokeWidth:1, fontFamily:"Arial", fontSize:12, fontColor:"#000000"});
	this.setDataProvider({data: []});
	// if the tableElement is predefined then load the children
	if (this.tableElement.childNodes.length > 0) {
		this._createPredefinedTable();
	} else {
		this._createTable();
	}
	if (this.configuration.drawStatusBar) {
		this._drawStatusBar();
	}
};
// TODO: missing documentation
AtviseTable.prototype._mouseDownEdit = function(e, myArguments) {
	var tableElement = this.tableElement;
	var elem = (myArguments[0]!=undefined)?myArguments[0]:null;
	var column = (myArguments[1]!=undefined)?myArguments[1]:null;
	var row = (myArguments[2]!=undefined)?myArguments[2]:null;
	var editFunction = (myArguments[3]!=undefined)?myArguments[3]:null;
	if (elem && column != undefined && row != undefined) {
		var inputRect=webMI.gfx.addRect({width:webMI.gfx.getWidth(elem),height:webMI.gfx.getHeight(elem),x:webMI.gfx.getX(elem),y:webMI.gfx.getY(elem),fill:"none",stroke:"#0000FF",strokeWidth:3}, tableElement);
		var isPanel = navigator.userAgent.indexOf("WebKitWinCE") != -1;
		if (isPanel) {
			// TODO: open keyboard correctly if is panel
			//webMI.display.openWindow({display:"SYSTEM.DISPLAYS.touchpanel_demo.elements.keyboard.keyboard",extern:false,height:211,menubar:false,modal:false,movable:true,resizable:false,scrollbars:false,status:false,title:"",toolbar:false,width:528,x:0,y:100,query:webMI.query});
		} else {
			var input = prompt("User input for " + tableElement.cellTextContents[column][row] + ":", "");	//input prompt in Browser
			if(input) {
				if (editFunction != null) {
					var srcText = tableElement.cellTextContents[column][row];
					myArguments[3] = srcText;
					editFunction(e, myArguments, input);
				} else {
					this._setCellContent(e, row, column, true, { text: input });
				}
			}
		}
		tableElement.removeChild(inputRect);
	}
};
// TODO: missing documentation
AtviseTable.prototype._mouseDownEditHeader = function(e, myArguments) {
	var tableElement = this.tableElement;
	var elem = (myArguments[0]!=undefined)?myArguments[0]:null;
	var column = (myArguments[1]!=undefined)?myArguments[1]:null;
	if (elem != null && column > -1) {
		var inputRect=webMI.gfx.addRect({width:webMI.gfx.getWidth(elem),height:webMI.gfx.getHeight(elem),x:webMI.gfx.getX(elem),y:webMI.gfx.getY(elem),fill:"none",stroke:"#0000FF",strokeWidth:1}, tableElement);
		var isPanel = navigator.userAgent.indexOf("WebKitWinCE") != -1;
		if (isPanel) {
			// TODO: open keyboard correctly if is panel
			//webMI.display.openWindow({display:"SYSTEM.DISPLAYS.touchpanel_demo.elements.keyboard.keyboard",extern:false,height:211,menubar:false,modal:false,movable:true,resizable:false,scrollbars:false,status:false,title:"",toolbar:false,width:528,x:0,y:100,query:webMI.query});
		} else {
			var input = prompt("Edit header width: ",webMI.gfx.getWidth(elem));	//input prompt in Browser
			if(input) {
				var newWidth = parseFloat(input);
				tableElement.headerObjects[column].width = newWidth;
				this.setHeader(tableElement.headerObjects[column],(column+1),true);
			}
		}
		tableElement.removeChild(inputRect);
	}
};
// TODO: missing documentation
AtviseTable.prototype._scroll = function(e, myArguments){
	var scrollDirection = myArguments[0];
	var scrollbar = this.scrollbar;
	var scrollOffset = parseFloat(myArguments[1]);
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var doScroll = true;
	function moveGrid(tableElement, scrollbar, right, configuration) {
		var multiplicator=(right)?-1:1;
		var calc = (right)?0:-1;
		var	preWidth = parseFloat(tableElement.headerObjects[tableElement.scrollColOffset+calc].width);
		tableElement.scrollColOffset=tableElement.scrollColOffset+(-1*multiplicator);
		for (var i=0; i<tableElement.headerRects.length; ++i) {
			if (i==(tableElement.scrollColOffset) && tableElement.sortingArrow != null) {
				var moveOffset = 0;
				for (var offset=0; offset<tableElement.scrollColOffset; ++offset) {
					moveOffset += parseFloat(tableElement.headerObjects[offset].width);
				}
				var visible = (configuration.sortedByColumn > 1) || (-1) * moveOffset >= 0;
				webMI.gfx.setMoveX(tableElement.sortingArrow,(-1)*moveOffset);
				webMI.gfx.setVisible(tableElement.sortingArrow, visible);
			}
			var oldXrect = parseFloat(webMI.gfx.getX(tableElement.headerRects[i]));
			var oldXtext = parseFloat(webMI.gfx.getX(tableElement.headerTexts[i]));
			webMI.gfx.setX(tableElement.headerRects[i],oldXrect+(multiplicator*preWidth));
			webMI.gfx.setX(tableElement.headerTexts[i],oldXtext+(multiplicator*preWidth));
			var width = parseFloat(webMI.gfx.getWidth(tableElement.headerRects[i]));
			var visible = ((oldXrect+(multiplicator*preWidth) + width) < configuration.displayWidth && (oldXrect+(multiplicator*preWidth) + width) > 0);
			webMI.gfx.setVisible(tableElement.headerRects[i],visible);
			webMI.gfx.setVisible(tableElement.headerTexts[i],visible);
			for (var j=0; j<tableElement.cellRects[i].length; ++j) {
				oldXtext = parseFloat(webMI.gfx.getX(tableElement.cellTexts[i][j]));
				webMI.gfx.setX(tableElement.cellRects[i][j],oldXrect+(multiplicator*preWidth));
				webMI.gfx.setX(tableElement.cellTexts[i][j],oldXtext+(multiplicator*preWidth));
				var width = parseFloat(webMI.gfx.getWidth(tableElement.cellRects[i][j]));
				var visible = ((oldXrect+(multiplicator*preWidth) + width) < configuration.displayWidth && (oldXrect+(multiplicator*preWidth) + width) > 0);
				webMI.gfx.setVisible(tableElement.cellRects[i][j],visible);
				webMI.gfx.setVisible(tableElement.cellTexts[i][j],visible);
			}
		}
		var bottomWidth = parseFloat(webMI.gfx.getWidth(scrollbar.barBottom)) - (2*scrollbar.buttonWidth);
		webMI.gfx.setMoveX(scrollbar.barBottomGrip,((bottomWidth-scrollbar.barGripWidth)/tableElement.headersOutside)*tableElement.scrollColOffset);
	}
	switch(scrollDirection){
		case "right" :
			doScroll=false;
			var lastHeaderX = parseFloat(webMI.gfx.getX(tableElement.headerRects[tableElement.headerRects.length-1]));
			var lastHeaderWidth = parseFloat(tableElement.headerObjects[tableElement.headerObjects.length-1].width);
			var lastHeaderPos = lastHeaderX + lastHeaderWidth;
			if ((lastHeaderPos > configuration.displayWidth) && (configuration.tableWidth > configuration.displayWidth)) {
				moveGrid(tableElement,scrollbar,true,configuration);
			}
			break;
		case "left":
			doScroll=false;
			if (tableElement.scrollColOffset > 0) {
				moveGrid(tableElement,scrollbar,false,configuration);
			}
			break;
		case "up":
			if (tableElement.scrollRowOffset > 0) {
				tableElement.scrollRowOffset = tableElement.scrollRowOffset - scrollOffset;
				if(tableElement.scrollRowOffset < 0) {
					tableElement.scrollRowOffset = 0;
				}
				this.dataProvider().previous(scrollOffset);
				webMI.gfx.setMoveY(this.scrollbar.barSideGrip,tableElement.scrollRowOffset*this.scrollbar.barGripHeight);
			} else { doScroll=false; }
			break;
		case "down":
			 var downStep = scrollOffset;
			 var lastItemIndex = this.dataProvider().lastItemIndex() + 1;
			 if ((tableElement.scrollRowOffset + configuration.rowCount) < lastItemIndex) {
				tableElement.scrollRowOffset = tableElement.scrollRowOffset + scrollOffset;
				if(tableElement.scrollRowOffset + configuration.rowCount > lastItemIndex) {
					downStep = lastItemIndex - tableElement.scrollRowOffset;
					tableElement.scrollRowOffset = lastItemIndex - configuration.rowCount;
				}
				this.dataProvider().next(downStep);
				webMI.gfx.setMoveY(this.scrollbar.barSideGrip, tableElement.scrollRowOffset*this.scrollbar.barGripHeight);
			} else { doScroll=false; }
			break;
		case "pos":
			// TODO: determine offset (SVG coordinates needed -> webMI 2.0)
			break;
		default: alert("???_scroll???"); break;
	}
	if (doScroll) {
		this._setDataExtract();
	}
};
// TODO: missing documentation
AtviseTable.prototype._selectCell = function(e, myArguments) {
	function getCellFill(dataProvider, elem) {
		var originalFill = elem.originalColor;
		var dataObj = (dataProvider != null) ? dataProvider.dataObject((elem.row+1), (elem.column+1)) : undefined;
		if (dataObj != undefined && dataObj.fill != undefined ) {
			originalFill = dataObj.fill;
		}
		return originalFill;
	}
	var dataProvider = this.dataProvider();
	var sameRow = false;
	var sameColumn = false;
	var selectedFill = this.style.highlight.selected;
	var elem = myArguments[0];
	if (elem != undefined && elem.row != undefined && elem.column != undefined) {
		if (elem.row != this.tableElement.selectedRow || elem.column != this.tableElement.selectedColumn) {
			webMI.gfx.setFill(elem,selectedFill);
		} else {
			webMI.gfx.setFill(elem,getCellFill(dataProvider, elem));
		}
		if (this.configuration.selectRow) {
			// unhighlight selected cells
			if (this.tableElement.selectedRow > -1 && elem.row != this.tableElement.selectedRow) {
				for (var i=0; i<this.configuration.columnCount; i++) {
					if (i != this.tableElement.selectedColumn) {
						webMI.gfx.setFill(this.tableElement.cellRects[i][this.tableElement.selectedRow],getCellFill(dataProvider, this.tableElement.cellRects[i][this.tableElement.selectedRow]));
					}
				}
			}
			if (elem.row != this.tableElement.selectedRow) {
				// highlight new cells
				for (var i=0; i<this.configuration.columnCount; i++) {
					webMI.gfx.setFill(this.tableElement.cellRects[i][elem.row],selectedFill);
				}
				this.tableElement.selectedRow = elem.row;
			} else {
				sameRow = true;
			}
		}
		if (this.configuration.selectColumn) {
			// unhighlight selected cells
			if (this.tableElement.selectedColumn > -1 && elem.column != this.tableElement.selectedColumn) {
				for (var i=0; i<this.configuration.rowCount; i++) {
					if (i != this.tableElement.selectedRow) {
						webMI.gfx.setFill(this.tableElement.cellRects[this.tableElement.selectedColumn][i],getCellFill(dataProvider, this.tableElement.cellRects[this.tableElement.selectedColumn][i]));
					}
				}
			}
			if (elem.column != this.tableElement.selectedColumn) {
				// highlight new cells
				for (var i=0; i<this.configuration.rowCount; i++) {
					webMI.gfx.setFill(this.tableElement.cellRects[elem.column][i],selectedFill);
				}
				this.tableElement.selectedColumn = elem.column;
			} else {
				sameColumn = true;
			}
		}
		if ((sameRow && sameColumn) && (this.configuration.selectRow && this.configuration.selectColumn)) {
			if (!this.configuration.selectFixed) {
				// unhighlight all selected cells & rows
				for (var i=0; i<this.configuration.rowCount; i++) {
					webMI.gfx.setFill(this.tableElement.cellRects[elem.column][i],getCellFill(dataProvider, this.tableElement.cellRects[elem.column][i]));
				}
				for (var i=0; i<this.configuration.columnCount; i++) {
					webMI.gfx.setFill(this.tableElement.cellRects[i][elem.row],getCellFill(dataProvider, this.tableElement.cellRects[i][elem.row]));
				}
				this.tableElement.selectedRow = -1;
				this.tableElement.selectedColumn = -1;
			}
		} else if (sameRow && this.configuration.selectRow && !this.configuration.selectColumn) {
			if (!this.configuration.selectFixed) {
				for (var i=0; i<this.configuration.columnCount; i++) {
					webMI.gfx.setFill(this.tableElement.cellRects[i][elem.row],getCellFill(dataProvider, this.tableElement.cellRects[i][elem.row]));
				}
				this.tableElement.selectedRow = -1;
			}
		} else if (sameColumn && this.configuration.selectColumn && !this.configuration.selectRow) {
			if (!this.configuration.selectFixed) {
				for (var i=0; i<this.configuration.rowCount; i++) {
					webMI.gfx.setFill(this.tableElement.cellRects[elem.column][i],getCellFill(dataProvider, this.tableElement.cellRects[elem.column][i]));
				}
				this.tableElement.selectedColumn = -1;
			}
		}
	}
};
// TODO: missing documentation
AtviseTable.prototype._setCellContent = function(e, rowNr, colNr, overwrite, dataObj){
	var tableElement = this.tableElement;
	var style = this._cellStyle((rowNr%2==0));
	var newValue = (dataObj != undefined) ? String(dataObj.text) : "";
	var fill = style.fill;
	var fontColor = style.fontColor;
	var fontSize = style.fontSize;
	var fontFamily = style.fontFamily;
	var stroke = style.stroke;
	var strokeWidth = style.strokeWidth;
	var cursor = style.cursor;

	// remove cell if it already has an event attached (workaround, because removeEvent doesnt work)
	if (tableElement.cellRects[colNr][rowNr].hasEvent != undefined) {
		var x = parseFloat(webMI.gfx.getX(tableElement.cellRects[colNr][rowNr]));
		var y = parseFloat(webMI.gfx.getY(tableElement.cellRects[colNr][rowNr]));
		tableElement.removeChild(tableElement.cellRects[colNr][rowNr]);
		tableElement.removeChild(tableElement.cellTexts[colNr][rowNr]);
		tableElement.cellRects[colNr][rowNr] = null;
		tableElement.cellTexts[colNr][rowNr] = null;
		tableElement.cellTextContents[colNr][rowNr] = null;
		var cellStyle = this._cellStyle((rowNr%2==0));
		cellStyle.fill = fill;
		this._createCell(colNr,rowNr,x,y,cellStyle);
	}
	if (tableElement.cellTexts[colNr][rowNr]!=undefined) {
		tableElement.cellTextContents[colNr][rowNr]=newValue;
		var maskedElement = (typeof tableElement.maskingFunctions[colNr] === "undefined") ?
			tableElement.cellTextContents[colNr][rowNr] :
			tableElement.maskingFunctions[colNr]( tableElement.cellTextContents[colNr][rowNr] );

		webMI.gfx.setText(tableElement.cellTexts[colNr][rowNr],maskedElement);
		webMI.gfx.setFill(tableElement.cellTexts[colNr][rowNr],style.fontColor);
		if (dataObj != undefined) {
			// update styling
			if (dataObj.fontSize != undefined) {
				fontSize = dataObj.fontSize;
			}
			webMI.gfx.setFontSize(tableElement.cellTexts[colNr][rowNr], fontSize);
			if (dataObj.fontFamily != undefined) {
				fontFamily = dataObj.fontFamily;
			}
			webMI.gfx.setFontFamily(tableElement.cellTexts[colNr][rowNr], fontFamily);
			if (dataObj.fontColor != undefined) {
				fontColor = dataObj.fontColor;
			}
			webMI.gfx.setFill(tableElement.cellTexts[colNr][rowNr], fontColor);
			if (dataObj.stroke != undefined) {
				stroke = dataObj.stroke;
			}
			webMI.gfx.setStroke(tableElement.cellRects[colNr][rowNr], stroke);
			if (dataObj.strokeWidth != undefined) {
				strokeWidth = dataObj.strokeWidth;
			}
			webMI.gfx.setStrokeWidth(tableElement.cellRects[colNr][rowNr], strokeWidth);
			if (dataObj.cursor != undefined) {
				cursor = dataObj.cursor;
			}
			if (dataObj.fill != undefined) {
				fill = dataObj.fill;
			}
			webMI.gfx.setFill(tableElement.cellRects[colNr][rowNr], fill);
			tableElement.cellRects[colNr][rowNr].setAttribute("cursor", cursor);
			tableElement.cellTexts[colNr][rowNr].setAttribute("cursor", cursor);
			// update events
			var editFunction = null;
			if (dataObj.eventList && dataObj.eventList.length > 0) {
				for (var eventObjEntry in dataObj.eventList) {
					var eventObj = dataObj.eventList[eventObjEntry];
					if (eventObj.name != "edit") {
						webMI.addEvent(tableElement.cellRects[colNr][rowNr], eventObj.name, eventObj.fn);
						webMI.addEvent(tableElement.cellTexts[colNr][rowNr], eventObj.name, eventObj.fn);
					} else {
						editFunction = eventObj.fn;
					}
				}
				tableElement.cellRects[colNr][rowNr].hasEvent=true;
			}
			if(dataObj.editable || editFunction != null) {
				webMI.addEvent(tableElement.cellRects[colNr][rowNr],"click",this._associateObjWithEvent(this,"_mouseDownEdit",[tableElement.cellRects[colNr][rowNr], colNr, rowNr, editFunction]));
				webMI.addEvent(tableElement.cellTexts[colNr][rowNr],"click",this._associateObjWithEvent(this,"_mouseDownEdit",[tableElement.cellRects[colNr][rowNr], colNr, rowNr, editFunction]));
			}
			if ((dataObj.eventList && dataObj.eventList.length > 0) || dataObj.editable) {
				var linkColor = (dataObj.fontColor)?dataObj.fontColor:style.linkColor;
				var linkCursor = (dataObj.cursor)?dataObj.cursor:style.linkCursor;
				webMI.gfx.setFill(tableElement.cellTexts[colNr][rowNr], linkColor);
				tableElement.cellRects[colNr][rowNr].setAttribute("cursor", linkCursor);
				tableElement.cellTexts[colNr][rowNr].setAttribute("cursor", linkCursor);
				tableElement.cellRects[colNr][rowNr].hasEvent=true;
			}
			if (overwrite) {
				dataObj.text = newValue;
				this.dataProvider().setDataObject(rowNr, colNr, dataObj);
			}
		}
	}
};
// TODO: missing documentation
AtviseTable.prototype._setDataExtract = function(dataExtract) {
	var data = (dataExtract == undefined) ? this.dataProvider().data() : dataExtract;
	var configuration = this.configuration;
	var lastItemIndex = (this.dataProvider().lastItemIndex())+1;
	if (this.tableElement.scrollRowOffset >= lastItemIndex) {
		this.tableElement.scrollRowOffset = 0;
	}
	if (data != undefined) {
		var rowCount = configuration.rowCount;
		var columnCount = configuration.columnCount;
		// adjust rows, if table requires autoResize
		if (configuration.autoResize) {
			if (rowCount < lastItemIndex) {
				for (var i=rowCount; i<lastItemIndex; i++) {
					this.addRow(false);
				}
			} else if (lastItemIndex < rowCount && lastItemIndex != -1) {
				this.tableElement.scrollRowOffset = 0;
				var offset = lastItemIndex;
				for (var i=rowCount; i>offset; i--) {
					this.removeRow(i,false,false);
				}
			}

			// adjust columns, if table requires autoResize
			if (data[0] != undefined) {
				if (columnCount < data[0].length) {
					for (var i=(columnCount+1); i<(data[0].length+1); i++) {
						this.addColumn(i);
					}
				} else if (data[0].length < columnCount) {
					this.tableElement.scrollColOffset = 0;
					var offset = data[0].length;
					for (var i=columnCount; i>offset; i--) {
						this.removeColumn(i);
					}
				}
			}
			rowCount = configuration.rowCount;
			columnCount = configuration.columnCount;
		}

		if (lastItemIndex < rowCount && lastItemIndex != -1) {
			for (var i=lastItemIndex; i<rowCount; i++) {
				for (var j=0; j<columnCount; j++) {
					this._setCellContent(null, i, j, false, null);
				}
			}
		}
		var rowOffset = 0;
		var rowOffsetEnd = rowCount;
		if (rowOffsetEnd > lastItemIndex) {
			rowOffsetEnd = lastItemIndex;
		}

		var colOffset = 0;
		var colOffsetEnd = (colOffset+(configuration.columnCount));
		var rowNr = 0, colNr = 0;
		for (var i=rowOffset; i<rowOffsetEnd; i++) {
			for (var j=colOffset; j<colOffsetEnd; j++) {
				var dataObj = data[i] ? data[i][j] : { text: "" };
				this._setCellContent(null, rowNr, colNr, false, dataObj);
				++colNr;
			}
			++rowNr;
			colNr = 0;
		}
	}
	this._drawScrollBars();
};
// TODO: missing documentation
AtviseTable.prototype._setProperties = function(obj, properties) {
	var overwrite = (arguments[2])?arguments[2]:false;
	if (typeof obj == "object") {
		for (var i in properties) {
			if(obj[i] == undefined || overwrite) {
				if (typeof obj[i] == "object") {
					this._setProperties(obj[i], properties[i], overwrite);
				} else {
					obj[i] = properties[i];
				}
			}
		}
	}
	return obj;
};
// TODO: missing documentation
AtviseTable.prototype._sort = function(e, myArguments){
	var col = myArguments[0];
	var dontInvert = myArguments[1];
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var data = this.dataProvider().data();
	if (configuration.sortable) {
		if(configuration.sortedByColumn!=col) configuration.sortingUp=false;	// if new column was chosen to sort by
		if(!dontInvert) {
			configuration.sortingUp=!configuration.sortingUp;
		}
		configuration.sortedByColumn=col;			//remembers by which column the table was sorted the last time
		this.dataProvider().sort(col, configuration.sortingUp);
		this.tableElement.selectedRow = -1;
		this.tableElement.selectedColumn = -1;
		this._drawSortingArrow();
	}
};
// TODO: missing documentation
AtviseTable.prototype._undrawAll = function(){
	while(this.tableElement.hasChildNodes()){
		this.tableElement.removeChild(this.tableElement.lastChild);
	}
};
// TODO: missing documentation
AtviseTable.prototype._undrawScrollBars = function(){
	var tableElement = this.tableElement;
	function removeElementAndSetNull(parent,child) {
		if(parent != null && child != null) {
			try {
				parent.removeChild(child);
			} catch(e) {}
		}
		return null;
	}
	var scrollbar = this.scrollbar;
	if(scrollbar != undefined) {
		scrollbar.barDecoRect = removeElementAndSetNull(tableElement,scrollbar.barDecoRect);
		scrollbar.barSide = removeElementAndSetNull(tableElement,scrollbar.barSide);
		scrollbar.barSideGrip =  removeElementAndSetNull(tableElement,scrollbar.barSideGrip);
		scrollbar.barBottom = removeElementAndSetNull(tableElement,scrollbar.barBottom);
		scrollbar.barBottomGrip = removeElementAndSetNull(tableElement,scrollbar.barBottomGrip);
		scrollbar.buttonLeft = removeElementAndSetNull(tableElement,scrollbar.buttonLeft);
		scrollbar.buttonRight = removeElementAndSetNull(tableElement,scrollbar.buttonRight);
		scrollbar.buttonUp = removeElementAndSetNull(tableElement,scrollbar.buttonUp);
		scrollbar.buttonUpPage = removeElementAndSetNull(tableElement,scrollbar.buttonUpPage);
		scrollbar.buttonDown = removeElementAndSetNull(tableElement,scrollbar.buttonDown);
		scrollbar.buttonDownPage = removeElementAndSetNull(tableElement,scrollbar.buttonDownPage);
		scrollbar.buttonRightArrow = removeElementAndSetNull(tableElement,scrollbar.buttonRightArrow);
		scrollbar.buttonLeftArrow = removeElementAndSetNull(tableElement,scrollbar.buttonLeftArrow);
		scrollbar.buttonUpArrow = removeElementAndSetNull(tableElement,scrollbar.buttonUpArrow);
		scrollbar.buttonUpPageArrow = removeElementAndSetNull(tableElement,scrollbar.buttonUpPageArrow);
		scrollbar.buttonDownArrow = removeElementAndSetNull(tableElement,scrollbar.buttonDownArrow);
		scrollbar.buttonDownPageArrow = removeElementAndSetNull(tableElement,scrollbar.buttonDownPageArrow);
	}
	if (this.configuration.drawStatusBar) {
		this._drawStatusBar();
	}
};
// TODO: missing documentation
AtviseTable.prototype._undrawSortingArrow = function(){
	if(this.tableElement.sortingArrow!=null) {
		this.tableElement.removeChild(this.tableElement.sortingArrow);
		this.tableElement.sortingArrow=null;
	}
};
// TODO: missing documentation
AtviseTable.prototype._undrawStatusBar = function() {
	var tableElement = this.tableElement;
	function removeElementAndSetNull(parent,child) {
		if(parent != null && child != null) {
			try {
				parent.removeChild(child);
			} catch(e) {}
		}
		return null;
	}
	var statusbar = this.statusbar;
	if(statusbar != undefined) {
		statusbar.bar = removeElementAndSetNull(tableElement,statusbar.bar);
		statusbar.label = removeElementAndSetNull(tableElement,statusbar.label);
		statusbar.error = removeElementAndSetNull(tableElement,statusbar.error);
	}
};
// TODO: missing documentation
AtviseTable.prototype._updateHeader = function(column) {
	var tableElement = this.tableElement;
	var configuration = this.configuration;
	var style = this.style;

	if (tableElement.headerObjects[column]) {
		// rearrange all following headers and cells if the width has changed
		var currentWidth = parseFloat(webMI.gfx.getWidth(tableElement.headerRects[column]));
		if (currentWidth != tableElement.headerObjects[column].width) {
			webMI.gfx.setWidth(tableElement.headerRects[column], tableElement.headerObjects[column].width);
			for (var i=0; i<configuration.rowCount; i++) {
				webMI.gfx.setWidth(tableElement.cellRects[column][i], tableElement.headerObjects[column].width);
			}
			var currentX = parseFloat(webMI.gfx.getX(tableElement.headerRects[column]));
			if (this.hasVML) {
				webMI.gfx.setX(tableElement.headerTexts[column], currentX + style.textOffsetX);
			} else {
				webMI.gfx.setX(tableElement.headerTexts[column], currentX + (tableElement.headerObjects[column].width / 2));
			}

			var diff = currentWidth - tableElement.headerObjects[column].width;
			// headers
			for (var i=(column+1); i<tableElement.headerRects.length; i++) {
				var startX = parseFloat(webMI.gfx.getX(tableElement.headerRects[i]));
				var newX = startX + (-1) * diff;
				webMI.gfx.setX(tableElement.headerRects[i], newX);
				var headerWidth = parseFloat(webMI.gfx.getWidth(tableElement.headerRects[i]));
				if (this.hasVML) {
					webMI.gfx.setX(tableElement.headerTexts[i], newX + style.textOffsetX);
				} else {
					webMI.gfx.setX(tableElement.headerTexts[i], newX + (headerWidth/2));
				}
				// cells
				for (var j=0; j<configuration.rowCount; j++) {
					webMI.gfx.setX(tableElement.cellRects[i][j], newX);
					webMI.gfx.setX(tableElement.cellTexts[i][j], newX + style.textOffsetX);
				}
			}
		}
		// remove cell if it already has an event attached (workaround, because removeEvent doesn't work)
		if (tableElement.headerRects[column] && tableElement.headerRects[column].hasEvent != undefined) {
			this.removeColumn((column+1), false, false, false);
			this.addColumn((column+1), false);
		}
		webMI.gfx.setText(tableElement.headerTexts[column],tableElement.headerObjects[column].name);
		if (tableElement.headerObjects[column].sortable == true) {
			webMI.addEvent(tableElement.headerRects[column],"click",this._associateObjWithEvent(this,"_sort",[column]));
			webMI.addEvent(tableElement.headerTexts[column],"click",this._associateObjWithEvent(this,"_sort",[column]));
		}

		if (tableElement.headerObjects[column].resizable == true) {
			webMI.addEvent(tableElement.headerRects[column],"dblclick",this._associateObjWithEvent(this,"_mouseDownEditHeader",[tableElement.headerRects[column],column]));
			webMI.addEvent(tableElement.headerTexts[column],"dblclick",this._associateObjWithEvent(this,"_mouseDownEditHeader",[tableElement.headerRects[column],column]));
		}
		if (configuration.highlightCells == true) {
			webMI.addEvent(tableElement.headerRects[column],"mouseover",this._associateObjWithEvent(this,"_highlightCell",[tableElement.headerRects[column],true]));
			webMI.addEvent(tableElement.headerTexts[column],"mouseover",this._associateObjWithEvent(this,"_highlightCell",[tableElement.headerRects[column],true]));
			webMI.addEvent(tableElement.headerRects[column],"mouseout",this._associateObjWithEvent(this,"_highlightCell",[tableElement.headerRects[column],false]));
			webMI.addEvent(tableElement.headerTexts[column],"mouseout",this._associateObjWithEvent(this,"_highlightCell",[tableElement.headerRects[column],false]));
		}
		if (tableElement.headerObjects[column].eventList && tableElement.headerObjects[column].eventList.length > 0) {
			for (var eventObjEntry in tableElement.headerObjects[column].eventList) {
				webMI.addEvent(tableElement.headerRects[column], tableElement.headerObjects[column].eventList[eventObjEntry].name, tableElement.headerObjects[column].eventList[eventObjEntry].fn);
				webMI.addEvent(tableElement.headerTexts[column], tableElement.headerObjects[column].eventList[eventObjEntry].name, tableElement.headerObjects[column].eventList[eventObjEntry].fn);
			}
		}
		if ((tableElement.headerObjects[column].eventList && tableElement.headerObjects[column].eventList.length > 0) || tableElement.headerObjects[column].sortable || tableElement.headerObjects[column].resizable) {
			tableElement.headerRects[column].setAttribute("cursor", tableElement.headerObjects[column].cursor);
			tableElement.headerTexts[column].setAttribute("cursor", tableElement.headerObjects[column].cursor);
			tableElement.headerRects[column].hasEvent = true;
		}
		var fill = style.fill;
		var stroke = style.stroke;
		if (tableElement.headerObjects[column].fill != undefined) {
			fill = tableElement.headerObjects[column].fill;
		}
		webMI.gfx.setFill(tableElement.headerRects[column], fill);
		if (tableElement.headerObjects[column].stroke != undefined) {
			stroke = tableElement.headerObjects[column].stroke;
		}
		webMI.gfx.setStroke(tableElement.headerRects[column], stroke);
	}
};
/*	********** atvise table widget END ********** */
/**
 * The AtviseDataProvider Class.
 * @class
 * @param {Object} source Object containing the source data.
 * @param {Object} configuration Object for configuration of the data provider.
*/
function AtviseDataProvider(source, configuration) {
	if (typeof source == "object") {
		this.source = source;
		this.dataArray = [];
		this.dataExtract = [];
		this.dataFiltered = [];
		this.dataFn = null;
		this.params = null;
		this.types = {
			DATA_PROVIDER_TYPE_ARRAY: "array",
			DATA_PROVIDER_TYPE_XML: "xml",
			DATA_PROVIDER_TYPE_SERVERSIDE: "serverside"
		};
		this.type = this.types.DATA_PROVIDER_TYPE_ARRAY;
		this.listeners = [];
		this.configuration = {maxResults: 100};
		this.offsetStart = 0;
		this.offsetEnd = 0;
		this.filterArray = null;
		this.filteredArrayLength = -1;
		this.sortedByColumn = 0;
		this.sortingUp = false;
		this.init_(configuration);
	}
}
/**
 * Adds an event to a data object at the specified position.
 * @param {Number} rowNr Row index of the data object.
 * @param {Number} colNr Column index of the data object.
 * @param {Object} eventObj Object with event information.
*/
AtviseDataProvider.prototype.addCellEvent = function(rowNr, colNr, eventObj) {
	// decrement user input to array index
	rowNr--;
	colNr--;
	this.addCellEvent_(rowNr, colNr, eventObj, true);
};
/**
 * Adds an event to all data objects of a column.
 * @param {Number} colNr Column index.
 * @param {Object} eventObj Event object.
 * @param {String} eventObj.name Name of the event.
 * @param {Function} eventObj.fn Function that will be called.
*/
AtviseDataProvider.prototype.addColumnEvent = function(colNr, eventObj) {
	// decrement user input to array index
	colNr--;
	if (this.dataArray != undefined && this.dataArray.length > 0) {
		for (var i=0; i<this.dataArray.length; i++) {
			this.addCellEvent_(i,colNr,eventObj,false);
		}
	}
	this.fireDataChanged_();
};
// TODO: missing documentation
AtviseDataProvider.prototype.addItem = function(dataItem, position, overwrite, update) {
	var position = (arguments[1] != undefined) ? arguments[1] : this.dataArray.length;
	var overwrite = (arguments[2] != undefined) ? arguments[2] : false;
	var update = (arguments[3] != undefined) ? arguments[3] : true;
	this.dataArray = this.arrayInsertElement_(this.dataArray, position, dataItem, overwrite);
	this.sort(this.sortedByColumn, this.sortingUp);
	if (update) {
		this.extract_(this.offsetStart, this.offsetEnd);
	}
};
/**
 * Adds an event to all data objects of a row.
 * @param {Number} rowNr Row index.
 * @param {Object} eventObj Event object.
 * @param {String} eventObj.name Name of the event.
 * @param {Function} eventObj.fn Function that will be called.
*/
AtviseDataProvider.prototype.addRowEvent = function(rowNr, eventObj) {
	// decrement user input to array index
	rowNr--;
	if (this.dataArray != undefined && this.dataArray[rowNr] != undefined) {
		for (var i=0; i<this.dataArray[rowNr].length; i++) {
			this.addCellEvent_(rowNr,i,eventObj,false);
		}
	}
	this.fireDataChanged_();
};
/**
 * Returns the current data array of the data provider.
 * @type {Array} dataArray Current data array of the data provider.
*/
AtviseDataProvider.prototype.data = function() {
//	changed with [AT-D-1348] Spaltensortierung geht bei Scrolling verloren on 2011_04_22
//	return this.dataArray;
	return this.sort(this.sortedByColumn, this.sortingUp);
};
/**
 * Returns a data column of the current data array.
 * @param {Number} colNr Column index.
 * @param {Number} [rowOffsetStart] Row offset start.
 * @param {Number} [rowOffsetEnd] Row offset end.
 * @type {Array} dataColumn
*/
AtviseDataProvider.prototype.dataColumn = function(colNr, rowOffsetStart, rowOffsetEnd) {
	// decrement user input to array index
	colNr--;
	rowOffsetStart = (rowOffsetStart==undefined) ? 0 : rowOffsetStart-1;
	rowOffsetEnd = (rowOffsetEnd==undefined) ? this.dataArray.length : rowOffsetEnd-1;
	var dataExtract = [];
	if (this.dataArray != undefined) {
		for (var i=rowOffsetStart; i<rowOffsetEnd; i++) {
			if (this.dataArray[i] != undefined && this.dataArray[i][colNr] != undefined) {
				dataExtract.push(this.dataArray[i][colNr]);
			}
		}
	}
	return dataExtract;
};
/**
 * Returns a data object of the current data array.
 * @param {Number} rowNr Row index.
 * @param {Number} colNr Column index.
 * @type {Object} dataObject
*/
AtviseDataProvider.prototype.dataObject = function(rowNr, colNr) {
	var dataObject = null;
	// decrement user input to array index
	rowNr--;
	colNr--;
	var dataRow = rowNr + this.offsetStart;
	if (this.dataArray != undefined && this.dataArray[dataRow] != undefined && this.dataArray[dataRow][colNr] != undefined) {
		dataObject = this.dataArray[dataRow][colNr];
	}
	return dataObject;
};
/**
 * Returns a data row of the current data array.
 * @param {Number} rowNr Row index.
 * @param {Number} [colOffsetStart] Column offset start.
 * @param {Number} [colOffsetEnd] Column offset end.
 * @type {Array} dataRow
*/
AtviseDataProvider.prototype.dataRow = function(rowNr, colOffsetStart, colOffsetEnd) {
	// decrement user input to array index
	rowNr--;
	colOffsetStart = (colOffsetStart == undefined) ? 0 : colOffsetStart-1;
	var dataCols = (this.dataArray[0] != undefined) ? this.dataArray[0].length : 0;
	colOffsetEnd = (colOffsetEnd == undefined) ? dataCols : colOffsetEnd-1;
	var dataExtract = [];
	if (this.dataArray != undefined) {
		if (this.dataArray[rowNr] != undefined) {
			for (var i=colOffsetStart; i<colOffsetEnd; i++) {
				if (this.dataArray[rowNr][i] != undefined) {
					dataExtract.push(this.dataArray[rowNr][i]);
				}
			}
		}
	}
	return dataExtract;
};
// TODO: missing documentation
AtviseDataProvider.prototype.extract = function(offsetStart, offsetEnd) {
	this.dataExtract = [];
	// decrease input to array indices...
	offsetStart--;
	offsetEnd--;
	if (offsetStart > -1 && offsetStart < this.dataArray.length) {
		this.dataExtract = this.dataArray.slice(offsetStart, offsetEnd);
	}
	this.fireDataChanged_();
};
// TODO: missing documentation
AtviseDataProvider.prototype.filter = function(filterArray) {
	this.filterArray = filterArray;
	if (filterArray == null || this.filterArray.length < 1) {
		this.extract_(this.offsetStart, this.offsetEnd);
	} else {
		this.fireDataChanged_();
	}
};
// TODO: missing documentation
AtviseDataProvider.prototype.hasMore = function(nextOffsetStart, nextOffsetEnd) {
	var hasMore = false;
	if (this.type == this.types.DATA_PROVIDER_TYPE_ARRAY) {
		hasMore = ((nextOffsetStart + this.configuration.maxResults) <= this.dataArray.length);
	} else if (this.type == this.types.DATA_PROVIDER_TYPE_XML) {
		//handle xml
	} else if (this.type == this.types.DATA_PROVIDER_TYPE_SERVERSIDE) {
		var tempData = this.callDataFn_(nextOffsetStart+this.configuration.maxResults, nextOffsetEnd+this.configuration.maxResults);
		hasMore = (typeof tempData == "object" && tempData.constructor.toString().indexOf("Array") != -1);
	}
	return hasMore;
};
// TODO: missing documentation
AtviseDataProvider.prototype.lastItemIndex = function() {
	var lastItemIndex = -1;
	if (this.type == this.types.DATA_PROVIDER_TYPE_ARRAY) {
		if (this.filterArray != null) {
			var delta = (this.dataArray.length-1) - (this.filteredArrayLength-1);
			lastItemIndex = (this.dataArray.length-1) - delta;
		} else {
			lastItemIndex = (this.dataArray.length-1); // - delta;
		}
	} else if (this.type == this.types.DATA_PROVIDER_TYPE_SERVERSIDE) {
		var retValue = webMI.data.call(this.source.lastItemFn, "");
		// TODO: hier fortsetzen...
		lastItemIndex = 200; // retValue.result;
	}
	return lastItemIndex;
};
// TODO: missing documentation
AtviseDataProvider.prototype.next = function(step) {
	this.increaseOffset_(step);
	this.data_();
	this.fireDataChanged_(step);
};
// TODO: missing documentation
AtviseDataProvider.prototype.preloadNext = function(step) {
	this.increaseOffset_(step);
	this.data_();
	this.decreaseOffset_(step);
};
// TODO: missing documentation
AtviseDataProvider.prototype.previous = function(step) {
	this.decreaseOffset_(step);
	this.data_();
	this.fireDataChanged_(step);
};
// TODO: missing documentation
AtviseDataProvider.prototype.removeColumn = function(colNr) {
	colNr--;
	var i = dataArray.length;
	while(i--) {
		if (dataArray[i] != undefined && dataArray[i][colNr] != undefined) {
			dataArray[i].splice(colNr,1);
		}
	}
	this.fireDataChanged_();
};
// TODO: missing documentation
AtviseDataProvider.prototype.removeItem = function(dataItem, identifier, update) {
	if (this.dataArray.length > 0) {
		var rowNr = -1;
		var i = this.dataArray.length-1;
		while (i > -1) {
			if (this.dataArray[i] != undefined) {
				if (this.dataArray[i][identifier] != undefined && this.dataArray[i][identifier] == dataItem[identifier]) {
					rowNr = i;
					break;
				}
			}
			i--;
		}
		if (rowNr > -1) {
			this.dataArray = this.arrayRemoveElement_(this.dataArray, rowNr);
		}
	}
	if (update) {
		this.extract_(this.offsetStart, this.offsetEnd);
	}
};
// TODO: missing documentation
AtviseDataProvider.prototype.removeRow = function(rowNr, update) {
	rowNr--;
	if (this.dataArray[rowNr] != undefined) {
		this.dataArray.splice(rowNr,1);
	}
	if (update) {
		this.fireDataChanged_();
	}
};
/**
 * Sets the style of a data object of a cell.
 * @param {Number} rowNr Row index.
 * @param {Number} colNr Column index.
 * @param {Object} style Style object.
*/
AtviseDataProvider.prototype.setCellStyle = function(rowNr, colNr, style) {
	// decrement user input to array index
	rowNr--;
	colNr--;
	this.setCellStyle_(rowNr, colNr, style, true);
};
/**
 * Sets the configuration object of the data provider.
 * @param {Object} configuration Configuration object
 *
*/
AtviseDataProvider.prototype.setConfiguration = function(configuration) {
	this.setProperties_(this.configuration, configuration);
	this.sortingUp = this.configuration.sortingUp;
	this.sortedByColumn = this.configuration.sortedByColumn;
};
/**
 * Sets the style of all data objects of a column.
 * @param {Number} colNr Column index.
 * @param {Object} style Style object.
*/
AtviseDataProvider.prototype.setColumnStyle = function(colNr, style) {
	// decrement user input to array index
	colNr--;
	if (this.dataArray.length > 0) {
		for (var i=0; i<this.dataArray.length; i++) {
			this.setCellStyle_(i,colNr,style,false);
		}
	}
	this.fireDataChanged_();
};
/**
 * Sets an two-dimensional data array.
 * @param {Array} dataArray Two-dimensional dataArray.
 * @param {Boolean} [appendData] Indicates if the data shall be appended or replaced.
*/
AtviseDataProvider.prototype.setData = function(dataArray, append){
	var append = (arguments[1] != undefined && typeof arguments[1] == "boolean") ? arguments[1] : false;
	if (append && this.dataArray.length > 0) {
		for (var i=0; i<dataArray.length; ++i) {
			this.dataArray.push(dataArray[i]);
		}
		this.sort(this.sortedByColumn, this.sortingUp);
		this.fireDataChanged_();
	} else {
		this.filterArray = null;
		if ((this.dataArray.length != dataArray.length) || (((this.dataArray.length == dataArray.length) && this.filteredArrayLength > 0) && dataArray.length != this.filteredArrayLength)) {
			this.offsetStart = 0;
			this.offsetEnd = this.configuration.maxResults;
		}
		this.dataArray = dataArray;
		this.sort(this.sortedByColumn, this.sortingUp);
		if (this.offsetEnd > (this.lastItemIndex()+2)) {
			this.offsetStart = ((this.lastItemIndex()+2) - this.configuration.maxResults) > -1 ? ((this.lastItemIndex()+2) - this.configuration.maxResults) : 0;
			this.offsetEnd = (this.lastItemIndex()+2);
		} else if (this.offsetEnd < this.configuration.maxResults && (this.lastItemIndex()+2) >= this.configuration.maxResults) {
			this.offsetEnd = this.configuration.maxResults;
		} else if (this.offsetEnd < this.dataArray.length && this.dataArray.length <= this.configuration.maxResults) {
			this.offsetEnd = this.configuration.maxResults;
		}
		this.extract_(this.offsetStart, this.offsetEnd);
	}
};
/**
 * Sets a data column to the data array.
 * @param {Array} dataCol Array of data objects.
 * @param {Number} position Position (default: at the end of the array).
 * @param {Boolean} overwrite Inidicates if the data shall be overriden or not.
*/
AtviseDataProvider.prototype.setDataColumn = function(dataCol) {
	var data = this.dataArray;
	var position = data.length;
	var overwrite = false;
	if (data && data[0] && data[0].length > 0) {
		if(arguments.length>1) {
			if (typeof arguments[1] == "number") {
				position = arguments[1];
			} else {
				return;
			}
			if (typeof arguments[2] == "boolean") {
				overwrite = arguments[2];
			} else {
				return;
			}
		}
		for (var i=0; i<dataCol.length; i++) {
			data = this.arrayInsertElement_(data[position], i, dataCol[i], overwrite);
		}
		this.fireDataChanged_();
	}
};
/**
 * Sets a data object to the table data array.
 * @param {Number} rowNr Row index.
 * @param {Number} colNr Column index.
 * @param {Object} dataObject Data object.
*/
AtviseDataProvider.prototype.setDataObject = function(rowNr, colNr, dataObject) {
	// decrement user input to array index
	rowNr--;
	colNr--;
	var dataRow = this.offsetStart + rowNr;
	if (this.dataArray[dataRow] != undefined && this.dataArray[dataRow][colNr] != undefined) {
		this.dataArray[dataRow][colNr] = dataObject;
		this.fireDataChanged_();
	}
};
/**
 * Sets a data row to the data array.
 * @param {Array} dataRow Array of data objects.
 * @param {Number} position Position (default: at the end of the array).
 * @param {Boolean} overwrite Inidicates if the data shall be overriden or not.
*/
AtviseDataProvider.prototype.setDataRow = function(dataRow) {
	var data = this.dataArray;
	var position = data.length;
	var overwrite = false;
	if(arguments.length>1) {
		if (typeof arguments[1] == "number") {
			position = arguments[1];
		} else {
			return;
		}
		if (typeof arguments[2] == "boolean") {
			overwrite = arguments[2];
		} else {
			return;
		}
	}
	data = this.arrayInsertElement_(data, position, dataRow, overwrite);
	this.fireDataChanged_();
};
/**
 * Sets the style of all data objects of a row.
 * @param {Number} rowNr Row index.
 * @param {Object} style Style object.
*/
AtviseDataProvider.prototype.setRowStyle = function(rowNr, style) {
	// decrement user input to array index
	rowNr--;
	if (this.dataArray[rowNr] != undefined) {
		for (var i=0; i<this.dataArray[rowNr].length; i++) {
			this.setCellStyle_(rowNr,i,style,false);
		}
	}
	this.fireDataChanged_();
};
// TODO: missing documentation
AtviseDataProvider.prototype.sort = function(colNr, sortingUp, sortFn){
	if (this.dataArray.length > 0 && this.dataArray[0][colNr] != undefined) {
		function by(i) {
			return function(a,b) {
				a = a[i];
				b = b[i];
				var multiplicator = (!sortingUp) ? -1 : 1;
				// wenn gleich, dann andere spalte vergleichen?!
				var pos = -1;
				if (a.text == b.text) {
					pos = (a.sortId < b.sortId ? (-1)*multiplicator : 1*multiplicator);
				} else {
					pos = (a.text < b.text ? (-1)*multiplicator : 1*multiplicator);
				}
				return pos;
			};
		};
		var sortByFn = (sortFn != undefined) ? sortFn : by(colNr);
		this.dataArray.sort(sortByFn);
		this.sortedByColumn = colNr;
		this.sortingUp = sortingUp;
		this.extract_(this.offsetStart, this.offsetEnd);
	}
};
// TODO: missing documentation
AtviseDataProvider.prototype.subscribe = function(listener) {
	this.listeners.push(listener);
	listener(this.dataExtract);
};
// TODO: missing documentation
AtviseDataProvider.prototype.unsubscribe = function(listener) {
	var i=this.listeners.length-1;
	while (i > 0) {
		if (this.listeners[i] == listener) {
			this.listeners.splice(i,1);
			break;
		}
		i--;
	}
};
// TODO: missing documentation
AtviseDataProvider.prototype.updateItem = function(dataItem, identifier, update) {
	if (this.dataArray.length > 0) {
		var rowNr = -1;
		var i = this.dataArray.length-1;
		while (i > -1) {
			if (this.dataArray[i] != undefined) {
				if (this.dataArray[i][identifier] != undefined && this.dataArray[i][identifier] == dataItem[identifier]) {
					rowNr = i;
					break;
				}
			}
			i--;
		}
		if (rowNr > -1) {
			this.dataArray = this.arrayInsertElement_(this.dataArray, rowNr, dataItem, true);
		} else {
			this.dataArray.push(dataItem);
		}
		this.sort(this.sortedByColumn, this.sortingUp);
	} else {
		this.dataArray.push(dataItem);
	}
	if (update) {
		this.extract_(this.offsetStart, this.offsetEnd);
	}
};
// *************************
// PRIVATE PUBLIC BORDER
// *************************
/**
 * @private
*/
AtviseDataProvider.prototype.addCellEvent_ = function(rowNr, colNr, eventObj, update) {
	if (this.dataArray != undefined && this.dataArray[rowNr] != undefined && this.dataArray[rowNr][colNr] != undefined) {
		if (this.dataArray[rowNr][colNr].eventList == undefined) {
			this.dataArray[rowNr][colNr].eventList = [];
		}
		this.dataArray[rowNr][colNr].eventList.push(eventObj);
	}
	if (update) {
		this.fireDataChanged_();
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.arrayInsertElement_ = function(arrayInstance, position, newElement, overwrite) {
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
/**
 * @private
*/
AtviseDataProvider.prototype.arrayRemoveElement_ = function(arrayInstance, position) {
	if (arrayInstance.length > 0) {
		if (arrayInstance[position] != undefined) {
			arrayInstance.splice(position, 1);
		}
	}
	return arrayInstance;
};
/**
 * @private
*/
AtviseDataProvider.prototype.callDataFn_ = function(offsetStart, offsetEnd) {
	var start = (offsetStart != undefined) ? offsetStart : this.offsetStart;
	var end = (offsetEnd != undefined) ? offsetEnd : this.offsetEnd;
	var serverSideData = webMI.data.call(this.dataFn, "offsetStart="+start+"&offsetEnd="+end+this.parameterList_());
	return (serverSideData != undefined) ? serverSideData : [];
};
/**
 * @private
*/
AtviseDataProvider.prototype.data_ = function() {
	this.dataExtract = [];
	if (this.type == this.types.DATA_PROVIDER_TYPE_ARRAY) {
		if (this.offsetStart < this.dataArray.length) {
			if (this.dataArray != undefined) {
				this.sort(this.sortedByColumn, this.sortingUp);
				this.dataExtract = this.dataArray.slice(this.offsetStart, this.offsetEnd);
			}
		}
	} else if (this.type == this.types.DATA_PROVIDER_TYPE_XML) {

	} else if (this.type == this.types.DATA_PROVIDER_TYPE_SERVERSIDE) {
		if (this.offsetStart < this.dataArray.length) {
			if (this.dataArray != undefined) {
				this.sort(this.sortedByColumn, this.sortingUp);
				this.dataExtract = this.dataArray.slice(this.offsetStart, this.offsetEnd);
			}
		} else {
			this.dataExtract = this.callDataFn_();
			if (this.dataExtract != null && this.dataExtract != undefined) {
				for (var i in this.dataExtract) {
					this.dataArray.push(this.dataExtract[i]);
				}
			}
		}
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.decreaseOffset_ = function(step) {
	var step = step == undefined ? this.configuration.maxResults : step;
	if (this.offsetStart - step > -1) {
		this.offsetStart -= step;
		this.offsetEnd -= step;
	} else {
		this.offsetStart = 0;
		this.offsetEnd = this.configuration.maxResults;
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.extract_ = function(offsetStart, offsetEnd) {
	this.extract((offsetStart+1),(offsetEnd+1));
};
/**
 * @private
*/
AtviseDataProvider.prototype.filter_ = function() {
	/*
	 * the characters "\", "?" and "*" must be escaped if it is being explicitly searched by them
	 * wildcard characters are "?" for a single character and "*" for 0 or more characters
	*/
	function applyWildcards(value) {
		var value = value.replace(/[\-\[\]\/\{\}\(\)\+\.\^\$\|]/g, "\\$&")
			.replace(/([^\\])\*/g, "$1.*")
			.replace(/([^\\])\?/g, "$1.");

		if(value.charAt(0) == "*")
			value = ".*" + value.substring(1);

		if(value.charAt(0) == "?")
			value = "." + value.substring(1);

		return value;
	}

	if (this.filterArray != null && this.filterArray.length > 0) {
		var tempExtract = [];
		if (this.dataArray.length > 0) {
			var i = this.dataArray.length-1;
			while (i > -1) {
				var match = 0;
				for (var f in this.filterArray) {
					var filter = this.filterArray[f];
					if (filter.value == undefined || filter.value == "") {
						match++;
					} else {
						var j = this.dataArray[i].length-1;
						while (j > -1) {
							if (this.dataArray[i] != undefined && this.dataArray[i][j] != undefined) {
								if (this.dataArray[i][j].name != undefined && this.dataArray[i][j].text != undefined) {
									if (this.dataArray[i][j].name == filter.name) {
										try {
											switch(filter.type) {
												case "matches":
													var cellContent = this.dataArray[i][j].text.toString();
													var filter = applyWildcards(filter.value.toString());
													if(cellContent.match("^"+filter+"$") != null) {
														match++;
													}
													break;
												case "contains":
													var cellContent = this.dataArray[i][j].text.toString().toLowerCase();
													var filter = applyWildcards(filter.value.toString().toLowerCase());
													if (cellContent.search(filter) > -1) {
														match++;
													}
													break;
												case "valuecontains":
													var cellContent = ("value" in (arr_elem = this.dataArray[i][j])) ? arr_elem.value.toString().toLowerCase() : arr_elem.text.toString().toLowerCase();
													var filter = applyWildcards(filter.value.toString().toLowerCase());
													if (cellContent.search(filter) > -1) {
														match++;
													}
													break;
												case "greaterEqual":
													var cellContent = parseFloat(this.dataArray[i][j].text);
													var filter = parseFloat(filter.value);
													if (cellContent >= filter) {
														match++;
													}
													break;
												case "greaterThan":
													var cellContent = parseFloat(this.dataArray[i][j].text);
													var filter = parseFloat(filter.value);
													if (cellContent > filter) {
														match++;
													}
													break;
												case "lowerEqual":
													var cellContent = parseFloat(this.dataArray[i][j].text);
													var filter = parseFloat(filter.value);
													if (cellContent <= filter) {
														match++;
													}
													break;
												case "lowerThan":
													var cellContent = parseFloat(this.dataArray[i][j].text);
													var filter = parseFloat(filter.value);
													if (cellContent < filter) {
														match++;
													}
													break;
												case "beforeEqual":
													if (typeof this.dataArray[i][j].text == "number"){ //greaterEqual
														var cellContent = parseFloat(this.dataArray[i][j].text);
														var filter = parseFloat(filter.value);
														if (cellContent <= filter) {
															match++;
														}
													} else {
														var cellContent = this.parseDate_(this.dataArray[i][j].text,false);
														var filter = this.parseDate_(filter.value);
														if ((cellContent != null && filter != null) && cellContent.getTime() <= filter.getTime()) {
															match++;
														}
													}
													break;
												case "afterEqual":
													if (typeof this.dataArray[i][j].text == "number"){ //lowerEqual
														var cellContent = parseFloat(this.dataArray[i][j].text);
														var filter = parseFloat(filter.value);
														if (cellContent >= filter) {
															match++;
														}
													} else {
														var cellContent = this.parseDate_(this.dataArray[i][j].text,true);
														var filter = this.parseDate_(filter.value);
														if ((cellContent != null && filter != null) && cellContent.getTime() >= filter.getTime()) {
															match++;
														}
													}
													break;
												default: break;
											}
										} catch (e) { }
									}
								}
							}
							j--;
						}
					}
				}
				if (match == this.filterArray.length) {
					tempExtract.push(this.dataArray[i]);
				}
				i--;
			}
		}
		this.dataFiltered = tempExtract.reverse();

		this.filteredArrayLength = tempExtract.length;
		if (this.offsetStart >= tempExtract.length) {
			this.offsetStart = 0;
		}
		if (tempExtract.length < this.offsetEnd) {
			this.offsetStart = ((tempExtract.length+1) - this.configuration.maxResults) > 0 ? ((tempExtract.length+1) - this.configuration.maxResults) : 0;
			this.offsetEnd = tempExtract.length;
		}
		if (this.offsetEnd < tempExtract.length) {
			this.offsetEnd = this.offsetStart + this.configuration.maxResults;
		}
		this.dataExtract = tempExtract.slice(this.offsetStart, this.offsetEnd);
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.fireDataChanged_ = function() {
	this.filter_();
	for (var i in this.listeners) {
		this.listeners[i](this.dataExtract);
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.increaseOffset_ = function(step) {
	var step = step == undefined ? this.configuration.maxResults : step;
	var nextOffsetStart = (this.offsetStart + step);
	var nextOffsetEnd = (this.offsetEnd + step);
	if (this.hasMore(nextOffsetStart, nextOffsetEnd)) {
		this.offsetStart += step;
		this.offsetEnd += step;
	} else {
		this.offsetStart = parseFloat(this.lastItemIndex()+2) - this.configuration.maxResults;
		this.offsetEnd = parseFloat(this.lastItemIndex()+2);
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.init_ = function(configuration) {
	if (configuration != undefined) {
		if (configuration.maxResults != undefined) {
			this.configuration.maxResults = configuration.maxResults;
		}
		if (configuration.sortingUp != undefined) {
			this.sortingUp = configuration.sortingUp;
		}
		if (configuration.sortedByColumn != undefined) {
			this.sortedByColumn = configuration.sortedByColumn;
		}
	}
	if (this.source.data.constructor.toString().indexOf("Array") != -1) {
		this.type = this.types.DATA_PROVIDER_TYPE_ARRAY;
		this.dataArray = this.source.data;
		this.offsetEnd = this.configuration.maxResults;
		this.sort(this.sortedByColumn, this.sortingUp);
		this.extract_(this.offsetStart, this.offsetEnd);
	} else if (this.source.type == this.types.DATA_PROVIDER_TYPE_XML) {
		this.type = this.types.DATA_PROVIDER_TYPE_XML;
		// TODO: handle xml...
	} else if (typeof this.source.data == "string") {
		this.type = this.types.DATA_PROVIDER_TYPE_SERVERSIDE;
		this.dataFn = this.source.data;
		this.offsetEnd = this.configuration.maxResults;
		this.params = this.source.params;
		this.sort(this.sortedByColumn, this.sortingUp);
		this.dataExtract = this.callDataFn_();
		this.dataArray = this.dataExtract;
		this.fireDataChanged_();
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.parseDate_ = function(dateString,low) {
	var date = null;
	low = (low == undefined || low)? true : false;
	var dateTime = dateString.split(" ");
	if (dateTime.length == 2) {
		var dateArray = dateTime[0].split("-");
		var timeArray = dateTime[1].split(":");
		if (dateArray.length == 3 && timeArray.length == 3) {
			date = new Date(dateArray[0], dateArray[1]-1, dateArray[2], timeArray[0], timeArray[1], timeArray[2]);
		}
	} else {
		var dateArray = dateTime[0].split("-");
		if (dateArray.length == 3 && low) {
			date = new Date(dateArray[0], dateArray[1]-1, dateArray[2], 0, 0, 0);
		}
		if (dateArray.length == 3 && !low) {
			date = new Date(dateArray[0], dateArray[1]-1, dateArray[2], 23, 59, 59);
		}
	}
	return date;
};
/**
 * @private
*/
AtviseDataProvider.prototype.parameterList_ = function() {
	var paramList = "";
	if (this.params != null && this.params != undefined) {
		for (var i in this.params) {
			paramList += "&" + i + "=" + this.params[i];
		}
	}
	return paramList;
};
/**
 * @private
*/
AtviseDataProvider.prototype.setCellStyle_ = function(rowNr, colNr, style, update) {
	if (this.dataArray[rowNr] != undefined && this.dataArray[rowNr][colNr] != undefined) {
		for (var styleEntry in style) {
			this.dataArray[rowNr][colNr][styleEntry] = style[styleEntry];
		}
	}
	if (update) {
		this.fireDataChanged_();
	}
};
/**
 * @private
*/
AtviseDataProvider.prototype.setProperties_ = function(obj, properties) {
	var overwrite = (arguments[2])?arguments[2]:false;
	if (typeof obj == "object") {
		for (var i in properties) {
			if(!obj[i] || overwrite) {
				if (typeof obj[i] == "object") {
					this._setProperties(obj[i], properties[i], overwrite);
				} else {
					obj[i] = properties[i];
				}
			}
		}
	}
	return obj;
};

var gElement = (base.gElement == undefined) ? document.getElementById(base.id) : base.gElement;
if (gElement == null || gElement == undefined || (gElement.nodeName != "g" && gElement.nodeName != "group")) {
	return null;
} else {
	function convert(paramValue, desiredType) {
		var action = null;
		var types = { "number": 0, "boolean": 1, "string": 2 };
		var numberToBool = function(x) {
			return (x > 0);
		};
		var numberToString = function(x) {
			return "" + x;
		};
		var boolToNumber = function(x) {
			return (x == false) ? 0 : 1;
		};
		var boolToString = function(x) {
			return "" + x;
		};
		var stringToNumber = function(x) {
			return parseFloat(x);
		};
		var stringToBool = function(x) {
			return (x == "true");
		};

		var numberFns = [null, numberToBool, numberToString];
		var boolFns = [boolToNumber, null, boolToString];
		var stringFns = [stringToNumber, stringToBool, null];
		var type = typeof paramValue;
		switch(type) {
			case "number": action = numberFns[types[desiredType]]; break;
			case "boolean": action = boolFns[types[desiredType]]; break;
			case "string": action = stringFns[types[desiredType]]; break;
			default: break;
		}
		var returnVal = paramValue;
		if (action != null) {
			returnVal = action(paramValue);
		}
		return returnVal;
	}
	var aTable = new AtviseTable(gElement);
	base.rowHeight = convert(base.rowHeight, "number");
	base.sortable = convert(base.sortable, "boolean");
	base.sortingUp = convert(base.sortingUp, "boolean");
	base.sortedByColumn = convert(base.sortedByColumn, "number");
	base.scrollbarSize = convert(base.scrollbarSize, "number");
	base.drawStatusBar = convert(base.drawStatusBar, "boolean");
	base.highlightCells = convert(base.highlightCells, "boolean");
	base.selectRow = convert(base.selectRow, "boolean");
	base.selectColumn = convert(base.selectColumn, "boolean");
	base.autoResize = convert(base.autoResize, "boolean");
	base.selectFixed = convert(base.selectFixed, "boolean");
	base.height = convert(base.height, "number");
	base.width = convert(base.width, "number");
	var config = {displayHeight: base.height, displayWidth: base.width, rowHeight: base.rowHeight, sortable: base.sortable, sortingUp: base.sortingUp, sortedByColumn: base.sortedByColumn, scrollbarSize: base.scrollbarSize, drawStatusBar: base.drawStatusBar, highlightCells: base.highlightCells, selectRow: base.selectRow, selectColumn: base.selectColumn, autoResize: base.autoResize, selectFixed: base.selectFixed};
	aTable._init(config);
	return aTable;
}
},{"rowHeight":"25","sortable":"true","sortingUp":"false","sortedByColumn":"0","scrollbarSize":"25","drawStatusBar":"true","highlightCells":"true","selectRow":"false","selectColumn":"false","autoResize":"false","selectFixed":"false","height":"600","width":"1000"}],
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
var hasVML = document.createEventObject;
var isIOSDevice = /(iPod|iPhone|iPad)/.test(navigator.userAgent);

/*
	iOS workaround for all versions >= iOS 6
	possibility to disable longpoll
	possibility to set a polling interval
	Issue-Id: [AT-D-4256]
*/

if (isIOSDevice){
	var iOSVersion = (/OS (\d+)_(\d+)(_\d+)?/).exec(navigator.userAgent);
	if (iOSVersion != null && parseInt(iOSVersion[1], 10) >= 6){
		webMI.setConfig("data.enablelongpoll", false);
		webMI.setConfig("data.publishinterval", 500);
	}
}

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
	e.value(displaysJs, webMI.query.preload=="true", excludePreloaded, includePreloaded, loadingscreen, firstConnect);
});

var popup = null;
var popupmenulist = null;
var audio = null;
var popupvisible = "hidden";
var menuTimer = null;
var lastMenu = null;
var popups = [];
var eleStayOnTop = null;
var greatestZIndex = 0;


var extensionSizeCount = 0;

function incESC() {
	if (extensionsDiv) {
		extensionsDiv.style.height = "100%";
		extensionsDiv.style.width = "100%";
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
function fillCurrentFrame(names,lang){
	firstConnect = {value: true, defaultFrameName: "", defaultUrl: ""};
	var remaining = names.length;
	for (var i=0;i<names.length;i++){
		webMI.trigger.fire("getSource_" + names[i], function(e,currentDisplayWebMI){
			currentFrame[currentFrame.length] = {"name":names[i],"display":decodeURIComponent(e)};
			if (--remaining==0){
				tabHandler.renewGlobal();
				switchLanguage(lang);
			}
		});
	}
}
function checkPopupsTopParent(index){
	var isbodytop = false;
	var elem = popups[index];
	while (elem.parentNode && !isbodytop){
		isbodytop = (elem.parentNode == document.body);
		elem = elem.parentNode;
	}
	if (!isbodytop){
		popups.splice(index,1);
	}
	return isbodytop;
}

function pushPopups(curPopup,onDemand){
	//(replace and remove) or push
	var push_b = true;
	for (var x=0; x<popups.length;x++){
		if (popups[x].id == curPopup.id && popups[x].parentNode == curPopup.parentNode ){
			if (popups[x].style)
				popups[x].style.visibility = "hidden";
			if (onDemand){
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
	/* use contentWindow instead of contentDocument for <IE9 */
	return frame.contentWindow.document;
}

var mouseMoveFunctions = [];
var mouseUpFunctions = [];

webMI.addEvent(document, "mousemove", function(e) {
	if (!e)
		e = window.event;

	for (var i = 0; i < mouseMoveFunctions.length; ++i)
		mouseMoveFunctions[i].mouseMoveFunction(e);
});

webMI.addEvent(document, "mouseup", function(e) {
	for (var i = 0; i < mouseUpFunctions.length; ++i)
		mouseUpFunctions[i].mouseUpFunction(e);
});

function openWindow(features, offsetLeft, offsetTop, clientWidth, clientHeight) {


	function addDefaults(obj, features) {
		for (var i in features)
			if (!(i in obj))
				obj[i] = features[i];
		return obj;
	}

	var styleDefaults = { fill: "#FFFFFF", headerFill: "#000000", headerFontFill: "#FFFFFF", headerFontFamily: "Arial", headerFontSize: 16 };

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
		toolbar: false,
		close_on_esc: true,
		style: styleDefaults
	});

	var ret = null;
	var h = features.height;
	var w = features.width;
	var x = typeof(features.x) == "number" ? features.x : (clientWidth - w) / 2;
	var y = typeof(features.y) == "number" ? features.y : (clientHeight - h) / 2;

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
			features.url = href + "?defaulturl=" + encodeURIComponent(features.url)+"&language="+currentLanguage.value+"&useSVGKeyboard="+webMI.query["useSVGKeyboard"];
		else
			features.url = "";

		x += offsetLeft;
		y += offsetTop;

		if (features.modal && window.showModalDialog) {
			var args = "dialogHeight:"+h+"px;dialogWidth:"+w+"px";

			if (features.position != "default")
				args += ";dialogTop:"+y+"px;dialogLeft:"+x+"px";

			var ids = {"resizable":"resizable","scrollbars":"scroll", "status":"status"};
			for (var i in ids)
				args += ";"+ids[i]+":"+(features[i] ? "yes" : "no");

			window.showModalDialog(features.url, features.name, args);
			return {};
		} else {
			var args = "height="+h+",width="+w;

			if (features.position != "default")
				args += ",top="+y+",left="+x;

			var ids = ["resizable","scrollbars","menubar","status","modal"];
			for (var i in ids)
				args += ","+ids[i]+"="+(features[ids[i]] ? "yes" : "no");

			ret = {
				openedWindow: window.open(features.url, features.name, args),

				getContentDocument: function() {
					var extPopupFrame = this.openedWindow.document.getElementById("mainframe");
					if(extPopupFrame != null)
						return contentDocumentOf(extPopupFrame);
				},

				close: function () {
					return this.openedWindow.close();
				}
			};

			webMI.addEvent(ret.openedWindow, "load", function(e) {
				var doc = ret.openedWindow.document;
				var mainframe = doc.getElementById("mainframe");
				ret.contentDocument = contentDocumentOf(mainframe);
				webMI.addEvent(mainframe, "load", function() {
					if (doc!=null && doc.location.href != "about:blank"){
						tabHandler.registerDisplay(contentDocumentOf(mainframe));
						tabHandler.beforeFirstUse(contentDocumentOf(mainframe),true);
						mainframe.contentWindow.webMI.addOnfocus(function(){
							if (mainframe.contentWindow != null)
								tabHandler.getFocused(contentDocumentOf(mainframe));
						});
						mainframe.contentWindow.webMI.addOnunload(function(){
							if (mainframe.contentWindow != null)
								tabHandler.removeDoc(contentDocumentOf(mainframe));
							webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"removePopup","popup":ret});
						});
					}
				});
			});

			if (navigator.userAgent.indexOf("MSIE 7") != -1) {
				webMI.addEvent(ret, "load", function() {
					ret.resizeTo(w + 13, h + 31);
					ret.resizeTo(w + 12, h + 31);
				});
			}
			tabHandler.blurFocused();
			tabHandler.renew();
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"pushPopup","popup":ret});
		}
	} else {
		var childWindowTopZindex = 1;

		var ret = {};
		var headerheight = 20;

		ret.backgroundDiv = document.createElement("div");
		ret.backgroundDiv.style.position = "absolute";
		ret.backgroundDiv.style.left = 0;
		ret.backgroundDiv.style.top = 0;
		if (features.modal) {
			incESC();
			ret.backgroundDiv.style.zIndex = greatestZIndex;
			ret.backgroundDiv.style.backgroundColor = features.modalbackground;
			ret.backgroundDiv.style.width = mainFrameHandler.element_.clientWidth + "px";
			ret.backgroundDiv.style.height = mainFrameHandler.element_.clientHeight + "px";
			ret.backgroundDiv.style.opacity = 0.5;
			ret.backgroundDiv.style.filter = "alpha(opacity=50)";
			if(features.extern)
				console.warn("External-modal popups are no longer supported, please refer to the documentation.");
		}
		childwindowsDiv.appendChild(ret.backgroundDiv);

		ret.main = document.createElement("div");
		ret.main.style.position = "absolute";
		ret.main.style.border = "1px solid black";
		ret.main.style.zIndex = ++greatestZIndex;
		ret.bgiframe = document.createElement("iframe");
		ret.bgiframe.frameBorder = 0;
		ret.bgiframe.style.position = "absolute";
		ret.bgiframe.style.top = "0px";
		ret.bgiframe.style.left = "0px";
		ret.bgiframe.style.width = "100%";
		ret.bgiframe.style.height = "100%";
		ret.main.appendChild(ret.bgiframe);
		ret.bgdiv = document.createElement("div");
		ret.bgdiv.style.position = "absolute";
		ret.bgdiv.style.top = "0px";
		ret.bgdiv.style.left = "0px";
		ret.bgdiv.style.width = "100%";
		ret.bgdiv.style.height = "100%";
		ret.bgdiv.style.backgroundColor = features.style.fill;
		ret.main.appendChild(ret.bgdiv);
		ret.head = document.createElement("div");
		ret.head.style.position = "absolute";
		ret.head.style.top = 0;
		ret.head.style.left = 0;
		ret.head.style.backgroundColor = features.style.headerFill;
		ret.head.style.height = headerheight+"px";
		ret.main.appendChild(ret.head);
		ret.headtxt = document.createElement("span");
		ret.headtxt.style.position = "absolute";
		ret.headtxt.style.width = "100%";
		ret.headtxt.style.fontSize = features.style.headerFontSize + "px";
		ret.headtxt.style.fontFamily = features.style.headerFontFamily;
		ret.headtxt.style.color = features.style.headerFontFill;
		ret.headtxt.style.backgroundImage = "url(headgd.png)";
		ret.head.appendChild(ret.headtxt);
		ret.title = document.createTextNode("");
		ret.headtxt.appendChild(ret.title);
		ret.closea = document.createElement("a");
		ret.closea.href = "javascript:;";
		ret.main.appendChild(ret.closea);
		ret.closeimg = document.createElement("img");
		ret.closeimg.src = "close.gif";
		ret.closeimg.width = 17;
		ret.closeimg.height = 17;
		ret.closeimg.style.border = "0";
		ret.closeimg.style.position = "absolute";
		ret.closeimg.style.right = "0px";
		ret.closea.appendChild(ret.closeimg);
		ret.content = document.createElement("div");
		ret.content.frameBorder = 0;
		ret.content.style.position = "absolute";
		ret.content.style.top = headerheight+"px";
		ret.content.style.left = 0;
		ret.main.appendChild(ret.content);
		ret.iframe = document.createElement("iframe");
		ret.iframe.frameBorder = 0;
		ret.iframe.style.position = "absolute";
		ret.iframe.style.top = 0;
		ret.iframe.style.left = 0;
		ret.iframe.style.width = "100%";
		ret.iframe.style.height = "100%";
		ret.content.appendChild(ret.iframe);
		ret.foreignObjectDiv = document.createElement("div");
		ret.main.appendChild(ret.foreignObjectDiv);
		childwindowsDiv.appendChild(ret.main);

		function disableDragStart(obj) {
			webMI.addEvent(obj, "dragstart", function(e) {
				if (!e)
					e = window.event;

				if (e.preventDefault)
					e.preventDefault();
			});
		};

		disableDragStart(ret.head);

		ret.resizeTo = function(w, h) {
			ret.main.style.width = w+"px";
			ret.main.style.height = h+"px";
			ret.head.style.width = w+"px";
			ret.content.style.width = w+"px";
			ret.content.style.height = (h-headerheight)+"px";
			if (ret.rs) {
				ret.rs.style.left = (w-5)+"px";
				ret.rs.style.top = (h-5)+"px";
			}
		};

		ret.moveTo = function(l, t) {
			function min(a, b) {
				return a < b ? a : b;
			}

			if (l < 0 ) l = 0;
			if (t < 0 ) t = 0;
//				l = min(l, parseInt(mainframe.style.width) - parseInt(ret.main.style.width) - 2);
//				t = min(t, parseInt(mainframe.style.height) - parseInt(ret.main.style.height) - 2);

			ret.main.style.left = l+"px";
			ret.main.style.top  = t+"px";
		};

		ret.setTitle = function(t) {
			ret.title.data = t;
		};

		ret.setURL = function(u) {
			ret.iframe.src = u;

			webMI.addEvent(ret.iframe, "load", function(e) {
				if (ret.closed)
					return;

				webMI.addEvent(contentDocumentOf(ret.iframe), ["click","keypress","touchstart"], function(e) {
					webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"restartTimer"});
				});
				webMI.addEvent(contentDocumentOf(ret.iframe), "touchstart", function(e) {
					ret.iframe.contentWindow.webMI.display.showPopup(0, 0, null);
				});
				consistencyHandler.read();
			});
		};

		function closeInternalPopup() {
			if (!ret.closed) {
				ret.closed = true;
				if (ret.iframe.contentWindow != null)
					tabHandler.removeDoc(contentDocumentOf(ret.iframe),true);

				ret.iframe.src = "";

				if (features.modal)
					decESC();
				childwindowsDiv.removeChild(ret.backgroundDiv);
				childwindowsDiv.removeChild(ret.main);
				webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"removePopup","popup":ret});
				consistencyHandler.pop();

				for (var i = 0; i < mouseMoveFunctions.length; ++i) {
					if (mouseMoveFunctions[i] != ret)
						continue;

					mouseMoveFunctions.splice(i, 1);
					mouseUpFunctions.splice(i, 1);
					break;
				}
			}
		}

		ret.closed = false;
		ret.close = function() {
			/*
				setTimeout is required as a workaround for iPad Issue [AT-D-3275]
				userAgent: Version/5.1 Mobile/9B176 Safari/7534.48.3
				please retest with newer version if Timeout is still required (browser bug)
			*/
			if (isIOSDevice){
				setTimeout(function() {
					closeInternalPopup();
				}, 500);
			}
			else closeInternalPopup();
		};

		ret.getFrame = function() {
			return ret.iframe;
		};

		ret.getForeignObjectContainer = function() {
			return ret.content;
		};

		ret.getContentDocument = function() {
			try {
				return contentDocumentOf(ret.iframe);
			} catch(ex) {
				return null;
			}
		};
		ret.getContentWindowWebMI = function() {
			try {
				if (ret.iframe.contentWindow.webMI){
					return ret.iframe.contentWindow.webMI;
				}
				return null;
			} catch(ex) {
				return null;
			}
		};

		function setVisibility(value) {
			if (!value){
				greatestZIndex++;
				childWindowTopZindex = greatestZIndex;
				ret.main.style.zIndex = childWindowTopZindex;
			}
			ret.content.style.visibility = value ? "" : "hidden";
		};

		if (features.movable) {
			ret.head.style.cursor = "move";

			webMI.addEvent(ret.head, "mousedown", function(e) {
				if (!e)
					e = window.event;

				if (!features.modal) {
					incESC();
					ret.backgroundDiv.style.width = "100%";
					ret.backgroundDiv.style.height = "100%";
				}

				ret.mouseHandler = { _function: ret.moveTo,
					x: parseInt(ret.main.style.left) - e.clientX,
					y: parseInt(ret.main.style.top) - e.clientY};
				setVisibility();
			});
		}

		if (features.resizable) {
			ret.rs = document.createElement("div");
			ret.rs.style.cursor = "se-resize";
			ret.rs.style.position = "absolute";
			ret.rs.style.width = "5px";
			ret.rs.style.height = "5px";
			ret.main.appendChild(ret.rs);

			disableDragStart(ret.rs);

			webMI.addEvent(ret.rs, "mousedown", function(e) {
				if (!e)
					e = window.event;

				if (!features.modal) {
					incESC();
					ret.backgroundDiv.style.width = "100%";
					ret.backgroundDiv.style.height = "100%";
				}

				ret.mouseHandler = { _function: ret.resizeTo,
					x: parseInt(ret.main.style.width) - e.clientX,
					y: parseInt(ret.main.style.height) - e.clientY};
				setVisibility();
			});
		}

		ret.mouseMoveFunction = function(e) {
			var obj = ret.mouseHandler;

			if (obj != null)
				obj._function(obj.x + e.clientX, obj.y + e.clientY);
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

		webMI.addEvent(ret.closea, "click", function() {
			webMI.display.closeWindow(ret);
		});

		webMI.addEvent(ret.iframe,"load", function(){
			var docAct, webMIAct;
			if (ret.iframe.contentWindow){
				if ((docAct = ret.getContentDocument()) != null){
					if (docAct.location.href != "about:blank"){
						tabHandler.registerDisplay(docAct);
						tabHandler.beforeFirstUse(docAct,true);
						if ((webMIAct = ret.getContentWindowWebMI()) != null){
							webMIAct.addOnfocus(function(){
								tabHandler.getFocused(docAct);
							});
							features.close_on_esc && webMIAct.keys.addCombinationListener(0,27,function(e) {
									if (tabHandler.isFocused(docAct) && tabHandler.getAcceptKeys()){
										webMI.display.closeWindow(ret);
									}
								});

						}
					}
					if (isIOSDevice && docAct.documentElement){
						// MobileSafari sometimes expands the normal size of the iframe
						// to the size of width / height svg attributes. Avoid this by
						// removing the attributes so the document will fit automatically.

						docAct.documentElement.removeAttribute("width");
						docAct.documentElement.removeAttribute("height");
					}
				}
			}
		});
		ret.resizeTo(w,h);
		ret.moveTo(x + offsetLeft,y + offsetTop);
		ret.setTitle(features.title);
		ret.setURL(features.url);

		consistencyHandler.push();
		tabHandler.blurFocused();
		tabHandler.renew(features.modal);
		webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"pushPopup","popup":ret});
	}

	return ret;
}

function switchUser(uData){
	if (webMI.display.isRoot() && "preferredlanguage" in uData && "username" in uData &&
		uData.username != "" && uData.preferredlanguage != "" && uData.preferredlanguage != currentLanguage.value) {
			fillCurrentFrame(tabHandler.getIFrameNames(),uData.preferredlanguage);
	}
}

function showPopup(x, y, menu) {
	var showCount = 10000;

	function getHover(color) {
		return function(e) {
			var element = (e.currentTarget != undefined) ? e.currentTarget : e.srcElement;
			element.style.backgroundColor = color;
		};
	};


	function compareMenu(lastMenu, menu) {
		var same = true;
		if (lastMenu != null) {
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

	if (menu != null && !sameMenu && !menu.mouseout) {
		if ("itemsCount" in menu && Number(menu.itemsCount) != 0) showCount = Number(menu.itemsCount);

		lastMenu = menu;
		popupvisible = "visible";

		var styleDefaults = { maxRows: 10, fontSize: 12, fontFamily: "Arial", fontFill: "#000000", width: 140, fill: "#FFFFFF", stroke: "#000000", strokeWidth: 2, hoverFill: "#EFEFEF", closeTime: 500, zIndex: 100, showType: "right" };
		var style = (menu.style != undefined) ? menu.style : {};
		for (var i in styleDefaults) {
			if (style[i] == undefined) {
				style[i] = styleDefaults[i];
			}
		}

		var padding = 3;
		var fontPix = Math.ceil(style.fontSize * 1.3);

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

		function closePopups() {
			if (menuTimer != null) {
				window.clearTimeout(menuTimer);
			}
			menuTimer = window.setTimeout(function() {
				for (var x in popups) {
					popups[x].style.visibility = "hidden";
				}
			}, style.closeTime);
			lastMenu = null;
		};

		function createEntry(parent, menuElement, menuAction, menuElementFn, level, listPos, onDemand) {
			var li = document.createElement("li");
			li.setAttribute("listPos",listPos);
			if (menuElement == ""){/*empty row*/
				li.innerHTML = "&nbsp;";
				parent.appendChild(li);
				return;
			}
			if (level && level < 0){/*scroller*/
				var img = document.createElement("img");
				img.src = menuElement;img.style.height = fontPix+"px";
				img.style.width ="40px";
				li.appendChild(img);li.style.textAlign = "center";

				li.setDisabled = function(){
					img.style.opacity = 0.4;
					img.style.filter = "alpha(opacity=40)";
				};
				li.setEnabled = function(){
					img.style.opacity = 1;
					img.style.filter = "alpha(opacity=100)";
				};
			} else {
//				var a = document.createElement("a");
//				var i_style = "position: absolute; width: 100%; height: 100%; border: 0; z-index: -1;";
				var a_style = "text-decoration: none; color: #000000; cursor: pointer;white-space: nowrap;";
				if (hasVML) {
					li.style.setAttribute("cssText", a_style);
				} else {
					li.setAttribute("style", a_style);
				}
//				a.appendChild(document.createTextNode(menuElement));
//				a.href = "javascript:void(0);";
				li.style.color = style.fontFill;
				li.style.lineHeight = (fontPix+padding)+"px";
//				li.appendChild(a);
				li.appendChild(document.createTextNode(menuElement));
				if (!onDemand) /*wegen onDemand and iPad onmouseover*/
					webMI.addEvent(li, "click", closePopups);
				webMI.addEvent(li, "mouseover", getHover(style.hoverFill));
				webMI.addEvent(li, "mouseout", getHover(style.fill));
			}
			parent.appendChild(li);
			for (var i = 0; i < menuAction.length; ++i) {
				webMI.addEvent(li, menuAction[i], menuElementFn[i]);
			}
		};
		function closeAndOpenPopup(parent,level,i,listPos){
			for (var p in popups) {
				var parts = popups[p].id.split("_");
				if (parts[1] != undefined) {
					var lev = parseFloat(parts[1]);
					if (i && popups[p].id == "popup_"+level+"_"+i && popups[p].parentNode == parent){
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
			var p_style = "position: absolute; visibility: hidden; width: 160px; background-color: #FFFFFF; border: 2px solid #000; padding: 0; margin: 0";
			var curMenulist = (parent) ? document.createElement("UL") : popupmenulist;
			var pm_style = "list-style: none; margin: 0; padding: 3px; margin-left: 5px";

			if (hasVML) {
				curPopup.style.setAttribute("cssText", p_style);
				curMenulist.style.setAttribute("cssText", pm_style);
			} else {
				curPopup.setAttribute("style", p_style);
				curMenulist.setAttribute("style", pm_style);
			}

			var entries = 0;
			var showMenu = 0;

			function showNext(list,step){
				function deltaPos(e){return (e>=0)?1:0;}
				function appendOrRemoveSpacer(showMenu,entries,append){
					var nB;
					if (showMenu <= entries) return;
					list.removeChild(nB = list.lastChild);
					if (append)
						for (var i=0;i<showMenu-entries;i++) createEntry(list,"");
					else
						for (var i=0;i<showMenu-entries;i++) list.removeChild(list.lastChild);
					list.appendChild(nB);
				}
				return function(e) {
					var dP;
					if ((dP=deltaPos(step))==1 && showMenu >= entries || dP==0 && showMenu <= showCount) return;
					if (showMenu > 0) list.firstChild.setEnabled();
					if (showMenu >= entries) list.lastChild.setEnabled();
					appendOrRemoveSpacer(showMenu,entries,false);
					if (dP==1) showMenu += step;
					var lb,corr=((lb = showMenu-showCount+(deltaPos(-step)*step))<0)?Math.abs(lb):0;
					for (var i=1;i<list.childNodes.length-1;i++){
						list.childNodes[i].style.display = ((i-1)>=(lb+corr) && (i-1)<lb+showCount+corr)?"block":"none";
						list.childNodes[i].setAttribute("listPos",i-lb+corr+1);
					}
					if (dP==0) showMenu += step;
					appendOrRemoveSpacer(showMenu,entries,true);
					if (showMenu >= entries) list.lastChild.setDisabled();
					if (showMenu <= showCount) list.firstChild.setDisabled();
				};
			};

			createEntry(curMenulist, "/prev.png",["click"],[showNext(curMenulist,-showCount)],-1);
			for (var i in menu) {
				if (i == "tooltip") {
					var li = document.createElement("li");
					li.style.whiteSpace = "nowrap";
					li.innerHTML = menu.text;
					//li.appendChild(document.createTextNode(menu.text));
					curMenulist.appendChild(li);
					entries++;
					break;
				} else if (i == "languagemenu") {
					function getFn(id) {
						return function() {
							fillCurrentFrame(tabHandler.getIFrameNames(),id);
						};
					};
					for (var id in project.languages) {
						createEntry(curMenulist, project.languages[id], ["click"], [getFn(id)], level, entries+1);
						entries++;
					}
					break;
				} else if (i != "style" && i != "itemsCount") {
					if (menu[i].sub == undefined) {
						function getChangeFn(i, level) {
							return function(e) { closeAndOpenPopup(curPopup,level+1); };
						};
						createEntry(curMenulist, menu[i].text, ["mouseover","click"], [getChangeFn(i,level),menu[i].value], level, entries+1);
						entries++;
				} else if (typeof menu[i].sub == "function") {
						var subLevel = level + 1;
						function getOpenFn1(i,fn,startAdress,level,offset,onclick){
							var clickAdded = false;
							return function(e) {
								var li = (e.currentTarget)?e.currentTarget:e.srcElement;
								var listPos = Number(li.getAttribute("listPos")||"0");
								fn(startAdress,function(tmpObj){
									var subMenu = createMenu(tmpObj, curPopup, offset, i, level,true);
									closeAndOpenPopup(curPopup,level,i,listPos);
									/*wegen onDemand and iPad onmouseover*/
									if (!clickAdded){
										webMI.addEvent(li, "click", closePopups);
										webMI.addEvent(li, "click", onclick);
										clickAdded = true;
									}
								});
							};
						};
						createEntry(curMenulist, i + " >", ["mouseover"], [getOpenFn1(i,menu[i].sub,menu[i].base,subLevel,entries,menu[i].value)], level, entries+1, true);
						entries++;
					} else {
						var subLevel = level + 1;
						var subMenu = createMenu(menu[i].sub, curPopup, entries, i, subLevel);
						function getOpenFn2(i, level) {
							return function(e) {
								var li = (e.currentTarget)?e.currentTarget:e.srcElement;
								var listPos = Number(li.getAttribute("listPos")||"0");
								closeAndOpenPopup(curPopup,level,i,listPos);
							};
						};
						createEntry(curMenulist, i + " >", ["mouseover", "click"], [getOpenFn2(i, subLevel), menu[i].value], level, entries+1);
						entries++;
					}
				}
			}
			createEntry(curMenulist, "/next.png",["click"],[showNext(curMenulist,showCount)],-1);

			if (entries > 0) {
				var height;
				if (entries <= showCount)
					height = ((fontPix+padding) * entries) + 6;
				else
					height = ((fontPix+padding) * (showCount+2)) + 6;
				curPopup.id = "popup_" + level + "_" + name;
				curPopup.appendChild(curMenulist);
				var top = 0;
				var left = 0;
				var innerWidth = webMI.display.isRoot() ? parseFloat(mainFrameHandler.width_) : parseFloat(window.innerWidth);
				var startLeft = 0;
				if (webMI.display.isRoot()) {
					startLeft = ((x + mainFrameHandler.offsetLeft()+style.width) >= innerWidth) ?  innerWidth - (style.width+50) : x + mainFrameHandler.offsetLeft();
				} else {
					//alert(x + " " + style.width + " " + innerWidth);
					startLeft = x + style.width >= innerWidth ? innerWidth - (style.width+50) : x;
				}
				if (parent) {
					top = (fontPix+padding) * (offset);
					/*no window scrolling horizontally*/
					var dir = 1;
					if (style.showType == "right") {
						for (var lev = 0; lev < level; lev++) {
							startLeft += (style.width * dir);
							if (startLeft > mainFrameHandler.width_ - 10) {
								dir = -1;
								startLeft -= 2 * style.width;
							}
							if (startLeft-style.width < 0) {
								dir = 1;
								startLeft += 2 * style.width;
							}
						}
					} else if (style.showType == "alternate")
						dir = (level%2 == 0) ? 1 : -1;

					left = dir*style.width;
					curPopup.style.top  = -mainFrameHandler.height_ + "px";
				} else {

					var innerHeight = webMI.display.isRoot() ? parseFloat(mainFrameHandler.height_) : parseFloat(window.innerHeight);
					if (webMI.display.isRoot()) {
						top = ((y + mainFrameHandler.offsetTop()+height) >= (innerHeight-5)) ? innerHeight - ((height)+50) : y + mainFrameHandler.offsetTop();
					} else {
						top = (y + height) >= (innerHeight-5) ? innerHeight - ((height)+50) : y;
					}
					left = startLeft;
					curPopup.style.top  = top + "px";
				}
				var onlyOnce = false;
				curPopup.topCorrection = function(listPos){
					/*if is scrollable DIV then topCorrection need once*/
					if (entries <= showCount && onlyOnce) return;
					/*mouseover && scrollable -> calculate pos*/
					top = (listPos!=0)?(fontPix+padding) * (listPos-1):top;
					/*no window scrolling  vertically part*/
					curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
					if (curPopup.totalOffset + height > (mainFrameHandler.height_ - 10)) {
						top = top - (curPopup.totalOffset + height - mainFrameHandler.height_) - 30;
						curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
						if (curPopup.totalOffset < 0) {
							top = top - curPopup.totalOffset;
							curPopup.totalOffset = (parent.totalOffset ? parent.totalOffset : parent.offsetTop) + top;
						}
					}
					onlyOnce = true;
					curPopup.style.top  = top + "px";
				};
				curPopup.style.left = left + "px";
				if (typeof style.width == "string" && style.width=="auto"){
					curPopup.style.width = "auto";
				} else if (typeof style.width == "object" && style.width.length == 2 && style.width[0]=="auto"){
					curPopup.style.width = style.width[0];
					if (curPopup.clientWidth < style.width[1]){
						curPopup.style.width = (style.width[1]) + "px";
					}
				} else if (typeof style.width == "number"){
					curPopup.style.width = (style.width) + "px";
				}
				//curPopup.style.width = (style.width) + "px";
				curPopup.style.fontSize = style.fontSize + "pt";
				curPopup.style.fontFamily = style.fontFamily;
				curPopup.style.backgroundColor = style.fill;
				curPopup.style.border = style.strokeWidth + "px solid " + style.stroke;
				curPopup.style.visibility = (parent) ? "hidden" : "visible";
				curPopup.style.zIndex = Math.max(style.zIndex,greatestZIndex);
				if (parent) {
					parent.appendChild(curPopup);
				}
				pushPopups(curPopup,onD);
				webMI.addEvent(curPopup, "mouseout", closePopups);
				webMI.addEvent(curPopup, "mouseover", function(e) {
					if (menuTimer != null) {
						window.clearTimeout(menuTimer);
					}
				});
				if (curPopup.style.width == "auto"){
					var corLeft;
					if (webMI.display.isRoot()) {
						corLeft = ((x + mainFrameHandler.offsetLeft()+curPopup.offsetWidth) >= innerWidth) ?  innerWidth - (curPopup.offsetWidth+50) : x + mainFrameHandler.offsetLeft();
					} else {
						corLeft = x + curPopup.offsetWidth >= innerWidth ? innerWidth - (curPopup.offsetWidth+50) : x;
					}
					curPopup.style.left = corLeft + "px";
				}
				/*First use Scroller*/
				if (entries <= showCount){
					curMenulist.removeChild(curMenulist.firstChild);
					curMenulist.removeChild(curMenulist.lastChild);
				}
				else {
					showNext(curMenulist,showCount).call();
				}
			} else {
				popupvisible = "hidden";
			}
			return curPopup;
		};
		createMenu(menu, null, null, "main", 1);
		for (var p=popups.length; p>0;p--){
			checkPopupsTopParent(p-1);
		}
	} else if (menu == null || sameMenu || !menu.mouseout) {
		popupvisible = "hidden";
		lastMenu = null;
	}

	popup.style.visibility = popupvisible;

}
function setSoundHandler(){
	loopTimeout = {};
	if (audio != undefined) {
		while (audio.hasChildNodes()) {
			audio.removeChild(audio.lastChild);
		}
	}

	function iterArray(arr,fn){
		for (var i=0; i<arr.length; i++) fn(arr[i],i);
	};
	function iterObject(arr,fn){
		for (var obj in arr) fn(arr[obj],obj);
	};
	function createElementWithAttrs(nodeName,attrs){
		var elem = webMI.dom.createElement("http://www.w3.org/1999/xhtml", nodeName);
		iterObject(attrs,function(val,key){
			elem.setAttribute(key,val);
		});
		return elem;
	};
	function play(myAudio,playcount,loop,URL){
		if (loop == 0 || playcount < loop){
			if(!myAudio.ended){
				loopTimeout[URL||myAudio.src] = window.setTimeout(function(){play(myAudio,playcount,loop)},1500);
			}
			else {
				myAudio.play();
				loopTimeout[URL||myAudio.src] = window.setTimeout(function(){play(myAudio,playcount+1,loop)},500);
			}
		}
	};
	function stop(myAudio,URL){
		myAudio.pause();
		clearTimeout(loopTimeout[URL||myAudio.src]);
	};
	audio.appendObject = function(src,loop){
		var object = null;
		if (/MSIE/.test(navigator.userAgent)){
			object = createElementWithAttrs("object",{'width':'0','height':'0','classid':"clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6"});
			audio.appendChild(object);
			object.URL=src;
			if (loop == 0){
				var intervalId = setInterval(function(){object.controls.play();},1000);
				object.setAttribute('intervalId',intervalId,0);
			}
			else {
				object.settings.playCount = loop;
				object.controls.play();
			}
		} else if (/iPad/.test(navigator.userAgent)) {
		} else {
			var audioTagSupport = !!(document.createElement('audio').canPlayType);
			if (audioTagSupport){
				var myAudio = createElementWithAttrs("audio",{'style':'display:none',controls:"true",autoplay:"true"});
				var canPlayWav = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/wav; codecs="1"');
			}
			if (audioTagSupport && canPlayWav && src.indexOf(".wav") != -1){
				myAudio.src = src;
				audio.appendChild(myAudio);
				play(myAudio,1,loop);
			}
			else {
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
	audio.appendEmbed = function(src,loop){
		var embed = null;
		if (loop == 0){
			embed = createElementWithAttrs("embed",{'src':src,'hidden':'true','loop':'true'});
		}
		else {
			embed = createElementWithAttrs("embed",{'src':src,'hidden':'true','playcount':loop});
		}
		audio.appendChild(embed);
		return embed;
	};
	audio.removeAudio = function(url){
		if (url == "undefined") {
			iterArray(audio.childNodes,function(child){
				if (/MSIE/.test(navigator.userAgent))
					clearInterval(child.getAttribute("intervalId"));
				if (child.nodeName.toLowerCase() == "audio")
					stop(child);
				audio.removeChild(child);
			});
			iterObject(loopTimeout,function(obj){clearTimeout(obj);})
		}
		else {
			var obs = [];
			iterArray(audio.childNodes,function(child){
				if (child.nodeName.toLowerCase() == "object") {
					if (/MSIE/.test(navigator.userAgent)){
						if (RegExp(url+"$").test(child.URL)){
							obs[obs.length] = child;
						}
					}
					iterArray(child.childNodes,function(subchild){
						if ( subchild.nodeName.toLowerCase() == "param" && subchild.getAttribute("value") == url ){
							obs[obs.length] = child;
						}
					});
				}
				if ((child.nodeName.toLowerCase()=="embed" && child.getAttribute("src") == url )||
					(child.nodeName.toLowerCase()=="audio" && RegExp(url+"$").test(child.src) ) ){
					obs[obs.length] = child;
				}
			});
			if (obs.length > 0){
				iterArray(obs,function(ob){
					if (/MSIE/.test(navigator.userAgent))
						window.clearInterval(ob.getAttribute("intervalId"));
					if (ob.nodeName.toLowerCase() == "audio")
						stop(ob);
					audio.removeChild(ob);
				});
			}
		}
	};
	webMI.sound.setHandler(audio.appendObject,audio.removeAudio);
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
			popupmenulist = popup.appendChild(document.createElement("ul"));
			audio = extensionsDiv.appendChild(document.createElement("div"));
			setSoundHandler();
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
	if (type == "loadedmainframe"){
		if (webMI.display.isRoot()) {
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Alarmmanagement", {"id": ""});
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoReconnect", {"activated":"true", "interval":"5", "defaultconfiguration": true});
		}
		webMI.addEvent(contentDocumentOf(v1), ["click","keypress","touchstart"], function(e) {
			webMI.callExtension("SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoLogout", {"action":"restartTimer"});
		});
		webMI.addEvent(contentDocumentOf(v1), "touchstart", function(e) {
			v1.contentWindow.webMI.display.showPopup(0, 0, null);
		});

		if("scrolling" in webMI.query)
			v1.scrolling = webMI.query["scrolling"];

		if (typeof v1.contentWindow.webMI == "undefined"){
			webMI.query.preload = false;
		}
		if (currentFrame.length > 0){
			for (var i=0;i<currentFrame.length;i++){
				webMI.display.openDisplay(currentFrame[i].display.replace(displaysJs["postfix"],""), webMI.query, currentFrame[i].name);
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

webMI.data.subscribe(base.nodeId, function(e) {
	var value = e.value;
	webMI.gfx.setRotation(base.id, webMI.translate(value, base.minValue, base.maxValue, base.startAngle, base.stopAngle));
});
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

var doc = top.document;
var emptyFrameName = "emptyframe";
var iframe = doc.getElementById(emptyFrameName);
if (iframe != null)
	return triggerSaveAsDialog();
if (top["NO-EXPORT-SCRIPT"])
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
		top["NO-EXPORT-SCRIPT"] = true;
		openDataDialog();
	}
});

},{"name":"filename.txt","type":"text/plain","action":"export","method":"post","enctype":"application/x-www-form-urlencoded"}],
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
	var p = webMI.gfx.createPoint(e.clientX, e.clientY);

	if (element && element.ownerDocument != document) {
		// element is not in SVG document, so it is most likley a foreignObject
		p = p.matrixTransform(webMI.gfx.getScreenCTM(base.id).inverse())
			 .matrixTransform(webMI.gfx.getScreenCTM());
	}

	tempObj.mouseout=false;
	webMI.display.showPopup(p.x, p.y + 20, tempObj);
});

webMI.addEvent(base.id, "mouseout", function(e) {
	tempObj.mouseout=true;
	webMI.display.showPopup(x, y, tempObj);
});

webMI.addOnunload(function() {
	webMI.display.showPopup(x, y, null);
});
},{"text":""}],
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

webMI.data.subscribe(base.nodeId, function(e) {
	var value = e.value;

	if (typeof value == "boolean" || typeof value == "string") {
		webMI.gfx.setText(base.id, value);
	} else {
		webMI.gfx.setText(base.id, webMI.sprintf(format, value));
	}
	//CR: Was machen wir mit nodes vom Type "DateTime"?
});
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
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Tab Handler":[function(base,webMI,window,document,self){
if (typeof this.data === "undefined") {
	this.data = { "arr_indexed": [], "arr_not_indexed": [], "act_tab": {"array":null,"index":null}, "act_doc": null, "parent_doc": null, "prev_doc": null };
	this.doc_storage = [];
	this.acceptKeys = {"accept":true, "preventFirst":false};
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
	pushToStorage(doc,null,null);
}
function blurFocused(){
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
	if (!acceptKeys.accept || isFocused(doc)) return;
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
	return (doc == data.act_doc);
}
function removeDoc(doc, switchToParent){
	removeFromStorage(doc,switchToParent);
}
function setCurrentIndex(keyHandler, callback){
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
	} else 	if (data.act_tab.array == "not_indexed") {
		data.arr_not_indexed[data.act_tab.index].keyHandler.call(this,"focus");
	}
	if (callback && (typeof retValBlur === "undefined" || (typeof retValBlur === "boolean" && !retValBlur))){
		callback.call(this);
	}
}
function renew(modal){
	/*if external, internal not modal or prev_doc is null*/
	if (typeof modal === "undefined" || modal || data.prev_doc == null) data.prev_doc = data.act_doc;
	data.arr_indexed = [];
	data.arr_not_indexed = [];
	data.act_tab = {"array":null,"index":null};
	data.act_doc = null;
	data.parent_doc = null;
}
function changeDisplay(){
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
		if (iframes[i].name == fname) return iframes[i].frame;
	}
	return null;
}
function setIFrameHasEvent(frame){
	for (var i=0;i<iframes.length;i++){
		if (iframes[i].frame == frame) iframes[i].hasevent = true;
	}
}
function hasIFrameEvent(frame){
	for (var i=0;i<iframes.length;i++){
		if (iframes[i].frame == frame) return iframes[i].hasevent;
	}
	return false;
}
function setIFrameLoaded(frame,bool){
	for (var i=0;i<iframes.length;i++){
		if (iframes[i].frame == frame) iframes[i].loaded = bool;
	}
}
function areAllIFrameLoaded(){
	for (var i=0;i<iframes.length;i++){
		if (!iframes[i].loaded) return false;
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
function addAfterIFrameLoad(fun){
	var find = false;
	for (var i=0;i<afterLoadCallbacks.length;i++){
		if (afterLoadCallbacks[i]==fun) find = true;
	}
	if (!find) afterLoadCallbacks.push(fun);
}
function runAfterIFrameLoad(){
	for (ali=0;ali<afterLoadCallbacks.length;ali++){
		afterLoadCallbacks[ali].call(this);
	}
	afterLoadCallbacks.length = 0;
}
function setAcceptKeys(bool){
	acceptKeys.accept = bool;
}
function setAcceptKeysPrevent(bool){
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
	if (window.getComputedStyle) {
		var computedStyle = window.getComputedStyle(element);
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

if (base.activate == "false"){
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
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.AutoReconnect":[function(base,webMI,window,document,self){
var self = this;

if (!this.initialized || base.defaultconfiguration == "false") {
	this.activated = base.activated == "true";
	this.interval = parseInt(base.interval);
	this.keepalive = parseInt(base.keepalive);

	webMI.setConfig("data.keepaliveinterval", this.keepalive * 1000);
}

if (this.initialized)
	return;

var connecting = false;
var connectingText = "Connecting ...";
var reconnectingText = "Retry in %d second(s) ...";
var seconds = 0;
var state = 0;
var statusBar = createElement("div", {}, {
	"backgroundColor": "red",
	"bottom": 0,
	"color": "yellow",
	"fontFamily": "Arial",
	"fontWeight": "bold",
	"display": "none",
	"height": "35px",
	"lineHeight": "35px",
	"position": "absolute",
	"textAlign": "center",
	"width": "100%",
	"zIndex": 999
}, top.document.body);

webMI.addEvent(webMI.data, "statechange", function(s) {
	state = s;
});

setInterval(function() {
	if (!self.activated || state > -1 || connecting)
		return;

	setStatusText(webMI.sprintf(reconnectingText, self.interval - seconds));

	if (seconds >=  self.interval) {
		connecting = false;
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
}, 1000);

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
		top.window.location.reload(true);
	else {
		connecting = false;
		var topErrorScreen = top.document.getElementById("errorscreen");
		if (topErrorScreen)
			topErrorScreen.style.display = "block";
	}
}
},{"activated":"true","interval":"5","defaultconfiguration":"false","keepalive":"4"}],
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


webMI.data.subscribe(base.nodeId, function(e) {
	var value = e.value;
	if (base.StartFill != "" && base.StopFill != "") {
		webMI.gfx.setFillOpacity(base.id, webMI.translate(value, base.minRange, base.maxRange, base.StartFill, base.StopFill));
	}
	if (base.StartStroke != "" && base.StopStroke != "") {
		webMI.gfx.setStrokeOpacity(base.id, webMI.translate(value, base.minRange, base.maxRange, base.StartStroke, base.StopStroke));
	}
});
},{"nodeId":"","minRange":"0","maxRange":"100","StartFill":"0","StopFill":"1","StartStroke":"","StopStroke":""}],
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Open Main Menu":[function(base,webMI,window,document,self){
var styleDefaults = { fontFamily: "Arial", fontSize: base.fontSize, fontFill: "#000000", width: parseInt(base.minWidth,10), fill: "#c7c7c7", stroke: "#393939", strokeWidth: 1, hoverFill: "#fcec3c", closeTime: 0 };

var frameName = base.frameName ? base.frameName : "content";
var itemsCount = base.itemsCount ? base.itemsCount : "0";

var menuMain = {};
var menuUser = {};
var menuSystem = {};
var menuReport = {};

function getDisplayFn(display) {
	return function(e) {
		webMI.display.openDisplay(display,webMI.query,frameName);
	};
}

function getUrlFn(url) {
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
				if (menuItem.sub) {
					if (!atviseDefault(menuItem.name)) {
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
				switch(menuItem.name) {
					case "MAIN": menuMain = addEntry(menuMain, menuObj); break;
					case "USER": menuUser = addEntry(menuUser, menuObj); break;
					case "SYSTEM": menuSystem = addEntry(menuSystem, menuObj); break;
					case "REPORT": menuReport = addEntry(menuReport, menuObj); break;
					default: break;
				}
			};

			for (var i in displayConfig.menu) {
				var menuObj = { };
				var menuItem = displayConfig.menu[i];
				if (menuItem) {
					createMenu(menuObj, menuItem);
				}
			}
		}
	}
});

var tempObj = {};
tempObj.style = styleDefaults;
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
	var p = webMI.gfx.createPoint(base.x,base.y).matrixTransform(webMI.gfx.getScreenCTM());
	webMI.display.showPopup(p.x, p.y, tempObj);
});

webMI.addOnunload(function() {
	webMI.display.showPopup(0, 0, null);
});
},{"x":"","y":"","onEvent":"click","name":"MAIN","frameName":"content","itemsCount":"0","fontSize":"12","minWidth":"160"}],
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

var alarms = [];

function initializeAlarmmanagement(alarmmanagement) {
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
						webMI.display.openDisplay((alarms[i][3]).text);
						break;
					}
				}
			}
		});
	}

	alarmmanagement["subscriptionId"] = webMI.data.subscribeFilter({ type: ["v:2"] }, function(e) {
		(e.state > 0) ? addAlarmItem(e) : removeAlarmItem(e, true);
		webMI.trigger.fire("com.atvise.alarms_notify_item", e);
	});

	function addAlarmItem(itm) {
		if (itm.state == 1 || itm.state == 3) {
			var datarow = [];
			if (itm.address) {
				datarow.id = itm.address;
				datarow.item = itm;
				datarow[0] = { name: "display", text: itm.display ? itm.display : "" };
				datarow[1] = { name: "status", text: itm.state ? itm.state : -1 };
				datarow[2] = { name: "timestamp", text: itm.timestamp ? new Date(itm.timestamp).toSortableString() : "" };
				datarow[3] = { name: "replaceddisplay", text: itm.display ? webMI.sprintf(itm.display, itm) : "" };
				updateItem(datarow, "id");
				webMI.trigger.fire("com.atvise.alarms_notify", true);
			}
		} else if (itm.state == 2) {
			removeAlarmItem(itm, true);
		}
	};

	function removeAlarmItem(itm,refresh) {
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

if (typeof this.alarmmanagement === "undefined")
	this.alarmmanagement = {"subscriptionId": null};

initializeAlarmmanagement(this.alarmmanagement);
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.Node Description":[function(base,webMI,window,document,self){
webMI.data.call("get_node_descr", {"node": base.node, "limit": base.limit}, function(f) {
	var value = f.result;
	webMI.gfx.setText(base.id, value);
});
},{}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO Alarms List":[function(base,webMI,window,document,self){
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
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Open Context Menu":[function(base,webMI,window,document,self){
var styleDefaults = { fontFamily: "Arial", fontSize: base.fontSize, fontFill: "#000000", width: parseInt(base.minWidth,10), fill: "#FFFFFF", stroke: "#000000", strokeWidth: 2, hoverFill: "#EFEFEF", closeTime: 0 };

function getFn(val) {
	return function() {
		if (base.trigger != undefined) {
			webMI.trigger.fire(base.trigger, val);
		}
		if (base.outputNode != "") {
			webMI.data.write(base.outputNode, val);
		}
		var p = webMI.gfx.createPoint(base.x,base.y).matrixTransform(webMI.gfx.getScreenCTM());
		webMI.display.showPopup(p.x, p.y, null);
	};
}
function closeContextMenu(){
	webMI.display.showPopup(0, 0, null);
}
function openContextMenu(){
	if (!base.active || base.active()) {
		var p = webMI.gfx.createPoint(base.x,base.y).matrixTransform(webMI.gfx.getScreenCTM());
		if (base.menuObj && typeof base.menuObj == "function"){ //showPopup in callback
			base.menuObj(function(tempObj){
				tempObj.style = styleDefaults;
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
	tempObj.style = styleDefaults;
	tempObj.itemsCount = base.itemsCount;
} else if (base.menuObj != undefined && typeof base.menuObj == "function") {
	//tempObj calculate dinamically in Event
} else {
	tempObj = { style: styleDefaults, itemsCount: base.itemsCount };
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
webMI.addOnunload(closeContextMenu);
},{"x":"","y":"","key1":"","value1":"","key2":"","value2":"","key3":"","value3":"","key4":"","value4":"","key5":"","value5":"","trigger":"","outputNode":"","onEvent":"click","itemsCount":"0","fontSize":"12","minWidth":"180"}],
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

	var screenCTM =	webMI.gfx.getScreenCTM();
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

webMI.data.subscribe(base.nodeId, function(e) {
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
});
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

webMI.data.subscribe(base.nodeId, function(e) {
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
});
},{"minRange":"0","strokeColorInRange":"#00ff00","strokeWidthInRange":"1","strokeOpacityInRange":"1","strokeColorOutRange":"#aa0000","strokeWidthOutRange":"2","strokeOpacityOutRange":"1"}],
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO Device Main Page":[function(base,webMI,window,document,self){
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
"SYSTEM.LIBRARY.ATVISE.QUICKDYNAMICS.Change Display by Node":[function(base,webMI,window,document,self){
// This Quick Dynamic opens a new display if the value of the node defined by "nodeId" lies within the range defined by "minRange" and "maxRange".
// Parameters:
//	nodeId:		node triggering this Quick Dynamic
//	minRange:	lower bound of the range where the node's value should lie in
//	maxRange:	upper bound of the range where the node's value should lie in; if not specified it will be set to "minRange", i.e. the quick dynamic will be triggered at a
//				discrete value (minRange=maxRange=value) only and not for a range
//	Display:	the display which shall be opened

webMI.data.subscribe(base.nodeId, function(e) {
	var value = e.value;

	if (String(base.maxRange) == "") {
		var maxRange=base.minRange; // If no maxRange is specified, the Display will only be opened at a discrete value (value = minRange = maxRange)
	} else {
		var maxRange = parseFloat(base.maxRange);
	}
	if (value >= base.minRange && value <= maxRange) {
		webMI.display.openDisplay(base.display, {});
	}
});
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
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO Device Trend Page":[function(base,webMI,window,document,self){
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
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO Device Alarms Page":[function(base,webMI,window,document,self){
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
"SYSTEM.LIBRARY.CAREL.QUICKDYNAMICS.PVPRO Device Parameters Page":[function(base,webMI,window,document,self){
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

webMI.data.subscribe(base.nodeId, function(e) {
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
});
},{"nodeId":"","minRange":"","maxRange":"","VisibilityBelowRange":"Flash every 500ms","VisibilityInRange":"Visible","VisibilityAboveRange":"Flash every 1500ms"}]}};project.quickdynamics=project.extensions;