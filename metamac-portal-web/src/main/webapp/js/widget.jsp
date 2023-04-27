<%@ page contentType="text/javascript"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page import="org.siemac.metamac.portal.core.conf.PortalConfiguration"%>
<%@ page import="org.siemac.metamac.core.common.exception.MetamacException"%>
<%@ page import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%>
<c:set var="requestURL">${pageContext.request.requestURL}</c:set>
<c:set var="baseURL" value="${fn:replace(requestURL, pageContext.request.requestURI, pageContext.request.contextPath)}" />
 <%
    PortalConfiguration configurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
    try { 
        request.setAttribute("analyticsGoogleTrackingId", configurationService.retrieveAnalyticsGoogleTrackingId());            
    } catch (MetamacException e) {             
        request.setAttribute("analyticsGoogleTrackingId", "error");
    }
%>

// Copyright (c) 2009 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

function getWidgetUrl(options) {	
	var endpoint = "${baseURL}/widget.html";
	var params = '';
	params += options.sharedVisualizerUrl ? 'sharedVisualizerUrl=' + options.sharedVisualizerUrl + '&' : '';
	params += options.locale ? 'locale=' + options.locale + '&' : '';
	params += options.title ? 'title=' + encodeURIComponent(JSON.stringify(options.title)) + '&' : '';
 	return endpoint + '?' + params + options.params;
}


function appendIframe(options) {
	var src = getWidgetUrl(options);
	var width = options.width || '100%';	
	var height = options.height || '100%';	
	
	var iframe = '<iframe id="' + options.id + '-iframe" allowfullscreen="" ';
	iframe += 'src="' + src + '"'; 
	iframe += 'width="' + width + '" height="' + height + '" frameborder="0"></iframe>';

	document.getElementById(options.id).innerHTML = iframe;
}

function datasetWidget(options) {
	appendIframe(options);
    sendToAnalytics(options);
}

function sendToAnalytics(options) {
    ga('create', '${analyticsGoogleTrackingId}', {'alwaysSendReferrer': true});
    ga('set', 'referrer', window.location.href);
    ga('set', 'location', getWidgetUrl(options));
    ga('send', 'pageview');
}
    
