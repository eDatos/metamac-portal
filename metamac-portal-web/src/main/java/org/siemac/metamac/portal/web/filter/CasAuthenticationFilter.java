package org.siemac.metamac.portal.web.filter;

import org.jasig.cas.client.authentication.AuthenticationFilter;
import org.siemac.metamac.portal.web.WebUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.FilterConfig;
import javax.servlet.ServletException;

import java.net.MalformedURLException;
import java.net.URL;

public class CasAuthenticationFilter extends AuthenticationFilter {

    private static final Logger log = LoggerFactory.getLogger(CasAuthenticationFilter.class);

    @Override
    protected void initInternal(FilterConfig filterConfig) throws ServletException {
        super.initInternal(filterConfig);

        setCasServerLoginUrl(WebUtils.getCasServiceLoginUrl());
        try {
            setServerName(getUrlDomain(WebUtils.getPortalBaseUrl()));
        } catch (MalformedURLException e) {
            log.error("Portal base url is not a valid url", e);
        }
    }

    private String getUrlDomain(String url) throws MalformedURLException {
        URL urlObject = new URL(url);
        return urlObject.getProtocol() + "://" + urlObject.getHost() + ((urlObject.getPort() == -1) ? "" : ":" + urlObject.getPort());
    }
}
