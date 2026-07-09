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
<!-- Exception -->
<div id="HideMe1" >
	<!-- Section 1: Special periods -->
	<table  width="98%" height="100%" align="center" cellspacing="0" cellpadding="0" >
	<%if( ! "***".equalsIgnoreCase(devExist)){%> 
		<tr height="100%">
		
		<td width="45%" valign="top">
			<Fieldset class="field">
				<legend ><%=addexcep%></legend>
				<br/>
				<table width="100%" valign="top" border="0" cellpadding="0" cellspacing="0">
				<td width="70%">
							<table width="100%" valign="top" border="0" cellpadding="0" cellspacing="0" width="100px"> 
							<tr>
								<td width="25%" ><%=from%></td>
								<input type="hidden" name="tester" id="tester" value=""/>
								<td width="65%" align="center">
									<input type="text" class='lswtype' name="tester_day" id="tester_day" value="" size="3" maxLength="2" onblur="onlyNumberOnBlur(this);" onkeydown='checkOnlyNumber(this,event);'/>
									<select  name="tester_month" id="tester_month">
									<%for(int i=1;i<=12;i++){
										%>
										<option value="<%=i%>"><%=months[i]%></option>
									<%} %>
									</select>
									<input class='lswtype' type="text" name="tester_year" id="tester_year" value="" size="3" maxLength="4" onblur="onlyNumberOnBlur(this);" onkeydown='checkOnlyNumber(this,event);'/>
								</td>
								<td width="10%">
									<input type="button" value="..." id="see1" onclick="see1.style.display='none';see1.style.visibility='hidden';Hide1.style.display='block';Hide1.style.visibility='visible';cal_tester_display.style.display='block';cal_tester_display.style.visibility='visible';Hide2.style.display='none';Hide2.style.visibility='hidden';see2.style.display='block';see2.style.visibility='visible';cal_tester2_display.style.display='none';cal_tester2_display.style.visibility='hidden'"/>
									<input type="button" value="..." id="Hide1" style="display:none;visibility:hidden" onclick="Hide1.style.display='none';Hide1.style.visibility='hidden';see1.style.display='block';see1.style.visibility='visible';cal_tester_display.style.display='none';cal_tester_display.style.visibility='hidden'"/>
								</td>
							</tr>
							<tr>
								<td width="25%" >&nbsp;</td>
								<td width="75%" align="center">
									<div id="cal_tester_display" style="display:none;visibility:hidden"></div>
									<script type="text/javascript">
										var arDay = new Array("<%=sun%>","<%=mon%>","<%=tue%>","<%=wed%>","<%=thu%>","<%=fri%>","<%=sat%>");
										var arMonth = new Array("<%=months[1]%>","<%=months[2]%>","<%=months[3]%>","<%=months[4]%>","<%=months[5]%>","<%=months[6]%>","<%=months[7]%>","<%=months[8]%>","<%=months[9]%>","<%=months[10]%>","<%=months[11]%>","<%=months[12]%>");
										cal1 = new Calendar ("cal1", "tester", new Date(), arDay, arMonth);
										renderCalendar(cal1);
									</script>
								</td>
							</tr>
							<tr>
								<td width="25%" ><%=to%></td>
								<input type="hidden" name="tester2" id="tester2" value=""/>
								<td width="65%" align="center">
									<input class='lswtype' type="text" name="tester2_day" id="tester2_day" value="" size="3" maxLength="2" onblur="onlyNumberOnBlur(this);" onkeydown='checkOnlyNumber(this,event);'/>
									<select  name="tester2_month" id="tester2_month">
										<%for(int i=1;i<=12;i++){
										%>
										<option value="<%=i%>"><%=months[i]%></option>
									<%} %>
									</select>
									<input class='lswtype' type="text" name="tester2_year" id="tester2_year" value="" size="3" maxLength="4" onblur="onlyNumberOnBlur(this);" onkeydown='checkOnlyNumber(this,event);'/>
								</td>
								<td width="10%">	
									<input type="button" value="..." id="see2" onclick="Hide1.style.display='none';Hide1.style.visibility='hidden';see1.style.display='block';see1.style.visibility='visible';cal_tester_display.style.display='none';cal_tester_display.style.visibility='hidden';see2.style.display='none';see2.style.visibility='hidden';Hide2.style.display='block';Hide2.style.visibility='visible';cal_tester2_display.style.display='block';cal_tester2_display.style.visibility='visible'"/>
									<input type="button" value="..." id="Hide2" style="display:none;visibility:hidden" onclick="Hide2.style.display='none';Hide2.style.visibility='hidden';see2.style.display='block';see2.style.visibility='visible';cal_tester2_display.style.display='none';cal_tester2_display.style.visibility='hidden'"/>
								</td>
							</tr>
							<tr>
								<td width="25%" >&nbsp;</td>
								<td width="75%" align="center">
									<div id="cal_tester2_display" style="display:none;visibility:hidden"></div>
									<script type="text/javascript">
									var arDay = new Array("<%=sun%>","<%=mon%>","<%=tue%>","<%=wed%>","<%=thu%>","<%=fri%>","<%=sat%>");
									var arMonth = new Array("<%=months[1]%>","<%=months[2]%>","<%=months[3]%>","<%=months[4]%>","<%=months[5]%>","<%=months[6]%>","<%=months[7]%>","<%=months[8]%>","<%=months[9]%>","<%=months[10]%>","<%=months[11]%>","<%=months[12]%>");
										cal2 = new Calendar ("cal2", "tester2", new Date(), arDay, arMonth);
										renderCalendar(cal2);
									</script>
								</td>
							</tr>
							
							</table>
				</td>
				<% 
				if (((!CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getValue().equals("***"))) && (
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_2").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_3").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_4").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_5").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_6").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_7").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_8").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_9").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_10").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_11").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_12").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_13").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_14").getValue().equals("0")) ||
				(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_15").getValue().equals("0")))		
				) {
				
				%>
				<td align="center" width="30%">
					<img style="width: 25px; height: 25px; cursor:pointer;" src="images/actions/add_on_black.png" onclick='AddException();'/>
				</td>
				<% } else {%>
				<td align="center"  width="30%"><%=maxexcepreach%>!</td>
				<%}%>
				</table>
			</Fieldset>
		</td>
		
		<td width="3%">&nbsp;</td>
		
		<td width="45%" valign="top">
			<Fieldset class="field">
				<legend ><%=listexcep%></legend>
				<br/>
				<table width="100%" valign="top">
					
					<% if (
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getValue().equals("***")) || (
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_2").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_3").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_4").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_5").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_6").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_7").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_8").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_9").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_10").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_11").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_12").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_13").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_14").getValue().equals("0")) &&
					(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_15").getValue().equals("0")))
					) {%>
					<tr>
						<th class="th" align="center" width="100%"><%=noexcep%></th>
					</tr>
					<% } else {%>
						<tr>
							<th class="th" align="center" width="50%"><%=periodsel%></th>
							<th class="th" align="center" width="50%"><%=remove%></th>
						</tr>
						<!-- Special periods -->
						<%for(int i=1;i<=15;i++){ %>
						
							<% if (((!CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_"+i).getValue().equals("***"))) && (!CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_"+i).getValue().equals("0"))) {%>
							<tr class="<%=i%2==0?"Row2":"Row1" %>" height="30px">
								<td width="20%" align="left">
									<%=from%> <%=(((Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_"+i).getValue().replace(",","")))/100))%>
									/<%=((Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_"+i).getValue().replace(",","")))-(((Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_"+i).getValue().replace(",","")))/100)*100))%>
									<%=to%> <%=(((Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_"+i).getValue().replace(",","")))/100))%>
									/<%=((Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_"+i).getValue().replace(",","")))-(((Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_"+i).getValue().replace(",","")))/100)*100))%>
								</td>
								<td width="20%" align="center">
								<img style="width: 25px; height: 25px; cursor:pointer;" src="images/actions/clean_on_black.png" onclick="del('<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_"+i).getPostName()%>','<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_"+i).getPostName()%>')"/> 
								</td>
							</tr>
							<% } %>	
						<%} %>
					<%}%>
				</table>
			</Fieldset>
		</td>
		
		</tr>
		<%} else{// if devExist %>	
			<tr height="10%"><td  class="th" align="Center"><%=noconnect %>  </td></tr>	
			<tr height="90%"><td ></td></tr>
		<%}%>
	</table>
	</div>
	
<form id="formCal" name="formCal" action="#" >
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_2").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_2").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_2").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_3").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_3").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_3").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_4").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_4").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_4").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_5").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_5").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_5").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_6").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_6").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_6").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_7").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_7").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_7").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_8").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_8").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_8").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_9").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_9").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_9").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_10").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_10").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_10").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_11").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_11").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_11").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_12").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_12").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_12").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_13").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_13").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_13").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_14").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_14").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_14").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_15").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_15").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_15").getValue().replace(",","")%>"/>	
	<input type="hidden" id="CalStartList" 
	value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_2").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_3").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_4").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_5").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_6").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_7").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_8").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_9").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_10").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_11").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_12").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_13").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_14").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_15").getPostName()%>"/>
		
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_1").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_1").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_1").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_2").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_2").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_2").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_3").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_3").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_3").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_4").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_4").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_4").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_5").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_5").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_5").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_6").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_6").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_6").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_7").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_7").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_7").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_8").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_8").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_8").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_9").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_9").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_9").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_10").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_10").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_10").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_11").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_11").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_11").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_12").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_12").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_12").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_13").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_13").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_13").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_14").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_14").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_14").getValue().replace(",","")%>"/>
	<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_15").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_15").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_15").getValue().replace(",","")%>"/>
	<input type="hidden" id="CalEndList" 
	value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_1").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_2").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_3").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_4").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_5").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_6").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_7").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_8").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_9").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_10").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_11").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_12").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_13").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_14").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_15").getPostName()%>"/>	
</form> 