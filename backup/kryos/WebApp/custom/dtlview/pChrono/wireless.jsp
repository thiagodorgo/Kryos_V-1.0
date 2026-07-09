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
	String temp = lan.getString("pChrono","temp");
    String humid = lan.getString("pChrono","humid");
    String light = lan.getString("pChrono","light");
%>

<!-- wireless socket  -->
<form id="formSettableVars" name="formSettableVars" action="#">
<div id="HideMe7" >
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
		for(int areaCount=1;areaCount<=3;areaCount++) {
			 if (!CurrUnit.getVariable("SA_"+areaCount+"_Present").getValue().equals("0") && !CurrUnit.getVariable("SA_"+areaCount+"_Present").getValue().equals("***")){
				tds++;
		%>
			<td  width="25%" valign="top">
				<table width="100%" class="infotable" cellspacing="0" cellpadding="0"  >
					<%
					String areaName="";
					String myJSArray ="saJsArray";
					String idsArray = "  var "+(myJSArray+areaCount)+" =new Array(); ";
					
					for(int i=1;i<=8;i++){ 
						String strInt = CurrUnit.getVariable("Letter_"+i+"_SA_Add_"+(areaCount+15)).getValue();
						try{
						   Integer idx = Integer.parseInt(strInt);
						   areaName += nameStrArray[idx];
						   int id = CurrUnit.getVariable("Letter_"+i+"_SA_Add_"+(areaCount+15)).getId();
						   idsArray  += myJSArray + areaCount+"[ "+(i-1)+"] = 'dtlst_"+id+"';  ";
						}
						catch(Exception e){
							
						}
					%>
					
						<%= CurrUnit.getVariable("Letter_"+i+"_SA_Add_"+(areaCount+15)).getHiddenInput()%>
					<%
					}
					%>
					<script>
					<%= idsArray%>
					</script>
					<tr><th align="center" colspan="2" class="th"><div style="float:left">#<%=areaCount %></div>
						<INPUT onblur="tabNameInSub(this,<%= myJSArray+areaCount %>);" type="text" size="10"
							   class='lswtype' value = "<%= areaName %>" maxLength="8" />
					 </th></tr>
					<tr><td   style="padding: 4px" width="30%"><%=lan.getString("pChrono","addr")%>:</td><td  align="left"  ><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".SA_Address_Msk").getRefreshableValue())%></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= temp%></td><td  align="left" ><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Temperature_Value").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Temperature_Value").getMUnit()%></b></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= humid%></td><td  align="left" ><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Humid_Value").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Humid_Value").getMUnit()%></b></td></tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									<tr>
										<td   style="padding: 2px"><%=lan.getString("pChrono","cycle_time")%>:</td>
										<td   style="padding: 2px">	<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Transmit_Cy").getRefreshableValue() %>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Transmit_Cy").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Transmit_Cy").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Transmit_Cy").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
												class='lswtype' onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" size="5" />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","high_thr")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Temp_T").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Temp_T").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Temp_T").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Temp_T").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype' />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","low_thr")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Temp_Th").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Temp_Th").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Temp_Th").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Temp_Th").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text"  size="5" />
											
										</td>
									</tr>
								</table>
							</td>
					</tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","high_thr")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Humid_").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Humid_").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Humid_").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".High_Humid_").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype' />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","low_thr")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Humid_T").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Humid_T").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Humid_T").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SA_SENSOR_"+areaCount+".Low_Humid_T").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text"  size="5" />
											
										</td>
									</tr>
								</table>
							</td>
					</tr>
					 
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
		for(int areaCount=1;areaCount<=5;areaCount++) {
			if (!CurrUnit.getVariable("SI_"+areaCount+"_Present").getValue().equals("0")  && !CurrUnit.getVariable("SI_"+areaCount+"_Present").getValue().equals("***")){
				tds++;
		%>
			<td  width="25%" valign="top">
				<table width="100%" class="infotable" cellspacing="0" cellpadding="0"  >
					<%
					String areaName="";
					String myJSArray ="siJsArray";
					String idsArray = "  var "+myJSArray+areaCount+" =new Array(); ";
					
					for(int i=1;i<=8;i++){ 
						/*areaName += nameStrArray[Integer.parseInt(CurrUnit.getVariable("Letter_"+i+"_SI_Add_"+(areaCount+20)).getValue())];*/
						/*int id = CurrUnit.getVariable("Letter_"+i+"_SI_Add_"+(areaCount+20)).getId();
						idsArray  += myJSArray+areaCount+"[ "+(i-1)+"] = 'dtlst_"+id+"'; ";*/
						
						String strInt = CurrUnit.getVariable("Letter_"+i+"_SI_Add_"+(areaCount+20)).getValue();
						try{
						   Integer idx = Integer.parseInt(strInt);
						   areaName += nameStrArray[idx];
						   
						   int id = CurrUnit.getVariable("Letter_"+i+"_SI_Add_"+(areaCount+20)).getId();
						   idsArray  += myJSArray+areaCount+"[ "+(i-1)+"] = 'dtlst_"+id+"'; ";
						}
						catch(Exception e){
							
						}
					%>
					
						<%= CurrUnit.getVariable("Letter_"+i+"_SI_Add_"+(areaCount+20)).getHiddenInput()%>
					<%
					}
					%>
					<script>
					<%= idsArray%>
					</script>
					<tr><th align="center" colspan="2" class="th"><div style="float:left">#<%=areaCount %></div>
						<INPUT onblur="tabNameInSub(this,<%=myJSArray+areaCount %>);" type="text" size="10"
							   class='lswtype' value = "<%= areaName %>" maxLength="8" />
					 </th></tr>
					<tr><td   style="padding: 4px" width="30%"><%=lan.getString("pChrono","addr")%>:</td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".SI_Address_Msk").getRefreshableValue())%></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= temp%></td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Temp_Value").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Temp_Value").getMUnit()%></b></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= humid%></td><td  align="left"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Humid_Value").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Humid_Value").getMUnit()%></b></td></tr>
					<tr><td  style="padding: 4px" width="30%"><%= light%></td><td   align="left"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Light_Value").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Light_Value").getMUnit()%></b></td></tr>
					
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","cycle_time")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Transmit_Cy").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Transmit_Cy").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Transmit_Cy").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Transmit_Cy").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype' />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","high_thr")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Temp_T").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Temp_T").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Temp_T").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Temp_T").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype' />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","low_thr")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Temp_Th").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Temp_Th").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Temp_Th").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Temp_Th").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text"  size="5" />
											
										</td>
									</tr>
								</table>
							</td>
					</tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","high_thr")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Humid_").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Humid_").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Humid_").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Humid_").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype' />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","low_thr")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Humid_T").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Humid_T").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Humid_T").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Humid_T").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,-999.9,999.9);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text"  size="5" />
											
										</td>
									</tr>
								</table>
							</td>
					</tr>
					<tr>
					 	<td colspan="3" valign="bottom">
					 		<table class="topLine" width="100%">
									
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","high_thr")%>:</td>
										<td  style="padding: 2px"><%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Light_").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Light_").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Light_").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".High_Light_").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,10000);checkOnlyAnalogOnBlur(this);" type="text" 
											   size="5" class='lswtype' />
											
										</td>
									</tr>
									<tr>
										<td   style="padding: 2px"> <%=lan.getString("pChrono","low_thr")%>:</td>
										<td  style="padding: 2px"> <%=(CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Light_T").getRefreshableValue())%>&nbsp;&nbsp;<b><%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Light_T").getMUnit()%></b></td>
										<td  style="padding: 2px" align="center"> 
											<INPUT NAME="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Light_T").getPostName()%>" 
											   id="<%=CurrUnit.getVariable("MOD_MB_SI_SENSOR_"+areaCount+".Low_Light_T").getPostName()%>" 
											   onkeydown="checkOnlyAnalog(this,event);" 
											   onblur="sdk_checkMinMaxValue(this,0,10000);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text"  size="5" />
											
										</td>
									</tr>
								</table>
							</td>
					</tr>
					
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