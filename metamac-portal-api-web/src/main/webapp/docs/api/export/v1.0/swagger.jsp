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
      "description": "",
      "example": "LABEL"
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
    },
    "ExportationDimensionFilters": {
      "type": "object",
      "title": "DimensionFilters",
      "description": "Si la dimensión es temporal, se le podrán aplicar los siguientes filtros",
      "properties": {
        "range": {
          "type": "object",
          "description": "range incluirá el listado de valores entre start y end, ambos incluidos. Si alguno de los filtros no se incluye, se considerará un rango abierto",
          "properties": {
            "start": {
              "type": "string",
              "example": "2010-M01"
            },
            "end": {
              "type": "string",
              "example": "2011-M02"
            }
          },
          "last": {
            "type": "integer",
            "description": "range incluirá los últimos n valores de entre los disponibles",
            "example": 4
          },
          "after": {
            "type": "string",
            "description": "after incluirá las fechas posteriores a la definida, incluida ella misma",
            "example": "2009"
          }
        }
      }
    },
    "ExportationDimensionValue": {
      "type":"array",
      "items": {
        "type":"string",
        "example": "INDICE_OCUPACION_PLAZAS"
      }
    },
    "ExportationDimensionValues": {
      "type": "object",
      "description": "La propiedad dimensionValues es opcional. Si no se define, tomará todos los valores posibles para la dimensión",
      "properties": {
        "dimensionValue": {
          "$ref": "#/definitions/ExportationDimensionValue"
        }
      }
    },
    "ExportationDimension": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "dimensionId": {
            "type": "string",
            "example": "TIME_PERIOD"
          },
          "labelVisualisationMode": {
            "$ref": "#/definitions/LabelVisualisationMode"
          },
          "position": {
            "type": "integer",
            "description": "La propiedad position determina donde se dibuja la dimensión. Las dimensiones de lado izquierdo toman valores consecutivos empezando en 0, menores de 20. Y las dimensiones de cabecera toman valores consecutivos empezando en 20, menores de 40. Es opcional y si no se pone, tomará el valor predeterminado",
            "example": "21"
          },
          "dimensionValues": {
            "$ref": "#/definitions/ExportationDimensionValues"
          },
          "dimensionFilters": {
            "$ref": "#/definitions/ExportationDimensionFilters"
          }
        }
      },
      "example": [
        {
          "dimensionId": "INDICADORES",
          "labelVisualisationMode": "LABEL",
          "position": 20,
          "dimensionValues": {
            "dimensionValue": ["INDICE_OCUPACION_PLAZAS"]
          }
        },
        {
          "dimensionId": "TIME_PERIOD",
          "labelVisualisationMode": "LABEL",
          "position": 21,
          "dimensionFilters": {
            "range": {
              "start": "2010-M01",
              "end": "2011-M02"
            },
            "last": 4,
            "after": "2009"
          }
        },
        {
          "dimensionId": "CATEGORIA_ALOJAMIENTO",
          "labelVisualisationMode": "LABEL",
          "position": 0,
          "dimensionValues": {
            "dimensionValue": ["TOTAL"]
          }
        },
        {
          "dimensionId": "DESTINO_ALOJAMIENTO",
          "labelVisualisationMode": "LABEL",
          "position": 1,
          "dimensionValues": {
            "dimensionValue": ["EL_HIERRO", "LA_PALMA", "LA_GOMERA", "TENERIFE", "GRAN_CANARIA", "FUERTEVENTURA", "LANZAROTE"]
          }
        }
      ]
    },
    "Exportation": {
      "type": "object",
      "title": "Exportation",
      "allOf": [
        {
          "properties": {
            "datasetSelection": {
              "type": "object",
              "properties": {
                "dimensions": {
                  "type": "object",
                  "properties": {
                    "dimension": {
                      "$ref": "#/definitions/ExportationDimension"
                    }
                  }
                }
              }
            }
          }
        }
      ]
    },
    "ExportationSvg": {
      "type":"string",
      "example": "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='120' height='120'><rect x='14' y='23' width='200' height='50' fill='lime' stroke='black' /></svg>"
    },
  },
  "paths": {
    "/v1.0/csv_comma/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "${msg['api.doc.swagger.tag.plainFile']}"
        ],
        "description": "${msg['api.doc.swagger.paths.csv_comma.datasets.agencyID.resourceID.version.post']}",
        "operationId": "resource__v1.0_csv_comma__datasets__agencyID__resourceID__version__exportDatasetToCsvComma_POST",
        "produces": [
          "text/csv"
        ],
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [           
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "svg",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/ExportationSvg"
            },
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
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
        "parameters": [
          {
            "name": "jsonBody",
            "in": "body",
            "schema":{
               "$ref": "#/definitions/Exportation"
            },
            "description": "${msg['api.doc.swagger.paths.any.post.parameters.jsonBody']}"
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
          "200": {
            "description": "${msg['api.doc.swagger.paths.responses.200']}"
          },
          "500":{
            "description":"${msg['api.doc.swagger.paths.responses.500']}"
          }
        }
      }
    }
  }
}
