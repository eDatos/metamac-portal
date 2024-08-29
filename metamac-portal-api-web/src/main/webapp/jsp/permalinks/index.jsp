<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="org.siemac.metamac.core.common.util.InternationalizationUtils" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page import="org.apache.commons.lang.LocaleUtils" %>
<%@ page import="static java.util.ResourceBundle.Control.getNoFallbackControl" %>
<!DOCTYPE html>
<%
    String internationalizationCookie = InternationalizationUtils.getInstance().getInternationalizationCookieId();
    String locale = InternationalizationUtils.getInstance().getCurrentLocale(request);
    ResourceBundle rs = ResourceBundle.getBundle("i18n.permalinks.messages" , LocaleUtils.toLocale(locale), getNoFallbackControl(ResourceBundle.Control.FORMAT_DEFAULT));
    String appName = rs.getString("apps.api_catalog.name");
%>
<html>
<head>
  <meta charset="UTF-8">
  <title><%=rs.getString("app.name") %></title>
 
  <link href="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getFavicon()%>" rel="shortcut icon"/>
  
  <c:set var="apiStyleCssUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getApiStyleCssUrl()%>" />

  <c:if test="${!empty apiStyleCssUrl}">
    <link href="<c:out value='${apiStyleCssUrl}'/>" media='screen' rel='stylesheet' type='text/css' />
  </c:if>
  
</head>
<body>
    <c:set var="apiStyleHeaderUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getApiStyleHeaderUrl()%>" />
    <c:set var="apiStyleFooterUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getApiStyleFooterUrl()%>" />
    
    <c:set var="permalinksApiBaseURL" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getPermalinksApiBaseURL()%>" />
    
    <c:if test="${!empty apiStyleHeaderUrl}">
    	<c:import charEncoding="UTF-8" url="${apiStyleHeaderUrl}">
    		<c:param name="appName" value="<%= appName %>" />
    		<c:param name="<%= internationalizationCookie %>" value="<%= locale %>" />
    		<c:param name="appId" value="permalinks"/>
    	</c:import>
    </c:if>
    
    <div class="version-list">
       <h1><%=rs.getString("api.doc.title") %></h1>
       <h2><%=rs.getString("api.doc.versions") %></h2>
       <ul>
           <li>
               <h3 class="version-title"><a href="${permalinksApiBaseURL}/latest">/latest</a></h3>
               <div class="version-description">
                   <p><strong>latest</strong> <%=rs.getString("api.doc.latest") %></p>
               </div>
           </li>
           
           <li>
               <h3 class="version-title"><a href="${permalinksApiBaseURL}/v1.0">/v1.0</a></h3>
               <div class="version-description">
                    <p><%=rs.getString("api.doc.version.1_0") %></p>
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
