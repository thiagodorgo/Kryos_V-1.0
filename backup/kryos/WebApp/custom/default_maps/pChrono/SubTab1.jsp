<%@page language="java" 
	import="com.carel.supervisor.presentation.sdk.util.Sfera"
	
	import="com.carel.supervisor.dataaccess.language.LangService"
	import="com.carel.supervisor.dataaccess.language.LangMgr"
	import="com.carel.supervisor.presentation.session.UserSession"
%>
<%@page import="com.carel.supervisor.presentation.helper.ServletHelper" %>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<%
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	CurrUnit.setCurrentSession(sessionUser);
		
	CurrUnit.loadAlarms();
	int num_alarms = CurrUnit.getAlarmNumber();
	String language = sessionUser.getLanguage();
	LangService lan = LangMgr.getInstance().getLangService(language);
    String max = CurrUnit.getVariable("MOD_MB_AP_SENSER_1.Max_Add_Connected_RB").getValue();
    String min = CurrUnit.getVariable("MOD_MB_AP_SENSER_1.Min_Add_Connected_RB").getValue();
    String rbexist = CurrUnit.getVariable("RB_1_Present").getValue();
    String numbPcoeStr = CurrUnit.getVariable("Number_pCOe").getValue();
    int maxInt  =0;
    int minInt = 0;
    int rbState = 0;
    int numbPcoe = 0;
    int pcoeNumbCount = 0;
    if( ! "***".equals(max) ){
	    numbPcoe = Integer.parseInt(numbPcoeStr);
    }
    String temp = lan.getString("pChrono","temp");
    String humid = lan.getString("pChrono","humid");
    String light = lan.getString("pChrono","light");
    String status = lan.getString("switch","status")+":";
    String power = lan.getString("energy","power")+":";
    String energy = lan.getString("plugin","EG")+":";
    String noconnect = lan.getString("pChrono","noconnect");
    String reset = lan.getString("button","reset_counter");
    String reset_alarms = lan.getString("alrglb","tab2name");
    
	//suit Stress mode;
    int signal_max = 4;
    int battery_max = 4;
    int battery_min = 1;
    
    
%>
<script type="text/javascript" src="scripts/arch/arkustom.js"></script>
<script type="text/javascript" src="custom/dtlview/pChrono/pgloads.js"></script>
<script>
PVPK_ActiveRefresh(30);	
</script>
<script defer="defer">
if (window.addEventListener)
{
    window.addEventListener("load", addResetAlarm, false);
}else if (window.attachEvent){
    window.attachEvent("onload", addResetAlarm);
}else{
    window.onload=addResetAlarm;
}

</script>
<link rel="stylesheet" href="custom/dtlview/pChrono/pgloads.css" type="text/css" />

<input type='hidden' id='reset' value='<%=reset %>' />
<input type='hidden' id='reset_alarms' value='<%=reset_alarms %>' />

<input type='hidden' id="buzzerId" value="<%=CurrUnit.getVariable("Reset_Buzzer_Man").getPostName() %>"/>
<input type='hidden' id="alarmId" value="<%=CurrUnit.getVariable("Reset_Alarm").getPostName() %>"/>
<FORM name="formBuzzerAlarm" id="formBuzzerAlarm" action='servlet/master;' method='post'>
<input type='hidden' name="<%=CurrUnit.getVariable("Reset_Buzzer_Man").getPostName()%>" id="<%=CurrUnit.getVariable("Reset_Buzzer_Man").getPostName()%>"  value="" />
<input type='hidden' name="<%=CurrUnit.getVariable("Reset_Alarm").getPostName()%>" id="<%=CurrUnit.getVariable("Reset_Alarm").getPostName()%>"  value="" />
</FORM>

<table  width="100%" height="100%" align="center" cellspacing="0" cellpadding="0" >
<%String devExist = CurrUnit.getVariable("Board").getValue();
  if( ! "***".equalsIgnoreCase(devExist)){
%>  
<tr><td width="100%" height="100%" >
		  
<table  height="100%" width="100%" border="0px" cellspacing="0px" cellpadding="0px">
	<tr>
		<td width="12%" valign="top">
			<table width="100%" height="100%" border="0px" cellspacing="0px" cellpadding="0px">
			<tr height="105" ><td valign="bottom" >
					<table  width="100%" border="0px" cellspacing="0px" cellpadding="0px"  valign="bottom" >
						<tr >
							<td align="center" valign="bottom" >
							<!-- without the first line (pcoes) -->
							<% if ( (CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("0") || CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("***") )  && numbPcoe<=0){%>
									<!-- without wireless,so just a controller -->
									<%if( (CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("0")&& numbPcoe<=0) ){ %>
										<img src="custom/dtlview/pChrono/images/main_alone.JPG" height="100px" width="115px" />
									<%} else{%>
										<img src="custom/dtlview/pChrono/images/main_no_pcoe.JPG" height="100px" width="120px" />
									<%} %>
							<%} else if(CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("1")) {%>
								<!-- with first line and wireless -->
									<img src="custom/dtlview/pChrono/images/main.JPG" height="100px" width="115px" />
							<%}else{ %>
								<img src="custom/dtlview/pChrono/images/main_no_wireless2.JPG" height="100px" width="115px" />
							<%} %>
							</td>
						</tr>
					</table>
			</td></tr>
			<tr><td valign="top" width="90%" align="left">
				<table class="infotable" width="90%" >
					<% for( int i=1;i<=8;i++) {%>
						<tr>
							<td  width="50%"><%= i%>
								<%=CurrUnit.getVariable("Din"+i+"_Value").getRefreshableAssint(
										"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
										"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
								%>
							</td>
							<td  width="50%"><%= i%>
								<%=CurrUnit.getVariable("Out_"+i).getRefreshableAssint(
										"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
										"<img src='images/led/L1.gif' width='10px' height='10px'>")
								%>
							</td>
						</tr>
					<%} %>
					<% String boardType = CurrUnit.getVariable("Board").getValue(); %>
					<%if("10".equalsIgnoreCase(boardType) || "11".equalsIgnoreCase(boardType)){ %>
						<% for( int i=9;i<=13;i++) {%>
							<tr>
								<td  width="50%"><%= i%>
									<%=CurrUnit.getVariable("Din"+i+"_Value").getRefreshableAssint(
											"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
											"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
									%>
								</td>
								<td  width="50%"><%= i%>
									<%=CurrUnit.getVariable("Out_"+i).getRefreshableAssint(
											"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
											"<img src='images/led/L1.gif' width='10px' height='10px'>")
									%>
								</td>
							</tr>
						<%} %>
						<%if("11".equalsIgnoreCase(boardType) ){ %>
							<tr>
								<td  width="50%">14
									<%=CurrUnit.getVariable("Din14_Value").getRefreshableAssint(
											"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
											"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
									%>
								</td>
								<td  width="50%"></td>
							</tr>
						<%} else if("10".equalsIgnoreCase(boardType) ){%>
							<tr>
								<td  width="50%">14
									<%=CurrUnit.getVariable("Din14_Value").getRefreshableAssint(
											"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
											"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
									%>
								</td>
								<td  width="50%">14
									<%=CurrUnit.getVariable("Out_14").getRefreshableAssint(
											"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
											"<img src='images/led/L1.gif' width='10px' height='10px'>")
									%>
								</td>
							</tr>
						<%} %>
						<%if("10".equalsIgnoreCase(boardType)) {%>
							<% for( int i=15;i<=18;i++) {%>
								<tr>
									<td  width="50%"><%= i%>
										<%=CurrUnit.getVariable("Din"+i+"_Value").getRefreshableAssint(
												"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
												"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
										%>
									</td>
									<td  width="50%"><%= i%>
										<%=CurrUnit.getVariable("Out_"+i).getRefreshableAssint(
												"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
												"<img src='images/led/L1.gif' width='10px' height='10px'>")
										%>
									</td>
								</tr>
							<%} %>
						<%} %>
						
					<%} %>
					<% for( int i=1;i<=4;i++) {%>
						<tr>
							<td  width="55%"><%=(CurrUnit.getVariable("U"+i+"_Value").getDescription().subSequence(0,2))%>:<%=(CurrUnit.getVariable("U"+i+"_Value").getRefreshableValue())%></td>
							<td  width="45%"><%=(CurrUnit.getVariable("Aout_"+i).getDescription().subSequence(0,2))%>:<%=(CurrUnit.getVariable("Aout_"+i).getRefreshableValue())%><b><%=(CurrUnit.getVariable("Aout_"+i).getMUnit() )%></b></td>
						</tr>
					<%} %>
					<tr>
							<td  width="55%"><%=(CurrUnit.getVariable("U5_Value").getDescription().subSequence(0,2))%>:<%=(CurrUnit.getVariable("U5_Value").getRefreshableValue())%></td>
							<td  width="45%">
								<%if("10".equalsIgnoreCase(boardType) ){ %>
									<%=(CurrUnit.getVariable("Aout_5").getDescription().subSequence(0,2))%>:<%=(CurrUnit.getVariable("Aout_5").getRefreshableValue())%><b><%=(CurrUnit.getVariable("Aout_5").getMUnit() )%></b>
								<%} %>
							</td>
					</tr>
					<%if("11".equalsIgnoreCase(boardType) ){ %>
						<% for( int i=6;i<=8;i++) {%>
							<tr>
								<td  width="55%"><%=(CurrUnit.getVariable("U"+i+"_Value").getDescription().subSequence(0,2))%>:<%=(CurrUnit.getVariable("U"+i+"_Value").getRefreshableValue())%></td>
								<td  width="45%"></td>
							</tr>
						<%} %>
					<%} %>
					<%if("10".equalsIgnoreCase(boardType) ){ %>
						<% for( int i=6;i<=10;i++) {
							int len = 2;
							if(i==10){
								len = 3;
							}
						%>
							<tr>
								<td  width="<%=(i==10)?"70%":"60%" %>"><%=(CurrUnit.getVariable("U"+i+"_Value").getDescription().subSequence(0,len))%>:<%=(CurrUnit.getVariable("U"+i+"_Value").getRefreshableValue())%></td>
								<td  width="<%=(i==10)?"30%":"40%" %>">
									<%if(i==6 ){ %>
										<%=(CurrUnit.getVariable("Aout_6").getDescription().subSequence(0,2))%>:<%=(CurrUnit.getVariable("Aout_6").getRefreshableValue())%><b><%=(CurrUnit.getVariable("Aout_6").getMUnit() )%></b>
									<%} %>
								</td>
							</tr>
						<%} %>
					<%} %>
				</table>
			</td></tr>
			</table>
		</td>
		<td width="88%" valign="top">
			<table height="100%" width="100%" border="0px" cellspacing="0px" cellpadding="0px" >
				
				<%
				if (!(CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("0") || CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("***") ) || numbPcoe>0)
				{%>
				<!-- pcoes images -->
				<tr height="11%"  >
					<td width="100%"  valign="top">
						<table width="100%"  cellspacing="0px" cellpadding="0px">
							<tr>
							<% if (!CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("0") && !CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("***")){%>
								<td align="center" width="7%"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_AP_FB2").getValue().equals("0")?"main_wireless.JPG":"main_wireless_offline.JPG" %>" width="72px" height="72px" /></td>
							<% }else if(numbPcoe>0){ %>
								<td align="center" width="7%"><img src="custom/dtlview/pChrono/images/main_wireless_none.JPG" width="72px" height="72px" /></td>
							<%} else{ %>
								<td align="center" width="7%"></td>
							 <%}
							   if(! "***".equals(max) &&  ! "***".equals(min) && !"***".equals(rbexist)){
								   rbState = Integer.parseInt(rbexist);
								   if(0!=rbState){
									   maxInt = Integer.parseInt(max)-1;
									   minInt = Integer.parseInt(min)-1;
									   if(maxInt<minInt){
										   int tep=maxInt;
										   maxInt = minInt;
										   minInt = tep;
									   }
								   }
							   }
							   if(rbState==0 && minInt>0 && maxInt>0 ){ 
									numbPcoe = numbPcoe-(maxInt-minInt+1); 
							   }
							%>
							<% if( minInt>0 && maxInt>0  && rbState ==1 ){ %>
								<% for( int i=1;i<=10;i++) {%>
									<% if (!CurrUnit.getVariable("pCOe_"+i+"_Present").getValue().equals("0") && !CurrUnit.getVariable("pCOe_"+i+"_Present").getValue().equals("***") ){%>
										<% if(i<minInt || i>maxInt){ %>
											<td align="center" width="9%" ><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_pCOe_"+i).getValue().equals("0")?"pcoe_on.JPG":"pcoe_off.JPG" %>" width="80px" height="72px" /></td>
										<%} %>	
									<%} %>
								<%} %>
								
								<% for( int i=1;i<=10;i++) {%>
									<% if (!CurrUnit.getVariable("pCOe_"+i+"_Present").getValue().equals("0") && !CurrUnit.getVariable("pCOe_"+i+"_Present").getValue().equals("***") ){%>
										<%if(i>=minInt && i<=maxInt){ %>
											<%if(  minInt!=maxInt) {%>
												<% if(minInt==i){ %>
													<td align="center" width="9%"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_pCOe_"+i).getValue().equals("0")?"pcoe_on_RB.JPG":"pcoe_off_RB.JPG" %>" width="80px" height="72px" /></td>
												<%}else if(i==maxInt){ %>
													<td align="center" width="9%"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_pCOe_"+i).getValue().equals("0")?"pcoe_on_last.JPG":"pcoe_off_last.JPG" %>" width="80px" height="72px" /></td>
												<%} else{%>
													<td align="center" width="9%"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_pCOe_"+i).getValue().equals("0")?"pcoe_on.JPG":"pcoe_off.JPG" %>" width="80px" height="72px" /></td>
												<%} %>
											<%}else { %>
												<td align="center" width="9%"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_pCOe_"+i).getValue().equals("0")?"pcoe_on_RB_last.JPG":"pcoe_off_RB_last.JPG" %>" width="80px" height="72px" /></td>
											<%} %> 
										<%}%>
									<% } %>
								<%} %>
							<%}else{ %>
								<% for( int i=1;i<=10;i++) {%>
									<% if (!CurrUnit.getVariable("pCOe_"+i+"_Present").getValue().equals("0") && !CurrUnit.getVariable("pCOe_"+i+"_Present").getValue().equals("***") ){%>
										<%if(rbState==0 && minInt>=0 && maxInt>=0 && (i<minInt || i>maxInt )){ 
											pcoeNumbCount++;
										%>
											<%if(pcoeNumbCount!=numbPcoe){ %>
												<td align="center" width="9%"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_pCOe_"+i).getValue().equals("0")?"pcoe_on.JPG":"pcoe_off.JPG" %>" width="80px" height="72px" /></td>
											<%}else{ %>
												<td align="center" width="9%"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_pCOe_"+i).getValue().equals("0")?"pcoe_on_last.JPG":"pcoe_off_last.JPG" %>" width="80px" height="72px" /></td>
											<%} %>
										<%} %>
									<%}%>
								<%} %>
							<%} %>
							<%for(int i=1;i<=10-numbPcoe;i++) { // fill up the space ,make the line connected%>
								<td align="center" width="9%"></td>
							<%} %>
						</tr></table>
					</td>
				</tr>
				<!-- pcoes parameters -->
				<tr height="30%" >
					<td width="100%" valign="top">
						<table width="100%" height="100%" width="100%" border="0px" cellspacing="0px" cellpadding="0px">
						<tr>
							<td  valign="bottom" width="7%" >
								<%if("1".equals( CurrUnit.getVariable("En_Access_Point_FB1").getValue())){ 
								%>
									<% if ( (CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("0") || CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("***"))  && numbPcoe<=0){%>
										
									<%} else{ %>
										<img src="custom/dtlview/pChrono/images/main_middle.JPG" width="70px" height="188px"  />
									 <%}%>
								<%} %>
							</td>
							<% if( minInt>0 && maxInt>0  && rbState ==1 ){  // With Router Bridge%>
								<% for( int pcoeCount =1;pcoeCount<=10;pcoeCount++) { // pcoes before Router Brige%>
									<% if (!CurrUnit.getVariable("pCOe_"+pcoeCount+"_Present").getValue().equals("0") && !CurrUnit.getVariable("pCOe_"+pcoeCount+"_Present").getValue().equals("***") ){%>
										<% if(pcoeCount<minInt || pcoeCount>maxInt){ %>
											<td valign="top" width="9%" align="center" >
												<table class="infotable" width="78px">
													<caption>
														<%=CurrUnit.getVariable("pCOe_"+pcoeCount+"_Status").getRefreshableAssint(
																		"<img src='images/led/L1.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L2.gif' width='10px' height='10px'>")
														%>
													</caption>
													<tr><td ><%=lan.getString("pChrono","addr") %>:</td><td ><%=(CurrUnit.getVariable("MOD_PCOE_Add"+(pcoeCount+1)+".pCOe_Address_Tmp").getRefreshableValue())%></td></tr>
													<% for( int i=1;i<=4;i++) {%>
														<tr>
															<td ><%= i%>
																<%=CurrUnit.getVariable("DIn_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableAssint(
																		"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
																		"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
																%>
															</td>
															<td ><%= i%>
																<%=CurrUnit.getVariable("DOut_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableAssint(
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L1.gif' width='10px' height='10px'>")
																%>
															</td>
														</tr>
													<%} %>
													
													<% for( int i=1;i<=4;i++) {%>
														<tr>
															<td ><%=(CurrUnit.getVariable("AIn_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableValue())%></td>
															<td >
															<%if(i==1){ %>
																<%=(CurrUnit.getVariable("AOut_Ch1_pCOe_"+pcoeCount).getRefreshableValue())%><b><%=(CurrUnit.getVariable("AOut_Ch1_pCOe_"+pcoeCount).getMUnit())%></b>
															<%} %>
															</td>
														</tr>
													<%} %>
												</table>
											</td>
										<%} %>	
									<%} %>
								<%} %>
								<% for( int pcoeCount=1;pcoeCount<=10;pcoeCount++) { // pcoes after Router Brige%>
									<% if (!CurrUnit.getVariable("pCOe_"+pcoeCount+"_Present").getValue().equals("0") && !CurrUnit.getVariable("pCOe_"+pcoeCount+"_Present").getValue().equals("***") ){%>
										<%if(pcoeCount>=minInt && pcoeCount<=maxInt){ %>
											<td valign="top" width="9%" align="center">
												<table class="infotable" width="78px">
													<caption>
														<%=CurrUnit.getVariable("pCOe_"+pcoeCount+"_Status").getRefreshableAssint(
																		"<img src='images/led/L1.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L2.gif' width='10px' height='10px'>")
														%>
													</caption>
													<tr><td ><%=lan.getString("pChrono","addr") %>:</td><td ><%=(CurrUnit.getVariable("MOD_PCOE_Add"+(pcoeCount+1)+".pCOe_Address_Tmp").getRefreshableValue())%></td></tr>
													<% for( int i=1;i<=4;i++) {%>
														<tr>
															<td ><%= i%>
																<%=CurrUnit.getVariable("DIn_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableAssint(
																		"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
																		"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
																%>
															</td>
															<td ><%= i%>
																<%=CurrUnit.getVariable("DOut_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableAssint(
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L1.gif' width='10px' height='10px'>")
																%>
															</td>
														</tr>
													<%} %>
													
													<% for( int i=1;i<=4;i++) {%>
														<tr>
															<td ><%=(CurrUnit.getVariable("AIn_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableValue())%></td>
															<td >
															<%if(i==1){ %>
																<%=(CurrUnit.getVariable("AOut_Ch1_pCOe_"+pcoeCount).getRefreshableValue())%><b><%=(CurrUnit.getVariable("AOut_Ch1_pCOe_"+pcoeCount).getMUnit())%></b>
															<%} %>
															</td>
														</tr>
													<%} %>
												</table>
											</td>
										<%}%>
									<% } %>
								<%} %>
							<%}else{ // No Router Brige%>
								<% for( int pcoeCount=1;pcoeCount<=10;pcoeCount++) {%>
										<% if (!CurrUnit.getVariable("pCOe_"+pcoeCount+"_Present").getValue().equals("0") && !CurrUnit.getVariable("pCOe_"+pcoeCount+"_Present").getValue().equals("***") ){
										%>
											<%if(rbState==0 && minInt>=0 && maxInt>=0 && (pcoeCount<minInt || pcoeCount>maxInt )){ %>
												<td valign="top" width="9%" align="center">
													<table class="infotable"  width="78px">
														<caption>
															<%=CurrUnit.getVariable("pCOe_"+pcoeCount+"_Status").getRefreshableAssint(
																		"<img src='images/led/L1.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L2.gif' width='10px' height='10px'>")
															%>
														</caption>
														<tr><td ><%=lan.getString("pChrono","addr") %>:</td><td ><%=(CurrUnit.getVariable("MOD_PCOE_Add"+(pcoeCount+1)+".pCOe_Address_Tmp").getRefreshableValue())%></td></tr>
														<% for( int i=1;i<=4;i++) {%>
															<tr>
															<td ><%= i%>
																<%=CurrUnit.getVariable("DIn_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableAssint(
																		"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
																		"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
																%>
															</td>
															<td ><%= i%>
																<%=CurrUnit.getVariable("DOut_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableAssint(
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L1.gif' width='10px' height='10px'>")
																%>
															</td>
														</tr>
														<%} %>
														
														<% for( int i=1;i<=4;i++) {%>
															<tr>
																<td ><%=(CurrUnit.getVariable("AIn_Ch_"+i+"_pCOe_"+pcoeCount).getRefreshableValue())%></td>
																<td >
																<%if(i==1){ %>
																	<%=(CurrUnit.getVariable("AOut_Ch1_pCOe_"+pcoeCount).getRefreshableValue())%><b><%=(CurrUnit.getVariable("AOut_Ch1_pCOe_"+pcoeCount).getMUnit())%></b>
																<%} %>
																</td>
															</tr>
														<%} %>
													</table>
												</td>
											<%} %>
										<%}%>
									<%} %>
							<%} %>
							<%for(int i=1;i<=10-numbPcoe;i++) { // fill up the space ,make the line connected%>
								<td align="center" width="9%" ></td>
							<%} %>
						</tr></table>
					</td>
				</tr>
				<%} else{ %>  <!-- first line  -->
				<tr height="<%="10".equalsIgnoreCase(boardType)?"13%":"15%" %>"><td> </td></tr>
				<%} %>
				<!-- SA ,SI images and parameters together -->
				<tr >
					<td width="100%" valign="top" height="100%" >
						<table width="100%" border="0" cellpadding="0px" cellspacing="0px" height="100%">
							<tr>
								<td valign="top" width="7%" >
									<table height="100%" width="100%" border="0px" cellspacing="0px" cellpadding="0px">
										<tr>
										
										<% if (!(CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("0") || CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("***"))  || numbPcoe>=0){%>
											<% if (!CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("0") && !CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("***")){%>
												<td align="center" valign="top"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_AP_FB1").getValue().equals("0")?"main2_wireless.JPG":"main2_wireless_offline.JPG" %>" width="72px" height="72px" /></td>
											<%} %>
										<%}else{ %>
											<% if (!CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("0") && !CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("***")){%>
												<td align="center" valign="top"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_AP_FB1").getValue().equals("0")?"main2_wireless_arcle.JPG":"main2_wireless_arcle_offline.JPG" %>" width="72px" height="72px" /></td>
											<%} %>
										<%} %>
										</tr>
										<tr>
											<td valign="bottom" >
											</td>
										</tr>
									</table>
								</td>
								<% for( int i=1;i<=5;i++) {%>
									<% if (!CurrUnit.getVariable("SA_"+i+"_Present").getValue().equals("0") && !CurrUnit.getVariable("SA_"+i+"_Present").getValue().equals("***")){%>
									<td valign="top" width="9%">
										<table cellpadding="0px" cellspacing="1px">
											<tr>
												<td align="center"><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_SA_0"+i).getValue().equals("0")?"Sensore_SA.JPG":"Sensore_SA_offline.JPG" %>" width="55px" height="48px" /></td>
											</tr>
											<tr>
												<td valign="top" align="center">
													<table class="infotable"  >
														<caption>
															<%=CurrUnit.getVariable("SA_"+i+"_Status").getRefreshableAssint(
																		"<img src='images/led/L1.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L2.gif' width='10px' height='10px'>")
															%>
														</caption>
														<tr><td ><%=lan.getString("pChrono","addr") %>:</td><td ><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+i+".SA_Address_Msk").getRefreshableValue())%></td></tr>
														<tr><td  ><%= temp%></td><td ><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+i+".Temperature_Value").getRefreshableValue())%></td></tr>
														<tr><td ><%= humid%></td><td ><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+i+".Humid_Value").getRefreshableValue())%></td></tr>
														<tr>
															<td >
															<%
																String battery = CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+i+".Battery_Msk").getValue(); 
																if( ! "***".equals(battery) ){
																	battery = Integer.parseInt(battery) > battery_max ? String.valueOf(battery_max) : battery;
																	battery = Integer.parseInt(battery) < battery_min ? String.valueOf(battery_min) : battery;
																}
															%>
															<%if( ! "***".equals(battery) ){ %>
																<img src="custom/dtlview/pChrono/images/battery<%=battery %>.JPG" width="15px" height="15px">
															<%}else{ %>
																<%= CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+i+".Battery_Msk").getRefreshableValue() %>
															<%} %>
															</td>
															<td >
															<% 
																String signal = CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+i+".Signal_Msk").getValue();
																if( ! "***".equals(signal) ){
																	signal = Integer.parseInt(signal) > signal_max ? String.valueOf(signal_max) : signal;
																}
															%>
															<%if( ! "***".equals(signal) ){ %>
																<img src="custom/dtlview/pChrono/images/signal_<%=signal %>.JPG" width="15px" height="15px">
															<%}else{ %>
																<%= CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+i+".Signal_Msk").getRefreshableValue() %>
															<%} %>
															</td>
														</tr>
													</table>
												</td>
											</tr>
											</table>
										</td>
										<%} %>
								<%} %>
								<% for( int i=1;i<=5;i++) {%>
									<% if (!CurrUnit.getVariable("SI_"+i+"_Present").getValue().equals("0")  && !CurrUnit.getVariable("SI_"+i+"_Present").getValue().equals("***")){%>
										<td valign="top" width="9%" >
											<table cellpadding="0px" cellspacing="1px">
												<tr>
													<td  align="center" ><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_SI_0"+i).getValue().equals("0")?"Sensore_SI.JPG":"Sensore_SI_offline.JPG" %>" width="55px" height="48px" /></td>
												</tr>
												<tr>
													<td valign="top"   align="center">
														<table class="infotable" >
															<caption>
																<%=CurrUnit.getVariable("SI_"+i+"_Status").getRefreshableAssint(
																			"<img src='images/led/L1.gif' width='10px' height='10px'>;"+
																			"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
																			"<img src='images/led/L2.gif' width='10px' height='10px'>")
																%>
															</caption>
															<tr><td ><%=lan.getString("pChrono","addr") %>:</td><td ><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".SI_Address_Msk").getRefreshableValue())%></td></tr>
															<tr><td ><%= temp%></td><td ><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".Temp_Value").getRefreshableValue())%></td></tr>
															<tr><td ><%= humid%></td><td ><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".Humid_Value").getRefreshableValue())%></td></tr>
															<tr><td ><%= light%></td><td ><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".Light_Value").getRefreshableValue())%></td></tr>
															<tr>
																<td >
																	<% 
																		String battery = CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".Battery_Msk").getValue();
																		if( ! "***".equals(battery) ){
																			battery = Integer.parseInt(battery) > battery_max ? String.valueOf(battery_max) : battery;
																			battery = Integer.parseInt(battery) < battery_min ? String.valueOf(battery_min) : battery;
																		}
																	%>
																	<%if( ! "***".equals(battery) ){ %>
																		<img src="custom/dtlview/pChrono/images/battery<%=battery%>.JPG" width="15px" height="15px">
																	<%}else{ %>
																		<%= CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".Battery_Msk").getRefreshableValue() %>
																	<%} %>
																</td>
																<td >
																<% 
																	String signal = CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".Signal_Msk").getValue(); 
																	if( ! "***".equals(battery) ){
																		signal = Integer.parseInt(signal) > signal_max ? String.valueOf(signal_max) : signal;
																	}
																%>
																<%if( ! "***".equals(signal) ){ %>
																	<img src="custom/dtlview/pChrono/images/signal_<%=signal%>.JPG" width="15px" height="15px">
																<%}else{ %>
																	<%= CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+i+".Signal_Msk").getRefreshableValue() %>
																<%} %>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											 </table>
										</td>
									<%} %>
								<%} %>
								<% for( int i=1;i<=5;i++) {%>
									<% if (CurrUnit.getVariable("SA_"+i+"_Present").getValue().equals("0") || CurrUnit.getVariable("SA_"+i+"_Present").getValue().equals("***")){%>
									<td valign="top" width="9%">
										<table cellpadding="0px" cellspacing="1px">
											<tr>
												<td  align="left"></td>
											</tr>
											<tr>
												<td valign="top"  align="center"></td>
											</tr>
										</table>
									</td>
									<%} %>
								<%} %>
								<% for( int i=1;i<=5;i++) {%>
									<% if (CurrUnit.getVariable("SI_"+i+"_Present").getValue().equals("0") || CurrUnit.getVariable("SI_"+i+"_Present").getValue().equals("***")){%>
											<td valign="top" width="9%" >
												<table cellpadding="0px" cellspacing="1px">
													<tr>
														<td  align="left"></td>
													</tr>
													<tr>
														<td valign="top"  align="center"></td>
													</tr>
												</table>
											</td>
									<%} %>
								<%} %>
							</tr>
							<!-- plug switch start -->
							<tr>
								<td valign="top" width="7%" >
									<table height="100%" width="100%" border="0px" cellspacing="0px" cellpadding="0px">
										<tr>
											<td align="center" valign="top"></td>
										</tr>
										<tr>
											<td valign="bottom" >
											</td>
										</tr>
									</table>
								</td>
								<% for( int i=1;i<=10;i++) {%>
									<% if (!CurrUnit.getVariable("Plug_"+i+"_Present").getValue().equals("0") && !CurrUnit.getVariable("Plug_"+i+"_Present").getValue().equals("***")){%>
									<td valign="top" width="9%">
										<table cellpadding="0px" cellspacing="1px" width="90%">
											<tr>
												<td align="center" ><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_SOCKET_"+i).getValue().equals("0")?"Sochet_wireless.JPG":"Sochet_wireless_offline.JPG" %>" width="55px" height="48px" /></td>
											</tr>
											<tr>
												<td valign="top" align="center">
													<table class="infotable"  >
														<caption>
															<%=CurrUnit.getVariable("Al_Offline_SOCKET_"+i).getRefreshableAssint(
																		"<img src='images/led/L1.gif' width='10px' height='10px'>;"+
																		"<img src='images/led/L0.gif' width='10px' height='10px'>;")
															%>
														</caption>
														<tr><td  width="50%"><%=lan.getString("pChrono","addr") %>:</td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Socket_Address_Msk").getRefreshableValue())%></td></tr>
														<tr><td  width="50%"><%= status%></td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Output_Stat").getRefreshableAssint("OFF;ON"))%></td></tr>
														<tr><td  width="50%"><%= power%></td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Active_Power").getRefreshableValue())%></td></tr>
														<tr><td  width="50%"><%= energy%></td><td  align="left"><%=(CurrUnit.getVariable("Socket_Energy"+i).getRefreshableValue())%></td></tr>
														<tr>
															<td  width="50%">
															</td>
															<td  align="left">
															<% 
																String signal = CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Signal_Msk").getValue(); 
																if( ! "***".equals(signal) ){
																	signal = Integer.parseInt(signal) > signal_max ? String.valueOf(signal_max) : signal;
																}
															%>
															<%if( ! "***".equals(signal) ){ %>
																<img src="custom/dtlview/pChrono/images/signal_<%=signal %>.JPG" width="15px" height="15px">
															<%}else{ %>
																<%= CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Signal_Msk").getRefreshableValue() %>
															<%} %>
															</td>
														</tr>
													</table>
												</td>
											</tr>
											</table>
										</td>
										<%} %>
								<%} %>
								<% for( int i=1;i<=10;i++) {%>
									<% if (!CurrUnit.getVariable("Switch_"+i+"_Present").getValue().equals("0")  && !CurrUnit.getVariable("Switch_"+i+"_Present").getValue().equals("***")){%>
										<td valign="top" width="9%" >
											<table cellpadding="0px" cellspacing="1px" width="90%">
												<tr>
													<td  align="center" ><img src="custom/dtlview/pChrono/images/<%= CurrUnit.getVariable("Al_Offline_SOCKET_"+i).getValue().equals("0")?"Sochet_wall_wireless.JPG":"Sochet_wall_wireless_offline.JPG" %>" width="55px" height="48px" /></td>
												</tr>
												<tr>
													<td valign="top"   align="center">
														<table class="infotable" >
															<caption>
																<%=CurrUnit.getVariable("Al_Offline_SOCKET_"+i).getRefreshableAssint(
																			"<img src='images/led/L1.gif' width='10px' height='10px'>;"+
																			"<img src='images/led/L0.gif' width='10px' height='10px'>;")
																%>
															</caption>
															<tr><td  width="50%"><%=lan.getString("pChrono","addr") %>:</td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Socket_Address_Msk").getRefreshableValue())%></td></tr>
															<tr><td  width="50%"><%= status%></td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Output_Stat").getRefreshableAssint("OFF;ON"))%></td></tr>
															<tr><td  width="50%"><%= power%></td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Active_Power").getRefreshableValue())%></td></tr>
															<tr><td  width="50%"><%= energy%></td><td  align="left"><%=(CurrUnit.getVariable("Socket_Energy"+i).getRefreshableValue())%></td></tr>
															<tr>
																<td  width="50%">
																</td>
																<td  align="left">
																<% 
																	String signal = CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Signal_Msk").getValue(); 
																	if( ! "***".equals(signal) ){	
																	signal = Integer.parseInt(signal) > signal_max ? String.valueOf(signal_max) : signal;
																	}
																%>
																<%if( ! "***".equals(signal) ){ %>
																	<img src="custom/dtlview/pChrono/images/signal_<%=signal %>.JPG" width="15px" height="15px">
																<%}else{ %>
																	<%= CurrUnit.getVariable("MOD_MB_SOCKET_"+i+".Signal_Msk").getRefreshableValue() %>
																<%} %>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											 </table>
										</td>
									<%} %>
								<%} %>
								<% for( int i=1;i<=5;i++) {%>
									<% if (CurrUnit.getVariable("Plug_"+i+"_Present").getValue().equals("0") || CurrUnit.getVariable("SA_"+i+"_Present").getValue().equals("***")){%>
									<td valign="top" width="9%">
										<table cellpadding="0px" cellspacing="1px">
											<tr>
												<td  align="left"></td>
											</tr>
											<tr>
												<td valign="top"  align="center"></td>
											</tr>
										</table>
									</td>
									<%} %>
								<%} %>
								<% for( int i=1;i<=5;i++) {%>
									<% if (CurrUnit.getVariable("Switch_"+i+"_Present").getValue().equals("0") || CurrUnit.getVariable("SI_"+i+"_Present").getValue().equals("***")){%>
											<td valign="top" width="9%" >
												<table cellpadding="0px" cellspacing="1px">
													<tr>
														<td  align="left"></td>
													</tr>
													<tr>
														<td valign="top"  align="center"></td>
													</tr>
												</table>
											</td>
									<%} %>
								<%} %>
							</tr>
							<!-- plug switch end -->
							<% if (!(CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("0") || CurrUnit.getVariable("En_Access_Point_FB2").getValue().equals("***")  && numbPcoe<=0)){%>
							 <%} else if (!CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("0") && !CurrUnit.getVariable("En_Access_Point_FB1").getValue().equals("***")){ %>
								<tr height="30%"><td colspan="11"></td></tr>
							<%} %>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>

</td></tr>
<%} else{// if devExist %>	
	<tr height="5%"><td colspan="5" class="th" align="Center"><%=noconnect %> </td></tr>	
	<tr height="95%"><td colspan="5" ></td></tr>
<%}%>
</table>


