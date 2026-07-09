<%@ page language="java" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<div class='col-xs-12 col-sm-6 col-md-3 col-lg-3 vpadding'>
	<button class='btn btn-default form-control arrow-cursor'>
	<%=CurrUnit.getVariable("UNIT_STATUS").getRefreshableAssint("<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led online-color'></span></div><div class='col-xs-11' align='left'>Unit On</div>;<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>Unit Off</div>","<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>Unit Off</div>")%>
	</button>
</div>
