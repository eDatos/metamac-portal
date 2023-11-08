package org.siemac.metamac.portal.core.invocation.external;

import java.util.List;

import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;

public interface StatisticalResourcesRestExternalFacade {

    public Dataset retrieveDataset(String agencyID, String resourceID, String version, List<String> lang, String fields, String dimensionSelection);

    public Query retrieveQuery(String agencyID, String resourceID, List<String> lang, String fields, String dimensionSelection);
}
