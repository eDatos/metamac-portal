App.namespace('App.test.response.metadata');

App.test.response.metadata = {
    "id": "C00025A_000001",
    "urn": "urn:siemac:org.siemac.metamac.infomodel.statisticalresources.Dataset=ISTAC:C00025A_000001(001.000)",
    "selfLink": {
        "kind": "statisticalResources#dataset",
        "href": "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/datasets/ISTAC/C00025A_000001/001.000"
    },
    "parentLink": {
        "kind": "statisticalResources#datasets",
        "href": "http://estadisticas.arte-consultores.com/metamac-statistical-resources-external-web/apis/statistical-resources/v1.0/datasets"
    },
    "name": {
        "text": [
            {
                "value": "Título en español",
                "lang": "es"
            }
        ]
    },
    "description": {
        "text": [
            {
                "value": "Descripción en español",
                "lang": "es"
            }
        ]
    },
    "selectedLanguages": {
        "language": [
            "es"
        ],
        "total": 1
    },
    "metadata": {
        "nextVersion": "NON_SCHEDULED_UPDATE",
        "mantainer": "ISTAC",
        "relatedDsd": {
            "showDecimals": 4,
            "heading": {
                "dimensionId": [
                    "INDICADORES",
                    "TIME_PERIOD"
                ],
                "total": 2
            },
            "stub": {
                "dimensionId": [
                    "CATEGORIA_ALOJAMIENTO",
                    "DESTINO_ALOJAMIENTO"
                ],
                "total": 2
            },
            "autoOpen": true,
            "id": "DSD_INDICE_OCUPACION",
            "urn": "urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ISTAC:DSD_INDICE_OCUPACION(01.000)",
            "selfLink": {
                "kind": "structuralResources#dataStructure",
                "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/datastructures/ISTAC/DSD_INDICE_OCUPACION/01.000"
            },
            "name": {
                "text": [
                    {
                        "value": "Índice censal de ocupación por plazas o por habitaciones según categorías por municipios de alojamiento y periodos.",
                        "lang": "es"
                    }
                ]
            },
            "kind": "structuralResources#dataStructure"
        },
        "dimensions": {
            "dimension": [
                {
                    "id": "TIME_PERIOD",
                    "name": {
                        "text": [
                            {
                                "value": "Periodo de tiempo",
                                "lang": "es"
                            }
                        ]
                    },
                    "type": "TIME_DIMENSION",
                    "dimensionValues": {
                        "value": [
                            {
                                "id": "time_1",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_1",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Time 1",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "time_2",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_2",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Time 2",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "time_2_1",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_2_1",
                                "visualisationParent": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_2",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Time 2 1",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "time_2_2",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_2_2",
                                "visualisationParent": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_2",
                                "open": false,
                                "name": {
                                    "text": [
                                        {
                                            "value": "Time 2 2",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "time_2_2_1",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_2_2_1",
                                "visualisationParent": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_2_2",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Time 2 2 1",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "time_3",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:time_3",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Time 3",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total": 6
                    }
                },
                {
                    "id": "TIME_PERIOD_2",
                    "name": {
                        "text": [
                            {
                                "value": "Periodo de tiempo 2",
                                "lang": "es"
                            }
                        ]
                    },
                    "type": "TIME_DIMENSION",
                    "dimensionValues": {
                        "value": [
                            {
                                "id": "2018",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Year 2018",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "temporalGranularity": "YEARLY"
                            },
                            {
                                "id": "2018-S1",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2018-S1",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "temporalGranularity": "BIYEARLY"
                            },
                            {
                                "id": "2018-W10",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2018-W10",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "temporalGranularity": "WEEKLY"
                            },
                            {
                                "id": "2018-M02",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2018-M02",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "temporalGranularity": "MONTHLY"
                            },
                            {
                                "id": "2018-W06",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2018-W06",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "temporalGranularity": "WEEKLY"
                            },
                            {
                                "id": "2017-W05",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2017-W05",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "temporalGranularity": "WEEKLY"
                            },
                            {
                                "id": "2016",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Year 2016",
                                            "lang":"es"
                                        }
                                    ]
                                },
                                "temporalGranularity": "YEARLY"
                            }
                        ],
                        "total": 6
                    }
                },
                {
                    "id": "INDICADORES",
                    "name": {
                        "text": [
                            {
                                "value": "Indicadores",
                                "lang": "es"
                            }
                        ]
                    },
                    "type": "MEASURE_DIMENSION",
                    "dimensionValues": {
                        "value": [
                            {
                                "showDecimalsPrecision": 6,
                                "id": "INDICE_OCUPACION_HABITACIONES",
                                "urn": "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ISTAC:INDICES_CENSALES_OCUPACION_HOTELERA(01.000).INDICE_OCUPACION_HABITACIONES",
                                "open": true,
                                "name": {
                                    "text": [
                                        {
                                            "value": "Índice de ocupación de habitaciones",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "INDICE_OCUPACION_PLAZAS",
                                "open": false,
                                "urn": "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ISTAC:INDICES_CENSALES_OCUPACION_HOTELERA(01.000).INDICE_OCUPACION_PLAZAS",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Índice de ocupación de plazas",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total": 2
                    }
                },
                {
                    "id": "CATEGORIA_ALOJAMIENTO",
                    "name": {
                        "text": [
                            {
                                "value": "Categoría del alojamiento",
                                "lang": "es"
                            }
                        ]
                    },
                    "type": "DIMENSION",
                    "dimensionValues": {
                        "value": [
                            {
                                "id": "1_2_3_ESTRELLAS",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_CATEGORIA_ESTABLECIMIENTO_HOTELERO(01.000).1_2_3_ESTRELLAS",
                                "name": {
                                    "text": [
                                        {
                                            "value": "1, 2 y 3 estrellas",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "4_5_ESTRELLAS",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_CATEGORIA_ESTABLECIMIENTO_HOTELERO(01.000).4_5_ESTRELLAS",
                                "name": {
                                    "text": [
                                        {
                                            "value": "4 y 5 Estrellas",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "TOTAL",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_CATEGORIA_ESTABLECIMIENTO_HOTELERO(01.000).TOTAL",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Total",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total": 3
                    }
                },
                {
                    "id": "DESTINO_ALOJAMIENTO",
                    "name": {
                        "text": [
                            {
                                "value": "Destino del alojamiento",
                                "lang": "es"
                            }
                        ]
                    },
                    "type": "GEOGRAPHIC_DIMENSION",
                    "dimensionValues": {
                        "value": [
                            {
                                "id": "EL_HIERRO",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).EL_HIERRO",
                                "name": {
                                    "text": [
                                        {
                                            "value": "El Hierro",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                variableElement: {
                                    managementAppLink: "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/variables/variable;id=TERRITORIO/variableElement;id=ELHIERRO",
                                    id: "ELHIERRO",
                                    urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.ELHIERRO",
                                    selfLink: {
                                        kind: "structuralResources#variableElement",
                                        href: "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/ELHIERRO"
                                    },
                                    name: {
                                        text: [
                                            {
                                                value: "ELHIERRO",
                                                lang: "es"
                                            }
                                        ]
                                    },
                                    kind: "structuralResources#variableElement"
                                }
                            },
                            {
                                "id": "LA_PALMA",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LA_PALMA",
                                "name": {
                                    "text": [
                                        {
                                            "value": "La Palma",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                variableElement: {
                                    managementAppLink: "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/variables/variable;id=TERRITORIO/variableElement;id=LAPALMA",
                                    id: "LAPALMA",
                                    urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.LAPALMA",
                                    selfLink: {
                                        kind: "structuralResources#variableElement",
                                        href: "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/LAPALMA"
                                    },
                                    name: {
                                        text: [
                                            {
                                                value: "ELHIERRO",
                                                lang: "es"
                                            }
                                        ]
                                    },
                                    kind: "structuralResources#variableElement"
                                }
                            },
                            {
                                "id": "LA_GOMERA",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LA_GOMERA",
                                "name": {
                                    "text": [
                                        {
                                            "value": "La Gomera",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                variableElement: {
                                    managementAppLink: "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/variables/variable;id=TERRITORIO/variableElement;id=LAGOMERA",
                                    id: "LAGOMERA",
                                    urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.LAGOMERA",
                                    selfLink: {
                                        kind: "structuralResources#variableElement",
                                        href: "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/LAGOMERA"
                                    },
                                    name: {
                                        text: [
                                            {
                                                value: "LAGOMERA",
                                                lang: "es"
                                            }
                                        ]
                                    },
                                    kind: "structuralResources#variableElement"
                                }
                            },
                            {
                                "id": "TENERIFE",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).TENERIFE",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Tenerife",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                variableElement: {
                                    managementAppLink: "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/variables/variable;id=TERRITORIO/variableElement;id=LAGOMERA",
                                    id: "TENERIFE",
                                    urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.TENERIFE",
                                    selfLink: {
                                        kind: "structuralResources#variableElement",
                                        href: "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/LAGOMERA"
                                    },
                                    name: {
                                        text: [
                                            {
                                                value: "TENERIFE",
                                                lang: "es"
                                            }
                                        ]
                                    },
                                    kind: "structuralResources#variableElement"
                                }
                            },
                            {
                                "id": "GRAN_CANARIA",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).GRAN_CANARIA",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Gran Canaria",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                variableElement: {
                                    managementAppLink: "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/variables/variable;id=TERRITORIO/variableElement;id=GRANCANARIA",
                                    id: "GRANCANARIA",
                                    urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.GRANCANARIA",
                                    selfLink: {
                                        kind: "structuralResources#variableElement",
                                        href: "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/GRANCANARIA"
                                    },
                                    name: {
                                        text: [
                                            {
                                                value: "GRANCANARIA",
                                                lang: "es"
                                            }
                                        ]
                                    },
                                    kind: "structuralResources#variableElement"
                                }
                            },
                            {
                                "id": "FUERTEVENTURA",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).FUERTEVENTURA",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Fuerteventura",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                variableElement: {
                                    managementAppLink: "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/variables/variable;id=TERRITORIO/variableElement;id=FUERTEVENTURA",
                                    id: "FUERTEVENTURA",
                                    urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.FUERTEVENTURA",
                                    selfLink: {
                                        kind: "structuralResources#variableElement",
                                        href: "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/FUERTEVENTURA"
                                    },
                                    name: {
                                        text: [
                                            {
                                                value: "FUERTEVENTURA",
                                                lang: "es"
                                            }
                                        ]
                                    },
                                    kind: "structuralResources#variableElement"
                                }
                            },
                            {
                                "id": "LANZAROTE",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_ISLAS_CANARIAS(01.001).LANZAROTE",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Lanzarote",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                variableElement: {
                                    managementAppLink: "http://estadisticas.arte-consultores.com/metamac-srm-web/#structuralResources/variables/variable;id=TERRITORIO/variableElement;id=LANZAROTE",
                                    id: "LANZAROTE",
                                    urn: "urn:siemac:org.siemac.metamac.infomodel.structuralresources.VariableElement=TERRITORIO.LANZAROTE",
                                    selfLink: {
                                        kind: "structuralResources#variableElement",
                                        href: "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/v1.0/variables/TERRITORIO/variableelements/LANZAROTE"
                                    },
                                    name: {
                                        text: [
                                            {
                                                value: "LANZAROTE",
                                                lang: "es"
                                            }
                                        ]
                                    },
                                    kind: "structuralResources#variableElement"
                                }
                            }
                        ],
                        "total": 7
                    }
                }
            ],
            "total": 4
        },
        "formatExtentDimensions": 4,
        "dateNextUpdate": {
            text: [
                {
                    value: "30/07/2013",
                    lang: "en"
                },
                {
                    value: "30/07/2013",
                    lang: "pt"
                },
                {
                    value: "30/07/2013",
                    lang: "es"
                },
                {
                    value: "30/07/2013",
                    lang: "ca"
                }
            ]
        },
        "updateFrequency": {
            "id": "M",
            "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=SDMX:CL_FREQ(1.0).M",
            "selfLink": {
                "kind": "structuralResources#code",
                "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/SDMX/CL_FREQ/1.0/codes/M"
            },
            "name": {
                "text": [
                    {
                        "value": "Mensual",
                        "lang": "es"
                    }
                ]
            },
            "kind": "structuralResources#code"
        },
        "statisticOfficiality": {
            "id": "STAT_OFF_0001",
            "name": {
                "text": [
                    {
                        "value": "Oficialidad",
                        "lang": "es"
                    }
                ]
            }
        },
        "language": {
            "id": "ES",
            "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=ISTAC:CL_LANGUAJES(01.000).ES",
            "selfLink": {
                "kind": "structuralResources#code",
                "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/codelists/ISTAC/CL_LANGUAJES/01.000/codes/ES"
            },
            "name": {
                "text": [
                    {
                        "value": "Español",
                        "lang": "es"
                    }
                ]
            },
            "kind": "structuralResources#code"
        },
        "languages": {
            "resource": [
                {
                    "id": "es",
                    "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).x3CUQjJX",
                    "selfLink": {
                        "kind": "structuralResources#code",
                        "href": "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/x3CUQjJX"
                    },
                    "name": {
                        "text": [
                            {
                                "value": "Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "kind": "structuralResources#code"
                },
                {
                    "id": "en",
                    "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=MaintainerMock:CodelistMock(1.0).036ty5Ku",
                    "selfLink": {
                        "kind": "structuralResources#code",
                        "href": "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/036ty5Ku"
                    },
                    "name": {
                        "text": [
                            {
                                "value": "Ingles",
                                "lang": "es"
                            }
                        ]
                    },
                    "kind": "structuralResources#code"
                }
            ],
            "total": 2
        },
        "statisticalOperation": {
            "id": "C00025A",
            "urn": "urn:siemac:org.siemac.metamac.infomodel.statisticaloperations.Operation=C00025A",
            "selfLink": {
                "kind": "statisticalOperations#operation",
                "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/operations/C00025A"
            },
            "name": {
                "text": [
                    {
                        "value": "Estadística de la Evolución Histórica de la Población",
                        "lang": "es"
                    }
                ]
            },
            "kind": "statisticalOperations#operation"
        },
        "type": "DATASET",
        "creator": {
            "id": "ISTAC",
            "urn": "urn:sdmx:org.sdmx.infomodel.base.OrganisationUnit=ISTAC:UNIDADES_GOBCAN(02.000).ISTAC",
            "selfLink": {
                "kind": "structuralResources#organisationUnit",
                "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/organisationunitschemes/ISTAC/UNIDADES_GOBCAN/02.000/organisationunits/ISTAC"
            },
            "name": {
                "text": [
                    {
                        "value": "Instituto Canario de Estadística",
                        "lang": "es"
                    }
                ]
            },
            "kind": "structuralResources#organisationUnit"
        },
        "lastUpdate": "2013-07-26T10:48:29.072+01:00",
        "publishers": {
            "resource": [
                {
                    "id": "ISTAC",
                    "urn": "urn:sdmx:org.sdmx.infomodel.base.OrganisationUnit=ISTAC:UNIDADES_GOBCAN(02.000).ISTAC",
                    "selfLink": {
                        "kind": "structuralResources#organisationUnit",
                        "href": "http://estadisticas.arte-consultores.com/metamac-srm-web/apis/structural-resources-internal/latest/organisationunitschemes/ISTAC/UNIDADES_GOBCAN/02.000/organisationunits/ISTAC"
                    },
                    "name": {
                        "text": [
                            {
                                "value": "Instituto Canario de Estadística",
                                "lang": "es"
                            }
                        ]
                    },
                    "kind": "structuralResources#organisationUnit"
                }
            ],
            "total": 1
        },
        "maintainer": {
            "id": "ISTAC",
            "nestedId": "ISTAC",
            "urn": "urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX:AGENCIES(1.0).ISTAC",
            "selfLink": {
                "kind": "structuralResources#agency",
                "href": "http://localhost:8080/metamac-srm-web/apis/structural-resources-internal/latest/ISTAC"
            },
            "name": {
                "text": [
                    {
                        "value": "ISTAC",
                        "lang": "es"
                    }
                ]
            },
            "kind": "structuralResources#agency"
        },
        "version": "001.000",
        "versionRationaleTypes": {
            "versionRationaleType": [
                "MAJOR_NEW_RESOURCE"
            ],
            "total": 1
        },
        "attributes": {
            "attribute": [
                {
                    "id": "at1",
                    "name": {
                        "text": [
                            {
                                "value": "at1-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DATASET"
                },
                {
                    "id": "at2",
                    "name": {
                        "text": [
                            {
                                "value": "at2-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DATASET",
                    "attributeValues": {
                        "value": [
                            {
                                "id": "A",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=agency01:abc(01.000).A",
                                "selfLink": {
                                    "href": "http://apis.metamac.org/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/agency01/abc/01.000/codes/A"
                                },
                                "name": {
                                    "text": [
                                        {
                                            "value": "A en Español",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "kind": "structuralResources#code"
                            },
                            {
                                "id": "C",
                                "urn": "urn:sdmx:org.sdmx.infomodel.codelist.Code=agency01:abc(01.000).C",
                                "selfLink": {
                                    "href": "http://apis.metamac.org/metamac-srm-web/apis/structural-resources-internal/v1.0/codelists/agency01/abc/01.000/codes/C"
                                },
                                "name": {
                                    "text": [
                                        {
                                            "value": "C en Español",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "kind": "structuralResources#code"
                            }
                        ],
                        "total": 2
                    }
                },
                {
                    "id": "at3",
                    "name": {
                        "text": [
                            {
                                "value": "at3-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "dimension": [
                            {
                                "dimensionId": "GEO_DIM"
                            }
                        ],
                        "total": 1
                    }
                },
                {
                    "id": "at4",
                    "name": {
                        "text": [
                            {
                                "value": "at4-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "dimension": [
                            {
                                "dimensionId": "GEO_DIM"
                            },
                            {
                                "dimensionId": "dim01"
                            }
                        ],
                        "total": 2
                    }
                },
                {
                    "id": "at5",
                    "name": {
                        "text": [
                            {
                                "value": "at5-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "dimension": [
                            {
                                "dimensionId": "GEO_DIM"
                            },
                            {
                                "dimensionId": "TIME_PERIOD"
                            }
                        ],
                        "total": 2
                    },
                    "attributeValues": {
                        "value": [
                            {
                                "id": "2013Q1",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2013 Primer cuatrimestre",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "2013Q2",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2013 Segundo cuatrimestre",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "2013Q3",
                                "name": {
                                    "text": [
                                        {
                                            "value": "2013 Tercer cuatrimestre",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total": 3
                    }
                },
                {
                    "id": "at6",
                    "name": {
                        "text": [
                            {
                                "value": "at6-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "dimension": [
                            {
                                "dimensionId": "GEO_DIM"
                            },
                            {
                                "dimensionId": "TIME_PERIOD"
                            },
                            {
                                "dimensionId": "measure01"
                            }
                        ],
                        "total": 3
                    },
                    "attributeValues": {
                        "value": [
                            {
                                "id": "1",
                                "urn": "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=agency01:123(01.000).1",
                                "selfLink": {
                                    "href": "http://apis.metamac.org/metamac-srm-web/apis/structural-resources-internal/v1.0/conceptschemes/agency01/123/01.000/concepts/1"
                                },
                                "name": {
                                    "text": [
                                        {
                                            "value": "1 en Español",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "kind": "structuralResources#concept"
                            },
                            {
                                "id": "2",
                                "urn": "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=agency01:123(01.000).2",
                                "selfLink": {
                                    "href": "http://apis.metamac.org/metamac-srm-web/apis/structural-resources-internal/v1.0/conceptschemes/agency01/123/01.000/concepts/2"
                                },
                                "name": {
                                    "text": [
                                        {
                                            "value": "2 en Español",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "kind": "structuralResources#concept"
                            },
                            {
                                "id": "3",
                                "urn": "urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=agency01:123(01.000).3",
                                "selfLink": {
                                    "href": "http://apis.metamac.org/metamac-srm-web/apis/structural-resources-internal/v1.0/conceptschemes/agency01/123/01.000/concepts/3"
                                },
                                "name": {
                                    "text": [
                                        {
                                            "value": "3 en Español",
                                            "lang": "es"
                                        }
                                    ]
                                },
                                "kind": "structuralResources#concept"
                            }
                        ],
                        "total": 3
                    }
                },
                {
                    "id": "at7",
                    "name": {
                        "text": [
                            {
                                "value": "at7-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "dimension": [
                            {
                                "dimensionId": "GEO_DIM"
                            },
                            {
                                "dimensionId": "TIME_PERIOD"
                            },
                            {
                                "dimensionId": "measure01"
                            },
                            {
                                "dimensionId": "dim01"
                            }
                        ],
                        "total": 4
                    }
                },
                {
                    "id": "at8",
                    "name": {
                        "text": [
                            {
                                "value": "at8-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "dimension": [
                            {
                                "dimensionId": "GEO_DIM"
                            },
                            {
                                "dimensionId": "TIME_PERIOD"
                            }
                        ],
                        "total": 2
                    }
                },
                {
                    "id": "at9",
                    "name": {
                        "text": [
                            {
                                "value": "at9-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "dimension": [
                            {
                                "dimensionId": "GEO_DIM"
                            },
                            {
                                "dimensionId": "TIME_PERIOD"
                            },
                            {
                                "dimensionId": "dim01"
                            }
                        ],
                        "total": 3
                    }
                },
                {
                    "id": "at10",
                    "name": {
                        "text": [
                            {
                                "value": "at10-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "PRIMARY_MEASURE"
                },
                {
                    "id": "at11",
                    "name": {
                        "text": [
                            {
                                "value": "at11-concept01 en Español",
                                "lang": "es"
                            }
                        ]
                    },
                    "attachmentLevel": "PRIMARY_MEASURE"
                },
                {
                    "id": "at12",
                    "name": {
                        "text": [{
                            "lang": "es",
                            "value": "at12-concept01 en Español"
                        }]
                    },
                    "attachmentLevel": "DIMENSION",
                    "dimensions": {
                        "total": "2",
                        "dimension": [
                            { "dimensionId": "TIME_PERIOD" },
                            { "dimensionId": "DESTINO_ALOJAMIENTO" }
                        ]
                    },
                    "attributeValues": {
                        "value": [
                            {
                                "id": "T1_FUERTEVENTURA",
                                "name": {
                                    "text": [
                                        {
                                            "value": "Enumerado t1 fuerteventura",
                                            "lang": "es"
                                        }
                                    ]
                                }
                            }
                        ],
                        "total": 1
                    }
                }
            ],
            "total": 12
        },
    },
    "kind": "statisticalResources#dataset"
};