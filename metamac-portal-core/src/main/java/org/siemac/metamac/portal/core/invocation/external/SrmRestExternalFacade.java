package org.siemac.metamac.portal.core.invocation.external;

import org.siemac.metamac.rest.structural_resources.v1_0.domain.Agency;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Codelist;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Concept;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.Concepts;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.DataStructure;
import org.siemac.metamac.rest.structural_resources.v1_0.domain.VariableElementsGeoInfo;

public interface SrmRestExternalFacade {

    public DataStructure retrieveDataStructureByUrn(String urn);

    public Codelist retrieveCodelistByUrn(String urn);

    public Concepts retrieveConceptsByConceptSchemeByUrn(String urn);
    public Concept retrieveConceptByUrn(String urn);

    public VariableElementsGeoInfo findVariableElementsGeoInfo(String urn);

    public Agency retrieveOrganization();
}
