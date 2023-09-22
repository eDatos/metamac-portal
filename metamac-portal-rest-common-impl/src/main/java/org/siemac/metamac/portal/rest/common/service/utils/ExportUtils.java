package org.siemac.metamac.portal.rest.common.service.utils;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.core.common.util.shared.ArrayUtils;
import org.siemac.metamac.rest.export.v1_0.domain.Exportation;

public class ExportUtils {

    private static final String POSTFIX_SELECTION = "selection";

    /* We add the extension if it doesn´t have any */
    public static String addExtensionToFilenameIfNeeded(String proposedExtension, String existingFilename) {
        String currentExtension = FilenameUtils.getExtension(existingFilename);
        if (!StringUtils.isEmpty(currentExtension)) {
            return existingFilename;
        } else {
            return buildFilename("." + proposedExtension, existingFilename);
        }
    }

    public static String buildExportFilename(String extension, Exportation exportationBody, String... parts) {
        if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
            return buildFilename(extension, ArrayUtils.addStringElementsToStringArray(parts, POSTFIX_SELECTION));
        } else {
            return buildFilename(extension, parts);
        }
    }

    private static String buildFilename(String extension, String... parts) {
        return buildFilenameWithoutExtension(parts) + extension;
    }

    public static String buildExportFilenameWithoutExtension(Exportation exportationBody, String... parts) {
        if (exportationBody != null && exportationBody.getDatasetSelection() != null) {
            return buildFilenameWithoutExtension(ArrayUtils.addStringElementsToStringArray(parts, POSTFIX_SELECTION));
        } else {
            return buildFilenameWithoutExtension(parts);
        }
    }

    private static String buildFilenameWithoutExtension(String... parts) {
        StringBuilder filename = new StringBuilder();
        return filename.append(StringUtils.join(parts, "-")).toString().replace(".", "_");
    }

}
