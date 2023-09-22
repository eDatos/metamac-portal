package org.siemac.metamac.portal.core.error;

import org.siemac.metamac.core.common.exception.CommonServiceExceptionType;

public class ServiceExceptionType extends CommonServiceExceptionType {

    public static final CommonServiceExceptionType PERMALINK_NOT_FOUND = create("exception.portal.permalink.not_found");
    public static final CommonServiceExceptionType DATASET_NO_DATA = create("exception.statistical_resources.empty_data");
    public static final CommonServiceExceptionType DATASET_NO_FOUND = create("exception.statistical_resources.dataset.not_found");
    public static final CommonServiceExceptionType COLLECTION_NO_FOUND = create("exception.statistical_resources.collection.not_found");
    public static final CommonServiceExceptionType QUERY_NO_FOUND = create("exception.statistical_resources.query.not_found");
    public static final CommonServiceExceptionType MULTIDATASET_NO_FOUND = create("exception.statistical_resources.multidataset.not_found");
    public static final CommonServiceExceptionType COLLECTION_NO_DATA = create("exception.statistical_resources.collection.empty_data");
    public static final CommonServiceExceptionType MULTIDATASET_NO_DATA = create("exception.statistical_resources.multidataset.empty_data");

    public static CommonServiceExceptionType lookup(final String code) {
        return LOOKUP.get(code);
    }
}
