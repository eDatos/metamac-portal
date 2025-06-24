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
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorsSystemType;

import javax.annotation.PostConstruct;

@Component("indicatorsSystemRestFacade")
public abstract class AbstractIndicatorsSystemsRestFacade {

    private final Logger logger = LoggerFactory.getLogger(AbstractIndicatorsSystemsRestFacade.class);

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
    public IndicatorInstanceType retrieveIndicatorInstanceByCode(String idIndicatorSystem, String idIndicatorInstance) {
        try {
            HttpEntity<Void> requestEntity = new HttpEntity<>(buildHeaders());
            ResponseEntity<IndicatorInstanceType> response = restTemplate.exchange(
                    getIndicatorInstanceRequest(idIndicatorSystem, idIndicatorInstance).toString(),
                    HttpMethod.GET,
                    requestEntity,
                    IndicatorInstanceType.class
            );
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    public DataType retrieveIndicatorInstanceDataByCode(String idIndicatorSystem, String idIndicatorInstance, String selectedRepresentations) {
        try {
            StringBuilder indicatorDataRequest = getIndicatorInstanceRequest(idIndicatorSystem, idIndicatorInstance).append("/data");

            if (!StringUtils.EMPTY.equals(selectedRepresentations)) {
                indicatorDataRequest.append("?").append("representation=").append(selectedRepresentations);
            }

            HttpEntity<Void> requestEntity = new HttpEntity<>(buildHeaders());
            ResponseEntity<DataType> response = restTemplate.exchange(
                    indicatorDataRequest.toString(),
                    HttpMethod.GET,
                    requestEntity,
                    DataType.class
            );
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    public IndicatorsSystemType retrieveIndicatorsSystem(String idIndicatorSystem) {
        try {
            HttpEntity<Void> requestEntity = new HttpEntity<>(buildHeaders());
            ResponseEntity<IndicatorsSystemType> response = restTemplate.exchange(
                    getIndicatorSystemRequest(idIndicatorSystem).toString(),
                    HttpMethod.GET,
                    requestEntity,
                    IndicatorsSystemType.class
            );
            return response.getBody();
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    private StringBuilder getIndicatorInstanceRequest(String idIndicatorSystem, String idIndicatorInstance) {
        return getIndicatorSystemRequest(idIndicatorSystem).append("/indicatorsInstances").append("/").append(idIndicatorInstance);
    }

    private StringBuilder getIndicatorSystemRequest(String idIndicatorSystem) {
        return getIndicatorInstanceBaseRequest().append("/").append(idIndicatorSystem);
    }

    private StringBuilder getIndicatorInstanceBaseRequest() {
        StringBuilder indicatorInstanceBaseRequest = new StringBuilder();
        return indicatorInstanceBaseRequest.append(getRestApiLocatorEndpoint()).append("/v1.0").append("/indicatorsSystems");
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        if (StringUtils.isNotBlank(apiKey)) {
            headers.set(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
        }

        return headers;
    }
}
