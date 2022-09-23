package org.siemac.metamac.portal.mapper;

import org.siemac.metamac.portal.dto.Query;
import org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Dataset;

public class Query2DtoMapper {

    /*******
     * EXTERNAL
     *
     * @param relatedDataset
     *******/
    public Query queryExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query source, Dataset relatedDataset) {
        if (source == null) {
            return null;
        }

        Query target = new Query();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(relatedDataset.getMetadata().getKeywords());

        return target;
    }

    /*******
     * INTERNAL
     *
     * @param relatedDataset
     *******/
    public Query queryInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Query source, Dataset relatedDataset) {
        if (source == null) {
            return null;
        }

        Query target = new Query();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(relatedDataset.getMetadata().getKeywords());

        return target;
    }

}