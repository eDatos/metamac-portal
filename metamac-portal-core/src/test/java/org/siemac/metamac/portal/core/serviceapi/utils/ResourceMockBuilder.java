package org.siemac.metamac.portal.core.serviceapi.utils;

import org.siemac.metamac.rest.common.v1_0.domain.InternationalString;
import org.siemac.metamac.rest.common.v1_0.domain.LocalisedString;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ResourceStatisticalResourceBase;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DataStructureDefinition;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.DimensionsId;
import org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ItemResource;

public abstract class ResourceMockBuilder {

    protected DataStructureDefinition mockDataStructureDefinition() {
        DataStructureDefinition dataStructureDefinition = new DataStructureDefinition();
        dataStructureDefinition.setShowDecimals(Integer.valueOf(2));
        dataStructureDefinition.setAutoOpen(Boolean.FALSE);
        dataStructureDefinition.setShowNullValuesByDefault(Boolean.FALSE);
        dataStructureDefinition.setShowZeroValuesByDefault(Boolean.FALSE);
        dataStructureDefinition.setStub(new DimensionsId());
        dataStructureDefinition.setHeading(new DimensionsId());
        return dataStructureDefinition;
    }

    protected InternationalString internationalString(String label) {
        InternationalString internationalString = new InternationalString();
        {
            LocalisedString localisedString = new LocalisedString();
            localisedString.setLang("es");
            localisedString.setValue(label);
            internationalString.getTexts().add(localisedString);
        }
        {
            LocalisedString localisedString = new LocalisedString();
            localisedString.setLang("en");
            localisedString.setValue(label + " (en)");
            internationalString.getTexts().add(localisedString);
        }
        return internationalString;
    }

    protected ResourceStatisticalResourceBase mockResource(String id) {
        ResourceStatisticalResourceBase resource = new ResourceStatisticalResourceBase();
        resource.setId(id);
        resource.setName(internationalString("Label " + id));
        return resource;
    }

    protected ItemResource mockItemResource(String id) {
        ItemResource resource = new ItemResource();
        resource.setId(id);
        resource.setName(internationalString("Label " + id));
        return resource;
    }

}