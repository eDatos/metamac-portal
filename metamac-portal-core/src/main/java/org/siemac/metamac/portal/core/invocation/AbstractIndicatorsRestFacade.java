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
            this.apiKey = "INTERNAL".equals(configurationService.retrieveInstallationType())
                    ? configurationService.retrievePortalInternalApiKey()
                    : configurationService.retrievePortalApiKey();
        } catch (MetamacException e) {
            this.apiKey = "";
        }
    }

    protected abstract String getRestApiLocatorEndpoint();

    public IndicatorType retrieveIndicator(String indicatorCode) {
        try {
            HttpHeaders headers = new HttpHeaders();
            if (StringUtils.isNotBlank(apiKey)) {
                headers.set(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
            }

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            ResponseEntity<IndicatorType> response = restTemplate.exchange(
                    getIndicatorRequest(indicatorCode).toString(),
                    HttpMethod.GET,
                    requestEntity,
                    IndicatorType.class
            );
            return response.getBody();
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

            HttpHeaders headers = new HttpHeaders();
            if (StringUtils.isNotBlank(apiKey)) {
                headers.set(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
            }

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
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

    private StringBuilder getIndicatorRequest(String indicatorCode) {
        return getIndicatorBaseRequest().append("/").append(indicatorCode);
    }

    private StringBuilder getIndicatorBaseRequest() {
        StringBuilder indicatorBaseRequest = new StringBuilder();
        return indicatorBaseRequest.append(getRestApiLocatorEndpoint()).append("/v1.0").append("/indicators");
    }

}
