package org.siemac.metamac.portal.core.invocation.external;

import es.gobcan.istac.indicators.rest.types.DataType;
import es.gobcan.istac.indicators.rest.types.IndicatorInstanceType;
import es.gobcan.istac.indicators.rest.types.IndicatorsSystemType;

public interface IndicatorsSystemsRestExternalFacade {

    IndicatorInstanceType retrieveIndicatorInstanceByCode(final String idIndicatorSystem, final String idIndicatorInstance);
    DataType retrieveIndicatorInstanceDataByCode(final String idIndicatorSystem, final String idIndicatorInstance, String selectedRepresentations);
    IndicatorsSystemType retrieveIndicatorsSystem(final String idIndicatorSystem);

}
