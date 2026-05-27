package org.siemac.metamac.portal;

import static org.codehaus.jackson.map.DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.lang.LocaleUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.cxf.helpers.IOUtils;
import org.apache.cxf.jaxrs.client.JAXRSClientFactory;
import org.apache.cxf.jaxrs.client.ServerWebApplicationException;
import org.apache.cxf.jaxrs.client.WebClient;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.DeserializationConfig.Feature;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.siemac.edatos.core.common.constants.CoreCommonConstants;
import org.siemac.metamac.core.common.exception.CommonServiceExceptionType;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.exception.utils.TranslateExceptions;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
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
    public static final String  PARAMETER_PERMALINK                               = "permalink";

    // Mainly intended for debug
    public static final String  PARAMETER_THEME                                   = "theme";
    public static final String  PARAMETER_PALETTE                                 = "palette";

    private static final String LATEST_VERSION                                    = "~latest";
    private static final int    MINIMAL_FIXED_DIGITS_IN_NUMERATION                = 2;

    private static final Logger LOGGGER                                           = LoggerFactory.getLogger(Helpers.class);

    private static final String FIELDS_EXCLUDE_DATA_AND_METADATA_INCLUDE_KEYWORDS = "-data,-metadata,+keywords";
    private static final String FIELDS_EXCLUDE_METADATA_INCLUDE_KEYWORDS          = "-metadata,+keywords";
    private static final String FIELDS_INCLUDE_KEYWORDS                           = "+keywords";
    private static final String DEFAULT_KEY                                        = "__default__";

    private String       language;
    private String       defaultLanguage;
    private String       apiKey;

    private static final RestTemplate restTemplate = buildRestTemplate();

    private static RestTemplate buildRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        for (HttpMessageConverter<?> messageConverter : restTemplate.getMessageConverters()) {
            if (messageConverter instanceof MappingJacksonHttpMessageConverter) {
                ((MappingJacksonHttpMessageConverter) messageConverter).getObjectMapper().configure(FAIL_ON_UNKNOWN_PROPERTIES, false);
            }
        }
        return restTemplate;
    }

    public Helpers(String language, String defaultLanguage, String apiKey) {
        this.language = language;
        this.defaultLanguage = defaultLanguage;
        this.apiKey = apiKey;
    }

    public Helpers(String language, String defaultLanguage) {
        this.language = language;
        this.defaultLanguage = defaultLanguage;
    }

    public static String getPackageVersion() {
        Package packageInfo = Package.getPackage("org.siemac.metamac.portal");
        return packageInfo.getImplementationVersion();
    }

    public Collection getCollection(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) throws Throwable {
        Collection collection = null;
        Collection2DtoMapper collection2DtoMapper = new Collection2DtoMapper();
        try {
            // Ex: "http://HOST/statistical-resources/apis/statistical-resources";
            List<String> lang = new ArrayList<String>();
            String fields = FIELDS_INCLUDE_KEYWORDS;

            if (internalPortal) {
                collection = collection2DtoMapper.collectionInternalToDto(getInternalJAXRSClient(apiUrlStatisticalResources).retrieveCollection(agencyId, resourceId, lang, fields));
            } else {
                collection = collection2DtoMapper.collectionExternalToDto(getExternalJAXRSClient(apiUrlStatisticalResources).retrieveCollection(agencyId, resourceId, lang, fields));
            }

        } catch (ServerWebApplicationException e) {
            throw getExceptionDataset(e, apiUrlStatisticalResources, agencyId, resourceId, null);
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo la Colección", e);
        }
        if (collection == null || collection.getData() == null || collection.getData().getNodes() == null) {
            Locale locale = LocaleUtils.toLocale(language);
            throw new TranslateExceptions().translateException(locale, new MetamacException(ServiceExceptionType.COLLECTION_NO_DATA, resourceId, agencyId));
        }
        return collection;
    }

    public Dataset getDataset(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId, String version) throws Throwable {
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
                dataset = dataset2DtoMapper.datasetInternalToDto(getInternalJAXRSClient(apiUrlStatisticalResources).retrieveDataset(agencyId, resourceId, version, lang, fields, null, null, null));
            } else {
                dataset = dataset2DtoMapper.datasetExternalToDto(getExternalJAXRSClient(apiUrlStatisticalResources).retrieveDataset(agencyId, resourceId, version, lang, fields, null, null, null));
            }

        } catch (ServerWebApplicationException e) {
            throw getExceptionDataset(e, apiUrlStatisticalResources, agencyId, resourceId, version);
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el Dataset", e);
        }
        return dataset;
    }

    private Throwable getExceptionDataset(ServerWebApplicationException e, String apiUrlStatisticalResources, String agencyId, String resourceId, String version) {
        try {
            LOGGGER.error(e.getMessage(), e);
            Locale locale = LocaleUtils.toLocale(language);
            org.siemac.metamac.rest.common.v1_0.domain.Exception exception = e.toErrorObject(WebClient.client(getInternalJAXRSClient(apiUrlStatisticalResources)),
                    org.siemac.metamac.rest.common.v1_0.domain.Exception.class);
            CommonServiceExceptionType serviceExceptionType = ServiceExceptionType.lookup(exception.getCode());
            Throwable throwable = null;
            if (agencyId == null && version == null) {
                throwable = new TranslateExceptions().translateException(locale, new MetamacException(serviceExceptionType, resourceId));
            } else if (version == null) {
                throwable = new TranslateExceptions().translateException(locale, new MetamacException(serviceExceptionType, resourceId, agencyId));
            } else {
                throwable = new TranslateExceptions().translateException(locale, new MetamacException(serviceExceptionType, resourceId, agencyId, version));
            }
            return throwable;
        } catch (Exception ex) {
            LOGGGER.error(ex.getMessage(), ex);
            throw ex;
        }
    }

    public Query getQuery(String apiUrlStatisticalResources, Boolean internalPortal, String agencyId, String resourceId) throws Throwable {
        Query query = null;
        Query2DtoMapper query2DtoMapper = new Query2DtoMapper();
        try {
            // Ex: "http://HOST/statistical-resources/apis/statistical-resources";
            String statisticalResourcesEndpoint = apiUrlStatisticalResources;

            List<String> lang = new ArrayList<String>();
            String fieldsForQuery = FIELDS_EXCLUDE_DATA_AND_METADATA_INCLUDE_KEYWORDS;
            if (internalPortal) {
                org.siemac.metamac.rest.statistical_resources_internal.v1_0.domain.Query statisticalResourcesQuery = getInternalJAXRSClient(statisticalResourcesEndpoint)
                        .retrieveQuery(agencyId, resourceId, lang, fieldsForQuery, null, null, null);
                query = query2DtoMapper.queryInternalToDto(statisticalResourcesQuery);
            } else {
                org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query statisticalResourcesQuery = getExternalJAXRSClient(statisticalResourcesEndpoint).retrieveQuery(agencyId,
                        resourceId, lang, fieldsForQuery, null, null, null);
                query = query2DtoMapper.queryExternalToDto(statisticalResourcesQuery);
            }

        } catch (ServerWebApplicationException e) {
            throw getExceptionDataset(e, apiUrlStatisticalResources, agencyId, resourceId, null);
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el Query", e);
        }
        return query;
    }

    public Multidataset getMultidataset(String apiUrlStatisticalResources, Boolean internalPortal, String multidatasetId) throws Throwable {
        Multidataset multidataset = null;
        Multidataset2DtoMapper multidataset2DtoMapper = new Multidataset2DtoMapper();
        String agencyId = PortalUtils.splitUrnWithoutPrefixItemScheme(multidatasetId)[0];
        String resourceId = PortalUtils.splitUrnWithoutPrefixItemScheme(multidatasetId)[1];
        try {
            // Ex: "http://HOST/statistical-resources/apis/statistical-resources";
            List<String> lang = new ArrayList<String>();
            String fields = FIELDS_EXCLUDE_METADATA_INCLUDE_KEYWORDS;

            if (internalPortal) {
                multidataset = multidataset2DtoMapper.multidatasetInternalToDto(getInternalJAXRSClient(apiUrlStatisticalResources).retrieveMultidataset(agencyId, resourceId, lang, fields));
            } else {
                multidataset = multidataset2DtoMapper.multidatasetExternalToDto(getExternalJAXRSClient(apiUrlStatisticalResources).retrieveMultidataset(agencyId, resourceId, lang, fields));
            }

        } catch (ServerWebApplicationException e) {
            throw getExceptionDataset(e, apiUrlStatisticalResources, null, multidatasetId, null);
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo la Colección", e);
        }
        if (multidataset == null || multidataset.getData() == null || multidataset.getData().getNodes() == null) {
            Locale locale = LocaleUtils.toLocale(language);
            throw new TranslateExceptions().translateException(locale, new MetamacException(ServiceExceptionType.MULTIDATASET_NO_DATA, resourceId, agencyId));
        }
        return multidataset;
    }

    private static RestTemplate getRestTemplate() {
        return restTemplate;
    }

    public Indicator getIndicator(String apiUrlIndicators, Boolean internalPortal, String resourceId) {
        String indicatorsEndpoint = apiUrlIndicators;
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", apiKey);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<Indicator> response = getRestTemplate().exchange(indicatorsEndpoint + "/v1.0/indicators/" + resourceId, HttpMethod.GET, requestEntity, Indicator.class);

            return response.getBody();
        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el Indicador", e);
        }
        return null;
    }

    public IndicatorInstance getIndicatorInstance(String apiUrlIndicators, Boolean internalPortal, String resourceId, String indicatorsSystems) {
        String indicatorsEndpoint = apiUrlIndicators;
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", apiKey);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<IndicatorInstance> response = getRestTemplate().exchange(indicatorsEndpoint + "/v1.0/indicatorsSystems/" + indicatorsSystems + "/indicatorsInstances/" + resourceId,
                    HttpMethod.GET, requestEntity, IndicatorInstance.class);

            return response.getBody();

        } catch (Exception e) {
            LOGGGER.error("Error obteniendo el la Instancia del Indicador", e);
        }
        return null;
    }

    public Permalink getPermalink(String apiUrlPermalinks, String identifier, Boolean internalPortal) {
        Permalink permalink = new Permalink();
        try {
            permalink.setId(identifier);

            String permalinkContentString = null;

            if (internalPortal) {
                permalinkContentString = IOUtils.toString((InputStream) getPermalinksInternalJAXRSClient(apiUrlPermalinks).retrievePermalinkByIdJson(identifier).getEntity());
            } else {
                permalinkContentString = IOUtils.toString((InputStream) getPermalinksJAXRSClient(apiUrlPermalinks).retrievePermalinkByIdJson(identifier).getEntity());
            }

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

    public static String buildUrlParams(Permalink permalink, String sharedVisualizerUrl) throws UnsupportedEncodingException {
        return buildUrlParams(permalink, sharedVisualizerUrl, null, null);
    }

    public static String buildUrlParams(Permalink permalink, String sharedVisualizerUrl, String locale, String title) throws UnsupportedEncodingException {
        StringBuilder stringBuilder = new StringBuilder();

        QueryParams queryParams = permalink.getContent().getQueryParams();

        // Permalink url must be rebuild, because you must not store the visualizer url inside the permalink stored on db in case
        // the baseUrl changes tomorrow.
        buildUrlParams(stringBuilder, queryParams.getType(), queryParams.getAgency(), queryParams.getIdentifier(), queryParams.getVersion(), queryParams.getIndicatorSystem(),
                queryParams.getMultidatasetId(), sharedVisualizerUrl, locale, title, queryParams.getTheme());

        // Hash is the SPA route, for example #datasets/selection. Includes #
        stringBuilder.append(permalink.getContent().getHash());
        stringBuilder.append("/").append(Helpers.PARAMETER_PERMALINK).append("/").append(permalink.getId());

        return stringBuilder.toString();
    }

    public static String buildUrl(Multidataset multidataset, String multidatasetId, String sharedVisualizerUrl, String theme) throws UnsupportedEncodingException {
        return buildUrl(multidataset, multidatasetId, sharedVisualizerUrl, null, null, theme);
    }

    public static String buildUrl(Multidataset multidataset, String multidatasetId, String sharedVisualizerUrl, String locale, String title, String theme) throws UnsupportedEncodingException {
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
        buildUrlParams(stringBuilder, null, null, null, null, null, multidatasetId, sharedVisualizerUrl, locale, title, theme);

        return stringBuilder.toString();
    }

    private static void buildUrlParams(StringBuilder stringBuilder, String resourceType, String agency, String identifier, String version, String indicatorSystem, String multidatasetId,
            String sharedVisualizerUrl, String locale, String title, String theme) throws UnsupportedEncodingException {
        appendParameter(stringBuilder, PARAMETER_RESOURCE_TYPE, resourceType);
        appendParameter(stringBuilder, PARAMETER_AGENCY_ID, agency);
        appendParameter(stringBuilder, PARAMETER_RESOURCE_ID, identifier);
        appendParameter(stringBuilder, PARAMETER_VERSION, version);
        appendParameter(stringBuilder, PARAMETER_INDICATOR_SYSTEM, indicatorSystem);
        appendParameter(stringBuilder, PARAMETER_MULTIDATASET_ID, multidatasetId);
        appendParameter(stringBuilder, PARAMETER_SHARED_VISUALIZER_URL, sharedVisualizerUrl);
        appendParameter(stringBuilder, PARAMETER_TITLE, UriUtils.encodeQueryParam(title, StandardCharsets.UTF_8.toString()));
        appendParameter(stringBuilder, PARAMETER_THEME, theme);
        if (locale != null) {
            appendParameter(stringBuilder, PARAMETER_LOCALE, locale);
        }
    }

    private org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0 getInternalJAXRSClient(String statisticalResourcesEndpoint) {
        org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0 statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint,
                org.siemac.metamac.statistical_resources.rest.internal.v1_0.service.StatisticalResourcesV1_0.class, null, true);
        WebClient.client(statisticalResourcesV1_0).reset();
        WebClient.client(statisticalResourcesV1_0).header(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
        return statisticalResourcesV1_0;
    }

    private org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0 getExternalJAXRSClient(String statisticalResourcesEndpoint) {
        org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0 statisticalResourcesV1_0 = JAXRSClientFactory.create(statisticalResourcesEndpoint,
                org.siemac.metamac.statistical_resources.rest.external.v1_0.service.StatisticalResourcesV1_0.class, null, true);
        WebClient.client(statisticalResourcesV1_0).reset();
        WebClient.client(statisticalResourcesV1_0).header(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
        return statisticalResourcesV1_0;
    }

    private org.siemac.metamac.portal.rest.external.permalink.v1_0.service.PermalinksV1_0 getPermalinksJAXRSClient(String permalinksEndpoint) {
        org.siemac.metamac.portal.rest.external.permalink.v1_0.service.PermalinksV1_0 permalinksV1_0 = JAXRSClientFactory.create(permalinksEndpoint,
                org.siemac.metamac.portal.rest.external.permalink.v1_0.service.PermalinksV1_0.class, null, true);
        WebClient.client(permalinksV1_0).reset();
        WebClient.client(permalinksV1_0).header(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
        return permalinksV1_0;
    }

    private org.siemac.metamac.portal.rest.internal.permalink.v1_0.service.PermalinksV1_0 getPermalinksInternalJAXRSClient(String permalinksEndpoint) {
        org.siemac.metamac.portal.rest.internal.permalink.v1_0.service.PermalinksV1_0 permalinksV1_0 = JAXRSClientFactory.create(permalinksEndpoint,
                org.siemac.metamac.portal.rest.internal.permalink.v1_0.service.PermalinksV1_0.class, null, true);
        WebClient.client(permalinksV1_0).reset();
        WebClient.client(permalinksV1_0).header(CoreCommonConstants.API_KEY_PARAMETER, apiKey);
        return permalinksV1_0;
    }

    public static String html2text(String html) {
        return Jsoup.clean(html, Whitelist.none());
    }

    public static String cleanHtml(String html) {
        return Jsoup.clean(html, new Whitelist().addTags("a", "b", "em", "i", "strong", "u", "br", "div"));
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
        if (internationalString != null && internationalString.getTexts() != null && !internationalString.getTexts().isEmpty()) {
            String defaultText = internationalString.getTexts().get(0).getValue();
            for (LocalisedString text : internationalString.getTexts()) {
                if (text.getLang().equals(language)) {
                    return text.getValue();
                } else if (text.getLang().equals(defaultLanguage)) {
                    defaultText = text.getValue();
                }
            }
            return defaultText;
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

    public static String tableViewUrl(Table table, String theme) {
        Resource resource = table.getResource();
        if (resource == null) {
            return StringUtils.EMPTY;
        } else if (StringUtils.isBlank(theme) || table.getUrl() != null) {
            return resource.getVisualizerHtmlLink();
        }
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(resource.getVisualizerHtmlLink());
        appendParameter(stringBuilder, PARAMETER_THEME, theme);
        return stringBuilder.toString();
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
