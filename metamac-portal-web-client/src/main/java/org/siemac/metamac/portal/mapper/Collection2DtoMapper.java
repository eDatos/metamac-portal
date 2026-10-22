package org.siemac.metamac.portal.mapper;

import org.siemac.metamac.portal.dto.*;

public class Collection2DtoMapper {

    /******* EXTERNAL *******/
    public Collection collectionExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.Collection source) {
        if (source == null) {
            return null;
        }

        Collection target = new Collection();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());
        target.setData(collectionDataExternalToDto(source.getData()));
        target.setMetadata(collectionMetadataExternalToDto(source.getMetadata()));

        return target;
    }

    public CollectionData collectionDataExternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CollectionData source) {
        if (source == null) {
            return null;
        }

        CollectionData target = new CollectionData();
        target.setNodes(collectionNodesExternalToDto(source.getNodes()));

        return target;
    }

    public CollectionMetadata collectionMetadataExternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CollectionMetadataBase source) {
        CollectionMetadata target = new CollectionMetadata();
        target.setLastUpdate(source.getLastUpdate());
        target.setStatisticalOperation(source.getStatisticalOperation());
        return target;
    }

    public CollectionNodes collectionNodesExternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CollectionNodes source) {
        if (source == null) {
            return null;
        }

        CollectionNodes target = new CollectionNodes();
        for (int i = 0; i < source.getNodes().size(); i++) {
            target.getNodes().add(collectionNodeExternalToDto(source.getNodes().get(i)));
        }

        return target;
    }

    public CollectionNode collectionNodeExternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CollectionNode source) {
        if (source == null) {
            return null;
        }

        if (source instanceof org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) {

            Table target = new Table();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setDataset(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getDataset());
            target.setQuery(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getQuery());
            target.setMultidataset(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getMultidataset());
            target.setUrl(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getUrl());
            target.setPublication(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getPublication());

            return target;

        } else if (source instanceof org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Chapter) {

            Chapter target = new Chapter();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setOpening(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Chapter) source).getOpening());
            target.setNodes(collectionNodesExternalToDto(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Chapter) source).getNodes()));

            return target;

        }
        return null;
    }

    /******* INTERNAL *******/
    public Collection collectionInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Collection source) {
        if (source == null) {
            return null;
        }

        Collection target = new Collection();
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setKeywords(source.getKeywords());
        target.setData(collectionDataInternalToDto(source.getData()));
        target.setMetadata(collectionMetadataInternalToDto(source.getMetadata()));

        return target;
    }

    public CollectionMetadata collectionMetadataInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.CollectionMetadata source) {
        CollectionMetadata target = new CollectionMetadata();
        target.setLastUpdate(source.getLastUpdate());
        target.setStatisticalOperation(source.getStatisticalOperation());
        return target;
    }

    public CollectionData collectionDataInternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CollectionData source) {
        if (source == null) {
            return null;
        }

        CollectionData target = new CollectionData();
        target.setNodes(collectionNodesInternalToDto(source.getNodes()));

        return target;
    }

    public CollectionNodes collectionNodesInternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CollectionNodes source) {
        if (source == null) {
            return null;
        }

        CollectionNodes target = new CollectionNodes();
        for (int i = 0; i < source.getNodes().size(); i++) {
            target.getNodes().add(collectionNodeInternalToDto(source.getNodes().get(i)));
        }

        return target;
    }

    public CollectionNode collectionNodeInternalToDto(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CollectionNode source) {
        if (source == null) {
            return null;
        }

        if (source instanceof org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) {

            Table target = new Table();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setDataset(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getDataset());
            target.setQuery(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getQuery());
            target.setMultidataset(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getMultidataset());
            target.setUrl(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getUrl());
            target.setPublication(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Table) source).getPublication());

            return target;

        } else if (source instanceof org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Chapter) {

            Chapter target = new Chapter();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setOpening(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Chapter) source).getOpening());
            target.setNodes(collectionNodesInternalToDto(((org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Chapter) source).getNodes()));

            return target;

        }
        return null;
    }

}
