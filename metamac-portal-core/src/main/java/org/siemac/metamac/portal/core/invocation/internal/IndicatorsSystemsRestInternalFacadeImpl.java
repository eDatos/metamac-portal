package org.siemac.metamac.portal.core.invocation.internal;

import org.siemac.metamac.portal.core.invocation.AbstractIndicatorsSystemsRestFacade;
import org.siemac.metamac.portal.core.invocation.MetamacApisLocator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component("indicatorsSystemRestInternalFacade")
public class IndicatorsSystemsRestInternalFacadeImpl extends AbstractIndicatorsSystemsRestFacade implements IndicatorsSystemsRestInternalFacade {

    @Autowired
    @Qualifier("metamacApisLocatorRest")
    private MetamacApisLocator restApiLocator;

    @Override
    protected String getRestApiLocatorEndpoint() {
        return restApiLocator.getIndicatorsRestInternalFacadeEndpoint();
    }

}
