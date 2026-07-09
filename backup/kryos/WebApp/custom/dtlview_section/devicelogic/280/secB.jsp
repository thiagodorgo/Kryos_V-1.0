<%@ page language="java"
	import="com.carel.supervisor.presentation.helper.ServletHelper" 
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<div class="tdfisa" style="color: green;">
	<%=CurrUnit.getVariable("3181").getDescription()%>&nbsp;=&nbsp;<%=CurrUnit.getVariable("3181").getValue()%>
</div>