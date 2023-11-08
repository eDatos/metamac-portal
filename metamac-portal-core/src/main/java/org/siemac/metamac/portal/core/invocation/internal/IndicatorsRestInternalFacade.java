package org.siemac.metamac.portal.core.invocation.internal;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorType;

public interface IndicatorsRestInternalFacade {

    IndicatorType retrieveIndicator(final String indicatorCode);
    DataType retrieveIndicatorData(final String indicatorCode, String dimensionSelection);
}
