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
%>

<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<%
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);	
	LangService lan = LangMgr.getInstance().getLangService(sessionUser.getLanguage());
	String panidTitle = lan.getString("devcustomstr","panid4w");
	String macaddrTitle = lan.getString("devcustomstr","macaddr2w");
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
	<%= "<b class='lcdColor' style='font-size:18pt'>" + result + "</b>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=panidTitle%>
</div>
<div>
	<%
		String netpanid_hex1 = "";
		String netpanid1 = CurrUnit.getVariable("IR17").getValue();
		if (!netpanid1.equals("***"))
		{
			netpanid1 = netpanid1.replaceFirst(",","");
			netpanid_hex1 = formatWordIntToHex(netpanid1);
			netpanid_hex1 = netpanid_hex1.toUpperCase();
		}
		else netpanid_hex1 = netpanid1;
		
		String netpanid_hex2 = "";
		String netpanid2 = CurrUnit.getVariable("IR18").getValue();
		if (!netpanid2.equals("***"))
		{
			netpanid2 = netpanid2.replaceFirst(",","");
			netpanid_hex2 = formatWordIntToHex(netpanid2);
			netpanid_hex2 = netpanid_hex2.toUpperCase();
		}
		else netpanid_hex2 = netpanid2;
		
		String netpanid_hex3 = "";
		String netpanid3 = CurrUnit.getVariable("IR19").getValue();
		if (!netpanid3.equals("***"))
		{
			netpanid3 = netpanid3.replaceFirst(",","");
			netpanid_hex3 = formatWordIntToHex(netpanid3);
			netpanid_hex3 = netpanid_hex3.toUpperCase();
		}
		else netpanid_hex3 = netpanid3;
		
		String netpanid_hex4 = "";	
		String netpanid4 = CurrUnit.getVariable("IR20").getValue();
		
		if (!netpanid4.equals("***"))
		{
			netpanid4 = netpanid4.replaceFirst(",","");
			netpanid_hex4 = formatWordIntToHex(netpanid4);
			netpanid_hex4 = netpanid_hex4.toUpperCase();
		}
		else netpanid_hex4 = netpanid4;
		
	%>
	<%= "<b class='lcdColor' style='font-size:18pt'>" + netpanid_hex1 + "&nbsp;" + netpanid_hex2 + "&nbsp;" + netpanid_hex3 + "&nbsp;" + netpanid_hex4 + "</b>"%>
</div>
<div class="tdfisa" style="text-align: left">
	<%=macaddrTitle%>
</div>
<div>
	<%
		String macaddr_hex1 = "";
		String macaddr1 = CurrUnit.getVariable("IR10").getValue();
		if (!macaddr1.equals("***"))
		{
			macaddr1 = macaddr1.replaceFirst(",","");
			macaddr_hex1 = formatWordIntToHex(macaddr1);
			macaddr_hex1 = macaddr_hex1.toUpperCase();
		}
		else macaddr_hex1 = macaddr1;
		
		String macaddr_hex2 = "";
		String macaddr2 = CurrUnit.getVariable("IR9").getValue();
		if (!macaddr2.equals("***"))
		{
			macaddr2 = macaddr2.replaceFirst(",","");
			macaddr_hex2 = formatWordIntToHex(macaddr2);
			macaddr_hex2 = macaddr_hex2.toUpperCase();
		}
		else macaddr_hex2 = macaddr2;
	%>
	<%= "<b class='lcdColor' style='font-size:18pt'>" + macaddr_hex1 + "&nbsp;" + macaddr_hex2 + "</b>"%>
</div>




