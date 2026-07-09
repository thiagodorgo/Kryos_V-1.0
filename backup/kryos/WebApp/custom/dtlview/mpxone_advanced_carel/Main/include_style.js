webMI.addOnload(function(e) {
	var svg = this.document.documentElement;
	var linkElm = this.document.createElementNS("http://www.w3.org/1999/xhtml", "link");
	var no_cash_url = "/boss/app/mstrmaps/svgmaps/style.css?t=" + new Date().getTime();
	linkElm.setAttribute("href", no_cash_url);
	linkElm.setAttribute("type", "text/css");
	linkElm.setAttribute("rel", "stylesheet");
	svg.appendChild(linkElm);
	svg.style.userSelect = "none";
	svg.style.webkitUserSelect = "none";
});