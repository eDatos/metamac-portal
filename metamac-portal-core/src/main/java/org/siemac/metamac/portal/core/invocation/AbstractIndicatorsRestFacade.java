package org.siemac.metamac.portal.core.invocation;

import org.apache.commons.lang.StringUtils;
import org.siemac.edatos.core.common.constants.CoreCommonConstants;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;

import javax.annotation.PostConstruct;

@Component("indicatorsRestFacade")
public abstract class AbstractIndicatorsRestFacade {

    private final Logger logger = LoggerFactory.getLogger(AbstractIndicatorsRestFacade.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PortalConfiguration configurationService;

    private String apiKey;

    @PostConstruct
    public void init() {
        try {
            this.apiKey = configurationService.retrievePortalApiKeyByInstallationType();
        } catch (MetamacException e) {
            logger.warn("No se ha encontrado la propiedad api key de portal para la instalación actual (\"metamac.portal.rest.api_key\" o \"metamac.portal.rest.internal.api_key\").");
        }
    }

    protected abstract String getRestApiLocatorEndpoint();

    public IndicatorType retrieveIndicator(String indicatorCode) {
        try {
            return buildGetRequest(apiKey, getIndicatorRequest(indicatorCode).toString(), IndicatorType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    public DataType retrieveIndicatorData(String indicatorCode, String selectedRepresentations) {
        try {
            StringBuilder indicatorDataRequest = getIndicatorRequest(indicatorCode).append("/data");

            if (!StringUtils.EMPTY.equals(selectedRepresentations)) {
                indicatorDataRequest.append("?").append("representation=").append(selectedRepresentations);
            }

            return buildGetRequest(apiKey, indicatorDataRequest.toString(), DataType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    private StringBuilder getIndicatorRequest(String indicatorCode) {
        return getIndicatorBaseRequest().append("/").append(indicatorCode);
    }

    private StringBuilder getIndicatorBaseRequest() {
        StringBuilder indicatorBaseRequest = new StringBuilder();
        return indicatorBaseRequest.append(getRestApiLocatorEndpoint()).append("/v1.0").append("/indicators");
    }

    private <T> T buildGetRequest(String apiKey, String url, Class<T> type) {
        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(apiKey)) {
            headers.set(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
        }

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, type);
        return response.getBody();
    }
}
