package org.siemac.metamac.portal.core.invocation.internal;

import javax.annotation.PostConstruct;

import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.apache.cxf.jaxrs.client.WebClient;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.srm.rest.internal.v1_0.service.SrmRestInternalFacadeV10;
import org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("metamacInternalApisLocatorRestExternal")
public class MetamacInternalApisLocator {

    @Autowired
    private ConfigurationService     configurationService;

    private StatisticalResourcesV1_0 statisticalResourcesV1_0             = null;

    private SrmRestInternalFacadeV10 srmRestInternalFacadeV10             = null;
    private String                   indicatorsRestInternalFacadeEndpoint = null;
    private String                   organisationUrn                      = null;

    @PostConstruct
    public void init() throws Exception {
        String statisticalResourcesEndpoint = configurationService.retrieveStatisticalResourcesInternalApiUrlBase();
        statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);

        String srmInternalApiUrlBase = configurationService.retrieveSrmInternalApiUrlBase();
        srmRestInternalFacadeV10 = JAXRSClientFactory.create(srmInternalApiUrlBase, SrmRestInternalFacadeV10.class, null, true);

        indicatorsRestInternalFacadeEndpoint = configurationService.retrieveIndicatorsInternalApiUrlBase();

        organisationUrn = configurationService.retrieveOrganisationUrn();
    }

    public StatisticalResourcesV1_0 getStatisticalResourcesV1_0() {
        // reset thread context
        WebClient.client(statisticalResourcesV1_0).reset();
        WebClient.client(statisticalResourcesV1_0).accept("application/xml");

        return statisticalResourcesV1_0;
    }

    public SrmRestInternalFacadeV10 getSrmRestInternalFacadeV10() {
        // reset thread context
        WebClient.client(srmRestInternalFacadeV10).reset();
        WebClient.client(srmRestInternalFacadeV10).accept("application/xml");

        return srmRestInternalFacadeV10;
    }

    public String getIndicatorsRestInternalFacadeEndpoint() {
        return indicatorsRestInternalFacadeEndpoint;
    }

    public String getOrganisationUrn() {
        return organisationUrn;
    }

}
