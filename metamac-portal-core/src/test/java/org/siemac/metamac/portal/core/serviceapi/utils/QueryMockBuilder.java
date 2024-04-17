package org.siemac.metamac.portal.core.serviceapi.utils;

import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Attribute;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.AttributeDimension;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.AttributeDimensions;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Attributes;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CodeRepresentations;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ComponentType;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Data;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataAttribute;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataAttributes;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Dimension;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionRepresentations;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Dimensions;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedAttributeValue;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedAttributeValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.MeasureQuantity;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.NonEnumeratedAttributeValue;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.NonEnumeratedAttributeValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.NonEnumeratedDimensionValue;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.NonEnumeratedDimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.QueryBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.QueryMetadataBase;

public class QueryMockBuilder extends ResourceMockBuilder {

    private final QueryBase               query;
    private       Dimension               lastDimensionMetadata;
    private       DimensionRepresentation lastDimensionData;

    private Attribute               lastAttributeMetadata;

    public static QueryMockBuilder create() {
        return new QueryMockBuilder();
    }

    private QueryMockBuilder() {
        query = new QueryBase();
        query.setId("C00031A_000001");
        query.setName(internationalString("title"));
        query.setDescription(internationalString("description"));
        query.setMetadata(new QueryMetadataBase());
        query.getMetadata().setStatisticalOperation(mockResource("C00000A"));
        query.getMetadata().setRelatedDsd(mockDataStructureDefinition());
        query.getMetadata().setDimensions(new Dimensions());
        query.setData(new Data());
        query.getData().setDimensions(new DimensionRepresentations());
    }

    public QueryMockBuilder dimension(String dimensionId) {
        return dimension(dimensionId, dimensionId);
    }

    public QueryMockBuilder dimension(String dimensionId, String dimensionLabel) {
        // Metadata
        Dimension dimension = new Dimension();
        dimension.setId(dimensionId);
        dimension.setName(internationalString(dimensionLabel));
        dimension.setDimensionValues(new NonEnumeratedDimensionValues());
        query.getMetadata().getDimensions().getDimensions().add(dimension);
        lastDimensionMetadata = dimension;

        // Data
        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(dimensionId);
        dimensionRepresentation.setRepresentations(new CodeRepresentations());
        query.getData().getDimensions().getDimensions().add(dimensionRepresentation);
        lastDimensionData = dimensionRepresentation;

        return this;
    }

    public QueryMockBuilder stub() {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }
        query.getMetadata().getRelatedDsd().getStub().getDimensionIds().add(lastDimensionMetadata.getId());
        return this;
    }

    public QueryMockBuilder heading() {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }
        query.getMetadata().getRelatedDsd().getHeading().getDimensionIds().add(lastDimensionMetadata.getId());
        return this;
    }

    public QueryMockBuilder attribute(String attributeId, AttributeAttachmentLevelType attachementLevel, ComponentType componentType) {
        return attribute(attributeId, attributeId, attachementLevel, componentType);
    }

    public QueryMockBuilder dimensionValue(String representationId) {
        return dimensionValue(representationId, representationId);
    }

    public QueryMockBuilder dimensionValue(String dimensionValueId, String dimensionValueLabel) {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }

        // Metadata
        if (lastDimensionMetadata.getDimensionValues() instanceof EnumeratedDimensionValues) {
            EnumeratedDimensionValue dimensionValue = new EnumeratedDimensionValue();
            dimensionValue.setId(dimensionValueId);
            dimensionValue.setName(internationalString(dimensionValueLabel));
            ((EnumeratedDimensionValues) lastDimensionMetadata.getDimensionValues()).getValues().add(dimensionValue);
        } else if (lastDimensionMetadata.getDimensionValues() instanceof NonEnumeratedDimensionValues) {
            NonEnumeratedDimensionValue dimensionValue = new NonEnumeratedDimensionValue();
            dimensionValue.setId(dimensionValueId);
            dimensionValue.setName(internationalString(dimensionValueLabel));
            ((NonEnumeratedDimensionValues) lastDimensionMetadata.getDimensionValues()).getValues().add(dimensionValue);
        } else {
            throw new IllegalArgumentException("Inizialice attribute values");
        }

        // Data
        DimensionRepresentation dimensionRepresentation = lastDimensionData;
        CodeRepresentation representation = new CodeRepresentation();
        representation.setCode(dimensionValueId);
        representation.setIndex(dimensionRepresentation.getRepresentations().getRepresentations().size());
        dimensionRepresentation.getRepresentations().getRepresentations().add(representation);

        return this;
    }

    public QueryMockBuilder attribute(String attributeId, String attributeLabel, AttributeAttachmentLevelType attachementLevel, ComponentType componentType) {
        if (query.getMetadata().getAttributes() == null) {
            query.getMetadata().setAttributes(new Attributes());
        }
        Attribute attribute = new Attribute();
        attribute.setId(attributeId);
        attribute.setName(internationalString(attributeLabel));
        attribute.setAttachmentLevel(attachementLevel);
        if (ComponentType.MEASURE.equals(componentType)) {
            EnumeratedAttributeValues values = new EnumeratedAttributeValues();
            EnumeratedAttributeValue value = new EnumeratedAttributeValue();
            value.setId(attributeId);
            MeasureQuantity measureQuantity = new MeasureQuantity();
            measureQuantity.setUnitCode(mockItemResource("Cientos de euros"));
            value.setMeasureQuantity(measureQuantity);
            value.setUrn("URN:" + attributeId);

            values.getValues().add(value);
            attribute.setAttributeValues(values);
        } else {
            attribute.setAttributeValues(new NonEnumeratedAttributeValues());
        }

        attribute.setType(componentType);
        query.getMetadata().getAttributes().getAttributes().add(attribute);
        lastAttributeMetadata = attribute;
        return this;
    }

    public QueryMockBuilder dimensionsAttached(String... dimensionsId) {
        if (lastAttributeMetadata == null) {
            throw new IllegalArgumentException("Define a attribute previously");
        }
        if (!AttributeAttachmentLevelType.DIMENSION.equals(lastAttributeMetadata.getAttachmentLevel())) {
            throw new IllegalArgumentException("Attribute is not with dimension attachment level");
        }
        lastAttributeMetadata.setDimensions(new AttributeDimensions());
        for (int i = 0; i < dimensionsId.length; i++) {
            String dimensionId = dimensionsId[i];
            AttributeDimension attributeDimension = new AttributeDimension();
            attributeDimension.setDimensionId(dimensionId);
            lastAttributeMetadata.getDimensions().getDimensions().add(attributeDimension);
        }
        return this;
    }

    public QueryMockBuilder attributeValue(String attributeValueId, String attributeValueLabel) {
        if (lastAttributeMetadata == null) {
            throw new IllegalArgumentException("Define a attribute previously");
        }

        // Metadata
        if (lastAttributeMetadata.getAttributeValues() instanceof EnumeratedAttributeValues) {
            EnumeratedAttributeValue attributeValue = new EnumeratedAttributeValue();
            attributeValue.setId(attributeValueId);
            attributeValue.setName(internationalString(attributeValueLabel));
            ((EnumeratedAttributeValues) lastAttributeMetadata.getAttributeValues()).getValues().add(attributeValue);
        } else if (lastAttributeMetadata.getAttributeValues() instanceof NonEnumeratedAttributeValues) {
            NonEnumeratedAttributeValue attributeValue = new NonEnumeratedAttributeValue();
            attributeValue.setId(attributeValueId);
            attributeValue.setName(internationalString(attributeValueLabel));
            ((NonEnumeratedAttributeValues) lastAttributeMetadata.getAttributeValues()).getValues().add(attributeValue);
        } else {
            throw new IllegalArgumentException("Inizialice attribute values");
        }

        return this;
    }

    public QueryMockBuilder attributeData(String attributeId, String value) {
        if (query.getData().getAttributes() == null) {
            query.getData().setAttributes(new DataAttributes());
        }
        DataAttribute dataAttribute = new DataAttribute();
        dataAttribute.setId(attributeId);
        dataAttribute.setValue(value);
        query.getData().getAttributes().getAttributes().add(dataAttribute);
        return this;
    }

    public QueryMockBuilder observations(String observations) {
        query.getData().setObservations(observations);
        return this;
    }

    public QueryBase build() {
        return query;
    }
}
