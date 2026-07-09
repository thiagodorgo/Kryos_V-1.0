<%@ page language="java" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<div class="tdfisa">
	<%=CurrUnit.getVariable("SEL").getRefreshableAssint("SETTINGS BY PANEL ENABLED;SETTINGS BY MEMORY ENABLED","***")%>
	<P>
	<div id="txt1" style="display:<%if(CurrUnit.getVariable("SEL").getValue().equals("1")){%>none;<%}%>"> 
	<%=CurrUnit.getVariable("HZFCR").getRefreshableAssint("50 Hz; 60 Hz","***")%>
	<P>
	<%=CurrUnit.getVariable("MINCUTFCR").getRefreshableAssint("CUT-OFF DISABLED; CUT-OFF ENABLED","***")%>
	<P>
	<%=CurrUnit.getVariable("LINFCR").getRefreshableAssint("LINEAR; QUADRATIC","***")%>
	</div>
	<div id="txt2" style="display:<%if(!CurrUnit.getVariable("SEL").getValue().equals("1")){%>none;<%}%>">
	<%=CurrUnit.getVariable("HZMEM").getRefreshableAssint("50 Hz; 60 Hz","***")%>
	<P>
	<%=CurrUnit.getVariable("MINCUTMEM").getRefreshableAssint("CUT-OFF DISABLED; CUT-OFF ENABLED","***")%>
	<P>
	<%=CurrUnit.getVariable("LINMEM").getRefreshableAssint("LINEAR; QUADRATIC","***")%>
	</div>
</div>
<SCRIPT   LANGUAGE="JavaScript">
	var div = document.getElementById("img<%=CurrUnit.getVariable("SEL").getId()%>_<%=CurrUnit.getVariable("SEL").getIdDevice()%>");
	var  preVal = "";
	function getVal(){
		if(preVal != div.innerHTML){
			preVal = div.innerHTML;
			if(preVal.indexOf("SETTINGS BY MEMORY ENABLED") >= 0){
				document.getElementById("txt1").style.display="none";
				document.getElementById("txt2").style.display="block";
			}else{
				document.getElementById("txt1").style.display="block";
				document.getElementById("txt2").style.display="none";
			}
		}
		setTimeout("getVal()",5000);
	}
	setTimeout("getVal()",1000);  
</script>
<div class="tdfisa">
