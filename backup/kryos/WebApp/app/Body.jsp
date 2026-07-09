<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page language="java" import="com.carel.supervisor.presentation.session.*"%>
<%@ page language="java" import="com.carel.supervisor.presentation.helper.*" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	UserSession sessionUser = ServletHelper.retrieveSession(request.getRequestedSessionId(),request);
	String browser = sessionUser.getUserBrowser();
%>
<html>
<head>
	<base href="<%=basePath%>">
  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="cache-control" content="no-cache">
  <meta http-equiv="expires" content="0">
</head>
<body bgcolor="#000000">
<table border="0" width="100%" cellspacing="0" cellpadding="0">
	<tr>
		<td height="40px" width="100%" align="right" valign="top">
			<div style="background-image:url(images/tab/tabbar1.png); background-repeat:repeat-x;">&nbsp;</div>
            <div style="background-image:url(images/tab/tabbar2.png); background-repeat:repeat-x;">&nbsp;</div>
	    </td>
	</tr>
</table>
</body>
</html>
