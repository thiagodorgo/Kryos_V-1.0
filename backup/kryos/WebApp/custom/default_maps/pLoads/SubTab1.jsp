<%@page language="java" 
	import="com.carel.supervisor.presentation.sdk.util.Sfera"
	
	import="com.carel.supervisor.dataaccess.language.LangService"
	import="com.carel.supervisor.dataaccess.language.LangMgr"
	import="com.carel.supervisor.presentation.session.UserSession"
	import = "java.text.DecimalFormat"
%>
<%@page import="com.carel.supervisor.presentation.helper.ServletHelper" %>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<%
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	CurrUnit.setCurrentSession(sessionUser);
	// Alessandro : added virtual keyboard support
		
	CurrUnit.loadAlarms();
	int num_alarms = CurrUnit.getAlarmNumber();
	
	String language = sessionUser.getLanguage();
	LangService lan = LangMgr.getInstance().getLangService(language);
	String description = lan.getString("dtlview","col4");
	String value = lan.getString("dtlview","col1");
	String deviceStatus = lan.getString("dtlview","devstatus");
	String nextEvent = lan.getString("dtlview","nextevent");
	String noEvent = lan.getString("dtlview","noevent");
	String readOnly = lan.getString("dtlview","morevars");
	String statusdev = lan.getString("dtlview","statusdev");
	String devices = lan.getString("booklet","devices");
	String status = lan.getString("mgr","status");
	String forces = lan.getString("dtlview","forces");
	String statusload = lan.getString("dtlview","statusload");
	String loadonoff = lan.getString("dtlview","loadonoff");
	String descrstatusload = lan.getString("dtlview","descrstatusload");
	String forceloadstatus = lan.getString("dtlview","forceloadstatus");
	
	String resetalarm = lan.getString("alrglb","calledofal");
	String gaswaterenergy_t = lan.getString("dtlview","gaswaterenergy_t");
	String gaswaterenergy = lan.getString("dtlview","gaswaterenergy");
	String energy_meter_build = lan.getString("dtlview","energy_meter_build");
	String energy_meter = lan.getString("dtlview","energy_meter");
	String activeal = lan.getString("alrglb","activeal");
	String date = lan.getString("alrview","data");
	String priority = lan.getString("wizard","priority");
	String ack = lan.getString("button","ack");
	String user = lan.getString("alrsearch","user");
	String time = lan.getString("devdetail","time");
	String reset = lan.getString("fsdetail","reset");
	String daytype = lan.getString("dtlview","daytype");
	String Behaviur_SP = lan.getString("dtlview","Behaviur_SP");
	String exp_SP = lan.getString("dtlview","exp_SP");
	String load = lan.getString("dtlview","load");
	String staload = lan.getString("dtlview","staload");
	DecimalFormat df = new DecimalFormat("0.0"); 
	
	//suit Stress mode;
	int Manual_SPV_L_MAX = 2;
%>
<span></span>

<script type="text/javascript" src="scripts/arch/arkustom.js"></script>
<script>
PVPK_ActiveRefresh(30);	
</script>

<script type="text/javascript">
	var foto = new Array(3);
	foto[0] = "custom/dtlview/pLoads/Position_0.png";
	foto[1] = "custom/dtlview/pLoads/Position_1.png";
	foto[2] = "custom/dtlview/pLoads/Position_2.png";
	function imgSwitch(id,imgid){
		var currentValue = document.getElementById(id).value;
		currentValue = (currentValue==null || typeof(currentValue)=="undefined") ?1:currentValue;
		var nextvalue = foto[(currentValue+1)%3].split("_")[1].split(".")[0];
		document.getElementById(imgid).src = foto[(nextvalue)%3];
		document.getElementById(id).value=nextvalue;
	}
</script>

<form id="formSettableVars" name="formSettableVars">
<table width="98%" border="0" cellpadding="0" cellspacing="0">
<tr>
	<td width="60%" valign="top">
		<table width="100%">
			<td width="60%" valign="top">
				<table width="100%">
					<tr class='tdTitleTable'><%=Sfera.assint(CurrUnit.getStatus(),"<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>;<img src='images/led/L2.gif'>;<img src='images/led/L3.gif'>")%> <%=CurrUnit.getDescription()%></tr>
					<tr width="18%" height="18" class="th" align="center">
						<th class="th"><%=description%></th>
						<th class="th"><%=value%></th>
					</tr>
					<tr class='Row1'>
						<td ><%=deviceStatus%></td>
						<td ><%=(CurrUnit.getVariable("Sys_On").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					</tr>
					<tr class='Row2'>
						<td ><%=CurrUnit.getVariable("Day_Active").getDescription()%></td>
						<td ><%=(CurrUnit.getVariable("Day_Active").getRefreshableAssint(daytype,"***"))%></td>
					</tr>
					
					<tr class='Row1'>
						<td ><%=nextEvent%></td>
						<td > 
						<% if (((!CurrUnit.getVariable("Next_Event_Day").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Next_Event_Day").getValue()))>0) {%>
							<%=CurrUnit.getVariable("Next_Event_Day").getRefreshableValue()%>
							/
							<%=CurrUnit.getVariable("Next_Event_Month").getRefreshableValue()%>
							:
							<%=Sfera.assint(Integer.parseInt(CurrUnit.getVariable("Next_Event_Type").getValue())/100,Behaviur_SP,"***")%>
							-
							<%
								int temp = Integer.parseInt(CurrUnit.getVariable("Next_Event_Type").getValue());
							%>
							<%=Sfera.assint( (temp%100)  ,exp_SP,"***")%>
									
									
						<%} else {%><%=noEvent%><%}%>
						</td>
					</tr>
					<%if(CurrUnit.getVariable("pCO5_Board").getValue().equals("1")){ %>
						<tr class='Row2'>
							<td ><%=CurrUnit.getVariable("ENEL_Fascia_1").getDescription()%></td>
							<td ><%=(CurrUnit.getVariable("ENEL_Fascia_1").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
						</tr>
						<tr class='Row1'>
							<td ><%=CurrUnit.getVariable("ENEL_Fascia_2").getDescription()%></td>
							<td ><%=(CurrUnit.getVariable("ENEL_Fascia_2").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
						</tr>
					<%} %>
					<% int temp=0; %>
					<%if("1".equals(  CurrUnit.getVariable("En_Power_Cut").getValue() )) {%>
					<tr class='Row2'>
						<td ><%=CurrUnit.getVariable("Percent_Power").getDescription()%></td>
						<td ><%=CurrUnit.getVariable("Percent_Power").getRefreshableValue()%>%</td>
					</tr>
					<% temp++;} %>
					<%if("1".equals(  CurrUnit.getVariable("En_Energy_Cut").getValue() )) {%>
					<tr class='Row<%=(temp%2==1)?"1":"2" %>'>
						<td ><%=CurrUnit.getVariable("Percent_Energy").getDescription()%></td>
						<td ><%=CurrUnit.getVariable("Percent_Energy").getRefreshableValue()%>%</td>
					</tr>
					<% temp++;} %>
					<%if("1".equals(  CurrUnit.getVariable("En_App_Power_Cut").getValue() )) {%>
					<tr class='Row<%=(temp%2==1)?"1":"2" %>'>
						<td ><%=CurrUnit.getVariable("Percent_App_Power").getDescription()%></td>
						<td ><%=CurrUnit.getVariable("Percent_App_Power").getRefreshableValue()%>%</td>
					</tr>
					<%} %>
				</table>
			</td>
			<td width="30%" valign="top">
				<table width="100%">
				<tr>
					<td align="center" id="tdImgDev">
						<img height="80%" class="imgdevdim" id="dtlimgdev" src="images/devices/pLoad.jpg" complete="complete"/>
					</td>
				</tr>
				<tr>
					<td  height='30px' align="center" class="groupCategory" onclick="PVP_goToVariables('readonly')"><%=readOnly%></td>
				</tr>	
				</table>
			</td>
		</table>	

		<table width="100%">
			<tr class='tdTitleTable'><%=statusdev%></tr>
			<tr>
				<th class="th" align="center" ><%=devices%></th>
				<th class="th" align="center" ><%=status%></th>
				<th class="th" align="center" ><%=description%></th>
				<th class="th" align="center" ><%=forces%></th>
			</tr>
			<!-- Load 1 -->
			<% if (!CurrUnit.getVariable("Loads_Number").getValue().equals("***")){%>
				<tr class="Row1" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_1").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_1").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_1").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_1").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_1").getPostName()%>','imgL1')"/><img id="imgL1" name="imgL1" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_1").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_1").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_1").getValue()%>" />
				</tr> 
			<%}%>
			<!-- Load 2 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>1) {%>
				<tr class="Row2" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_2").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_2").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_2").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_2").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_2").getPostName()%>','imgL2')"><img id="imgL2" name="imgL2" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_2").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_2").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_2").getValue()%>" />
				</tr> 
			<%}%>
			<!-- Load 3 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>2) {%>
				<tr class="Row1" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_3").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_3").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_3").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_3").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_3").getPostName()%>','imgL3')"><img id="imgL3" name="imgL3" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_3").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_3").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_3").getValue()%>" />
				</tr> 
			<%}%>
			<!-- Load 4 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>3) {%>
				<tr class="Row2" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_4").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_4").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_4").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_4").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_4").getPostName()%>','imgL4')"><img id="imgL4" name="imgL4" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_4").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_4").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_4").getValue()%>" />
				</tr> 
			<%}%>
			
			<!-- Load 5 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>4) {%>
				<tr class="Row1" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_5").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_5").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_5").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_5").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_5").getPostName()%>','imgL5')"><img id="imgL5" name="imgL5" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_5").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_5").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_5").getValue()%>" />
				</tr> 
			<%}%>
			
			<!-- Load 6 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>5) {%>
				<tr class="Row2" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_6").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_6").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_6").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_6").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_6").getPostName()%>','imgL6')"><img id="imgL6" name="imgL6" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_6").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_6").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_6").getValue()%>" />
				</tr> 
			<%}%>

			<!-- Load 7 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>6) {%>
				<tr class="Row1" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_7").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_7").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_7").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_7").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_7").getPostName()%>','imgL7')"><img id="imgL7" name="imgL7" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_7").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_7").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_7").getValue()%>" />
				</tr> 
			<%}%>

			<!-- Load 8 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>7) {%>
				<tr class="Row2" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_8").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_8").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_8").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_8").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_8").getPostName()%>','imgL8')"><img id="imgL8" name="imgL8" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_8").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_8").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_8").getValue()%>" />
				</tr> 
			<%}%>
			
			<!-- Load 9 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>8) {%>
				<tr class="Row1" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_9").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_9").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_9").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_9").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_9").getPostName()%>','imgL9')"><img id="imgL9" name="imgL9" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_9").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_9").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_9").getValue()%>" />
				</tr> 
			<%}%>	

			<!-- Load 10 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>9) {%>
				<tr class="Row2" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_10").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_10").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_10").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_10").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_10").getPostName()%>','imgL10')"><img id="imgL10" name="imgL10" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_10").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_10").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_10").getValue()%>" />
				</tr> 
			<%}%>			

			<!-- Load 11 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>10) {%>
				<tr class="Row1" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_11").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_11").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_11").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_11").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_11").getPostName()%>','imgL11')"><img id="imgL11" name="imgL11" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_11").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_11").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_11").getValue()%>" />
				</tr> 
			<%}%>					
			
			<!-- Load 12 -->
			<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>11) {%>
				<tr class="Row2" height="30px" align ="center">
					<td title="<%=statusload%>">
						<%=Sfera.assint(CurrUnit.getVariable("Label_Load_12").getValue(),
						load,"***"
						)%>
					</td>
					<td title="<%=loadonoff%>"><%=(CurrUnit.getVariable("Load_12").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","***"))%></td>
					<td title="<%=descrstatusload%>">
						<%=CurrUnit.getVariable("Status_Load_12").getRefreshableAssint(staload,"***")%>
					</td>
						<%
							String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_12").getValue();
							if( ! "***".equals(Manual_SPV_L) )
								Manual_SPV_L = String.valueOf(Manual_SPV_L_MAX);
							Manual_SPV_L = Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L;
						%>
					<td align="center" title="<%=forceloadstatus%>" onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_12").getPostName()%>','imgL12')"><img id="imgL12" name="imgL12" src="custom/dtlview/pLoads/Position_<%=Manual_SPV_L%>.png"/>
					<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_12").getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_12").getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_12").getValue()%>" />
				</tr> 
			<%}%>	
			
	</form>
			
		</table>


	</td>
	<td width="40%" valign="top">
	<table width="100%" valign="top">
	<tr>
		<td width="100%" valign="top" colspan="2">
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
			<!-- GAS/WATER/ENERGY METER -->
				
				<div class='tdfisa' title='<%=energy_meter%> 1'><%=energy_meter_build%> 1</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_1.Energy_H_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
				</div>
				<div class='lcd'>
					<div style="float:left;width: 45%">
						<div class='lcdValue' ><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_1.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div>
					</div>
					<div style="float:right;width: 45%">
						<div class='lcdValue' ><b><%=CurrUnit.getVariable("Apparent_Power_EM_1").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kVA]</div>
					</div>
					<DIV class=clr></DIV>
				</div>
							
				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>	
	</table>
	</td>
	</tr>
	<tr>
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>1) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
			<!-- ENERGY METER 2 -->
				<div class='tdfisa' title='<%=energy_meter%> 2'><%=energy_meter%> 2</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_2.Energy_H_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
				</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_2.Power_L_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
				</div>

				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>	
	<% } %>	
	</td>			
	
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>2) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 3 -->
				<div class='tdfisa' title='<%=energy_meter%> 3'><%=energy_meter%> 3</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_3.Energy_H_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
				</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_3.Power_L_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
				</div>
			
				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>	
	</table>
	<% } %>
	</td>
	</tr>
	<tr>
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>3) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 4 -->
				<div class='tdfisa' title='<%=energy_meter%> 4'><%=energy_meter%> 4</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_4.Energy_H_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
				</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_4.Power_L_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
				</div>

				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>	
	<% } %>
	</td>			
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>4) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 5 -->
					<div class='tdfisa' title='<%=energy_meter%> 5'><%=energy_meter%> 5</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_5.Energy_H_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
					</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_5.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
					</div>
				
			<!-- rounded bottom -->
			<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>
	<% } %>
	</td>
	</tr>
	<tr>
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>5) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 6 -->
					<div class='tdfisa' title='<%=energy_meter%> 6'><%=energy_meter%> 6</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_6.Energy_H_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
					</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_6.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
					</div>

				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>	
	<% } %>
	</td>			
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>6) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 7 -->
				<div class='tdfisa' title='<%=energy_meter%> 7'><%=energy_meter%> 7</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_7.Energy_H_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
				</div>
				<div class='lcd'>
					<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_7.Power_L_SPV").getRefreshableValue()%></b></div>
					<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
				</div>
					
				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			
			</div>
		</td>
	</table>
	<% } %>
	</td>
	</tr>
	<tr>
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>7) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 8 -->
					<div class='tdfisa' title='<%=energy_meter%> 8'><%=energy_meter%> 8</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_8.Energy_H_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
					</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_8.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
					</div>
				
				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>	
	<% } %>
	</td>			
	
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>8) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 9 -->
					<div class='tdfisa' title='<%=energy_meter%> 9'><%=energy_meter%> 9</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_9.Energy_H_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
					</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_9.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
					</div>

				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>
	<% } %>
	</td>
	</tr>
	<tr>
	<td width="50%" valign="top">	
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>9) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 10 -->
					<div class='tdfisa' title='<%=energy_meter%> 10'><%=energy_meter%> 10</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_10.Energy_H_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
					</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_10.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
					</div>
				
				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>	
	<% } %>
	</td>			
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>10) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 11 -->
					<div class='tdfisa' title='<%=energy_meter%> 11'><%=energy_meter%> 11</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_11.Energy_H_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
					</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_11.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
					</div>

				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>
	<% } %>
	</td>
	</tr>
	<tr>
	<td width="50%" valign="top">
	<% if (((!CurrUnit.getVariable("Num_EM").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Num_EM").getValue()))>11) {%>
	<table width="100%">
		<!-- BLACK DASHBOARD -->
		<td width="30%">
			<div class="dashboard">
				<!-- rounded top -->
				<div class="topleftcorner"></div><div class="toprightcorner"></div>
				
				<!-- ENERGY METER 12 -->
					<div class='tdfisa' title='<%=energy_meter%> 12'><%=energy_meter%> 12</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_12.Energy_H_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kWh]</div><DIV class=clr></DIV>
					</div>
					<div class='lcd'>
						<div class='lcdValue'><b><%=CurrUnit.getVariable("MOD_ENERGY_METERS_12.Power_L_SPV").getRefreshableValue()%></b></div>
						<div class='lcdMeasure'>[kW]</div><DIV class=clr></DIV>
					</div>
					

				<!-- rounded bottom -->
				<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
			</div>
		</td>
	</table>	
	<% } %>
	</td>			
	</tr>
	<tr>
		<td width="100%" valign="top" colspan="2">
		<table width="100%">
		<!-- BLUE DASHBOARD  -->
			<td width="80%">
			<% int pulseNum=1;
			   String times = null;
			%>
			<% if (!CurrUnit.getVariable("pCO5_Board").getValue().equals("***")  || !CurrUnit.getVariable("pCO_Compact_Board").getValue().equals("***") ) {
					pulseNum =0;
			%>
				<div class="dashboard">
					<!-- rounded top -->
					<div class="topleftcorner"></div><div class="toprightcorner"></div>
					<!-- GAS/WATER/ENERGY METER -->
					<table width="100%"  class='tdfisa' >
						<% if (!CurrUnit.getVariable("pCO5_Board").getValue().equals("***")  || !CurrUnit.getVariable("pCO_Compact_Board").getValue().equals("***") ) {
							pulseNum ++;
						%>
						<tr >
							<td width = "50%" >
								<div class='tdfisa'  title='<%=gaswaterenergy_t%>'>Pulse <%=Sfera.assint(CurrUnit.getVariable("MECH_METERS_1.TypeDevice_B5").getValue(),gaswaterenergy,"***")%>  <%=pulseNum %> </div>
							</td>
							<td style="text-align:left;" width = "50%">
								<div class='lcd' >
									<div class='lcdValue'>
									<b>
									<% 
									times = Sfera.assint(CurrUnit.getVariable("MECH_METERS_1.Pulse_Convertion").getValue(),"1;10;100;1000;10000;100000;0.1","***");
									if (!times.equals("***")){
									%>
										<% if("0.1".equals(times)) {%>
											<%=df.format((Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_B5").getValue().replace(",","")))*(Double.parseDouble(times)))%>
										<%}else{ %>
											<%=(Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_B5").getValue().replace(",","")))*(Integer.parseInt(times))  %>
										<%} %>
									<%}else{ %>
										<%=(Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_B5").getValue().replace(",","")))%>
									<%} %>
									</b>
									</div>
									<div class='lcdMeasure'>[<%=Sfera.assint(CurrUnit.getVariable("MECH_METERS_1.TypeDevice_B5").getValue(),"Wh;liters;m3;","***")%>]</div>
								</div>
							</td>
						<tr>
						<% } %>	
						<!--  longbow2 -->
						<% if (!CurrUnit.getVariable("pCO5_Board").getValue().equals("***") ) {%>
							<% if (!CurrUnit.getVariable("N_Pulse_H_ID17").getValue().equals("***") ) {
									pulseNum ++;
							%>
						<tr >
							<td width = "50%">
								<div class='tdfisa'  title='<%=gaswaterenergy_t%>'> Pulse <%=Sfera.assint(CurrUnit.getVariable("PULSE_COUNTER_ID_1.TypeDevice_ID").getValue(),gaswaterenergy,"***")%>  <%=pulseNum %></div>
							</td>
							<td width = "50%">
								<div class='lcd'>
									<div class='lcdValue'>
									<b>
									<% 
									times = Sfera.assint(CurrUnit.getVariable("PULSE_COUNTER_ID_1.Pulse_Convertion").getValue(),"1;10;100;1000;10000;100000;0.1","***");
									if (!times.equals("***")){
									%>	<% if("0.1".equals(times)) {%>
											<%=df.format((Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_ID17").getValue().replace(",","")))*(Double.parseDouble(times)))%>
										<%}else{ %>
											<%=(Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_ID17").getValue().replace(",","")))*(Integer.parseInt(times))%>
										<%} %>
									<%}else{ %>
										<%=(Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_ID17").getValue().replace(",","")))%>
									<%} %>
									</b>
									</div>															
									<div class='lcdMeasure'>[<%=Sfera.assint(CurrUnit.getVariable("PULSE_COUNTER_ID_1.TypeDevice_ID").getValue(),"Wh;liters;m3;","***")%>]</div>
								</div>
							</td>
						<tr>
							<% } %>	
							<% if (!CurrUnit.getVariable("N_Pulse_H_ID18").getValue().equals("***") ) {
									pulseNum++;
							%>
						<tr >
							<td width = "50%">
								<div class='tdfisa' style='text-align:center' title='<%=gaswaterenergy_t%>'> Pulse <%=Sfera.assint(CurrUnit.getVariable("PULSE_COUNTER_ID_2.TypeDevice_ID").getValue(),gaswaterenergy,"***")%>  <%=pulseNum %></div>
							</td>
							<td width = "50%">
								<div class='lcd'>
									<div class='lcdValue'>
									<b>
									<% 
									times = Sfera.assint(CurrUnit.getVariable("PULSE_COUNTER_ID_2.Pulse_Convertion").getValue(),"1;10;100;1000;10000;100000;0.1","***");
									if (!times.equals("***")){
									%>	<% if("0.1".equals(times)) {%>
											<%=df.format((Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_ID18").getValue().replace(",","")))*(Double.parseDouble(times)))%>
										<%}else{ %>
											<%=(Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_ID18").getValue().replace(",","")))*(Integer.parseInt(times))%>
										<%} %>
									<%}else{ %>
										<%=(Integer.parseInt(CurrUnit.getVariable("N_Pulse_H_ID18").getValue().replace(",","")))%>
									<%} %>
									</b>
									</div>
									<div class='lcdMeasure'>[<%=Sfera.assint(CurrUnit.getVariable("PULSE_COUNTER_ID_2.TypeDevice_ID").getValue(),"Wh;liters;m3;","***")%>]</div>
								</div>
							</td>
						<tr>
							<% } %>	
						<% } %>	
					</table>
						<!-- rounded bottom -->
						<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
				</div>
			</td>	
			<% } %>	
		</table>
		
		</td>
	</tr>
	
	<tr>
		<td width="100%" valign="top" colspan="2">
		<%
		String s1 = CurrUnit.getVariable("CI_1_Present").getValue();
		String s2 = CurrUnit.getVariable("CI_2_Present").getValue();
		if (  (!s1.equals("***") && !s1.equals("0") )  ||   (!s2.equals("***") && !s2.equals("0"))) {%>
		<table width="100%">
		<!-- BLUE DASHBOARD -->
			<td width="30%">
				<div class="dashboard">
					<!-- rounded top -->
					
					<div class="topleftcorner"></div><div class="toprightcorner"></div>
					
					<!-- GAS/WATER/ENERGY METER -->
						<table width="100%"  class='tdfisa'>
						<% if (!s1.equals("***") && !s1.equals("0")) {
							pulseNum ++;
						%>
						<tr >
							<td width = "50%">
								<div class='tdfisa' style='text-align:center' title='<%=gaswaterenergy_t%>'> Pulse <%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_1.TypeDevice_ID").getValue(),gaswaterenergy,"***")%>  <%=pulseNum %></div>
							</td>
							<td width = "50%">
								<div class='lcd'>
									<div class='lcdValue'>
									<b>
									<% 
									times = Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_1.Pulse_Convertion").getValue(),"1;10;100;1000;10000;100000;0.1","***");
									if (!times.equals("***")){
									%>
										<% if("0.1".equals(times)) {%>
											<%=df.format((Integer.parseInt(CurrUnit.getVariable("IN_l_Counter_High").getValue().replace(",","")))*(Double.parseDouble(times)))%>
										<%}else{ %>
											<%=(Integer.parseInt(CurrUnit.getVariable("IN_l_Counter_High").getValue().replace(",","")))*(Integer.parseInt(times))%>
										<%} %>
									<%}else{ %>
									<%=(Integer.parseInt(CurrUnit.getVariable("IN_l_Counter_High").getValue().replace(",","")))%>
									<%} %>
									</b>
									</div>
									<div class='lcdMeasure'>[<%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_1.TypeDevice_ID").getValue(),"Wh;liters;m3;","***")%>]</div>
								</div>
							</td>
						<tr>
						<% pulseNum ++; %>
						<tr >
							<td width = "50%">
								<div class='tdfisa' style='text-align:center' title='<%=gaswaterenergy_t%>'> Pulse <%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_2.TypeDevice_ID").getValue(),gaswaterenergy,"***")%>  <%=pulseNum %></div>
							</td>
							<td width = "50%">
								<div class='lcd'>
									<div class='lcdValue'>
									<b>
									<% 
									times = Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_2.Pulse_Convertion").getValue(),"1;10;100;1000;10000;100000;0.1","***");
									if (!times.equals("***")){
									%>
										<% if("0.1".equals(times)) {%>
											<%=df.format((Integer.parseInt(CurrUnit.getVariable("IN2_Counter_High").getValue().replace(",","")))*(Double.parseDouble(times)))%>
										<%}else{ %>
											<%=(Integer.parseInt(CurrUnit.getVariable("IN2_Counter_High").getValue().replace(",","")))*(Integer.parseInt(times))%>
										<%} %>
									<%}else{ %>
									<%=(Integer.parseInt(CurrUnit.getVariable("IN2_Counter_High").getValue().replace(",","")))%>
									<%} %>
									</b>
									</div>
									<div class='lcdMeasure'>[<%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_2.TypeDevice_ID").getValue(),"Wh;liters;m3;","***")%>]</div>
								</div>
							</td>
						<tr>
						<% } %>	
						<% if (!s2.equals("***") && !s2.equals("0")) {
							pulseNum++;
						%>
						<tr >
							<td width = "50%">
								<div class='tdfisa' style='text-align:center' title='<%=gaswaterenergy_t%>'> Pulse <%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_3.TypeDevice_ID").getValue(),gaswaterenergy,"***")%>  <%=pulseNum %></div>
							</td>
							<td width = "50%">
								<div class='lcd'>
									<div class='lcdValue'>
									<b>
									<% 
									times = Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_3.Pulse_Convertion").getValue(),"1;10;100;1000;10000;100000;0.1","***");
									if (!times.equals("***")){
									%>
										<% if("0.1".equals(times)) {%>
											<%=df.format((Integer.parseInt(CurrUnit.getVariable("IN1_Counter_High").getValue().replace(",","")))*(Double.parseDouble(times)))%>
										<%}else{ %>
											<%=(Integer.parseInt(CurrUnit.getVariable("IN1_Counter_High").getValue().replace(",","")))*(Integer.parseInt(times))%>
										<%} %>
									<%}else{ %>
										<%=(Integer.parseInt(CurrUnit.getVariable("IN1_Counter_High").getValue().replace(",","")))%>
									<%} %>
									</b>
									</div>
									<div class='lcdMeasure'>[<%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_3.TypeDevice_ID").getValue(),"Wh;liters;m3;","***")%>]</div>
								</div>
							</td>
						<tr>
						<% pulseNum ++; %>
						<tr >
							<td width = "50%">
								<div class='tdfisa' style='text-align:center' title='<%=gaswaterenergy_t%>'> Pulse <%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_4.TypeDevice_ID").getValue(),gaswaterenergy,"***")%>  <%=pulseNum %></div>
							</td>
							<td width = "50%">
								<div class='lcd'>
									<div class='lcdValue'>
									<b>
									<% 
									times = Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_4.Pulse_Convertion").getValue(),"1;10;100;1000;10000;100000;0.1","***");
									if (!times.equals("***")){
									%>
										<% if("0.1".equals(times)) {%>
											<%=df.format((Integer.parseInt(CurrUnit.getVariable("IN2_Counter_High_2").getValue().replace(",","")))*(Double.parseDouble(times)))%>
										<%}else{ %>
											<%=(Integer.parseInt(CurrUnit.getVariable("IN2_Counter_High_2").getValue().replace(",","")))*(Integer.parseInt(times))%>
										<%} %>
									<%}else{ %>
										<%=(Integer.parseInt(CurrUnit.getVariable("IN2_Counter_High_2").getValue().replace(",","")))%>
									<%} %>
									</b>
									</div>
									<div class='lcdMeasure'>[<%=Sfera.assint(CurrUnit.getVariable("MSK_PULSE_COUNTER_4.TypeDevice_ID").getValue(),"Wh;liters;m3;","***")%>]</div>
								</div>
							</td>
						<tr>
						<% } %>	
					</table>
						
						<!-- rounded bottom -->
						<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
				</div>
			</td>	
		</table>
		<% } %>	
		</td>
	</tr>
	
	
	
	</table>
	</td>
	</tr>
	
	<!-- Alarm -->
	<tr class="Row0" height="30px" align ="center">
		<td ><%=resetalarm%> </td>
		<td> <%=CurrUnit.getVariable("Reset_Alarm").getSimpleButton(13,"1","images/button/alarmreset_on_black.png","Reset allarmi")%></td>
	</tr>
	
	<tr>
		<td colspan="2">
		<table width='100%' class="tr" cellpadding="3" cellspacing="1">
				<tr class='tdTitleTable'><%=activeal%></tr>
				<tr class="th" align="center">
					<th width="12%" ><%=date%></th>
					<th width="*" ><%=description%></th>
					<th width="5%" ><%=priority%></th>
					<th width="10%" ><%=ack%> <%=user%></th>
					<th width="12%" ><%=ack%> <%=time%></th>
					<th width="10%" ><%=reset%></th>
					<th width="12%" ><%=reset%> <%=time%></th>
				</tr>
				<% for (int i=0;i<num_alarms;i++) { %>
					<tr style="font-size: xx-small;background:red;cursor:pointer" onclick="top.frames['manager'].loadTrx('alarmdescription/AlarmFrameset.jsp&folder=alrview&bo=BAlrView&type=click&id=<%=CurrUnit.getAlarmAt(i).getIdalr()%>&desc=ncode02');",">
						<td ><%=CurrUnit.getAlarmAt(i).getDate() %></td>
						<td ><%=CurrUnit.getAlarmAt(i).getDesc() %></td>
						<td  align='center'><%=CurrUnit.getAlarmAt(i).getPriority() %></td>
						<td ><%= CurrUnit.getAlarmAt(i).getAckuser()==null?"":CurrUnit.getAlarmAt(i).getAckuser() %></td>
						<td ><%=CurrUnit.getAlarmAt(i).getAcktime() %></td>
						<td ><%=CurrUnit.getAlarmAt(i).getResetuser()==null?"":CurrUnit.getAlarmAt(i).getResetuser() %></td>
						<td ><%=CurrUnit.getAlarmAt(i).getResettime() %></td>
					</tr>
				<% } %>
		</table>
		<DIV id="alarms"></DIV>
		</td>
	</tr>
	</table>



