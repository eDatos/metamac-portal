package org.siemac.metamac.portal.core.invocation.internal;

import java.util.List;

import org.apache.cxf.jaxrs.client.WebClient;
import org.siemac.metamac.portal.core.invocation.MetamacApisLocator;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.QueryBase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component("statisticalResourcesRestInternalFacade")
public class StatisticalResourcesRestInternalFacadeImpl implements StatisticalResourcesRestInternalFacade {

    private final Logger       logger = LoggerFactory.getLogger(StatisticalResourcesRestInternalFacadeImpl.class);

    @Autowired
    @Qualifier("metamacApisLocatorRest")
    private MetamacApisLocator restApiLocator;

    @Override
    public DatasetBase retrieveDataset(String agencyID, String resourceID, String version, List<String> lang, String fields, String dimensionSelection) {
        try {
            return restApiLocator.getStatisticalResourcesInternalV1_0().retrieveDataset(agencyID, resourceID, version, lang, fields, null, dimensionSelection, null);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    @Override
    public QueryBase retrieveQuery(String agencyID, String resourceID, List<String> lang, String fields, String dimensionSelection) {
        try {
            return restApiLocator.getStatisticalResourcesInternalV1_0().retrieveQuery(agencyID, resourceID, lang, fields, null, dimensionSelection, null);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    private RestException toRestException(Exception e) {
        logger.error("Error", e);
        return RestExceptionUtils.toRestException(e, WebClient.client(restApiLocator.getStatisticalResourcesInternalV1_0()));
    }
}
