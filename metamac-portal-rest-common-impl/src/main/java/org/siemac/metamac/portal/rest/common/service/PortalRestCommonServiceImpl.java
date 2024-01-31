package org.siemac.metamac.portal.rest.common.service;


import javax.ws.rs.core.Response.Status;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.domain.Permalink;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.serviceapi.PermalinksService;
import org.siemac.metamac.portal.rest.common.exception.RestServiceExceptionType;
import org.siemac.metamac.portal.rest.common.service.utils.PortalRestUtils;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("portalRestCommonService")
public class PortalRestCommonServiceImpl implements PortalRestCommonService {

    @Autowired
    private PermalinksService permalinksService;

    @Override
    public Permalink retrievePermalink(ServiceContext ctx, String code) {
        try {
            // Retrieve
            Permalink permalink = null;
            try {
                permalink = permalinksService.retrievePermalinkByCode(ctx, code);
            } catch (MetamacException e) {
                if (e.getExceptionItems().size() == 1 && ServiceExceptionType.PERMALINK_NOT_FOUND.getCode().equals(e.getExceptionItems().get(0).getCode())) {
                    permalink = null;
                } else {
                    throw e;
                }
            }
            if (permalink == null) {
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.PERMALINK_NOT_FOUND, code);
                throw new RestException(exception, Status.NOT_FOUND);
            }
            return permalink;
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }

    @Override
    public Permalink createPermalink(ServiceContext ctx, Permalink permalink) {
        try {
            return permalinksService.createPermalink(ctx, permalink);
        } catch (Exception e) {
            throw PortalRestUtils.manageException(e);
        }
    }
}
