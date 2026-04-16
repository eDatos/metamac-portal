<%@ page import="org.siemac.metamac.portal.dto.Chapter" %>
<%@ page import="org.siemac.metamac.portal.dto.CollectionNode" %>
<%@ page import="org.siemac.metamac.portal.dto.Table" %>
<%@ page import="org.siemac.metamac.rest.common.v1_0.domain.Resource" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="org.siemac.metamac.portal.Helpers" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<ul class="resource-list">
    <%
        String theme = (String) request.getAttribute("theme");
        String locale = (String) request.getAttribute("currentLocale");
        String defaultLocale = (String) request.getAttribute("defaultInternationalizationLanguage");
        String apiKey = (String) request.getAttribute("apiKey");
        Helpers.initialize(locale, defaultLocale, apiKey);
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
            <span class="resource-section-title-label"><%= Helpers.localizeText(chapter.getName()).trim() %></span>
            <c:if test="${nodeDepth == 2}">
                <i class="icon-chevron-down"></i>
            </c:if>
        </span>
        <div class="resource-section-description">
	        <c:if test="${nodeDepth <= 2}">
	        	<%= Helpers.cleanHtml(Helpers.localizeText(chapter.getDescription())) %>
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

        Resource resource = table.getResource();
        String iconClass = "icon-table";
        List<String> resourcesWithIconLink = Arrays.asList("statisticalResources#url", "statisticalResources#collection");
        if (resource != null && resourcesWithIconLink.contains(resource.getKind())) {
            iconClass = "icon-link";
        }
        request.setAttribute("iconClass", iconClass);
    %>

    <li class="resource-link">
        <i class="${iconClass}"></i>
        <a class="nouline" href="<%= Helpers.tableViewUrl(table, theme) %>">
            ${numerationFixed} <%= Helpers.localizeText(table.getName()) %>
        </a>
    </li>

    <%
            }
        }
    %>
</ul>
