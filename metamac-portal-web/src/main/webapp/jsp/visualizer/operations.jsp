<%@ page pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="requestURL">${pageContext.request.requestURL}</c:set>
<c:set var="baseURL">${fn:replace(requestURL, pageContext.request.requestURI, pageContext.request.contextPath)}</c:set>

<t:metamac_plantilla_1col baseURL="${baseURL}">

</t:metamac_plantilla_1col>