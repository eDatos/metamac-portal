package org.siemac.metamac.portal.web.diffusion.urlrewrite;

import javax.servlet.ServletException;

import org.siemac.metamac.core.common.conf.ConfigurationService;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.util.ApplicationContextProvider;
import org.siemac.metamac.core.common.util.urlrewrite.AbstractRewriteMatch;
import org.siemac.metamac.portal.core.conf.PortalConfiguration;
import org.siemac.metamac.portal.rest.common.RestCommonConstants;

class PortalRewriteMatch extends AbstractRewriteMatch {

    private static final String  EXPORT_API_PREFIX     = "export";
    private static final String  PERMALINKS_API_PREFIX = "permalinks";

    private ConfigurationService configurationService  = null;

    private PortalConfiguration portalConfigurationService = null;

    @Override
    protected String[] getAcceptedApiPrefixes() {
        return new String[]{EXPORT_API_PREFIX, PERMALINKS_API_PREFIX};
    }

    @Override
    protected String getLatestApiVersion() {
        return RestCommonConstants.API_VERSION_1_0;
    }

    @Override
    protected String getApiBaseUrl() throws ServletException {
        try {
            String INSTALLATION_TYPE = getPortalConfigurationService().retrieveInstallationType();
            if (INSTALLATION_TYPE.equals("EXTERNAL")) {
                return PERMALINKS_API_PREFIX.equals(getCurrentApiPrefix())
                        ? getConfigurationService().retrievePortalExternalApisPermalinksUrlBase()
                        : getConfigurationService().retrievePortalExternalApisExportUrlBase();
            } else if (INSTALLATION_TYPE.equals("INTERNAL")) {
                return PERMALINKS_API_PREFIX.equals(getCurrentApiPrefix())
                        ? getPortalConfigurationService().retrievePortalInternalApisPermalinksUrlBase()
                        : getPortalConfigurationService().retrievePortalInternalApisExportUrlBase();
            }
            return null;
        } catch (MetamacException e) {
            throw new ServletException("Error retrieving configuration property of the external API URL base", e);
        }
    }

    private ConfigurationService getConfigurationService() {
        if (configurationService == null) {
            configurationService = ApplicationContextProvider.getApplicationContext().getBean(ConfigurationService.class);
        }
        return configurationService;
    }

    private PortalConfiguration getPortalConfigurationService() {
        if (portalConfigurationService == null) {
            portalConfigurationService = ApplicationContextProvider.getApplicationContext().getBean(PortalConfiguration.class);
        }
        return portalConfigurationService;
    }

    @Override
    protected String getApiVersionsListResource() {
        switch (getCurrentApiPrefix()) {
            case EXPORT_API_PREFIX:
                return "/jsp/export/index.jsp";
            case PERMALINKS_API_PREFIX:
                return "/jsp/permalinks/index.jsp";
            default:
                return "/index.html";
        }
    }
}
