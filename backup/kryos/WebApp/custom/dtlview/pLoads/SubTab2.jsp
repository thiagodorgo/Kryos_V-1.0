<%@ page language="java" 
	import="com.carel.supervisor.presentation.sdk.util.Sfera"
	import="com.carel.supervisor.presentation.session.UserSession"
	import="com.carel.supervisor.presentation.bean.GroupListBean"
	import="com.carel.supervisor.presentation.helper.ServletHelper"
	import="com.carel.supervisor.presentation.devices.DeviceList"
	import="com.carel.supervisor.dataaccess.language.LangService"
	import="com.carel.supervisor.dataaccess.language.LangMgr"
	import="com.carel.supervisor.dataaccess.datalog.impl.VarphyBeanList"
	import="com.carel.supervisor.dataaccess.datalog.impl.VarphyBean"
	import="com.carel.supervisor.base.config.BaseConfig"
		
%>

<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<%
	CurrUnit.setCurrentSession(ServletHelper.retrieveSession(request.getRequestedSessionId(),request));
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	String language = sessionUser.getLanguage();	
	//sezione multilingua
	LangService lan = LangMgr.getInstance().getLangService(language);
	//multilingua per calendario

	String dom = lan.getString("cal","sun");
	String lun = lan.getString("cal","mon");
	String ma = lan.getString("cal","tue");
	String mer = lan.getString("cal","wed");
	String gio = lan.getString("cal","thu");
	String ven = lan.getString("cal","fri");
	String sab = lan.getString("cal","sat");

	String gen = lan.getString("cal","january");
	String feb = lan.getString("cal","february");
	String mar = lan.getString("cal","march");
	String apr = lan.getString("cal","april");
	String mag = lan.getString("cal","may");
	String giu = lan.getString("cal","june");
	String lug = lan.getString("cal","july");
	String ago = lan.getString("cal","august");
	String set = lan.getString("cal","september");
	String ott = lan.getString("cal","october");
	String nov = lan.getString("cal","november");
	String dic = lan.getString("cal","december");
	
	String exception = lan.getString("lucinotte","exceptions");
	String scheduler = lan.getString("lucinotte","ln2");
	String loadconf = lan.getString("dtlview","loadconf");
	String generconf = lan.getString("dtlview","generconf");
	String addexcep = lan.getString("dtlview","addexcep");
	String typeexcep = lan.getString("dtlview","typeexcep");
	String typethreshold = lan.getString("dtlview","typethreshold");
	String fullday = lan.getString("dtlview","fullday");
	String specialday = lan.getString("dtlview","specialday");
	String reduceday = lan.getString("dtlview","reduceday");
	String closeday = lan.getString("dtlview","closeday");
	String maxexcepreach = lan.getString("dtlview","maxexcepreach");
	String listexcep = lan.getString("dtlview","listexcep");
	String noexcep = lan.getString("dtlview","noexcep");
	String periodsel = lan.getString("dtlview","periodsel");
	String remove = lan.getString("setaction","del");
	String Behaviur_SP = lan.getString("dtlview","Behaviur_SP");
	String exp_SP = lan.getString("dtlview","exp_SP");
	String openclosehour = lan.getString("dtlview","openclosehour");
	String morning = lan.getString("dtlview","morning");
	String afternoon = lan.getString("dtlview","afternoon");
	String days = lan.getString("kpiresult","days");
	
	String from = lan.getString("alrsearch","from");
	String to = lan.getString("alrsearch","to");	


	String dataselect = sessionUser.getPropertyAndRemove("dataselect");
	if (dataselect==null) dataselect = "week";	
%>

<body>


<script type="text/javascript" src="scripts/arch/arkustom.js"></script>
<script type="text/javascript" src="scripts/app/calendar.js"></script>
<script>
PVPK_ActiveRefresh(30);	
</script>

<script type="text/javascript">
function myCheck(obj)
{
	var hidden = 'h_'+obj.id;
	if (obj.checked==true)
	{
		document.getElementById(hidden).value=1;
	}
	else
	{
		document.getElementById(hidden).value=0;
	}
}

function del(idstart,idend,idbeh)
{
	document.getElementById(idstart).value=0;
	document.getElementById(idend).value=0;
	document.getElementById(idbeh).value=0;
	
	var oForm = document.getElementById("formCal");
	oForm.method = "POST";
	oForm.action = "servlet/master?cmdk=sdks";
	MTstartServerComm();
	oForm.submit();
}

function AddException()
{
	var index=0;
	var value=0;
	var start=0;
	var start_Array=document.getElementById("CalStartList").value.split(";");
	var end_Array=document.getElementById("CalEndList").value.split(";");
	var beh_Array=document.getElementById("CalBehList").value.split(";");
	if (document.getElementById("tester_day").value==0 || document.getElementById("tester2_day").value==0)
	{
		alert("Set days")
	}
	else
	{
		for (index=0;index<15;index++)
		{
			value=document.getElementById(start_Array[index]).value;
			if (value==0) 
			{
				break;
			}
		}
		if (document.getElementById("tester_month").value>9)
		{
		document.getElementById(start_Array[index]).value=(document.getElementById("tester_day").value)+(document.getElementById("tester_month").value);
		}
		else
		{
		document.getElementById(start_Array[index]).value=((document.getElementById("tester_day").value)*10)+(document.getElementById("tester_month").value);		
		}
		
		if (document.getElementById("tester2_month").value>9)
		{
		document.getElementById(end_Array[index]).value=(document.getElementById("tester2_day").value)+(document.getElementById("tester2_month").value);
		}
		else 
		{
		document.getElementById(end_Array[index]).value=((document.getElementById("tester2_day").value)*10)+(document.getElementById("tester2_month").value);
		}
		document.getElementById(beh_Array[index]).value=parseInt(document.getElementById("Type_Exc").value)*100+parseInt(document.getElementById("Type_Threshold").value);
		var oForm = document.getElementById("formCal");
		oForm.method = "POST";
		oForm.action = "servlet/master?cmdk=sdks";
		MTstartServerComm();
		oForm.submit();
	}
}
function changeSubTab(tabNum){
	var currentTab = document.getElementById("tab"+tabNum);
	var currentHideMe = document.getElementById("HideMe"+tabNum);
	for(var i=0;i<=3;i++){
		if(i==tabNum){
			document.getElementById("tab"+i).className='groupCategorySelected';
			document.getElementById("tab"+i).style.textTransform='uppercase';
			document.getElementById("HideMe"+i).style.display='block';
			document.getElementById("HideMe"+i).style.visibility='visible';
		}else{
			document.getElementById("tab"+i).className='groupCategory';
			document.getElementById("tab"+i).style.textTransform='none';
			document.getElementById("HideMe"+i).style.display='none';
			document.getElementById("HideMe"+i).style.visibility='hidden';
		}
	}
}
</script>


<form id="formSettableVars" name="formSettableVars" action="#">
	<table width="680px" valign="top" border="0" cellpadding="0" cellspacing="0">
	<td width='170px' height='30px' id="tab0" class="groupCategorySelected" style="text-transform:uppercase;" onclick="changeSubTab(0)"><%=exception%></td>
	<td width='170px' height='30px' id="tab1" class="groupCategory" onclick="changeSubTab(1)"><%=scheduler%></td>
	<td width='170px' height='30px' id="tab2" class="groupCategory" onclick="changeSubTab(2)"><%=loadconf%></td>
	<td width='170px' height='30px' id="tab3" class="groupCategory" onclick="changeSubTab(3)"><%=generconf%></td>
	</table>
	</br>
	
	<div id="HideMe0" style="display:block;visibility:visible">
	<!-- Section 1: Special periods -->
	<table width="98%" valign="top" border="0" cellpadding="0" cellspacing="0">
		<tr height="100%">
		
		<td width="50%" valign="top">
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
										<option value="1"><%=gen%></option>
										<option value="2"><%=feb%></option>
										<option value="3"><%=mar%></option>
										<option value="4"><%=apr%></option>
										<option value="5"><%=mag%></option>
										<option value="6"><%=giu%></option>
										<option value="7"><%=lug%></option>
										<option value="8"><%=ago%></option>
										<option value="9"><%=set%></option>
										<option value="10"><%=ott%></option>
										<option value="11"><%=nov%></option>
										<option value="12"><%=dic%></option>
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
										var arDay = new Array("<%=dom%>","<%=lun%>","<%=ma%>","<%=mer%>","<%=gio%>","<%=ven%>","<%=sab%>");
										var arMonth = new Array("<%=gen%>","<%=feb%>","<%=mar%>","<%=apr%>","<%=mag%>","<%=giu%>","<%=lug%>","<%=ago%>","<%=set%>","<%=ott%>","<%=nov%>","<%=dic%>");
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
										<option value="1"><%=gen%></option>
										<option value="2"><%=feb%></option>
										<option value="3"><%=mar%></option>
										<option value="4"><%=apr%></option>
										<option value="5"><%=mag%></option>
										<option value="6"><%=giu%></option>
										<option value="7"><%=lug%></option>
										<option value="8"><%=ago%></option>
										<option value="9"><%=set%></option>
										<option value="10"><%=ott%></option>
										<option value="11"><%=nov%></option>
										<option value="12"><%=dic%></option>
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
										var arDay = new Array("<%=dom%>","<%=lun%>","<%=ma%>","<%=mer%>","<%=gio%>","<%=ven%>","<%=sab%>");
										var arMonth = new Array("<%=gen%>","<%=feb%>","<%=mar%>","<%=apr%>","<%=mag%>","<%=giu%>","<%=lug%>","<%=ago%>","<%=set%>","<%=ott%>","<%=nov%>","<%=dic%>");
										cal2 = new Calendar ("cal2", "tester2", new Date(), arDay, arMonth);
										renderCalendar(cal2);
									</script>
								</td>
							</tr>
							<tr>
								<td width="25%" ><%=typeexcep%>:</td>
								<td  width="75%" align="center">
									<select name="Type_Exc" id="Type_Exc">
										<option value='0'><%=fullday%></option>
										<option value='1'><%=specialday%></option>
										<option value='2'><%=reduceday%></option>
										<option value='3'><%=closeday%></option>
									</select>
								</td>
							</tr>
							<tr>
								<td width="25%" >&nbsp;</td>
								<td width="75%" align="center">
									<div style="display:none;visibility:hidden"></div>
								</td>
							</tr>
							<tr>
								<td width="25%" ><%=typethreshold%>:</td>
								<td  width="75%" align="center">
									<select name="Type_Threshold" id="Type_Threshold">
										<option value='0'> <%= exp_SP.split(";")[0] %> </option>
										<option value='1'> <%= exp_SP.split(";")[1] %> </option>
										<option value='2'> <%= exp_SP.split(";")[2] %> </option>
										<option value='3'> <%= exp_SP.split(";")[3] %> </option>
									</select>
								</td>
							</tr>
							</table>
				</td>
				<% if (((!CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_1").getValue().equals("***"))) && (
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
				) {%>
				<td align="center" width="30%">
					<img style="width: 25px; height: 25px; cursor:pointer;" src="images/actions/add_on_black.png" onclick='AddException();'/>
				</td>
				<% } else {%>
				<td align="center"  width="30%"><%=maxexcepreach%>!</td>
				<%}%>
				</table>
			</Fieldset>
		</td>
		
		<td>&nbsp;</td>
		
		<td width="48%" valign="top">
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
									: 
									<%=Sfera.assint(Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_"+i).getValue())/100,Behaviur_SP,"***")%>
									-
									<%
										int temp = Integer.parseInt(CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_"+i).getValue());
									%>
									<%=Sfera.assint( (temp>=100?temp%100:temp)  ,exp_SP,"***")%>
								</td>
								<td width="20%" align="center">
								<img style="width: 25px; height: 25px; cursor:pointer;" src="images/actions/clean_on_black.png" onclick="del('<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_Start_SP_"+i).getPostName()%>','<%=CurrUnit.getVariable("MOD_CALENDAR_1.DM_End_SP_"+i).getPostName()%>','<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_"+i).getPostName()%>')"/> 
								</td>
							</tr>
							<% } %>	
						<%} %>
					<%}%>
				</table>
			</Fieldset>
		</td>
		
		</tr>
	</table>
	</div>
	
	
	<div id="HideMe1" style="display:none;visibility:hidden">
		<!-- Section 1: Opening closing time -->
		<% if (!CurrUnit.getVariable("Loads_Number").getValue().equals("***")){%>	
			<fieldset class="field">
			<legend ><%=openclosehour%></legend>
				<table width="98%" valign="top" border="0" cellpadding="0" cellspacing="0">
					<tr>
						<td align="center"  width="8%">&nbsp;</td>
						<td align="center"  width="16%"><b><%=fullday%></b></td>
						<td align="center"  width="16%"><b><%=specialday%></b></td>
						<td align="center"  width="16%"><b><%=reduceday%></b></td>
						<td align="center"  width="4%">&nbsp;</td>
					</tr>
					<tr height="30px">
						<td  align="center"><%=morning%></td>
						<td  align="center">
						
								<div style="margin-bottom:4px;margin-top:4px"><%=lan.getString("algopro","sStart")%>&nbsp;&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%=lan.getString("algopro","sStop") %></div>
								<div>
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD1_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD1_H").getPostName()%>">
									<% for (int i=0; i<24; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD1_H").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i %></option>
									<% } %>				
									</select> : 
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD1_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD1_M").getPostName()%>">
									<% for (int i=0; i<60; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD1_M").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i  %> </option>
									<% } %>				
									</select>
										--
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD1_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD1_H").getPostName()%>">
									<% for (int i=0; i<24; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD1_H").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
									<% } %>				
									</select> :  
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD1_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD1_M").getPostName()%>">
									<% for (int i=0; i<60; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD1_M").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i  %></option>
									<% } %>				
									</select>
								
								</div>
						</td>
						<td  align="center">
								<div style="margin-bottom:4px;margin-top:4px"><%=lan.getString("algopro","sStart")%>&nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;<%=lan.getString("algopro","sStop") %></div>
								<div>
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD2_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD2_H").getPostName()%>">
									<% for (int i=0; i<24; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD2_H").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%></option>
									<% } %>				
									</select> : 
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD2_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD2_M").getPostName()%>">
									<% for (int i=0; i<60; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB1_FD2_M").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%> </option>
									<% } %>				
									</select>
										--
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD2_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD2_H").getPostName()%>">
									<% for (int i=0; i<24; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD2_H").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
									<% } %>				
									</select> :  
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD2_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD2_M").getPostName()%>">
									<% for (int i=0; i<60; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB1_FD2_M").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
									<% } %>				
									</select>
								
								</div>
						</td>
						<td  align="center">
								<div style="margin-bottom:4px;margin-top:4px"><%=lan.getString("algopro","sStart")%> &nbsp;&nbsp;--&nbsp;&nbsp;&nbsp;<%=lan.getString("algopro","sStop") %></div>
								<div>
								
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_RD1_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_RD1_H").getPostName()%>">
									<% for (int i=0; i<24; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_RD1_H").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%></option>
									<% } %>				
									</select> : 
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_RD1_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_RD1_M").getPostName()%>">
									<% for (int i=0; i<60; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_RD1_M").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%> </option>
									<% } %>				
									</select>
										--
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_RD1_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_RD1_H").getPostName()%>">
									<% for (int i=0; i<24; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_RD1_H").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
									<% } %>				
									</select> :  
									<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_RD1_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_RD1_M").getPostName()%>">
									<% for (int i=0; i<60; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_RD1_M").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
									<% } %>				
									</select>
								
								</div>
						</td>
						<td  align="center">&nbsp;</td>
					</tr>
					<tr height="30px">
						<td  align="center"><%=afternoon%></td>
						<td  align="center">
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD1_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD1_H").getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD1_H").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%></option>
								<% } %>				
								</select> : 
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD1_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD1_M").getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD1_M").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%> </option>
								<% } %>				
								</select>
									--
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD1_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD1_H").getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD1_H").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
								<% } %>				
								</select> :  
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD1_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD1_M").getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD1_M").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
								<% } %>				
								</select>
						</td>
						<td  align="center">
										
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD2_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD2_H").getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD2_H").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%></option>
								<% } %>				
								</select> : 
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD2_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD2_M").getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Start_TB2_FD2_M").getValue()))){%>selected<%} %> > <%=(i<10?"0":"")+i%> </option>
								<% } %>				
								</select>
									--
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD2_H").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD2_H").getPostName()%>">
								<% for (int i=0; i<24; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD2_H").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
								<% } %>				
								</select> :  
								<select name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD2_M").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD2_M").getPostName()%>">
								<% for (int i=0; i<60; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.End_TB2_FD2_M").getValue()))){%>selected<%} %> >  <%=(i<10?"0":"")+i%></option>
								<% } %>				
								</select>
							
						</td>
						<td  align="center">&nbsp;</td>
						<td  align="center">&nbsp;</td>
					</tr>
				</table>
			</fieldset>
			</br>
			<table width="98%" valign="top">
				<tr>
					<th class="th" align="center"  width="10%"><%=days%></th>
					<th class="th" align="center"  width="16%"><%=fullday%></th>
					<th class="th" align="center"  width="16%"><%=specialday%></th>
					<th class="th" align="center"  width="16%"><%=reduceday%></th>
					<th class="th" align="center"  width="6%"><%=closeday%></th>
				</tr>
				<tr class='Row1' height="30px" align ="center">
					<td><%=lun%></td>
					<td>
						<input type="radio" class="bigRadio " <% if (0==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" value="0">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (1==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" value="1">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (2==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" value="2">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (3==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Monday").getPostName()%>" value="3">
					</td>
				</tr>
				<tr class='Row2' height="30px" align ="center">
					<td><%=ma%></td>
					<td>
						<input type="radio" class="bigRadio " <% if (0==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" value="0">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (1==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" value="1">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (2==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" value="2">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (3==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Tuesday").getPostName()%>" value="3">
					</td>
				</tr>
				<tr class='Row1' height="30px" align ="center">
					<td><%=mer%></td>
					<td>
						<input type="radio" class="bigRadio " <% if (0==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" value="0">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (1==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" value="1">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (2==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" value="2">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (3==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Wednesday").getPostName()%>" value="3">
					</td>
				</tr>
				<tr class='Row2' height="30px" align ="center">
					<td><%=gio%></td>
					<td>
						<input type="radio" class="bigRadio " <% if (0==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" value="0">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (1==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" value="1">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (2==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" value="2">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (3==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Thursday").getPostName()%>" value="3">
					</td>
				</tr>
				<tr class='Row1' height="30px" align ="center">
					<td><%=ven%></td>
					<td>
						<input type="radio" class="bigRadio " <% if (0==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" value="0">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (1==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" value="1">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (2==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" value="2">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (3==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Friday").getPostName()%>" value="3">
					</td>
				</tr>
				<tr class='Row2' height="30px" align ="center">
					<td><%=sab%></td>
					<td>
						<input type="radio" class="bigRadio " <% if (0==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" value="0">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (1==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" value="1">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (2==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" value="2">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (3==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Saturday").getPostName()%>" value="3">
					</td>
				</tr>
				<tr class='Row1'height="30px" align ="center">
					<td><%=dom%></td>
					<td>
						<input type="radio" class="bigRadio " <% if (0==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" value="0">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (1==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" value="1">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (2==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" value="2">
					</td>
					<td>
						<input type="radio" class="bigRadio " <% if (3==(Integer.parseInt(CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getValue()))){%>checked<%} %>
						name="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" id="<%=CurrUnit.getVariable("MOD_SCHEDULER_ENERGY_1.Type_Sunday").getPostName()%>" value="3">
					</td>
				</tr>
			</table>
		<% } %>	
	</div>
	
		<jsp:include page="Include.jsp" flush="true" />
	
</form>
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
			
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_1").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_1").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_1").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_2").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_2").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_2").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_3").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_3").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_3").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_4").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_4").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_4").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_5").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_5").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_5").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_6").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_6").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_6").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_7").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_7").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_7").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_8").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_8").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_8").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_9").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_9").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_9").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_10").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_10").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_10").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_11").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_11").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_11").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_12").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_12").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_12").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_13").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_13").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_13").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_14").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_14").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_14").getValue()%>"/>
		<input type="hidden" id="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_15").getPostName()%>" name= "<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_15").getPostName()%>" value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_15").getValue()%>"/>	
		<input type="hidden" id="CalBehList" 
		value="<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_1").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_2").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_3").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_4").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_5").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_6").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_7").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_8").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_9").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_10").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_11").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_12").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_13").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_14").getPostName()%>;<%=CurrUnit.getVariable("MOD_CALENDAR_1.Behaviur_SP_15").getPostName()%>"/>			
	</form> 
</body>			


