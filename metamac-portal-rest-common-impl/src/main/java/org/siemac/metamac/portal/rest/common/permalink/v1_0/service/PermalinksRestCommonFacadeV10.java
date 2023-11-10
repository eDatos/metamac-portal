package org.siemac.metamac.portal.rest.common.permalink.v1_0.service;

import javax.ws.rs.core.Response;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.portal.core.domain.Permalink;

public interface PermalinksRestCommonFacadeV10 {

    Permalink retrievePermalinkByIdXml(String id, ServiceContext serviceContext);

    Response retrievePermalinkByIdJson(String id, ServiceContext serviceContext);

    Permalink createPermalink(org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink permalink, ServiceContext serviceContext);
}