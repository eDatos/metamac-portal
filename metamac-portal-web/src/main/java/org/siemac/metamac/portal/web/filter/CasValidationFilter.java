package org.siemac.metamac.portal.web.filter;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.sso.client.MetamacPrincipal;
import org.siemac.metamac.sso.client.SsoClientConstants;
import org.siemac.metamac.sso.validation.ValidateTicket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

public class CasValidationFilter implements Filter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    protected ValidateTicket               validateTicket       = null;

    @Override
    public void init(FilterConfig filterConfig) {
        String casServerUrlPrefix = null;
        String tolerance = null;

        ConfigurationService configurationService = ApplicationContextProvider.getApplicationContext().getBean(ConfigurationService.class);
        try {
            casServerUrlPrefix = configurationService.retrieveSecurityCasServerUrlPrefix();
            tolerance = configurationService.retrieveSecurityTolerance();
        } catch (MetamacException e) {
            throw new RuntimeException(e);
        }
        validateTicket = new ValidateTicket(casServerUrlPrefix);
        validateTicket.setTolerance(Long.parseLong(tolerance));
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        String ticket = request.getParameter("ticket");

        String service = "";
        try {
            service = removeTicket(request.getRequestURL().toString());
            MetamacPrincipal metamacPrincipal = null;
            metamacPrincipal = validateTicket.validateTicket(ticket, service);
            ServiceContext serviceContext = new ServiceContext(metamacPrincipal.getUserId(), ticket, "PORTAL");
            serviceContext.setProperty(SsoClientConstants.PRINCIPAL_ATTRIBUTE, metamacPrincipal);
        } catch (Exception e) {
            logger.error("Error building service URL", e);
        } catch (NoClassDefFoundError e) {
            logger.error("Error no def", e);
        }
        chain.doFilter(servletRequest, servletResponse);
    }

    public static String removeTicket(String url) throws URISyntaxException {
        URI uri = new URI(url);

        String query = uri.getQuery();
        if (query == null) {
            return url; // no hay parámetros
        }

        StringBuilder newQuery = new StringBuilder();
        String[] params = query.split("&");

        for (String param : params) {
            // comprobamos si es "ticket" con o sin valor
            if (param.startsWith("ticket=") || "ticket".equals(param)) {
                continue; // saltamos este
            }

            if (newQuery.length() > 0) {
                newQuery.append("&");
            }
            newQuery.append(param);
        }

        // reconstruimos la URL con el nuevo query
        URI newUri = new URI(
                uri.getScheme(),
                uri.getAuthority(),
                uri.getPath(),
                newQuery.length() == 0 ? null : newQuery.toString(),
                uri.getFragment()
        );

        return newUri.toString();
    }

    @Override
    public void destroy() {
    }
}

