package org.siemac.metamac.portal.core.serviceapi.utils;

import java.io.InputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Dataset;
import org.siemac.metamac.rest.statistical_resources.v1_0.domain.Query;

public class XMLUtils {

    private static final Unmarshaller unmarshaller = initializeUnmarshaller();

    private static Unmarshaller initializeUnmarshaller() {
        // No validation is performed against scheme because we use a mixed approach to optimize the unpacking. (DOM + StAX)
        JAXBContext jc;
        Unmarshaller u;
        try {
            jc = JAXBContext.newInstance(org.siemac.metamac.rest.statistical_resources.v1_0.domain.ObjectFactory.class,
                    org.siemac.metamac.statistical_resources.rest.common.v1_0.domain.ObjectFactory.class, org.siemac.metamac.rest.common.v1_0.domain.ObjectFactory.class);
            u = jc.createUnmarshaller();

        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }

        return u;
    }

    public static Dataset getDataset(InputStream is) throws JAXBException {
        return (Dataset) unmarshaller.unmarshal(is);
    }

    public static Query getQuery(InputStream is) throws JAXBException {
        return (Query) unmarshaller.unmarshal(is);
    }

}
