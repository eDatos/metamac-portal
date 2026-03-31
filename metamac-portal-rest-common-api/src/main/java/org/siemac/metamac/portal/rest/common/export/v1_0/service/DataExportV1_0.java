package org.siemac.metamac.portal.rest.common.export.v1_0.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.siemac.metamac.rest.export.v1_0.domain.Exportation;

@Path("/v1.0")
// IMPORTANT: If a new version of API is added, remember change latest url y urlrewrite.xml in war
public interface DataExportV1_0 {

    /**
     * Exports to excel
     */
    @POST
    @Path("excel/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToExcel(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("excel/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToExcelForm(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("excel/queries/{agencyID}/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportQueryToExcel(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @QueryParam("lang") String lang,
            @QueryParam("filename") String filename);

    @POST
    @Path("excel/queries/{agencyID}/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportQueryToExcelForm(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @QueryParam("lang") String lang,
            @QueryParam("filename") String filename);

    @POST
    @Path("excel/indicators/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportIndicatorToExcel(Exportation exportationBody, @PathParam("resourceID") String resourceID, @QueryParam("filename") String filename);

    @POST
    @Path("excel/indicators/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportIndicatorToExcelForm(@FormParam("jsonBody") String jsonBody, @PathParam("resourceID") String resourceID, @QueryParam("filename") String filename);

    @POST
    @Path("excel/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportIndicatorInstanceToExcel(Exportation exportationBody, @PathParam("indicatorSystemCode") String indicatorSystemCode, @PathParam("resourceID") String resourceID,
            @QueryParam("filename") String filename);

    @POST
    @Path("excel/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}")
    Response exportIndicatorInstanceToExcelForm(@FormParam("jsonBody") String jsonBody, @PathParam("indicatorSystemCode") String indicatorSystemCode, @PathParam("resourceID") String resourceID,
            @QueryParam("filename") String filename);

    /**
     * Exports to tsv. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes with dataset
     * and dimension attachment level
     */
    @POST
    @Path("tsv/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToTsv(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("tsv/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToTsv(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("tsv/queries/{agencyID}/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportQueryToTsv(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @QueryParam("lang") String lang,
            @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("tsv/queries/{agencyID}/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportQueryToTsv(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @QueryParam("lang") String lang,
            @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("tsv/indicators/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportIndicatorToTsv(Exportation exportationBody, @PathParam("resourceID") String resourceID, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("tsv/indicators/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportIndicatorToTsv(@FormParam("jsonBody") String jsonBody, @PathParam("resourceID") String resourceID, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("tsv/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportIndicatorInstanceToTsv(Exportation exportationBody, @PathParam("indicatorSystemCode") String indicatorSystemCode, @PathParam("resourceID") String resourceID,
            @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("tsv/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportIndicatorInstanceToTsv(@FormParam("jsonBody") String jsonBody, @PathParam("indicatorSystemCode") String indicatorSystemCode, @PathParam("resourceID") String resourceID,
            @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    /**
     * Exports a dataset to csv comma separated. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes
     * with dataset
     * and dimension attachment level
     */
    @POST
    @Path("csv_comma/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToCsvComma(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("csv_comma/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToCsvComma(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    /**
     * Exports a dataset to tsv. Returns a zip containing two tsv files: one file with observations and attributes with observation attachment level and another one with attributes with dataset
     * and dimension attachment level
     */
    @POST
    @Path("csv_semicolon/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToCsvSemicolon(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    @POST
    @Path("csv_semicolon/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToCsvSemicolon(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID,
            @PathParam("version") String version, @QueryParam("lang") String lang, @QueryParam("filename") String filename, @QueryParam("fields") String fields, @QueryParam("decimalSeparator") String decimalSeparator);

    /**
     * Export to px
     */
    @POST
    @Path("px/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportDatasetToPx(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("px/datasets/{agencyID}/{resourceID}/{version}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportDatasetToPxForm(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @PathParam("version") String version,
            @QueryParam("lang") String lang, @QueryParam("filename") String filename);

    @POST
    @Path("px/queries/{agencyID}/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportQueryToPx(Exportation exportationBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @QueryParam("lang") String lang,
            @QueryParam("filename") String filename);

    @POST
    @Path("px/queries/{agencyID}/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportQueryToPxForm(@FormParam("jsonBody") String jsonBody, @PathParam("agencyID") String agencyID, @PathParam("resourceID") String resourceID, @QueryParam("lang") String lang,
            @QueryParam("filename") String filename);

    @POST
    @Path("px/indicators/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportIndicatorToPx(Exportation exportationBody, @PathParam("resourceID") String resourceID, @QueryParam("filename") String filename);

    @POST
    @Path("px/indicators/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportIndicatorToPxForm(@FormParam("jsonBody") String jsonBody, @PathParam("resourceID") String resourceID, @QueryParam("filename") String filename);

    @POST
    @Path("px/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    Response exportIndicatorInstanceToPx(Exportation exportationBody, @PathParam("indicatorSystemCode") String indicatorSystemCode, @PathParam("resourceID") String resourceID,
            @QueryParam("filename") String filename);

    @POST
    @Path("px/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportIndicatorInstanceToPx(@FormParam("jsonBody") String jsonBody, @PathParam("indicatorSystemCode") String indicatorSystemCode, @PathParam("resourceID") String resourceID,
            @QueryParam("filename") String filename);

    /**
     * Exports svg to image
     */
    @POST
    @Path("image")
    @Consumes({MediaType.WILDCARD})
    Response exportSvgToImage(String svg, @QueryParam("filename") String filename, @QueryParam("width") Float width, @QueryParam("type") String mimeType);

    /**
     * Exports svg to image
     */
    @POST
    @Path("image")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    Response exportSvgToImageForm(@FormParam("svg") String svg, @QueryParam("filename") String filename, @QueryParam("width") Float width, @QueryParam("type") String mimeType);

}