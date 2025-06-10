package org.siemac.metamac.portal.rest.common.export.v1_0.mapper;

import static org.siemac.metamac.portal.core.domain.DatasetSelection.FIXED_DIMENSIONS_START_POSITION;
import static org.siemac.metamac.portal.core.domain.DatasetSelection.LEFT_DIMENSIONS_START_POSITION;
import static org.siemac.metamac.portal.core.domain.DatasetSelection.TOP_DIMENSIONS_START_POSITION;
import static org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum.CODE_AND_LABEL;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.Response.Status;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionAttribute;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.portal.rest.common.exception.RestServiceExceptionType;
import org.siemac.metamac.rest.exception.RestException;
import org.siemac.metamac.rest.exception.utils.RestExceptionUtils;
import org.siemac.metamac.rest.export.v1_0.domain.DimensionFilters;
import org.siemac.metamac.rest.export.v1_0.domain.Exportation;
import org.siemac.metamac.rest.export.v1_0.domain.LabelVisualisationMode;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Attribute;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Attributes;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Dimension;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Dimensions;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.NonEnumeratedDimensionValues;

public class DatasetSelectionMapper {

    private static final int MAX_SIZE_URL = 2000;

    public static DatasetSelection toDatasetSelection(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        List<DatasetSelectionDimension> dimensions = toDatasetSelectionDimensions(source);
        List<DatasetSelectionAttribute> attributes = toDatasetSelectionAttributes(source);
        return new DatasetSelection(dimensions, attributes);
    }

    public static String toStatisticalResourcesApiRepresentationParameter(Exportation exportationBody) {
        if (exportationBody == null) {
            return null;
        }
        org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection datasetSelection = exportationBody.getDatasetSelection();
        if (datasetSelection == null || datasetSelection.getDimensions() == null || datasetSelection.getDimensions().getDimensions() == null) {
            return null;
        }
        List<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> dimensions = datasetSelection.getDimensions().getDimensions();

        StringBuilder sb = new StringBuilder();
        for (org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension dimension : dimensions) {
            sb.append(dimension.getDimensionId());
            sb.append("[");

            if (dimension.getDimensionFilters() != null) {
                DimensionFilters dimensionFilters = dimension.getDimensionFilters();
                if (dimensionFilters.getAfter() != null) {
                    sb.append("~after=").append(dimensionFilters.getAfter()).append("|");
                }
                if (dimensionFilters.getLast() != null) {
                    sb.append("~last=").append(dimensionFilters.getLast()).append("|");
                }
                if (dimensionFilters.getRange() != null) {
                    sb.append("~range=").append(dimensionFilters.getRange().getStart()).append(";").append(dimensionFilters.getRange().getEnd()).append("|");
                }
            }
            if (dimension.getDimensionValues() != null && dimension.getDimensionValues().getDimensionValues() != null && dimension.getDimensionValues().getDimensionValues().size() > 0) {
                sb.append(StringUtils.join(dimension.getDimensionValues().getDimensionValues(), "|"));
            }
            if ('|' == sb.charAt(sb.length() - 1)) {
                sb.deleteCharAt(sb.length() - 1); // delete last |
            }

            sb.append("]");
            sb.append(":");
        }
        if (':' == sb.charAt(sb.length() - 1)) {
            sb.deleteCharAt(sb.length() - 1); // delete last :
        }

        if (sb.length() > MAX_SIZE_URL) {
            return null;
        }

        return sb.toString();
    }

    private static List<DatasetSelectionDimension> toDatasetSelectionDimensions(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        if (source == null || source.getDimensions() == null) {
            return null;
        }
        List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>(source.getDimensions().getDimensions().size());
        for (Iterator<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> iterator = source.getDimensions().getDimensions().iterator(); iterator.hasNext();) {
            org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension dimensionSource = iterator.next();
            DatasetSelectionDimension target = toDatasetSelectionDimension(dimensionSource);
            dimensions.add(target);
        }
        return dimensions;
    }

    private static DatasetSelectionDimension toDatasetSelectionDimension(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension source) throws Exception {
        DatasetSelectionDimension target = new DatasetSelectionDimension(source.getDimensionId());
        target.setSelectedDimensionValues(source.getDimensionValues().getDimensionValues());
        target.setPosition(source.getPosition());
        target.setLabelVisualisationMode(toLabelVisualisationMode(source.getLabelVisualisationMode()));
        return target;
    }

    private static List<DatasetSelectionAttribute> toDatasetSelectionAttributes(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source) throws Exception {
        if (source == null || source.getAttributes() == null) {
            return null;
        }
        List<DatasetSelectionAttribute> attributes = new ArrayList<DatasetSelectionAttribute>(source.getAttributes().getAttributes().size());
        for (Iterator<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute> iterator = source.getAttributes().getAttributes().iterator(); iterator.hasNext();) {
            org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute attributeSource = iterator.next();
            DatasetSelectionAttribute target = toDatasetSelectionAttribute(attributeSource);
            attributes.add(target);
        }
        return attributes;
    }

    private static DatasetSelectionAttribute toDatasetSelectionAttribute(org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute source) throws Exception {
        DatasetSelectionAttribute target = new DatasetSelectionAttribute(source.getAttributeId());
        target.setLabelVisualisationMode(toLabelVisualisationMode(source.getLabelVisualisationMode()));
        return target;
    }

    private static LabelVisualisationModeEnum toLabelVisualisationMode(LabelVisualisationMode source) {
        if (source == null) {
            return null;
        }
        switch (source) {
            case LABEL:
                return LabelVisualisationModeEnum.LABEL;
            case CODE:
                return LabelVisualisationModeEnum.CODE;
            case CODE_AND_LABEL:
                return LabelVisualisationModeEnum.CODE_AND_LABEL;
            default:
                org.siemac.metamac.rest.common.v1_0.domain.Exception exception = RestExceptionUtils.getException(RestServiceExceptionType.UNKNOWN);
                throw new RestException(exception, Status.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param dimensionsMetadata
     * @param datasetAttributes
     * @param relatedDsd
     * @param exportationBody
     *            We generate the dimensions and attributes object with the one that compose the dataset, where it´s data has been previously
     *            filtered previously when it was retrieved. We enrich the object with the exportationBody, to take into account the user input
     */
    public static DatasetSelection datasetToDatasetSelection(Dimensions dimensionsMetadata, Attributes datasetAttributes, DataStructureDefinition relatedDsd,
                                                             Exportation exportationBody) {
        Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> selectionDimensionsMap = null;
        Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute> selectionAttributesMap = null;
        if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
            if (exportationBody.getDatasetSelection().getDimensions() != null) {
                selectionDimensionsMap = indexDimensionsById(exportationBody.getDatasetSelection().getDimensions().getDimensions());
            }
            if (exportationBody.getDatasetSelection().getAttributes() != null) {
                selectionAttributesMap = indexAttributesById(exportationBody.getDatasetSelection().getAttributes().getAttributes());
            }
        }
        List<DatasetSelectionDimension> dimensions = dimensionsToDatasetSelectionDimensions(dimensionsMetadata, selectionDimensionsMap, relatedDsd);
        List<DatasetSelectionAttribute> attributes = attributesToDatasetSelectionAttributes(datasetAttributes, selectionAttributesMap);
        return new DatasetSelection(dimensions, attributes, false);
    }

    @SuppressWarnings("unchecked")
    private static Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> indexDimensionsById(
            List<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> dimensions) {
        if (dimensions == null) {
            return MapUtils.EMPTY_MAP;
        }
        Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> a = new HashMap<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension>();
        for (org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension dimension : dimensions) {
            a.put(dimension.getDimensionId(), dimension);
        }
        return a;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute> indexAttributesById(
            List<org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute> attributes) {
        if (attributes == null) {
            return MapUtils.EMPTY_MAP;
        }
        Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute> a = new HashMap<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute>();
        for (org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute attribute : attributes) {
            a.put(attribute.getAttributeId(), attribute);
        }
        return a;
    }

    private static List<DatasetSelectionAttribute> attributesToDatasetSelectionAttributes(Attributes attributes,
            Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute> selectionAttributesMap) {
        if (attributes == null) {
            return null;
        }
        List<DatasetSelectionAttribute> datasetSelectionAttributes = new ArrayList<DatasetSelectionAttribute>();
        for (Attribute attribute : attributes.getAttributes()) {
            final org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute selectionAttribute = selectionAttributesMap != null ? selectionAttributesMap.get(attribute.getId()) : null;
            datasetSelectionAttributes.add(attributeToDatasetSelectionAttribute(attribute, selectionAttribute));
        }
        return datasetSelectionAttributes;
    }

    private static DatasetSelectionAttribute attributeToDatasetSelectionAttribute(Attribute attribute, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute selectionAttribute) {
        DatasetSelectionAttribute datasetSelectionAttribute = new DatasetSelectionAttribute(attribute.getId());

        // Default values
        LabelVisualisationModeEnum labelVisualizationMode = CODE_AND_LABEL;

        // If we have data sent via api, use that instead
        if (selectionAttribute != null) {
            if (selectionAttribute.getLabelVisualisationMode() != null) {
                labelVisualizationMode = toLabelVisualisationMode(selectionAttribute.getLabelVisualisationMode());
            }
        }

        datasetSelectionAttribute.setLabelVisualisationMode(labelVisualizationMode);
        return datasetSelectionAttribute;
    }

    private static List<DatasetSelectionDimension> dimensionsToDatasetSelectionDimensions(Dimensions dimensions,
            Map<String, org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension> selectionDimensionsMap,
            DataStructureDefinition dataStructureDefinition) {

        List<DatasetSelectionDimension> datasetSelectionDimensions = new ArrayList<>();
        for (Dimension dimension : dimensions.getDimensions()) {
            final org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension selectionDimension;

            if (selectionDimensionsMap != null) {
                selectionDimension = selectionDimensionsMap.get(dimension.getId());
            } else {
                selectionDimension = null;
            }

            datasetSelectionDimensions.add(dimensionToDatasetSelectionDimension(dimension, dataStructureDefinition, selectionDimension));
        }
        return datasetSelectionDimensions;
    }

    private static DatasetSelectionDimension dimensionToDatasetSelectionDimension(Dimension dimension, DataStructureDefinition dataStructureDefinition,
                                                                                  org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension selectionDimension) {
        DatasetSelectionDimension datasetSelectionDimension = new DatasetSelectionDimension(dimension.getId());

        // Default values
        LabelVisualisationModeEnum labelVisualizationMode = CODE_AND_LABEL;
        Integer position = dataStructureDefinitionToPosition(dimension.getId(), dataStructureDefinition);

        // If we have data sent via api, use that instead
        if (selectionDimension != null) {
            if (selectionDimension.getLabelVisualisationMode() != null) {
                labelVisualizationMode = toLabelVisualisationMode(selectionDimension.getLabelVisualisationMode());
            }
            if (selectionDimension.getPosition() != null) {
                position = selectionDimension.getPosition();
            }
        }
        // If
        List<String> dimensionValues;
        if (selectionDimension != null && selectionDimension.getDimensionValues() != null) {
            dimensionValues = getDimensionValues(dimension.getDimensionValues(), selectionDimension.getDimensionValues());
        } else {
            dimensionValues = getDimensionValues(dimension.getDimensionValues());
        }

        datasetSelectionDimension.setLabelVisualisationMode(labelVisualizationMode);
        datasetSelectionDimension.setPosition(position);
        datasetSelectionDimension.setSelectedDimensionValues(dimensionValues);
        return datasetSelectionDimension;
    }

    private static Integer dataStructureDefinitionToPosition(String id, DataStructureDefinition dataStructureDefinition) {
        if (dataStructureDefinition.getHeading().getDimensionIds().contains(id)) {
            return TOP_DIMENSIONS_START_POSITION + dataStructureDefinition.getHeading().getDimensionIds().indexOf(id);
        } else if (dataStructureDefinition.getStub().getDimensionIds().contains(id)) {
            return LEFT_DIMENSIONS_START_POSITION + dataStructureDefinition.getStub().getDimensionIds().indexOf(id);
        } else {
            return FIXED_DIMENSIONS_START_POSITION;
        }
    }

    private static List<String> getDimensionValues(DimensionValues dimensionValues) {
        List<String> selectedDimensionValues = new ArrayList<>();
        if (dimensionValues instanceof EnumeratedDimensionValues) {
            EnumeratedDimensionValues enumeratedDimensionValues = (EnumeratedDimensionValues) dimensionValues;
            for (EnumeratedDimensionValue value : enumeratedDimensionValues.getValues()) {
                selectedDimensionValues.add(value.getId());
            }
        } else {
            NonEnumeratedDimensionValues nonEnumeratedDimensionValues = (NonEnumeratedDimensionValues) dimensionValues;
            for (NonEnumeratedDimensionValue value : nonEnumeratedDimensionValues.getValues()) {
                selectedDimensionValues.add(value.getId());
            }
        }
        return selectedDimensionValues;

    }

    private static List<String> getDimensionValues(DimensionValues dimensionValues, org.siemac.metamac.rest.export.v1_0.domain.DimensionValues selectedValues) {
        List<String> selectedDimensionValues = new ArrayList<>();
        if (dimensionValues instanceof EnumeratedDimensionValues) {
            EnumeratedDimensionValues enumeratedDimensionValues = (EnumeratedDimensionValues) dimensionValues;
            for (EnumeratedDimensionValue value : enumeratedDimensionValues.getValues()) {
                if (selectedValues.getDimensionValues().contains(value.getId())) {
                    selectedDimensionValues.add(value.getId());
                }
            }
        } else {
            NonEnumeratedDimensionValues nonEnumeratedDimensionValues = (NonEnumeratedDimensionValues) dimensionValues;
            for (NonEnumeratedDimensionValue value : nonEnumeratedDimensionValues.getValues()) {
                if (selectedValues.getDimensionValues().contains(value.getId())) {
                    selectedDimensionValues.add(value.getId());
                }
            }
        }
        return selectedDimensionValues;

    }

}