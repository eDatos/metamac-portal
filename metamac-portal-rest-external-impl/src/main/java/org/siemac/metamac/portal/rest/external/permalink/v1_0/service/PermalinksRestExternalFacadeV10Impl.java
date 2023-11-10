package org.siemac.metamac.portal.rest.external.permalink.v1_0.service;

import static org.siemac.metamac.portal.rest.external.RestExternalConstantsPrivate.SERVICE_CONTEXT;

import javax.ws.rs.core.Response;

import org.siemac.metamac.portal.rest.common.permalink.v1_0.service.PermalinksRestCommonFacadeV10;
import org.siemac.metamac.portal.rest.common.service.utils.PortalRestUtils;
import org.siemac.metamac.portal.rest.external.permalink.v1_0.mapper.PermalinksDo2RestMapperV10Impl;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("permalinksRestExternalFacadeV10")
public class PermalinksRestExternalFacadeV10Impl implements PermalinksV1_0 {

    @Autowired
    private PermalinksRestCommonFacadeV10 permalinksRestCommonFacadeV10;

    @Autowired
    private PermalinksDo2RestMapperV10Impl permalinksDo2RestMapperV10;


    @Override
    public Permalink retrievePermalinkByIdXml(String id) {
        org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = permalinksRestCommonFacadeV10.retrievePermalinkByIdXml(id, SERVICE_CONTEXT);
        try {
            return permalinksDo2RestMapperV10.toPermalink(permalinkEntity);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    @Override
    public Response retrievePermalinkByIdJson(String id) {
        return permalinksRestCommonFacadeV10.retrievePermalinkByIdJson(id, SERVICE_CONTEXT);
    }

    @Override
    public Permalink createPermalink(Permalink permalink) {
        org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = permalinksRestCommonFacadeV10.createPermalink(permalink, SERVICE_CONTEXT);
        try {
            return permalinksDo2RestMapperV10.toPermalink(permalinkEntity);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }
}