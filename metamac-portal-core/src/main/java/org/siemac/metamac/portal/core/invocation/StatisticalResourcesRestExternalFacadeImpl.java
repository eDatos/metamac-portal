package org.siemac.metamac.portal.core.invocation;

import java.util.List;

import org.apache.cxf.jaxrs.client.WebClient;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component("statisticalResourcesRestExternalFacade")
public class StatisticalResourcesRestExternalFacadeImpl implements StatisticalResourcesRestExternalFacade {

    private final Logger       logger = LoggerFactory.getLogger(StatisticalResourcesRestExternalFacadeImpl.class);

    @Autowired
    @Qualifier("metamacApisLocatorRestExternal")
    private MetamacApisLocator restApiLocator;

    @Override
    public Dataset retrieveDataset(String agencyID, String resourceID, String version, List<String> lang, String fields, String dimensionSelection) {
        try {
            return restApiLocator.getStatisticalResourcesV1_0().retrieveDataset(agencyID, resourceID, version, lang, fields, null, dimensionSelection);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    @Override
    public Query retrieveQuery(String agencyID, String resourceID, List<String> lang, String fields, String dimensionSelection) {
        try {
            return restApiLocator.getStatisticalResourcesV1_0().retrieveQuery(agencyID, resourceID, lang, fields, null, dimensionSelection);
        } catch (Exception e) {
            throw toRestException(e);
        }
    }

    private RestException toRestException(Exception e) {
        logger.error("Error", e);
        return RestExceptionUtils.toRestException(e, WebClient.client(restApiLocator.getStatisticalResourcesV1_0()));
    }
}
