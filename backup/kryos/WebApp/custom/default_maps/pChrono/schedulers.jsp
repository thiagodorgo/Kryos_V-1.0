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
	String year_adjust = lan.getString("pChrono","year_adjust");
%>
<input type="hidden" id ='year_adjust' value='<%= year_adjust%>' >
<form id="formSettableVars" name="formSettableVars" action="#">
<!-- scheduler -->
<div id="HideMe0" >
<table  width="100%" height="100%" align="center" cellspacing="0" cellpadding="0" >
<% if( ! "***".equalsIgnoreCase(devExist)){ 
		String year = CurrUnit.getVariable("BMS_Year").getValue();
		year = Integer.parseInt(year)<10?"0"+year:year;
%>  
<tr><td width="100%" height="100%" valign="top"> 
	<div style="text-align: right;width:95%">
	<div><B><%=lan.getString("action","state")%>:<%=CurrUnit.getVariable("Superv_OnOff").getRefreshableAssint(lan.getString("button","stop")+";"+lan.getString("button","start")) %> &nbsp;&nbsp;
	<INPUT NAME="<%=CurrUnit.getVariable("Superv_OnOff").getPostName()%>" 
		   id="<%=CurrUnit.getVariable("Superv_OnOff").getPostName()%>"  
		   onkeydown="checkOnlyAnalog(this,event);" 
		   onblur="sdk_checkMinMaxValue(this,0,1);checkOnlyAnalogOnBlur(this);" type="text" size="2"
		   class='lswtype'
		 /></B></div><br>
	<B><%=CurrUnit.getVariable("BMS_Hour").getRefreshableFormattedValue("00")%>:<%=CurrUnit.getVariable("BMS_Minute").getRefreshableFormattedValue("00")%> &nbsp;&nbsp;
	 <%=CurrUnit.getVariable("BMS_Day").getRefreshableValue()%>/ <%=months[(Integer.parseInt(CurrUnit.getVariable("BMS_Month").getValue()))]%> / 20<%=year%>
	</B>
	&nbsp;&nbsp;
	<INPUT NAME="<%=CurrUnit.getVariable("BMS_Hour").getPostName()%>" 
	   id="<%=CurrUnit.getVariable("BMS_Hour").getPostName()%>"  
	   onkeydown="checkOnlyAnalog(this,event);" 
	   onblur="sdk_checkMinMaxValue(this,0,24);checkOnlyAnalogOnBlur(this);" type="text" size="2"
	   class='lswtype'
	 />:
	 <INPUT NAME="<%=CurrUnit.getVariable("BMS_Minute").getPostName()%>" 
	   id="<%=CurrUnit.getVariable("BMS_Minute").getPostName()%>"  
	   onkeydown="checkOnlyAnalog(this,event);" 
	   onblur="sdk_checkMinMaxValue(this,0,60);checkOnlyAnalogOnBlur(this);" type="text" size="2"
	   class='lswtype'
	 />
	 &nbsp;&nbsp;
	 <INPUT NAME="<%=CurrUnit.getVariable("BMS_Day").getPostName()%>" 
	   id="<%=CurrUnit.getVariable("BMS_Day").getPostName()%>" 
	   onkeydown="checkOnlyAnalog(this,event);" 
	   onblur="sdk_checkMinMaxValue(this,0,31);checkOnlyAnalogOnBlur(this);" type="text" size="2"
	   class='lswtype'
	 />
		/ 
	 <INPUT NAME="<%=CurrUnit.getVariable("BMS_Month").getPostName()%>" 
	   id="<%=CurrUnit.getVariable("BMS_Month").getPostName()%>" 
	   onkeydown="checkOnlyAnalog(this,event);" 
	   onblur="sdk_checkMinMaxValue(this,0,12);checkOnlyAnalogOnBlur(this);" type="text" size="2"
	   class='lswtype'
	 /> 
	 	/ 
	 <INPUT NAME="<%=CurrUnit.getVariable("BMS_Year").getPostName()%>" 
	   id="<%=CurrUnit.getVariable("BMS_Year").getPostName()%>" 
	   onkeydown="checkOnlyAnalog(this,event);" 
	   onblur="checkOnlyAnalogOnBlur(this);rewriteYear(this);" type="text" size="2"
	   class='lswtype'
	 /> 
	 
	
	</div>
	<fieldset style="width:95%;" class="field">
		<legend ><%= tb%></legend>
		<%
		 	HashMap<String ,Integer> timebindMap = new HashMap<String ,Integer>();
			HashMap<String ,Integer> periodMap = new HashMap<String ,Integer>();
			for(int i=0;i<=20;i++){
				timebindMap.put("timebind"+i,0);
				periodMap.put("period"+i,0);
			}
			for(int i=1;i<=20;i++){
				for(int j=1;j<=3;j++){
				    int value;
				    if(CurrUnit.getVariable("SCHED_SET_"+i+".Sel_0"+j+"_TB_G1").getValue()!="***"){
					    value = Integer.parseInt(CurrUnit.getVariable("SCHED_SET_"+i+".Sel_0"+j+"_TB_G1").getValue());
						timebindMap.put("timebind"+value,(timebindMap.get("timebind"+value)+1));
				    }
				    if(CurrUnit.getVariable("SCHED_SET_GL_"+i+".Sel_0"+j+"_TB_G1").getValue()!="***"){
						value = Integer.parseInt(CurrUnit.getVariable("SCHED_SET_GL_"+i+".Sel_0"+j+"_TB_G1").getValue());
						timebindMap.put("timebind"+value,(timebindMap.get("timebind"+value)+1));
				    }
				    //PULSE_1.Sel_01_TB_G1
				    if(CurrUnit.getVariable("PULSE_"+i+".Sel_0"+j+"_TB_G1").getValue()!="***"){
						value = Integer.parseInt(CurrUnit.getVariable("PULSE_"+i+".Sel_0"+j+"_TB_G1").getValue());
						timebindMap.put("timebind"+value,(timebindMap.get("timebind"+value)+1));
				    }
				    if(i<=10){
					    if(CurrUnit.getVariable("SCHED_SET_SOCKET_"+i+".Sel_0"+j+"_TB_G1").getValue()!="***"){
							value = Integer.parseInt(CurrUnit.getVariable("SCHED_SET_SOCKET_"+i+".Sel_0"+j+"_TB_G1").getValue());
							timebindMap.put("timebind"+value,(timebindMap.get("timebind"+value)+1));
					    }
				    }
					// period
					if(CurrUnit.getVariable("SCHED_SET_"+i+".Sel_0"+j+"_PD_G1").getValue()!="***"){
						value = Integer.parseInt(CurrUnit.getVariable("SCHED_SET_"+i+".Sel_0"+j+"_PD_G1").getValue());
						periodMap.put("period"+value,(periodMap.get("period"+value)+1));
					}
					if(CurrUnit.getVariable("SCHED_SET_GL_"+i+".Sel_0"+j+"_PD_G1").getValue()!="***"){
						value = Integer.parseInt(CurrUnit.getVariable("SCHED_SET_GL_"+i+".Sel_0"+j+"_PD_G1").getValue());
						periodMap.put("period"+value,(periodMap.get("period"+value)+1));
					}
					//PULSE_1.Sel_01_PD_G1
					if(CurrUnit.getVariable("PULSE_"+i+".Sel_0"+j+"_PD_G1").getValue()!="***"){
						value = Integer.parseInt(CurrUnit.getVariable("PULSE_"+i+".Sel_0"+j+"_PD_G1").getValue());
						periodMap.put("period"+value,(periodMap.get("period"+value)+1));
					}
					if(i<=10){
						if(CurrUnit.getVariable("SCHED_SET_SOCKET_"+i+".Sel_0"+j+"_PD_G1").getValue()!="***"){
							value = Integer.parseInt(CurrUnit.getVariable("SCHED_SET_SOCKET_"+i+".Sel_0"+j+"_PD_G1").getValue());
							periodMap.put("period"+value,(periodMap.get("period"+value)+1));
						}
					}
				}
			}
		%>
		<table width="100%" align="center" cellspacing="0"  >
			<tr>
				<th class="th"  class="th" width="15%" align="center"><%= tbuse%></th>
				<th class="th"  width="15%" align="center"><%= start%></th>
				<th class="th"  width="1%"></th>
				<th class="th"  width="15%" align="center"><%= stop%></th>
				<th class="th"  width="4px"></th>
				<th class="th"  width="15%" align="center"><%= tbuse%></th>
				<th class="th"  width="15%" align="center"><%= start%></th>
				<th class="th"  width="1%"></th>
				<th class="th"  width="15%" align="center"><%= stop%></th>
			</tr>
			<% for(int count=1; count<=20 ; count++){ 
				int odd = (count+1)/2;
				String sh = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+count).getValue();
				String sm = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+count).getValue();
				String eh = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+count).getValue();
				String em = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+count).getValue();
				if( !("***").equalsIgnoreCase(sh) && !("***").equalsIgnoreCase(sm) && !("***").equalsIgnoreCase(eh) && !("***").equalsIgnoreCase(em)){
			%>
				<tr class="<%= ((count/2%2==0)?"Row1":"Row2") %>">
					<td align="center"><%= tb%> &nbsp; <%=odd %>  (<%= timebindMap.get("timebind"+odd)%>) </td>
					<td align="center">
						<div>
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+odd).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+odd).getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+odd).getValue()))) {%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i %></option>
								<% } %>				
							</select> : 
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+odd).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+odd).getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+odd).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
							</select>
						</div>
					</td>
					<td align="center">--</td>	
					<td align="center">
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+odd).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+odd).getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+odd).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
								</select> : 
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+odd).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+odd).getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+odd).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
							</select>
					</td>
					<td>
						<% 
						count++; 
						int even = (count/2)+10;
						%>
					</td>
					<td align="center"><%= tb%> &nbsp; <%=even %> (<%= timebindMap.get("timebind"+even)%>) </td>
					<td align="center">
						<div>
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+even).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+even).getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Hour_TB"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
								</select> : 
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+even).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+even).getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Min_TB"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
							</select>
						</div>
					</td>
					<td align="center">--</td>	
					<td align="center">
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+even).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+even).getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Hour_TB"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
								</select> : 
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+even).getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+even).getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.End_Min_TB"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
							</select>
					</td>
				</tr>
				<%} // if %> 
			<%} // for %>
		</table>
	</fieldset>
	<fieldset class="field" style="width:95%">
	<legend><%=period %> </legend>
		<table width="100%" align="center" cellspacing="0">
			<tr>
				<th class="th"  class="th" width="10%" align="center"><%= pduse%></th>
				<th class="th"  width="18%" align="center"><%= start%></th>
				<th class="th"  width="1%"></th>
				<th class="th"  width="18%" align="center"><%= stop%></th>
				<th class="th"  width="2px"></th>
				<th class="th"  width="10%" align="center"><%= pduse%></th>
				<th class="th"  width="18%" align="center"><%= start%></th>
				<th class="th"  width="1%"></th>
				<th class="th"  width="18%" align="center"><%= stop%></th>
			</tr>
			<% for(int count=1; count<=10 ; count++){ 
				int odd = (count+1)/2;
				String sday = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+count).getValue();
				String smon = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+count).getValue();
				String eday = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+count).getValue();
				String emon = CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+count).getValue();
				if( !("***").equalsIgnoreCase(sday) && !("***").equalsIgnoreCase(smon) && !("***").equalsIgnoreCase(eday) && !("***").equalsIgnoreCase(emon)){
			%>
				<tr class="<%= ((count/2%2==0)?"Row1":"Row2") %>">
					<td align="center"><%=period %> &nbsp; <%=odd %> (<%= periodMap.get("period"+odd)%>)</td>
					<td align="center">
						<div>
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+odd).getPostName()%>" onblur="checkDate(this,'Day',<%= Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+odd).getValue())%>)" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+odd).getPostName()%>">
								<% for (int i=1; i<=31; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+odd).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
								</select> / 
								<select  name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+odd).getPostName()%>"  onblur="checkDate(this,'Month',<%= Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+odd).getValue())%>)" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+odd).getPostName()%>">
								<% for (int i=1; i<=12; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+odd).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=months[i]%> </option>
								<% } %>				
							</select>
						</div>
					</td>
					<td align="center">--</td>	
					<td align="center">
							<select  name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+odd).getPostName()%>" onblur="checkDate(this,'Day',<%=Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+odd).getValue()) %>)" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+odd).getPostName()%>">
								<% for (int i=1; i<=31; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+odd).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
								</select> / 
								<select  name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+odd).getPostName()%>" onblur="checkDate(this,'Month',<%=Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+odd).getValue()) %>)" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+odd).getPostName()%>">
								<% for (int i=1; i<=12; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+odd).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=months[i]%> </option>
								<% } %>				
							</select>
					</td>
					<td>
						<% 
						count++; 
						int even = count/2+5;
						%>
					</td>
					<td align="center"><%=period %> &nbsp; <%=even %> (<%= periodMap.get("period"+(even))%>)</td>
					<td align="center">
						<div>
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+even).getPostName()%>" onblur="checkDate(this,'Day',<%=Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+even).getValue()) %>)" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+even).getPostName()%>">
								<% for (int i=1; i<=31; i++) {%>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
								<% } %>				
								</select> / 
								<select  name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+even).getPostName()%>" onblur="checkDate(this,'Month',<%=Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Day_PD"+even).getValue()) %>)"  id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+even).getPostName()%>">
								<% for (int i=1; i<=12; i++) { %>
									<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Start_Month_PD"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=months[i]%> </option>
								<% } %>				
							</select>
						</div>
					</td>
					<td align="center">--</td>	
					<td align="center">
							<select name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+even).getPostName()%>" onblur="checkDate(this,'Day',<%= Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+even).getValue())%>)" id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+even).getPostName()%>">
							<% for (int i=0; i<=31; i++) { %>
								<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=(i<10?"0":"")+i  %> </option>
							<% } %>				
							</select> / 
							<select  name="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+even).getPostName()%>" onblur="checkDate(this,'Month',<%=Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Day_PD"+even).getValue())%>)"  id="<%=CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+even).getPostName()%>">
							<% for (int i=1; i<=12; i++) { %>
								<option <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULAR_MNG_1.Stop_Month_PD"+even).getValue()))){%>selected value='' <%} else {%> value='<%=i%>' <%} %> > <%=months[i]%> </option>
							<% } %>				
							</select>
					</td>
				</tr>
				<%} //if%>
			<%} //for%>
		</table>
	</fieldset>
</td></tr>
<%} else{// if devExist %>	
	<tr height="10%"><td  class="th" align="Center"><%=noconnect %>  </td></tr>	
	<tr height="90%"><td ></td></tr>
<%}%>
</table>
</div>
</form>