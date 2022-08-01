package org.siemac.metamac.portal.rest.external;

import org.siemac.metamac.rest.api.constants.RestApiConstants;

public class RestExternalConstants extends RestApiConstants {

    public static final String FIELD_EXCLUDE_ATTRIBUTES = "-attributes";

    public static String       API_VERSION_1_0          = "v1.0";

    // Permalinks
    public static String       API_PERMALINKS_NAME      = "permalinks";
    public static String       LINK_SUBPATH_PERMALINK   = "permalinks";
    public static String       KIND_PERMALINK           = API_PERMALINKS_NAME + KIND_SEPARATOR + "permalink";

    // Data export
    public static String       PARAMETER_SELECTION      = "selection";
}
