package org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper;

import javax.annotation.PostConstruct;

import org.siemac.metamac.portal.rest.common.RestCommonConstants;
import org.siemac.metamac.rest.common.v1_0.domain.ResourceLink;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.siemac.metamac.rest.utils.RestUtils;
import org.springframework.stereotype.Component;

@Component
public abstract class PermalinksDo2RestMapperV10 {

    protected String               permalinksApiExternalEndpointV10;

    @PostConstruct
    public void init() throws Exception {
        // ENDPOINTS
        // Permalinks external Api V1.0
        initPermalink();
    }

    protected abstract void initPermalink() throws Exception;
    protected abstract org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink toPermalink(org.siemac.metamac.portal.core.domain.Permalink source) throws Exception;

    protected ResourceLink toPermalinkSelfLink(org.siemac.metamac.portal.core.domain.Permalink source) {
        ResourceLink target = new ResourceLink();
        target.setKind(RestCommonConstants.KIND_PERMALINK);
        target.setHref(toPermalinkLink(source));
        return target;
    }

    private String toPermalinkLink(org.siemac.metamac.portal.core.domain.Permalink source) {
        String link = RestUtils.createLink(permalinksApiExternalEndpointV10, RestCommonConstants.LINK_SUBPATH_PERMALINK);
        link = RestUtils.createLink(link, source.getCode());
        return link;
    }

}
