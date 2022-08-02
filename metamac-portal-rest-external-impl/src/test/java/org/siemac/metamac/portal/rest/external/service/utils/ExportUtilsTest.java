package org.siemac.metamac.portal.rest.external.service.utils;

import static org.junit.Assert.assertEquals;
import static org.siemac.metamac.portal.rest.external.service.utils.ExportUtils.buildFilenameWithProposedExtension;
import static org.siemac.metamac.portal.rest.external.service.utils.ExportUtils.buildSafeFilenameWithoutExtension;

import org.junit.Test;

public class ExportUtilsTest {

    @Test
    public void testBuildFilenameWithProposedExtension() {
        assertEquals("a.csv", buildFilenameWithProposedExtension("csv", "a"));
        assertEquals("a.tsv", buildFilenameWithProposedExtension("csv", "a.tsv"));
        // Beware! if the filename parameter has a point we can´t distinguish if it´s an extension or just part of the name. It will considered an extension
        assertEquals("a.1", buildFilenameWithProposedExtension("csv", "a.1"));
        // Except, that you can send an filename with points if you provide the extension
        assertEquals("a.1.tsv", buildFilenameWithProposedExtension("csv", "a.1.tsv"));
    }

    @Test
    public void testBuildFilenameWithoutExtensionNorPoints() {
        {
            String proposedFilename = buildSafeFilenameWithoutExtension("a", "b");
            assertEquals("a-b.csv", buildFilenameWithProposedExtension("csv", proposedFilename));
        }
        {
            String proposedFilename = buildSafeFilenameWithoutExtension("a", "b", "1.2.0");
            assertEquals("a-b-1_2_0.csv", buildFilenameWithProposedExtension("csv", proposedFilename));
        }
    }

}
