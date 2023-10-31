package org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper;

import javax.annotation.PostConstruct;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;
import org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper.PermalinksDo2RestMapperV10;
import org.siemac.metamac.rest.utils.RestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PermalinksDo2RestMapperV10Impl extends PermalinksDo2RestMapperV10 {

    @Autowired
    private ConfigurationService configurationService;

    private String               permalinksApiExternalEndpointV10;

    @PostConstruct
    public void init() throws Exception {
        // ENDPOINTS
        // Permalinks external Api V1.0
        String permalinksApiExternalEndpoint = configurationService.retrievePortalExternalApisPermalinksUrlBase();
        permalinksApiExternalEndpointV10 = RestUtils.createLink(permalinksApiExternalEndpoint, RestCommonConstants.API_VERSION_1_0);
    }

}