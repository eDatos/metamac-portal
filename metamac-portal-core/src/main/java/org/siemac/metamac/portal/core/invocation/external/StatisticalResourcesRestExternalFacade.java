package org.siemac.metamac.portal.core.invocation.external;

import java.util.List;

import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.QueryBase;

public interface StatisticalResourcesRestExternalFacade {

    public DatasetBase retrieveDataset(String agencyID, String resourceID, String version, List<String> lang, String fields, String dimensionSelection);

    public QueryBase retrieveQuery(String agencyID, String resourceID, List<String> lang, String fields, String dimensionSelection);
}
