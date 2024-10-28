package org.siemac.metamac.portal.rest.external.authentication;

import org.apache.commons.lang.StringUtils;
import org.apache.cxf.jaxrs.ext.RequestHandler;
import org.apache.cxf.jaxrs.model.ClassResourceInfo;
import org.apache.cxf.message.Message;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.AUTHENTICATED_SESSION_ATTRIBUTE;

public class ExternalUserFilter implements RequestHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ExternalUserFilter.class);
    private static final String AUTH_COOKIE_NAME = "authenticationtoken";

    @Context
    private HttpServletRequest  request;

    @Autowired
    private ConfigurationService configurationService;

    @Override
    public Response handleRequest(Message m, ClassResourceInfo resourceClass) {
        String authToken = getAuthToken();
        if(StringUtils.isNotBlank(authToken)) {
            LOG.info("Validating external user");
            MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
            header.add("Authorization", authToken);
            HttpEntity<String> entity = new HttpEntity<>("body", header);
            try {
                RestTemplate restTemplate = ApplicationContextProvider.getApplicationContext().getBean(RestTemplate.class);
                ResponseEntity<String> response = restTemplate.exchange(configurationService.retrieveExternalUsersExternalApiUrlBase() + "/api/account", HttpMethod.GET, entity, String.class);
                if(HttpStatus.OK.equals(response.getStatusCode())) {
                    LOG.info("JSESSIONID = {}, External users response: {}", new Object[]{request.getSession().getId(), response.getStatusCode()});
                    request.getSession().setAttribute(AUTHENTICATED_SESSION_ATTRIBUTE, true);
                } else {
                    LOG.error("JSESSIONID = {}, External users response: {}", new Object[]{request.getSession().getId(), response.getStatusCode()});
                    request.getSession().setAttribute(AUTHENTICATED_SESSION_ATTRIBUTE, false);
                }
            } catch (MetamacException | RestClientException e) {
                LOG.error("Error validating external user.", e);
                request.getSession().setAttribute(AUTHENTICATED_SESSION_ATTRIBUTE, false);
            }
        } else {
            LOG.debug("No external user token.");
            request.getSession().setAttribute(AUTHENTICATED_SESSION_ATTRIBUTE, false);
        }
        return null;
    }

    private String getAuthToken() {
        String authToken = request.getHeader("Authorization");
        if (authToken == null) {
            String authTokenFromCookie = getAuthTokenFromCookie();
            if (StringUtils.isNotBlank(authTokenFromCookie)) {
                authToken = "Bearer " + authTokenFromCookie;
            }
        }
        return authToken;
    }
    private String getAuthTokenFromCookie() {
        Cookie[] requestCookies = request.getCookies();
        String authToken = null;
        if (requestCookies != null) {
            for (Cookie cookie : requestCookies) {
                if (AUTH_COOKIE_NAME.equals(cookie.getName())) {
                    authToken = (cookie.getValue());
                }
            }
        }
        return authToken;
    }
}
