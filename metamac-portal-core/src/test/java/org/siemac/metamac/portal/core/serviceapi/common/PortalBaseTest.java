package org.siemac.metamac.portal.core.serviceapi.common;

import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fornax.cartridges.sculptor.framework.errorhandling.ServiceContext;
import org.siemac.metamac.common.test.dbunit.MetamacDBUnitBaseTests;
import org.siemac.metamac.core.common.exception.CommonServiceExceptionType;
import org.siemac.metamac.core.common.exception.MetamacException;
import org.siemac.metamac.core.common.exception.MetamacExceptionItem;
import org.springframework.beans.factory.annotation.Value;

public abstract class PortalBaseTest extends MetamacDBUnitBaseTests {

    // Other
    protected static final String NOT_EXISTS = "not-exists";

    @Value("${metamac.portal.db.default_schema}")
    private String                defaultSchema;

    // --------------------------------------------------------------------------------------------------------------
    // DBUNIT CONFIGURATION
    // --------------------------------------------------------------------------------------------------------------

    @Override
    protected List<String> getTableNamesOrderedByFKDependency() {
        List<String> tables = new ArrayList<String>();
        tables.add("TB_PERMALINKS");
        return tables;
    }

    @Override
    protected Map<String, List<String>> getTablePrimaryKeys() {
        return new HashMap<String, List<String>>();
    }

    @Override
    protected String getDefaultSchema() {
        return defaultSchema;
    }

    protected ServiceContext getServiceContext() {
        return new ServiceContext("junit", "junit", "app");
    }

    protected MetamacExceptionItem assertListContainsExceptionItemOneParameter(MetamacException e, CommonServiceExceptionType serviceExceptionType, String parameter) {
        return assertListContainsExceptionItemOneParameter(e.getExceptionItems(), serviceExceptionType, parameter);
    }

    protected MetamacExceptionItem assertListContainsExceptionItemOneParameter(Collection<MetamacExceptionItem> exceptionItems, CommonServiceExceptionType serviceExceptionType, String parameter) {
        for (MetamacExceptionItem metamacExceptionItem : exceptionItems) {
            if (serviceExceptionType.getCode().equals(metamacExceptionItem.getCode()) && metamacExceptionItem.getMessageParameters().length == 1
                    && parameter.equals(metamacExceptionItem.getMessageParameters()[0])) {
                return metamacExceptionItem;
            }
        }
        fail("Exception item not found");
        return null;
    }
}
