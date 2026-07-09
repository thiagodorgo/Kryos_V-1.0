<%@page language="java" 
	import="com.carel.supervisor.presentation.sdk.util.Sfera"
	
	import="com.carel.supervisor.dataaccess.language.LangService"
	import="com.carel.supervisor.dataaccess.language.LangMgr"
	import="com.carel.supervisor.presentation.session.UserSession"
	import="java.util.*"
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
	
	String din = lan.getString("pChrono","din");
	String spv_gl = lan.getString("pChrono","spv_gl");
	String spv = lan.getString("pChrono","spv");
	String aout = lan.getString("pChrono","aout");
	String dout = lan.getString("pChrono","dout");
	String pos_gen_fun = lan.getString("pChrono","pos_gen_fun");
	String lux = lan.getString("pChrono","lux");
	String light_mng_type = lan.getString("pChrono","light_mng_type");
	String gen_load_mng_type = lan.getString("pChrono","gen_load_mng_type");
	String gen_func_type = lan.getString("pChrono","gen_func_type");
	String gen_func_output_type = lan.getString("pChrono","gen_func_output_type");
	String mon = lan.getString("cal","mon");
	String tue = lan.getString("cal","tue");
	String wed = lan.getString("cal","wed");
	String thu = lan.getString("cal","thu");
	String fri = lan.getString("cal","fri");
	String sat = lan.getString("cal","sat");
	String sun = lan.getString("cal","sun");
	String months[] = {
			"",
			lan.getString("cal","january") ,
			lan.getString("cal","february"),
			lan.getString("cal","march"),
			lan.getString("cal","april"),
			lan.getString("cal","may"),
			lan.getString("cal","june"),
			lan.getString("cal","july"),
			lan.getString("cal","august"),
			lan.getString("cal","september"),
			lan.getString("cal","october"),
			lan.getString("cal","november"),
			lan.getString("cal","december")
		};
	String nameStr = "-@A@B@C@D@E@F@G@H@I@J@K@L@M@N@O@P@Q@R@S@T@U@V@W@X@Y@Z@a@b@c@d@e@f@g@h@i@j@k@l@m@n@o@p@q@r@s@t@u@v@w@x@y@z@0@1@2@3@4@5@6@7@8@9@.@,@/@#@;@:@*@'@^@ ";
	String [] nameStrArray = nameStr.split("@");
	String addexcep = lan.getString("dtlview","addexcep");
	String from = lan.getString("alrsearch","from");
	String to = lan.getString("alrsearch","to");
	String noexcep = lan.getString("dtlview","noexcep");
	String periodsel = lan.getString("dtlview","periodsel");
	String remove = lan.getString("setaction","del");
	String maxexcepreach = lan.getString("dtlview","maxexcepreach");
	String listexcep = lan.getString("dtlview","listexcep");
	String noconnect = lan.getString("pChrono","noconnect");
	String tbuse = lan.getString("pChrono","tbuse");
	String pduse = lan.getString("pChrono","pduse");
	String period = lan.getString("evnsearch","period");
	String disable = lan.getString("setline","disab");
	String enable = lan.getString("pChrono","enable");
	String time = lan.getString("report","time");
	String tb = lan.getString("pChrono","tb");
	String swch = lan.getString("switch","switch");
	String stop = lan.getString("parameters","stop");
	String start = lan.getString("parameters","start");
	String status = lan.getString("switch","status")+":";
	String power = lan.getString("energy","power")+":";
	String energy = lan.getString("plugin","EG")+":";
	String devExist = CurrUnit.getVariable("Board").getValue();
	
	//suit Stress mode;
	int Manual_SPV_L_MAX = 2;
%>

<!-- wireless socket  -->
<form id="formSettableVars" name="formSettableVars" action="#">
<div id="HideMe6" >
<table  width="100%" height="100%" align="center" cellspacing="0" cellpadding="0" >
<%
  if( ! "***".equalsIgnoreCase(devExist)){
%>  
<tr><td width="100%" height="100%" valign="top" >
	<table  width="100%" height="100%" align="center" cellspacing="5" cellpadding="5" >
		<tr>
		<!-- plug -->
		<%
		int tds = 0;
		for(int areaCount=1;areaCount<=10;areaCount++) {
			 if (!CurrUnit.getVariable("Plug_"+areaCount+"_Present").getValue().equals("0") && !CurrUnit.getVariable("Plug_"+areaCount+"_Present").getValue().equals("***")){
				tds++;
		%>
			<td  width="25%" valign="top">
				<table width="100%" class="infotable" cellspacing="0" cellpadding="0"  >
					<%
					String areaName="";
					String idsArray = "  var ids"+areaCount+" =new Array(); ";
					
					for(int i=1;i<=8;i++){ 
						areaName += nameStrArray[Integer.parseInt(CurrUnit.getVariable("Letter_"+i+"_Socket"+areaCount).getValue())];
						int id = CurrUnit.getVariable("Letter_"+i+"_Socket"+areaCount).getId();
						idsArray  += " ids"+areaCount+"[ "+(i-1)+"] = 'dtlst_"+id+"'; ";
					%>
					
						<%= CurrUnit.getVariable("Letter_"+i+"_Socket"+areaCount).getHiddenInput()%>
					<%
					}
					%>
					<script>
					<%= idsArray%>
					</script>
					<tr><th align="center" colspan="2" class="th"><div style="float:left">#<%=areaCount %></div>
						<INPUT onblur="tabNameInSub(this,ids<%=areaCount %>);" type="text" size="10"
							   class='lswtype' value = "<%= areaName %>" maxLength="8" />
					 </th></tr>
					<tr><td   style="padding: 4px" width="30%"><%=lan.getString("pChrono","addr")%>:</td><td  align="left"  ><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Socket_Address_Msk").getRefreshableValue())%></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= power%></td><td  align="left" ><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Active_Power").getRefreshableValue())%> &nbsp;&nbsp;<b><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Active_Power").getMUnit())%></b></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= energy%></td><td   align="left" ><%=(CurrUnit.getVariable("Socket_Energy"+areaCount).getRefreshableValue())%>&nbsp;&nbsp;<b><%=(CurrUnit.getVariable("Socket_Energy"+areaCount).getMUnit())%></b></td></tr>
					<tr>
						<td   style="padding: 2px" width="30%"><%=lan.getString("pChrono","excep")%></td>
						<td ><%= enable%><input type="radio"  name="<%=CurrUnit.getVariable( "En_Ex_Socket_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getValue() )?"checked value='' ":" value='1' " %> /> &nbsp; <%= disable%><input type="radio" name="<%=CurrUnit.getVariable( "En_Ex_Socket_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getValue() )?"checked value = '' ":" value='0' " %> /></td>
					</tr>
					
					<tr>
					 	<td colspan="2" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr><td  style="padding: 2px" ><%= status%></td>
									
										<td    style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Output_Stat").getRefreshableAssint("OFF;ON"))%></td>
										<td  style="padding: 2px" align="center" onclick="imgSwitch('<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>')">
												<%
												String Manual_SPV_L = CurrUnit.getVariable("Force_Socket_"+areaCount).getValue();
												%>
												<img width="60px" height="53px" id="img_<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>" name="img_<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>" src="custom/dtlview/pLoads/Position_<%=Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L%>.png"/>
												<input type='hidden' name="<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>"  value="<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getValue()%>" />
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"><%=lan.getString("pChrono","cycle_time")%>:</td>
										<td   style="padding: 2px">	<%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getRefreshableValue() %>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
												class='lswtype'
											   onblur="sdk_checkMinMaxValue(this,5,600);checkOnlyAnalogOnBlur(this);" type="text" size="5" />
											
										</td>
									</tr>
								</table>
							</td>
					</tr>
					 <% for( int scd=1;scd<=3;scd++) {
						 String week = CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".TimeBand_"+scd).getValue();
						 week = Integer.toBinaryString(Integer.parseInt(week)); 
						 String[] names={mon,tue,wed,thu,fri,sat,sun};
						 int[] values =new int[names.length];
						 int z=0;
						 for(int i=week.length()-1;i>=0;i--){
						 	values[z] = Integer.parseInt(""+week.charAt(i));
						 	z++;
						 	if(z==names.length)
								break;
						 }
						 if(z<names.length ){
						 	for(int i=z;i<=names.length-1;i++){
						 		values[i] = 0;
						 	}
						 }
					 %>
					 <tr>
					 	<td colspan="2" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr><td  ><%=tb+" "+scd%>:</td>
										<td  colspan="2" >
											<select name="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>" id="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>">
												<% for (int i=0; i<=20; i++) { %>
													<option <%= i==(Integer.parseInt(CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_TB_G1").getValue()))?" selected value = '' ":"value = '"+i+"' " %> > 
														<% if(i==0){%>
														 --
														<%}else{ 
													 int sh = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+i).getValue());
													 int sm = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+i).getValue());
													 int eh = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+i).getValue());
													 int em = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+i).getValue());
													%>
													<%=(i<10?"0":"")+i%>&nbsp;(<%= (sh<10?"0":"")+sh%>:<%= (sm<10?"0":"")+sm%>--<%= (eh<10?"0":"")+eh%>:<%= (em<10?"0":"")+em%>)
													<%} %>
												</option>
											<% } // options for loop %>				
										</select>
									</td>
								</tr>
								<tr>
								<td  style="padding: 2px" ><%=period+" "+scd%>:</td>
								<td  style="padding: 2px" >
									<select name="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>" id="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>">
										<% for (int j=0; j<=10; j++) { %>
											<option  <%= j==(Integer.parseInt(CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_PD_G1").getValue()))?" selected value='' ":" value = '"+j+"' " %> > 
												<% if(j==0){%>
												 --
												<%}else{ 
												 int sday = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+j).getValue());
												 int smon = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+j).getValue());
												 int eday = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+j).getValue());
												 int emon = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+j).getValue());
												%>
												<%=(j<10?"0":"")+j%>&nbsp;(<%= (sday<10?"0":"")+sday%>/<%= (smon<10?"0":"")+smon%>--<%= (eday<10?"0":"")+eday%>/<%= (emon<10?"0":"")+emon%>)
												<%} %>
											</option>
										<% } %>				
									</select>
								</td>
								</tr>
								<tr><td colspan="2" valign="top"> 
										<%=  CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".TimeBand_"+scd).getHiddenInput()%>
										<table width="100%">
											<tr> 
												<%for(int i=0;i<names.length;i++){ %>
												<td  align="center"><%= names[i]%></td>
												<%} %>
											</tr>
											<tr> 
												<%for(int i=0;i<values.length;i++){ %>
												<td  align="center"><%= CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".TimeBand_"+scd).getCheckbox(values[i],"getDecimal") %></td>
												<%} %>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<%} // 3 dateBands scheduler for loop%>
				</table>
			</td>
			<%if(tds%4==0){%>
			</tr>
			<tr>
			<%}%>
	<% } } // plug for loop%>
	<!-- five switch -->
		<%
		/*
	  String switchAreaNumbStr = CurrUnit.getVariable("Number_SWITCH").getValue();
	  int switchAreaNumb =0 ;
	  if(!"***".equals(switchAreaNumbStr)){
		  switchAreaNumb = Integer.parseInt(switchAreaNumbStr);
	  }
	  */
		for(int areaCount=1;areaCount<=10;areaCount++) {
			if (!CurrUnit.getVariable("Switch_"+areaCount+"_Present").getValue().equals("0")  && !CurrUnit.getVariable("Switch_"+areaCount+"_Present").getValue().equals("***")){
				tds++;
		%>
			<td  width="25%" valign="top">
				<table width="100%" class="infotable" cellspacing="0" cellpadding="0"  >
					<%
					String areaName="";
					String idsArray = "  var ids"+areaCount+" =new Array(); ";
					
					for(int i=1;i<=8;i++){ 
						areaName += nameStrArray[Integer.parseInt(CurrUnit.getVariable("Letter_"+i+"_Socket"+areaCount).getValue())];
						int id = CurrUnit.getVariable("Letter_"+i+"_Socket"+areaCount).getId();
						idsArray  += " ids"+areaCount+"[ "+(i-1)+"] = 'dtlst_"+id+"'; ";
					%>
					
						<%= CurrUnit.getVariable("Letter_"+i+"_Socket"+areaCount).getHiddenInput()%>
					<%
					}
					%>
					<script>
					<%= idsArray%>
					</script>
					<tr><th align="center" colspan="2" class="th"><div style="float:left">#<%=areaCount %></div>
						<INPUT onblur="tabNameInSub(this,ids<%=areaCount %>);" type="text" size="10"
							   class='lswtype' value = "<%= areaName %>" maxLength="8" />
					 </th></tr>
					<tr><td   style="padding: 4px" width="30%"><%=lan.getString("pChrono","addr")%>:</td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Socket_Address_Msk").getRefreshableValue())%></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= power%></td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Active_Power").getRefreshableValue())%>&nbsp;&nbsp;<b><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Active_Power").getMUnit())%></b></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= energy%></td><td   align="left"><%=(CurrUnit.getVariable("Socket_Energy"+areaCount).getRefreshableValue())%>&nbsp;&nbsp;<b><%=(CurrUnit.getVariable("Socket_Energy"+areaCount).getMUnit())%></b></td></tr>
					<tr>
						<td   style="padding: 2px" width="30%"><%=lan.getString("pChrono","excep")%></td>
						<td ><%= enable%><input type="radio"  name="<%=CurrUnit.getVariable( "En_Ex_Socket_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getValue() )?"checked value = '' ":" value='1' " %> /> &nbsp; <%= disable%><input type="radio" name="<%=CurrUnit.getVariable( "En_Ex_Socket_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Ex_Socket_"+areaCount).getValue() )?" checked value = '' ":" value = '0' " %> /></td>
					</tr>
					<tr>
					 	<td colspan="2" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr><td  style="padding: 2px" ><%= status%></td>
									
										<td    style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Output_Stat").getRefreshableAssint("OFF;ON"))%></td>
										<td  style="padding: 2px" align="center" onclick="imgSwitch('<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>')">
												<%
												String Manual_SPV_L = CurrUnit.getVariable("Force_Socket_"+areaCount).getValue();
												%>
												<img width="60px" height="53px" id="img_<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>" name="img_<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>" src="custom/dtlview/pLoads/Position_<%=Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L%>.png"/>
												<input type='hidden' name="<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getPostName()%>"  value="<%=CurrUnit.getVariable("Force_Socket_"+areaCount).getValue()%>" />
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"><%=lan.getString("pChrono","cycle_time")%>:</td>
										<td   style="padding: 2px">	<%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getRefreshableValue() %>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SOCKET_"+areaCount+".Transmit_Cycle").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
												class='lswtype'
											   onblur="sdk_checkMinMaxValue(this,5,600);checkOnlyAnalogOnBlur(this);" type="text" size="5" />
										</td>
									</tr>	
								</table>
							</td>
					</tr>
					 <% for( int scd=1;scd<=3;scd++) {
						 String week = CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".TimeBand_"+scd).getValue();
						 week = Integer.toBinaryString(Integer.parseInt(week)); 
						 String[] names={mon,tue,wed,thu,fri,sat,sun};
						 int[] values =new int[names.length];
						 int z=0;
						 for(int i=week.length()-1;i>=0;i--){
						 	values[z] = Integer.parseInt(""+week.charAt(i));
						 	z++;
						 	if(z==names.length)
								break;
						 }
						 if(z<names.length ){
						 	for(int i=z;i<=names.length-1;i++){
						 		values[i] = 0;
						 	}
						 }
					 %>
					 <tr>
					 	<td colspan="2" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr><td  ><%=tb+" "+scd%>:</td>
										<td  colspan="2" >
											<select name="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>" id="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>">
												<% for (int i=0; i<=20; i++) { %>
													<option  <%= i==(Integer.parseInt(CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_TB_G1").getValue()))?" selected value='' ":" value ='"+i+"' " %> > 
														<% if(i==0){%>
														 --
														<%}else{ 
													 int sh = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+i).getValue());
													 int sm = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+i).getValue());
													 int eh = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+i).getValue());
													 int em = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+i).getValue());
													%>
													<%=(i<10?"0":"")+i%>&nbsp;(<%= (sh<10?"0":"")+sh%>:<%= (sm<10?"0":"")+sm%>--<%= (eh<10?"0":"")+eh%>:<%= (em<10?"0":"")+em%>)
													<%} %>
												</option>
											<% } // options for loop %>				
										</select>
									</td>
								</tr>
								<tr>
								<td  style="padding: 2px" ><%=period+" "+scd%>:</td>
								<td  style="padding: 2px" >
									<select name="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>" id="<%=CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>">
										<% for (int j=0; j<=10; j++) { %>
											<option <%= j==(Integer.parseInt(CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".Sel_0"+scd+"_PD_G1").getValue()))?" selected value = '' ":" value = '" +j+"' "%> > 
												<% if(j==0){%>
												 --
												<%}else{ 
												 int sday = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+j).getValue());
												 int smon = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+j).getValue());
												 int eday = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+j).getValue());
												 int emon = Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+j).getValue());
												%>
												<%=(j<10?"0":"")+j%>&nbsp;(<%= (sday<10?"0":"")+sday%>/<%= (smon<10?"0":"")+smon%>--<%= (eday<10?"0":"")+eday%>/<%= (emon<10?"0":"")+emon%>)
												<%} %>
											</option>
										<% } %>				
									</select>
								</td>
								</tr>
								<tr><td colspan="2" valign="top"> 
										<%=  CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".TimeBand_"+scd).getHiddenInput()%>
										<table width="100%">
											<tr> 
												<%for(int i=0;i<names.length;i++){ %>
												<td  align="center"><%= names[i]%></td>
												<%} %>
											</tr>
											<tr> 
												<%for(int i=0;i<values.length;i++){ %>
												<td  align="center"><%= CurrUnit.getVariable("SCHED_SET_SOCKET_"+areaCount+".TimeBand_"+scd).getCheckbox(values[i],"getDecimal") %></td>
												<%} %>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<%} // 3 dateBands scheduler for loop%>
				</table>
			</td>
			<%if(tds%4==0){%>
			</tr>
			<tr >
			<%}%>
	<%} } // switch for loop%>
		<% 	for(int i =1;i<=4-tds%4;i++){%>
			<td width="25%"></td>
		
		<%} %>
		
	</tr>
	</table>	
</td></tr>
<%} else{// if devExist %>	
	<tr height="10%"><td  class="th" align="Center"><%=noconnect %>  </td></tr>	
	<tr height="90%"><td ></td></tr>
<%}%>
</table>
</div>
</form>