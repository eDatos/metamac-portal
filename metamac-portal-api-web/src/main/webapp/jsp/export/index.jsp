<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="org.siemac.metamac.core.common.util.InternationalizationUtils" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page import="org.apache.commons.lang.LocaleUtils" %>
<%@ page import="static java.util.ResourceBundle.Control.getNoFallbackControl" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<%
    String internationalizationCookie = InternationalizationUtils.getInstance().getInternationalizationCookieId();
    String locale = InternationalizationUtils.getInstance().getCurrentLocale(request);
    String appName = ResourceBundle.getBundle("i18n.export.messages" , LocaleUtils.toLocale(locale), getNoFallbackControl(ResourceBundle.Control.FORMAT_DEFAULT)).getString("app.name");
%>
<fmt:setLocale value="<%= locale %>"/>
<fmt:setBundle basename="i18n.export.messages" var="i18n"/>
<fmt:bundle basename="application"/>
<html>
<head>
  <meta charset="UTF-8">
  <title><fmt:message key="app.doc.title" bundle="${i18n}"/></title>
 
  <link href="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getFavicon()%>" rel="shortcut icon"/>

</head>
<body>
    <c:set var="apiStyleHeaderUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getApiStyleHeaderUrl()%>" />
    <c:set var="apiStyleFooterUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getApiStyleFooterUrl()%>" />
    
    <c:set var="exportApiBaseURL" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getExportApiBaseURL()%>" />
    
    <c:if test="${!empty apiStyleHeaderUrl}">
    	<c:import charEncoding="UTF-8" url="${apiStyleHeaderUrl}">
    	<c:param name="appName" value="<%= appName %>" />
    		<c:param name="<%= internationalizationCookie %>" value="<%= locale %>" />
    		<c:param name="appId" value="export"/>
    	</c:import>
    </c:if>
    
    <div class="version-list">
       <h1><fmt:message key="api.doc.title" bundle="${i18n}"/></h1>
       <h2><fmt:message key="api.doc.versions" bundle="${i18n}"/></h2>
       <ul>
           <li>
               <h3 class="version-title"><a href="${exportApiBaseURL}/latest">/latest</a></h3>
               <div class="version-description">
                   <p><strong>latest</strong><fmt:message key="api.doc.latest" bundle="${i18n}"/></p>
               </div>
           </li>
           
           <li>
               <h3 class="version-title"><a href="${exportApiBaseURL}/v1.0">/v1.0</a></h3>
               <div class="version-description">
                    <p><fmt:message key="api.doc.version.1_0" bundle="${i18n}"/></p>
               </div>
           </li>
       </ul>
   </div>

    <c:if test="${!empty apiStyleFooterUrl}">
    	<c:import charEncoding="UTF-8" url="${apiStyleFooterUrl}">
    		<c:param name="appName" value="<%= appName %>" />
    		<c:param name="<%= internationalizationCookie %>" value="<%= locale %>" />
    	</c:import>
    </c:if>
</body>
</html>
