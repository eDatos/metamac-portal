<%@page import="org.siemac.metamac.portal.web.diffusion.SwaggerUtils"%>
<%@page pageEncoding="UTF-8"%>
<%@ page import="org.siemac.metamac.core.common.util.MessagesResourceBundle"%>
<%@ page import="org.siemac.metamac.core.common.util.InternationalizationUtils" %>
<%
   String locale = InternationalizationUtils.getInstance().getCurrentLocale(request);
   MessagesResourceBundle messagesResource = new MessagesResourceBundle(locale, "i18n.export.messages");
   pageContext.setAttribute("msg", messagesResource);
%>
{
  "swagger": "2.0",
  "info": {
    "description": "${msg['api.doc.swagger.description']}",
    "version": "1.0",
    "title": "${msg['api.doc.swagger.title']}"
  },
  "host": "<%=SwaggerUtils.getExportApiBaseURLForSwagger()%>",
  "schemes": [],
  "tags": [
    {
      "name": "${msg['api.doc.swagger.tag.pc-axisFile']}",
      "description": ""
    },
    {
      "name": "${msg['api.doc.swagger.tag.plainFile']}",
      "description": ""
    },
    {
      "name": "${msg['api.doc.swagger.tag.excelFile']}",
      "description": ""
    },
    {
      "name": "${msg['api.doc.swagger.tag.image']}",
      "description": ""
    }
  ],
  "definitions": {
    "DatasetSelection": {
      "type": "object",
      "title": "DatasetSelection",
      "allOf": [
        {
          "properties": {
            "attributes": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionAttributes"
            },
            "dimensions": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionDimensions"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionAttribute": {
      "type": "object",
      "title": "DatasetSelectionAttribute",
      "allOf": [
        {
          "properties": {
            "attributeId": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "string"
            },
            "labelVisualisationMode": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/LabelVisualisationMode"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionAttributes": {
      "type": "object",
      "title": "DatasetSelectionAttributes",
      "allOf": [
        {
          "$ref": "#/definitions/ListBase"
        },
        {
          "properties": {
            "attribute": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionAttribute"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionDimension": {
      "type": "object",
      "title": "DatasetSelectionDimension",
      "allOf": [
        {
          "properties": {
            "dimensionId": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "string"
            },
            "dimensionValues": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DimensionValues"
            },
            "labelVisualisationMode": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/LabelVisualisationMode"
            },
            "position": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "number"
            }
          }
        }
      ],
      "description": ""
    },
    "DatasetSelectionDimensions": {
      "type": "object",
      "title": "DatasetSelectionDimensions",
      "allOf": [
        {
          "$ref": "#/definitions/ListBase"
        },
        {
          "properties": {
            "dimension": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelectionDimension"
            }
          }
        }
      ],
      "description": ""
    },
    "DimensionValues": {
      "type": "object",
      "title": "DimensionValues",
      "allOf": [
        {
          "$ref": "#/definitions/ListBase"
        },
        {
          "properties": {
            "dimensionValue": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    },
    "ExcelExportation": {
      "type": "object",
      "title": "ExcelExportation",
      "allOf": [
        {
          "properties": {
            "datasetSelection": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelection"
            }
          }
        }
      ],
      "description": ""
    },
    "LabelVisualisationMode": {
      "type": "string",
      "title": "LabelVisualisationMode",
      "enum": [
        "CODE",
        "LABEL",
        "CODE_AND_LABEL"
      ],
      "description": ""
    },
    "PlainTextExportation": {
      "type": "object",
      "title": "PlainTextExportation",
      "allOf": [
        {
          "properties": {
            "datasetSelection": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelection"
            }
          }
        }
      ],
      "description": ""
    },
    "PxExportation": {
      "type": "object",
      "title": "PxExportation",
      "allOf": [
        {
          "properties": {
            "datasetSelection": {
              "xml": {
                "namespace": "http://www.siemac.org/metamac/rest/export/v1.0/domain"
              },
              "description": "",
              "$ref": "#/definitions/DatasetSelection"
            }
          }
        }
      ],
      "description": ""
    },
    "ListBase": {
      "type": "object",
      "title": "ListBase",
      "allOf": [
        {
          "properties": {
            "firstLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "kind": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "lastLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "limit": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "number"
            },
            "nextLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "offset": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "number"
            },
            "previousLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "selfLink": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "total": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "number"
            }
          }
        }
      ],
      "description": ""
    },
    "ResourceLink": {
      "type": "object",
      "title": "ResourceLink",
      "allOf": [
        {
          "properties": {
            "href": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            },
            "kind": {
              "xml": {
                "attribute": true,
                "namespace": ""
              },
              "description": "",
              "type": "string"
            }
          }
        }
      ],
      "description": ""
    }
  },
  "paths": {
    "/v1.0/csv_comma/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.plainFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.csv_comma.datasets.agencyID.resourceID.version.post']}",
        "operationId": "resource__v1.0_csv_comma__datasets__agencyID__resourceID__version__exportDatasetToCsvComma_POST",
        "consumes": [
           "multipart/form-data"
        ],
        "produces": [
          "text/csv"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.version']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}${msg['api.doc.swagger.paths.any.post.parameters.filename.plainFile']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"${msg['api.doc.swagger.paths.any.post.parameters.fields']}"
         }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/csv_semicolon/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.plainFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.csv_semicolon.datasets.agencyID.resourceID.version.post']}",
        "operationId": "resource__v1.0_csv_semicolon__datasets__agencyID__resourceID__version__exportDatasetToCsvSemicolon_POST",
        "produces": [
          "text/csv"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.version']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}" 
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"${msg['api.doc.swagger.paths.any.post.parameters.fields']}"
         }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },   
    "/v1.0/excel/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.excelFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.excel.datasets.agencyID.resourceID.version.post']}",
        "operationId": "resource__v1.0_excel__datasets__agencyID__resourceID__version__exportDatasetToExcelForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.version']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/excel/queries/{agencyID}/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.excelFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.excel.queries.agencyID.resourceID.post']}",
        "operationId": "resource__v1.0_excel__queries__agencyID__resourceID__exportQueryToExcelForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/excel/indicators/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.excelFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.excel.indicators.resourceID.post']}",
        "operationId": "resource__v1.0_excel__indicators__resourceID__exportIndicatorToExcelForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },         
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },         
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },   
    "/v1.0/excel/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.excelFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.excel.indicatorsSystems.indicatorSystemCode.indicatorsInstances.resourceID.post']}",
        "operationId": "resource__v1.0_excel__indicatorsSystems__indicatorSystemCode__indicatorsInstances__resourceID__exportIndicatorInstanceToExcelForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [           
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },         
          {
            "name": "indicatorSystemCode",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.indicatorSystemCode']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },         
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/image": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.image']}"
        ],
        "description": "${msg['api.doc.swagger.paths.image.post']}",
        "operationId": "resource__v1.0_image_exportSvgToImageForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "svg",
            "in": "formData",
            "type": "string",
            "description": ""
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "type",
            "in": "query",
            "type": "string",
            "description": ""
          },
          {
            "name": "width",
            "in": "query",
            "type": "string",
            "description": ""
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/px/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.pc-axisFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.px.datasets.agencyID.resourceID.version.post']}",
        "operationId": "resource__v1.0_px__datasets__agencyID__resourceID__version__exportDatasetToPxForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.version']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/px/queries/{agencyID}/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.pc-axisFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.px.queries.agencyID.resourceID.post']}",
        "operationId": "resource__v1.0_px__queries__agencyID__resourceID__exportQueryToPxForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },    
    "/v1.0/px/indicators/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.pc-axisFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.px.indicators.resourceID.post']}",
        "operationId": "resource__v1.0_px__indicators__resourceid__exportIndicatorToPxForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },          
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },        
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
     
    "/v1.0/px/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.pc-axisFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.px.indicatorsSystems.indicatorSystemCode.indicatorsInstances.resourceID.post']}",
        "operationId": "resource__v1.0_px__indicatorsSystems__indicatorSystemCode__indicatorsInstances__resourceid__exportIndicatorInstanceToPxForm_POST",
        "produces": [
          "application/xml"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "indicatorSystemCode",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.indicatorSystemCode']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/tsv/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.plainFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.tsv.datasets.agencyID.resourceID.version.post']}",
        "operationId": "resource__v1.0_tsv__datasets__agencyID__resourceID__version__exportDatasetToTsv_POST",
        "produces": [
          "application/octet-stream",
          "text/tab-separated-values"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.version']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}${msg['api.doc.swagger.paths.any.post.parameters.filename.plainFile']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"${msg['api.doc.swagger.paths.any.post.parameters.fields']}"
         }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/tsv/queries/{agencyID}/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.plainFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.tsv.queries.agencyID.resourceID.post']}",
        "operationId": "resource__v1.0_tsv__queries__agencyID__resourceID__exportQueryToTsv_POST",
        "produces": [
          "application/octet-stream",
          "text/tab-separated-values"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.agencyID']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}${msg['api.doc.swagger.paths.any.post.parameters.filename.plainFile']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"${msg['api.doc.swagger.paths.any.post.parameters.fields']}"
         }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/tsv/indicators/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.plainFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.tsv.indicators.resourceID.post']}",
        "operationId": "resource__v1.0_tsv__indicators__resourceId__exportIndicatorsToTsv_POST",
        "produces": [
          "application/octet-stream",
          "text/tab-separated-values"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}"
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"${msg['api.doc.swagger.paths.any.post.parameters.fields']}"
         }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    },
    "/v1.0/tsv/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.plainFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.tsv.indicatorsSystems.indicatorSystemCode.indicatorsInstances.resourceID.post']}",
        "operationId": "resource__v1.0_tsv__indicatorsSystems__indicatorSystemCode__indicatorsInstances__resourceId__exportDatasetToTsv_POST",
        "produces": [
          "application/octet-stream",
          "text/tab-separated-values"
        ],
        "consumes": [
           "multipart/form-data"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "formData",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}${msg['api.doc.swagger.paths.any.post.parameters.jsonBodyExample']}"
          },
          {
            "name": "indicatorSystemCode",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.indicatorSystemCode']}",
            "required":true
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.resourceID']}",
            "required":true
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.filename']}" 
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.lang']}"
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"${msg['api.doc.swagger.paths.any.post.parameters.fields']}"
         }
        ],
        "responses": {
          "201": {
            "schema": {
              "description": "",
              "type": "object"
            },
            "headers": {},
            "description": "${msg['api.doc.swagger.paths.responses.201']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    }
  }
}
