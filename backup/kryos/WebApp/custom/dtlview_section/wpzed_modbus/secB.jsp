<%@ page language="java" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

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
	<%= "<b  class='lcdColor'>" + result + "</b>"%>
</div>
