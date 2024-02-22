package org.siemac.metamac.portal.web.diffusion;

import java.io.IOException;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.web.context.ContextLoaderListener;

public class InstallationTypeContextLoaderListener extends ContextLoaderListener {
    public void contextInitialized(javax.servlet.ServletContextEvent event) {
        Resource resource = new ClassPathResource("metamac/environment.xml");
        Properties props = new Properties();
        try {
            props.loadFromXML(resource.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String environmentType = props.getProperty("environment.metamac.portal.installation_type");
        System.setProperty("portal-rest-installation-type", "classpath:/spring/portal-rest-"+ environmentType.toLowerCase() +"/applicationContext.xml");
        super.contextInitialized(event);
    }
}