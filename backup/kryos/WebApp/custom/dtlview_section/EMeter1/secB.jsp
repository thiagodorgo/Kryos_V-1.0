<%@page import="com.carel.supervisor.presentation.session.UserSession"%>
<%@ page language="java" 
	import="com.carel.supervisor.presentation.helper.ServletHelper"
	import="com.carel.supervisor.dataaccess.language.*"
	import="com.carel.supervisor.plugin.energy.*"
	import="java.util.*"
	import="org.jfree.data.category.DefaultCategoryDataset"
%>
<jsp:useBean id="CurrUnit" class="com.carel.supervisor.presentation.sdk.obj.CurrUnit" scope="session"/>
<%
	UserSession us = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	LangService lang = LangMgr.getInstance().getLangService(us.getLanguage());

	EnergyMgr emgr = EnergyMgr.getInstance();
	if( emgr.getRunning() ) {
		EnergyConfiguration ecfg = emgr.getSiteConfiguration();
		Integer numgrp = emgr.getIntegerProperty(EnergyConfiguration.NUMGROUPS, 10);
		Integer numconsumer = EnergyMgr.getInstance().getIntegerProperty(EnergyConfiguration.NUMCONSUMERS, 10);

		int idMeter = CurrUnit.getId();
		EnergyConsumer ecMeter = emgr.consumerLookup(idMeter);
		
		// show special fields only if the meter it is configured on energy plugin
		if( ecMeter != null ) {
			EnergyReport report = null;
			EnergyReportRecord record = null;
			String strReportTag = ecMeter.getIdgroup() == -1 && ecMeter.getIdconsumer() == -1
			? "site"
			: "cons" + ecMeter.getIdgroup() + "." + ecMeter.getIdconsumer();
			String[] astrDayNames = { "",
				lang.getString("cal", "mon"),
				lang.getString("cal", "tue"),
				lang.getString("cal", "wed"),
				lang.getString("cal", "thu"),
				lang.getString("cal", "fri"),
				lang.getString("cal", "sat"),
				lang.getString("cal", "sun")
			};
			
			// daily report
			report = ecMeter.getIdgroup() == -1 && ecMeter.getIdconsumer() == -1
				? emgr.getDailyReport(us.getLanguage())
				: emgr.getConsDailyReport(ecMeter.getIdgroup(), ecMeter.getIdconsumer(),us.getLanguage());
			record = report.getReportRecord(strReportTag);
			String strDailyKWh = record.getKwh().equals(Float.NaN) ? "***" : EGUtils.formatkwh(record.getKwh());
			
			// current week report
			Long timestamp = System.currentTimeMillis();
			GregorianCalendar cal = new GregorianCalendar();
			cal.setMinimalDaysInFirstWeek(4);
			cal.setFirstDayOfWeek(Calendar.MONDAY);
			int nWeek = cal.get(Calendar.WEEK_OF_YEAR);
			int nYear = cal.get(Calendar.YEAR);			
			report = ecMeter.getIdgroup() == -1 && ecMeter.getIdconsumer() == -1
				? emgr.getWeeklyReport(nWeek,us.getLanguage())
				: emgr.getConsWeeklyReport(nWeek, ecMeter.getIdgroup(), ecMeter.getIdconsumer(), nYear,us.getLanguage());
			record = report.getReportRecord(strReportTag);
			String strCurrentWeekKWh = record.getKwh().equals(Float.NaN) ? "***" : EGUtils.formatkwh(record.getKwh());
			DefaultCategoryDataset dsCurrentWeek = new DefaultCategoryDataset();
			us.getCurrentUserTransaction().setAttribute("cw" + timestamp, dsCurrentWeek);
			for(int i = 1; i <= report.getIntervalsNumber(); i++) {
				record = report.getReportRecord("d" + i + "." + strReportTag);
				dsCurrentWeek.addValue(record.getKwh(), record.getName(), astrDayNames[i]);
			}
					
			// previous week report
			report = ecMeter.getIdgroup() == -1 && ecMeter.getIdconsumer() == -1
				? emgr.getWeeklyReport(nWeek - 1,us.getLanguage())
				: emgr.getConsWeeklyReport(nWeek - 1, ecMeter.getIdgroup(), ecMeter.getIdconsumer(), nYear,us.getLanguage());
			record = report.getReportRecord(strReportTag);
			String strPreviousWeekKWh = record.getKwh().equals(Float.NaN) ? "***" : EGUtils.formatkwh(record.getKwh());
			DefaultCategoryDataset dsPreviousWeek = new DefaultCategoryDataset();
			us.getCurrentUserTransaction().setAttribute("pw" + timestamp, dsPreviousWeek);
			for(int i = 1; i <= report.getIntervalsNumber(); i++) {
				record = report.getReportRecord("d" + i + "." + strReportTag);
				dsPreviousWeek.addValue(record.getKwh(), record.getName(), astrDayNames[i]);
			}
%>
<div class="col-xs-12">
	<div class="panel panel-default">
		<div class="panel-heading nolpadding vpadding">
			<a class="btn btn-default" data-toggle="collapse" href="#collapse4">
				<span id="icon_collapse4" class="glyphicon glyphicon-triangle-bottom"></span>
			</a>
			<%=lang.getString("energy", "tab1name")%>
		</div>
		<div id="collapse4" class="panel-collapse collapse in">
		<div class="panel-body nopadding novpadding">
			<table id="energyDashboard" class="table table-bordered table-striped table-hover noselect">
   				<thead class="header-floatThead">
    				<tr id="div_head">
        				<th class="col-xs-2 text-center" colspan=2><%=lang.getString("dtlview", "detaildevicecol0")%></th>
        				<th class="col-xs-10 text-center"><%=lang.getString("dtlview", "detaildevicecol3")%></th>
					</tr>
   				</thead>
   				<tbody id="div_body">
   					<tr>
   						<td class="col-xs-1 text-right"><%=strDailyKWh%></td>
   						<td class="col-xs-1">kWh</td>
   						<td><%=lang.getString("energy", "active_energy")%> - <%=lang.getString("energy", "current_day")%><div class='clr'></div></td>
   					</tr>
   					<tr>
   						<td class="col-xs-1 text-right"><%=strCurrentWeekKWh%></td>
   						<td  class="col-xs-1">kWh</td>
   						<td><div class="col-xs-4 nopadding" style="padding-top:30px;"><%=lang.getString("energy", "active_energy")%> - <%=lang.getString("energy", "current_week")%></div><div class="col-xs-6"><img src="SRVLCharts?charttype=smallbarchart&width=290&height=80&imgid=cw<%=timestamp%>"></div></td>
   					</tr>
   					<tr>
   						<td class="col-xs-1 text-right"><%=strPreviousWeekKWh%></td>
   						<td class="col-xs-1">kWh</td>
   						<td><div class="col-xs-4 nopadding" style="padding-top:30px;"><%=lang.getString("energy", "active_energy")%> - <%=lang.getString("energy", "previous_week")%></div><div class="col-xs-6"><img src="SRVLCharts?charttype=smallbarchart&width=290&height=80&imgid=pw<%=timestamp%>"></div></td>
   					</tr>
   				</tbody>
  			</table>
		</div>
		</div>
	</div>
</div>

<%} // if( emgr.getRunning() )
} // if( ecMeter != null )
%>
