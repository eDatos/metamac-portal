package org.siemac.metamac.portal.rest.external.exception;

import org.siemac.metamac.rest.exception.RestCommonServiceExceptionType;

public class RestServiceExceptionType extends RestCommonServiceExceptionType {

    public static final RestCommonServiceExceptionType PERMALINK_NOT_FOUND                      = create("exception.portal.permalink.not_found");
    public static final RestCommonServiceExceptionType DATASET_OBSERVATIONS_EXCEED_MAX_FOR_XLSX = create("exception.portal.dataset.observations_exceed_max_for_xlsx");
}