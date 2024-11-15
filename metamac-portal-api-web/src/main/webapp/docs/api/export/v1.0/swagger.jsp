<%@page import="org.siemac.metamac.portal.web.diffusion.SwaggerUtils"%>
<%@page pageEncoding="UTF-8"%>
{
  "swagger": "2.0",
  "info": {
    "description": "Realizar exportaciones de los recursos estadísticos resulta una tarea común y de gran utilidad para poder tratar en el día a día con los datos manejados por el organismo. Esta API nos provee la funcionalidad necesaria para poder exportar los recursos estadísticos en diferentes formatos.",
    "version": "1.0",
    "title": "API de Exportaciones v1.0"
  },
  "host": "<%=SwaggerUtils.getExportApiBaseURLForSwagger()%>",
  "schemes": [],
  "tags": [
    {
      "name": "Exportaciones a ficheros PC-Axis",
      "description": ""
    },
    {
      "name": "Exportaciones a ficheros de texto plano",
      "description": ""
    },
    {
      "name": "Exportaciones a ficheros Excel",
      "description": ""
    },
    {
      "name": "Exportaciones a imágenes",
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
      "example": '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="120" height="120"><rect x="14" y="23" width="200" height="50" fill="lime" stroke="black" /></svg>'
    },
  },
  "paths": {
    "/v1.0/csv_comma/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero CSV separado por comas.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación. Es recomendable no incluir la extensión para que la API determine la extensión apropiada."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"Permite personalizar la respuesta mediante la exclusión o inclusión de campos de la misma. Los posibles valores son \"-attributes\".<br/>Ejemplos: <br/>\r\n- fields=-attributes"
         }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/csv_semicolon/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero CSV separado por puntos y comas.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación. Es recomendable no incluir la extensión para que la API determine la extensión apropiada." 
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"Permite personalizar la respuesta mediante la exclusión o inclusión de campos de la misma. Los posibles valores son \"-attributes\".<br/>Ejemplos: <br/>\r\n- fields=-attributes"
         }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },   
    "/v1.0/excel/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros Excel"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero Excel.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/excel/queries/{agencyID}/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros Excel"
        ],
        "description": "Permite realizar la exportación de una consulta en fichero Excel.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/excel/indicators/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros Excel"
        ],
        "description": "Permite realizar la exportación de un indicador en fichero Excel.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },         
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },         
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },   
    "/v1.0/excel/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros Excel"
        ],
        "description": "Permite realizar la exportación de una instancia de indicador en fichero Excel.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },         
          {
            "name": "indicatorSystemCode",
            "in": "path",
            "type": "string",
            "description": "Código del sistema a obtener."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },         
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/image": {
      "post": {
        "tags": [
          "Exportaciones a imágenes"
        ],
        "description": "Permite realizar una exportación a una imagen SVG.",
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
            "description": "Nombre del fichero resultante de la exportación."
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
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/px/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros PC-Axis"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero PC-Axis (.px).",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/px/queries/{agencyID}/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros PC-Axis"
        ],
        "description": "Permite realizar la exportación de una consulta en fichero PC-Axis (.px).",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },    
    "/v1.0/px/indicators/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros PC-Axis"
        ],
        "description": "Permite realizar la exportación de un indicador en fichero PC-Axis (.px).",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },          
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },        
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
     
    "/v1.0/px/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros PC-Axis"
        ],
        "description": "Permite realizar la exportación de una instancia de indicador en fichero PC-Axis (.px).",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "indicatorSystemCode",
            "in": "path",
            "type": "string",
            "description": "Código del sistema a obtener."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación."
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/tsv/datasets/{agencyID}/{resourceID}/{version}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de un dataset en fichero separado por tabuladores.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "version",
            "in": "path",
            "type": "string",
            "description": "Versión del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación. Es recomendable no incluir la extensión para que la API determine la extensión apropiada." 
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"Permite personalizar la respuesta mediante la exclusión o inclusión de campos de la misma. Los posibles valores son \"-attributes\".<br/>Ejemplos: <br/>\r\n- fields=-attributes"
         }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/tsv/queries/{agencyID}/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de una consulta en fichero separado por tabuladores.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "agencyID",
            "in": "path",
            "type": "string",
            "description": "Identificador de la organización mantenedora del recurso a exportar."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación. Es recomendable no incluir la extensión para que la API determine la extensión apropiada." 
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"Permite personalizar la respuesta mediante la exclusión o inclusión de campos de la misma. Los posibles valores son \"-attributes\".<br/>Ejemplos: <br/>\r\n- fields=-attributes"
         }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/tsv/indicators/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de un indicador en fichero separado por tabuladores.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación. Es recomendable no incluir la extensión para que la API determine la extensión apropiada." 
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"Permite personalizar la respuesta mediante la exclusión o inclusión de campos de la misma. Los posibles valores son \"-attributes\".<br/>Ejemplos: <br/>\r\n- fields=-attributes"
         }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    },
    "/v1.0/tsv/indicatorsSystems/{indicatorSystemCode}/indicatorsInstances/{resourceID}": {
      "post": {
        "tags": [
          "Exportaciones a ficheros de texto plano"
        ],
        "description": "Permite realizar la exportación de una instancia de indicador en fichero separado por tabuladores.",
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
            "description": "Cuerpo del mensaje en formato json. Este cuerpo sólo es necesario utilizarlo en el caso de que se desee realizar un filtrado de los datos a exportar sobre la totalidad de los que componen el recurso. En el caso de querer realizar un filtrado deberemos definir el objeto \"datasetSelection\". Dentro de este objeto deberemos especificar los valores que queremos exportar para cada una de las dimensiones. Se presenta a continuación un ejemplo del objeto con comentarios sobre los valores posibles."
          },
          {
            "name": "indicatorSystemCode",
            "in": "path",
            "type": "string",
            "description": "Código del sistema a obtener."
          },
          {
            "name": "resourceID",
            "in": "path",
            "type": "string",
            "description": "Identificador del recurso a exportar."
          },
          {
            "name": "filename",
            "in": "query",
            "type": "string",
            "description": "Nombre del fichero resultante de la exportación. Es recomendable no incluir la extensión para que la API determine la extensión apropiada." 
          },
          {
            "name": "lang",
            "in": "query",
            "type": "string",
            "description": "Idioma en el que se desea llevar a cabo la exportación. En caso de no especificarse ningún idioma se realizará en el idioma por defecto del organismo. Además, en el caso de que se solicite un idioma y no coincida con el idioma por defecto del organismo, éste último también se añadirá."
          },
          {
            "name":"fields",
            "in":"query",
            "type":"string",
            "description":"Permite personalizar la respuesta mediante la exclusión o inclusión de campos de la misma. Los posibles valores son \"-attributes\".<br/>Ejemplos: <br/>\r\n- fields=-attributes"
         }
        ],
        "responses": {
          "200": {
            "description": "Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
          },
          "500":{
            "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
          }
        }
      }
    }
  }
}
