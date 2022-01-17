<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ attribute name="baseURL" required="true" rtexprvalue="true" %>
<%@ tag description="Simple Wrapper Tag" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<html>
<head>
  <!-- Title y metas -->
	<t:metamac_title_meta></t:metamac_title_meta>

	<c:choose>    
		<c:when test="${!empty portalStyleCssUrl}">
			<link href="<c:out value='${portalStyleCssUrl}'/>" rel='stylesheet' type='text/css' />
		</c:when>
		<c:otherwise>			
			<!-- portalStyleCssUrl is empty -->
		</c:otherwise>
	</c:choose>
</head>
<body>

	<!-- begin: #cabecera -->
    <c:choose>    	
        <c:when test="${!empty portalStyleHeaderUrl}">
			<div id="portal-style-header"></div>
        </c:when>
        <c:otherwise>
			<!-- portalStyleHeaderUrl is empty -->
        </c:otherwise>           
	</c:choose>
        
	<!-- end: #cabecera -->

	<!-- begin: #bloq_interior -->	
	<div id="bloq_interior">	
		<!-- begin: CONTENIDO CENTRAL --> 
		<div class="contenido">
			<jsp:doBody/>
		</div>	
		<!-- end:COLUMNA CENTRAL -->
	</div>
	<!-- end: #bloq_interior -->
		
	<!-- begin: pie -->
    <c:choose>      
        <c:when test="${!empty portalStyleFooterUrl}">
            <c:import charEncoding="UTF-8" url="${portalStyleFooterUrl}" />
        </c:when>
        <c:otherwise>			
			<!-- portalStyleFooterUrl is empty -->
        </c:otherwise>
    </c:choose>    
	<!-- end: pie -->       
    
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    
      ga('create', '${analyticsGoogleTrackingId}', 'auto');
      ga('send', 'pageview');

	  fetch("${portalStyleHeaderUrl}", {
		  method: 'GET',
		  credentials: 'include'
	  })
	  .then(response => response.text())
	  .then(data => {
		  document.getElementById("portal-style-header").innerHTML = data;
		  const headerScriptList = document.getElementById("portal-style-header").getElementsByTagName('script');
		  let scriptCurrentlyLoading = -1;
		  const reloadNextScript = function () {
			  scriptCurrentlyLoading++;
			  if (scriptCurrentlyLoading < headerScriptList.length) {
				  const currentScript = headerScriptList[scriptCurrentlyLoading];
				  const scriptCopy = document.createElement('script');
				  scriptCopy.onload = reloadNextScript;
				  if (currentScript.innerHTML) {
					  scriptCopy.innerHTML = currentScript.innerHTML;
				  } else if (currentScript.src) {
					  scriptCopy.src = currentScript.src;
				  }
				  scriptCopy.async = false;
				  currentScript.parentNode.replaceChild(scriptCopy, currentScript);
			  }
		  };
		  reloadNextScript();
	  });
    </script>
</body>
</html>