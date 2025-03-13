<%@ page pageEncoding="UTF-8" %>
<%@ page import="org.siemac.metamac.portal.Helpers" %>
<%@ page import="org.siemac.metamac.portal.mapper.Collection2DtoMapper"%>
<%@ page import="org.siemac.metamac.portal.dto.Collection" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="requestURL">${pageContext.request.requestURL}</c:set>
<c:set var="baseURL">${fn:replace(requestURL, pageContext.request.requestURI, pageContext.request.contextPath)}</c:set>

<t:metamac_plantilla_1col baseURL="${baseURL}">
<fmt:setLocale value="${currentLocale}" />
    <div class="visualizer-wrapper collection-wrapper"> 
        <c:choose>
            <c:when test="${collection != null}">
                <div class="visualizer-header-info">
            	   <h1 class="visualizer-header-title">${resourceName}</h1>
            	   <div class="visualizer-description">${Helpers.cleanText(resourceDescription)}</div>
                </div>                	
                <jsp:include page="/jsp/visualizer/collection-node.jsp" />
            </c:when>
            <c:when test="${internalError != null && internalError != ''}">
	            <p class="alert-danger">${internalError}</p>
	       	</c:when>
			<c:otherwise>
                <div class="visualizer-header-info">
            	   <h2 class="visualizer-header-title">Control de Errores</h2>
                </div>
            	<div class="contenido">
            		<c:choose>
	            		<c:when test="${ApiUrlStatisticalResources == ''}">	                	                    
		                    <h3>Error - Propiedad no configurada</h3>
		                    <p class="justificado">Lo sentimos, la propiedad ApiUrlStatisticalResource no ha sido configurada correctamente.</p>		                    	                    
		        		</c:when>
			        	<c:otherwise>
			        		<h3>Error 404 - Documento No Encontrado</h3>
		                    <p class="justificado">Lo sentimos, el Documento al que está intentado acceder no está disponible.
		                        Esto puede ocurrir por varios  motivos:</p>
		                    <ul>
		                        <li>El documento no existe.</li>
		                        <li>El documento puede no estar disponible "Temporalmente".</li>
		                        <li>Ha introducido un URL incorrecto. Compruebe y asegúrese de que está bien escrito.</li>
		                    </ul>
			        	</c:otherwise>
		        	</c:choose>
		        	<p class="nota"><strong>Atención:</strong> Si desea informar, por favor, hágalo desde Contacto.</p>	                
	        	</div>
            </c:otherwise>
        </c:choose>
    </div>

    <script>
	    LazyLoad=function(a){function b(b,c){var d,e=a.createElement(b);for(d in c)c.hasOwnProperty(d)&&e.setAttribute(d,c[d]);return e}function c(a){var b,c,d=j[a];d&&(b=d.callback,c=d.urls,c.shift(),k=0,c.length||(b&&b.call(d.context,d.obj),j[a]=null,l[a].length&&e(a)))}function d(){var b=navigator.userAgent;h={async:a.createElement("script").async===!0},(h.webkit=/AppleWebKit\//.test(b))||(h.ie=/MSIE|Trident/.test(b))||(h.opera=/Opera/.test(b))||(h.gecko=/Gecko\//.test(b))||(h.unknown=!0)}function e(e,k,m,n,o){var p,q,r,s,t,u,v=function(){c(e)},w="css"===e,x=[];if(h||d(),k)if(k="string"==typeof k?[k]:k.concat(),w||h.async||h.gecko||h.opera)l[e].push({urls:k,callback:m,obj:n,context:o});else for(p=0,q=k.length;q>p;++p)l[e].push({urls:[k[p]],callback:p===q-1?m:null,obj:n,context:o});if(!j[e]&&(s=j[e]=l[e].shift())){for(i||(i=a.head||a.getElementsByTagName("head")[0]),t=s.urls,p=0,q=t.length;q>p;++p)u=t[p],w?r=h.gecko?b("style"):b("link",{href:u,rel:"stylesheet"}):(r=b("script",{src:u}),r.async=!1),r.className="lazyload",r.setAttribute("charset","utf-8"),h.ie&&!w&&"onreadystatechange"in r&&!("draggable"in r)?r.onreadystatechange=function(){/loaded|complete/.test(r.readyState)&&(r.onreadystatechange=null,v())}:w&&(h.gecko||h.webkit)?h.webkit?(s.urls[p]=r.href,g()):(r.innerHTML='@import "'+u+'";',f(r)):r.onload=r.onerror=v,x.push(r);for(p=0,q=x.length;q>p;++p)i.appendChild(x[p])}}function f(a){var b;try{b=!!a.sheet.cssRules}catch(d){return k+=1,200>k?setTimeout(function(){f(a)},50):b&&c("css"),void 0}c("css")}function g(){var a,b=j.css;if(b){for(a=m.length;--a>=0;)if(m[a].href===b.urls[0]){c("css");break}k+=1,b&&(200>k?setTimeout(g,50):c("css"))}}var h,i,j={},k=0,l={css:[],js:[]},m=a.styleSheets;return{css:function(a,b,c,d){e("css",a,b,c,d)},js:function(a,b,c,d){e("js",a,b,c,d)}}}(this.document);
    </script>

    <script>
	    LazyLoad.css('${baseURL}/client/metamac.css', function () {
	        LazyLoad.js('${baseURL}/client/metamac.js', function () {

                // Tree behaviour
                $(".tree-icon").click(function (e) {
                    e.preventDefault();
                    var $icon = $(this);
                    var $parentDimension = $icon.closest(".dimension");
                    $parentDimension.toggleClass("dimension-open");
                    $parentDimension.toggleClass("dimension-close");
                });

            });
        });
    </script>
</t:metamac_plantilla_1col>
