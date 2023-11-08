package org.siemac.metamac.portal.rest.common.export.v1_0.mapper;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;

import org.junit.Test;
import org.siemac.metamac.common.test.utils.MetamacAsserts;
import org.siemac.metamac.portal.core.domain.DatasetSelection;
import org.siemac.metamac.portal.core.enume.LabelVisualisationModeEnum;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttribute;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionAttributes;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimensions;
import org.siemac.metamac.rest.export.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.export.v1_0.domain.LabelVisualisationMode;

public class DatasetSelectionMapperTest {

    @Test
    public void testToDatasetSelectionForExcel() throws Exception {

        org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source = new org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection();
        source.setDimensions(new DatasetSelectionDimensions());
        source.getDimensions().getDimensions().add(mockDimension("TIME_PERIOD", 21, null, "2012", "2013"));
        source.getDimensions().getDimensions().add(mockDimension("INDICADORES", 0, null, "INDICE_OCUPACION_PLAZAS"));
        source.getDimensions().getDimensions().add(mockDimension("CATEGORIA_ALOJAMIENTO", 20, null, "1_2_3_ESTRELLAS"));
        source.getDimensions().getDimensions().add(mockDimension("DESTINO_ALOJAMIENTO", 40, null, "EL_HIERRO", "TENERIFE"));

        // Transform
        DatasetSelection selection = DatasetSelectionMapper.toDatasetSelection(source);

        // Validate
        assertEquals(source.getDimensions().getDimensions().size(), selection.getDimensions().size());
        for (DatasetSelectionDimension expected : source.getDimensions().getDimensions()) {
            assertDimension(expected, selection);
        }

        // TODO check rows, columns...  (METAMAC-1927)
    }

    @Test
    public void testToDatasetSelectionForTsv() throws Exception {

        org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection source = new org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection();
        source.setDimensions(new DatasetSelectionDimensions());
        source.getDimensions().getDimensions().add(mockDimension("TIME_PERIOD", 0, LabelVisualisationMode.CODE, "2012", "2013"));
        source.getDimensions().getDimensions().add(mockDimension("INDICADORES", 1, LabelVisualisationMode.LABEL, "INDICE_OCUPACION_PLAZAS"));
        source.getDimensions().getDimensions().add(mockDimension("CATEGORIA_ALOJAMIENTO", 20, LabelVisualisationMode.CODE_AND_LABEL, "1_2_3_ESTRELLAS"));
        source.getDimensions().getDimensions().add(mockDimension("DESTINO_ALOJAMIENTO", 21, LabelVisualisationMode.LABEL, "EL_HIERRO", "TENERIFE"));
        source.setAttributes(new DatasetSelectionAttributes());
        source.getAttributes().getAttributes().add(mockAttribute("ATTRIBUTE_01", LabelVisualisationMode.CODE_AND_LABEL));
        source.getAttributes().getAttributes().add(mockAttribute("ATTRIBUTE_02", LabelVisualisationMode.CODE));

        // Transform
        DatasetSelection selection = DatasetSelectionMapper.toDatasetSelection(source);

        // Validate
        assertEquals(source.getDimensions().getDimensions().size(), selection.getDimensions().size());
        for (DatasetSelectionDimension expected : source.getDimensions().getDimensions()) {
            assertDimension(expected, selection);
        }
        assertEquals(source.getAttributes().getAttributes().size(), selection.getAttributes().size());
        for (DatasetSelectionAttribute expected : source.getAttributes().getAttributes()) {
            assertAttribute(expected, selection);
        }
    }

    private DatasetSelectionDimension mockDimension(String dimensionId, Integer position, LabelVisualisationMode labelVisualisationMode, String... dimensionValues) {
        DatasetSelectionDimension dimension = new DatasetSelectionDimension();
        dimension.setDimensionId(dimensionId);
        dimension.setPosition(position);
        dimension.setLabelVisualisationMode(labelVisualisationMode);
        dimension.setDimensionValues(new DimensionValues());
        dimension.getDimensionValues().getDimensionValues().addAll(Arrays.asList(dimensionValues));
        return dimension;
    }

    private DatasetSelectionAttribute mockAttribute(String attributeId, LabelVisualisationMode labelVisualisationMode) {
        DatasetSelectionAttribute attribute = new DatasetSelectionAttribute();
        attribute.setAttributeId(attributeId);
        attribute.setLabelVisualisationMode(labelVisualisationMode);
        return attribute;
    }

    private void assertDimension(DatasetSelectionDimension expected, DatasetSelection actualDatasetSelection) {
        org.siemac.metamac.portal.core.domain.DatasetSelectionDimension actual = actualDatasetSelection.getDimension(expected.getDimensionId());
        assertEquals(expected.getDimensionId(), actual.getId());
        assertDimensionValues(expected, actual);
        assertEquals(expected.getPosition(), actual.getPosition());
        assertLabelVisualisationMode(expected.getLabelVisualisationMode(), actual.getLabelVisualisationMode());
    }

    private void assertDimensionValues(DatasetSelectionDimension expected, org.siemac.metamac.portal.core.domain.DatasetSelectionDimension actual) {
        assertEquals(expected.getDimensionValues().getDimensionValues(), actual.getSelectedDimensionValues());
    }

    private void assertAttribute(DatasetSelectionAttribute expected, DatasetSelection actualDatasetSelection) {
        org.siemac.metamac.portal.core.domain.DatasetSelectionAttribute actual = actualDatasetSelection.getAttribute(expected.getAttributeId());
        assertEquals(expected.getAttributeId(), actual.getId());
        assertLabelVisualisationMode(expected.getLabelVisualisationMode(), actual.getLabelVisualisationMode());
    }

    private void assertLabelVisualisationMode(LabelVisualisationMode expected, LabelVisualisationModeEnum actual) {
        MetamacAsserts.assertEqualsNullability(expected, actual);
        if (expected == null) {
            return;
        }
        assertEquals(expected.name(), actual.name());
    }

}