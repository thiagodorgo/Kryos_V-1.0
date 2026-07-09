<%@page import="com.carel.supervisor.presentation.svgmaps.SvgMapsUtils"%>
<%@page import="com.carel.supervisor.dataaccess.language.LangMgr"%>
<%@page import="com.carel.supervisor.dataaccess.language.LangService"%>
<%@page import="com.carel.supervisor.director.packet.PacketMgr"%>
<%@ page language="java" pageEncoding="UTF-8"
import="java.io.*"
import="java.util.Collection"
import="java.util.Iterator"
import="com.carel.supervisor.presentation.helper.ServletHelper"
import="com.carel.supervisor.presentation.session.UserSession"
import="com.carel.supervisor.presentation.session.UserTransaction"
import="com.carel.supervisor.presentation.bo.master.IMaster"
import="com.carel.supervisor.presentation.tabmenu.MenuBuilder"
import="com.carel.supervisor.presentation.menu.configuration.MenuTabMgr"
import="com.carel.supervisor.presentation.devices.*"
import="com.carel.supervisor.presentation.bean.*"
import="com.carel.supervisor.base.io.Unzipper"
import="com.carel.supervisor.base.config.BaseConfig"
import="com.carel.supervisor.presentation.svgmaps.SvgMapsTranslator"
import="com.carel.supervisor.base.config.*"
%>
<%
		
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	UserTransaction trxUser = sessionUser.getCurrentUserTransaction();
	String pathMap = trxUser.getProperty("pathmap"); //pagina IDE custom
	String session_lang = sessionUser.getLanguage();
	String lang_code = session_lang.split("_")[1];
	String lang_request = "en";
	
	LangService lan = LangMgr.getInstance().getLangService(session_lang); 
	
	ServletContext context = pageContext.getServletContext();
	
	if((pathMap == null) || (pathMap == ""))
		pathMap = sessionUser.getProperty("layedmap"); //pagina da LayoutEditor x preview
	else
		pathMap = "mstrmaps/" + pathMap; //chiamata a pagina custom
	
	if((pathMap==null)||(pathMap==""))
		pathMap="mstrmaps/1.jsp"; //pagina iniziale di default

	String pageLoad= "../../app/"+pathMap; //path finale da caricare
	
	String pageFileCheck = BaseConfig.getAppHome()+File.separator+"app"+File.separator+pathMap;	
	String device_access = sessionUser.getPropertyAndRemove("deviceaccess");
	
	
	boolean exist = new File(pageFileCheck).exists();  //check if file exist layout editor maps
	boolean svgMapInstalled = false;
	
	// Per generazione combo in dettaglio
	GroupListBean groups = sessionUser.getGroup();
	int[] gids = groups.getIds();
	DeviceStructureList deviceStructureList = groups.getDeviceStructureList(); 
	int[] ids = deviceStructureList.retrieveIdsByGroupsId(gids);
	sessionUser.getTransaction().setIdDevices(ids);
	sessionUser.getTransaction().setIdDevicesCombo(ids);
	
	String strValueNote = ProductInfoMgr.getInstance().getProductInfo().get("value_note");
	boolean bValueNote = strValueNote != null && (strValueNote.equalsIgnoreCase("yes") || strValueNote.equalsIgnoreCase("true"));
%>
<head>
    <base id="basePath" href="<%=basePath%>">
</head> 

<input type="hidden" id="dev_access" value="<%=device_access%>" />

<%if (exist) { 
%>
<jsp:include page="<%=pageLoad%>" flush="true" />
<% }  
else
{
	try {
		
		//File svgMapsScriptFile = new File(SvgMapsUtils.getSvgMapsRoot() +"/webmi.js");
		// Are there the SVG maps into mstrmaps?
		if (SvgMapsUtils.checkSvgMaps(context, false)) {
			
			// check if the files have been compressed (gzipped) by atvise builder. If so, decompress them before loading
			SvgMapsUtils.unzipMaps(SvgMapsUtils.getSvgMapsRoot(context, false));
			
		    SvgMapsUtils.modifyWebMIContext(SvgMapsUtils.getSvgMapsRoot(context, false) +"/webmi.js");
		    
		    svgMapInstalled = true;
		    
		    // verify if Atvise pages are translated in the language on session. If not, use EN by default.
		    if (SvgMapsUtils.checkLanguageTranslation(lang_code, context, false))
		    		lang_request =  lang_code;		
		}
	 } catch (Exception e) {
		 e.printStackTrace();

	 }
	
	if (svgMapInstalled)
    {
	 // we include the SVG maps only if they're actually there. %> 
	    	<iframe id="map" src="./app/mstrmaps/svgmaps/index.htm?language=<%=lang_request%>&autofit=true&displaytype=svg&scrolling=no" style="position:fixed;top:0px;left:0px;width:100%;border:0px;margin:0px;padding:0px;"></iframe>
			<% if (bValueNote) { %>
				<%= SvgMapsUtils.getMapNoteDialog(lan) %>
			<% } %>
			<script>
			<% if (bValueNote) { %>
				const iframe = document.getElementById('map');
				const iframeWin = iframe.contentWindow || iframe;
				const iframeDoc = iframe.contentDocument || iframeWin.document;
				appendJsListenerForNotes(iframeDoc);
			<% } %>
			$(document).ready(function () {
				document.getElementById("map").style.height = $(top.window).height() - 50 + "px";
				$(top.window).resize(function() {
					document.getElementById("map").style.height = $(this).height() - 50 + "px";
				});
			});
			</script>
   <%}
}
%>
