package org.siemac.metamac.portal.core.invocation.external;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;

public interface IndicatorsRestExternalFacade {

    IndicatorType retrieveIndicator(final String indicatorCode);
    DataType retrieveIndicatorData(final String indicatorCode, String dimensionSelection);
}
