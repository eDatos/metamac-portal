<%@page import="org.siemac.metamac.portal.web.diffusion.SwaggerUtils"%>
<%@page pageEncoding="UTF-8"%>
{
   "swagger":"2.0",
   "info":{
      "description":"Los permalinks son enlaces permanentes que se generan para asegurarnos que una URL va a ser accesible a lo largo del tiempo.",
      "version":"1.0",
      "title":"API de Permalinks v1.0"
   },
   "host":"<%=SwaggerUtils.getPermalinksApiBaseURLForSwagger()%>",
   "schemes":[

   ],
   "tags":[
      {
         "name":"Permalinks",
         "description":""
      }
   ],
   "definitions":{
      "Permalink":{
         "type":"object",
         "title":"Permalink",
         "allOf":[
            {
               "properties":{
                  "kind":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "content":{
                     "xml":{
                        "namespace":"http://www.siemac.org/metamac/rest/permalinks/v1.0/domain"
                     },
                     "description":"",
                     "type":"string"
                  },
                  "id":{
                     "xml":{
                        "namespace":"http://www.siemac.org/metamac/rest/permalinks/v1.0/domain"
                     },
                     "description":"",
                     "type":"string"
                  },
                  "selfLink":{
                     "xml":{
                        "namespace":"http://www.siemac.org/metamac/rest/permalinks/v1.0/domain"
                     },
                     "description":"",
                     "$ref":"#/definitions/ResourceLink"
                  }
               }
            }
         ],
         "description":""
      },
      "ListBase":{
         "type":"object",
         "title":"ListBase",
         "allOf":[
            {
               "properties":{
                  "firstLink":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "kind":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "lastLink":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "limit":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"number"
                  },
                  "nextLink":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "offset":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"number"
                  },
                  "previousLink":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "selfLink":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "total":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"number"
                  }
               }
            }
         ],
         "description":""
      },
      "ResourceLink":{
         "type":"object",
         "title":"ResourceLink",
         "allOf":[
            {
               "properties":{
                  "href":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  },
                  "kind":{
                     "xml":{
                        "attribute":true,
                        "namespace":""
                     },
                     "description":"",
                     "type":"string"
                  }
               }
            }
         ],
         "description":""
      }
   },
   "paths":{
      "/v1.0/permalinks":{
         "post":{
            "tags":[
               "Permalinks"
            ],
            "description":"Permite crear un nuevo enlace",
            "operationId":"resource__v1.0_permalinks_createPermalink_POST",
            "consumes":[
               "application/json",
               "application/xml"
            ],
            "produces":[
               "application/json",
               "application/xml"
            ],
            "parameters":[
               {
                  "name":"body",
                  "in":"body",
                  "schema":{
                     "type": "object",
                     "properties":{
                        "content":{
                           "type": "string",
                           "example": "{\"queryParams\":{\"agency\":\"ISTAC\",\"identifier\":\"C00031A_000002\",\"version\":\"1.13\",\"type\":\"dataset\",\"indicatorSystem\":\"\",\"geo\":\"\",\"multidatasetId\":\"\"},\"hash\":\"#visualization/table\",\"selection\":{\"DESTINO_ALOJAMIENTO\":{\"position\":0,\"visibleLabelType\":\"LABEL\",\"categories\":[{\"id\":\"ASTURIAS\",\"selected\":false,\"drawable\":false},{\"id\":\"BALEARES\",\"selected\":false,\"drawable\":false},{\"id\":\"CANARIAS\",\"selected\":false,\"drawable\":false},{\"id\":\"LAS_PALMAS\",\"selected\":false,\"drawable\":false},{\"id\":\"FUERTEVENTURA\",\"selected\":false,\"drawable\":false},{\"id\":\"GRAN_CANARIA\",\"selected\":false,\"drawable\":false},{\"id\":\"LANZAROTE\",\"selected\":false,\"drawable\":false},{\"id\":\"SANTA_CRUZ_TNF\",\"selected\":false,\"drawable\":false},{\"id\":\"EL_HIERRO\",\"selected\":false,\"drawable\":false},{\"id\":\"LA_GOMERA\",\"selected\":false,\"drawable\":false},{\"id\":\"LA_PALMA\",\"selected\":false,\"drawable\":false},{\"id\":\"TENERIFE\",\"selected\":false,\"drawable\":false},{\"id\":\"CANTABRIA\",\"selected\":true,\"drawable\":true},{\"id\":\"CASTILLA_LEON\",\"selected\":false,\"drawable\":false},{\"id\":\"CATALUNA\",\"selected\":false,\"drawable\":false},{\"id\":\"COMUNIDAD_VALENCIANA\",\"selected\":false,\"drawable\":false},{\"id\":\"EXTREMADURA\",\"selected\":false,\"drawable\":false},{\"id\":\"GALICIA\",\"selected\":false,\"drawable\":false},{\"id\":\"MADRID\",\"selected\":false,\"drawable\":false},{\"id\":\"MELILLA\",\"selected\":false,\"drawable\":false},{\"id\":\"MURCIA\",\"selected\":false,\"drawable\":false},{\"id\":\"PAIS_VASCO\",\"selected\":false,\"drawable\":false},{\"id\":\"RIOJA\",\"selected\":false,\"drawable\":false}],\"sortBy\":\"OBSERVATION\"},\"CATEGORIA_ALOJAMIENTO\":{\"position\":1,\"visibleLabelType\":\"LABEL\",\"categories\":[{\"id\":\"1_2_3_ESTRELLAS\",\"selected\":true,\"drawable\":true},{\"id\":\"4_5_ESTRELLAS\",\"selected\":true,\"drawable\":true},{\"id\":\"TOTAL\",\"selected\":true,\"drawable\":true}],\"sortBy\":\"OBSERVATION\"},\"INDICADORES\":{\"position\":21,\"visibleLabelType\":\"LABEL\",\"categories\":[{\"id\":\"INDICE_OCUPACION_HABITACIONES\",\"selected\":true,\"drawable\":true},{\"id\":\"INDICE_OCUPACION_HABITACIONES_ESTANDAR\",\"selected\":true,\"drawable\":true},{\"id\":\"INDICE_OCUPACION_HABITACIONES_ESTANDAR_BALCON\",\"selected\":true,\"drawable\":true},{\"id\":\"INDICE_OCUPACION_HABITACIONES_ESTANDAR_SIN_BALCON\",\"selected\":true,\"drawable\":true},{\"id\":\"INDICE_OCUPACION_HABITACIONES_SUPERIORES\",\"selected\":true,\"drawable\":true},{\"id\":\"INDICE_OCUPACION_HABITACIONES_SUPERIORES_JACUZZI\",\"selected\":true,\"drawable\":true},{\"id\":\"INDICE_OCUPACION_HABITACIONES_SUPERIORES_TERRAZA\",\"selected\":true,\"drawable\":true},{\"id\":\"INDICE_OCUPACION_PLAZAS\",\"selected\":true,\"drawable\":true}],\"sortBy\":\"OBSERVATION\"},\"TIME_PERIOD\":{\"position\":20,\"visibleLabelType\":\"LABEL\",\"categories\":[{\"id\":\"2013\",\"selected\":true,\"drawable\":true},{\"id\":\"2012\",\"selected\":true,\"drawable\":true},{\"id\":\"2011\",\"selected\":true,\"drawable\":true},{\"id\":\"2010\",\"selected\":true,\"drawable\":true},{\"id\":\"2009\",\"selected\":true,\"drawable\":true},{\"id\":\"2008\",\"selected\":true,\"drawable\":true},{\"id\":\"2007\",\"selected\":true,\"drawable\":true},{\"id\":\"2006\",\"selected\":true,\"drawable\":true},{\"id\":\"2005\",\"selected\":true,\"drawable\":true},{\"id\":\"2004\",\"selected\":true,\"drawable\":true},{\"id\":\"2003\",\"selected\":true,\"drawable\":true},{\"id\":\"2002\",\"selected\":true,\"drawable\":true},{\"id\":\"2001\",\"selected\":true,\"drawable\":true},{\"id\":\"2000\",\"selected\":true,\"drawable\":true}],\"sortBy\":\"REPRESENTATION\"}},\"dynamicSelection\":{\"dimension\":{\"type\":{}}},\"state\":{\"valuesToIgnore\":[]}}"
                        }
                     }
                  },
                  "description":""
               }
            ],
            "responses":{
               "200":{
                  "headers":{

                  },
                  "description":"Creado. La petición se ha completado y ha dado lugar a la creación de un nuevo recurso."
               },
               "401":{
                  "description":"No autorizado. Se necesita autorización para poder crear el recurso."
               },
               "406":{
                  "description":"No aceptable. El formato solicitado no es válido."
               },
               "500":{
                  "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
               },
               "503":{
                  "description":"Servicio no disponible. Indica que actualmente el servidor no está disponible y por tanto, la solicitud no puede procesarse. El error puede deberse a una sobrecarga temporal o a labores de mantenimiento del servidor. Se trata de una situación temporal."
               }
            }
         }
      },
      "/v1.0/permalinks/{id}":{
         "get":{
            "tags":[
               "Permalinks"
            ],
            "description":"Permite consultar el contenido de un determinado enlace permanente.",
            "operationId":"resource__v1.0_permalinks__id__retrievePermalinkByIdXml_GET",
            "produces":[
               "application/xml"
            ],
            "parameters":[
               {
                  "name":"id",
                  "in":"path",
                  "type":"string",
                  "description":"Identificador del enlace permanente."
               }
            ],
            "responses":{
               "200":{
                  "schema":{
                     "description":"",
                     "$ref":"#/definitions/Permalink"
                  },
                  "headers":{

                  },
                  "description":"Éxito. Indica que la petición ha sido resuelta correctamente."
               },
               "404":{
                  "description":"No encontrado. El recurso solicitado no existe."
               },
               "406":{
                  "description":"No aceptable. El formato solicitado no es válido."
               },
               "500":{
                  "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
               },
               "503":{
                  "description":"Servicio no disponible. Indica que actualmente el servidor no está disponible y por tanto, la solicitud no puede procesarse. El error puede deberse a una sobrecarga temporal o a labores de mantenimiento del servidor. Se trata de una situación temporal."
               }
            }
         },
         "get":{
            "tags":[
               "Permalinks"
            ],
            "description":"Retrieve content of permalink by id",
            "operationId":"resource__v1.0_permalinks__id__retrievePermalinkByIdJson_GET",
            "produces":[
               "application/json"
            ],
            "parameters":[
               {
                  "name":"id",
                  "in":"path",
                  "type":"string",
                  "description":"Identificador del enlace permanente."
               }
            ],
            "responses":{
               "200":{
                  "headers":{

                  },
                  "description":"Éxito. Indica que la petición ha sido resuelta correctamente."
               },
               "404":{
                  "description":"No encontrado. El recurso solicitado no existe."
               },
               "406":{
                  "description":"No aceptable. El formato solicitado no es válido."
               },
               "500":{
                  "description":"Error interno del servidor. Se ha producido un error que impide que se obtenga el recurso solicitado."
               },
               "503":{
                  "description":"Servicio no disponible. Indica que actualmente el servidor no está disponible y por tanto, la solicitud no puede procesarse. El error puede deberse a una sobrecarga temporal o a labores de mantenimiento del servidor. Se trata de una situación temporal."
               }
            }
         }
      }
   }
}