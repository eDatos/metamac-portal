package org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper;



import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;
import org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper.PermalinksDo2RestMapperV10;
import org.siemac.metamac.rest.utils.RestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PermalinksDo2RestMapperV10Impl extends PermalinksDo2RestMapperV10 {

    @Autowired
    private ConfigurationService configurationService;

    @Override
    public void initPermalink() throws Exception {
        // ENDPOINTS
        // Permalinks external Api V1.0
        String permalinksApiExternalEndpoint = configurationService.retrievePortalExternalApisPermalinksUrlBase();
        permalinksApiExternalEndpointV10 = RestUtils.createLink(permalinksApiExternalEndpoint, RestCommonConstants.API_VERSION_1_0);
    }

    @Override
    public org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink toPermalink(org.siemac.metamac.portal.core.domain.Permalink source) throws Exception {
        if (source == null) {
            return null;
        }
        org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink target = new org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink();
        target.setKind(RestCommonConstants.KIND_PERMALINK);
        target.setId(source.getCode());
        target.setContent(source.getContent());
        target.setSelfLink(toPermalinkSelfLink(source));
        return target;
    }

}