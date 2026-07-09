<%@ page language="java" 
%>
<%@ page import="com.carel.supervisor.presentation.session.UserSession" %>
<%@ page import="com.carel.supervisor.presentation.helper.ServletHelper" %>
<%@ page import="com.carel.supervisor.dataaccess.language.LangService" %>
<%@ page import="com.carel.supervisor.dataaccess.language.LangMgr" %>
<%@ page import="com.carel.supervisor.script.EnumerationMgr" %>
<%@ page import="com.carel.supervisor.dataaccess.datalog.impl.VarphyBeanList" %>
<%@ page import="com.carel.supervisor.dataaccess.datalog.impl.VarphyBean" %>
<%!
	public String formatWordIntToHex(String intNum)
	{
		String hexnum = "";
		int intnum = 0;
		try
		{
			intnum = Integer.parseInt(intNum);
			hexnum = Integer.toHexString(intnum);
			int len = hexnum.length();
			
			for(int i=0; i<len && hexnum.length() > 4; i++)
			{
				if((hexnum.substring(0,1)).equalsIgnoreCase("f"))
				{
					hexnum = hexnum.substring(1, hexnum.length());
				}
			}
		
			for (int i=hexnum.length(); i<4; i++)
			{
				hexnum = "0"+hexnum;
			}
		}
		catch (Exception e)
		{
			hexnum = intNum;
		}
		
		return hexnum;
	}
%>

<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<%
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);	
	LangService lan = LangMgr.getInstance().getLangService(sessionUser.getLanguage());
	// TODO : soluzione temporanea = da risolvere usando SDK
	VarphyBean i17var = VarphyBeanList.retrieveVarByCode(sessionUser.getIdSite(),"i17",CurrUnit.getId(),lan.getLanguage());
	String i17desc = EnumerationMgr.getInstance().getEnumCode(i17var.getIdMdl(), Float.parseFloat(CurrUnit.getVariable("i17").getValue()),lan.getLanguage());
%>
<div class='col-xs-12 col-sm-6 col-md-3 col-lg-3 vpadding'>
	<button class='btn btn-default form-control arrow-cursor'>
	<%=CurrUnit.getVariable("d1").getRefreshableAssint("<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>Unit Off</div>;<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led online-color'></span></div><div class='col-xs-11' align='left'>Unit On</div>","<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>Unit Off</div>")%>
	</button>
</div>
<div class="tdfisa" style="text-align: left">
	<%= CurrUnit.getVariable("i17").getDescription()%>
</div>
<div>
	<%= "<div class='lcd' style='text-align:center'><div class='lcdValue' style='width:60%'><b>" + i17desc + "</b></div><div class='clr'></div></div>"%>
</div>
<%
	String result = "";
	String humProbeAbsence = CurrUnit.getVariable("d11").getValue();
	// 0 = sonda umidita' presente ; 1 = sonda umidita' assente
	if (humProbeAbsence.equals("0")) 
	{
%>
<div class="tdfisa" style="text-align: left">
	<%=CurrUnit.getVariable("a7").getDescription()%>
</div>
<div>
	<%= "<div class='lcd' style='text-align:center'><div class='lcdValue' style='width:60%'><b>" + CurrUnit.getVariable("a7").getValue() + "</b></div><div class='lcdMeasure'>[" + CurrUnit.getVariable("a7").getMUnit() + "]</div><div class='clr'></div></div>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=CurrUnit.getVariable("a8").getDescription()%>
</div>
<div>
	<%= "<div class='lcd' style='text-align:center'><div class='lcdValue' style='width:60%'><b>" + CurrUnit.getVariable("a8").getValue() + "</b></div><div class='lcdMeasure'>[" + CurrUnit.getVariable("a8").getMUnit() + "]</div><div class='clr'></div></div>"%>
</div>
<%
	} else {
%>
<div class="tdfisa" style="text-align: left">
	<%=CurrUnit.getVariable("a1").getDescription()%>
</div>
<div>
	<%= "<div class='lcd' style='text-align:center'><div class='lcdValue' style='width:60%'><b>" + CurrUnit.getVariable("a1").getValue() + "</b></div><div class='lcdMeasure'>[" + CurrUnit.getVariable("a1").getMUnit() + "]</div><div class='clr'></div></div>"%>
</div>
<%	} %>




