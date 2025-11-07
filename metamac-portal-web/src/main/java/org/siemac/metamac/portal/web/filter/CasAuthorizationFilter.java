package org.siemac.metamac.portal.web.filter;

import org.jasig.cas.client.validation.Assertion;
import org.siemac.metamac.portal.Helpers;
import org.siemac.metamac.portal.core.constants.PortalConstants;
import org.siemac.metamac.portal.web.WebUtils;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class CasAuthorizationFilter implements Filter {

    private static final String STATISTICAL_RESOURCES_APP_NAME = "GESTOR_RECURSOS_ESTADISTICOS";
    private static final String INDICATORS_APP_NAME = "GESTOR_INDICADORES";
    private static final String UNAUTHORIZED_PAGE = "/error/403.html";

    private static final List<String> STATISTICAL_RESOURCES_VALID_TYPES = Arrays.asList(
            PortalConstants.ResourceType.DATASET.getName(),
            PortalConstants.ResourceType.QUERY.getName(),
            PortalConstants.ResourceType.MULTIDATASET.getName()
    );
    private static final List<String> INDICATORS_VALID_TYPES = Arrays.asList(
            PortalConstants.ResourceType.INDICATOR.getName(),
            PortalConstants.ResourceType.INDICATOR_INSTANCE.getName()
    );

    private static final List<String> PAGES_WITH_RESOURCE_TYPE = Arrays.asList(
            "/visualizer/data.html",
            "/visualizer/custom/data.html",
            "/visualizer/agricultura/data.html",
            "/visualizer/medioambiente/data.html",
            "/visualizer/turismo/data.html",
            "/visualizer/funcion-publica/data.html",
            "/visualizer/iqua/data.html",
            "/widget.html"
    );

    @Override
    public void init(FilterConfig filterConfig) {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;

        Assertion assertion = (Assertion) httpRequest.getSession().getAttribute("_const_cas_assertion_");
        MetamacPrincipal metamacPrincipal = (MetamacPrincipal) assertion.getPrincipal().getAttributes().get(SsoClientConstants.PRINCIPAL_ATTRIBUTE);
        if (!hasAccess(metamacPrincipal, httpRequest)) {
            httpResponse.sendRedirect(WebUtils.getPortalBaseUrl() + UNAUTHORIZED_PAGE);
        } else {
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }

    private boolean hasAccess(MetamacPrincipal metamacPrincipal, HttpServletRequest request) {
        boolean everybodyIsValid = everybodyIsValid(request);

        ArrayList<String> validApps = new ArrayList<>();
        if (everybodyIsValid || statisticalResourcesIsValid(request)) validApps.add(STATISTICAL_RESOURCES_APP_NAME);
        if (everybodyIsValid || indicatorsIsValid(request)) validApps.add(INDICATORS_APP_NAME);

        for (MetamacPrincipalAccess access : metamacPrincipal.getAccesses()) {
            if (validApps.contains(access.getApplication())) {
                return true;
            }
        }
        return false;
    }

    private boolean everybodyIsValid(HttpServletRequest request) {
        Map<String, String[]> requestParameters = request.getParameterMap();

        boolean currentPageRequiresResourceTypeButItIsNotSetYet = PAGES_WITH_RESOURCE_TYPE.contains(request.getServletPath())
                && (requestParameters.containsKey(Helpers.PARAMETER_PERMALINK) || requestParameters.containsKey(Helpers.PARAMETER_MULTIDATASET_ID))
                && !requestParameters.containsKey(Helpers.PARAMETER_RESOURCE_TYPE);
        return UNAUTHORIZED_PAGE.equals(request.getServletPath()) || currentPageRequiresResourceTypeButItIsNotSetYet;
    }

    private boolean statisticalResourcesIsValid(HttpServletRequest request) {
        List<String> statisticalResourcesValidServlets = Arrays.asList(
                "/visualizer/operations.html",
                "/visualizer/collection.html",
                "/visualizer/custom/collection.html",
                "/visualizer/agricultura/collection.html",
                "/visualizer/medioambiente/collection.html",
                "/visualizer/turismo/collection.html",
                "/visualizer/funcion-publica/collection.html",
                "/visualizer/iqua/collection.html"
        );
        return statisticalResourcesValidServlets.contains(request.getServletPath())
                || (PAGES_WITH_RESOURCE_TYPE.contains(request.getServletPath()) && STATISTICAL_RESOURCES_VALID_TYPES.contains(
                request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE)));
    }

    private boolean indicatorsIsValid(HttpServletRequest request) {
        return PAGES_WITH_RESOURCE_TYPE.contains(request.getServletPath())
                && INDICATORS_VALID_TYPES.contains(request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE));
    }

    @Override
    public void destroy() {

    }
}
