package org.siemac.metamac.portal.web.filter;

import org.jasig.cas.client.validation.Assertion;
import org.siemac.metamac.portal.Helpers;
import org.siemac.metamac.portal.core.constants.PortalConstants;
import org.siemac.metamac.portal.web.ApplicationStartup;
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
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CasAuthorizationFilter implements Filter {

    static final String STATISTICAL_RESOURCES_APP_NAME = "GESTOR_RECURSOS_ESTADISTICOS";
    static final String INDICATORS_APP_NAME = "GESTOR_INDICADORES";
    static final String UNAUTHORIZED_PAGE = "/error/403.html";

    static final List<String> STATISTICAL_RESOURCES_VALID_TYPES = Collections.unmodifiableList(Arrays.asList(
            PortalConstants.ResourceType.DATASET.getName(),
            PortalConstants.ResourceType.QUERY.getName(),
            PortalConstants.ResourceType.MULTIDATASET.getName()
    ));
    static final List<String> INDICATORS_VALID_TYPES = Collections.unmodifiableList(Arrays.asList(
            PortalConstants.ResourceType.INDICATOR.getName(),
            PortalConstants.ResourceType.INDICATOR_INSTANCE.getName()
    ));

    static final List<String> PAGES_WITH_RESOURCE_TYPE = Collections.unmodifiableList(
            Stream.concat(ApplicationStartup.DATA_PATHS.stream(), Stream.of("/widget.html")).collect(Collectors.toList())
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
        if (everybodyIsValid(request)) {
            return true;
        }

        boolean everyAppWithAccessToPortalIsValid = everyAppWithAccessToPortalIsValid(request);

        ArrayList<String> validApps = new ArrayList<>();
        if (everyAppWithAccessToPortalIsValid || statisticalResourcesIsValid(request)) validApps.add(STATISTICAL_RESOURCES_APP_NAME);
        if (everyAppWithAccessToPortalIsValid || indicatorsIsValid(request)) validApps.add(INDICATORS_APP_NAME);

        for (MetamacPrincipalAccess access : metamacPrincipal.getAccesses()) {
            if (validApps.contains(access.getApplication())) {
                return true;
            }
        }
        return false;
    }

    private boolean everybodyIsValid(HttpServletRequest request) {
        return UNAUTHORIZED_PAGE.equals(request.getServletPath());
    }

    private boolean everyAppWithAccessToPortalIsValid(HttpServletRequest request) {
        Map<String, String[]> requestParameters = request.getParameterMap();

        return PAGES_WITH_RESOURCE_TYPE.contains(request.getServletPath())
                && (requestParameters.containsKey(Helpers.PARAMETER_PERMALINK) || requestParameters.containsKey(Helpers.PARAMETER_MULTIDATASET_ID))
                && !requestParameters.containsKey(Helpers.PARAMETER_RESOURCE_TYPE);
    }

    private boolean statisticalResourcesIsValid(HttpServletRequest request) {
        List<String> statisticalResourcesValidServlets = new ArrayList<>(ApplicationStartup.COLLECTION_PATHS);
        statisticalResourcesValidServlets.add("/visualizer/operations.html");

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
