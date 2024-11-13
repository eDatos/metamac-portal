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
                           "example": "permalink"
                        }
                     }
                  },
                  "description":""
               }
            ],
            "responses":{
               "201":{
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