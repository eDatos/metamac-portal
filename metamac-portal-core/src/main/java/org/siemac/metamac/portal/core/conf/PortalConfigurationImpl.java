package org.siemac.metamac.portal.core.conf;

import org.siemac.metamac.core.common.conf.ConfigurationServiceImpl;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.portal.core.constants.PortalConfigurationConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PortalConfigurationImpl extends ConfigurationServiceImpl implements PortalConfiguration {

    private static final String ENVIROMENT_CONF_INSTALLATION_TYPE = "environment.metamac.portal.installation_type";

    private static Logger       log                               = LoggerFactory.getLogger(PortalConfigurationImpl.class);

    @Override
    public String retrieveInstallationType() throws MetamacException {
        return (String) environmentConfigurationProperties.getProperty(ENVIROMENT_CONF_INSTALLATION_TYPE);
    }

    @Override
    public String retrievePortalAgricultureStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_AGRICULTURE_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalAgricultureStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_AGRICULTURE_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalAgricultureStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_AGRICULTURE_STYLE_FOOTER_URL);
    }

    @Override
    public String retrievePortalEnvironmentStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_ENVIRONMENT_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalEnvironmentStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_ENVIRONMENT_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalEnvironmentStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_ENVIRONMENT_STYLE_FOOTER_URL);
    }

    @Override
    public String retrievePortalTourismStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_TOURISM_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalTourismStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_TOURISM_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalTourismStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_TOURISM_STYLE_FOOTER_URL);
    }

    @Override
    public String retrievePortalPublicServiceStyleHeaderUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_PUBLIC_SERVICE_STYLE_HEADER_URL);
    }

    @Override
    public String retrievePortalPublicServiceStyleCssUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_PUBLIC_SERVICE_STYLE_CSS_URL);
    }

    @Override
    public String retrievePortalPublicServiceStyleFooterUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_PUBLIC_SERVICE_STYLE_FOOTER_URL);
    }

    @Override
    public String retrievePortalCustomStyleBaseUrl() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_CUSTOM_STYLE_BASE_URL);
    }

    @Override
    public Integer retrieveExportExcelCellThreshold() throws MetamacException {
        return Integer.valueOf(retrieveProperty(PortalConfigurationConstants.PORTAL_EXPORT_EXCEL_CELL_THRESHOLD));
    }

    @Override
    public String retrieveOptionalUnitMeasure() {
        String unitMeasure = null;
        try {
            unitMeasure = retrieveUnitMeasure();
        } catch (MetamacException e) {
            log.debug("Optional property Unit measure is empty", e);
        }
        return unitMeasure;
    }

    @Override
    public String retrieveOptionalUnitMeasureMultiplier() {
        String unitMeasureMultiplier = null;
        try {
            unitMeasureMultiplier = retrieveUnitMeasureMultiplier();
        } catch (MetamacException e) {
            log.debug("Optional property Unit measure multiplier is empty", e);
        }
        return unitMeasureMultiplier;
    }

    @Override
    public String retrievePortalInternalApisPermalinksUrlBase() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_INTERNAL_PERMALINK);
    }

    @Override
    public String retrievePortalInternalApisExportUrlBase() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_INTERNAL_EXPORT);
    }

    @Override
    public String retrievePortalInternalApiKey() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_INTERNAL_REST_API_KEY);
    }

    @Override
    public String retrievePortalWidgetApiKey() throws MetamacException {
        return retrieveProperty(PortalConfigurationConstants.PORTAL_CAPTCHA_API_KEY);
    }

    @Override
    public String retrievePortalApiKeyByInstallationType() throws MetamacException {
        return "INTERNAL".equals(retrieveInstallationType()) ? retrievePortalInternalApiKey() : retrievePortalApiKey();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        super.afterPropertiesSet();

        if (environmentConfigurationProperties.getProperty(ENVIROMENT_CONF_INSTALLATION_TYPE) == null) {
            throw new IllegalArgumentException("ERROR: Portal installation type must be specified. Possible values are : \"INTERNAL\" or \"EXTERNAL\" ");
        }
    }

}
