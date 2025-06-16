package org.siemac.metamac.portal.rest.common.service.utils;

import static org.junit.Assert.assertEquals;

import org.junit.Assert;
import org.junit.Test;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimension;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelectionDimensions;
import org.siemac.metamac.rest.export.v1_0.domain.DimensionValues;
import org.siemac.metamac.rest.export.v1_0.domain.Exportation;

public class ExportUtilsTest {

    @Test
    public void testBuildFilenameWithProposedExtension() {
        Assert.assertEquals("a.csv", ExportUtils.addExtensionToFilenameIfNeeded("csv", "a"));
        Assert.assertEquals("a.tsv", ExportUtils.addExtensionToFilenameIfNeeded("csv", "a.tsv"));
        // Beware! if the filename parameter has a point we can´t distinguish if it´s an extension or just part of the name. It will considered an extension
        Assert.assertEquals("a.1", ExportUtils.addExtensionToFilenameIfNeeded("csv", "a.1"));
        // Except, that you can send an filename with points if you provide the extension
        Assert.assertEquals("a.1.tsv", ExportUtils.addExtensionToFilenameIfNeeded("csv", "a.1.tsv"));
    }

    @Test
    public void testBuildFilenameWithoutExtensionNorPoints() {
        {
            String proposedFilename = ExportUtils.buildExportFilenameWithoutExtension(null, "a", "b");
            Assert.assertEquals("a-b.csv", ExportUtils.addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
        {
            String proposedFilename = ExportUtils.buildExportFilenameWithoutExtension(null, "a", "b", "1.2.0");
            Assert.assertEquals("a-b-1_2_0.csv", ExportUtils.addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
        {
            String proposedFilename = ExportUtils.buildExportFilenameWithoutExtension(mockExportation(), "a", "b");
            Assert.assertEquals("a-b-selection.csv", ExportUtils.addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
        {
            String proposedFilename = ExportUtils.buildExportFilenameWithoutExtension(mockExportation(), "a", "b", "1.2.0");
            Assert.assertEquals("a-b-1_2_0-selection.csv", ExportUtils.addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
    }

    private Exportation mockExportation() {
        Exportation exportationBody = new Exportation();
        DatasetSelection datasetSelection = new DatasetSelection();
        DatasetSelectionDimensions datasetSelectionDimensions = new DatasetSelectionDimensions();
        DatasetSelectionDimension datasetSelectionDimension = new DatasetSelectionDimension();
        DimensionValues dimensionValues = new DimensionValues();

        dimensionValues.getDimensionValues().add("testDimensionValue");
        datasetSelectionDimension.setDimensionValues(dimensionValues);
        datasetSelectionDimensions.getDimensions().add(datasetSelectionDimension);
        datasetSelection.setDimensions(datasetSelectionDimensions);
        exportationBody.setDatasetSelection(datasetSelection);
        return exportationBody;
    }

}
