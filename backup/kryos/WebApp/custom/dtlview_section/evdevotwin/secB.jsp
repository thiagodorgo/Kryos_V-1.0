<%@ page language="java" pageEncoding="UTF-8" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
	import="com.carel.supervisor.presentation.session.UserSession"
	import="com.carel.supervisor.presentation.session.UserTransaction"
	import="com.carel.supervisor.dataaccess.language.LangService"
	import="com.carel.supervisor.dataaccess.language.LangMgr"
	import="com.carel.supervisor.field.FieldConnectorMgr"
	import="com.carel.supervisor.field.dataconn.impl.DataConnCAREL"
	import="com.carel.supervisor.field.types.ExtUnitInfoT"
	import="com.carel.supervisor.base.log.Logger"
	import="com.carel.supervisor.base.log.LoggerMgr"
%>

<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>

<%
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(), request);
	UserTransaction ut = sessionUser.getCurrentUserTransaction();
	String language = sessionUser.getLanguage();
	LangService lang = LangMgr.getInstance().getLangService(language);
	
	String label = "devHwCode";
	String devCode = "evdevotwin";
	
	String devGblIdx = null;
	String devHwCode = null;
	Integer gblDevice = null;
	
	int gblidx = 0;
	int hwCode = -1;
	
	int devStatus = 0;
	String modelTitle = lang.getString(devCode, "modelTitle");
	
	//cerco se hardwareCode è già settato in sessione utente (formato: <iddevice>.<hwCode>):
	if ((ut.getProperty(label) != null) && (!"".equals(ut.getProperty(label))))
	{
		devHwCode = ut.getProperty(label);
		String[] strDevIdx = devHwCode.split("\\.");
		
		//ctrl che sia il globalindex del device corrente:
		if ((strDevIdx.length == 2) && (Integer.parseInt(strDevIdx[0]) == CurrUnit.getId()))
		{
			hwCode = Integer.parseInt(strDevIdx[1]);
		}
	}
	
	//se no, lo recupero da CurrUnit:
	if (hwCode == -1)
	{
		gblDevice = CurrUnit.getGblIdx();
		
		if (gblDevice != null)
		{
			gblidx = gblDevice.intValue();
			
			try
			{
				DataConnCAREL dataconn = ((DataConnCAREL)FieldConnectorMgr.getInstance().getDataCollector().getDataConnector("CAREL"));
				ExtUnitInfoT extUnitInfoT = null;
				extUnitInfoT = dataconn.getPeriphericalInfoEx((short)gblidx);
				hwCode = extUnitInfoT.getHwCode(); //hardware code del device
				//devStatus = CurrUnit.getStatus();
				
				//poi, lo setto in sessione utente (formato: <iddevice>.<hwCode>) per evitare di ri-eseguire la query:
				ut.setProperty(label, CurrUnit.getId()+"."+hwCode);
			}
			catch (Exception e)
			{
				Logger logger = LoggerMgr.getLogger(this.getClass());
		        logger.error(e);
			}
		}
	}
	
	devStatus = CurrUnit.getStatus();
	String model = "***";
	
	if (devStatus != 0)
	{
		if ((lang.getString(devCode, Integer.toString(hwCode)) != null) && (!"".equals(lang.getString(devCode, Integer.toString(hwCode)))))
		{
			model = lang.getString(devCode, Integer.toString(hwCode));
		}
	}
%>

<div class="tdfisa">
	<%=modelTitle%>
</div>
<div class="tdfisa">
	<%= "<b>" + model + "</b>"%>
</div>
