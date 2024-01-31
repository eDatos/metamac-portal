package org.siemac.metamac.portal.rest.internal;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;

public class RestInternalConstantsPrivate extends RestCommonConstants {

    public static final ServiceContext SERVICE_CONTEXT = new ServiceContext("restInternal", "restInternal", "restInternal");
    public static final String AUTHENTICATED_SESSION_ATTRIBUTE = "authenticated";
}
