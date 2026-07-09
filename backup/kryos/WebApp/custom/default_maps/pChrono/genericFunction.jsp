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
	String din_new = lan.getString("pChrono","din_new");
	String spv_gl = lan.getString("pChrono","spv_gl");
	String spv = lan.getString("pChrono","spv");
	String aout = lan.getString("pChrono","aout");
	String dout = lan.getString("pChrono","dout");
	String dout_new = lan.getString("pChrono","dout_new");
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

<!-- generic function -->
<form id="formSettableVars" name="formSettableVars" action="#">
<div id="HideMe5" >
<input type="hidden" id="s_minval" value="Minimum value: " />
<input type="hidden" id="s_maxval" value="Maximum value: " />
<table  width="100%" height="100%" align="center" cellspacing="0" cellpadding="0" >
<%
  if( ! "***".equalsIgnoreCase(devExist)){
%>  
<tr><td width="100%" height="100%" valign="top">
	<table  width="100%" height="100%" align="center" cellspacing="2" cellpadding="2" >
		<%
		  String areaNumbStr = CurrUnit.getVariable("Num_Generic_Fun").getValue();
		  int areaNumb =0 ;
		  if(!"***".equals(areaNumbStr)){
			  areaNumb = Integer.parseInt(areaNumbStr);
		  }
		%>
		<tr>
		<%for(int areaCount=1;areaCount<=20;areaCount++) {%>
			<%if(areaCount<=areaNumb){ %>
			<td  width="25%" valign="top">
				<table width="100%" class="infotable" cellspacing="0" cellpadding="0"  >
					
				<%
				String areaName="";
				String idsArray = "  var ids"+areaCount+" =new Array(); ";
				
				for(int i=1;i<=8;i++){ 
					areaName += nameStrArray[Integer.parseInt(CurrUnit.getVariable("Letter_"+i+"_GF_"+areaCount).getValue())];
					int id = CurrUnit.getVariable("Letter_"+i+"_GF_"+areaCount).getId();
					idsArray  += " ids"+areaCount+"[ "+(i-1)+"] = 'dtlst_"+id+"'; ";
				%>
				
					<%= CurrUnit.getVariable("Letter_"+i+"_GF_"+areaCount).getHiddenInput()%>
				<%
				}
				%>
				<script>
				<%= idsArray%>
				</script>
				<tr> <th align="center" colspan="3" class="th"> <div style="float:left">#<%=areaCount %></div>
						<INPUT onblur="tabNameInSub(this,ids<%=areaCount %>);" type="text" size="10"
							   class='lswtype' value = "<%= areaName %>" maxLength="8" />

					 </th>
				</tr>
					 <tr>
						<%if("0".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue()) || "1".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue())){ %>
							<td  style="padding: 4px" width="30%"> <%=lan.getString("pChrono","func_value")%>:</td>
							<td  style="padding: 4px" width="30%"> <%=(CurrUnit.getVariable("Gen_Probe"+areaCount+"_Value").getRefreshableValue())%></td>
							<td  style="padding: 4px" width="40%"><%=(CurrUnit.getVariable("Pos_Gen_Fun_"+areaCount).getRefreshableAssint(pos_gen_fun))%></td>
						<%}else if("2".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue())){%>
							<td  style="padding: 4px" width="30%"> <%=lan.getString("pChrono","func_value")%>:</td>
							<td  style="padding: 4px" width="30%"> <%=(CurrUnit.getVariable("Din_Status_Gen_Al_"+areaCount).getRefreshableAssint(
												"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
												"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>"))%>
							</td>
							<td  style="padding: 4px" width="40%"><%=(CurrUnit.getVariable("Pos_Gen_Al_"+areaCount).getRefreshableAssint(din_new))%></td>
						
						<%}%>
					</tr>
					<tr>
						<td  style="padding: 4px"><%=lan.getString("pChrono","func_type")%>:</td>
						<td  style="padding: 4px" colspan="2">
							<% 
								int type_current = (Integer.parseInt(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue())); 
								type_current = type_current>(gen_func_type.split(";").length-1)?(gen_func_type.split(";").length-1):type_current;
							%>
							<%=gen_func_type.split(";")[type_current] %>
						</td>
					</tr>
			<%if( "0".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue()) ) {%>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","the_out")%>:</td>
										<td  style="padding: 2px" > <%=(CurrUnit.getVariable("Therm_Out_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px" ><%=(CurrUnit.getVariable("Pos_Dout_GF_"+areaCount).getRefreshableAssint(dout_new))%></td>
									</tr>
									<tr>
										<td  style="padding: 2px"> <%=lan.getString("pChrono","output_type")%>:</td>
										<td  style="padding: 2px" colspan="2"> <%=(CurrUnit.getVariable("Output_Type_Therm_"+areaCount+"_GF").getRefreshableAssint(gen_func_output_type))%></td>
									</tr>
									
									<tr>
										<td   style="padding: 2px"><%=lan.getString("pChrono","setpoint")%>:</td>
										<td   style="padding: 2px">	<%=CurrUnit.getVariable("Setpoint_Therm_"+areaCount+"_GF").getRefreshableValue() %></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Setpoint_Therm_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Setpoint_Therm_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
												class='lswtype'
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" size="5" />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","dif_on")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("Diff_ON_Therm_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Diff_ON_Therm_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Diff_ON_Therm_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype'/>
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","dif_off")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Diff_OFF_Therm_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Diff_OFF_Therm_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Diff_OFF_Therm_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" />
											
										</td>
									</tr>
								</table>
							</td>
					</tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
					 			<tr>
									<td   style="padding: 2px"> <%=lan.getString("pChrono","alarm_high")%>:</td>
									<td  style="padding: 2px" colspan="2"> 
										<%=(CurrUnit.getVariable("Al_High_Therm_"+areaCount+"_GF").getRefreshableValue())%>
									</td>
								</tr>
								<tr>
									<td   style="padding: 2px"> <%=lan.getString("pChrono","en_alarm")%>:</td>
									<td ><%= enable%><input type="radio" onclick="enableAlarmDelay('<%=CurrUnit.getVariable("Al_High_Setp_Therm_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_High_Delay_Therm_"+areaCount+"_GF").getPostName()%>')" name="<%=CurrUnit.getVariable( "En_Al_High_Therm_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_High_Therm_"+areaCount+"_GF").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Al_High_Therm_"+areaCount+"_GF").getValue() )?"checked value = '' ":" value = '1' " %> /></td>
									<td ><%= disable%><input type="radio" onclick="disableAlarmDelay('<%=CurrUnit.getVariable("Al_High_Setp_Therm_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_High_Delay_Therm_"+areaCount+"_GF").getPostName()%>')" name="<%=CurrUnit.getVariable( "En_Al_High_Therm_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_High_Therm_"+areaCount+"_GF").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Al_High_Therm_"+areaCount+"_GF").getValue() )?"checked value = ''":" value = '0' " %> /></td>
								</tr>
								<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","alarm_high_step")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_High_Setp_Therm_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_High_Setp_Therm_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_High_Setp_Therm_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											   <%="0".equals(  CurrUnit.getVariable("En_Al_High_Therm_"+areaCount+"_GF").getValue() )?"disabled":"" %>/>
											
										</td>
								</tr>
								<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","delay")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_High_Delay_Therm_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_High_Delay_Therm_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_High_Delay_Therm_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5"
											    <%="0".equals(  CurrUnit.getVariable("En_Al_High_Therm_"+areaCount+"_GF").getValue() )?"disabled":"" %> />
											
										</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
					 			<tr>
									<td  style="padding: 2px"> <%=lan.getString("pChrono","alarm_low")%>:</td>
									<td  style="padding: 2px" colspan="2"> 
										<%=(CurrUnit.getVariable("Al_Low_Therm_"+areaCount+"_GF").getRefreshableValue())%>
									</td>
								</tr>
								<tr>
									<td  style="padding: 2px"> <%=lan.getString("pChrono","en_alarm")%>:</td>
									<td ><%= enable%><input type="radio" onclick="enableAlarmDelay('<%=CurrUnit.getVariable("Al_Low_Setp_Therm_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_Low_Delay_Therm_"+areaCount+"_GF").getPostName()%>')" name="<%=CurrUnit.getVariable( "En_Al_Low_Therm_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_Low_Therm_"+areaCount+"_GF").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Al_Low_Therm_"+areaCount+"_GF").getValue() )?"checked value = '' ":" value = '1' " %> /></td>
									<td ><%= disable%><input type="radio" onclick="disableAlarmDelay('<%=CurrUnit.getVariable("Al_Low_Setp_Therm_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_Low_Delay_Therm_"+areaCount+"_GF").getPostName()%>')" name="<%=CurrUnit.getVariable( "En_Al_Low_Therm_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_Low_Therm_"+areaCount+"_GF").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Al_Low_Therm_"+areaCount+"_GF").getValue() )?"checked value ='' ":" value = '0' " %> /></td>
								</tr>
								<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","alarm_low_step")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_Low_Setp_Therm_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_Low_Setp_Therm_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_Low_Setp_Therm_"+areaCount+"_GF").getPostName()%>"  
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											   <%="0".equals(  CurrUnit.getVariable("En_Al_Low_Therm_"+areaCount+"_GF").getValue() )?"disabled":"" %>/>
											
										</td>
								</tr>
								<tr>
										<td  style="padding: 2px"> <%=lan.getString("pChrono","delay")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_Low_Delay_Therm_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_Low_Delay_Therm_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_Low_Delay_Therm_"+areaCount+"_GF").getPostName()%>"  
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											   <%="0".equals(  CurrUnit.getVariable("En_Al_Low_Therm_"+areaCount+"_GF").getValue() )?"disabled":"" %>/>
										</td>
								</tr>
							</table>
						</td>
					</tr>
			<% }else if( "1".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue()) ) {%>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","mod_out")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Modulating_Out_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px" ><%=(CurrUnit.getVariable("Pos_Aout_GF_"+areaCount).getRefreshableAssint(aout))%></td>
									</tr>
									<tr>
										<td  width="50%"  style="padding: 2px"> <%=lan.getString("pChrono","output_type")%>:</td>
										<td  style="padding: 2px" colspan="2"> <%=(CurrUnit.getVariable("Output_Type_Mod_"+areaCount+"_GF").getRefreshableAssint(gen_func_output_type))%></td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","regulation")%>:</td>
										<td  align="center">P<input type="radio" name="<%=CurrUnit.getVariable( "Reg_Type_Mod_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("Reg_Type_Mod_"+areaCount+"_GF").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("Reg_Type_Mod_"+areaCount+"_GF").getValue() )?" checked value='' ":" value='0' " %> /></td>
										<td  align="center">PI<input type="radio"  name="<%=CurrUnit.getVariable( "Reg_Type_Mod_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("Reg_Type_Mod_"+areaCount+"_GF").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("Reg_Type_Mod_"+areaCount+"_GF").getValue() )?" checked value = '' ":" value='1' " %> /></td>
									</tr>
									<tr>
										<td  style="padding: 2px"><%=lan.getString("pChrono","setpoint")%>:</td>
										<td  style="padding: 2px">	<%=CurrUnit.getVariable("Setpoint_Mod_"+areaCount+"_GF").getRefreshableValue() %></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Setpoint_Mod_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Setpoint_Mod_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","band")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("Band_Mod_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Band_Mod_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Band_Mod_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" />
											
										</td>
									</tr>
									<%if("1".equals(  CurrUnit.getVariable("Reg_Type_Mod_"+areaCount+"_GF").getValue() )){ %>
									<tr>
										<td  style="padding: 2px"> <%=lan.getString("pChrono","int_time")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Int_Time_Mod_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Int_Time_Mod_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Int_Time_Mod_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" />
										</td>
									</tr>
									<%} %>
								</table>
							</td>
					</tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
								<tr>
									<td   style="padding: 2px"> <%=lan.getString("pChrono","en_alarm")%>:</td>
									<td ><%= enable%><input type="radio" onclick="enableAlarmDelay('<%=CurrUnit.getVariable("Al_High_Setp_Mod_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_High_Delay_Mod_"+areaCount+"_GF").getPostName()%>')"  name="<%=CurrUnit.getVariable( "En_Al_High_Mod_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_High_Mod_"+areaCount+"_GF").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Al_High_Mod_"+areaCount+"_GF").getValue() )?" checked value = '' ":" value = '1' " %> /></td>
									<td ><%= disable%><input type="radio"  onclick="disableAlarmDelay('<%=CurrUnit.getVariable("Al_High_Setp_Mod_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_High_Delay_Mod_"+areaCount+"_GF").getPostName()%>')"  name="<%=CurrUnit.getVariable( "En_Al_High_Mod_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_High_Mod_"+areaCount+"_GF").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Al_High_Mod_"+areaCount+"_GF").getValue() )?" checked value = ''":" value = '0' " %> /></td>
								</tr>
								<tr>
										<td  width="50%"  style="padding: 2px"> <%=lan.getString("pChrono","alarm_high_step")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_High_Setp_Mod_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_High_Setp_Mod_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_High_Setp_Mod_"+areaCount+"_GF").getPostName()%>"  
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											   <%="0".equals(  CurrUnit.getVariable("En_Al_High_Mod_"+areaCount+"_GF").getValue() )?"disabled":"" %>/>
											
										</td>
								</tr>
								<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","delay")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_High_Delay_Mod_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_High_Delay_Mod_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_High_Delay_Mod_"+areaCount+"_GF").getPostName()%>"  
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											   <%="0".equals(  CurrUnit.getVariable("En_Al_High_Mod_"+areaCount+"_GF").getValue() )?"disabled":"" %>/>
										</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
								<tr>
									<td   style="padding: 2px"> <%=lan.getString("pChrono","en_alarm")%>:</td>
									<td ><%= enable%><input type="radio" onclick="enableAlarmDelay('<%=CurrUnit.getVariable("Al_Low_Setp_Mod_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_Low_Delay_Mod_"+areaCount+"_GF").getPostName()%>')"  name="<%=CurrUnit.getVariable( "En_Al_Low_Mod_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_Low_Mod_"+areaCount+"_GF").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Al_Low_Mod_"+areaCount+"_GF").getValue() )?"checked value = ''":" value='1' " %> /></td>
									<td ><%= disable%><input type="radio"  onclick="disableAlarmDelay('<%=CurrUnit.getVariable("Al_Low_Setp_Mod_"+areaCount+"_GF").getPostName()%>','<%=CurrUnit.getVariable("Al_Low_Delay_Mod_"+areaCount+"_GF").getPostName()%>')"  name="<%=CurrUnit.getVariable( "En_Al_Low_Mod_"+areaCount+"_GF").getPostName()%>" id="<%=CurrUnit.getVariable("En_Al_Low_Mod_"+areaCount+"_GF").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Al_Low_Mod_"+areaCount+"_GF").getValue() )?"checked value = '' ":" value='0' " %> /></td>
								</tr>
								<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","alarm_low_step")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_Low_Setp_Mod_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_Low_Setp_Mod_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_Low_Setp_Mod_"+areaCount+"_GF").getPostName()%>"  
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											   <%="0".equals(  CurrUnit.getVariable("En_Al_Low_Mod_"+areaCount+"_GF").getValue() )?"disabled":"" %>/>
										</td>
								</tr>
								<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","delay")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Al_Low_Delay_Mod_"+areaCount+"_GF").getRefreshableValue())%></td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Al_Low_Delay_Mod_"+areaCount+"_GF").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Al_Low_Delay_Mod_"+areaCount+"_GF").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											   <%="0".equals(  CurrUnit.getVariable("En_Al_Low_Mod_"+areaCount+"_GF").getValue() )?"disabled":"" %>/>
											
										</td>
								</tr>
							</table>
						</td>
					</tr>
			<%}else if( "2".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue()) ) {%>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
								<tr>
									<td   style="padding: 2px"> <%=lan.getString("pChrono","alarm")%>:</td>
									<td  style="padding: 2px" > <%=CurrUnit.getVariable("Gen_Al_"+areaCount).getRefreshableAssint(
										"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
										"<img src='images/led/L2.gif' width='10px' height='10px'>")%>
									</td>
									<td  style="padding: 2px" ><%=(CurrUnit.getVariable("Pos_Dout_Gen_Al_"+areaCount).getRefreshableAssint(dout_new))%></td>
								</tr>
								<tr>
										<td  style="padding: 2px"> <%=lan.getString("pChrono","delay")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("Delay_Time_Gen_Al_"+areaCount).getRefreshableValue())%> <%=(CurrUnit.getVariable("Delay_Time_Gen_Al_"+areaCount).getMUnit())%> </td>
										<td  style="padding: 2px"> 
											<INPUT NAME="<%=CurrUnit.getVariable("Delay_Time_Gen_Al_"+areaCount).getPostName()%>" 
											   id="<%=CurrUnit.getVariable("Delay_Time_Gen_Al_"+areaCount).getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" class='lswtype'  type="text"  size="5" 
											 />
											
										</td>
								</tr>
							</table>
						</td>
					</tr>
						
			
			
			<%} else if( "3".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue()) ) {%>
				<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","output")%>:</td>
										<td  style="padding: 2px" > <%=(CurrUnit.getVariable("Dout_Pulse_"+areaCount).getRefreshableValue())%></td>
										<td  style="padding: 2px" ><%=(CurrUnit.getVariable("Pos_Dout_Pulse_"+areaCount).getRefreshableAssint(dout))%></td>
									</tr>
									
									
									<tr>
										<td   style="padding: 2px"><%=lan.getString("pChrono","time_on")%>:</td>
										<td   style="padding: 2px">	<%=CurrUnit.getVariable("TON_PULSE_"+areaCount).getRefreshableValue() %><%=(CurrUnit.getVariable("TON_PULSE_"+areaCount).getMUnit())%></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("TON_PULSE_"+areaCount).getPostName()%>" 
											   id="<%=CurrUnit.getVariable("TON_PULSE_"+areaCount).getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
												class='lswtype'
											   onblur="sdk_checkMinMaxValue(this,5,9000);checkOnlyAnalogOnBlur(this);" type="text" size="5" />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","time_off")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("TOFF_PULSE_"+areaCount).getRefreshableValue())%><%=(CurrUnit.getVariable("TOFF_PULSE_"+areaCount).getMUnit())%></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("TOFF_PULSE_"+areaCount).getPostName()%>" 
											   id="<%=CurrUnit.getVariable("TOFF_PULSE_"+areaCount).getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,5,9000);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype'/>
											
										</td>
									</tr>
									
								</table>
							</td>
					</tr>
			
			
				 <% for( int scd=1;scd<=3;scd++) {
					 	String week = CurrUnit.getVariable("PULSE_"+areaCount+".TimeBand_"+scd).getValue();
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
				 	<td colspan="3" valign="bottom">
				 		<table class="topLine" width="100%">
							<tr><td  ><%=tb+" "+scd%>:</td>
								<td  align="center">
									<select name="<%=CurrUnit.getVariable("PULSE_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>" id="<%=CurrUnit.getVariable("PULSE_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>">
										<% for (int i=0; i<=20; i++) { 
										%>
											<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("PULSE_"+areaCount+".Sel_0"+scd+"_TB_G1").getValue()))){%>selected<%} %> > 
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
							<td  style="padding: 2px" align="center">
								<select name="<%=CurrUnit.getVariable("PULSE_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>" id="<%=CurrUnit.getVariable("PULSE_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>">
									<% for (int j=0; j<=10; j++) { %>
										<option value='<%=j%>' <% if (j==(Integer.parseInt(CurrUnit.getVariable("PULSE_"+areaCount+".Sel_0"+scd+"_PD_G1").getValue()))){%>selected<%} %> > 
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
									<%=  CurrUnit.getVariable("PULSE_"+areaCount+".TimeBand_"+scd).getHiddenInput()%>
									<table width="100%">
										<tr> 
											<%for(int i=0;i<names.length;i++){ %>
											<td  align="center"><%= names[i]%></td>
											<%} %>
										</tr>
										<tr> 
											<%for(int i=0;i<values.length;i++){ %>
											<td  align="center"><%= CurrUnit.getVariable("PULSE_"+areaCount+".TimeBand_"+scd).getCheckbox(values[i],"getDecimal") %></td>
											<%} %>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<%} // 3 dateBands scheduler for loop
				 } else if( "4".equals(CurrUnit.getVariable("Generic_Fun_Type_"+areaCount).getValue()) ) {%>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr>
										<td   style="padding: 2px;width: 30%"> <%=lan.getString("pChrono","buz_output") %>:</td>
										<td  style="padding: 2px;width: 30%" > <%=(CurrUnit.getVariable("Dout_WC_Alarm_"+areaCount).getRefreshableValue())%></td>
										<td  style="padding: 2px;width: 30%" ><%=(CurrUnit.getVariable("Pos_WC_Alarm_"+areaCount).getRefreshableAssint(dout))%></td>
									</tr>
									<tr>
										<td   style="padding: 2px;width: 30%"> <%=lan.getString("pChrono","pull_cord_switch")%>:</td>
										<td  style="padding: 2px;width: 30%" > <%=(CurrUnit.getVariable("In1_WC_Alarm_"+areaCount).getRefreshableValue())%></td>
										<td  style="padding: 2px;width: 30%" ><%=(CurrUnit.getVariable("Pos_In1_WC_Alarm_"+areaCount).getRefreshableAssint(din))%></td>
									</tr>
									<tr>
										<td   style="padding: 2px;width: 30%"> <%=lan.getString("pChrono","pull_cord_reset")%>:</td>
										<td  style="padding: 2px;width: 30%" > <%=(CurrUnit.getVariable("In2_WC_Alarm_"+areaCount).getRefreshableValue())%></td>
										<td  style="padding: 2px;width: 30%" ><%=(CurrUnit.getVariable("Pos_In2_WC_Alarm_"+areaCount).getRefreshableAssint(din))%></td>
									</tr>
								</table>
							</td>
					</tr>
				<%} %>
			
				</table>
			</td>
			<%if(areaCount%4==0){%>
			</tr>
			<tr>
			<%}%>
		 <%}else{ %>
			 	<td  width="25%">
			 	</td>
		 <%} %>
	<% } // area for loop%>
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