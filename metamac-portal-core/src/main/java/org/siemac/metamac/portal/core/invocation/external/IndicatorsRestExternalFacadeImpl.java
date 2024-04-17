package org.siemac.metamac.portal.core.invocation.external;

import org.siemac.metamac.portal.core.invocation.AbstractIndicatorsRestFacade;
import org.siemac.metamac.portal.core.invocation.MetamacApisLocator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component("indicatorsRestExternalFacade")
public class IndicatorsRestExternalFacadeImpl extends AbstractIndicatorsRestFacade implements IndicatorsRestExternalFacade {

    @Autowired
    @Qualifier("metamacApisLocatorRest")
    private MetamacApisLocator restApiLocator;

    @Override
    protected String getRestApiLocatorEndpoint() {
        return restApiLocator.getIndicatorsRestExternalFacadeEndpoint();
    }

}
