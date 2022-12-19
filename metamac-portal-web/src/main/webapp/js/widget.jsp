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
// - CFInstall
(function(e){if(!e.CFInstall){var f=function(a,b){return typeof a=="string"?(b||document).getElementById(a):a},h=function(){if(e.CFInstall._force)return e.CFInstall._forceValue;if(navigator.userAgent.toLowerCase().indexOf("chromeframe")>=0)return true;if(typeof window.ActiveXObject!="undefined")try{var a=new ActiveXObject("ChromeTab.ChromeFrame");if(a){a.registerBhoIfNeeded();return true}}catch(b){}return false},i=function(a){try{var b=document.createElement("style");b.setAttribute("type","text/css");
if(b.styleSheet)b.styleSheet.cssText=a;else b.appendChild(document.createTextNode(a));var c=document.getElementsByTagName("head")[0];c.insertBefore(b,c.firstChild)}catch(g){}},j=false,k=false,l=function(){if(!k){i(".chromeFrameOverlayContent { display: none; }.chromeFrameOverlayUnderlay { display: none; }");document.cookie="disableGCFCheck=1;path=/;max-age=31536000000";k=true}},m=function(a){var b=document.createElement("iframe");b.setAttribute("frameborder","0");b.setAttribute("border","0");var c=
f(a.node);b.id=a.id||(c?c.id||getUid(c):"");b.style.cssText=" "+(a.cssText||"");b.className=a.className||"";b.src=a.src||"about:blank";c&&c.parentNode.replaceChild(b,c);return b},n=function(a){a.className="chromeFrameInstallDefaultStyle "+(a.className||"");a=m(a);a.parentNode||document.body.insertBefore(a,document.body.firstChild)},o=function(a){if(!f("chromeFrameOverlayContent")){var b=document.createElement("span");b.innerHTML='<div class="chromeFrameOverlayUnderlay"></div><table class="chromeFrameOverlayContent"id="chromeFrameOverlayContent"cellpadding="0" cellspacing="0"><tr class="chromeFrameOverlayCloseBar"><td><button id="chromeFrameCloseButton">close</button></td></tr><tr><td id="chromeFrameIframeHolder"></td></tr></table>';
for(var c=document.body;b.firstChild;)c.insertBefore(b.lastChild,c.firstChild);a=m(a);f("chromeFrameIframeHolder").appendChild(a);f("chromeFrameCloseButton").onclick=l}},d={};d.check=function(a){a=a||{};var b=navigator.userAgent,c=/MSIE (\S+); Windows NT/,g=false;if(c.test(b)){if(parseFloat(c.exec(b)[1])<6&&b.indexOf("SV1")<0)g=true}else g=true;if(!g){if(!j){i('.chromeFrameInstallDefaultStyle {width: 800px;height: 600px;position: absolute;left: 50%;top: 50%;margin-left: -400px;margin-top: -300px;}.chromeFrameOverlayContent {position: absolute;margin-left: -400px;margin-top: -300px;left: 50%;top: 50%;border: 1px solid #93B4D9;background-color: white;z-index: 2001;}.chromeFrameOverlayContent iframe {width: 800px;height: 600px;border: none;}.chromeFrameOverlayCloseBar {height: 1em;text-align: right;background-color: #CADEF4;}.chromeFrameOverlayUnderlay {position: absolute;width: 100%;height: 100%;background-color: white;opacity: 0.5;-moz-opacity: 0.5;-webkit-opacity: 0.5;-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";filter: alpha(opacity=50);z-index: 2000;}');
j=true}document.cookie.indexOf("disableGCFCheck=1")>=0&&l();b=(document.location.protocol=="https:"?"https:":"http:")+"//www.google.com/chromeframe";if(!h()){a.onmissing&&a.onmissing();a.src=a.url||b;b=a.mode||"inline";if(!(a.preventPrompt||0))if(b=="inline")n(a);else b=="overlay"?o(a):window.open(a.src);if(!a.preventInstallDetection)var p=setInterval(function(){if(h()){a.oninstall&&a.oninstall();clearInterval(p);window.location=a.destination||window.location}},2E3)}}};d._force=false;d._forceValue=
false;d.isAvailable=h;e.CFInstall=d}})(this.ChromeFrameInstallScope||this);

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

function appendChromeFrameObject(options) {
	var width = options.width || '100%';	
	var height = options.height || '100%';

	options.chromeFrameObject = true;
	var src = getWidgetUrl(options);

	var chromeFrameInstance = '<OBJECT ID="' + options.id + '-chromeFrame" WIDTH="' + width + '" HEIGHT="' + height + '"';
	chromeFrameInstance += ' CODEBASE="http://www.google.com" CLASSID="CLSID:E0A900DF-9611-4446-86BD-4B1D47E7DB2A">';
	chromeFrameInstance += '  	<PARAM NAME="src" VALUE="' + src + '">';
	chromeFrameInstance += '	<embed ID="ChromeFramePlugin" WIDTH="' + width + '" HEIGHT="' + height + '" NAME="ChromeFrame" SRC="' + src + '" TYPE="application/chromeframe">';
	chromeFrameInstance += '	</embed>';
	chromeFrameInstance += '</OBJECT>';
	document.getElementById(options.id).innerHTML = chromeFrameInstance;
}

function getWidgetUrl(options) {	
	var endpoint = "${baseURL}/widget.html";
	var params = '';
	params += options.chromeFrameObject ? 'chromeFrameObject=true&' : '';
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

function promptChromeFrame(options) {	

	var width = options.width || '100%';	
	var height = options.height || '100%';

	var checkBrowser = document.createElement('iframe');
	checkBrowser.setAttribute("src", "${baseURL}/chromeFramePrompt.html");
	checkBrowser.setAttribute("width", width);
	checkBrowser.setAttribute("height", height);
	checkBrowser.setAttribute("frameborder", 0);

	document.getElementById(options.id).appendChild(checkBrowser);
}

function chromeFrameInstalled() {
	return navigator.userAgent.indexOf("chromeframe") >= 0;
}

function lowerThanIE9() {
	var test = document.createElement('div');
	test.innerHTML = '<!--[if lt IE 9]>1<![endif]-->';

	return '1' === test.innerHTML;
}

function datasetWidget(options) {
	if (lowerThanIE9()) {
		if (chromeFrameInstalled()) {
			appendChromeFrameObject(options);
		} else {
	  		CFInstall.check({
	  			preventPrompt : true, // prevent default prompt, we'll use our own
	  			onmissing: promptChromeFrame(options)	  			
	   		});
	   	}
	} else {
		appendIframe(options);
	}
    sendToAnalytics(options);
}

function sendToAnalytics(options) {
    ga('create', '${analyticsGoogleTrackingId}', {'alwaysSendReferrer': true});
    ga('set', 'referrer', window.location.href);
    ga('set', 'location', getWidgetUrl(options));
    ga('send', 'pageview');
}
    
