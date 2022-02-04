<%@ tag description="Título y meta tags" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
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
	
		Helpers helper = new Helpers(request.getLocale().getLanguage());
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

		PortalConfiguration configurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
		try {
			   
		    INSTALLATION_TYPE = configurationService.retrieveInstallationType();
		    internalPortal = INSTALLATION_TYPE.equals("INTERNAL");
			request.setAttribute("installationType", INSTALLATION_TYPE);
			
			ORGANISATION = configurationService.retrieveOrganisation();			
			request.setAttribute("Organisation", ORGANISATION);
            
			request.setAttribute("analyticsGoogleTrackingId", configurationService.retrieveAnalyticsGoogleTrackingId());
			
            String analyticsAddthisCode = configurationService.retrieveAnalyticsAddthisCode();
            if (analyticsAddthisCode != null && !analyticsAddthisCode.isEmpty()) {                    
                request.setAttribute("AddthisCode","#pubid=" + analyticsAddthisCode);
            }
			request.setAttribute("titlePrefix",ORGANISATION + " | ");
		    
		    PORTAL_URL_BASE = configurationService.retrievePortalExternalWebApplicationUrlBase();
		    STATISTICAL_VISUALIZER_URL_BASE = configurationService.retrievePortalExternalUrlBase();
		    PERMALINKS_API_URL_BASE = configurationService.retrievePortalExternalApisPermalinksUrlBase();
            EXPORT_API_URL_BASE = configurationService.retrievePortalExternalApisExportUrlBase();
            try {
                INTERNATIONALIZATION_COOKIE_ID = configurationService.retrieveInternationalizationCookieId();
            } catch (MetamacException ignored) {
                INTERNATIONALIZATION_COOKIE_ID = "error";
            }
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
		        STATISTICAL_RESOURCES_API_URL_BASE = configurationService.retrieveStatisticalResourcesInternalApiUrlBase();
		        SRM_API_URL_BASE = configurationService.retrieveSrmInternalApiUrlBase();
		        INDICATORS_API_URL_BASE = configurationService.retrieveIndicatorsInternalApiUrlBase();
		    } else if (INSTALLATION_TYPE.equals("EXTERNAL")) {	        
		        STATISTICAL_RESOURCES_API_URL_BASE = configurationService.retrieveStatisticalResourcesExternalApiUrlBase();
		        SRM_API_URL_BASE = configurationService.retrieveSrmExternalApiUrlBase();
		        INDICATORS_API_URL_BASE = configurationService.retrieveIndicatorsExternalApiUrlBase();
			}
			
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

		} catch (MetamacException e) {
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

		 	request.setAttribute("analyticsGoogleTrackingId", "error");
            
		 	log.error("Error durante la inicialización de propiedades", e);
		}
	%>
    <%    
		String sharedVisualizerUrl = request.getParameter(Helpers.PARAMETER_SHARED_VISUALIZER_URL);
    %>
    <%
        String permalinkId = request.getParameter("permalink");
        if (permalinkId != null && !permalinkId.isEmpty()) {
            Permalink permalink = Helpers.getPermalink(PERMALINKS_API_URL_BASE, permalinkId);
            response.sendRedirect(Helpers.buildUrl(permalink, sharedVisualizerUrl));   
        }        
    %>
    <%
        String resourceTypeValue = request.getParameter(Helpers.PARAMETER_RESOURCE_TYPE);
        ResourceType resourceType =  resourceTypeValue != null ? ResourceType.fromValue(resourceTypeValue) : null;
        String multidatasetId = request.getParameter(Helpers.PARAMETER_MULTIDATASET_ID);
        if (multidatasetId != null && !multidatasetId.isEmpty() && resourceType == null) {
            Multidataset multidataset = Helpers.getMultidataset(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, multidatasetId);
            response.sendRedirect(Helpers.buildUrl(multidataset, multidatasetId, sharedVisualizerUrl));   
        }        
    %>
	<%               
        String agencyId = request.getParameter(Helpers.PARAMETER_AGENCY_ID);
        String resourceId = request.getParameter(Helpers.PARAMETER_RESOURCE_ID);
        String version = request.getParameter(Helpers.PARAMETER_VERSION);
        String indicatorSystem = request.getParameter(Helpers.PARAMETER_INDICATOR_SYSTEM);

	    request.setAttribute("resourceEmpty", true);
	    String resourceName = "";
	    String resourceDescription = "";                     
	    
        if (multidatasetId != null) {
            Multidataset multidataset = Helpers.getMultidataset(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, multidatasetId);
            if (multidataset != null && !multidatasetId.isEmpty()) {
                request.setAttribute("resourceEmpty", false);
                request.setAttribute("resourceName", helper.localizeText(multidataset.getName()));
                request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(helper.localizeText(multidataset.getDescription())));
                request.setAttribute("resourceDescription", helper.localizeText(multidataset.getDescription()));                
            }
        } else {
            if (resourceType != null) {
                switch (resourceType) {
                    case COLLECTION:
                        Collection collection = Helpers.getCollection(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId);            
                        if (collection != null) {           
                            request.setAttribute("resourceEmpty", false);
                            request.setAttribute("resourceName", helper.localizeText(collection.getName()));
                            request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(helper.localizeText(collection.getDescription())));
                            request.setAttribute("resourceDescription", helper.localizeText(collection.getDescription()));
                            
                            request.setAttribute("collection", collection);
                            request.setAttribute("numberOfFixedDigitsInNumeration", Helpers.numberOfFixedDigitsInNumeration(collection));
                            request.setAttribute("nodes", collection.getData().getNodes().getNodes());
                        }
                        break;
                    case DATASET:
                        Dataset dataset = Helpers.getDataset(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId, version);
                        
                        if (dataset != null) {
                            request.setAttribute("resourceEmpty", false);
                            request.setAttribute("resourceName", helper.localizeText(dataset.getName()));
                            request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(helper.localizeText(dataset.getDescription())));
                            request.setAttribute("resourceDescription", helper.localizeText(dataset.getDescription()));
                        }
                        break;
                    case QUERY:
                        Query query = Helpers.getQuery(STATISTICAL_RESOURCES_API_URL_BASE, internalPortal, agencyId, resourceId);
                        
                        if (query != null) {
                            request.setAttribute("resourceEmpty", false);
                            request.setAttribute("resourceName", helper.localizeText(query.getName()));
                            request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(helper.localizeText(query.getDescription())));
                            request.setAttribute("resourceDescription", helper.localizeText(query.getDescription()));  
                        }
                        break;
                    case INDICATOR:
                        Indicator indicator = Helpers.getIndicator(INDICATORS_API_URL_BASE, internalPortal, resourceId);            
                        if (indicator != null) {
                            request.setAttribute("resourceEmpty", false);
                            request.setAttribute("resourceName", helper.localizeText(indicator.getTitle()));
                            request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(helper.localizeText(indicator.getConceptDescription())));
                            request.setAttribute("resourceDescription", helper.localizeText(indicator.getConceptDescription()));  
                        }
                        break;
                    case INDICATOR_INSTANCE:
                        IndicatorInstance indicatorInstance = Helpers.getIndicatorInstance(INDICATORS_API_URL_BASE, internalPortal, resourceId, indicatorSystem);            
                        if (indicatorInstance != null) {
                            request.setAttribute("resourceEmpty", false);
                            request.setAttribute("resourceName", helper.localizeText(indicatorInstance.getTitle()));
                            request.setAttribute("resourceDescriptionOnlyText", Helpers.html2text(helper.localizeText(indicatorInstance.getConceptDescription())));
                            request.setAttribute("resourceDescription", helper.localizeText(indicatorInstance.getConceptDescription()));  
                        } 
                        break;
                   default:
                       request.setAttribute("resourceName", "Visualizador estadístico");
                       request.setAttribute("resourceDescription", "Visualizador estadístico");
                       request.setAttribute("resourceDescriptionOnlyText", "Visualizador estadístico");
                       break;
                }
            }
        }
	%>
	<%
	
       String organizationService = "";
       String servletPath = request.getServletPath();       
	   if (servletPath != null) {
	       organizationService = servletPath.split("/")[2];
	   }
       request.setAttribute("portalStyleHeaderUrl", WebUtils.getPortalStyleHeaderUrl(organizationService));
       request.setAttribute("portalStyleCssUrl", WebUtils.getPortalStyleCssUrl(organizationService));
       request.setAttribute("portalStyleFooterUrl", WebUtils.getPortalStyleFooterUrl(organizationService));
       request.setAttribute("showRightsHolder", WebUtils.getShowRightsHolder(organizationService));

	%>	
   	<title>${titlePrefix}${resourceName}</title>
   	
   	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
   	    
    <meta name="description" content="${resourceDescriptionOnlyText}" />

    <meta property="og:title" content="${titlePrefix}${resourceName}"/>
    <meta property="og:description" content="${resourceDescriptionOnlyText}"/>
       
    <meta itemprop="name" content="${titlePrefix}${resourceName}" />
	<meta itemprop="description" content="${resourceDescriptionOnlyText}" />
	
  	<meta name="keywords" content="" />
  	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  	<meta name="robots" content="index, follow" />
  	<meta name="revisit-after" content="7 days" />

  	<style>
  	    .chromeFrameInstallDefaultStyle {
            width: 100% !important;
            height: 460px !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
        }
    </style>