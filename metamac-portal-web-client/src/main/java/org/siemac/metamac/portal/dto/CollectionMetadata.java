package org.siemac.metamac.portal.dto;

import java.util.Date;

import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourceStatisticalResourceBase;

public class CollectionMetadata {

    protected Date                            lastUpdate;
    protected ResourceStatisticalResourceBase statisticalOperation;

    public Date getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Date value) {
        this.lastUpdate = value;
    }

    public ResourceStatisticalResourceBase getStatisticalOperation() {
        return statisticalOperation;
    }

    public void setStatisticalOperation(ResourceStatisticalResourceBase statisticalOperation) {
        this.statisticalOperation = statisticalOperation;
    }

}
