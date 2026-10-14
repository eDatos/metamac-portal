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
            selection: "Selecció",
            info: "Informació",
            table: "Taula",
            column: "Columnes",
            bar: "Barres",
            line: "Línies",
            charts: "Gràfics",
            maps: "Mapes",
            map: "Mapa de coropletes",
            mapbubble: "Mapa de símbols",
            fullscreen: "Maximitzar",
            minimizedScreen: "Minimitzar",
            helpUrl: "Ajuda",
            share: "Compartir",
            download: "Descarregar",
            apiEndpoints: "Consultes a l'API",
            save: "Guardar",
            accept: "Acceptar",
            cancel: "Cancel·lar",
            selectAll: "Marcar",
            deselectAll: "Desmarcar",
            reverseOrder: "Invertir ordre",
            close: "Tancar",
            visualize: "Consultar",
            embed: "Giny (Widget)",
            disabledFeature: {
                internalPortal: "Aquesta característica està desactivada en el visualitzador intern"
            }
        },
        download: {
            selection: "Descarregar selecció",
            all: "Descarregar tot",
            selectionDisabled: "S'ha deshabilitat la descàrrega de la selecció perquè hi ha molts elements seleccionats en les dimensions. Per rehabilitar-la deseleccioneu alguns elements.",
            modal: {
                title: "Informació de descàrrega"
            },
            excel: {
                disabled: "Aquest recurs no es pot descarregar com XLSX perquè excedeix el nombre d'observacions per a aquest format."
            },
            attributes: {
                modal: {
                    title: "DESCARREGAR - Opcions",
                    question: "Incloure els atributs a la descàrrega"
                }
            },
            options: {
                title: "Propietats d'exportació",
                download: "Descarregar"
            },
            decimalSeparator: {
                title: "Separador decimal",
                comma: "Coma",
                dot: "Punt"
            },
            menu: {
                xlsx: "Format XLSX",
                tsv: "Format TSV",
                px: "Format PX",
                jsonstat: "Format JSONSTAT",
                svg: "Format SVG",
                png: "Format PNG",
                pdf: "Format PDF"
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
            bars: "Barres",
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
                bar: {
                    fixed: "Fixades",
                    left: "Eix Y",
                    axisy: "Eix X",
                    top: "Barres"
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
            level: {
                template: "Nivell {{level}}",
                all: "Tots"
            },
            temporal: {
                YEARLY: "Anual",
                BIYEARLY: "Semestral",
                FOUR_MONTHLY: "Quatrimestral",
                QUARTERLY: "Trimestral",
                MONTHLY: "Mensual",
                WEEKLY: "Setmanal",
                DAILY: "Diaris",
                HOURLY: "Per hores",
            }
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
        noSelection: "Seleccioni almenys una categoria en cada dimensió.",
        selectAtLeastTwoItems: "Ha de seleccionar almenys dos valors de la mateixa granularitat geogràfica",
        noShapesAvailable: "No hi ha mapa disponible per als valors seleccionats",
        loading: "Carregant dades..."
    },

    entity: {
        dataset: {
            title: "Títol",
            description: "Descripció",
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
            relatedResources: {
                title: "Recursos relacionats",
                multidataset: "Relacionats amb el multidataset"
            },
            rightsHolder: "Titular dels drets",
            copyrightDate: "Data de copyright",
            license: "Llicència",
            nolicense: "Llicència no disponible",
            accessRights: "Drets d'accés",
            subjectAreas: "Àrees",
            formatExtentObservations: "Grandària de la taula",
            lastUpdate: "Data de l'última actualització",
            dateNextUpdate: "Data de pròxima actualització",
            header: {
                lastUpdate: "Última actualització: {{dateLastUpdate}}",
                nextUpdate: "Pròxima actualització: {{dateNextUpdate}}",
            },
            updateFrequency: "Freqüència d'actualització",
            statisticOfficiality: "Oficialitat estadística",
            bibliographicCitation: "Citació bibliogràfica",
            dataProviders: "Proveïdors de dades",
            dataProviderAnnotations: "Observacions associades als proveïdors de dades",
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

            seeConcept: {
                button: "Veure concepte",
            },
            seeRelatedResource: {
                button: "Veure classificació"
            },

            language: "Idioma",

            apiDocumentationUrl: "Accés a la documentació de l'API",
            apiUrl: {
                title: "Accés al recurs en l'API",
                apiEndpoints: "El recurs es pot obtenir en els formats següents: {{formats}}. Per a construir la cridad a l'API n'hi ha prou amb afegir el format al final de la URL, per exemple, per a construir la crida del format {{formatExample}} es faria de la manera següent: URL.{{formatExampleLowercase}}"
            },
            selectionApiUrl: {
                title: "Accés a la selecció actual en l'API",
                apiEndpoints: "La selecció també es pot obtenir en diferents formats ({{formats}}). En aquest cas, per a construir la cridad a l'API s'ha de tenir en compte que el format s'ha d'indicar abans de passar els paràmetres, per exemple: URL.{{formatExampleLowercase}}?PARAMETROS"
            },
            nextVersion: {
                title: "Pròxima actualització",
                enum: {
                    NON_SCHEDULED_UPDATE: "Sense actualització programada",
                    NO_UPDATES: "Sense actualitzacions",
                    SCHEDULED_UPDATE: "Actualització programada"
                }
            }
        },
        kind: {
            types: {
                collection: "Publicacions",
                dataset: "Datasets",
                query: "Consultes",
                multidataset: "Multidatasets"
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
                unit: 'Unitat de mesura',
                multiplier: 'Multiplicador de la unitat',
                unitMeasure: '{{multiplier}} de {{unit}}',
                unitMeasureStartsWithVowel: '{{multiplier}} d\'{{unit}}',
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
    subscribe: {
        button: {
            state: {
                unsubscribed: "Subscriu-te",
                subscribed: "Subscrit"
            },
            tooltip: {
                title: "Subscriu-te",
                text: "Subscriviu-vos per rebre notificacions quan es publiquin actualitzacions de l'activitat estadística a què pertany aquesta col·lecció."
            }
        },
        modal: {
            confirmation: {
                title: "Subscripció",
                message: "Voleu subscriure-us a les notificacions de l'activitat estadística a què pertany aquesta col·lecció?"
            },
            result: {
                title: "Subscripció",
                success: "Us heu subscrit correctament.",
                error: "No s'ha pogut completar la subscripció. Intenteu-ho de nou més tard."
            }
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
                message: "L'operació que vol realitzar requereix que iniciï sessió primer. Desitja iniciar sessió?"
            }
        },
        permalinkConfig: {
            button: {
                submit: "Guardar",
            },
            label: {
                version: {
                    group: "Dades",
                    last: "Actualitzar les dades amb possibles correccions o modificacions",
                    current: "Mostrar sempre les dades actuals",
                },
                data: {
                    group: "Dades",
                    update: "Actualitza les dades amb nous períodes",
                    selected: "Fixa les dades al període seleccionat",
                },
                dataReview: {
                    group: "Revisions de dades",
                    update: "Actualitzar amb les revisions de dades"
                },
                periods: {
                    group: "Períodes",
                    quantity: "Actualitzar amb els darrers n períodes:",
                    date: "Actualitzar a partir del període següent:",
                    all: "Actualitzar amb tots els períodes",
                }
            },
            error: {
                quantity: "El camp númeric de l'apartat 'Actualitzar amb els darrers n períodes' ha de ser un nombre enter positiu més gran o igual a un.",
                periods: "Heu de seleccionar una de les opcions de l'apartat 'Períodes'."
            },
            info: {
                noTemporalDimension: "Aquest recurs no permet triar el període perquè no té una dimensió temporal.",
                noVersionUpdate: "Aquest recurs no permet consultar versions anteriors."
            }
        },
        embedConfig: {
            button: {
                submit: "Veure codi",
            },
            label: {
                title: "Títol"
            }
        },
        shareConfig: {
            button: {
                submit: "Veure l'enllaç",
            },
        },
        saveConfig: {
            button: {
                submit: "Continuar",
            },
        }
    },
    captcha: {
        button: {
            text: "Enviar"
        },
        label: {
            text: "Escriviu el valor de la imatge mostrada damunt"
        }
    },
    exception: {
        resources: {
            dataset: {
                empty_data: "El dataset no té dades"
            },
            indicators: {
                no_representations: "La dimensió {{error}} no té representacions"
            }
        },
        statistical_resources: {
            dataset: { 
                not_found: "El dataset no s'ha trobat"
            }
        },
        common: {
            unknown: "Error desconegut"
        }
    },
    operations: {
        empty: "No hi ha operacions disponibles.",
        error: "No ha estat possible carregar el llistat d'operacions."
    }
};
