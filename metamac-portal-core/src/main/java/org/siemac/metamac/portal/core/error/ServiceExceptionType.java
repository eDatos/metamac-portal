package org.siemac.metamac.portal.core.error;

import org.siemac.metamac.core.common.exception.CommonServiceExceptionType;

public class ServiceExceptionType extends CommonServiceExceptionType {

    public static final CommonServiceExceptionType PERMALINK_NOT_FOUND = create("exception.portal.permalink.not_found");
    public static final CommonServiceExceptionType DATASET_NO_DATA = create("exception.portal.empty_data");
}
