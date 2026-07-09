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
%>
<form id="formSettableVars" name="formSettableVars" action="#">
<!-- pumps -->
<div id="HideMe3" >
<table  width="100%" height="100%" align="center" cellspacing="0" cellpadding="0" >
<%
  if( ! "***".equalsIgnoreCase(devExist)){
%>  
<tr><td width="100%" height="100%" valign="top" >  
	<table  width="80%" height="80%" align="left" cellspacing="10" cellpadding="10" >
		<%devExist = CurrUnit.getVariable("Board").getValue();
		  if( ! "***".equalsIgnoreCase(devExist)){
			  String areaNumbStr = CurrUnit.getVariable("Num_Pump_Group").getValue();
			  int areaNumb =0 ;
			  if(!"***".equals(areaNumbStr)){
				  areaNumb = Integer.parseInt(areaNumbStr);
			  }
		%>
		<tr >
		<%for(int areaCount=1;areaCount<=2;areaCount++) {%>
			<%if(areaCount<=areaNumb){ %>
			
			<!-- this pump exist or not "Pump_G1_Present" "Pump_G2_Present" -->
			
			<td  width="40%" valign="top">
				<table width="100%" class="infotable" cellspacing="0" cellpadding="0"  >
					<tr><th align="center" colspan="3" class="th"><%=lan.getString("energy","energroup") %> <%=areaCount %> </th></tr>
					<tr>
							<td   style="padding: 2px" width="33%"><%=lan.getString("pChrono","pump_num")%>: </td>
							<td  style="padding: 2px" width="33%"> 
								<%=(CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".N_Pumps").getRefreshableValue())%>
							</td>
							<td width="33%"></td>
					</tr>
					<% 
						int num = Integer.parseInt( CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".N_Pumps").getValue());
						if(num>0){
					%>
					<tr>
						<td   style="padding: 2px"><%=lan.getString("pChrono","pump_req")%>:</td>
						<td  style="padding: 2px"><%=(CurrUnit.getVariable("Din_Sta_Req_Pump_G"+areaCount).getRefreshableValue())%></td>
						<td  style="padding: 2px"><%=(CurrUnit.getVariable("Pos_Req_Pump_G"+areaCount).getRefreshableAssint(din))%></td>
					</tr>
					<tr>
						<td   style="padding: 2px"><%=lan.getString("pChrono","no_water")%>:</td>
						<td  style="padding: 2px">
							<%=CurrUnit.getVariable("Din_Sta_No_Water_FL_G"+areaCount).getRefreshableAssint(
								"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
								"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
							%>
						</td>
						<td  style="padding: 2px"><%=(CurrUnit.getVariable("Pos_No_Water_FL_G"+areaCount).getRefreshableAssint(din))%></td>
					</tr>
					<tr>
						<td    style="padding: 2px"><%=lan.getString("pChrono","anti_act")%>:</td>
						<td  style="padding: 2px"><%=(CurrUnit.getVariable("Din_Sta_Anti_Act_G"+areaCount).getRefreshableValue())%></td>
						<td  style="padding: 2px"><%=(CurrUnit.getVariable("Pos_Antifreeze_Act_G"+areaCount).getRefreshableAssint(din))%></td>
					</tr>
					<tr>
						<td   style="padding: 2px"><%=lan.getString("pChrono","en_anti")%>:</td>
						<td ><%= enable%><input type="radio"  name="<%=CurrUnit.getVariable( "MOD_PUMPS_"+areaCount+".En_Antiblock").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".En_Antiblock").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".En_Antiblock").getValue() )?" checked value='' ":" value='"+1+"' " %> /></td>
						<td ><%= disable%><input type="radio" name="<%=CurrUnit.getVariable( "MOD_PUMPS_"+areaCount+".En_Antiblock").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".En_Antiblock").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".En_Antiblock").getValue() )?" checked value=''":" value='"+0+"' "%> /></td>
					</tr>
						<%} %>
					<% for(int i=1; i<=num ;i++){ 
						String s = "Pump"+i+"_Status_G"+areaCount;
					%>
					 <tr>
					 	<td colspan="3" >
					 		<table class="<%=i==2?"topBottomLine":"topLine" %>" width="100%">
							    <tr>
									<td  style="padding: 2px" width="33%"><%=lan.getString("pChrono","pump")+i%>:</td>
									<td  style="padding: 2px" width="33%">
										<%=CurrUnit.getVariable(s).getRefreshableAssint("<img src='images/led/L0.gif' width='10px' height='10px'>;<img src='images/led/L1.gif' width='10px' height='10px'>") %>
									</td>
									 <td  style="padding: 2px" width="33%"><%=CurrUnit.getVariable("Pos_Dout_Pump"+i+"_G"+areaCount).getRefreshableAssint(dout)%></td> 
								</tr>
							    <tr>
									<td   style="padding: 2px"><%=lan.getString("pChrono","overload_pump")+i%>:</td>
									<td  style="padding: 2px"> 
										<%=CurrUnit.getVariable("Din_Sta_Ovl_Pump"+i+"_G"+areaCount).getRefreshableAssint(
											"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
											"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
										%>
									</td>
									<td   style="padding: 2px"><%=CurrUnit.getVariable("Pos_Ovl_Pump"+i+"_G"+areaCount).getRefreshableAssint(din)%></td> 
								</tr>
							</table>
						</td>
					</tr>
					<%}
					if(num==2){
					%>
						<tr>
							<td   style="padding: 2px"><%=lan.getString("pChrono","rot_type")%>:</td>
							<td ><%=time %> <input type="radio"  name="<%=CurrUnit.getVariable( "MOD_PUMPS_"+areaCount+".Type_Rotation").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".Type_Rotation").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".Type_Rotation").getValue() )?" checked value = '' ":" value='0' " %> /></td>
							<td ><%= swch%><input type="radio" name="<%=CurrUnit.getVariable( "MOD_PUMPS_"+areaCount+".Type_Rotation").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".Type_Rotation").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".Type_Rotation").getValue() )?"checked value = '' ":" value = '1' " %> /></td>
						</tr>
						<% 
							String typeRotation = CurrUnit.getVariable("MOD_PUMPS_"+areaCount+".Type_Rotation").getValue();
						if("0".equals(typeRotation)){
						%>
						<tr>
							<td   style="padding: 2px"><%=lan.getString("pChrono","rot_time")%>:</td>
							<td  style="padding: 2px">
								<%=(CurrUnit.getVariable("Rotation_Time_G"+areaCount).getRefreshableValue())%>
								<%=(CurrUnit.getVariable("Rotation_Time_G"+areaCount).getMUnit() )%>
							</td>
							<td  style="padding: 2px">
								<INPUT NAME="<%=CurrUnit.getVariable("Rotation_Time_G"+areaCount).getPostName()%>" 
								   id="<%=CurrUnit.getVariable("Rotation_Time_G"+areaCount).getPostName()%>" 
								   onkeydown="checkOnlyAnalog(this,event);" 
								   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" type="text" size="5" class='lswtype'/>
							</td>
						</tr>
						<%}else{ %>
						<tr>
							<td   style="padding: 2px"><%=lan.getString("pChrono","switch_pump")%>:</td>
							<td  style="padding: 2px"><%=(CurrUnit.getVariable("Din_Sta_Switch_Pumps_G"+areaCount).getRefreshableValue())%></td>
							<td  style="padding: 2px"><%=(CurrUnit.getVariable("Pos_Sw_Pumps_G"+areaCount).getRefreshableAssint(din))%></td>
						</tr>
						<%}
				    }%>
				</table>
			</td>
	 <%}else{ %>
		 	<td  ></td>
		 <%} %>
	<% } // area for loop%>
			</tr>
	<%} else{// if devExist %>	
		<tr height="5%"><td colspan="5" class="th" align="Center"><%=noconnect %>  </td></tr>	
		<tr height="95%"><td colspan="5" ></td></tr>
	<%}%>
	</table>
</td></tr>
<%} else{// if devExist %>	
	<tr height="5%"><td colspan="5" class="th" align="Center"><%=noconnect %>  </td></tr>	
	<tr height="95%"><td colspan="5" ></td></tr>
<%}%>
</table>
</div>
</form>