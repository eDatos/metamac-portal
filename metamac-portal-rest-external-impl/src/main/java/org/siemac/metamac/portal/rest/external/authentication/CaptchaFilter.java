package org.siemac.metamac.portal.rest.external.authentication;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.AUTHENTICATED_SESSION_ATTRIBUTE;

import java.net.URI;
import java.util.Collections;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import org.apache.cxf.jaxrs.ext.RequestHandler;
import org.apache.cxf.jaxrs.model.ClassResourceInfo;
import org.apache.cxf.message.Message;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

public class CaptchaFilter implements RequestHandler {

    @Context
    private HttpServletRequest  request;

    @Autowired
    private PortalConfiguration portalConfiguration;

    @Override
    public Response handleRequest(Message m, ClassResourceInfo resourceClass) {
        if ("POST".equals(request.getMethod())) {
            Object isAuthenticated = request.getSession().getAttribute(AUTHENTICATED_SESSION_ATTRIBUTE);
            if (isAuthenticated != null && ((boolean) isAuthenticated)) {
                return null;
            }

            UriBuilder urlBuilder;
            try {
                urlBuilder = UriBuilder.fromUri(portalConfiguration.retrieveCaptchaExternalApiUrlBase());
            } catch (MetamacException e) {
                // If the captchaExternalApiUrlBase is not available (for example, if external-users is not installed) we don´t check for captchas
                return null;
            }
            urlBuilder.path("api/validate");
            for (Object paramKey : Collections.list(request.getParameterNames())) {
                urlBuilder.queryParam(paramKey.toString(), request.getParameter(paramKey.toString()));
            }
            URI url = urlBuilder.build();

            try {
                RestTemplate restTemplate = ApplicationContextProvider.getApplicationContext().getBean(RestTemplate.class);
                restTemplate.getForEntity(url, Object.class);
                return null;
            } catch (HttpClientErrorException e) {
                return Response.status(e.getStatusCode().value()).type(MediaType.APPLICATION_JSON_TYPE).entity(e.getResponseBodyAsString()).build();
            }
        } else {
            return null;
        }
    }
}
