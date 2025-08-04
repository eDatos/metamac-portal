package org.siemac.metamac.portal.core.serviceapi.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.domain.DatasetSelectionAttribute;
import org.siemac.metamac.portal.core.domain.DatasetSelectionDimension;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;

public class DatasetSelectionMockBuilder {

    public static DatasetSelectionMockBuilder create() {
        return new DatasetSelectionMockBuilder();
    }

    private final List<DatasetSelectionDimension> dimensions = new ArrayList<DatasetSelectionDimension>();
    private DatasetSelectionDimension             lastDimension;

    private final List<DatasetSelectionAttribute> attributes = new ArrayList<DatasetSelectionAttribute>();

    private DatasetSelectionMockBuilder() {
    }

    public DatasetSelectionMockBuilder dimension(String dimensionId) {
        return dimension(dimensionId, null, null);
    }

    public DatasetSelectionMockBuilder dimension(String dimensionId, Integer position) {
        return dimension(dimensionId, position, null);
    }

    public DatasetSelectionMockBuilder dimension(String dimensionId, LabelVisualisationModeEnum labelVisualisationMode) {
        return dimension(dimensionId, null, labelVisualisationMode);
    }

    public DatasetSelectionMockBuilder dimension(String dimensionId, Integer position, LabelVisualisationModeEnum labelVisualisationMode) {
        DatasetSelectionDimension dimension = new DatasetSelectionDimension(dimensionId);
        dimension.setPosition(position);
        dimension.setLabelVisualisationMode(labelVisualisationMode);
        dimension.setReversed(false);
        lastDimension = dimension;
        dimensions.add(dimension);
        return this;
    }

    public DatasetSelectionMockBuilder dimensionValues(String... dimensionValuesId) {
        lastDimension.setSelectedDimensionValues(Arrays.asList(dimensionValuesId));
        return this;
    }

    public DatasetSelectionMockBuilder attribute(String attributeId, LabelVisualisationModeEnum labelVisualisationMode) {
        DatasetSelectionAttribute attribute = new DatasetSelectionAttribute(attributeId);
        attribute.setLabelVisualisationMode(labelVisualisationMode);
        attributes.add(attribute);
        return this;
    }

    public DatasetSelection build() {
        return new DatasetSelection(dimensions, attributes);
    }
}