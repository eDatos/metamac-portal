package org.siemac.metamac.portal;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.cxf.helpers.IOUtils;
import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.siemac.metamac.core.common.exception.CommonServiceExceptionType;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.error.ServiceExceptionType;
import org.siemac.metamac.portal.core.utils.PortalUtils;
import org.siemac.metamac.portal.dto.Chapter;
import org.siemac.metamac.portal.dto.Collection;
import org.siemac.metamac.portal.dto.CollectionNode;
import org.siemac.metamac.portal.dto.Dataset;
import org.siemac.metamac.portal.dto.Indicator;
import org.siemac.metamac.portal.dto.IndicatorInstance;
import org.siemac.metamac.portal.dto.Multidataset;
import org.siemac.metamac.portal.dto.MultidatasetTable;
import org.siemac.metamac.portal.dto.Permalink;
import org.siemac.metamac.portal.dto.PermalinkContent;
import org.siemac.metamac.portal.dto.Query;
import org.siemac.metamac.portal.dto.QueryParams;
import org.siemac.metamac.portal.dto.Table;
import org.siemac.metamac.portal.mapper.Collection2DtoMapper;
import org.siemac.metamac.portal.mapper.Dataset2DtoMapper;
import org.siemac.metamac.portal.mapper.Multidataset2DtoMapper;
import org.siemac.metamac.portal.mapper.Query2DtoMapper;
import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.rest.common.v1_0.domain.Resource;
import org.siemac.metamac.rest.exception.RestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

public class Helpers {

    public static final String  PARAMETER_RESOURCE_TYPE                           = "resourceType";
    public static final String  PARAMETER_RESOURCE_ID                             = "resourceId";
    public static final String  PARAMETER_AGENCY_ID                               = "agencyId";
    public static final String  PARAMETER_VERSION                                 = "version";
    public static final String  PARAMETER_INDICATOR_SYSTEM                        = "indicatorSystem";
    public static final String  PARAMETER_SHARED_VISUALIZER_URL                   = "sharedVisualizerUrl";
    public static final String  PARAMETER_MULTIDATASET_ID                         = "multidatasetId";
    public static final String  PARAMETER_LOCALE                                  = "locale";
    public static final String  PARAMETER_TITLE                                   = "title";

    // Mainly intended for debug
    public static final String  PARAMETER_THEME                                   = "theme";

    private static final String DEFAULT_LANGUAGE                                  = "es";
    private static final String LATEST_VERSION                                    = "~latest";
    private static final int    MINIMAL_FIXED_DIGITS_IN_NUMERATION                = 2;

    private static final Logger LOGGGER                                           = LoggerFactory.getLogger(Helpers.class);

    private String              language;
    private String              DEFAULT_KEY                                       = "__default__";
    private static final String FIELDS_EXCLUDE_DATA_AND_METADATA_INCLUDE_KEYWORDS = "-data,-metadata,+keywords";
    private static final String FIELDS_EXCLUDE_METADATA_INCLUDE_KEYWORDS          = "-metadata,+keywords";

    public Helpers(String language) {
        if (language.isEmpty()) {
            this.language = DEFAULT_LANGUAGE;
        } else {
            this.language = language;
        }
    }

    public static String getPackageVersion() {
        Package packageInfo = Package.getPackage("org.siemac.metamac.portal");
        return packageInfo.getImplementationVersion();
    }

    public static Collection getCollection(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) {
        Collection collection = null;
        Collection2DtoMapper collection2DtoMapper = new Collection2DtoMapper();
        try {
            // Ex: "http://HOST/statistical-resources/apis/statistical-resources";
            List<String> lang = new ArrayList<String>();
            String fields = FIELDS_EXCLUDE_METADATA_INCLUDE_KEYWORDS;

            if (internalPortal) {
                collection = collection2DtoMapper.collectionInternalToDto(Helpers.getInternalJAXRSClient(apiUrlStatisticalResources).retrieveCollection(agencyId, resourceId, lang, fields));
            } else {
                collection = collection2DtoMapper.collectionExternalToDto(Helpers.getExternalJAXRSClient(apiUrlStatisticalResources).retrieveCollection(agencyId, resourceId, lang, fields));
            }

        } catch (Exception e) {
            LOGGGER.error("Error obteniendo la Colección", e);
        }
        return collection;
    }

    public static Dataset getDataset(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId, String version) throws Exception {
        Dataset dataset = null;
        Dataset2DtoMapper dataset2DtoMapper = new Dataset2DtoMapper();
        try {
            // Ex: "http://HOST/statistical-resources/apis/statistical-resources";
            List<String> lang = new ArrayList<String>();
            if (version == null) {
                version = LATEST_VERSION;
            }

            String fields = FIELDS_EXCLUDE_DATA_AND_METADATA_INCLUDE_KEYWORDS;
            if (internalPortal) {
                dataset = dataset2DtoMapper.datasetInternalToDto(Helpers.getInternalJAXRSClient(apiUrlStatisticalResources).retrieveDataset(agencyId, resourceId, version, lang, fields, null, null));
            } else {
                dataset = dataset2DtoMapper.datasetExternalToDto(Helpers.getExternalJAXRSClient(apiUrlStatisticalResources).retrieveDataset(agencyId, resourceId, version, lang, fields, null, null));
            }

        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el Dataset", e);
            MetamacException exception = getException(e, resourceId);
            if (exception != null) {
                throw exception;
            }
        }
        return dataset;
    }

    private static MetamacException getException(Exception e, String resourceId) {
        if (e.getMessage().contains("exception.resources.dataset.empty_data")) {
            return new MetamacException(ServiceExceptionType.DATASET_NO_DATA, resourceId);
        }
        return null;
    }

    public static Query getQuery(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) {
        Query query = null;
        Query2DtoMapper query2DtoMapper = new Query2DtoMapper();
        try {
            // Ex: "http://HOST/statistical-resources/apis/statistical-resources";
            String statisticalResourcesEndpoint = apiUrlStatisticalResources;

            List<String> lang = new ArrayList<String>();
            String fieldsForQuery = FIELDS_EXCLUDE_DATA_AND_METADATA_INCLUDE_KEYWORDS;
            if (internalPortal) {
                org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Query statisticalResourcesQuery = Helpers.getInternalJAXRSClient(statisticalResourcesEndpoint)
                        .retrieveQuery(agencyId, resourceId, lang, fieldsForQuery, null, null);
                query = query2DtoMapper.queryInternalToDto(statisticalResourcesQuery);
            } else {
                org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query statisticalResourcesQuery = Helpers.getExternalJAXRSClient(statisticalResourcesEndpoint).retrieveQuery(agencyId,
                        resourceId, lang, fieldsForQuery, null, null);
                query = query2DtoMapper.queryExternalToDto(statisticalResourcesQuery);
            }

        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el Query", e);
        }
        return query;
    }

    public static Multidataset getMultidataset(String apiUrlStatisticalResources, Boolean internalPortal, String multidatasetId) {
        Multidataset multidataset = null;
        Multidataset2DtoMapper multidataset2DtoMapper = new Multidataset2DtoMapper();
        try {
            // Ex: "http://HOST/statistical-resources/apis/statistical-resources";
            List<String> lang = new ArrayList<String>();
            String fields = FIELDS_EXCLUDE_METADATA_INCLUDE_KEYWORDS;
            String agencyId = PortalUtils.splitUrnWithoutPrefixItemScheme(multidatasetId)[0];
            String resourceId = PortalUtils.splitUrnWithoutPrefixItemScheme(multidatasetId)[1];

            if (internalPortal) {
                multidataset = multidataset2DtoMapper.multidatasetInternalToDto(Helpers.getInternalJAXRSClient(apiUrlStatisticalResources).retrieveMultidataset(agencyId, resourceId, lang, fields));
            } else {
                multidataset = multidataset2DtoMapper.multidatasetExternalToDto(Helpers.getExternalJAXRSClient(apiUrlStatisticalResources).retrieveMultidataset(agencyId, resourceId, lang, fields));
            }

        } catch (Exception e) {
            LOGGGER.error("Error obteniendo la Colección", e);
        }
        return multidataset;
    }

    public static Indicator getIndicator(String apiUrlIndicators, Boolean internalPortal, String resourceId) {
        String indicatorsEndpoint = apiUrlIndicators;
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.getForObject(indicatorsEndpoint + "/v1.0/indicators/" + resourceId, Indicator.class);
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    public static IndicatorInstance getIndicatorInstance(String apiUrlIndicators, Boolean internalPortal, String resourceId, String indicatorsSystems) {
        String indicatorsEndpoint = apiUrlIndicators;
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.getForObject(indicatorsEndpoint + "/v1.0/indicatorsSystems/" + indicatorsSystems + "/indicatorsInstances/" + resourceId, IndicatorInstance.class);
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el la Instancia del Indicador", e);
        }
        return null;
    }

    public static Permalink getPermalink(String apiUrlPermalinks, String identifier) {
        Permalink permalink = new Permalink();
        try {
            permalink.setId(identifier);

            String permalinkContentString = IOUtils.toString((InputStream) Helpers.getPermalinksJAXRSClient(apiUrlPermalinks).retrievePermalinkByIdJson(identifier).getEntity());
            PermalinkContent permalinkContent = permalinkContentToDto(permalinkContentString);
            permalink.setContent(permalinkContent);
            return permalink;
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el Permalink", e);
        }
        return null;
    }

    private static PermalinkContent permalinkContentToDto(String content) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper.readValue(content, PermalinkContent.class);
    }

    public static String buildUrl(Permalink permalink, String sharedVisualizerUrl) throws UnsupportedEncodingException {
        return buildUrl(permalink, sharedVisualizerUrl, null, null);
    }

    public static String buildUrl(Permalink permalink, String sharedVisualizerUrl, String locale, String title) throws UnsupportedEncodingException {
        StringBuilder stringBuilder = new StringBuilder();

        QueryParams queryParams = permalink.getContent().getQueryParams();

        // Permalink url must be rebuild, because you must not store the visualizer url inside the permalink stored on db in case
        // the baseUrl changes tomorrow.
        buildUrl(stringBuilder, queryParams.getType(), queryParams.getAgency(), queryParams.getIdentifier(), queryParams.getVersion(), queryParams.getIndicatorSystem(),
                queryParams.getMultidatasetId(), sharedVisualizerUrl, locale, title);

        // Hash is the SPA route, for example #datasets/selection. Includes #
        stringBuilder.append(permalink.getContent().getHash());
        stringBuilder.append("/").append("permalink").append("/").append(permalink.getId());

        return stringBuilder.toString();
    }

    public static String buildUrl(Multidataset multidataset, String multidatasetId, String sharedVisualizerUrl) throws UnsupportedEncodingException {
        return buildUrl(multidataset, multidatasetId, sharedVisualizerUrl, null, null);
    }

    public static String buildUrl(Multidataset multidataset, String multidatasetId, String sharedVisualizerUrl, String locale, String title) throws UnsupportedEncodingException {
        StringBuilder stringBuilder = new StringBuilder();
        MultidatasetTable table = (MultidatasetTable) multidataset.getData().getNodes().getNodes().get(0);
        Resource resource = table.getDataset() != null ? table.getDataset() : table.getQuery();
        if (resource == null) {
            return StringUtils.EMPTY;
        }

        String baseUrl = resource.getVisualizerHtmlLink();
        if (!StringUtils.isBlank(baseUrl)) {
            stringBuilder.append(baseUrl);
        }
        buildUrl(stringBuilder, null, null, null, null, null, multidatasetId, sharedVisualizerUrl, locale, title);

        return stringBuilder.toString();
    }

    private static void buildUrl(StringBuilder stringBuilder, String resourceType, String agency, String identifier, String version, String indicatorSystem, String multidatasetId,
            String sharedVisualizerUrl, String locale, String title) throws UnsupportedEncodingException {
        appendParameter(stringBuilder, PARAMETER_RESOURCE_TYPE, resourceType);
        appendParameter(stringBuilder, PARAMETER_AGENCY_ID, agency);
        appendParameter(stringBuilder, PARAMETER_RESOURCE_ID, identifier);
        appendParameter(stringBuilder, PARAMETER_VERSION, version);
        appendParameter(stringBuilder, PARAMETER_INDICATOR_SYSTEM, indicatorSystem);
        appendParameter(stringBuilder, PARAMETER_MULTIDATASET_ID, multidatasetId);
        appendParameter(stringBuilder, PARAMETER_SHARED_VISUALIZER_URL, sharedVisualizerUrl);
        appendParameter(stringBuilder, PARAMETER_TITLE, UriUtils.encodeQueryParam(title, StandardCharsets.UTF_8.toString()));
        if (locale != null) {
            appendParameter(stringBuilder, PARAMETER_LOCALE, locale);
        }
    }

    private static org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0 getInternalJAXRSClient(String statisticalResourcesEndpoint) {
        return JAXRSClientFactory.create(statisticalResourcesEndpoint, org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0.class, null, true);
    }

    private static org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0 getExternalJAXRSClient(String statisticalResourcesEndpoint) {
        return JAXRSClientFactory.create(statisticalResourcesEndpoint, org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0.class, null, true);
    }

    private static org.siemac.metamac.portal.rest.external.permalink.v1_0.service.PermalinksV1_0 getPermalinksJAXRSClient(String permalinksEndpoint) {
        return JAXRSClientFactory.create(permalinksEndpoint, org.siemac.metamac.portal.rest.external.permalink.v1_0.service.PermalinksV1_0.class, null, true);
    }

    public static String html2text(String html) {
        return Jsoup.clean(html, Whitelist.none());
    }

    public static int numberOfFixedDigitsInNumeration(Collection collection) {
        Integer totalIndicatorInstances = countIndicatorInstances(collection.getData().getNodes().getNodes());
        int fixedDigits = totalIndicatorInstances.toString().length();
        if (fixedDigits < MINIMAL_FIXED_DIGITS_IN_NUMERATION) {
            fixedDigits = MINIMAL_FIXED_DIGITS_IN_NUMERATION;
        }
        return fixedDigits;
    }

    public static int countIndicatorInstances(List<CollectionNode> nodes) {
        int total = 0;
        if (nodes != null) {
            for (CollectionNode node : nodes) {
                if (node instanceof Chapter) {
                    Chapter chapter = (Chapter) node;
                    if (chapter.getNodes() != null) {
                        total += countIndicatorInstances(chapter.getNodes().getNodes());
                    }
                } else {
                    total += 1;
                }
            }
        }
        return total;
    }

    public String localizeText(InternationalString internationalString) {
        if (internationalString != null) {
            for (LocalisedString text : internationalString.getTexts()) {
                if (text.getLang().equals(language)) {
                    return text.getValue();
                }
            }
            return internationalString.getTexts().get(0).getValue();
        } else {
            return StringUtils.EMPTY;
        }
    }

    public String localizeText(Map<String, String> stringMap) {
        if (stringMap == null) {
            return StringUtils.EMPTY;
        }

        String translation = stringMap.get(language);
        if (translation != null) {
            return translation;
        }

        translation = stringMap.get(DEFAULT_KEY);
        if (translation != null) {
            return translation;
        }

        return StringUtils.EMPTY;
    }

    public static String reverseIndex(String[] arr, int i) {
        return arr[arr.length - i - 1];
    }

    public static String tableViewUrl(Table table) {
        Resource resource = getResourceFromTable(table);
        return resource.getVisualizerHtmlLink();
    }

    private static Resource getResourceFromTable(Table table) {
        Resource resource = null;

        if (table.getDataset() != null) {
            resource = table.getDataset();
        } else if (table.getQuery() != null) {
            resource = table.getQuery();
        } else if (table.getMultidataset() != null) {
            resource = table.getMultidataset();
        } else if (table.getUrl() != null) {
            resource = table.getUrl();
        }
        return resource;
    }

    private static void appendParameter(StringBuilder builder, String key, String value) {
        if (!StringUtils.isBlank(value)) {
            appendAmpersandOrQuestionmark(builder);
            builder.append(key).append("=").append(value);
        }
    }

    private static void appendAmpersandOrQuestionmark(StringBuilder builder) {
        if (builder.length() > 0) {
            builder.append("&");
        } else {
            builder.append("?");
        }

    }

}
