<script type="text/javascript" src="custom/dtlview_section/gasleakagedetector/sensori_leakage.js"></script>
<br>
<div>
<%@ page language="java" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
	import="com.carel.supervisor.dataaccess.language.LangService"
	import="com.carel.supervisor.dataaccess.language.LangMgr"
	import="com.carel.supervisor.presentation.session.UserSession"
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session" />
<jsp:useBean id="CurrUser" class="com.carel.supervisor.presentation.sdk.obj.CurrUser" scope="session"/>

<%
CurrUnit.setCurrentSession(ServletHelper.retrieveSession(request.getRequestedSessionId(),request));
CurrUser.setCurrentSession(ServletHelper.retrieveSession(request.getRequestedSessionId(),request));


UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
String language = sessionUser.getLanguage();
LangService lan = LangMgr.getInstance().getLangService(language);

// Count Down Management
int dayInAYear = 365;
int hourInADay = 24;
int countDown = 0;
String sCountDown = "***";

try {
	int hours = Integer.parseInt(CurrUnit.getVariable("IR105").getValue().replaceAll(",",""));
	countDown = hours / hourInADay;
	countDown = dayInAYear - countDown;
	if(countDown <= 0)
		countDown = 0;
	sCountDown = "- " + countDown;
}
catch(Exception e) {
	sCountDown = "***";
}

// Check Reset Enable
boolean enabReset = false;
String val = CurrUnit.getVariable("CS401").getValue();
if( val == null)
	val = "***";
if(val.equalsIgnoreCase("1"))
	enabReset = true;

%>

<input type="hidden" id="confBuzzer" value="<%=lan.getString("devdetail","confBuzzer") %>" />
<input type="hidden" id="confReset" value="<%=lan.getString("devdetail","confReset") %>" />

<TABLE class="table" cellspacing="1" cellpadding="0" width="98%">
	<THEAD>
		<TR>
			<TH class="th" height="18" ></TH>
			<TH class="th" height="18" width=*><%=lan.getString("devdetail","description") %></TH>
		</TR>
	</THEAD>
	<TBODY>
		<TR class="Row1" height="25">
			<TD  align="center" width="18%"><nobr><b><%=sCountDown%></b></nobr></TD>
			<TD  align="left" width="*"><nobr><%=lan.getString("devdetail","countdown") %></nobr></TD>
		</TR>
		<TR class="Row2" height="25">
			<TD  align="center" width="18%">
			<nobr>
			<%=CurrUnit.getVariable("CS400").getSimpleButton(1,"1","images/button/buzzerreset_on_black.png","Buzzer")%>
			</nobr>
			</TD>
			<TD  align="left" width="*"><nobr><%=CurrUnit.getVariable("CS400").getDescription()%></nobr></TD>
		</TR>
		<TR class="Row1" height="25">
			<TD  align="center" width="18%">
			<nobr>
			<%if(enabReset) {%>
				<%=CurrUnit.getVariable("CS401").getSimpleButton(2,"0","images/button/alarmreset_on_black.png","Reset")%>
			<%} else {%>
				<img src="images/button/alarmreset_off.png" alt="Reset">
			<%}%>
			</nobr>
			</TD>
			<TD  align="left" width="*"><nobr><%=CurrUnit.getVariable("CS401").getDescr1()%></nobr></TD>
		</TR>
	<TBODY>
</TABLE>
</div>
<br>