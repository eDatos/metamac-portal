package org.siemac.metamac.portal.rest.external;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;

public class RestExternalConstantsPrivate extends RestCommonConstants {

    public static final ServiceContext SERVICE_CONTEXT = new ServiceContext("restExternal", "restExternal", "restExternal");
    public static final String AUTHENTICATED_SESSION_ATTRIBUTE = "authenticated";
}
