package org.siemac.metamac.portal.rest.internal.permalink.v1_0.service;

import static org.siemac.metamac.portal.rest.internal.RestInternalConstantsPrivate.SERVICE_CONTEXT;

import javax.ws.rs.core.Response;

import org.siemac.metamac.portal.rest.common.permalink.v1_0.service.PermalinksRestCommonFacadeV10;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("permalinksRestInternalFacadeV10")
public class PermalinksRestInternalFacadeV10Impl implements PermalinksV1_0 {

    @Autowired
    private PermalinksRestCommonFacadeV10 permalinksRestCommonFacadeV10;


    @Override
    public Permalink retrievePermalinkByIdXml(String id) {
        return permalinksRestCommonFacadeV10.retrievePermalinkByIdXml(id, SERVICE_CONTEXT);
    }

    @Override
    public Response retrievePermalinkByIdJson(String id) {
        return permalinksRestCommonFacadeV10.retrievePermalinkByIdJson(id, SERVICE_CONTEXT);
    }

    @Override
    public Permalink createPermalink(Permalink permalink) {
        return permalinksRestCommonFacadeV10.createPermalink(permalink, SERVICE_CONTEXT);
    }
}