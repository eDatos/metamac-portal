package org.siemac.metamac.portal.rest.common.permalink.v1_0.service;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;

import org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper.PermalinksDo2RestMapperV10;
import org.siemac.metamac.portal.rest.common.permalink.v1_0.mapper.PermalinksRest2DoMapperV10;
import org.siemac.metamac.portal.rest.common.service.PortalRestCommonService;
import org.siemac.metamac.portal.rest.common.service.utils.PortalRestUtils;
import org.siemac.metamac.rest.permalinks.v1_0.domain.Permalink;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("permalinksRestCommonFacadeV10")
public class PermalinksRestCommonFacadeV10Impl implements PermalinksRestCommonFacadeV10{

    @Autowired
    private PortalRestCommonService    commonService;

    @Autowired
    private PermalinksDo2RestMapperV10 permalinksDo2RestMapper;

    @Autowired
    private PermalinksRest2DoMapperV10 permalinksRest2DoMapperV10;

    @Override
    public Permalink retrievePermalinkByIdXml(String id, ServiceContext serviceContext) {
        try {
            org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = commonService.retrievePermalink(serviceContext, id);
            return permalinksDo2RestMapper.toPermalink(permalinkEntity);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    @Override
    public Response retrievePermalinkByIdJson(String id, ServiceContext serviceContext) {
        try {
            org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = commonService.retrievePermalink(serviceContext, id);
            return Response.status(Status.OK).type(MediaType.APPLICATION_JSON).entity(permalinkEntity.getContent()).build();
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    @Override
    public Permalink createPermalink(Permalink permalink, ServiceContext serviceContext) {
        try {
            // Transform and create
            org.siemac.metamac.portal.core.domain.Permalink permalinkEntity = permalinksRest2DoMapperV10.toPermalink(permalink);
            permalinkEntity = commonService.createPermalink(serviceContext, permalinkEntity);

            // Transform
            return permalinksDo2RestMapper.toPermalink(permalinkEntity);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }
}