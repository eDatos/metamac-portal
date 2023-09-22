package org.siemac.metamac.portal.rest.common.service;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.portal.core.domain.Permalink;

public interface PortalRestCommonService {

    public Permalink retrievePermalink(ServiceContext ctx, String code);
    public Permalink createPermalink(ServiceContext ctx, Permalink permalink);
}
