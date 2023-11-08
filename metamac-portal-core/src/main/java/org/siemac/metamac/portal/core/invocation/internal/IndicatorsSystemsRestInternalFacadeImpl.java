package org.siemac.metamac.portal.core.invocation.internal;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorsSystemType;

@Component("indicatorsSystemRestExternalFacade")
public class IndicatorsSystemsRestInternalFacadeImpl implements IndicatorsSystemsRestInternalFacade {

    private final Logger       logger       = LoggerFactory.getLogger(IndicatorsSystemsRestInternalFacadeImpl.class);

    RestTemplate               restTemplate = new RestTemplate();

    @Autowired
    @Qualifier("metamacInternalApisLocatorRestExternal")
    private MetamacInternalApisLocator restApiLocator;

    @Override
    public IndicatorInstanceType retrieveIndicatorInstanceByCode(String idIndicatorSystem, String idIndicatorInstance) {
        try {
            return restTemplate.getForObject(getIndicatorInstanceRequest(idIndicatorSystem, idIndicatorInstance).toString(), IndicatorInstanceType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    @Override
    public DataType retrieveIndicatorInstanceDataByCode(String idIndicatorSystem, String idIndicatorInstance, String selectedRepresentations) {
        try {
            StringBuilder indicatorDataRequest = getIndicatorInstanceRequest(idIndicatorSystem, idIndicatorInstance).append("/data");

            if (!StringUtils.EMPTY.equals(selectedRepresentations)) {
                indicatorDataRequest.append("?").append("representation=").append(selectedRepresentations);
            }

            return restTemplate.getForObject(indicatorDataRequest.toString(), DataType.class);
        } catch (Exception e) {
            logger.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    @Override
    public IndicatorsSystemType retrieveIndicatorsSystem(String idIndicatorSystem) {
        try {
            return restTemplate.getForObject(getIndicatorSystemRequest(idIndicatorSystem).toString(), IndicatorsSystemType.class);
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
        return indicatorInstanceBaseRequest.append(restApiLocator.getIndicatorsRestInternalFacadeEndpoint()).append("/v1.0").append("/indicatorsSystems");
    }

}
