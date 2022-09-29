package org.siemac.metamac.portal.mapper;

import org.siemac.metamac.portal.dto.Dataset;

public class Dataset2DtoMapper {

    /******* EXTERNAL *******/
    public Dataset datasetExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset source) {
        if (source == null) {
            return null;
        }

        Dataset target = new Dataset();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());

        return target;
    }

    /******* INTERNAL *******/
    public Dataset datasetInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Dataset source) {
        if (source == null) {
            return null;
        }

        Dataset target = new Dataset();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());

        return target;
    }

}