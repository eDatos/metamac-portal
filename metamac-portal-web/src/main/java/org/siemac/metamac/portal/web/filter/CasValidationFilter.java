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
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

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

        try {
            StringBuilder query = new StringBuilder();

            try {
                for (Object keyObj : request.getParameterMap().keySet()) {
                    String key = keyObj.toString();
                    if ("ticket".equals(key)) {
                        continue; // saltar el parámetro "ticket"
                    }
                    String value = request.getParameter(key);
                    if (value != null) {
                        if (query.length() > 0) {
                            query.append("&");
                        }
                        query.append(key)
                                .append("=")
                                .append(URLEncoder.encode(value, "UTF-8"));
                    }
                }
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }

            String service = buildServiceUrl(request);
            MetamacPrincipal metamacPrincipal = null;
            metamacPrincipal = validateTicket.validateTicket(ticket, service);
            ServiceContext serviceContext = new ServiceContext(metamacPrincipal.getUserId(), ticket, "PORTAL");
            serviceContext.setProperty(SsoClientConstants.PRINCIPAL_ATTRIBUTE, metamacPrincipal);
            request.getSession().setAttribute(SsoClientConstants.PRINCIPAL_ATTRIBUTE, metamacPrincipal);
            //ServiceContextHolder.putCurrentServiceContext(serviceContext);
        } catch (Exception e) {
            logger.error("Error building service URL", e);
        } catch (NoClassDefFoundError e) {
            logger.error("Error no def", e);
        }
        chain.doFilter(servletRequest, servletResponse);
    }

    public static String buildServiceUrl(HttpServletRequest request) throws UnsupportedEncodingException {
        StringBuilder url = new StringBuilder(request.getRequestURL().toString());

        String query = request.getQueryString();
        if (query != null && query.length() > 0) {
            // quitar el parámetro ticket=... si existe
            query = query.replaceAll("(^|&)?ticket=[^&]*", "");

            // limpiar & al inicio si quedó
            if (query.startsWith("&")) {
                query = query.substring(1);
            }

            if (query.length() > 0) {
                url.append("?").append(query);
            }
        }

        return URLDecoder.decode(url.toString(), "UTF-8");
    }

    @Override
    public void destroy() {
    }
}

