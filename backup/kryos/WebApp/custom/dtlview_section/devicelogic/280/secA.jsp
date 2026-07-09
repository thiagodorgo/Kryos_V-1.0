<%@ page language="java" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<%
%>
<script type="text/javascript" src="scripts/arch/arkustom.js"></script>


<table width="100%" class="table">
	<tr>
		<td valign="top" align="center" class="class='tdfisa'">
			<div style="color: GREEN;">
			<%=CurrUnit.getVariable("3181").getDescription()%>&nbsp;=&nbsp;<%=CurrUnit.getVariable("3181").getValue()%>
			</div>
		</td>
	</tr>
</table>