<%@ page pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="org.siemac.metamac.portal.web.WebUtils" %>

<html>
    <head>
        <t:metamac_title_meta></t:metamac_title_meta>

        <fmt:setLocale value="${currentLocale}"/>
        <fmt:setBundle basename="i18n.messages-portal" var="i18n"/>

        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta charset="utf-8">
        <title>Internal widget error</title>

        <%
            ServletContext context = request.getSession().getServletContext();
            String cssPath = context.getRealPath("client/metamac.css");
            File cssFile = new File(cssPath);

            Date lastModifiedCss = new Date(cssFile.lastModified());
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
            request.setAttribute("cssDate", dateFormat.format(lastModifiedCss));

            request.setAttribute("portalBaseUrl", WebUtils.getPortalBaseUrl());
        %>

        <style type="text/css">
            html, body {
                margin: 0;
                height: 99%;
            }
            .visualizer-wrapper {
                box-sizing: border-box;
            }
            .dataset-visualization-container {
                align-content: center;
                text-align: center;
            }
        </style>

        <link rel="stylesheet" href="../client/metamac.css?d=${cssDate}"/>
    </head>
    <body>
        <div class="visualizer-wrapper metamac-container">
            <div class="dataset-view">
                <div class="dataset-visualization-container">
                    <p class="alert-danger">
                        <fmt:message key="message.portal.widget_login_required" bundle="${i18n}">
                            <fmt:param value="${portalBaseUrl}"/>
                        </fmt:message>
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
