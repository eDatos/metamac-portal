package org.siemac.metamac.portal.web.diffusion;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

public class SwaggerFilter implements Filter {

    private static final String EXPORT_API_NAME       = "export";
    private static final String PERMALINKS_API_NAME   = "permalinks";

    private static Pattern      swaggerVersionPattern = Pattern.compile(".*(/(" + EXPORT_API_NAME + "|" + PERMALINKS_API_NAME + ")/v\\d+\\.\\d+/)swagger.jsp");

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws java.io.IOException, ServletException {
        String path = ((HttpServletRequest) request).getRequestURI();
        if (StringUtils.isBlank(((HttpServletRequest) request).getQueryString())
                && (StringUtils.endsWithAny(path, getSupportedExportApiiVersions()) || StringUtils.endsWithAny(path, getSupportedPermalinksApiVersions()))) {
            request.getRequestDispatcher("/docs/api/index.jsp").forward(request, response);
        } else if (path.endsWith("swagger.jsp")) {
            Matcher matcher = swaggerVersionPattern.matcher(path);
            if (matcher.matches() && matcher.groupCount() >= 0) {
                request.getRequestDispatcher("/docs/api" + matcher.group(1) + "swagger.jsp").forward(request, response);
            }
        } else {
            chain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {
    }

    private String[] getSupportedExportApiiVersions() {
        return new String[]{"/" + EXPORT_API_NAME + "/v1.0/"};
    }

    private String[] getSupportedPermalinksApiVersions() {
        return new String[]{"/" + PERMALINKS_API_NAME + "/v1.0/"};
    }
}
