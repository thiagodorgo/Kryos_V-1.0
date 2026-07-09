<%@ page language="java" 
	import="com.carel.supervisor.presentation.sdk.util.Sfera"
%>

<%@ page import="com.carel.supervisor.presentation.helper.ServletHelper" %>
<%@ page import="com.carel.supervisor.presentation.bean.rule.RelayBean" %>
<%@ page import="com.carel.supervisor.dataaccess.language.LangMgr" %>
<%@ page import="com.carel.supervisor.dataaccess.language.LangService" %>
<%@ page import="com.carel.supervisor.presentation.bean.rule.RelayBeanList" %>
<%@ page import="com.carel.supervisor.presentation.session.UserSession" %>
<%@ page import="com.carel.supervisor.presentation.profile.ProfileMapsBeanList" %>


<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<jsp:useBean id="pmbl" class="com.carel.supervisor.presentation.profile.ProfileMapsBeanList" scope="session"/>

<%
	CurrUnit.setCurrentSession(ServletHelper.retrieveSession(request.getRequestedSessionId(),request));
	CurrUnit.loadAlarms();
	
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	int idprofile = sessionUser.getProfile();
	boolean canIset = pmbl.isButtonEnable(idprofile, "dtlview","tab1name","subtab2name");
	
	
	String language = sessionUser.getLanguage();
	int idsite = sessionUser.getIdSite();
	
	LangService multiLanguage = LangMgr.getInstance().getLangService(language);
	
	String rel1_descr ="";
	String rel2_descr ="";
	String rel3_descr ="";	
	
	// initialization to '-1' set always 'off' status on led and button idicator in case of errors on page load
	// (if there are errors on internal io read/write operations) 
	int active1 = -1;
	int active2 = -1;
	int active3 = -1;
	int idle1 = -1;
	int idle2 = -1;
	int idle3 = -1;
	
	int idvarREL1 = -1;
	int idvarREL2 = -1;
	int idvarREL3 = -1;
	int idvarDI1 = -1;
	int idvarDI2 = -1;
	
	boolean isRel1Active = false;
	boolean isRel2Active = false;
	boolean isRel3Active = false;
	
	String rel_cmd1 = multiLanguage.getString("relaymgr","command1");
	String rel_cmd2 = multiLanguage.getString("relaymgr","command2");
	String rel_cmd3 = multiLanguage.getString("relaymgr","command3");
	
	String di1_descr = CurrUnit.getVariable("DI1").getDescription();
	String di2_descr = CurrUnit.getVariable("DI2").getDescription();
	String dev_descr = CurrUnit.getDescription();
	
	RelayBean [] relayList = RelayBeanList.getInternalIORelayBeans(idsite, language);
	
	for(int i=0; i<relayList.length; i++)
	{
		// idrelay of relay n°1 is always '-1'
		if(((RelayBean)relayList[i]).getIdrelay() == -1)
		{
			idvarREL1 = ((RelayBean)relayList[i]).getIdvariable();
			active1 = ((RelayBean)relayList[i]).getActivestate();
			idle1 = active1==1?0:1;
			rel1_descr = ((RelayBean)relayList[i]).getDescription();
		}
		
		// idrelay of relay n°2 is always '-2'
		if(((RelayBean)relayList[i]).getIdrelay() == -2)
		{
			idvarREL2 = ((RelayBean)relayList[i]).getIdvariable();
			active2 = ((RelayBean)relayList[i]).getActivestate();
			idle2 = active2==1?0:1;
			rel2_descr = ((RelayBean)relayList[i]).getDescription();
		}
		
		// idrelay of relay n°3 is always '-3'
		if(((RelayBean)relayList[i]).getIdrelay() == -3)
		{
			idvarREL3 = ((RelayBean)relayList[i]).getIdvariable();
			active3 = ((RelayBean)relayList[i]).getActivestate();
			idle3 = active3==1?0:1;
			rel3_descr = ((RelayBean)relayList[i]).getDescription();
		}
	}
	
	//get ids and vals of DI1 and DI2
	idvarDI1 = CurrUnit.getVariable("DI1").getId();
	idvarDI2 = CurrUnit.getVariable("DI2").getId();
	
	String di1val = CurrUnit.getVariable("DI1").getValue();
	String di2val = CurrUnit.getVariable("DI2").getValue();
	
	
	//get values of RELAYS status
	try
	{
		isRel1Active = (active1 == Integer.parseInt(CurrUnit.getVariable("DO1").getValue()));
		isRel2Active = (active2 == Integer.parseInt(CurrUnit.getVariable("DO2").getValue()));
		isRel3Active = (active3 == Integer.parseInt(CurrUnit.getVariable("DO3").getValue()));	
	}
	catch (Exception e)
	{
		// if values are not correctly retrieved 'isRelXXActive remains set to FALSE'
	}
%>

<input type="hidden" id="idvarDI1" name="idvarDI1" value=<%= idvarDI1 %> />
<input type="hidden" id="idvarDI2" name="idvarDI2" value=<%= idvarDI2 %> />
<input type="hidden" id="idvarREL1" name="idvarREL1" value=<%= idvarREL1 %> />
<input type="hidden" id="idvarREL2" name="idvarREL2" value=<%= idvarREL2 %> />
<input type="hidden" id="idvarREL3" name="idvarREL3" value=<%= idvarREL3 %> />

<script>

	
function SetButtonValue(nform)
{
	var oFrm = document.getElementById("frmdtlbtt"+nform);
	if(oFrm != null)
	{
		MTstartServerComm();
		oFrm.submit();
	}
}

</script>

<table border="0" width="100%" height="100%" cellpadding="1" cellspacing="1">
	<tr>
		<td width="10%"></td>
		<td>
			<table border="0" width="100%" height="100%">
				<tr height="20%	">
					<td colspan="2"><%= dev_descr%></td>
				</tr>

				<tr height="180px">
					<td width="68%"> 
						<div class="dashboard">
							
							<!-- rounded top -->
							<div class="topleftcorner"></div><div class="toprightcorner"></div>
							
							<div class="buttonDtlDeviceBox">
							<table border="0" width="100%" height="100%">
								<tr height="30px">
									<td align="center"><img src='images/pvpro20/internalIo/rele_w.gif'></td>
									<td align="center"><img src='images/pvpro20/internalIo/rele_w.gif'></td>
									<td align="center"><img src='images/pvpro20/internalIo/rele_w.gif'></td>
									<td align="center"><img src='images/pvpro20/internalIo/di_w.gif'></td>
									<td align="center"><img src='images/pvpro20/internalIo/di_w.gif'></td>
								</tr>
								<tr height="50px">
									<td width="16%" align="center"><font color="white" size="2"> <%= rel1_descr %> </font></td>
									<td width="14%" align="center"><font color="white" size="2"> <%= rel2_descr %> </font></td>
									<td width="14%" align="center"><font color="white" size="2"> <%= rel3_descr %> </font></td>
									<td width="11%" align="center"><font color="white" size="2"> <%= di1_descr %> </font></td>
									<td width="11%" align="center"><font color="white" size="2"> <%= di2_descr %> </font></td>
								</tr>
								<tr>
									<td colspan="3">
											<div <%= canIset?" class='commandBtnOn' onclick='SetButtonValue(0);' ":" class='commandBtnOff' " %>  style="width:33%">
												<form name="frmdtlbtt0" id="frmdtlbtt0" action="servlet/master;" method="post">
													<input type="hidden" id=<%="dtlst_"+idvarREL1%> name=<%="dtlst_"+idvarREL1%> value=<%=isRel1Active?idle1:active1%> />
													<img class='commandIconPos' id=<%="bttdtlst_"+idvarREL1%> src='images/button/relay.png' ></img>
													<div class='commandDescPos' ><%= rel_cmd1 %></div>
													<div class='commandLedPos'> <%=CurrUnit.getVariable("DO1").getRefreshableAssint("<img src='images/led/RectL0.png'>;<img src='images/led/RectL1.png'>","")%> </div>
												</form>
											</div>
											<div <%= canIset?" class='commandBtnOn' onclick='SetButtonValue(1);' ":" class='commandBtnOff' " %> style="width:33%">
												<form name="frmdtlbtt1" id="frmdtlbtt1" action="servlet/master;" method="post">
													<input type='hidden' id=<%="dtlst_"+idvarREL2%> name=<%="dtlst_"+idvarREL2%> value=<%=isRel2Active?idle2:active2%> />
													<img class='commandIconPos' id=<%="bttdtlst_"+idvarREL2%> src='images/button/relay.png' ></img>
													<div class='commandDescPos' ><%= rel_cmd2 %></div>
													<div class='commandLedPos'> <%=CurrUnit.getVariable("DO2").getRefreshableAssint("<img src='images/led/RectL0.png'>;<img src='images/led/RectL1.png'>","")%> </div>
												</form>
											</div>
											<div  <%= canIset?" class='commandBtnOn' onclick='SetButtonValue(2);' ":" class='commandBtnOff' " %> style="width:32%">
												<form name="frmdtlbtt2" id="frmdtlbtt2" action="servlet/master;" method="post">
													<input type='hidden' id=<%="dtlst_"+idvarREL3%> name=<%="dtlst_"+idvarREL3%> value=<%=isRel3Active?idle3:active3%> />
													<img class='commandIconPos' <%="bttdtlst_"+idvarREL3%> src='images/button/relay.png' ></img>
													<div class='commandDescPos' ><%= rel_cmd3 %></div>
													<div class='commandLedPos'> <%=CurrUnit.getVariable("DO3").getRefreshableAssint("<img src='images/led/RectL0.png'>;<img src='images/led/RectL1.png'>","")%> </div>
												</form>
											</div>
									</td>
									<td colspan="2">
										<div class="statVarLed" style="width:50%">
											<%=CurrUnit.getVariable("DI1").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","")%>
										</div>
										<div class="statVarLed" style="width:50%">
											<%=CurrUnit.getVariable("DI2").getRefreshableAssint("<img src='images/led/L0.gif'>;<img src='images/led/L1.gif'>","")%>
										</div>
									</td>
								</tr>
							</table>
							</div>
		
							<!-- rounded bottom -->
							<div class="bottomleftcorner"></div><div class="bottomrightcorner"></div>
						
						</div>
					</td>
					<td></td>
				</tr>
				<tr >
					<td colspan="2"></td>
				</tr>
			</table>
		</td>
	</tr>
</table>



