package org.siemac.metamac.portal.web.diffusion;

import java.io.IOException;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.context.ContextLoaderListener;

public class EnvironmentContextLoaderListener extends ContextLoaderListener {
    public void contextInitialized(javax.servlet.ServletContextEvent event) {
        Resource resource = new ClassPathResource("metamac/environment-LOCAL.xml");
        if (!resource.exists()) {
            resource = new ClassPathResource("metamac/environment.xml");
        }
        Properties props = new Properties();
        try {
            props.loadFromXML(resource.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        System.setProperty("environment.metamac.portal.installation_type", props.getProperty("environment.metamac.portal.installation_type"));
        super.contextInitialized(event);
    }
}