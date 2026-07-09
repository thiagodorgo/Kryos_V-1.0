<%@ page language="java" 
import="com.carel.supervisor.presentation.sdk.util.Sfera"
import="com.carel.supervisor.presentation.helper.ServletHelper"
import="com.carel.supervisor.presentation.session.UserSession"
import="com.carel.supervisor.presentation.session.UserSession"
import="com.carel.supervisor.dataaccess.language.LangService"
import="com.carel.supervisor.dataaccess.language.LangMgr"
%>


<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<% 
UserSession sessionUser=ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
String language = sessionUser.getLanguage();
LangService lan = LangMgr.getInstance().getLangService(language);
String devices = lan.getString("booklet","devices");
String scheduler = lan.getString("energy","tab4name");
String cutload = lan.getString("dtlview","cutload");
String enablesche = lan.getString("dtlview","enablesche");
String preopen = lan.getString("dtlview","preopen");
String postclose = lan.getString("dtlview","postclose");
String behaviorpause = lan.getString("dtlview","behaviorpause");
String enablecut = lan.getString("dtlview","enablecut");
String priority = lan.getString("wizard","priority");
String light = lan.getString("lucinotte","luci");
String extlights = lan.getString("dtlview","extlights");
String conditioning = lan.getString("dtlview","conditioning");
String autodoor = lan.getString("dtlview","autodoor");
String ltcab = lan.getString("dtlview","ltcab");
String ntcab = lan.getString("dtlview","ntcab");
String ltcomprack = lan.getString("dtlview","ltcomprack");
String ntcomprack = lan.getString("dtlview","ntcomprack");
String banner = lan.getString("dtlview","banner");
String parkingout = lan.getString("dtlview","parkingout");
String parking = lan.getString("dtlview","parking");
String coveredparking = lan.getString("dtlview","coveredparking");
String oven = lan.getString("dtlview","oven");
String fryer = lan.getString("dtlview","fryer");
String spits = lan.getString("dtlview","spits");
String hot_plate = lan.getString("dtlview","hot-plate");
String recharge = lan.getString("dtlview","recharge");
String warmbanch = lan.getString("dtlview","warmbanch");
String other = lan.getString("energy","other");
String alwaysoffbtwband = lan.getString("dtlview","alwaysoffbtwband");
String alwaysonbtwband = lan.getString("dtlview","alwaysonbtwband");
String prepostbtwband = lan.getString("dtlview","prepostbtwband");
String enable = lan.getString("dtlview","enable");
String disable = lan.getString("dtlview","disable");


%>



	<div id="HideMe2" style="display:none;visibility:hidden">postclose
	<!-- Section 2: Load management -->
	<table valign="top" width="98%" height="100%">
		<tr height="6%">
			<th class="th" align="center" rowspan="2" width="10%"><%=devices%></th>
			<th class="th" align="center" colspan="4"><%=scheduler%></th>
			<th class="th" align="center" colspan="2"><%=cutload%></th>
		</tr>
		<tr height="6%">
			
			<th class="th" align="center"  width="5%"><%=enablesche%></th>
			<th class="th" align="center"  width="10%"><%=preopen%></th>
			<th class="th" align="center"  width="10%"><%=postclose%></th>
			<th class="th" align="center"  width="10%"><%=behaviorpause%></th>
			<th class="th" align="center"  width="5%"><%=enablecut%></th>
			<th class="th" align="center"  width="10%"><%=priority%></th>
		</tr>
		<!-- Load 1 -->
			<tr class='Row1' height="30px" align ="center">
				<% if (!CurrUnit.getVariable("Pre_L1_FD1").getValue().equals("***")) {%>
				<td>
					
					<select name="<%=CurrUnit.getVariable("Label_Load_1").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_1").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_1").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_1").getPostName()%>"  
						id="h_<%=CurrUnit.getVariable("En_Sched_Load_1").getPostName()%>"   
						value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_1").getValue())==1?"1":"0" %>"/>
				
					<INPUT onclick="myCheck(this)" TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_1").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_1").getValue())==1?"checked":" " %> /> 
				</td>
				<td>
					<select name="<%=CurrUnit.getVariable("Pre_L1_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L1_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L1_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td>
					<select name="<%=CurrUnit.getVariable("Post_L1_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L1_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L1_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Behavior_Pause_L1").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L1").getPostName()%>">
								<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L1").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
								<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L1").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
								<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L1").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
								
					</select>
				</td>
				<td>
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_1").getPostName()%>"  
						id="h_<%=CurrUnit.getVariable("En_Cut_Load_1").getPostName()%>"   
						value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_1").getValue())==1?"1":"0" %>"/>
				
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Cut_Load_1").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_1").getValue())==1?"checked":" " %> /> 
				</td>
				<td>
					<select name="<%=CurrUnit.getVariable("Priority_L1").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L1").getPostName()%>">
								<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L1").getValue()))) {%>selected<%} %> ><%=i%></option>
								<% } %>
					</select>
				</td>
				<% } %>
			</tr>
		
		<br/>
		<!-- Load 2 -->
		
		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>1) {%>
			<tr class='Row2' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_2").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_2").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_2").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_2").getPostName()%>"  
						id="h_<%=CurrUnit.getVariable("En_Sched_Load_2").getPostName()%>"   
						value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_2").getValue())==1?"1":"0" %>"/>
				
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_2").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_2").getValue())==1?"checked":" " %> /> 
				</td>
				<td>
					<select name="<%=CurrUnit.getVariable("Pre_L2_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L2_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L2_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td>
					<select name="<%=CurrUnit.getVariable("Post_L2_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L2_FD1").getPostName()%>">
						<% for (int i=0; i<=120; i++) { %>
							<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L2_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
						<% } %>
					</select>
				</td>
				<td>
					<select name="<%=CurrUnit.getVariable("Behavior_Pause_L2").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L2").getPostName()%>">
								<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L2").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
								<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L2").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
								<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L2").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
								
					</select>
				</td>
				<td>
				<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_2").getPostName()%>"  
					id="h_<%=CurrUnit.getVariable("En_Cut_Load_2").getPostName()%>"   
					value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_2").getValue())==1?"1":"0" %>"/>
			
				<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
					ID="<%=CurrUnit.getVariable("En_Cut_Load_2").getPostName()%>" 
					<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_2").getValue())==1?"checked":" " %> /> 	
				</td>
				<td>
					<select name="<%=CurrUnit.getVariable("Priority_L2").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L2").getPostName()%>">
								<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L2").getValue()))) {%>selected<%} %> ><%=i%></option>
								<% } %>
					</select>
				</td>
			</tr>
		<% } %>
		
		<!-- Load 3 -->

		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>2) {%>
			<tr class='Row1' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_3").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_3").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_3").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
					<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_3").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Sched_Load_3").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_3").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_3").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_3").getValue())==1?"checked":" " %> /> 
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Pre_L3_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L3_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L3_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Post_L3_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L3_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L3_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Behavior_Pause_L3").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L3").getPostName()%>">
									<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L3").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
									<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L3").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
									<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L3").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
									
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_3").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Cut_Load_3").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_3").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Cut_Load_3").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_3").getValue())==1?"checked":" " %> /> 
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Priority_L3").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L3").getPostName()%>">
									<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L3").getValue()))) {%>selected<%} %> ><%=i%></option>
									<% } %>
						</select>
					</td>
			</tr>
		<% } %>
		
		<!-- Load 4 -->
		
		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>3) {%>
			<tr class='Row2' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_4").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_4").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_4").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_4").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Sched_Load_4").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_4").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Sched_Load_4").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_4").getValue())==1?"checked":" " %> /> 
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Pre_L4_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L4_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L4_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Post_L4_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L4_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L4_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Behavior_Pause_L4").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L4").getPostName()%>">
									<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L4").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
									<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L4").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
									<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L4").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
									
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_4").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Cut_Load_4").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_4").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Cut_Load_4").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_4").getValue())==1?"checked":" " %> /> 
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Priority_L4").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L4").getPostName()%>">
									<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L4").getValue()))) {%>selected<%} %> ><%=i%></option>
									<% } %>
						</select>
					</td>
			</tr>
		<% } %>
							
		<!-- Load 5 -->

		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>4) {%>
			<tr class='Row1' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_5").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_5").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_5").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_5").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Sched_Load_5").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_5").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Sched_Load_5").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_5").getValue())==1?"checked":" " %> /> 
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Pre_L5_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L5_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L5_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Post_L5_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L5_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L5_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Behavior_Pause_L5").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L5").getPostName()%>">
									<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L2").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
									<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L2").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
									<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L2").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
									
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_5").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Cut_Load_5").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_5").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Cut_Load_5").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_5").getValue())==1?"checked":" " %> /> 
					</td>
					<td>
						<select name="<%=CurrUnit.getVariable("Priority_L5").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L5").getPostName()%>">
									<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L5").getValue()))) {%>selected<%} %> ><%=i%></option>
									<% } %>
						</select>
					</td>
			</tr>
		<% } %>
		
		<!-- Load 6 -->

		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>5) {%>
			<tr class='Row2' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_6").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_6").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_6").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>					
					</select>
				</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_6").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Sched_Load_6").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_6").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Sched_Load_6").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_6").getValue())==1?"checked":" " %> /> 
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Pre_L6_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L6_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L6_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Post_L6_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L6_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L6_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Behavior_Pause_L6").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L6").getPostName()%>">
									<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L6").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
									<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L6").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
									<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L6").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
									
						</select>
					</td>									
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_6").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Cut_Load_6").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_6").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Cut_Load_6").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_6").getValue())==1?"checked":" " %> /> 
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Priority_L6").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L6").getPostName()%>">
									<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L6").getValue()))) {%>selected<%} %> ><%=i%></option>
									<% } %>
						</select>
					</td>
			</tr>
		<% } %>

		<!-- Load 7 -->

		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>6) {%>
			<tr class='Row1' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_7").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_7").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_7").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_7").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Sched_Load_7").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_7").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Sched_Load_7").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_7").getValue())==1?"checked":" " %> /> 
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Pre_L7_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L7_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L7_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Post_L7_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L7_FD1").getPostName()%>">
									<% for (int i=0; i<=120; i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L7_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
									<% } %>
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Behavior_Pause_L7").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L7").getPostName()%>">
									<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L7").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
									<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L7").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
									<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L7").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
									
						</select>
					</td>
					<td class="tdcenter" style="text-align:center">
						<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_7").getPostName()%>"  
								id="h_<%=CurrUnit.getVariable("En_Cut_Load_7").getPostName()%>"   
								value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_7").getValue())==1?"1":"0" %>"/>
						
						<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
							ID="<%=CurrUnit.getVariable("En_Cut_Load_7").getPostName()%>" 
							<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_7").getValue())==1?"checked":" " %> /> 
					</td>
					<td class="tdcenter" style="text-align:center">
						<select name="<%=CurrUnit.getVariable("Priority_L7").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L7").getPostName()%>">
									<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
										<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L7").getValue()))) {%>selected<%} %> ><%=i%></option>
									<% } %>
						</select>
					</td>
			</tr>
		<% } %>
		
		<!-- Load 8 -->

		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>7) {%>
			<tr class='Row2' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_8").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_8").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_8").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_8").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Sched_Load_8").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_8").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_8").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_8").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Pre_L8_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L8_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L8_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Post_L8_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L8_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L8_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Behavior_Pause_L8").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L8").getPostName()%>">
								<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L8").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
								<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L8").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
								<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L8").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
								
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_8").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Cut_Load_8").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_8").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Cut_Load_8").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_8").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Priority_L8").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L8").getPostName()%>">
								<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L8").getValue()))) {%>selected<%} %> ><%=i%></option>
								<% } %>
					</select>
				</td>
			</tr>
		<% } %>						
		
		<!-- Load 9 -->
		
		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>8) {%>
			<tr class='Row1' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_9").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_9").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_9").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_9").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Sched_Load_9").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_9").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_9").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_9").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Pre_L9_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L9_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L9_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Post_L9_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L9_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L9_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Behavior_Pause_L9").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L9").getPostName()%>">
								<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L9").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
								<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L9").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
								<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L9").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
								
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_9").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Cut_Load_9").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_9").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Cut_Load_9").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_9").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Priority_L9").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L9").getPostName()%>">
								<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L9").getValue()))) {%>selected<%} %> ><%=i%></option>
								<% } %>
					</select>
				</td>
			</tr>
		<% } %>									
		
		<!-- Load 10 -->
		
		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>9) {%>
			<tr class='Row2' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_10").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_10").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_10").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>			
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_10").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Sched_Load_10").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_10").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_10").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_10").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Pre_L10_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L10_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L10_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Post_L10_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L10_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L10_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Behavior_Pause_L10").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L10").getPostName()%>">
								<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L10").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
								<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L10").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
								<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L10").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
								
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_10").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Cut_Load_10").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_10").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Cut_Load_10").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_10").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Priority_L10").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L10").getPostName()%>">
								<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L10").getValue()))) {%>selected<%} %> ><%=i%></option>
								<% } %>
					</select>
				</td>
			</tr>
		<% } %>					
		
		<!-- Load 11 -->

		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>10) {%>
			<tr class='Row1' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_11").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_11").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_11").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_11").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Sched_Load_11").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_11").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_11").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_11").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Pre_L11_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L11_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L11_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Post_L11_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L11_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L11_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Behavior_Pause_L11").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L11").getPostName()%>">
								<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L11").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
								<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L11").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
								<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L11").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
								
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_11").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Cut_Load_11").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_11").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Cut_Load_11").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_11").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Priority_L11").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L11").getPostName()%>">
								<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L11").getValue()))) {%>selected<%} %> ><%=i%></option>
								<% } %>
					</select>
				</td>
			</tr>
		<% } %>					
		
		<!-- Load 12 -->

		<% if (((!CurrUnit.getVariable("Loads_Number").getValue().equals("***"))) && (Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue()))>11) {%>
			<tr class='Row1' height="30px" align ="center">
				<td>
					<select name="<%=CurrUnit.getVariable("Label_Load_12").getPostName()%>" id="<%=CurrUnit.getVariable("Label_Load_12").getPostName()%>">
						<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==0) {%>selected<%} %>><%=light%> 1</option>
						<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==1) {%>selected<%} %>><%=light%> 2</option>
						<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==2) {%>selected<%} %>><%=light%> 3</option>
						<option value='3' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==3) {%>selected<%} %>><%=light%> 4</option>
						<option value='4' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==4) {%>selected<%} %>><%=extlights%> 1</option>
						<option value='5' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==5) {%>selected<%} %>><%=extlights%> 2</option>
						<option value='6' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==6) {%>selected<%} %>><%=extlights%> 3</option>
						<option value='7' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==7) {%>selected<%} %>><%=conditioning%> 1</option>
						<option value='8' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==8) {%>selected<%} %>><%=conditioning%> 2</option>
						<option value='9' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==9) {%>selected<%} %>><%=conditioning%> 3</option>
						<option value='10' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==10) {%>selected<%} %>><%=autodoor%> 1</option>
						<option value='11' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==11) {%>selected<%} %>><%=autodoor%> 2</option>
						<option value='12' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==12) {%>selected<%} %>><%=autodoor%> 3</option>
						<option value='13' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==13) {%>selected<%} %>><%=ltcab%> 1</option>
						<option value='14' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==14) {%>selected<%} %>><%=ltcab%> 2</option>
						<option value='15' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==15) {%>selected<%} %>><%=ltcab%> 3</option>
						<option value='16' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==16) {%>selected<%} %>><%=ntcab%> 1</option>
						<option value='17' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==17) {%>selected<%} %>><%=ntcab%> 2</option>
						<option value='18' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==18) {%>selected<%} %>><%=ntcab%> 3</option>
						<option value='19' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==19) {%>selected<%} %>><%=ltcomprack%> 1</option>
						<option value='20' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==20) {%>selected<%} %>><%=ltcomprack%> 2</option>
						<option value='21' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==21) {%>selected<%} %>><%=ntcomprack%> 1</option>
						<option value='22' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==22) {%>selected<%} %>><%=ntcomprack%> 2</option>
						<option value='23' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==23) {%>selected<%} %>><%=banner%> 1</option>
						<option value='24' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==24) {%>selected<%} %>><%=banner%> 2</option>
						<option value='25' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==25) {%>selected<%} %>><%=parkingout%></option>
						<option value='26' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==26) {%>selected<%} %>><%=parking%></option>
						<option value='27' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==27) {%>selected<%} %>><%=coveredparking%></option>
						<option value='28' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==28) {%>selected<%} %>><%=oven%> 1</option>
						<option value='29' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==29) {%>selected<%} %>><%=oven%> 2</option>
						<option value='30' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==30) {%>selected<%} %>><%=oven%> 3</option>
						<option value='31' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==31) {%>selected<%} %>><%=fryer%> 1</option>
						<option value='32' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==32) {%>selected<%} %>><%=fryer%> 2</option>
						<option value='33' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==33) {%>selected<%} %>><%=fryer%> 3</option>
						<option value='34' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==34) {%>selected<%} %>><%=spits%> 1</option>
						<option value='35' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==35) {%>selected<%} %>><%=spits%> 2</option>
						<option value='36' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==36) {%>selected<%} %>><%=hot_plate%> 1</option>
						<option value='37' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==37) {%>selected<%} %>><%=hot_plate%> 2</option>
						<option value='38' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==38) {%>selected<%} %>><%=recharge%> 1</option>
						<option value='39' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==39) {%>selected<%} %>><%=warmbanch%> 1</option>	
						<option value='40' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==40) {%>selected<%} %>><%=warmbanch%> 2</option>
						<option value='41' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==41) {%>selected<%} %>><%=other%> 1</option>
						<option value='42' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==42) {%>selected<%} %>><%=other%> 2</option>
						<option value='43' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==43) {%>selected<%} %>><%=other%> 3</option>
						<option value='44' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==44) {%>selected<%} %>><%=other%> 4</option>
						<option value='45' <% if ((Integer.parseInt(CurrUnit.getVariable("Label_Load_12").getValue()))==45) {%>selected<%} %>><%=other%> 5</option>				
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Sched_Load_12").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Sched_Load_12").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_12").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Sched_Load_12").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Sched_Load_12").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Pre_L12_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Pre_L12_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Pre_L12_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Post_L12_FD1").getPostName()%>" id="<%=CurrUnit.getVariable("Post_L12_FD1").getPostName()%>">
								<% for (int i=0; i<=120; i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Post_L12_FD1").getValue()))) {%>selected<%} %> ><%=i%> min</option>
								<% } %>
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Behavior_Pause_L12").getPostName()%>" id="<%=CurrUnit.getVariable("Behavior_Pause_L12").getPostName()%>">
								<option value='0' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L12").getValue()))==0) {%>selected<%} %>><%=alwaysoffbtwband%></option>
								<option value='1' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L12").getValue()))==1) {%>selected<%} %>><%=alwaysonbtwband%></option>
								<option value='2' <% if ((Integer.parseInt(CurrUnit.getVariable("Behavior_Pause_L12").getValue()))==2) {%>selected<%} %>><%=prepostbtwband%></option>
								
					</select>
				</td>
				<td class="tdcenter" style="text-align:center">
					<input type=hidden   NAME="<%=CurrUnit.getVariable("En_Cut_Load_12").getPostName()%>"  
							id="h_<%=CurrUnit.getVariable("En_Cut_Load_12").getPostName()%>"   
							value="<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_12").getValue())==1?"1":"0" %>"/>
					
					<INPUT onclick="myCheck(this)"  TYPE='checkbox'  class="bigcheck"
						ID="<%=CurrUnit.getVariable("En_Cut_Load_12").getPostName()%>" 
						<%=Integer.parseInt(CurrUnit.getVariable("En_Cut_Load_12").getValue())==1?"checked":" " %> /> 
				</td>
				<td class="tdcenter" style="text-align:center">
					<select name="<%=CurrUnit.getVariable("Priority_L12").getPostName()%>" id="<%=CurrUnit.getVariable("Priority_L12").getPostName()%>">
								<% for (int i=1; i<=(Integer.parseInt(CurrUnit.getVariable("Loads_Number").getValue())); i++) { %>
									<option value='<%=i%>' <% if (i==(Integer.parseInt(CurrUnit.getVariable("Priority_L12").getValue()))) {%>selected<%} %> ><%=i%></option>
								<% } %>
					</select>
				</td>
			</tr>
		<% } %>		
						
	</table>
	</div>
	
	<div id="HideMe3" style="display:none;visibility:hidden">	
	<!-- Section 4: Configuration -->
	<table valign="top" width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">

		<table width="98%" cellpadding="4">
			<TR>
				<TH class=th height=18 width="18%" colSpan=2>Valore</TH>
				<TH class=th height=18 width="18%">Nuovo</TH>
				<TH class=th height=18 width=*>Descrizione</TH>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("BMS_Hour").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("BMS_Hour").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("BMS_Hour").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("BMS_Hour").getPostName()%>"
					   onkeydown="checkOnlyAnalog(this,event);"
					   onblur="sdk_checkMinMaxValue(this,0,23);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("BMS_Hour").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("BMS_Minute").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("BMS_Minute").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("BMS_Minute").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("BMS_Minute").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,59);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("BMS_Minute").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("BMS_Day").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("BMS_Day").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("BMS_Day").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("BMS_Day").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,1,31);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("BMS_Day").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("BMS_Month").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("BMS_Month").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("BMS_Month").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("BMS_Month").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,1,12);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("BMS_Month").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("BMS_Year").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("BMS_Year").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("BMS_Year").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("BMS_Year").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,99);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("BMS_Year").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Time_Chk_Energy").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Time_Chk_Energy").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Time_Chk_Energy").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Time_Chk_Energy").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,1,60);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Time_Chk_Energy").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Perc_Power").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Perc_Power").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Perc_Power").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Perc_Power").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,1,100);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Perc_Power").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Perc_Energy").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Perc_Energy").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Perc_Energy").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Perc_Energy").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,1,100);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Perc_Energy").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Delay_Cut").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Delay_Cut").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Delay_Cut").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Delay_Cut").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,9999);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Delay_Cut").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Min_Time_Cut").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Min_Time_Cut").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Min_Time_Cut").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Min_Time_Cut").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,500);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Min_Time_Cut").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Max_Time_Cut").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Max_Time_Cut").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Max_Time_Cut").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Max_Time_Cut").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,999);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Max_Time_Cut").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Num_EM").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Num_EM").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Num_EM").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Num_EM").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,12);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Num_EM").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Loads_Number").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Loads_Number").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Loads_Number").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Loads_Number").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,1,12);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Loads_Number").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Perc_Apparent_Power").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Perc_Apparent_Power").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Perc_Apparent_Power").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Perc_Apparent_Power").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,100);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Perc_Apparent_Power").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Thrshold_Energy").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Thrshold_Energy").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Thrshold_Energy").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Thrshold_Energy").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Thrshold_Energy").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kwh_2").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kwh_2").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kwh_2").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kwh_2").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kwh_2").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kwh_3").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kwh_3").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kwh_3").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kwh_3").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kwh_3").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kwh_4").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kwh_4").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kwh_4").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kwh_4").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kwh_4").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kwh_5").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kwh_5").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kwh_5").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kwh_5").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kwh_5").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kwh_6").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kwh_6").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kwh_6").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kwh_6").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kwh_6").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kva_1").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kva_1").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kva_1").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kva_1").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kva_1").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kva_2").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kva_2").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kva_2").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kva_2").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kva_2").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kva_3").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kva_3").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kva_3").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kva_3").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kva_3").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kva_4").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kva_4").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kva_4").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kva_4").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kva_4").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kva_5").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kva_5").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kva_5").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kva_5").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kva_5").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kva_6").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kva_6").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kva_6").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kva_6").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kva_6").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Thr_General_Power_0").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Thr_General_Power_0").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Thr_General_Power_0").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Thr_General_Power_0").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Thr_General_Power_0").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Thr_General_Power_1").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Thr_General_Power_1").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Thr_General_Power_1").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Thr_General_Power_1").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Thr_General_Power_1").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Thr_General_Power_2").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Thr_General_Power_2").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Thr_General_Power_2").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Thr_General_Power_2").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Thr_General_Power_2").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Thr_General_Power_3").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Thr_General_Power_3").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Thr_General_Power_3").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Thr_General_Power_3").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Thr_General_Power_3").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kw_5").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kw_5").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kw_5").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kw_5").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kw_5").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=width="9%" align=right><B><%=CurrUnit.getVariable("Threshold_kw_6").getRefreshableValue()%></TD>
				<TD class=width="9%" align=left><NOBR><%=CurrUnit.getVariable("Threshold_kw_6").getMUnit()%></NOBR></TD>
				<TD class=width="9%" align=center>
				<INPUT NAME="<%=CurrUnit.getVariable("Threshold_kw_6").getPostName()%>" 
					   id="<%=CurrUnit.getVariable("Threshold_kw_6").getPostName()%>" 
					   onkeydown="checkOnlyAnalog(this,event);" 
					   onblur="sdk_checkMinMaxValue(this,0,32767);checkOnlyAnalogOnBlur(this);" class='lswtype' type="text" size="5"/>
				</TD>
				<TD><%=CurrUnit.getVariable("Threshold_kw_6").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=colspan="2" align=center>
					<%=enable%><input type="radio"  name="<%=CurrUnit.getVariable( "En_Power_Cut").getPostName()%>" id="<%=CurrUnit.getVariable("En_Power_Cut").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Power_Cut").getValue() )?"checked":"" %> value="1"/>
				</TD>
				<TD class=width="9%" align=center>
					<%=disable%><input type="radio" name="<%=CurrUnit.getVariable( "En_Power_Cut").getPostName()%>" id="<%=CurrUnit.getVariable("En_Power_Cut").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Power_Cut").getValue() )?"checked":"" %> value="0"/>
				</TD>
				<TD><%=CurrUnit.getVariable("En_Power_Cut").getDescription()%></TD>
			</TR>
			<TR class="Row2" height="30px">
				<TD class=colspan="2" align=center>
					<%=enable%><input type="radio"  name="<%=CurrUnit.getVariable( "En_App_Power_Cut").getPostName()%>" id="<%=CurrUnit.getVariable("En_App_Power_Cut").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_App_Power_Cut").getValue() )?"checked":"" %> value="1"/>
				</TD>
				<TD class=width="9%" align=center>
					<%=disable%><input type="radio" name="<%=CurrUnit.getVariable( "En_App_Power_Cut").getPostName()%>" id="<%=CurrUnit.getVariable("En_App_Power_Cut").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_App_Power_Cut").getValue() )?"checked":"" %> value="0"/>
				</TD>
				<TD><%=CurrUnit.getVariable("En_App_Power_Cut").getDescription()%></TD>
			</TR>
			<TR class="Row1" height="30px">
				<TD class=colspan="2" align=center>
					<%=enable%><input type="radio"  name="<%=CurrUnit.getVariable( "En_Energy_Cut").getPostName()%>" id="<%=CurrUnit.getVariable("En_Energy_Cut").getPostName()%>"  <%="1".equals(  CurrUnit.getVariable("En_Energy_Cut").getValue() )?"checked":"" %> value="1"/>
				</TD>
				<TD class=width="9%" align=center>
					<%=disable%><input type="radio" name="<%=CurrUnit.getVariable( "En_Energy_Cut").getPostName()%>" id="<%=CurrUnit.getVariable("En_Energy_Cut").getPostName()%>"  <%="0".equals(  CurrUnit.getVariable("En_Energy_Cut").getValue() )?"checked":"" %> value="0"/>
				</TD>
				<TD><%=CurrUnit.getVariable("En_Energy_Cut").getDescription()%></TD>
			</TR>
			
			
		</table>
</table>
</div>