<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="org.siemac.metamac.core.common.util.InternationalizationUtils" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page import="org.apache.commons.lang.LocaleUtils" %>
<%@ page import="static java.util.ResourceBundle.Control.getNoFallbackControl" %>
<%@ page import="org.siemac.metamac.core.common.util.MessagesResourceBundle"%>
<%@page import="java.util.regex.Matcher" %>
<%@page import="java.util.regex.Pattern"%>

<!DOCTYPE html>
<%
	String EXPORT_API_NAME       = "export";
	String PERMALINKS_API_NAME   = "permalinks";

    String internationalizationCookie = InternationalizationUtils.getInstance().getInternationalizationCookieId();
    String locale = InternationalizationUtils.getInstance().getCurrentLocale(request);
    String appName = "";
    String appNameExport =  ResourceBundle.getBundle("i18n.export.messages" , LocaleUtils.toLocale(locale), getNoFallbackControl(ResourceBundle.Control.FORMAT_DEFAULT)).getString("app.name");
    String appNamePermalinks = ResourceBundle.getBundle("i18n.permalinks.messages" , LocaleUtils.toLocale(locale), getNoFallbackControl(ResourceBundle.Control.FORMAT_DEFAULT)).getString("app.name");
    MessagesResourceBundle messagesResource = new MessagesResourceBundle(locale, "i18n.permalinks.messages");
    pageContext.setAttribute("msg", messagesResource);
    String appVersion = ResourceBundle.getBundle("application").getString("app.version");
    
    Pattern pattern = Pattern.compile(".*/(?:(" + EXPORT_API_NAME + "|" + PERMALINKS_API_NAME + "))(?:/.*)?", Pattern.CASE_INSENSITIVE);
    String requestHeaderUrl = request.getHeader("referer");
    Matcher matcher = pattern.matcher(requestHeaderUrl);
    if (matcher.matches() && matcher.groupCount() >= 0) {
    	String currentApi = matcher.group(1);
    	if (currentApi.equals(EXPORT_API_NAME)) {
  	  		appName =  appNameExport;
	    } else if ((currentApi.equals(PERMALINKS_API_NAME))) {
	        appName =  appNamePermalinks;
	    }
    }
 %>
<html>
<head>
  <meta charset="UTF-8">
  <title>${msg['api.doc.swagger.headerTitle']}</title>
  <link href="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/css/typography.css" media='screen' rel='stylesheet' type='text/css'/>
  <link href="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/css/reset.css" media='screen' rel='stylesheet' type='text/css'/>
  <link href="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/css/screen.css" media='screen' rel='stylesheet' type='text/css'/>
  <link href="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/css/reset.css" media='print' rel='stylesheet' type='text/css'/>
  <link href="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/css/print.css" media='print' rel='stylesheet' type='text/css'/>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/jquery-1.8.0.min.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/jquery.slideto.min.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/jquery.wiggle.min.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/jquery.ba-bbq.min.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/handlebars-2.0.0.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/underscore-min.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/backbone-min.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/swagger-ui.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/highlight.7.3.pack.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/jsoneditor.min.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/marked.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lib/swagger-oauth.js" type='text/javascript'></script>

  <!-- Some basic translations -->
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lang/translator.js" type='text/javascript'></script>
  <script src="<%=org.siemac.metamac.core.common.util.swagger.SwaggerUtils.getResourceBaseURL(request)%>/swagger-ui/lang/<%= locale %>.js" type='text/javascript'></script>
  
  <style>
    .swagger-section .swagger-ui-wrap table.fullwidth {
        table-layout: fixed;
    }
    .swagger-section .swagger-ui-wrap table.fullwidth pre {
        overflow: auto;
    }
  </style>
  
  <script type="text/javascript">
    $(function () {
      var url = window.location.search.match(/url=([^&]+)/);
      if (url && url.length > 1) {
        url = decodeURIComponent(url[1]);
      } else {
    	  var baseUrl = document.location.href;
          //this removes the anchor at the end, if there is one
          baseUrl = baseUrl.substring(0, (baseUrl.indexOf("#") == -1) ? baseUrl.length : baseUrl.indexOf("#"));
          //this removes the query after the file name, if there is one
          baseUrl = baseUrl.substring(0, (baseUrl.indexOf("?") == -1) ? baseUrl.length : baseUrl.indexOf("?"));
          //this removes everything after the last slash in the path
          baseUrl = baseUrl.substring(0, (baseUrl.lastIndexOf("/") == -1) ? baseUrl.length : baseUrl.lastIndexOf("/"));

          url = baseUrl + "/swagger.jsp";
      }

      // Pre load translate...
      if(window.SwaggerTranslator) {
        window.SwaggerTranslator.translate();
      }
      window.swaggerUi = new SwaggerUi({
        url: url,
        dom_id: "swagger-ui-container",
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        onComplete: function(swaggerApi, swaggerUi){
          if(typeof initOAuth == "function") {
            initOAuth({
              clientId: "your-client-id",
              clientSecret: "your-client-secret-if-required",
              realm: "your-realms",
              appName: "your-app-name", 
              scopeSeparator: ",",
              additionalQueryStringParams: {}
            });
          }

          if(window.SwaggerTranslator) {
            window.SwaggerTranslator.translate();
          }

          $('pre code').each(function(i, e) {
            hljs.highlightBlock(e)
          });

        },
        onFailure: function(data) {
          log("Unable to Load SwaggerUI");
        },
        docExpansion: "none",
        jsonEditor: false,
        apisSorter: "alpha",
        defaultModelRendering: 'model',
        showRequestHeaders: false
      });

      window.swaggerUi.load();

      function log() {
        if ('console' in window) {
          console.log.apply(console, arguments);
        }
      }
  });
  </script>
</head>
<body>
	<c:set var="appStyleHeaderUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getAppStyleHeaderUrl()%>" />
	<c:set var="appStyleFooterUrl" value="<%=org.siemac.metamac.portal.web.diffusion.WebUtils.getAppStyleFooterUrl()%>" />
	
	<c:if test="${!empty appStyleHeaderUrl}">
		<c:import charEncoding="UTF-8" url="${appStyleHeaderUrl}">
			<c:param name="appName" value="<%= appName %>" />
    		<c:param name="<%= internationalizationCookie %>" value="<%= locale %>" />
    		<c:param name="appVersion" value="<%= appVersion %>" />
		</c:import>
	</c:if>
	
	<div class="content-wrapper edatos-wrapper edatos-swagger">
		<div class="swagger-section">
			<div id="message-bar" class="swagger-ui-wrap" data-sw-translate>&nbsp;</div>
			<div id="swagger-ui-container" class="swagger-ui-wrap"></div>
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
