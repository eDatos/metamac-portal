package org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper;

import org.siemac.metamac.portal.rest.common.RestCommonConstants;
import org.siemac.metamac.rest.common.v1_0.domain.ResourceLink;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.siemac.metamac.rest.utils.RestUtils;

public abstract class PermalinksDo2RestMapperV10 {

    public String               permalinksApiExternalEndpointV10;

    public Permalink toPermalink(org.siemac.metamac.portal.core.domain.Permalink source) throws Exception {
        if (source == null) {
            return null;
        }
        Permalink target = new Permalink();
        target.setKind(RestCommonConstants.KIND_PERMALINK);
        target.setId(source.getCode());
        target.setContent(source.getContent());
        target.setSelfLink(toPermalinkSelfLink(source));
        return target;
    }

    private ResourceLink toPermalinkSelfLink(org.siemac.metamac.portal.core.domain.Permalink source) {
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
