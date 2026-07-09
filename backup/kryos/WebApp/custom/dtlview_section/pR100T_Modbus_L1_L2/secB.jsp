<%@ page language="java" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<div class='col-xs-12 col-sm-6 col-md-3 col-lg-3 vpadding'>
	<button class='btn btn-default form-control arrow-cursor'>
	<%=CurrUnit.getVariable("Sys_On_L1").getRefreshableAssint("<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>L1 - Unit Off</div>;<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led online-color'></span></div><div class='col-xs-11' align='left'>L1 - Unit On</div>","<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>L1 - Unit Off</div>")%>
	</button>
</div>
<div class='col-xs-12 col-sm-6 col-md-3 col-lg-3 vpadding'>
	<button class='btn btn-default form-control arrow-cursor'>
	<%=CurrUnit.getVariable("Sys_On_L2").getRefreshableAssint("<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>L2 - Unit Off</div>;<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led online-color'></span></div><div class='col-xs-11' align='left'>L2 - Unit On</div>","<div class='col-xs-1 nopadding' align='center'><span class='boss icon-led offline-color'></span></div><div class='col-xs-11' align='left'>L2 - Unit Off</div>")%>
	</button>
</div>
