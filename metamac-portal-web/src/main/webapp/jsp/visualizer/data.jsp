<%@ page pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="org.siemac.metamac.core.common.exception.MetamacException"%>
<%@ page import="org.siemac.metamac.portal.core.conf.PortalConfiguration"%>
<%@ page import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="requestURL">${pageContext.request.requestURL}</c:set>
<c:set var="baseURL">${fn:replace(requestURL, pageContext.request.requestURI, pageContext.request.contextPath)}</c:set>
<% /* IDEA : Must ApiUrlStatisticalVisualizer and baseUrl be the same at all times? */ %>
<t:metamac_plantilla_1col baseURL="${baseURL}">
<fmt:setLocale value="${currentLocale}" />
    <div class="visualizer-wrapper dataset-wrapper">
	    <c:choose>
		    <c:when test="${ApiUrlStatisticalResources == ''
		    	|| ApiUrlStructuralResources == ''
                || ApiUrlPermalinks == ''
                || ApiUrlExport == ''
                || StatisticalVisualizerBase == ''
		    	|| ApiUrlStatisticalVisualizer == ''}">
		    	<h3>Error - Propiedad no configurada</h3>
	            <p class="justificado">Lo sentimos, alguna de las propiedades no ha sido configurada correctamente.</p>
	       	</c:when>
	       	<c:when test="${internalError != null && internalError != ''}">
	       	<div class="alert-danger">
	            <p class="justificado">${internalError}</p>
	        </div>
	       	</c:when>
			<c:otherwise>
			    <c:choose>
					<c:when test="${!resourceEmpty}">
						<div class="visualizer-header-info">
			            	<h1 class="visualizer-header-title">${resourceName}</h1>
			            	<c:choose>
			            		<c:when test="${resourceDescription != ''}">
			            			<div class="visualizer-description">${resourceDescription}</div>
			            		</c:when>
			            	</c:choose>
			            </div>                	
		            </c:when>
		        </c:choose>		    	   
		        <div class="metamac-container" id="metamac-container"><div class="loader">Cargando...</div></div>
		
		        <script>
		            LazyLoad=function(a){function b(b,c){var d,e=a.createElement(b);for(d in c)c.hasOwnProperty(d)&&e.setAttribute(d,c[d]);return e}function c(a){var b,c,d=j[a];d&&(b=d.callback,c=d.urls,c.shift(),k=0,c.length||(b&&b.call(d.context,d.obj),j[a]=null,l[a].length&&e(a)))}function d(){var b=navigator.userAgent;h={async:a.createElement("script").async===!0},(h.webkit=/AppleWebKit\//.test(b))||(h.ie=/MSIE|Trident/.test(b))||(h.opera=/Opera/.test(b))||(h.gecko=/Gecko\//.test(b))||(h.unknown=!0)}function e(e,k,m,n,o){var p,q,r,s,t,u,v=function(){c(e)},w="css"===e,x=[];if(h||d(),k)if(k="string"==typeof k?[k]:k.concat(),w||h.async||h.gecko||h.opera)l[e].push({urls:k,callback:m,obj:n,context:o});else for(p=0,q=k.length;q>p;++p)l[e].push({urls:[k[p]],callback:p===q-1?m:null,obj:n,context:o});if(!j[e]&&(s=j[e]=l[e].shift())){for(i||(i=a.head||a.getElementsByTagName("head")[0]),t=s.urls,p=0,q=t.length;q>p;++p)u=t[p],w?r=h.gecko?b("style"):b("link",{href:u,rel:"stylesheet"}):(r=b("script",{src:u}),r.async=!1),r.className="lazyload",r.setAttribute("charset","utf-8"),h.ie&&!w&&"onreadystatechange"in r&&!("draggable"in r)?r.onreadystatechange=function(){/loaded|complete/.test(r.readyState)&&(r.onreadystatechange=null,v())}:w&&(h.gecko||h.webkit)?h.webkit?(s.urls[p]=r.href,g()):(r.innerHTML='@import "'+u+'";',f(r)):r.onload=r.onerror=v,x.push(r);for(p=0,q=x.length;q>p;++p)i.appendChild(x[p])}}function f(a){var b;try{b=!!a.sheet.cssRules}catch(d){return k+=1,200>k?setTimeout(function(){f(a)},50):b&&c("css"),void 0}c("css")}function g(){var a,b=j.css;if(b){for(a=m.length;--a>=0;)if(m[a].href===b.urls[0]){c("css");break}k+=1,b&&(200>k?setTimeout(g,50):c("css"))}}var h,i,j={},k=0,l={css:[],js:[]},m=a.styleSheets;return{css:function(a,b,c,d){e("css",a,b,c,d)},js:function(a,b,c,d){e("js",a,b,c,d)}}}(this.document);
		        </script>
		        <script>
		            LazyLoad.css('${baseURL}/client/metamac.css?d=${cssDate}', function () {
		                LazyLoad.js('${baseURL}/client/metamac.js?d=${jsDate}', function () {
							I18n.defaultLocale = "es";
							I18n.locale = "${currentLocale}";

							// http://estadisticas.arte-consultores.com/statistical-resources
		                    App.endpoints["statistical-resources"] = "${ApiUrlStatisticalResources}/v1.0";
		                    // http://estadisticas.arte-consultores.com/structural-resources-internal/apis/structural-resources-internal
		                    App.endpoints["structural-resources"] = "${ApiUrlStructuralResources}/v1.0";
		                    // http://estadisticas.arte-consultores.com/statistical-visualizer
		                    App.endpoints["statistical-visualizer"] = "${StatisticalVisualizerBase}";
		                    // http://estadisticas.arte-consultores.com/permalinks
		                    App.endpoints["permalinks"] = "${ApiUrlPermalinks}/v1.0";
		                    // http://estadisticas.arte-consultores.com/export
		                    App.endpoints["export"] = "${ApiUrlExport}/v1.0";
                            // http://estadisticas.arte-consultores.com/indicators
                            App.endpoints["indicators"] = "${ApiUrlIndicators}/v1.0";

                            if(${ApiUrlExternalUsers != "error"}) {
								App.endpoints["external-users"] = "${ApiUrlExternalUsers}";
							}

                            if(${WebApplicationExternalUsers != "error"}) {
								// https://estadisticas.arte-consultores.com/external-users-external
								App.endpoints["external-users-web"] = "${WebApplicationExternalUsers}/#";
							}

		                    App.config["showHeader"] = ${resourceEmpty};
		                    App.config["showRightsHolder"] = ${showRightsHolder};
		                    App.config["organisationUrn"] = "${organisationUrn}";
		                    App.config["geographicalGranularityUrn"] = "${geographicalGranularityUrn}";
		                    App.config["installationType"] = "${installationType}";
                            App.config["socialTwitterVia"] = "${socialTwitterVia}";
                            App.config["enableGraphColors"] = ${enableGraphColors};
							App.config["helpUrl"] = "${helpUrl}";
							App.config["cellThreshold"] = ${cellThreshold};
		                    App.queryParams["agency"] = '${param.agencyId}';
		                    App.queryParams["identifier"] = '${param.resourceId}';
		                    App.queryParams["version"] = '${param.version}';
							App.queryParams["type"] = '${param.resourceType}';
                            App.queryParams["indicatorSystem"] = '${param.indicatorSystem}';
                            App.queryParams["geo"] = '${param.geo}';
							App.queryParams["multidatasetId"] = '${param.multidatasetId}';
		                    console.log("starting app");
		                    App.start();

                            if(${ApiUrlCaptcha != "error"}) {
                                LazyLoad.js("${ApiUrlCaptcha}/authentication.js");
                            }
                            LazyLoad.js("//s7.addthis.com/js/300/addthis_widget.js${AddthisCode}");
		                });
		            });
		        </script>
	        </c:otherwise>
	    </c:choose>
    </div>
</t:metamac_plantilla_1col>