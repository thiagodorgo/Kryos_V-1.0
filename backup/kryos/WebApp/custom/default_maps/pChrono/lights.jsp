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
	String din = lan.getString("pChrono","din_new");
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
<form id="formSettableVars" name="formSettableVars" action="#">
<!-- lights -->
<div id="HideMe2" >
<table  width="100%" height="100%" align="center" cellspacing="0" cellpadding="0" >
<%if( ! "***".equalsIgnoreCase(devExist)){%>  
<tr><td width="100%" height="100%" >
<table  width="100%" height="100%" align="center" cellspacing="5" cellpadding="5" >
	<%
	  String areaNumbStr = CurrUnit.getVariable("Num_Lights_Group").getValue();
	  int areaNumb =0 ;
	  if(!"***".equals(areaNumbStr)){
		  areaNumb = Integer.parseInt(areaNumbStr);
	  }
	%>
	<tr >
	<%for(int areaCount=1;areaCount<=20;areaCount++) {%>
		<%if(areaCount<=areaNumb){ %>
		<td  width="25%" valign="top">
			<table width="100%" class="infotable" cellspacing="0" cellpadding="0"  >
				<%
				String areaName="";
				String idsArray = "  var ids"+areaCount+" =new Array(); ";
				
				for(int i=1;i<=8;i++){ 
					areaName += nameStrArray[Integer.parseInt(CurrUnit.getVariable("Letter_"+i+"_G"+areaCount).getValue())];
					int id = CurrUnit.getVariable("Letter_"+i+"_G"+areaCount).getId();
					idsArray  += " ids"+areaCount+"[ "+(i-1)+"] = 'dtlst_"+id+"'; ";
				%>
				
					<%= CurrUnit.getVariable("Letter_"+i+"_G"+areaCount).getHiddenInput()%>
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
				<tr class="infotableWithSplitLine" >
					<td    style="padding: 2px" width="30%"><%=lan.getString("pChrono","mgn_type_desc")%>:</td>
					<td  style="padding: 2px"  align="left" colspan="2"><%=light_mng_type.split(";")[Integer.parseInt(CurrUnit.getVariable("Mng_Type_G"+areaCount).getValue())] %></td>
				</tr>
				
				<tr>
						<td   style="padding: 2px" width="30%"><%=lan.getString("pChrono","excep")%></td>
						<td ><%= enable%><input type="radio"  name="<%=CurrUnit.getVariable( "En_Ex_Area_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("En_Ex_Area_"+areaCount).getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Ex_Area_"+areaCount).getValue() )?" checked value='' ":" value='1' " %> /></td>
						<td ><%= disable%><input type="radio" name="<%=CurrUnit.getVariable( "En_Ex_Area_"+areaCount).getPostName()%>" id="<%=CurrUnit.getVariable("En_Ex_Area_"+areaCount).getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Ex_Area_"+areaCount).getValue() )?" checked value='' ":" value='0' " %> /></td>
				</tr>
				
				<% 
					int num = Integer.parseInt( CurrUnit.getVariable("Num_Lines_G"+areaCount).getValue());
					String type = CurrUnit.getVariable("Mng_Type_G"+areaCount).getValue();
				%>
				<% 
					if(type.equals("7") || type.equals("8") || type.equals("12") || type.equals("15")){
				%>
				<tr>
				 	<td colspan="3" >
				 		<table class="topLine" width="100%">
						    <tr>
								<td   style="padding: 2px" width="30%"><%=lan.getString("pChrono","lux_sens") %>:</td>
								<td  style="padding: 2px" align="center">
								 	<%=(CurrUnit.getVariable("Lux_Intensity_G"+areaCount).getRefreshableValue())%>
								 </td>
								<td  style="padding: 2px" align="center">
								 	<%=(CurrUnit.getVariable("Pos_Ain_Lux_G"+areaCount).getRefreshableAssint(lux))%>
								 </td>
							</tr>
						</table>
					</td>
				</tr>
				<%} %>
				<% 
				if(type.equals("4") || type.equals("6") || type.equals("8") || type.equals("13")){
				%>
				    <tr>
						<td   style="padding: 2px" width="30%" ><%=lan.getString("pChrono","delay_time")%>:</td>
						<td  style="padding: 2px" align="center"> 
							<%=(CurrUnit.getVariable("Pulse_On_Button_G"+areaCount).getRefreshableValue())%>
							<%=(CurrUnit.getVariable("Pulse_On_Button_G"+areaCount).getMUnit())%>
						</td>
						<td  style="padding: 2px" align="center"> 
							<INPUT NAME="<%=CurrUnit.getVariable("Pulse_On_Button_G"+areaCount).getPostName()%>" 
							   id="<%=CurrUnit.getVariable("Pulse_On_Button_G"+areaCount).getPostName()%>" 
							   onkeydown="checkOnlyAnalog(this,event);" 
							   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" type="text" size="5"
							   class='lswtype' />
						</td>
					</tr>
				<%} %>
				<% for(int i=1; i<=num ;i++){ %>
				 <tr>
				 	<td colspan="3" >
				 		<table class="topLine" width="100%">
							<tr>
								<td   style="padding: 2px" width="30%" ><%=lan.getString("pChrono","lightNoSemicolon")+i%>:</td>
								<%if("1".equals(CurrUnit.getVariable("Enable_Dout_G"+areaCount).getValue()) ){ %>
									<td  style="padding: 2px" align="center">
										<!-- picture :light -->
										<%=CurrUnit.getVariable("Light_"+i+"_G"+areaCount).getRefreshableAssint(
											"<img src='images/led/L0.gif' width='10px' height='10px'>;"+
											"<img src='images/led/L1.gif' width='10px' height='10px'>")
										%>
									</td>
									<td  style="padding: 2px" align="center"> 
										<%=(CurrUnit.getVariable("Pos_Dout_L"+(i+(areaCount-1)*4 )).getRefreshableAssint(dout) )%>
									</td>
									<!-- picture :manual -->
									<td align="center"  onclick="imgSwitch('<%=CurrUnit.getVariable("Manual_SPV_L"+(i+(areaCount-1)*4 )).getPostName()%>')">
										<%
											String Manual_SPV_L = CurrUnit.getVariable("Manual_SPV_L"+(i+(areaCount-1)*4 )).getValue();
										%>
										<img width="60px" height="53px" id="img_<%=CurrUnit.getVariable("Manual_SPV_L"+(i+(areaCount-1)*4 )).getPostName()%>" name="img_<%=CurrUnit.getVariable("Manual_SPV_L"+(i+(areaCount-1)*4 )).getPostName()%>" src="custom/dtlview/pLoads/Position_<%=Integer.parseInt(Manual_SPV_L)>Manual_SPV_L_MAX?String.valueOf(Manual_SPV_L_MAX):Manual_SPV_L%>.png"/>
										<input type='hidden' name="<%=CurrUnit.getVariable("Manual_SPV_L"+(i+(areaCount-1)*4 )).getPostName()%>" id="<%=CurrUnit.getVariable("Manual_SPV_L"+(i+(areaCount-1)*4 )).getPostName()%>"  value="<%=CurrUnit.getVariable("Manual_SPV_L"+(i+(areaCount-1)*4 )).getValue()%>" />
									</td>
								<%}else if("1".equals(CurrUnit.getVariable("Enable_Aout_G"+areaCount).getValue()) ){ %>
									<!-- picture: just value, -->
									<td  style="padding: 2px" align="center"><%=(CurrUnit.getVariable( "Light_Aout_G"+areaCount).getRefreshableValue())%></td>
									<td  style="padding: 2px" align="center"><%=(CurrUnit.getVariable( "Pos_Aout_L1_G"+areaCount).getRefreshableAssint(aout))%></td>
								<%} %>
							</tr>
							
							<% 
							if(type.equals("2") ||type.equals("3") || type.equals("4") || type.equals("14") || type.equals("15")  ){
							%>
							    <tr>
									<td    style="padding: 2px" width="30%"><%=lan.getString("pChrono","switch")%>:</td>
									<td  style="padding: 2px" align="center"> 
										<%=CurrUnit.getVariable("Din_Status_Switch_L"+(i+(areaCount-1)*4 )).getRefreshableAssint(
												"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
												"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
									%>
									</td>
									<td  style="padding: 2px" align="center"> 
										<%=CurrUnit.getVariable("Pos_Din_Switch_L"+(i+(areaCount-1)*4 )).getRefreshableAssint(din)%>
									</td>
								</tr>
							<%} %>
							<% 
							if(type.equals("4") || type.equals("6") || type.equals("8")|| type.equals("13")){
							%>
							    <tr>
									<td  style="padding: 2px" width="30%"><%=lan.getString("pChrono","timer")%>:</td>
									<td  style="padding: 2px" align="center"> 
										<%=CurrUnit.getVariable("Din_Status_Button_L"+(i+(areaCount-1)*4 )).getRefreshableAssint(
												"<img src='custom/dtlview/pChrono/images/relay_off_black.JPG' width='20px' height='15px'>;"+
												"<img src='custom/dtlview/pChrono/images/relay_on_black.png' width='20px' height='15px'>")
										%>
									</td>
									<td  style="padding: 2px" align="center"> 
										<%=(CurrUnit.getVariable("Pos_Din_Button_L"+(i+(areaCount-1)*4 )).getRefreshableAssint(din))%>
									</td>
								</tr>
							<%} %>
							<% 
							if(  (Integer.parseInt(type)>8 && Integer.parseInt(type) <13) || Integer.parseInt(type) ==14  ){
							%>
							    <tr>
									<td  style="padding: 2px" width="30%"><%=lan.getString("pChrono","button")%>:</td>
									<td  style="padding: 2px" align="center"> 
									</td>
									<td  style="padding: 2px" align="center"> 
										<%=(CurrUnit.getVariable("Pos_NB_L"+(i+(areaCount-1)*4 )).getRefreshableAssint(din))%>
									</td>
								</tr>
							<%} %>
							<% 
							if(type.equals("5") || type.equals("6")|| type.equals("11")){
							%>
							    <tr>
									<td  style="padding: 2px" width="30%"><%=lan.getString("pChrono","plugin")%>:</td>
									<td  style="padding: 2px" align="center"> 
										<%=(CurrUnit.getVariable("Plugin_SPV_L"+(i+(areaCount-1)*4 )).getRefreshableValue())%>
									</td>
									<td  style="padding: 2px" align="center"> 
										<%=(CurrUnit.getVariable("Pos_SPV_L"+(i+(areaCount-1)*4 )).getRefreshableAssint(spv))%>
									</td>
								</tr>
							<%} %>
						</table>
					</td>
				</tr>
				<%} 
				 if( !(type.equals("2")|| type.equals("9") || type.equals("14"))){
				%>
				 <% for( int scd=1;scd<=3;scd++) {
					 	String week = CurrUnit.getVariable("SCHED_SET_"+areaCount+".TimeBand_"+scd).getValue();
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
									<select name="<%=CurrUnit.getVariable("SCHED_SET_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>" id="<%=CurrUnit.getVariable("SCHED_SET_"+areaCount+".Sel_0"+scd+"_TB_G1").getPostName()%>">
										<% for (int i=0; i<=20; i++) { 
										%>
											<option  <%= i==(Integer.parseInt(CurrUnit.getVariable("SCHED_SET_"+areaCount+".Sel_0"+scd+"_TB_G1").getValue()))? " selected value='' ":" value = '"+i+"'"%> > 
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
								<select name="<%=CurrUnit.getVariable("SCHED_SET_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>" id="<%=CurrUnit.getVariable("SCHED_SET_"+areaCount+".Sel_0"+scd+"_PD_G1").getPostName()%>">
									<% for (int j=0; j<=10; j++) { %>
										<option  <%= j==(Integer.parseInt(CurrUnit.getVariable("SCHED_SET_"+areaCount+".Sel_0"+scd+"_PD_G1").getValue()))?" selected value = ''":"value = '"+j+"' " %> > 
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
									<%=  CurrUnit.getVariable("SCHED_SET_"+areaCount+".TimeBand_"+scd).getHiddenInput()%>
									<table width="100%">
										<tr> 
											<%for(int i=0;i<names.length;i++){ %>
											<td  align="center"><%= names[i]%></td>
											<%} %>
										</tr>
										<tr> 
											<%for(int i=0;i<values.length;i++){ %>
											<td  align="center"><%= CurrUnit.getVariable("SCHED_SET_"+areaCount+".TimeBand_"+scd).getCheckbox(values[i],"getDecimal") %></td>
											<%} %>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<%} // 3 dateBands scheduler for loop
				 }
			%>
			</table>
		</td>
		
	 <%}else{ %>
		 	<td  width="25%">
		 	</td>
		 <%} %>
		 
	<%if(areaCount%4==0 ){%>
	</tr>
	<tr >
		<%}%>
		
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