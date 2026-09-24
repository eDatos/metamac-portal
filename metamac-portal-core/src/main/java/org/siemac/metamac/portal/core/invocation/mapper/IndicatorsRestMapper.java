package org.siemac.metamac.portal.core.invocation.mapper;

import static es.gobcan.istac.indicators.rest.constants.IndicatorsRestApiConstants.DEFAULT;
import static org.siemac.metamac.portal.core.utils.PortalUtils.buildInternationalStringFromSingleCode;
import static org.siemac.metamac.portal.core.utils.PortalUtils.localisedStringsToInternationalString;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.portal.core.exporters.PxExporter;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.common.v1_0.domain.ResourceLink;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Organisation;
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
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataInternationalAttribute;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DatasetMetadataBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Dimension;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionRepresentation;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionRepresentations;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionType;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Dimensions;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionsId;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedDimensionValue;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.EnumeratedDimensionValues;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourceStatisticalResourceBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourcesStatisticalResourceBase;

import es.gobcan.istac.indicators.rest.types.AttributeAttachmentLevelEnumType;
import es.gobcan.istac.indicators.rest.types.AttributeType;
import es.gobcan.istac.indicators.rest.types.DataDimensionType;
import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorDataDimensionTypeEnum;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;
import es.gobcan.istac.indicators.rest.types.IndicatorsSystemType;
import es.gobcan.istac.indicators.rest.types.InternationalDataAttributeType;
import es.gobcan.istac.indicators.rest.types.LinkType;
import es.gobcan.istac.indicators.rest.types.MetadataAttributeDimensionType;
import es.gobcan.istac.indicators.rest.types.MetadataAttributeDimensionsType;
import es.gobcan.istac.indicators.rest.types.MetadataAttributeType;
import es.gobcan.istac.indicators.rest.types.MetadataDimensionType;
import es.gobcan.istac.indicators.rest.types.MetadataRepresentationType;
import es.gobcan.istac.indicators.rest.types.QuantityType;
import org.slf4j.LoggerFactory;

    /**
 * Don't map all the fields, only the ones needed to export
 */
public class IndicatorsRestMapper {

    private static final org.slf4j.Logger                                                        LOGGER                             = LoggerFactory.getLogger(IndicatorsRestMapper.class);

    private static final String                                                                  DATASET_OBSERVATIONS_SEPARATOR     = " | ";

    private static final EnumMap<AttributeAttachmentLevelEnumType, AttributeAttachmentLevelType> ATTRIBUTE_ATTACHMENT_LEVEL_MAPPING = new EnumMap<>(AttributeAttachmentLevelEnumType.class);
    static {
        ATTRIBUTE_ATTACHMENT_LEVEL_MAPPING.put(AttributeAttachmentLevelEnumType.DATASET, AttributeAttachmentLevelType.DATASET);
        ATTRIBUTE_ATTACHMENT_LEVEL_MAPPING.put(AttributeAttachmentLevelEnumType.DIMENSION, AttributeAttachmentLevelType.DIMENSION);
        ATTRIBUTE_ATTACHMENT_LEVEL_MAPPING.put(AttributeAttachmentLevelEnumType.OBSERVATION, AttributeAttachmentLevelType.PRIMARY_MEASURE);
    }

    public static DatasetBase indicatorToDatasetMapper(IndicatorType indicator, DataType data, org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisation, String languageDefault) {
        DatasetBase dataset = indicatorToDatasetBaseMapper(indicator.getId(), indicator.getTitle(), data, languageDefault);
        dataset.setMetadata(indicatorMetadataToDatasetMetadata(indicator, organisation));
        return dataset;
    }

    public static DatasetBase indicatorInstanceToDatasetMapper(IndicatorInstanceType indicatorInstance, DataType data, org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisation,
            IndicatorsSystemType indicatorSystem, String languageDefault) {
        DatasetBase dataset = indicatorToDatasetBaseMapper(indicatorInstance.getId(), indicatorInstance.getTitle(), data, languageDefault);
        dataset.setMetadata(indicatorInstanceMetadataToDatasetMetadata(indicatorInstance, organisation, indicatorSystem));
        return dataset;
    }

    private static DatasetBase indicatorToDatasetBaseMapper(String id, Map<String, String> title, DataType data, String languageDefault) {
        DatasetBase dataset = new DatasetBase();
        dataset.setId(PxExporter.generateMatrixFromString(id));
        dataset.setName(localisedStringsToInternationalString(title));
        dataset.setData(indicatorDataToDatasetData(data, languageDefault));
        return dataset;
    }

    private static DatasetMetadataBase indicatorInstanceMetadataToDatasetMetadata(IndicatorInstanceType indicatorInstance, org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisation, IndicatorsSystemType indicatorSystem) {
        return indicatorBaseMetadataToDatasetMetadata(null, indicatorInstance.getDimension(), indicatorInstance.getDecimalPlaces(), indicatorInstance.getTitle(), organisation, indicatorSystem, indicatorInstance.getAttribute());
    }

    private static DatasetMetadataBase indicatorMetadataToDatasetMetadata(IndicatorType indicator, org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisation) {
        return indicatorBaseMetadataToDatasetMetadata(indicator.getVersion(), indicator.getDimension(), indicator.getDecimalPlaces(), indicator.getTitle(), organisation, null,
                indicator.getAttribute());
    }

    private static DatasetMetadataBase indicatorBaseMetadataToDatasetMetadata(String version, Map<String, MetadataDimensionType> dimension, Integer decimalPlaces, Map<String, String> title,
            org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisation, IndicatorsSystemType indicatorSystem, Map<String, MetadataAttributeType> attributes) {
        DatasetMetadataBase datasetMetadata = new DatasetMetadataBase();
        List<String> languages = calculateLanguagesFromIndicatorLocalisedString(title);
        datasetMetadata.setVersion(version);
        datasetMetadata.setDimensions(indicatorMetadataDimensionsToDatasetMetadataDimensions(dimension, languages));
        datasetMetadata.setRightsHolder(organisation);
        datasetMetadata.setLanguages(buildPartialDatasetLanguageResourceFromIndicatorLanguages(languages));
        datasetMetadata.setRelatedDsd(buildRelatedDsd(decimalPlaces));
        datasetMetadata.setPublishers(organisationToResourceBase(organisation));
        datasetMetadata.setStatisticalOperation(indicatorSystemToStatisticalOperation(indicatorSystem));
        datasetMetadata.setAttributes(indicatorMetadataAttributesToDatasetMetadataAttributes(attributes));
        return datasetMetadata;
    }

    private static Attributes indicatorMetadataAttributesToDatasetMetadataAttributes(Map<String, MetadataAttributeType> attributes) {
        Attributes datasetAttributes = new Attributes();
        if (attributes == null) {
            return datasetAttributes;
        }
        for (Entry<String, MetadataAttributeType> attribute : attributes.entrySet()) {
            Attribute datasetAttribute = indicatorMetadataAttributeToDatasetMetadataAttribute(attribute);
            if (datasetAttribute != null) {
                datasetAttributes.getAttributes().add(datasetAttribute);
            }
        }
        datasetAttributes.setTotal(BigInteger.valueOf(datasetAttributes.getAttributes().size()));
        return datasetAttributes;
    }

    private static Attribute indicatorMetadataAttributeToDatasetMetadataAttribute(Entry<String, MetadataAttributeType> attribute) {
        AttributeAttachmentLevelType attachmentLevel = ATTRIBUTE_ATTACHMENT_LEVEL_MAPPING.get(attribute.getValue().getAttachmentLevel());

        AttributeDimensions dimensions = indicatorMetadataAttributeDimensionsToDatasetAttributeDimensions(attribute.getValue().getDimensions());
        if (AttributeAttachmentLevelType.DIMENSION.equals(attachmentLevel) && dimensions.getDimensions().isEmpty()) {
            LOGGER.error("Indicator attribute \"{}\" has DIMENSION attachmentLevel but no dimensions info; skipping it.", attribute.getKey());
            return null;
        }

        Attribute datasetAttribute = new Attribute();
        datasetAttribute.setId(attribute.getKey());
        datasetAttribute.setAttachmentLevel(attachmentLevel);
        datasetAttribute.setAttributeValues(null); // Values come in the data, not in the metadata
        datasetAttribute.setDimensions(dimensions);
        datasetAttribute.setName(localisedStringsToInternationalString(attribute.getValue().getTitle()));
        datasetAttribute.setType(ComponentType.OTHER);
        return datasetAttribute;
    }

    private static AttributeDimensions indicatorMetadataAttributeDimensionsToDatasetAttributeDimensions(MetadataAttributeDimensionsType dimensions) {
        AttributeDimensions datasetAttributeDimensions = new AttributeDimensions();
        if (dimensions == null || dimensions.getDimension() == null) {
            return datasetAttributeDimensions;
        }
        for (MetadataAttributeDimensionType dimension : dimensions.getDimension()) {
            AttributeDimension datasetAttributeDimension = new AttributeDimension();
            datasetAttributeDimension.setDimensionId(dimension.getDimensionId().getName());
            datasetAttributeDimensions.getDimensions().add(datasetAttributeDimension);
        }
        datasetAttributeDimensions.setTotal(BigInteger.valueOf(datasetAttributeDimensions.getDimensions().size()));
        return datasetAttributeDimensions;
    }

    private static ResourceStatisticalResourceBase indicatorSystemToStatisticalOperation(IndicatorsSystemType indicatorSystem) {
        if (indicatorSystem == null) {
            return null;
        }
        ResourceStatisticalResourceBase statisticalOperation = new ResourceStatisticalResourceBase();
        statisticalOperation.setName(localisedStringsToInternationalString(indicatorSystem.getTitle()));
        statisticalOperation.setSelfLink(linkTypeToResourceLink(indicatorSystem.getStatisticalOperationLink()));
        return statisticalOperation;
    }

    private static ResourceLink linkTypeToResourceLink(LinkType linkType) {
        if (linkType == null) {
            return null;
        }
        ResourceLink resourceLink = new ResourceLink();
        resourceLink.setHref(linkType.getHref());
        resourceLink.setKind(linkType.getKind());
        return resourceLink;
    }

    private static ResourcesStatisticalResourceBase organisationToResourceBase(org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisation) {
        ResourcesStatisticalResourceBase publishers = new ResourcesStatisticalResourceBase();
        publishers.getResources().add(organisation);
        return publishers;
    }

    public static org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisationSrmExternalToResource(Organisation organisation) {
        org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organization = new org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation();
        organization.setName(organisation.getName()); // The only one currently used on the export
        organization.setId(organisation.getId());
        organization.setKind(organisation.getKind());
        organization.setNestedId(organisation.getNestedId());
        organization.setSelfLink(organisation.getSelfLink());
        organization.setUrn(organisation.getUrn());
        return organization;
    }

    public static org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organisationSrmInternalToResource(
            org.siemac.metamac.rest.structural_resources_internal.v1_0.domain.Organisation organisation) {
        org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation organization = new org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.Organisation();
        organization.setName(organisation.getName()); // The only one currently used on the export
        organization.setId(organisation.getId());
        organization.setKind(organisation.getKind());
        organization.setNestedId(organisation.getNestedId());
        organization.setSelfLink(organisation.getSelfLink());
        organization.setUrn(organisation.getUrn());
        return organization;
    }

    private static DataStructureDefinition buildRelatedDsd(Integer decimalPlaces) {
        DataStructureDefinition relatedDsd = new DataStructureDefinition();
        relatedDsd.setShowDecimals(decimalPlaces);
        relatedDsd.setHeading(buildIndicatorHeading());
        relatedDsd.setStub(buildIndicatorStub());
        return relatedDsd;
    }

    /**
     * Always these values for indicators heading
     */
    private static DimensionsId buildIndicatorHeading() {
        DimensionsId heading = new DimensionsId();
        heading.getDimensionIds().add(IndicatorDataDimensionTypeEnum.GEOGRAPHICAL.getName());
        heading.getDimensionIds().add(IndicatorDataDimensionTypeEnum.MEASURE.getName());
        return heading;
    }

    /**
     * Always these values for indicators stub
     */
    private static DimensionsId buildIndicatorStub() {
        DimensionsId stub = new DimensionsId();
        stub.getDimensionIds().add(IndicatorDataDimensionTypeEnum.TIME.getName());
        return stub;
    }

    /**
     * This will be later used on writeLanguages. We don´t need the full resource, only the id, so we´ll build a partial one for it
     *
     * @see PxExporter.writeLanguages
     */
    private static ResourcesStatisticalResourceBase buildPartialDatasetLanguageResourceFromIndicatorLanguages(List<String> languagesIds) {
        ResourcesStatisticalResourceBase languages = new ResourcesStatisticalResourceBase();
        for (String languageId : languagesIds) {
            ResourceStatisticalResourceBase language = new ResourceStatisticalResourceBase();
            language.setId(languageId);
            languages.getResources().add(language);
        }
        languages.setTotal(BigInteger.valueOf(languagesIds.size()));
        return languages;
    }

    /**
     * @see es.gobcan.istac.indicators.rest.mapper.MapperUtil
     */
    private static List<String> calculateLanguagesFromIndicatorLocalisedString(Map<String, String> localisedString) {
        List<String> languages = new ArrayList<String>();
        for (String language : localisedString.keySet()) {
            if (!DEFAULT.equals(language)) {
                languages.add(language);
            }
        }
        return languages;
    }

    private static Dimensions indicatorMetadataDimensionsToDatasetMetadataDimensions(Map<String, MetadataDimensionType> metadataDimensions, List<String> languages) {
        Dimensions datasetMetadataDimensions = new Dimensions();
        for (Entry<String, MetadataDimensionType> entry : metadataDimensions.entrySet()) {
            datasetMetadataDimensions.getDimensions().add(indicatorMetadataDimensionToDatasetMetadataDimension(entry.getKey(), entry.getValue(), languages));
        }
        datasetMetadataDimensions.setTotal(BigInteger.valueOf(metadataDimensions.size()));
        return datasetMetadataDimensions;
    }

    private static Dimension indicatorMetadataDimensionToDatasetMetadataDimension(String index, MetadataDimensionType metadataDimension, List<String> languages) {
        Dimension datasetMetadataDimension = new Dimension();
        datasetMetadataDimension.setId(index);
        datasetMetadataDimension.setName(buildInternationalStringFromSingleCode(metadataDimension.getCode(), languages));
        datasetMetadataDimension.setType(buildDimensionFromIndicatorDimensionCode(metadataDimension.getCode()));
        datasetMetadataDimension.setDimensionValues(indicatorMetadataDimensionRepresentationsToDatasetMetadataDimensionValues(metadataDimension.getRepresentation()));
        return datasetMetadataDimension;
    }

    private static DimensionValues indicatorMetadataDimensionRepresentationsToDatasetMetadataDimensionValues(List<MetadataRepresentationType> representations) {
        EnumeratedDimensionValues datasetDimensionValues = new EnumeratedDimensionValues();
        for (MetadataRepresentationType metadataRepresentation : representations) {
            datasetDimensionValues.getValues().add(indicatorMetadataDimensionRepresentationToDatasetMetadataDimensionValue(metadataRepresentation));
        }
        datasetDimensionValues.setTotal(BigInteger.valueOf(representations.size()));
        return datasetDimensionValues;
    }

    private static EnumeratedDimensionValue indicatorMetadataDimensionRepresentationToDatasetMetadataDimensionValue(MetadataRepresentationType metadataRepresentation) {
        EnumeratedDimensionValue datasetDimensionValue = new EnumeratedDimensionValue();
        datasetDimensionValue.setId(metadataRepresentation.getCode());
        datasetDimensionValue.setName(localisedStringsToInternationalString(metadataRepresentation.getTitle()));
        datasetDimensionValue.setShowDecimalsPrecision(indicatorQuantityToDatasetShowDecimalsPrecision(metadataRepresentation.getQuantity()));
        return datasetDimensionValue;
    }

    private static Integer indicatorQuantityToDatasetShowDecimalsPrecision(QuantityType quantityType) {
        if (quantityType == null) {
            return null;
        }
        return quantityType.getDecimalPlaces();
    }

    private static String localisedStringsToDefaultString(Map<String, String> localisedStrings) {
        return localisedStrings.get(DEFAULT);
    }

    private static DimensionType buildDimensionFromIndicatorDimensionCode(String code) {
        switch (IndicatorDataDimensionTypeEnum.valueOf(code)) {
            case GEOGRAPHICAL:
                return DimensionType.GEOGRAPHIC_DIMENSION;
            case MEASURE:
                return DimensionType.MEASURE_DIMENSION;
            case TIME:
                return DimensionType.TIME_DIMENSION;
            default:
                return null;
        }
    }

    private static Data indicatorDataToDatasetData(DataType data, String languageDefault) {
        if (data == null) {
            return null;
        }
        Data datasetData = new Data();

        datasetData.setObservations(indicatorObservationsToDatasetObservations(data.getObservation()));
        datasetData.setAttributes(indicatorAttributesToDatasetAttributes(data.getAttribute(), data.getAttributes(), languageDefault));
        datasetData.setDimensions(indicatorDimensionsToDatasetDimensions(data.getDimension()));

        return datasetData;
    }

    private static String indicatorObservationsToDatasetObservations(List<String> observation) {
        return String.join(DATASET_OBSERVATIONS_SEPARATOR, observation);
    }

    private static DataAttributes indicatorAttributesToDatasetAttributes(List<Map<String, AttributeType>> observationAttributes,
            List<InternationalDataAttributeType> datasetAndDimensionAttributes, String languageDefault) {
        boolean hasObservationAttributes = observationAttributes != null;
        boolean hasDatasetAndDimensionAttributes = datasetAndDimensionAttributes != null && !datasetAndDimensionAttributes.isEmpty();
        if (!hasObservationAttributes && !hasDatasetAndDimensionAttributes) {
            return null;
        }

        DataAttributes dataAttributes = new DataAttributes();
        // Observation-level attributes (legacy "attribute" field, one map per observation)
        if (hasObservationAttributes) {
            dataAttributes.getAttributes().addAll(indicatorAttributeToDatasetAttribute(observationAttributes));
        }

        // Dataset-level and dimension-level attributes (localised "attributes" field)
        if (hasDatasetAndDimensionAttributes) {
            dataAttributes.getInternationalAttributes().addAll(indicatorInternationalAttributesToDatasetInternationalAttributes(datasetAndDimensionAttributes, languageDefault));
        }

        dataAttributes.setTotal(BigInteger.valueOf(dataAttributes.getAttributes().size() + dataAttributes.getInternationalAttributes().size()));
        return dataAttributes;
    }

    private static List<DataInternationalAttribute> indicatorInternationalAttributesToDatasetInternationalAttributes(List<InternationalDataAttributeType> attributes, String languageDefault) {
        List<DataInternationalAttribute> dataInternationalAttributes = new ArrayList<>();
        for (InternationalDataAttributeType attribute : attributes) {
            dataInternationalAttributes.add(indicatorInternationalAttributeToDatasetInternationalAttribute(attribute, languageDefault));
        }
        return dataInternationalAttributes;
    }

    private static DataInternationalAttribute indicatorInternationalAttributeToDatasetInternationalAttribute(InternationalDataAttributeType attribute, String languageDefault) {
        DataInternationalAttribute dataInternationalAttribute = new DataInternationalAttribute();
        dataInternationalAttribute.setId(attribute.getId());
        if (attribute.getValue() != null) {
            for (Map<String, String> value : attribute.getValue()) {
                // Keep null positions as null so the value indexes stay aligned with the dimension combinations
                dataInternationalAttribute.getValues().add(value == null ? null : localisedStringsToInternationalStringWithDefault(value, languageDefault));
            }
        }
        return dataInternationalAttribute;
    }

    /**
     * Like {@link org.siemac.metamac.portal.core.utils.PortalUtils#localisedStringsToInternationalString(Map)} but, when the value only carries the language-agnostic "__default__" entry (e.g. an
     * untranslated date), it is tagged with the platform default language so it can still be resolved on export.
     */
    private static InternationalString localisedStringsToInternationalStringWithDefault(Map<String, String> localisedStrings, String languageDefault) {
        InternationalString internationalString = localisedStringsToInternationalString(localisedStrings);
        if (internationalString.getTexts().isEmpty()) {
            String defaultValue = localisedStrings.get(DEFAULT);
            if (defaultValue != null) {
                LocalisedString localisedString = new LocalisedString();
                localisedString.setLang(languageDefault);
                localisedString.setValue(defaultValue);
                internationalString.getTexts().add(localisedString);
            }
        }
        return internationalString;
    }

    private static List<DataAttribute> indicatorAttributeToDatasetAttribute(List<Map<String, AttributeType>> attributes) {
        Set<String> attributeIds = new HashSet<>();

        for (Map<String, AttributeType> map : attributes) {
            if (map != null) {
                attributeIds.addAll(map.keySet());
            }
        }

        List<DataAttribute> dataAttributes = new ArrayList<>();

        for (String attributeId : attributeIds) {
            List<String> values = indicatorAttributeValueToDatasetAttributeValue(attributeId, attributes);

            DataAttribute dataAttribute = new DataAttribute();
            dataAttribute.setId(attributeId);
            dataAttribute.setValue(String.join(DATASET_OBSERVATIONS_SEPARATOR, values));
            dataAttributes.add(dataAttribute);
        }

        return dataAttributes;
    }

    private static List<String> indicatorAttributeValueToDatasetAttributeValue(String attributeId, List<Map<String, AttributeType>> attributes) {
        List<String> values = new ArrayList<>();

        for (Map<String, AttributeType> attribute : attributes) {
            if (attribute == null || !attribute.containsKey(attributeId)) {
                values.add(StringUtils.EMPTY);
            } else {
                String attributeValue = localisedStringsToDefaultString(attribute.get(attributeId).getValue());
                values.add(attributeValue);
            }
        }
        
        return values;
    }

    private static DimensionRepresentations indicatorDimensionsToDatasetDimensions(Map<String, DataDimensionType> dataDimensions) {
        if (dataDimensions == null) {
            return null;
        }
        DimensionRepresentations dimensionRepresentations = new DimensionRepresentations();

        for (Entry<String, DataDimensionType> entry : dataDimensions.entrySet()) {
            dimensionRepresentations.getDimensions().add(indicatorDataDimensionToDatasetDimensionRepresentation(entry.getKey(), entry.getValue()));
        }
        return dimensionRepresentations;
    }

    private static DimensionRepresentation indicatorDataDimensionToDatasetDimensionRepresentation(String index, DataDimensionType dataDimension) {
        DimensionRepresentation dimensionRepresentation = new DimensionRepresentation();
        dimensionRepresentation.setDimensionId(index);
        dimensionRepresentation.setRepresentations(indicatorDataDimensionTypeToDatasetCodeRepresentations(dataDimension));
        return dimensionRepresentation;
    }

    private static CodeRepresentations indicatorDataDimensionTypeToDatasetCodeRepresentations(DataDimensionType dataDimension) {
        CodeRepresentations codeRepresentations = new CodeRepresentations();
        codeRepresentations.setTotal(BigInteger.valueOf(dataDimension.getRepresentation().getSize()));
        for (Entry<String, Integer> entry : dataDimension.getRepresentation().getIndex().entrySet()) {
            CodeRepresentation codeRepresentation = new CodeRepresentation();
            codeRepresentation.setCode(entry.getKey());
            codeRepresentation.setIndex(entry.getValue());
            codeRepresentations.getRepresentations().add(codeRepresentation);
        }
        return codeRepresentations;
    }

}
