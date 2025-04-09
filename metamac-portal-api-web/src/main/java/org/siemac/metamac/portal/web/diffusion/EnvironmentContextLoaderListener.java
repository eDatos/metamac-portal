package org.siemac.metamac.portal.web.diffusion;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.context.ContextLoaderListener;

public class EnvironmentContextLoaderListener extends ContextLoaderListener {
    public void contextInitialized(javax.servlet.ServletContextEvent event) {
        Resource resource = getConfigurationResource();
        Properties props = new Properties();
        try {
            props.loadFromXML(resource.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        System.setProperty("environment.metamac.portal.installation_type", props.getProperty("environment.metamac.portal.installation_type"));
        super.contextInitialized(event);
    }

    private Resource getConfigurationResource() {
        // 1. Primero buscamos el archivo LOCAL en el classpath
        Resource localResource = new ClassPathResource("metamac/environment-LOCAL.xml");
        if (localResource.exists()) {
            return localResource;
        }

        // 2. Si no existe, buscamos el archivo definido en la variable de entorno
        String envPath = System.getenv("STATISTICAL_VISUALIZAZER_CONF_PATH");
        if (envPath != null && !envPath.isEmpty()) {
            try {
                return new UrlResource(envPath);
            } catch (MalformedURLException e) {
                throw new RuntimeException("Invalid path in STATISTICAL_VISUALIZAZER_CONF_PATH: " + envPath, e);
            }
        }

        // 3. Fallback final al archivo por defecto en el classpath
        Resource defaultResource = new ClassPathResource("metamac/environment.xml");
        if (!defaultResource.exists()) {
            throw new RuntimeException("No configuration file found (LOCAL, ENV, or default).");
        }
        return defaultResource;
    }
}