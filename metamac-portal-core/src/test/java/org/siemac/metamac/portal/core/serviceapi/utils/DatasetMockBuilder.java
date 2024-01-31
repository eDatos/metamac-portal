package org.siemac.metamac.portal.core.serviceapi.utils;

import java.math.BigInteger;

import org.joda.time.DateTime;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Attribute;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.AttributeAttachmentLevelType;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.AttributeDimension;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.AttributeDimensions;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Attributes;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CodeRepresentation;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.CodeRepresentations;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ComponentType;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Contact;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Contacts;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Data;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataAttribute;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataAttributes;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetMetadataBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Dimension;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionRepresentations;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionType;
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
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourcesStatisticalResourceBase;

public class DatasetMockBuilder extends ResourceMockBuilder {

    private final DatasetBase             dataset;
    private       Dimension               lastDimensionMetadata;
    private       DimensionRepresentation lastDimensionData;

    private Attribute lastAttributeMetadata;

    public static DatasetMockBuilder create() {
        return new DatasetMockBuilder();
    }

    private DatasetMockBuilder() {
        dataset = new DatasetBase();
        dataset.setId("C00031A_000001");
        dataset.setName(internationalString("title"));
        dataset.setDescription(internationalString("description"));
        dataset.setMetadata(new DatasetMetadataBase());
        dataset.getMetadata().setStatisticalOperation(mockResource("C00000A"));
        dataset.getMetadata().setLanguages(new ResourcesStatisticalResourceBase());
        dataset.getMetadata().getLanguages().getResources().add(mockResource("es"));
        dataset.getMetadata().getLanguages().getResources().add(mockResource("en"));
        dataset.getMetadata().setCreatedDate(new DateTime(2013, 1, 2, 13, 15, 12, 0).toDate());
        dataset.getMetadata().setLastUpdate(new DateTime(2013, 1, 2, 9, 0, 0, 0).toDate());
        dataset.getMetadata().setDateNextUpdate(internationalString("03/01/2013"));
        dataset.getMetadata().setUpdateFrequency(mockResource("updateFrequency"));
        dataset.getMetadata().setRelatedDsd(mockDataStructureDefinition());
        dataset.getMetadata().setDimensions(new Dimensions());
        dataset.getMetadata().setRightsHolder(organisation());
        dataset.setData(new Data());
        dataset.getData().setDimensions(new DimensionRepresentations());
    }

    private Organisation organisation() {
        Organisation organisation = new Organisation();
        organisation.setId("rightsHolder");
        organisation.setName(internationalString("Label rightsHolder"));
        organisation.setContacts(contacts());
        return organisation;
    }

    private Contacts contacts() {
        Contacts contacts = new Contacts();
        contacts.getContacts().add(contact(1));
        contacts.getContacts().add(contact(2));
        contacts.getContacts().add(contact(3));
        contacts.setTotal(BigInteger.valueOf(contacts.getContacts().size()));
        return contacts;
    }

    private Contact contact(int i) {
        Contact contact = new Contact();
        String index = Integer.valueOf(i).toString();
        contact.setId(index);
        contact.setName(internationalString("nombre " + index));
        contact.setOrganisationUnit(internationalString("unidad organizativa " + index));
        contact.setResponsibility(internationalString("responsabilidad " + index));
        contact.getEmails().add(index + "@organizacion.com");
        contact.getFaxes().add("900 000 000");
        contact.getTelephones().add("600 000 00" + index);
        contact.getUrls().add("organizacion.com");
        return contact;
    }

    public DatasetMockBuilder dimension(String dimensionId) {
        return dimension(dimensionId, dimensionId);
    }

    public DatasetMockBuilder dimension(String dimensionId, String dimensionLabel) {
        return dimension(dimensionId, dimensionLabel, DimensionType.DIMENSION);
    }

    public DatasetMockBuilder dimension(String dimensionId, String dimensionLabel, DimensionType type) {
        // Metadata
        Dimension dimension = new Dimension();
        dimension.setId(dimensionId);
        dimension.setName(internationalString(dimensionLabel));
        dimension.setType(type);
        dimension.setDimensionValues(new EnumeratedDimensionValues());
        dataset.getMetadata().getDimensions().getDimensions().add(dimension);
        lastDimensionMetadata = dimension;

        // Data
        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(dimensionId);
        dimensionRepresentation.setRepresentations(new CodeRepresentations());
        dataset.getData().getDimensions().getDimensions().add(dimensionRepresentation);
        lastDimensionData = dimensionRepresentation;

        return this;
    }

    public DatasetMockBuilder stub() {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }
        dataset.getMetadata().getRelatedDsd().getStub().getDimensionIds().add(lastDimensionMetadata.getId());
        return this;
    }

    public DatasetMockBuilder heading() {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }
        dataset.getMetadata().getRelatedDsd().getHeading().getDimensionIds().add(lastDimensionMetadata.getId());
        return this;
    }

    public DatasetMockBuilder attribute(String attributeId, AttributeAttachmentLevelType attachementLevel, ComponentType componentType) {
        return attribute(attributeId, attributeId, attachementLevel, componentType);
    }

    public DatasetMockBuilder dimensionValue(String representationId) {
        return dimensionValue(representationId, representationId);
    }

    public DatasetMockBuilder dimensionValue(String dimensionValueId, String dimensionValueLabel) {
        if (lastDimensionMetadata == null || lastDimensionData == null) {
            throw new IllegalArgumentException("Define a dimension previously");
        }

        // Metadata
        if (lastDimensionMetadata.getDimensionValues() instanceof EnumeratedDimensionValues) {
            EnumeratedDimensionValue dimensionValue = new EnumeratedDimensionValue();
            dimensionValue.setId(dimensionValueId);
            dimensionValue.setName(internationalString(dimensionValueLabel));
            if (DimensionType.MEASURE_DIMENSION.equals(lastDimensionMetadata.getType())) {
                MeasureQuantity measureQuantity = new MeasureQuantity();
                measureQuantity.setUnitCode(mockItemResource("Cientos de euros"));
                dimensionValue.setMeasureQuantity(measureQuantity);
                dimensionValue.setUrn("URN:" + dimensionValueId);
            }
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

    public DatasetMockBuilder attribute(String attributeId, String attributeLabel, AttributeAttachmentLevelType attachementLevel, ComponentType componentType) {
        if (dataset.getMetadata().getAttributes() == null) {
            dataset.getMetadata().setAttributes(new Attributes());
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
        dataset.getMetadata().getAttributes().getAttributes().add(attribute);
        lastAttributeMetadata = attribute;
        return this;
    }

    public DatasetMockBuilder dimensionsAttached(String... dimensionsId) {
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

    public DatasetMockBuilder attributeValue(String attributeValueId, String attributeValueLabel) {
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

    public DatasetMockBuilder attributeData(String attributeId, String value) {
        if (dataset.getData().getAttributes() == null) {
            dataset.getData().setAttributes(new DataAttributes());
        }
        DataAttribute dataAttribute = new DataAttribute();
        dataAttribute.setId(attributeId);
        dataAttribute.setValue(value);
        dataset.getData().getAttributes().getAttributes().add(dataAttribute);
        return this;
    }

    public DatasetMockBuilder observations(String observations) {
        dataset.getData().setObservations(observations);
        return this;
    }

    public DatasetBase build() {
        return dataset;
    }
}
