package org.siemac.metamac.portal.core.invocation;

import javax.annotation.PostConstruct;

import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.apache.cxf.jaxrs.client.WebClient;
import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.srm.rest.external.v1_0.service.SrmRestExternalFacadeV10;
import org.siemac.metamac.srm.rest.internal.v1_0.service.SrmRestInternalFacadeV10;
import org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("metamacApisLocatorRest")
public class MetamacApisLocator {

    @Autowired
    private ConfigurationService     configurationService;

    private StatisticalResourcesV1_0 statisticalResourcesV1_0             = null;
    private SrmRestExternalFacadeV10 srmRestExternalFacadeV10             = null;
    private String                   indicatorsRestExternalFacadeEndpoint = null;
    private String                   organisationUrn                      = null;

    private org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0 statisticalResourcesInternalV1_0 = null;

    private SrmRestInternalFacadeV10 srmRestInternalFacadeV10             = null;
    private String                   indicatorsRestInternalFacadeEndpoint = null;


    @PostConstruct
    public void init() throws Exception {
        organisationUrn = configurationService.retrieveOrganisationUrn();

        String statisticalResourcesEndpoint = configurationService.retrieveStatisticalResourcesExternalApiUrlBase();
        statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint, StatisticalResourcesV1_0.class, null, true);
        String srmExternalApiUrlBase = configurationService.retrieveSrmExternalApiUrlBase();
        srmRestExternalFacadeV10 = JAXRSClientFactory.create(srmExternalApiUrlBase, SrmRestExternalFacadeV10.class, null, true);
        indicatorsRestExternalFacadeEndpoint = configurationService.retrieveIndicatorsExternalApiUrlBase();

        String statisticalResourcesInternalEndpoint = configurationService.retrieveStatisticalResourcesInternalApiUrlBase();
        statisticalResourcesInternalV1_0 = JAXRSClientFactory.create(statisticalResourcesInternalEndpoint, org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0.class, null, true);
        String srmInternalApiUrlBase = configurationService.retrieveSrmInternalApiUrlBase();
        srmRestInternalFacadeV10 = JAXRSClientFactory.create(srmInternalApiUrlBase, SrmRestInternalFacadeV10.class, null, true);
        indicatorsRestInternalFacadeEndpoint = configurationService.retrieveIndicatorsInternalApiUrlBase();

    }

    public String getOrganisationUrn() {
        return organisationUrn;
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


    public org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0 getStatisticalResourcesInternalV1_0() {
        // reset thread context
        WebClient.client(statisticalResourcesInternalV1_0).reset();
        WebClient.client(statisticalResourcesInternalV1_0).accept("application/xml");

        return statisticalResourcesInternalV1_0;
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


}
