package org.siemac.metamac.portal.mapper;

import org.siemac.metamac.portal.dto.Multidataset;
import org.siemac.metamac.portal.dto.MultidatasetData;
import org.siemac.metamac.portal.dto.MultidatasetNode;
import org.siemac.metamac.portal.dto.MultidatasetNodes;
import org.siemac.metamac.portal.dto.MultidatasetTable;

public class Multidataset2DtoMapper {

    /******* EXTERNAL *******/
    public Multidataset multidatasetExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.Multidataset source) {
        if (source == null) {
            return null;
        }

        Multidataset target = new Multidataset();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());
        target.setData(multidatasetDataExternalToDto(source.getData()));

        return target;
    }

    public MultidatasetData multidatasetDataExternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetData source) {
        if (source == null) {
            return null;
        }

        MultidatasetData target = new MultidatasetData();
        target.setNodes(multidatasetNodesExternalToDto(source.getNodes()));

        return target;
    }

    public MultidatasetNodes multidatasetNodesExternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetNodes source) {
        if (source == null) {
            return null;
        }

        MultidatasetNodes target = new MultidatasetNodes();
        for (int i = 0; i < source.getNodes().size(); i++) {
            target.getNodes().add(multidatasetNodeExternalToDto(source.getNodes().get(i)));
        }

        return target;
    }

    public MultidatasetNode multidatasetNodeExternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetNode source) {
        if (source == null) {
            return null;
        }

        MultidatasetTable target = new MultidatasetTable();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setDataset(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetTable) source).getDataset());
        target.setQuery(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetTable) source).getQuery());

        return target;
    }

    /******* INTERNAL *******/
    public Multidataset multidatasetInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Multidataset source) {
        if (source == null) {
            return null;
        }

        Multidataset target = new Multidataset();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());
        target.setData(multidatasetDataInternalToDto(source.getData()));

        return target;
    }

    public MultidatasetData multidatasetDataInternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetData source) {
        if (source == null) {
            return null;
        }

        MultidatasetData target = new MultidatasetData();
        target.setNodes(multidatasetNodesInternalToDto(source.getNodes()));

        return target;
    }

    public MultidatasetNodes multidatasetNodesInternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetNodes source) {
        if (source == null) {
            return null;
        }

        MultidatasetNodes target = new MultidatasetNodes();
        for (int i = 0; i < source.getNodes().size(); i++) {
            target.getNodes().add(multidatasetNodeInternalToDto(source.getNodes().get(i)));
        }

        return target;
    }

    public MultidatasetNode multidatasetNodeInternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetNode source) {
        if (source == null) {
            return null;
        }

        MultidatasetTable target = new MultidatasetTable();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setDataset(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetTable) source).getDataset());
        target.setQuery(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MultidatasetTable) source).getQuery());

        return target;
    }

}