<%@ page import="org.siemac.metamac.portal.dto.Chapter" %>
<%@ page import="org.siemac.metamac.portal.dto.CollectionNode" %>
<%@ page import="org.siemac.metamac.portal.dto.Table" %>
<%@ page import="org.siemac.metamac.rest.common.v1_0.domain.Resource" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.List" %>
<%@ page import="org.siemac.metamac.portal.Helpers" %>
<%@ page import="org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourceStatisticalResourceBase" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<fmt:setLocale value="${currentLocale}" />
<fmt:setBundle basename="i18n.messages-portal" var="i18n"/>

<ul class="resource-list">
    <%
        String theme = (String) request.getAttribute("theme");
        String locale = (String) request.getAttribute("currentLocale");
        String defaultLocale = (String) request.getAttribute("defaultInternationalizationLanguage");
        String apiKey = (String) request.getAttribute("apiKey");
        Helpers helpers = new Helpers(locale, defaultLocale, apiKey);
        Integer nodeDepth = (Integer)request.getAttribute("nodeDepth");
        if (nodeDepth == null) {
            nodeDepth = 1;
        } else {
            nodeDepth = nodeDepth + 1;
        }
        request.setAttribute("nodeDepth", nodeDepth);

        String parentIndex = (String) request.getAttribute("parentIndex");
        if (parentIndex == null) {
            parentIndex = "";
        }

        int chapterCount = 0;
        List<CollectionNode> nodes = (List<CollectionNode>) request.getAttribute("nodes");
        for (CollectionNode node : nodes) {
            if (node instanceof Chapter) {
                Chapter chapter = (Chapter) node;
                chapterCount++;
                String chapterIndex = parentIndex + chapterCount;
    %>

    <li class="resource-section resource-section-depth-${nodeDepth}">
        <span class="resource-section-title">
            <span class="resource-section-index"><%= chapterIndex %></span>
            <span class="resource-section-title-label"><%= helpers.localizeText(chapter.getName()).trim() %></span>
            <c:if test="${nodeDepth == 2}">
                <i class="fa fa-chevron-down fa-solid"></i>
            </c:if>
        </span>
        <div class="resource-section-description">
	        <c:if test="${nodeDepth <= 2}">
	        	<%= Helpers.cleanHtml(helpers.localizeText(chapter.getDescription())) %>
	        </c:if>
	    </div>
        <% if (chapter.getNodes() != null) {
            request.setAttribute("nodes", chapter.getNodes().getNodes());
            request.setAttribute("parentIndex", chapterIndex + ".");
        %>
        	<jsp:include page="/jsp/visualizer/collection-node.jsp"/>
			<%
    			request.setAttribute("nodeDepth", nodeDepth); //reset node depth
			%>
		<% } %>
    </li>

    <%
    } else {
        Table table = (Table) node;
        Integer numeration = (Integer)request.getAttribute("numeration");
        if (numeration == null) {
            numeration = 1;
        } else {
            numeration = numeration + 1;
        }
        request.setAttribute("numeration", numeration);
        Integer numberOfFixedDigitsInNumeration = (Integer)request.getAttribute("numberOfFixedDigitsInNumeration");
        request.setAttribute("numerationFixed", String.format("%0"+ numberOfFixedDigitsInNumeration +"d", numeration));

        ResourceStatisticalResourceBase resource = table.getResource();
        String iconClass = "fa fa-table fa-thin";
        List<String> resourcesWithIconLink = Arrays.asList("statisticalResources#url", "statisticalResources#collection");
        if (resource != null && resourcesWithIconLink.contains(resource.getKind())) {
            iconClass = "fa fa-link fa-thin";
        }
        request.setAttribute("iconClass", iconClass);

        Date now = new Date();
        boolean featured = resource != null && resource.getFeaturedUntilDate() != null && resource.getFeaturedUntilDate().after(now);
        boolean newness = resource != null && resource.getNewnessUntilDate() != null && resource.getNewnessUntilDate().after(now);
        request.setAttribute("featured", featured);
        request.setAttribute("newness", newness);
    %>

    <li class="resource-link">
        <i class="${iconClass}"></i>
        <a class="nouline" href="<%= Helpers.tableViewUrl(table, theme) %>">
            ${numerationFixed} <%= helpers.localizeText(table.getName()) %>
        </a>
        <div class="tags-section">
            <c:if test="${featured}">
                <i class="fa-solid fa-star" title="<fmt:message key="message.portal.resource.featured" bundle="${i18n}"/>"></i>
            </c:if>
            <c:if test="${newness}">
                <i class="fa-solid fa-calendar" title="<fmt:message key="message.portal.resource.newness" bundle="${i18n}"/>"></i>
            </c:if>
        </div>
    </li>

    <%
            }
        }
    %>
</ul>
