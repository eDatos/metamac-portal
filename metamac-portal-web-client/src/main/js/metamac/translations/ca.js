I18n.translations || (I18n.translations = {});

I18n.translations.ca = {

    number: {
        format: {
            separator: ",", /* Decimal */
            delimiter: ".", /* Thousands */
            strip_insignificant_zeros: false
        }
    },
    filter: {
        button: {
            edit: "Canviar selecció",
            info: "Informació",
            table: "Taula de dades",
            column: "Gràfic de columnes",
            line: "Gràfic de línies",
            map: "Mapa",
            mapbubble: "Mapa de símbols",
            fullscreen: "Pantalla completa",
            helpUrl: "Ajuda",
            share: "Compartir",
            download: "Descàrrega",
            save: "Guardar",
            accept: "Acceptar",
            cancel: "Cancel·lar",
            selectAll: "Marcar",
            deselectAll: "Desmarcar",
            reverseOrder: "Invertir ordre",
            close: "Tancar",
            visualize: "Consultar",
            embed: "Widget",
            disabledFeature: {
                internalPortal: "Aquesta característica està desactivada en el visualitzador intern"
            }
        },
        download: {
            selection: "Descarregar selecció",
            all: "Descarregar tot",
            modal: {
                title: "Informació de descàrrega"
            },
            attributes: {
                modal: {
                    title: "Incloure atributs",
                    question: "Voleu incloure els atributs a la descàrrega?"
                }
            }
        },
        share: {
            permanent: "Enllaç permanent:"
        },
        embed: {
            instructions: "Selecciona, còpia i pega aquest codi en la teva pàgina"
        },
        save: {
            button: {
                submit: "Guardar",
            },
            label: {
                name: "Nom de la consulta personalitzada",
                notes: "Notes"
            },
            modal: {
                title: "Guardar consulta personalitzada",
                success: "La consulta personalitzada s'ha guardat correctament",
                failure: "Hi ha hagut un problema en guardar la consulta personalitzada"
            }
        },
        text: {
            fixedDimensions: "Valors fixats",
            leftDimensions: "Files",
            topDimensions: "Columnes",
            fixedDimensionX: "Dimensió fixa",
            horizontalAxis: "Eix horitzontal",
            columns: "Columnes",
            lines: "Lineas",
            sectors: "Sectors",
            map: "Territoris",
            mapbubble: "Territoris",
            "for": "Per a"
        },
        sidebar: {
            ignorable: {
                null: 'Veure categories amb cel·les en blanc',
                zero: 'Veure categories amb cel·les en zero'
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
                    fixed: "Fixades",
                    left: "Files",
                    top: "Columnes"
                },
                column: {
                    fixed: "Fixades",
                    left: "Eix X",
                    axisy: "Eix I",
                    top: "Columnes"
                },
                line: {
                    fixed: "Fixades",
                    left: "Eix X",
                    axisy: "Eix Y",
                    top: "Línies"
                },
                map: {
                    fixed: "Fixades",
                    left: "Territoris"
                },
                mapbubble: {
                    fixed: "Fixades",
                    left: "Territoris"
                }

            }
        },
        selector: {
            level: "Nivell {{level}}"
        },
        sort: {
            options: {
                OBSERVATION: "Per valor",
                REPRESENTATION: "Per categoria"
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
        noSelection: "Seleccioni almenys una categoria en cada dimensió",
        loading: "Carregant dades..."
    },

    entity: {
        dataset: {
            title: "Títol",
            subtitle: "Subtítol",
            abstract: "Resum",
            measureDimensionCoverageConcepts: "Conceptes que formen el cobriment de la unitat de mesura",
            statisticalOperation: "Operació estadística",
            validFrom: "Vàlid des de",
            validTo: "Vàlid fins a",
            dateStart: "Període inicial",
            dateEnd: "Període final",
            version: "Número de versió",
            versionRationale: {
                title: "Motiu del canvi",
                enum: {
                    MAJOR_CATEGORIES: "Major: Categories",
                    MAJOR_ESTIMATORS: "Major: Estimadors",
                    MAJOR_NEW_RESOURCE: "Major: nou recurs",
                    MAJOR_OTHER: "Major: Altres",
                    MAJOR_VARIABLES: "Major: Variables",
                    MINOR_DATA_UPDATE: "Menor: Actualització de dades",
                    MINOR_ERRATA: "Menor: Errates",
                    MINOR_METADATA: "Menor: Metadades",
                    MINOR_OTHER: "Menor: Altres",
                    MINOR_SERIES_UPDATE: "Menor: Actualització de sèrie"
                }
            },
            replacesVersion: "Reemplaça versió",
            isReplacedByVersion: "És reemplaçat per versió",
            publishers: "Publicadors",
            contributors: "Contribuïdors de publicació",
            mediators: "Mediadors",
            replaces: "Reemplaça ",
            isReplacedBy: "És reemplaçat per",
            rightsHolder: "Titular dels drets",
            copyrightDate: "Data de copyright",
            license: "Llicència",
            nolicense: "Llicència no disponible",
            accessRights: "Drets d'accés",
            subjectAreas: "Àrees",
            formatExtentObservations: "Grandària de la taula",
            lastUpdate: "Data de l'última actualització",
            dateNextUpdate: "Data de pròxima actualització",
            updateFrequency: "Freqüència d'actualització",
            statisticOfficiality: "Oficialitat estadística",
            bibliographicCitation: "Citació bibliogràfica",
            measureConcepts: {
                title: "Què mesuren les dades",
                annotations: "Notes generals"
            },

            section: {
                descriptors: "Descriptors de la taula",
                validity: "Validesa de les dades",
                periods: "Períodes de referència",
                dimensions: "Respecte a què es mesuren les dades",
                datasetAttributes: "Notes de la taula",
                version: "Versionat i actualització de les dades",
                reuse: "Reutilització i informació per a desenvolupadors"
            },

            language: "Idioma",

            apiDocumentationUrl: "Accés a la documentació de l'API",
            apiUrl: "Accés al recurs en l'API",
            selectionApiUrl: "Accés a la selecció actual en l'API",

            nextVersion: {
                title: "Pròxima actualització",
                enum: {
                    NON_SCHEDULED_UPDATE: "Sense actualització programada",
                    NO_UPDATES: "Sense actualitzacions",
                    SCHEDULED_UPDATE: "Actualització programada"
                }
            }
        },
        observation: {
            measure: {
                title: 'Identificació de la dada',
                data: 'Dada'
            },
            attributes: {
                title: "Notes de l'observació",
                primaryMeasure: "Atributs a nivell d'observació",
                combinatedDimensions: 'Atributs a nivell de dimensió',
            }
        },
        category: {
            measure: {
                unit: 'Unitat de mesura'
            },
            attributes: {
                title: 'Atributs de la categoria'
            }
        },
        granularity: {
            temporal: {
                enum: {
                    YEARLY: "Anual",
                    BIYEARLY: "Bianual",
                    QUARTERLY: "Trimestral",
                    FOUR_MONTHLY: "Quadrimestral",
                    MONTHLY: "Mensual",
                    WEEKLY: "Setmanal",
                    DAILY: "Diari",
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
        day_names: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"],
        abbr_day_names: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"],
        month_names: [null, "Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
        abbr_month_names: [null, "Gen", "Febr", "Març", "Abr", "Maig", "Juny", "Jul", "Ag", "Set", "Oct", "Nov", "Des"],
        meridian: ["am", "pm"]


    },
    indicator: {
        dimension: {
            name: {
                TIME: "Períodes",
                MEASURE: "Mesures",
                GEOGRAPHICAL: "Localització geogràfica"
            }
        }
    },
    login: {
        button: {
            submit: "Iniciar sessió",
            register: "Registrar-se"
        },
        label: {
            email: "Correu electrònic",
            password: "Contrasenya"
        },
        modal: {
            title: "Usuari",
            success: "Ha iniciat sessió amb èxit",
            failure: "Hi ha hagut un problema iniciant sessió"
        },
        error: {
            client: "El correu electrònic o la contrasenya no són vàlids",
            server: "Hi ha hagut un problema iniciant sessió. Intente-ho de nou més tard"
        }
    },
    logout: {
        modal: {
            title: "Tancar sessió",
            question: "Està segur que vol tancar sessió?"
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
                title: "Operació no vàlida",
                message: "L'operació que vol realitzar requereix que inicie sessió primer"
            }
        },
        permalinkConfig: {
            button: {
                submit: "Guardar",
            },
            label: {
                version: {
                    group: "Versió",
                    last: "Darrera versió",
                    current: "Versió actual",
                },
                data: {
                    group: "Dades",
                    quantity: "Els darrers",
                    date: "A partir de",
                }
            },
            error: {
                quantity: "El camp númerico de l'apartat 'Dades' ha de ser un nombre enter positiu major o igual a un."
            }
        }
    },
    user: {
        header: {
            userAreaTooltip: "Àrea de l'usuari",
            loginTooltip: "Iniciar sessió",
            logoutTooltip: "Tancar sessió"
        }
    },
    captcha: {
        button: {
            text: "Enviar"
        },
        label: {
            text: "Escriviu el valor de la imatge mostrada damunt"
        }
    }
};