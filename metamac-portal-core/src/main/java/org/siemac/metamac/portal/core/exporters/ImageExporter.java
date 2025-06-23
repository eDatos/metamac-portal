package org.siemac.metamac.portal.core.exporters;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.lang.StringUtils;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.error.ServiceExceptionParameters;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ImageExporter {

    private static final String              FORBIDDEN_WORD = "<!ENTITY";

    private final String                     svg;
    private final SvgExportSupportedMimeType mimeType;
    private final Float                      width;

    private static Logger                    log            = LoggerFactory.getLogger(ImageExporter.class);

    public ImageExporter(String svg, Float width, String mimeType) throws MetamacException {
        validateSvg(svg);
        this.svg = svg;
        this.width = getWidth(width);
        this.mimeType = getMimeType(mimeType);
    }

    public void write(OutputStream os) throws MetamacException {
        try {
            if (!SvgExportSupportedMimeType.SVG.equals(mimeType)) {
                SVGRasterizer.getInstance().transcode(os, svg, mimeType, width);
            } else {
                os.write(svg.getBytes(StandardCharsets.UTF_8));
            }
        } catch (Exception e) {
            log.error("Error while transcoding svg file to an image", e);
            throw new MetamacException(e, ServiceExceptionType.UNKNOWN, "Error while transcoding svg file to an image");
        }
    }

    private void validateSvg(String svg) throws MetamacException {
        if (StringUtils.containsIgnoreCase(svg, FORBIDDEN_WORD)) {
            // The svg could contain a malicious attack
            throw new MetamacException(ServiceExceptionType.PARAMETER_INCORRECT, ServiceExceptionParameters.SVG);
        }
    }

    private Float getWidth(Float width) {
        if (width != null && width.compareTo(0.0F) > 0) {
            return width;
        }
        return null;
    }

    private SvgExportSupportedMimeType getMimeType(String mime) {
        if (mime != null) {
            SvgExportSupportedMimeType type = SvgExportSupportedMimeType.get(mime);
            if (type != null) {
                return type;
            }
        }
        return SvgExportSupportedMimeType.PNG;
    }
}
