<%@ page language="java" 
%>
<%@ page import="com.carel.supervisor.presentation.session.UserSession" %>
<%@ page import="com.carel.supervisor.presentation.helper.ServletHelper" %>
<%@ page import="com.carel.supervisor.dataaccess.language.LangService" %>
<%@ page import="com.carel.supervisor.dataaccess.language.LangMgr"%>

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

	public int calcGeneralCount(String _HSBcount ,String _LSBcount){
		int result = 0, tempHSB = 0, tempLSB = 0;
		int cHigh = 65536;
		int cLow = 32768;
		try{
			tempHSB = Integer.parseInt(_HSBcount.replaceAll(",",""));
			tempLSB = Integer.parseInt(_LSBcount.replaceAll(",",""));
			if (tempLSB >= 0) 
				result = tempHSB * cHigh + tempLSB;
			else
				result = tempHSB * cHigh + (cLow - tempLSB);
		}catch(Exception e){
			result = -1;
		}
		return result;
	}
%>

<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<%
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	LangService lan = LangMgr.getInstance().getLangService(sessionUser.getLanguage());
	String macaddrTitle = lan.getString("devcustomstr","macaddr2w");
	String generalCount1Title = lan.getString("devcustomstr","generalcount1tit");
	String generalCount2Title = lan.getString("devcustomstr","generalcount2tit");
%>

<div class="tdfisa" style="text-align: left">
	<%=CurrUnit.getVariable("IR1").getDescription()%>
</div>
<div>
	<%
		String result = "";
		String fw_vers = CurrUnit.getVariable("IR1").getValue();
		if (!fw_vers.equals("***"))
		{
			fw_vers = fw_vers.replaceFirst(",","");
			int fw = (new Integer(fw_vers)).intValue();
			int fw_h = (fw / 256);
			int fw_l = (fw % 256);
			if(fw_l<10)
				result = fw_h + "0" + fw_l;
			else
				result = fw_h + "" + fw_l;
		}
		else result = fw_vers;
	%>
	<%= "<b class='lcdColor'>" + result + "</b>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=macaddrTitle%>
</div>
<div>
	<%
		String macaddr_hex1 = "";
		String macaddr1 = CurrUnit.getVariable("IR17").getValue();
		if (!macaddr1.equals("***"))
		{
			macaddr1 = macaddr1.replaceFirst(",","");
			macaddr_hex1 = formatWordIntToHex(macaddr1);
			macaddr_hex1 = macaddr_hex1.toUpperCase();
		}
		else macaddr_hex1 = macaddr1;
		
		String macaddr_hex2 = "";
		String macaddr2 = CurrUnit.getVariable("IR16").getValue();
		if (!macaddr2.equals("***"))
		{
			macaddr2 = macaddr2.replaceFirst(",","");
			macaddr_hex2 = formatWordIntToHex(macaddr2);
			macaddr_hex2 = macaddr_hex2.toUpperCase();
		}
		else macaddr_hex2 = macaddr2;
	%>
	<%= "<b class='lcdColor'>" + macaddr_hex1 + "&nbsp;" + macaddr_hex2 + "</b>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=CurrUnit.getVariable("IR6").getDescription()%>
</div>
<div>
	<%= "<div class='lcd' style='text-align:center'><div class='lcdValue' style='width:60%'><b>" + CurrUnit.getVariable("IR6").getValue() + "</b></div>" + "<div class='lcdMeasure'>[" + CurrUnit.getVariable("IR6").getMUnit() + "]</div><div class='clr'></div></div>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=CurrUnit.getVariable("IR7").getDescription()%>
</div>
<div>
	<%= "<div class='lcd' style='text-align:center'><div class='lcdValue' style='width:60%'><b>" + CurrUnit.getVariable("IR7").getValue() + "</b></div>" + "<div class='lcdMeasure'>[" + CurrUnit.getVariable("IR7").getMUnit() + "]</div><div class='clr'></div></div>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=generalCount1Title%>
</div>
<div>
	<%
		int generalCount1 = -1;
		generalCount1 = calcGeneralCount(CurrUnit.getVariable("IR9").getValue(),CurrUnit.getVariable("IR8").getValue());
	%>
	<%= "<b class='lcdColor'>" + generalCount1 + "</b>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=generalCount2Title%>
</div>
<div>
	<%
		int generalCount2 = -1;
		generalCount2 = calcGeneralCount(CurrUnit.getVariable("IR11").getValue(),CurrUnit.getVariable("IR10").getValue());
	%>
	<%= "<b class='lcdColor'>" + generalCount2 + "</b>"%>
</div>