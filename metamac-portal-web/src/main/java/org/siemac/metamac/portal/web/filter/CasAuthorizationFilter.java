package org.siemac.metamac.portal.web.filter;

import org.siemac.metamac.portal.Helpers;
import org.siemac.metamac.portal.core.constants.PortalConstants;
import org.siemac.metamac.sso.client.MetamacPrincipal;
import org.siemac.metamac.sso.client.MetamacPrincipalAccess;
import org.siemac.metamac.sso.client.SsoClientConstants;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CasAuthorizationFilter implements Filter {

    private static final String STATISTICAL_RESOURCES_APP_NAME = "GESTOR_RECURSOS_ESTADISTICOS";
    private static final String INDICATORS_APP_NAME = "GESTOR_INDICADORES";

    private static final List<String> STATISTICAL_RESOURCES_VALID_TYPES = Arrays.asList(
            PortalConstants.ResourceType.COLLECTION.getName(),
            PortalConstants.ResourceType.DATASET.getName(),
            PortalConstants.ResourceType.QUERY.getName(),
            PortalConstants.ResourceType.MULTIDATASET.getName()
    );
    private static final List<String> INDICATORS_VALID_TYPES = Arrays.asList(
            PortalConstants.ResourceType.INDICATOR.getName(),
            PortalConstants.ResourceType.INDICATOR_INSTANCE.getName()
    );


    @Override
    public void init(FilterConfig filterConfig) {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;

        MetamacPrincipal metamacPrincipal = (MetamacPrincipal) httpRequest.getSession().getAttribute(SsoClientConstants.PRINCIPAL_ATTRIBUTE);
        if (metamacPrincipal != null && !hasAccess(metamacPrincipal, httpRequest)) {
            httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
        } else {
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }

    private boolean hasAccess(MetamacPrincipal metamacPrincipal, HttpServletRequest request) {
        ArrayList<String> validApps = new ArrayList<>();
        if (statisticalResourcesIsValid(request)) validApps.add(STATISTICAL_RESOURCES_APP_NAME);
        if (indicatorsIsValid(request)) validApps.add(INDICATORS_APP_NAME);

        for (MetamacPrincipalAccess access : metamacPrincipal.getAccesses()) {
            if (validApps.contains(access.getApplication())) {
                return true;
            }
        }
        return false;
    }

    private boolean statisticalResourcesIsValid(HttpServletRequest request) {
        String requestPage = getRequestLastPathSegment(request);
        List<String> pagesWithResourceType = Arrays.asList("data.html", "collection.html");

        return !pagesWithResourceType.contains(requestPage) || STATISTICAL_RESOURCES_VALID_TYPES.contains(request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE));
    }

    private boolean indicatorsIsValid(HttpServletRequest request) {
        String requestPage = getRequestLastPathSegment(request);

        return "data.html".equals(requestPage) && INDICATORS_VALID_TYPES.contains(request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE));
    }

    private String getRequestLastPathSegment(HttpServletRequest request) {
        Path lastPathSegment = Paths.get(request.getRequestURI()).getFileName();
        return lastPathSegment != null ? lastPathSegment.toString() : "";
    }

    @Override
    public void destroy() {

    }
}
