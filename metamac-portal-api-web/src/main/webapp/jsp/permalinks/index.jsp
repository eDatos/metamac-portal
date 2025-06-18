<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="org.siemac.metamac.core.common.util.InternationalizationUtils" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page import="org.apache.commons.lang.LocaleUtils" %>
<%@ page import="static java.util.ResourceBundle.Control.getNoFallbackControl" %>
<%@ page import="org.siemac.metamac.core.common.util.MessagesResourceBundle"%>
<!DOCTYPE html>
<%
    String internationalizationCookie = InternationalizationUtils.getInstance().getInternationalizationCookieId();
    String locale = InternationalizationUtils.getInstance().getCurrentLocale(request);
    String appName = ResourceBundle.getBundle("i18n.permalinks.messages" , LocaleUtils.toLocale(locale), getNoFallbackControl(ResourceBundle.Control.FORMAT_DEFAULT)).getString("app.name");
    MessagesResourceBundle messagesResource = new MessagesResourceBundle(locale, "i18n.permalinks.messages");
    pageContext.setAttribute("msg", messagesResource);
    String appVersion = ResourceBundle.getBundle("application").getString("app.version");
%>
<html>
<head>
  <meta charset="UTF-8">
  <title>${msg['api.doc.title']}</title>
 
  <link href="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getFavicon()%>" rel="shortcut icon"/>

</head>
<body>
    <c:set var="appStyleHeaderUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getAppStyleHeaderUrl()%>" />
    <c:set var="appStyleFooterUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getAppStyleFooterUrl()%>" />
    
    <c:set var="permalinksApiBaseURL" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getPermalinksApiBaseURL()%>" />
    
    <c:if test="${!empty appStyleHeaderUrl}">
    	<c:import charEncoding="UTF-8" url="${appStyleHeaderUrl}">
    		<c:param name="appName" value="<%= appName %>" />
    		<c:param name="<%= internationalizationCookie %>" value="<%= locale %>" />
    		<c:param name="appId" value="permalinks"/>
    		<c:param name="appVersion" value="<%= appVersion %>" />
    	</c:import>
    </c:if>
    
    <div class="content-wrapper edatos-wrapper edatos-swagger">
	    <div class="version-list">
	       <h1>${msg['api.doc.title']}</h1>
	       <h2>${msg['api.doc.versions']}</h2>
	       <ul>
	           <li>
	               <h3 class="version-title"><a href="${permalinksApiBaseURL}/latest">/latest</a></h3>
	               <div class="version-description">
	                   <p><strong>latest</strong> ${msg['api.doc.latest']}</p>
	               </div>
	           </li>
	           
	           <li>
	               <h3 class="version-title"><a href="${permalinksApiBaseURL}/v1.0">/v1.0</a></h3>
	               <div class="version-description">
	                    <p>${msg['api.doc.version.1_0']}</p>
	               </div>
	           </li>
	       </ul>
	   </div>
   </div>

    <c:if test="${!empty appStyleFooterUrl}">
    	<c:import charEncoding="UTF-8" url="${appStyleFooterUrl}">
    		<c:param name="appName" value="<%= appName %>" />
    		<c:param name="<%= internationalizationCookie %>" value="<%= locale %>" />
    	</c:import>
    </c:if>
</body>
</html>
