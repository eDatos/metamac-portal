package org.siemac.metamac.portal.core.invocation.internal;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorsSystemType;

public interface IndicatorsSystemsRestInternalFacade {

    IndicatorInstanceType retrieveIndicatorInstanceByCode(final String idIndicatorSystem, final String idIndicatorInstance);
    DataType retrieveIndicatorInstanceDataByCode(final String idIndicatorSystem, final String idIndicatorInstance, String selectedRepresentations);
    IndicatorsSystemType retrieveIndicatorsSystem(final String idIndicatorSystem);

}
