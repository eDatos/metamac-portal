package org.siemac.metamac.portal.rest.external.authentication;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.AUTHENTICATED_SESSION_ATTRIBUTE;

import java.net.URI;
import java.util.Collections;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import org.apache.commons.lang.StringUtils;
import org.apache.cxf.jaxrs.ext.RequestHandler;
import org.apache.cxf.jaxrs.model.ClassResourceInfo;
import org.apache.cxf.message.Message;
import org.siemac.edatos.core.common.constants.CoreCommonConstants;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

public class CaptchaFilter implements RequestHandler {

    private static final Logger LOG = LoggerFactory.getLogger(CaptchaFilter.class);

    @Context
    private HttpServletRequest  request;

    @Autowired
    private PortalConfiguration configurationService;

    private String apiKey;

    @PostConstruct
    public void init() {
        try {
            this.apiKey = configurationService.retrievePortalApiKeyByInstallationType();
        } catch (MetamacException e) {
            LOG.warn("No se ha encontrado la propiedad api key de portal para la instalación actual (\"metamac.portal.rest.api_key\" o \"metamac.portal.rest.internal.api_key\").");
        }
    }

    @Override
    public Response handleRequest(Message m, ClassResourceInfo resourceClass) {
        if ("POST".equals(request.getMethod())) {
            Object isAuthenticated = request.getSession().getAttribute(AUTHENTICATED_SESSION_ATTRIBUTE);
            if (isAuthenticated != null && ((boolean) isAuthenticated)) {
                return null;
            }

            UriBuilder urlBuilder;
            try {
                urlBuilder = UriBuilder.fromUri(configurationService.retrieveCaptchaExternalApiUrlBase());
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

                HttpHeaders headers = new HttpHeaders();
                if (StringUtils.isNotBlank(this.apiKey)) {
                    headers.set(CoreCommonConstants.API_KEY_PARAMETER, this.apiKey);
                }

                HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        requestEntity,
                        Void.class
                );
                return null;
            } catch (HttpStatusCodeException e) {
                return Response.status(e.getStatusCode().value()).type(MediaType.APPLICATION_JSON_TYPE).entity(e.getResponseBodyAsString()).build();
            }
        } else {
            return null;
        }
    }
}
