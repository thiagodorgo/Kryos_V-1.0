<%@page language="java" 
	import="com.carel.supervisor.presentation.sdk.util.Sfera"
	import="com.carel.supervisor.dataaccess.language.LangService"
	import="com.carel.supervisor.dataaccess.language.LangMgr"
	import="com.carel.supervisor.presentation.session.UserSession"
	import="java.util.*"
%>
<%@page import="com.carel.supervisor.presentation.helper.ServletHelper" %>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<%
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);

	String curDIV = sessionUser.getPropertyAndRemove("customTab");
	if(curDIV != null)
	{
		sessionUser.getCurrentUserTransaction().setProperty("customTab",curDIV);
	}
	else
	{
		curDIV = sessionUser.getCurrentUserTransaction().getProperty("customTab");
		if(curDIV == null || curDIV.length() ==0)
			curDIV = "0";
	}
	
	CurrUnit.setCurrentSession(sessionUser);	
	CurrUnit.loadAlarms();
	int num_alarms = CurrUnit.getAlarmNumber();
	String language = sessionUser.getLanguage();
	LangService lan = LangMgr.getInstance().getLangService(language);
	
	String din = lan.getString("pChrono","din");
	String spv_gl = lan.getString("pChrono","spv_gl");
	String spv = lan.getString("pChrono","spv");
	String aout = lan.getString("pChrono","aout");
	String dout = lan.getString("pChrono","dout");
	String pos_gen_fun = lan.getString("pChrono","pos_gen_fun");
	String lux = lan.getString("pChrono","lux");
	String light_mng_type = lan.getString("pChrono","light_mng_type");
	String gen_load_mng_type = lan.getString("pChrono","gen_load_mng_type");
	String gen_func_type = lan.getString("pChrono","gen_func_type");
	String gen_func_output_type = lan.getString("pChrono","gen_func_output_type");
	String mon = lan.getString("cal","mon");
	String tue = lan.getString("cal","tue");
	String wed = lan.getString("cal","wed");
	String thu = lan.getString("cal","thu");
	String fri = lan.getString("cal","fri");
	String sat = lan.getString("cal","sat");
	String sun = lan.getString("cal","sun");
	String months[] = {
			"",
			lan.getString("cal","january") ,
			lan.getString("cal","february"),
			lan.getString("cal","march"),
			lan.getString("cal","april"),
			lan.getString("cal","may"),
			lan.getString("cal","june"),
			lan.getString("cal","july"),
			lan.getString("cal","august"),
			lan.getString("cal","september"),
			lan.getString("cal","october"),
			lan.getString("cal","november"),
			lan.getString("cal","december")
		};
	String nameStr = "-@A@B@C@D@E@F@G@H@I@J@K@L@M@N@O@P@Q@R@S@T@U@V@W@X@Y@Z@a@b@c@d@e@f@g@h@i@j@k@l@m@n@o@p@q@r@s@t@u@v@w@x@y@z@0@1@2@3@4@5@6@7@8@9@.@,@/@#@;@:@*@'@^@ ";
	String [] nameStrArray = nameStr.split("@");
	String addexcep = lan.getString("dtlview","addexcep");
	String from = lan.getString("alrsearch","from");
	String to = lan.getString("alrsearch","to");
	String noexcep = lan.getString("dtlview","noexcep");
	String periodsel = lan.getString("dtlview","periodsel");
	String remove = lan.getString("setaction","del");
	String maxexcepreach = lan.getString("dtlview","maxexcepreach");
	String listexcep = lan.getString("dtlview","listexcep");
	String noconnect = lan.getString("pChrono","noconnect");
	String tbuse = lan.getString("pChrono","tbuse");
	String pduse = lan.getString("pChrono","pduse");
	String period = lan.getString("evnsearch","period");
	String disable = lan.getString("setline","disab");
	String enable = lan.getString("pChrono","enable");
	String time = lan.getString("report","time");
	String tb = lan.getString("pChrono","tb");
	String swch = lan.getString("switch","switch");
	String stop = lan.getString("parameters","stop");
	String start = lan.getString("parameters","start");
	String status = lan.getString("switch","status")+":";
	String power = lan.getString("energy","power")+":";
	String energy = lan.getString("plugin","EG")+":";
%>
<script type="text/javascript" src="scripts/app/calendar.js"></script>
<script type="text/javascript" src="scripts/arch/arkustom.js"></script>
<script type="text/javascript" src="custom/dtlview/pChrono/pgloads.js"></script>
<link rel="stylesheet" href="custom/dtlview/pChrono/pgloads.css" type="text/css" />
<link rel="stylesheet" href="stylesheet/keyboard.css" type="text/css" />  
<INPUT type="hidden" id="invaliddate" name="invaliddate" value="<%=lan.getString("kpiresult","invaliddate")%>" />
<form id="changeCusTab" name="changeCusTab" action="#"></form>
<table width="860px" height="15px"  border="0" cellpadding="10" cellspacing="10" style="vertical-align: top;">
	<tr>
	<td width='100px' height='30px' id="tab0" class="groupCategorySelected_small" style="text-transform:uppercase;text-decoration:underline" onclick="changeSubTab2(0)"><%=lan.getString("pChrono","schdus") %></td>
	<td width='100px' height='30px' id="tab1" class="groupCategory_small" onclick="changeSubTab2(1)"><%=lan.getString("energy","table_ex") %></td>
	<td width='100px' height='30px' id="tab2" class="groupCategory_small" onclick="changeSubTab2(2)"><%=lan.getString("lucinotte","luci") %></td>
	<td width='100px' height='30px' id="tab3" class="groupCategory_small" onclick="changeSubTab2(3)"><%=lan.getString("pChrono","pumps") %></td>
	<td width='100px' height='30px' id="tab4" class="groupCategory_small" onclick="changeSubTab2(4)"><%=lan.getString("pChrono","loads") %></td>
	<td width='100px' height='30px' id="tab5" class="groupCategory_small" onclick="changeSubTab2(5)"><%=lan.getString("pChrono","functions") %></td>
	<td width='100px' height='30px' id="tab6" class="groupCategory_small" onclick="changeSubTab2(6)"><%=lan.getString("pChrono","sockets") %></td>
	<td width='100px' height='30px' id="tab7" class="groupCategory_small" onclick="changeSubTab2(7)"><%=lan.getString("pChrono","wireLess") %></td>
	</tr>
</table>
<br/>
<%if(curDIV.equals("0")){ %>
	<jsp:include page="schedulers.jsp" flush="true" />
<%}else if(curDIV.equals("1")){ %>
	<jsp:include page="exceptions.jsp" flush="true" />
<%}else if(curDIV.equals("2")){ %>
	<jsp:include page="lights.jsp" flush="true" />
<%}else if(curDIV.equals("3")){ %>
	<jsp:include page="pumps.jsp" flush="true" />
<%}else if(curDIV.equals("4")){ %>
	<jsp:include page="genericLoads.jsp" flush="true" />
<%}else if(curDIV.equals("5")){ %>
	<jsp:include page="genericFunction.jsp" flush="true" />
<%}else if(curDIV.equals("6")){ %>
	<jsp:include page="wirelessSocket.jsp" flush="true" />
<%} else if(curDIV.equals("7")){ %>
	<jsp:include page="wireless.jsp" flush="true" />
<%} %>
<script >
changeSubTabCss('<%=curDIV%>');
PVPK_ActiveRefresh(30);	
</script>
<script defer="defer">
unlockModUser();
topLayout();
</script>



