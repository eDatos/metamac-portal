package org.siemac.metamac.portal.mapper;

import org.siemac.metamac.portal.dto.Chapter;
import org.siemac.metamac.portal.dto.Collection;
import org.siemac.metamac.portal.dto.CollectionData;
import org.siemac.metamac.portal.dto.CollectionNode;
import org.siemac.metamac.portal.dto.CollectionNodes;
import org.siemac.metamac.portal.dto.Table;

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

        return target;
    }

    public CollectionData collectionDataExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionData source) {
        if (source == null) {
            return null;
        }

        CollectionData target = new CollectionData();
        target.setNodes(collectionNodesExternalToDto(source.getNodes()));

        return target;
    }

    public CollectionNodes collectionNodesExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNodes source) {
        if (source == null) {
            return null;
        }

        CollectionNodes target = new CollectionNodes();
        for (int i = 0; i < source.getNodes().size(); i++) {
            target.getNodes().add(collectionNodeExternalToDto(source.getNodes().get(i)));
        }

        return target;
    }

    public CollectionNode collectionNodeExternalToDto(org.siemac.metamac.rest.statistical_resources.v1_0.domain.CollectionNode source) {
        if (source == null) {
            return null;
        }

        if (source instanceof org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table) {

            Table target = new Table();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setDataset(((org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table) source).getDataset());
            target.setQuery(((org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table) source).getQuery());
            target.setMultidataset(((org.siemac.metamac.rest.statistical_resources.v1_0.domain.Table) source).getMultidataset());

            return target;

        } else if (source instanceof org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter) {

            Chapter target = new Chapter();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setNodes(collectionNodesExternalToDto(((org.siemac.metamac.rest.statistical_resources.v1_0.domain.Chapter) source).getNodes()));

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
        target.setKeywords(source.getMetadata().getKeywords());
        target.setData(collectionDataInternalToDto(source.getData()));

        return target;
    }

    public CollectionData collectionDataInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.CollectionData source) {
        if (source == null) {
            return null;
        }

        CollectionData target = new CollectionData();
        target.setNodes(collectionNodesInternalToDto(source.getNodes()));

        return target;
    }

    public CollectionNodes collectionNodesInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.CollectionNodes source) {
        if (source == null) {
            return null;
        }

        CollectionNodes target = new CollectionNodes();
        for (int i = 0; i < source.getNodes().size(); i++) {
            target.getNodes().add(collectionNodeInternalToDto(source.getNodes().get(i)));
        }

        return target;
    }

    public CollectionNode collectionNodeInternalToDto(org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.CollectionNode source) {
        if (source == null) {
            return null;
        }

        if (source instanceof org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Table) {

            Table target = new Table();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setDataset(((org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Table) source).getDataset());
            target.setQuery(((org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Table) source).getQuery());
            target.setMultidataset(((org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Table) source).getMultidataset());

            return target;

        } else if (source instanceof org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Chapter) {

            Chapter target = new Chapter();
            target.setName(source.getName());
            target.setDescription(source.getDescription());
            target.setNodes(collectionNodesInternalToDto(((org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Chapter) source).getNodes()));

            return target;

        }
        return null;
    }

}