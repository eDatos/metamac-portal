package org.siemac.metamac.portal.rest.common.service;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.portal.core.domain.Permalink;

public interface PortalRestCommonService {

    Permalink retrievePermalink(ServiceContext ctx, String code);
    Permalink createPermalink(ServiceContext ctx, Permalink permalink);
}
