package org.siemac.metamac.portal.core.invocation.external;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;

@Component("indicatorsRestExternalFacade")
public class IndicatorsRestExternalFacadeImpl implements IndicatorsRestExternalFacade {

    private final Logger       logger       = LoggerFactory.getLogger(IndicatorsRestExternalFacadeImpl.class);

    RestTemplate               restTemplate = new RestTemplate();

    @Autowired
    @Qualifier("metamacApisLocatorRestExternal")
    private MetamacApisLocator restApiLocator;

    @Override
    public IndicatorType retrieveIndicator(String indicatorCode) {
        try {
            return restTemplate.getForObject(getIndicatorRequest(indicatorCode).toString(), IndicatorType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    @Override
    public DataType retrieveIndicatorData(String indicatorCode, String selectedRepresentations) {
        try {
            StringBuilder indicatorDataRequest = getIndicatorRequest(indicatorCode).append("/data");

            if (!StringUtils.EMPTY.equals(selectedRepresentations)) {
                indicatorDataRequest.append("?").append("representation=").append(selectedRepresentations);
            }

            return restTemplate.getForObject(indicatorDataRequest.toString(), DataType.class);
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
        return indicatorBaseRequest.append(restApiLocator.getIndicatorsRestExternalFacadeEndpoint()).append("/v1.0").append("/indicators");
    }
}
