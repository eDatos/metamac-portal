package org.siemac.metamac.portal.mapper;

import org.siemac.metamac.portal.dto.Query;

public class Query2DtoMapper {

    /*******
     * EXTERNAL
     *******/
    public Query queryExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query source) {
        if (source == null) {
            return null;
        }

        Query target = new Query();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());

        return target;
    }

    /*******
     * INTERNAL
     *******/
    public Query queryInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Query source) {
        if (source == null) {
            return null;
        }

        Query target = new Query();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());

        return target;
    }

}