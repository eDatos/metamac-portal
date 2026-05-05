<%@ tag description="Título y meta tags" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ tag import="org.apache.commons.lang.StringUtils" %>
<%@ tag import="org.siemac.metamac.portal.Helpers" %>
<%@ tag import="org.siemac.metamac.portal.dto.Collection" %>
<%@ tag import="org.siemac.metamac.portal.dto.Dataset" %>
<%@ tag import="org.siemac.metamac.portal.dto.Query" %>
<%@ tag import="org.siemac.metamac.portal.dto.Multidataset" %>
<%@ tag import="org.siemac.metamac.portal.dto.Indicator" %>
<%@ tag import="org.siemac.metamac.portal.dto.IndicatorInstance" %>
<%@ tag import="org.siemac.metamac.portal.dto.Permalink" %>
<%@ tag import="org.siemac.metamac.core.common.exception.MetamacException"%>
<%@ tag import="org.siemac.metamac.portal.core.conf.PortalConfiguration"%>
<%@ tag import="org.siemac.metamac.core.common.util.ApplicationContextProvider"%>
<%@ tag import="org.siemac.metamac.portal.web.WebUtils" %>
<%@ tag import="org.siemac.metamac.portal.core.constants.PortalConstants" %>
<%@ tag import="org.siemac.metamac.portal.core.constants.PortalConstants.ResourceType" %>

<%@ tag import="org.slf4j.Logger" %>
<%@ tag import="org.slf4j.LoggerFactory" %>

<%@ tag import="java.io.File" %>
<%@ tag import="java.util.Date" %>
<%@ tag import="java.text.SimpleDateFormat" %>
	<%
        Logger log = LoggerFactory.getLogger(getClass());
		ServletContext context = request.getSession().getServletContext();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        
		String cssPath = context.getRealPath("client/metamac.css");
		File cssFile = new File(cssPath);
        Date lastModifiedCss = new Date(cssFile.lastModified());
        request.setAttribute("cssDate", dateFormat.format(lastModifiedCss));
		
		String jsPath = context.getRealPath("client/metamac.js");
		File jsFile = new File(jsPath);
		Date lastModifiedJs = new Date(jsFile.lastModified());		
		request.setAttribute("jsDate", dateFormat.format(lastModifiedJs));
	%>	
	<%
	    String INSTALLATION_TYPE = "";
		String PORTAL_URL_BASE = "";
        String STATISTICAL_VISUALIZER_URL_BASE = "";
        String PERMALINKS_API_URL_BASE = "";
        String EXPORT_API_URL_BASE = "";
		String STATISTICAL_RESOURCES_API_URL_BASE = "";
		String SRM_API_URL_BASE = "";
        String INDICATORS_API_URL_BASE = "";
        String EXTERNAL_USERS_API_URL_BASE = "";
        String EXTERNAL_USERS_WEB_APPLICATION_BASE = "";
        String EXTERNAL_CAPTCHA_URL_BASE = "";
		Boolean internalPortal = null;
		String ORGANISATION = "";
        String INTERNATIONALIZATION_COOKIE_ID = "";
        String DEFAULT_INTERNATIONALIZATION_LANGUAGE = "";
        String API_KEY = "";
        Boolean ADD_ANCESTORS_FOR_GEO_PARAM = Boolean.TRUE;

		PortalConfiguration configurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
		try {
		    INSTALLATION_TYPE = configurationService.retrieveInstallationType();
		    internalPortal = INSTALLATION_TYPE.equals("INTERNAL");
			request.setAttribute("installationType", INSTALLATION_TYPE);
			
			ORGANISATION = configurationService.retrieveOrganisation();			
			request.setAttribute("Organisation", ORGANISATION);
            
			request.setAttribute("analyticsGoogleTrackingId", configurationService.retrieveAnalyticsGoogleTrackingId());

		    STATISTICAL_VISUALIZER_URL_BASE = configurationService.retrievePortalExternalUrlBase();
            INTERNATIONALIZATION_COOKIE_ID = configurationService.retrieveInternationalizationCookieId();
            DEFAULT_INTERNATIONALIZATION_LANGUAGE = configurationService.retrieveDefaultInternationalizationLanguage();
            API_KEY = configurationService.retrievePortalApiKeyByInstallationType();
            try {
                // We group this try catch because all of them are served from external-users
                EXTERNAL_USERS_API_URL_BASE = configurationService.retrieveExternalUsersExternalApiUrlBase();
                EXTERNAL_USERS_WEB_APPLICATION_BASE = configurationService.retrieveExternalUsersExternalWebApplicationUrlBase();
                EXTERNAL_CAPTCHA_URL_BASE = configurationService.retrieveCaptchaExternalApiUrlBase();
            } catch(MetamacException e) {
                EXTERNAL_USERS_API_URL_BASE = "error";
                EXTERNAL_USERS_WEB_APPLICATION_BASE = "error";
                EXTERNAL_CAPTCHA_URL_BASE = "error";
            }
            if (INSTALLATION_TYPE.equals("INTERNAL")) {
                PORTAL_URL_BASE = configurationService.retrievePortalInternalWebApplicationUrlBase();
		        STATISTICAL_RESOURCES_API_URL_BASE = configurationService.retrieveStatisticalResourcesInternalApiUrlBase();
		        SRM_API_URL_BASE = configurationService.retrieveSrmInternalApiUrlBase();
		        INDICATORS_API_URL_BASE = configurationService.retrieveIndicatorsInternalApiUrlBase();
                PERMALINKS_API_URL_BASE = configurationService.retrievePortalInternalApisPermalinksUrlBase();
                EXPORT_API_URL_BASE = configurationService.retrievePortalInternalApisExportUrlBase();
		    } else if (INSTALLATION_TYPE.equals("EXTERNAL")) {
                PORTAL_URL_BASE = configurationService.retrievePortalExternalWebApplicationUrlBase();
		        STATISTICAL_RESOURCES_API_URL_BASE = configurationService.retrieveStatisticalResourcesExternalApiUrlBase();
		        SRM_API_URL_BASE = configurationService.retrieveSrmExternalApiUrlBase();
		        INDICATORS_API_URL_BASE = configurationService.retrieveIndicatorsExternalApiUrlBase();
                PERMALINKS_API_URL_BASE = configurationService.retrievePortalExternalApisPermalinksUrlBase();
                EXPORT_API_URL_BASE = configurationService.retrievePortalExternalApisExportUrlBase();
			}

            try {
                ADD_ANCESTORS_FOR_GEO_PARAM = configurationService.retrieveAddAncestorsForGeoParam();
            } catch(MetamacException e) {
                log.warn("Error retrieving property to select (or not) ancestors when using the geo param");
            }

            request.setAttribute("installationType", INSTALLATION_TYPE);
			request.setAttribute("ApiUrlStatisticalVisualizer", STATISTICAL_VISUALIZER_URL_BASE);
            request.setAttribute("StatisticalVisualizerBase", PORTAL_URL_BASE);
            request.setAttribute("ApiUrlPermalinks", PERMALINKS_API_URL_BASE);
            request.setAttribute("ApiUrlExport", EXPORT_API_URL_BASE);		
			request.setAttribute("ApiUrlStatisticalResources", STATISTICAL_RESOURCES_API_URL_BASE);	
			request.setAttribute("ApiUrlStructuralResources", SRM_API_URL_BASE);
			request.setAttribute("ApiUrlIndicators", INDICATORS_API_URL_BASE);
            request.setAttribute("ApiUrlExternalUsers", EXTERNAL_USERS_API_URL_BASE);
            request.setAttribute("WebApplicationExternalUsers", EXTERNAL_USERS_WEB_APPLICATION_BASE);
            request.setAttribute("ApiUrlCaptcha", EXTERNAL_CAPTCHA_URL_BASE);
            request.setAttribute("organisationUrn", configurationService.retrieveOrganisationUrn());
            request.setAttribute("geographicalGranularityUrn", configurationService.retrieveDefaultCodelistGeographicalGranularityUrn());
            request.setAttribute("internationalizationCookie", INTERNATIONALIZATION_COOKIE_ID);
            request.setAttribute("defaultInternationalizationLanguage", DEFAULT_INTERNATIONALIZATION_LANGUAGE);
            request.setAttribute("apiKey", API_KEY);
            request.setAttribute("addAncestorsForGeoParam", ADD_ANCESTORS_FOR_GEO_PARAM);
            request.setAttribute("statisticalVisualizerUrl", WebUtils.getPortalWebVisualizerUrl());
		} catch (MetamacException e) {
            request.setAttribute("installationType", "error");
		 	request.setAttribute("ApiUrlStatisticalVisualizer","error");
		 	request.setAttribute("StatisticalVisualizerBase", "error");
		 	request.setAttribute("ApiUrlPermalinks", "error");
            request.setAttribute("ApiUrlExport", "error");      
		 	request.setAttribute("ApiUrlStatisticalResources", "error");
		 	request.setAttribute("ApiUrlStructuralResources", "error");
		 	request.setAttribute("ApiUrlIndicators", "error");
            request.setAttribute("ApiUrlExternalUsers", "error");
            request.setAttribute("WebApplicationExternalUsers", "error");
            request.setAttribute("ApiUrlCaptcha", "error");
		 	request.setAttribute("organisationUrn", "error");
		 	request.setAttribute("geographicalGranularityUrn", "error");
            request.setAttribute("internationalizationCookie", "error");
            request.setAttribute("defaultInternationalizationLanguage", "error");
            request.setAttribute("apiKey", "error");
            request.setAttribute("addAncestorsForGeoParam", "error");
            request.setAttribute("statisticalVisualizerUrl", "error");
		 	request.setAttribute("analyticsGoogleTrackingId", "error");
            
		 	log.error("Error durante la inicialización de propiedades", e);
		}
	%>
    <%    
		String sharedVisualizerUrl = request.getParameter(Helpers.PARAMETER_SHARED_VISUALIZER_URL);
        String organizationService = "";
        String servletPath = request.getServletPath();
        if (servletPath != null) {
            organizationService = servletPath.split("/")[2];
        }
        String theme = WebUtils.getThemeFromOrganisationService(organizationService);
        if (StringUtils.isBlank(theme)) {
            theme = request.getParameter(Helpers.PARAMETER_THEME); /* Must be something like organisation/service */
        }
        request.setAttribute("theme", theme);
    %>
    <%
        Cookie[] cookies = request.getCookies();
        String defaultLocale = DEFAULT_INTERNATIONALIZATION_LANGUAGE;
        String locale = defaultLocale;
        if (cookies != null && !"error".equals(INTERNATIONALIZATION_COOKIE_ID)) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(INTERNATIONALIZATION_COOKIE_ID)) {
                    locale = cookie.getValue();
                }
            }
        }
        request.setAttribute("currentLocale", locale);
        Helpers.initialize(locale, defaultLocale, API_KEY);
    %>
    <%
        String permalinkId = request.getParameter("permalink");
        if (permalinkId != null && !permalinkId.isEmpty()) {
            Permalink permalink = Helpers.getPermalink(PERMALINKS_API_URL_BASE, permalinkId, internalPortal);
            response.sendRedirect(WebUtils.getPortalWebVisualizerUrl() + "/data.html" + Helpers.buildUrlParams(permalink, sharedVisualizerUrl));
        }        
    %>
    <%
        String resourceTypeValue = request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE);
        ResourceType resourceType =  resourceTypeValue != null ? ResourceType.fromValue(resourceTypeValue) : null;
        String multidatasetId = request.getParameter(Helpers.PARAMETER_MULTIDATASET_ID);
        try {
           if (multidatasetId != null && !multidatasetId.isEmpty() && resourceType == null) {
               Multidataset multidataset = Helpers.getMultidataset(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, multidatasetId);
               response.sendRedirect(Helpers.buildUrl(multidataset, multidatasetId, sharedVisualizerUrl, theme));
           }
        } catch(Exception e) {
            log.error(e.getMessage());
            request.setAttribute("internalError", e.getMessage());
        }
    %>
	<%
        String agencyId = request.getParameter(Helpers.PARAMETER_AGENCY_ID);
        String resourceId = request.getParameter(Helpers.PARAMETER_RESOURCE_ID);
        String version = request.getParameter(Helpers.PARAMETER_VERSION);
        String indicatorSystem = request.getParameter(Helpers.PARAMETER_INDICATOR_SYSTEM);

	    request.setAttribute("resourceEmpty", true);
	    request.setAttribute("resourceName", "");
	    String resourceDescription = "";                     
	    
        try {
            if (multidatasetId != null) {
                Multidataset multidataset = Helpers.getMultidataset(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, multidatasetId);
                if (multidataset != null && !multidatasetId.isEmpty()) {
                    request.setAttribute("resourceEmpty", false);
                    request.setAttribute("resourceName", Helpers.localizeText(multidataset.getName()));
                    request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(multidataset.getDescription())));
                    request.setAttribute("resourceDescription", Helpers.localizeText(multidataset.getDescription()));
                    request.setAttribute("keywords", Helpers.localizeText(multidataset.getKeywords()));
                }
            } else {
                if (resourceType != null) {
                    switch (resourceType) {
                        case COLLECTION:
                            Collection collection = Helpers.getCollection(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId);
                            if (collection != null) {
                                request.setAttribute("resourceEmpty", false);
                                request.setAttribute("resourceName", Helpers.localizeText(collection.getName()));
                                request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(collection.getDescription())));
                                request.setAttribute("resourceDescription", Helpers.localizeText(collection.getDescription()));
                                request.setAttribute("keywords", Helpers.localizeText(collection.getKeywords()));

                                request.setAttribute("collection", collection);
                                request.setAttribute("numberOfFixedDigitsInNumeration", Helpers.numberOfFixedDigitsInNumeration(collection));
                                request.setAttribute("nodes", collection.getData().getNodes().getNodes());
                            }
                            break;
                        case DATASET:
                            Dataset dataset = Helpers.getDataset(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId, version);
                            
                            if (dataset != null) {
                                request.setAttribute("resourceEmpty", false);
                                request.setAttribute("resourceName", Helpers.localizeText(dataset.getName()));
                                request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(dataset.getDescription())));
                                request.setAttribute("resourceDescription", Helpers.localizeText(dataset.getDescription()));
                                request.setAttribute("keywords", Helpers.localizeText(dataset.getKeywords()));
                            }
                            break;
                        case QUERY:
                            Query query = Helpers.getQuery(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId);
                            
                            if (query != null) {
                                request.setAttribute("resourceEmpty", false);
                                request.setAttribute("resourceName", Helpers.localizeText(query.getName()));
                                request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(query.getDescription())));
                                request.setAttribute("resourceDescription", Helpers.localizeText(query.getDescription()));
                                request.setAttribute("keywords", Helpers.localizeText(query.getKeywords()));
                            }
                            break;
                        case INDICATOR:
                            Indicator indicator = Helpers.getIndicator(INDICATORS_API_URL_BASE, internalPortal, resourceId);
                            if (indicator != null) {
                                request.setAttribute("resourceEmpty", false);
                                request.setAttribute("resourceName", Helpers.localizeText(indicator.getTitle()));
                                request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(indicator.getConceptDescription())));
                                request.setAttribute("resourceDescription", Helpers.localizeText(indicator.getConceptDescription()));
                                request.setAttribute("keywords", "");
                            }
                            break;
                        case INDICATOR_INSTANCE:
                            IndicatorInstance indicatorInstance = Helpers.getIndicatorInstance(INDICATORS_API_URL_BASE, internalPortal, resourceId, indicatorSystem);            
                            if (indicatorInstance != null) {
                                request.setAttribute("resourceEmpty", false);
                                request.setAttribute("resourceName", Helpers.localizeText(indicatorInstance.getTitle()));
                                request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(Helpers.localizeText(indicatorInstance.getConceptDescription())));
                                request.setAttribute("resourceDescription", Helpers.localizeText(indicatorInstance.getConceptDescription()));
                                request.setAttribute("keywords", "");
                            } 
                            break;
                       default:
                           request.setAttribute("resourceName", "Visualizador estadístico");
                           request.setAttribute("resourceDescription", "Visualizador estadístico");
                           request.setAttribute("resourceDescriptionOnlyText", "Visualizador estadístico");
                           request.setAttribute("keywords", "");
                           break;
                    }
                }
            }
        } catch(Exception e) {
            log.error(e.getMessage());
            request.setAttribute("internalError", e.getMessage());
        }
	%>
	<%
       request.setAttribute("portalStyleHeaderUrl", WebUtils.getPortalStyleHeaderUrl(organizationService, locale, theme));
       request.setAttribute("portalStyleCssUrl", WebUtils.getPortalStyleCssUrl(organizationService, theme));
       request.setAttribute("portalStyleFooterUrl", WebUtils.getPortalStyleFooterUrl(organizationService, theme));
       request.setAttribute("showRightsHolder", WebUtils.getShowRightsHolder(organizationService, theme));
       request.setAttribute("socialTwitterVia", WebUtils.getSocialTwitterVia());
       request.setAttribute("enableGraphColors", WebUtils.getPortalGraphColorsEnabled());
       request.setAttribute("helpUrl", WebUtils.getHelpUrl());
       request.setAttribute("cellThreshold", WebUtils.getCellThreshold());
       request.setAttribute("unitMeasure", WebUtils.getUnitMeasure());
       request.setAttribute("unitMeasureMultiplier", WebUtils.getUnitMeasureMultiplier());
       request.setAttribute("pageTitle", WebUtils.buildPageTitle(ORGANISATION, (String) request.getAttribute("resourceName"), locale));
       
       String faviconUrl = "";
       String portalStyleHeaderUrl = (String) request.getAttribute("portalStyleHeaderUrl");       
       if (portalStyleHeaderUrl != null) {
           faviconUrl = portalStyleHeaderUrl.split("/header.html")[0] + "/../../" + "common/favicon.ico";
       }
       request.setAttribute("faviconUrl", faviconUrl);

	%>	
   	<title>${pageTitle}</title>
   	
   	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
   	    
    <meta name="description" content="${resourceDescriptionOnlyText}" />

    <meta property="og:title" content="${pageTitle}"/>
    <meta property="og:description" content="${resourceDescriptionOnlyText}"/>
       
    <meta itemprop="name" content="${pageTitle}" />
	<meta itemprop="description" content="${resourceDescriptionOnlyText}" />
	
  	<meta name="keywords" content="${keywords}" />
  	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  	<meta name="robots" content="index, follow" />
  	<meta name="revisit-after" content="7 days" />
  	<link rel="icon" type="image/x-icon" href="${faviconUrl}" />

    
    <!-- Default styles with low precedece that can be easily overwritten by custom headers -->
    <style>                
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
        }
        
        .visualizer-wrapper,
        .contenido .loader {
            padding: 8px;
        }
    </style>
    <script>
        var theme ='${theme}';
        if (theme) {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.classList.add("thematic");
            });
        }
    </script>
