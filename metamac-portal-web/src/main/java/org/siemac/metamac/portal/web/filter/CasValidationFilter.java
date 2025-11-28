package org.siemac.metamac.portal.web.filter;

import org.apache.commons.lang.StringUtils;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.authentication.AttributePrincipalImpl;
import org.jasig.cas.client.validation.Assertion;
import org.jasig.cas.client.validation.AssertionImpl;
import org.siemac.metamac.portal.web.WebUtils;
import org.siemac.metamac.sso.client.MetamacPrincipal;
import org.siemac.metamac.sso.client.SsoClientConstants;
import org.siemac.metamac.sso.validation.ValidateTicket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;

public class CasValidationFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(CasValidationFilter.class);
    private static final String TICKET_PARAM = "ticket";

    private ValidateTicket validateTicket;

    @Override
    public void init(FilterConfig filterConfig) {
        String casServerUrlPrefix = WebUtils.getCasServerUrlPrefix();
        String tolerance = WebUtils.getCasSecurityTolerance();

        validateTicket = new ValidateTicket(casServerUrlPrefix);
        validateTicket.setTolerance(Long.parseLong(tolerance));
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String ticket = request.getParameter(TICKET_PARAM);
        if (StringUtils.isNotBlank(ticket)) {
            try {
                MetamacPrincipal metamacPrincipal = validateTicket.validateTicket(ticket, buildServiceUrl(request));
                request.getSession().setAttribute("_const_cas_assertion_", getAssertion(metamacPrincipal));
            } catch (Exception e) {
                logger.error("Error validating CAS ticket", e);
                response.sendRedirect(buildServiceUrl(request));
                return;
            }
        }

        chain.doFilter(servletRequest, servletResponse);
    }

    private Assertion getAssertion(MetamacPrincipal metamacPrincipal) {
        AttributePrincipal principal = new AttributePrincipalImpl(
            metamacPrincipal.getUserId(),
            new HashMap<String, Object>() {{
                put(SsoClientConstants.PRINCIPAL_ATTRIBUTE, metamacPrincipal);
            }}
        );
        return new AssertionImpl(principal, new Date(), null, new HashMap<>());
    }

    private static String buildServiceUrl(HttpServletRequest request) {
        return UriBuilder.fromUri(request.getRequestURL().toString())
                .replaceQuery(request.getQueryString())
                .replaceQueryParam(TICKET_PARAM)
                .build().toString();
    }

    @Override
    public void destroy() {
    }
}

