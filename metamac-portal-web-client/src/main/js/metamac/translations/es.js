I18n.translations || (I18n.translations = {});

I18n.translations.es = {

    number: {
        format: {
            separator: ",", /* Decimal */
            delimiter: ".", /* Thousands */
            strip_insignificant_zeros: false
        }
    },
    filter: {
        button: {
            edit: "Cambiar selección",
            info: "Información",
            table: "Tabla de datos",
            column: "Gráfico de columnas",
            bar: "Gráfico de barras",
            line: "Gráfico de líneas",
            map: "Mapa",
            mapbubble: "Mapa de símbolos",
            fullscreen: "Pantalla completa",
            helpUrl: "Ayuda",
            share: "Compartir",
            download: "Descarga",
            save: "Guardar",
            accept: "Aceptar",
            cancel: "Cancelar",
            selectAll: "Marcar",
            deselectAll: "Desmarcar",
            reverseOrder: "Invertir orden",
            close: "Cerrar",
            visualize: "Consultar",
            embed: "Widget",
            disabledFeature: {
                internalPortal: "Esta característica está desactivada en el visualizador interno"
            }
        },
        download: {
            selection: "Descargar selección",
            all: "Descargar todo",
            excel: {
                disabled: "Este recurso no se puede descargar como XLSX porque excede el número de observaciones para este formato. Por favor, elija otra opción."
            },
            modal: {
                title: "Información de descarga"
            },
            attributes: {
                modal: {
                    title: "Incluir atributos",
                    question: "¿Desea incluir los atributos en la descarga?"
                }
            }
        },
        share: {
            permanent: "Enlace permanente:"
        },
        embed: {
            instructions: "Selecciona, copia y pega este código en tu página"
        },
        save: {
            button: {
                submit: "Guardar",
            },
            label: {
                name: "Nombre de la consulta personalizada",
                notes: "Notas"
            },
            modal: {
                title: "Guardar consulta personalizada",
                success: "La consulta personalizada se ha guardado correctamente",
                failure: "Ha habido un problema guardando la consulta personalizada"
            }
        },
        text: {
            fixedDimensions: "Valores fijados",
            leftDimensions: "Filas",
            topDimensions: "Columnas",
            fixedDimensionX: "Dimensión fija",
            horizontalAxis: "Eje horizontal",
            columns: "Columnas",
            bars: "Barras",
            lines: "Lineas",
            sectors: "Sectores",
            map: "Territorios",
            mapbubble: "Territorios",
            "for": "Para"
        },
        sidebar: {
            ignorable: {
                null: 'Ver categorías con celdas en blanco',
                zero: 'Ver categorías con celdas en cero'
            },
            info: {
                title: "Info"
            },
            filter: {
                title: "Filtrar",
                search: "Buscar"
            },
            order: {
                title: "Ordenar",
                info: {
                    fixed: "",
                    left: "",
                    top: ""
                },
                table: {
                    fixed: "Fijadas",
                    left: "Filas",
                    top: "Columnas"
                },
                column: {
                    fixed: "Fijadas",
                    left: "Eje X",
                    axisy: "Eje Y",
                    top: "Columnas"
                },
                bar: {
                    fixed: "Fijadas",
                    left: "Eje Y",
                    axisy: "Eje X",
                    top: "Barras"
                },
                line: {
                    fixed: "Fijadas",
                    left: "Eje X",
                    axisy: "Eje Y",
                    top: "Lineas"
                },
                map: {
                    fixed: "Fijadas",
                    left: "Territorios"
                },
                mapbubble: {
                    fixed: "Fijadas",
                    left: "Territorios"
                }

            }
        },
        selector: {
            level: {
                template: "Nivel {{level}}",
                all: "Todos"
            },
            temporal: {
                YEARLY: "Anual",
                BIYEARLY: "Semestral",
                FOUR_MONTHLY: "Cuatrimestral",
                QUARTERLY: "Trimestral",
                MONTHLY: "Mensual",
                WEEKLY: "Semanal",
                DAILY: "Diarios",
                HOURLY: "Por horas",
            }
        },
        sort: {
            options: {
                OBSERVATION: "Por valor",
                REPRESENTATION: "Por categoría"
            }
        }
    },
    ve: {
        map: {
            nomap: "Mapa no disponible"
        },
        mapbubble: {
            nomap: "Mapa no disponible"
        },
        noSelection: "Debe seleccionar al menos una categoría en cada dimensión",

        selectAtLeastTwoItems: "Debes seleccionar al menos dos valores en el mismo nivel",

        loading: "Cargando datos..."
    },

    entity: {
        dataset: {
            title: "Título",
            description: "Descripción",
            subtitle: "Subtítulo",
            abstract: "Resumen",
            measureDimensionCoverageConcepts: "Conceptos que forman el cubrimiento de la unidad de medidad",
            statisticalOperation: "Operación estadística",
            validFrom: "Válido desde",
            validTo: "Válido hasta",
            dateStart: "Periodo inicial",
            dateEnd: "Periodo final",
            version: "Número de versión",
            versionRationale: {
                title: "Motivo del cambio",
                enum: {
                    MAJOR_CATEGORIES: "Mayor: Categorias",
                    MAJOR_ESTIMATORS: "Mayor: Estimadores",
                    MAJOR_NEW_RESOURCE: "Mayor: nuevo recurso",
                    MAJOR_OTHER: "Mayor: Otros",
                    MAJOR_VARIABLES: "Mayor: Variables",
                    MINOR_DATA_UPDATE: "Menor: Actualización de datos",
                    MINOR_ERRATA: "Menor: Erratas",
                    MINOR_METADATA: "Menor: Metadatos",
                    MINOR_OTHER: "Menor: Otros",
                    MINOR_SERIES_UPDATE: "Menor: Actualización de serie"
                }
            },
            replacesVersion: "Reemplaza versión",
            isReplacedByVersion: "Es reemplazado por versión",
            publishers: "Publicadores",
            contributors: "Contribuidores de publicación",
            mediators: "Mediadores",
            replaces: "Reemplaza a",
            isReplacedBy: "Es reemplazado por",
            relatedResources: {
                title: "Recursos relacionados",
                multidataset: "Relacionados con el multidataset",
            },
            rightsHolder: "Titular de los derechos",
            copyrightDate: "Fecha de copyright",
            license: "Licencia",
            nolicense: "Licencia no disponible",
            accessRights: "Derechos de acceso",
            subjectAreas: "Áreas",
            formatExtentObservations: "Tamaño de la tabla",
            lastUpdate: "Fecha de la última actualización",
            dateNextUpdate: "Fecha de próxima actualización",
            updateFrequency: "Frecuencia de actualización",
            statisticOfficiality: "Oficialidad estadística",
            bibliographicCitation: "Citación bibliográfica",
            dataProviders: "Proveedores de datos",
            dataProviderAnnotations: "Observaciones asociadas a los proveedores de datos",
            measureConcepts: {
                title: "Qué miden los datos",
                annotations: "Notas generales"
            },

            section: {
                descriptors: "Descriptores de la tabla",
                validity: "Validez de los datos",
                periods: "Periodos de referencia",
                dimensions: "Respecto a qué se miden los datos",
                datasetAttributes: "Notas de la tabla",
                version: "Versionado y actualización de los datos",
                reuse: "Reutilización e información para desarrolladores"
            },

            language: "Idioma",

            apiDocumentationUrl: "Acceso a la documentación de la API",
            apiUrl: "Acceso al recurso en la API",
            selectionApiUrl: "Acceso a la selección actual en la API",

            nextVersion: {
                title: "Próxima actualización",
                enum: {
                    NON_SCHEDULED_UPDATE: "Sin actualización programada",
                    NO_UPDATES: "Sin actualizaciones",
                    SCHEDULED_UPDATE: "Actualización programada"
                }
            }
        },
        kind: {
            types: {
                collection: "Publicaciones",
                dataset: "Datasets",
                query: "Consultas",
                multidataset: "Multidatasets"
            }
        },
        observation: {
            measure: {
                title: 'Identificación del dato',
                data: 'Dato'
            },
            attributes: {
                title: 'Notas de la observación',
                primaryMeasure: 'Atributos a nivel de observación',
                combinatedDimensions: 'Atributos a nivel de dimensión',
            }
        },
        category: {
            measure: {
                unit: 'Unidad de medida',
                multiplier: 'Multiplicador de la unidad',
                unitMeasure: '{{multiplier}} de {{unit}}',
                unitMeasureStartsWithVowel: '{{multiplier}} de {{unit}}',
            },
            attributes: {
                title: 'Notas de categoría'
            }
        },
        granularity: {
            temporal: {
                enum: {
                    YEARLY: "Anual",
                    BIYEARLY: "Bianual",
                    QUARTERLY: "Trimestral",
                    FOUR_MONTHLY: "Cuatrimestral",
                    MONTHLY: "Mensual",
                    WEEKLY: "Semanal",
                    DAILY: "Diario",
                    HOURLY: "Cada hora"
                }
            }
        }
    },
    date: {
        formats: {
            "default": "%d/%m/%Y",
            "short": "%d de %B",
            "long": "%d de %B de %Y"
        },
        day_names: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        abbr_day_names: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        month_names: [null, "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        abbr_month_names: [null, "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        meridian: ["am", "pm"]
    },
    indicator: {
        dimension: {
            name: {
                TIME: "Períodos",
                MEASURE: "Medidas",
                GEOGRAPHICAL: "Localización geográfica"
            }
        }
    },
    login: {
        button: {
            submit: "Iniciar sesión",
            register: "Registrarse"
        },
        label: {
            email: "Correo electrónico",
            password: "Contraseña"
        },
        modal: {
            title: "Usuario",
            success: "Ha iniciado sesión con éxito",
            failure: "Ha habido un problema iniciando sesión"
        },
        error: {
            client: "El correo electrónico o la contraseña no son válidos.",
            server: "Ha habido un problema iniciando sesión. Inténtelo de nuevo más tarde."
        }
    },
    modal: {
        confirmation: {
            button: {
                confirm: "Sí",
                reject: "No"
            }
        },
        information: {
            loginRequired: {
                title: "Operación no válida",
                message: "La operación que quiere realizar requiere que inicie sesión primero. ¿Desea iniciar sesión?"
            }
        },
        permalinkConfig: {
            button: {
                submit: "Guardar",
            },
            label: {
                version: {
                    group: "Datos",
                    last: "Actualizar los datos con posibles correcciones o modificaciones de los mismos",
                    current: "Mostrar siempre los datos actuales",
                },
                data: {
                    group: "Datos",
                    update: "Actualizar los datos con nuevos periodos",
                    selected: "Fijar los datos al periodo seleccionado",
                },
                dataReview: {
                    group: "Revisiones de datos",
                    update: "Actualizar con las revisiones de datos"
                },
                periods: {
                    group: "Periodos",
                    quantity: "Actualizar con los últimos n periodos:",
                    date: "Actualizar a partir del siguiente periodo:",
                    all: "Actualizar con todos los periodos",
                }
            },
            error: {
                quantity: "El campo númerico del apartado 'Actualizar con los últimos n periodos' debe ser un número entero positivo mayor o igual a uno.",
                periods: "Debe seleccionar una de las opciones del apartado 'Periodos'."
            },
            info: {
                noTemporalDimension: "Este recurso no permite elegir el periodo porque no tiene una dimensión temporal.",
                noVersionUpdate: "Este recurso no permite consultar versiones anteriores."
            }
        },
        embedConfig: {
            label: {
                title: "Título"
            }
        }
    },
    captcha: {
        button: {
            text: "Enviar"
        },
        label: {
            text: "Escriba el valor de la imagen mostrada encima"
        }
    },
    exception: {
        resources: {
            dataset: {
                empty_data: "El dataset no tiene datos"
            },
            indicators: {
                no_representations: "La dimensión {{error}} no tiene representaciones"
            }
        },
        statistical_resources: {
            dataset: { 
                not_found: "El dataset no ha sido encontrado"
            }
        },
        common: {
            unknown: "Error desconocido"
        }
    }
    
};