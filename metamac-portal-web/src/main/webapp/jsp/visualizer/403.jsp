<%@ page pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="requestURL">${pageContext.request.requestURL}</c:set>
<c:set var="baseURL">${fn:replace(requestURL, pageContext.request.requestURI, pageContext.request.contextPath)}</c:set>
<t:metamac_plantilla_1col baseURL="${baseURL}" includeApiKey="false">
    <fmt:setLocale value="${currentLocale}" />
    <fmt:setBundle basename="i18n.messages-portal" var="i18n"/>
    <p class="alert-danger"><fmt:message key="message.portal.access_denied" bundle="${i18n}" /></p>
</t:metamac_plantilla_1col>
