package org.siemac.metamac.portal.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CookieRewritePathFilter implements Filter {

    private static final String JSESSIONID  = "JSESSIONID";
    private static final String COOKIE_PATH = "/";

    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String jSessionId = ((HttpServletRequest) request).getSession().getId();
        ((HttpServletResponse) response).setHeader("Set-Cookie", JSESSIONID + "=" + jSessionId + ";Path=" + COOKIE_PATH + ";SameSite=None;Secure");
        chain.doFilter(request, response);
    }

}
