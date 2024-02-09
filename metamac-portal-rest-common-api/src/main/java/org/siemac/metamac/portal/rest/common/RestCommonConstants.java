package org.siemac.metamac.portal.rest.common;

import org.siemac.metamac.rest.api.constants.RestApiConstants;

public class RestCommonConstants extends RestApiConstants {

    public static final String FIELD_EXCLUDE_ATTRIBUTES = "-attributes";

    public static final String API_VERSION_1_0          = "v1.0";

    // Permalinks
    public static final String API_PERMALINKS_NAME      = "permalinks";
    public static final String LINK_SUBPATH_PERMALINK   = "permalinks";
    public static final String KIND_PERMALINK           = API_PERMALINKS_NAME + KIND_SEPARATOR + "permalink";

    // Data export
    public static final String PARAMETER_SELECTION      = "selection";
}
