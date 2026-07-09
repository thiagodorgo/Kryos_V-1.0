<%@ page import="com.carel.supervisor.presentation.helper.ServletHelper"%>
<%@ page import="com.carel.supervisor.dataaccess.language.LangMgr"%>
<%@ page import="com.carel.supervisor.dataaccess.language.LangService"%>
<%@ page import="com.carel.supervisor.presentation.session.UserSession" %>

<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session" />
 
 <%
 UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
 String language = sessionUser.getLanguage();
 LangService lan = LangMgr.getInstance().getLangService(language);
 %>
 
<div class='tdfisa' style='text-align: left;'><%=CurrUnit.getVariable("Delay_active").getDescription() %></div>
	<div class='lcd'>
		<div class='lcdValue'><b><%=CurrUnit.getVariable("Delay_active").getRefreshableValue()%></b></div>
	<div class='lcdMeasure'><%=CurrUnit.getVariable("Delay_active").getMUnit() %></div>
</div>
<div class='tdfisa'  style='text-align: left;'><%=CurrUnit.getVariable("Motor_ON").getDescription() %></div>
	<div class='lcd'>
		<div class='lcdValue'><b><%=CurrUnit.getVariable("Motor_ON").getRefreshableValue()%></b></div>
	<div class='lcdMeasure'><%=CurrUnit.getVariable("Motor_ON").getMUnit() %></div>
</div>
<div class='tdfisa'  style='text-align: left;'><%=CurrUnit.getVariable("Error").getDescription() %></div>
	<div class='lcd'>
		<div class='lcdValue'><b><%=CurrUnit.getVariable("Error").getRefreshableValue()%></b></div>
	<div class='lcdMeasure'><%=CurrUnit.getVariable("Error").getMUnit() %></div>
</div>

<div class='tdfisa'  style='text-align: left;' ><%=CurrUnit.getVariable("MTemp").getDescription() %></div>
	<div class='lcd'>
		<div class='lcdValue' title='<%=CurrUnit.getVariable("MTemp").getAssint() %>'><%=CurrUnit.getVariable("MTemp").getRefreshableAssint("<img src='custom/dtlview_section/Kriwan_INT69_Diagnose_22A481/Kriwan Termometro bassa T1.jpg'>;"+
				"<img src='custom/dtlview_section/Kriwan_INT69_Diagnose_22A481/Kriwan Termometro T ottimale.jpg'>;"+
				"<img src='custom/dtlview_section/Kriwan_INT69_Diagnose_22A481/Kriwan Termometro T critica.jpg'>;"+
				"<img src='custom/dtlview_section/Kriwan_INT69_Diagnose_22A481/Kriwan Termometro T altissima.jpg'>")%>
		</div>
</div>
<div class='tdfisa'  style='text-align: left;'><%=CurrUnit.getVariable("Oil_Warning").getDescription() %></div>
	<div class='lcd'>
		<div class='lcdValue'><b><%=CurrUnit.getVariable("Oil_Warning").getRefreshableValue()%></b></div>
	<div class='lcdMeasure'><%=CurrUnit.getVariable("Oil_Warning").getMUnit() %></div>
</div>

<div class='tdfisa'  style='text-align: left;'><%=CurrUnit.getVariable("state_oil_dif_pres_sensor").getDescription() %></div>
	<div  style='width:100%;align:left;'>
		<div style='width:100%;align:left;color:#99ff00;font-size:18pt'><b><%=CurrUnit.getVariable("state_oil_dif_pres_sensor").getRefreshableAssint("Not in use;Low differential pressure;Good differential pressure;Short cut;Disabled;Open circuit;Wrong sensor;Not screwed in")%></b></div>
</div>




