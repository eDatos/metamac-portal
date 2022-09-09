package org.siemac.metamac.portal.rest.external.service.utils;

import static org.junit.Assert.assertEquals;
import static org.siemac.metamac.portal.rest.external.service.utils.ExportUtils.addExtensionToFilenameIfNeeded;
import static org.siemac.metamac.portal.rest.external.service.utils.ExportUtils.buildExportFilenameWithoutExtension;

import org.junit.Test;
import org.siemac.metamac.rest.export.v1_0.domain.DatasetSelection;
import org.siemac.metamac.rest.export.v1_0.domain.Exportation;

public class ExportUtilsTest {

    @Test
    public void testBuildFilenameWithProposedExtension() {
        assertEquals("a.csv", addExtensionToFilenameIfNeeded("csv", "a"));
        assertEquals("a.tsv", addExtensionToFilenameIfNeeded("csv", "a.tsv"));
        // Beware! if the filename parameter has a point we can´t distinguish if it´s an extension or just part of the name. It will considered an extension
        assertEquals("a.1", addExtensionToFilenameIfNeeded("csv", "a.1"));
        // Except, that you can send an filename with points if you provide the extension
        assertEquals("a.1.tsv", addExtensionToFilenameIfNeeded("csv", "a.1.tsv"));
    }

    @Test
    public void testBuildFilenameWithoutExtensionNorPoints() {
        {
            String proposedFilename = buildExportFilenameWithoutExtension(null, "a", "b");
            assertEquals("a-b.csv", addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
        {
            String proposedFilename = buildExportFilenameWithoutExtension(null, "a", "b", "1.2.0");
            assertEquals("a-b-1_2_0.csv", addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
        {
            String proposedFilename = buildExportFilenameWithoutExtension(mockExportation(), "a", "b");
            assertEquals("a-b-selection.csv", addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
        {
            String proposedFilename = buildExportFilenameWithoutExtension(mockExportation(), "a", "b", "1.2.0");
            assertEquals("a-b-1_2_0-selection.csv", addExtensionToFilenameIfNeeded("csv", proposedFilename));
        }
    }

    private Exportation mockExportation() {
        Exportation exportationBody = new Exportation();
        exportationBody.setDatasetSelection(new DatasetSelection());
        return exportationBody;
    }

}
