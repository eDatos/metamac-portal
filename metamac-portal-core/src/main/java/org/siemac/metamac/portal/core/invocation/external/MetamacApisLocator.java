package org.siemac.metamac.portal.core.invocation.external;

import javax.annotation.PostConstruct;

import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.apache.cxf.jaxrs.client.WebClient;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.srm.rest.external.v1_0.service.SrmRestExternalFacadeV10;
import org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("metamacApisLocatorRestExternal")
public class MetamacApisLocator {

    @Autowired
    private ConfigurationService     configurationService;

    private StatisticalResourcesV1_0 statisticalResourcesV1_0             = null;
    private SrmRestExternalFacadeV10 srmRestExternalFacadeV10             = null;
    private String                   indicatorsRestExternalFacadeEndpoint = null;
    private String                   organisationUrn                      = null;

    @PostConstruct
    public void init() throws Exception {
        String statisticalResourcesEndpoint = configurationService.retrieveStatisticalResourcesExternalApiUrlBase();
        statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);

        String srmExternalApiUrlBase = configurationService.retrieveSrmExternalApiUrlBase();
        srmRestExternalFacadeV10 = JAXRSClientFactory.create(srmExternalApiUrlBase, SrmRestExternalFacadeV10.class, null, true);

        indicatorsRestExternalFacadeEndpoint = configurationService.retrieveIndicatorsExternalApiUrlBase();

        organisationUrn = configurationService.retrieveOrganisationUrn();
    }

    public StatisticalResourcesV1_0 getStatisticalResourcesV1_0() {
        // reset thread context
        WebClient.client(statisticalResourcesV1_0).reset();
        WebClient.client(statisticalResourcesV1_0).accept("application/xml");

        return statisticalResourcesV1_0;
    }

    public SrmRestExternalFacadeV10 getSrmRestExternalFacadeV10() {
        // reset thread context
        WebClient.client(srmRestExternalFacadeV10).reset();
        WebClient.client(srmRestExternalFacadeV10).accept("application/xml");

        return srmRestExternalFacadeV10;
    }

    public String getIndicatorsRestExternalFacadeEndpoint() {
        return indicatorsRestExternalFacadeEndpoint;
    }

    public String getOrganisationUrn() {
        return organisationUrn;
    }

}
